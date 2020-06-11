<template>
  <div>
    <div class="header-version align-items-center">
      <img src="../assets/logo3.png" width="42" height="36"/>
      <div>
        <div class="header-version-text text-name">{{ appName }}</div>
        <div class="header-version-text">v{{ version }}</div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        version: '2.0.0',
        appName: '盘古电影'
      }
    },
    created () {

    }

  }
</script>
<style lang="less" scoped>
  .header-version-text {
    margin-left: 10px;
    width: 50px;
    color: #555555;
    line-height: 1.3;
    font-size: 16px;
  }
  .text-name {
    font-size: 12px;
  }

  .el-main {
    padding: 0 !important;
  }

  .el-header {
    height: 80px !important;

    .header {
      height: 100%;
    }
  }

  .title {
    font-size: 18px;
    color: #555555;
  }

  .align-items-center {
    display: flex;
    align-items: center;
  }

  .el-checkbox {
    font-weight: normal !important;
  }

  .el-header {
    border-bottom: 1px solid #e6e6e6;
  }

  .scroll-container {
    height: 100%;

    .el-scrollbar {
      height: 100%;
    }

    .el-scrollbar__wrap {
      overflow-x: hidden !important;
    }

    .el-scrollbar__view {
      height: auto !important;
    }
  }

  .el-dialog__header {
    padding-bottom: 0;
  }
</style>
