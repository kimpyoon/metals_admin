<template>
  <div class="container">
    <div class="tabs">
      <div class="tab-item">
        <div class="row">
          <div class="tab-item__label">总用户数：</div>
          <div class="tab-item__content">400</div>
        </div>
        <div class="row">
          <div class="tab-item__label">新增用户：</div>
          <div class="tab-item__content">100</div>
        </div>
      </div>
      <div class="tab-item">
        <div class="row">
          <div class="tab-item__label">成交订单：</div>
          <div class="tab-item__content">200</div>
        </div>
        <div class="row">
          <div class="tab-item__label">新增商家：</div>
          <div class="tab-item__content">100</div>
        </div>
      </div>
      <div class="tab-item">
        <div class="row">
          <div class="tab-item__label">申请广告：</div>
          <div class="tab-item__content">80</div>
        </div>
        <div class="row">
          <div class="tab-item__label">处理广告：</div>
          <div class="tab-item__content">80</div>
        </div>
      </div>
      <div class="tab-item">
        <div class="row">
          <div class="tab-item__label">成交总金额：</div>
          <div class="tab-item__content">800</div>
        </div>
        <div class="row" style="opacity: 0;visibility: none;">
          <div class="tab-item__label">展位符</div>
          <div class="tab-item__content">展位符</div>
        </div>
      </div>
    </div>
    <div class="dataTypeTab">
      <el-radio-group v-model="dateType" size="small">
        <el-radio-button label="1">日</el-radio-button>
        <el-radio-button label="2">月</el-radio-button>
        <el-radio-button label="3">年</el-radio-button>
      </el-radio-group>
    </div>
    <div class="charts">
      <div class="ring">
        <ve-ring :data="ringChartData" :settings="rinChartSettings" height="300px"></ve-ring>
      </div>
      <div class="line">
        <ve-line
          :data="lineChartData"
          height="300px"
          :grid="grid"
          :data-zoom="dataZoom"
          :after-config="afterConfig">
        </ve-line>
      </div>
    </div>
  </div>
</template>

<script>
import { formatDate } from '@/utils/formatDate.js'
import { formatDateTime } from '@/utils/formatDateTime.js'
import { getToken } from '@/utils/auth'
export default {
  data () {
    this.rinChartSettings = {
      radius: [70, 100],
      offsetY: 180
    }
    this.dataZoom = [
      {
        type: 'slider',
        start: 0,
        end: 50
      }
    ]
    return {
      dateType: '1',
      ringChartData: {
        columns: ['类型', '数量'],
        rows: [
          { '类型': '今日总用户数', '数量': 400 },
          { '类型': '今日新增用户', '数量': 200 },
          { '类型': '今日成交订单', '数量': 200 },
          { '类型': '今日新增商家', '数量': 100 },
          { '类型': '今日申请广告', '数量': 100 },
          { '类型': '今日处理广告', '数量': 80 },
          { '类型': '今日成交金额', '数量': 800 }
        ]
      },
      lineChartData: {
        columns: ['日期', '新增订单', '新增用户', '新增商家', '新增申请广告', '成交曲线'],
        rows: [
          { '日期': '8月1日', '新增订单': 15, '新增用户': 40, '新增商家': 8, '新增申请广告': 4, '成交曲线': 80 },
          { '日期': '8月2日', '新增订单': 12, '新增用户': 69, '新增商家': 13, '新增申请广告': 3, '成交曲线': 84 },
          { '日期': '8月3日', '新增订单': 21, '新增用户': 47, '新增商家': 20, '新增申请广告': 17, '成交曲线': 78 },
          { '日期': '8月4日', '新增订单': 41, '新增用户': 77, '新增商家': 25, '新增申请广告': 30, '成交曲线': 80 },
          { '日期': '8月5日', '新增订单': 31, '新增用户': 80, '新增商家': 44, '新增申请广告': 45, '成交曲线': 89 },
          { '日期': '8月6日', '新增订单': 71, '新增用户': 100, '新增商家': 6, '新增申请广告': 69, '成交曲线': 92 },
          { '日期': '8月7日', '新增订单': 15, '新增用户': 40, '新增商家': 8, '新增申请广告': 4, '成交曲线': 80 },
            { '日期': '8月8日', '新增订单': 12, '新增用户': 69, '新增商家': 13, '新增申请广告': 3, '成交曲线': 84 },
            { '日期': '8月9日', '新增订单': 21, '新增用户': 47, '新增商家': 20, '新增申请广告': 17, '成交曲线': 78 },
            { '日期': '8月10日', '新增订单': 41, '新增用户': 77, '新增商家': 25, '新增申请广告': 30, '成交曲线': 80 },
            { '日期': '8月11日', '新增订单': 31, '新增用户': 80, '新增商家': 44, '新增申请广告': 45, '成交曲线': 89 },
            { '日期': '8月12日', '新增订单': 71, '新增用户': 100, '新增商家': 6, '新增申请广告': 69, '成交曲线': 92 }
        ]
      },
      grid: {
        left: '0%',
        right: '0%',
        top: '26%',
        bottom: '16%',
        containLabel: true
      }
    }
  },
  filters: {
    dateFilter (val) {
      return formatDate(new Date(val))
    },
    dateTimeFilter (val) {
      return formatDateTime(new Date(val))
    }
  },
  mounted () {

  },
  methods: {
    getToken: getToken,
    afterConfig (options) {
      options.tooltip.showDelay = 500
      return options
    }
  },
  components: {

  }
}
</script>
<style scoped lang="stylus">
.container
  .tabs
    display flex
    align-items center
    .tab-item
      margin-right 20px
      flex 0 0 auto
      padding 15px
      width 200px
      border-radius 2px
      background-color #ffffff
      .row
        margin-top 10px
        display flex
        align-items flex-end
        &:first-child
          margin-top 0
      .tab-item__label
        font-size 16px
        color #303030
        line-height 1
      .tab-item__content
        font-size 20px
        color #FF9800
        line-height 1
  .dataTypeTab
    margin-top 20px
    text-align right
  .charts
    margin-top 20px
    padding 20px
    background #ffffff
    height 320px
    border-radius 2px
    display flex
    align-items center
    justify-content space-between
    .ring
      flex 0 0 auto
      width 380px
      height 100%
    .line
      flex 0 0 auto
      width 500px
      height 100%
</style>
