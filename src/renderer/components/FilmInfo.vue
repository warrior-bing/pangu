<template>
  <div class="hasdata" v-if="data.length != 0">
    <List item-layout="vertical">
      <ListItem v-for="(item, index) in data" :key="item.title">
        <ListItemMeta :avatar="item.avatar" :title="item.title" :description="item.mainperson" />
        {{ item.desc }}
        <template slot="action">
          <Button @click="lookDownLoadUrl(index)">查看下载链接</Button>
        </template>
        <template slot="extra">
          <img :src="item.headImg" onerror="this.onerror=null; this.src='http://aiads-file.oss-cn-beijing.aliyuncs.com/FE/fe-pangu_default1.jpg'" style="width: 192px;height: 280px">
        </template>
      </ListItem>
    </List>
    <Modal
      title="下载链接"
      v-model="showModal"
      :scrollable="false"
      :footer-hide="true"
      :closable="false">
      <Row class="expand-row">
        <Col span="24">
          <div style="height: 250px; overflow-y: scroll;">
            <p class="expand-value" v-for="(item, index) in downLoadUrls" :key="index">
            <span>{{ item }}</span>
            <a class="copy" href="#" @click="handleCopyMagnet(item)">复制链接</a>
          </p>
          </div>
        </Col>
      </Row>
    </Modal>
    <Spin fix v-if="loading">
      <div class="spinner"></div>
      <p style="font-size: 14px">搜索中...</p>
    </Spin>
  </div>
  <div v-else class="nodata">
    <Icon type="md-appstore" /><span>试试搜索吧</span>
    <Spin fix v-if="loading">
      <div class="spinner"></div>
      <p style="font-size: 14px">搜索中...</p>
    </Spin>
  </div>
</template>

<script>
  import HeaderVersion from './HeaderVersion'

  export default {
    props: ['data', 'loading'],
    components: {
      HeaderVersion
    },
    data () {
      return {
        showModal: false,
        downLoadUrls: []
      }
    },

    methods: {
      lookDownLoadUrl (index) {
        this.downLoadUrls = this.data[index].dowmloadUrl
        this.showModal = true
      },

      handleCopyMagnet (url) {
        let _this = this
        let lastUrl = Array.isArray(url) ? url.join(',') : url
        _this.$copyText(lastUrl).then((e) => {
          _this.$message.success({
            content: '复制成功',
            closable: true
          })
        })
      }
    }

  }
</script>

<style lang="less" scoped>

  /deep/ .ivu-spin-fix .ivu-spin-main {
    top: 100px;
  }
  .hasdata {
    position: relative;
  }
  .nodata {
    position: relative;
    display: flex;
    height: 200px;
    justify-content: center;
    align-items: center;
    width: 100%;
    font-size: 20px;
  }
  .spinner {
    width: 60px;
    height: 60px;
    
    background-color: lightblue;
    margin: 10px auto;
    animation: rotateplane 1.2s infinite ease-in-out;
    animation: rotateplane 1.2s infinite ease-in-out;
  }
 
  @keyframes rotateplane {
    0% { transform: perspective(120px) }
    50% { transform: perspective(120px) rotateY(180deg) }
    100% { transform: perspective(120px) rotateY(180deg)  rotateX(180deg) }
  }
  
  @keyframes rotateplane {
    0% {
      transform: perspective(120px) rotateX(0deg) rotateY(0deg);
      transform: perspective(120px) rotateX(0deg) rotateY(0deg);
    } 50% {
      transform: perspective(120px) rotateX(-180.1deg) rotateY(0deg);
      transform: perspective(120px) rotateX(-180.1deg) rotateY(0deg);
    } 100% {
      transform: perspective(120px) rotateX(-180deg) rotateY(-179.9deg);
      transform: perspective(120px) rotateX(-180deg) rotateY(-179.9deg);
    }
  }
</style>
