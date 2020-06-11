<template>
  <div id="panguApp" class="wrapper">
    <Layout>
      <pager-header :dblclick="handleClickMaxWindow" :weather="weather">
        <!--搜索框与排序菜单-->
        <div slot="center">
          <Input v-model="filmName" search enter-button="搜索" @on-search="searchHandle" placeholder="请输入影视剧名字...">
            <Select v-model="channel" slot="prepend" style="width: 80px">
              <Option v-for="item in channelList" :value="item.value" :key="item.value">{{ item.name }}</Option>
            </Select>
          </Input>
        </div>
      </pager-header>
      <div class="content">
        <div class="content-left">
          <ul>
            <li
              v-for="(item, index) in sourceList"
              :key="index"
              :class="activeIndex === index ? 'active' : ''"
              @click="changeSourceHandle(index)">{{item.name}}</li>
          </ul>
        </div>
        <div class="content-right">
          <Alert show-icon>
            <Icon type="ios-bulb-outline" slot="icon"></Icon>
            <template slot="desc">{{sentence}}</template>
          </Alert>
          <FilmInfo :data="data" :loading="loading"></FilmInfo>
        </div>
      </div>
    </Layout>
  </div>
</template>

<script>
  import { ipcRenderer } from 'electron'
  import PagerHeader from '../components/PagerHeader'
  import FilmInfo from '@/components/FilmInfo'

  export default {
    name: 'home-page',
    components: { PagerHeader, FilmInfo },
    data () {
      return {
        filmName: '',
        sentence: '',
        weather: '',
        loading: false,
        data: [],
        channelList: [
          {
            name: '电影',
            value: 1
          },
          {
            name: '电视剧',
            value: 2
          }
          // {
          //   name: '综艺',
          //   value: 3
          // }
        ],
        channel: 1,
        sourceList: [
          {
            name: '热门影视',
            code: 'hot'
          },
          {
            name: '电影天堂',
            code: 'dytt'
          }
        ],
        source: 'hot',
        activeIndex: 0
      }
    },

    mounted () {
      this.GetThinkInfo()
      this.GetWeatherInfo()
    },

    methods: {
      handleClickMaxWindow () {
        ipcRenderer.send('window-max')
      },

      changeSourceHandle (index) {
        this.activeIndex = index
        this.source = this.sourceList[index].code
      },

      GetThinkInfo () {
        this.$remoteService.getOne().then(sentence => {
          this.sentence = sentence
        })
      },

      GetWeatherInfo () {
        this.$remoteService.getWeather().then(weather => {
          this.weather = weather
        })
      },

      searchHandle () {
        this.loading = true
        this.$remoteService.getMedia(this.filmName, this.channel, this.source).then(res => {
          this.data = res
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
      }
    }
  }
</script>

<style lang='less'>
  .wrapper {
    h4{
      font-size: 30px;
      width: 100%;
      text-align: center;
      margin-bottom: 20px;
    }
    .header {
      display: flex;
    }
    .content {
      // padding: 20px 50px;
      display: flex;
      margin-top: 70px;
      min-height: calc(100vh - 70px);
      .content-left {
        width: 150px;
        position: fixed;
        min-height: calc(100vh - 70px);
        border-right: 1px solid #dcdee2;
        ul > li {
          height: 50px;
          line-height: 50px;
          text-align: center;
          cursor: pointer;
        }
        .active {
          color: #2d8cf0;
          background: #f0faff;
        }
      }
      .content-right {
        flex: 1;
        margin-left: 150px;
        padding: 10px;
      }
    }
    .ivu-input-group {
      width: 400px;
    }
    .ivu-layout {
      background: #ffffff;
    }
  }
</style>
