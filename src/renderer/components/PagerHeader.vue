<template>
  <div class="pager-header" @dblclick="dblclick">
    <div class="header-left">
      <header-version></header-version>
    </div>
    <div class="header-center">
      <slot name="center"></slot>
    </div>
    <div class="header-right">
      <p>北京{{todayWeather}}</p>
      <p>{{weather.weatherTips}}</p>
    </div>
  </div>
</template>

<script>
  import HeaderVersion from './HeaderVersion'

  export default {
    name: 'page-header',
    props: ['dblclick', 'weather'],
    components: {
      HeaderVersion
    },
    data () {
      return {
      }
    },
    computed: {
      todayWeather: function () {
        return this.weather && this.weather.todayWeather && this.weather.todayWeather.replace(/<br>/g, '，')
      }
    },
    created () {

    }
  }
</script>

<style lang="less" scoped>
  .pager-header {
    display: flex;
    position: fixed;
    z-index: 100;
    width: 100%;
    height: 70px;
    padding: 20px;
    border-bottom: 1px solid #EBEBEB;
    background: #f5f7f9;
     -webkit-app-region: drag;
    &:hover {
      background: #f1f3f5;
    }

  .el-menu, .el-menu .el-submenu, /deep/ .el-menu .el-submenu__title, .el-menu .el-link {
    height: 100%;
  }


  .el-menu {
    background-color: transparent;
    border: none !important;
  }

  /deep/ .el-menu-item {
    background-color: transparent !important;
  }

  .header-left {
    display: flex;
  }

  .header-center {
    margin: 0 88px 0 30px;
    .pager-header-input {
      width: 100%;
    }

    .header-center-placeholder {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
    }
  }
}

</style>
