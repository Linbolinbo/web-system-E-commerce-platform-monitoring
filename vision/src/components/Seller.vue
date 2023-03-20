<template>
  <div class="com-container">
    <div class="com-chart" ref="seller_ref">

    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {
      chartInstance: null,
      // 服务器返回的数据
      allData: null,
      // 当前显示页数
      currentPage: 1,
      // 一共多少页
      totalPage: 0,
      // 定时器
      timerId: null
    }
  },
  mounted () {
    this.initChart()
    this.getData()
    // 监听屏幕变化的
    window.addEventListener('resize', this.screenAdapter)
    // 界面加载完主动进行屏幕设配
    this.screenAdapter()
  },
  destroyed () {
    clearInterval(this.timerId)
    window.removeEventListener('resize', this.screenAdapter)
  },
  methods: {
  // 初始化echarts对象
    initChart () {
      this.chartInstance = this.$echarts.init(this.$refs.seller_ref, this.theme)
      // 对图表初始化配置的控制
      const initOption = {
        title: {
          text: '▎ 商家销售统计',
          left: 20,
          top: 20
        },
        // 设置坐标轴距离
        grid: {
          top: '20%',
          left: '3%',
          right: '6%',
          bottom: '3%',
          containLabel: true // 开启包含坐标轴上的文字
        },
        xAxis: {
          type: 'value'
        },
        yAxis: {
          type: 'category'
        },
        // 柱子背景
        tooltip: {
          trigger: 'axis',
          axisPointer: {

            type: 'line',
            z: 0

          }
        },
        series: [
          {
            type: 'bar',
            // 柱子数字显示
            label: {
              show: true,
              position: 'right',
              textStyle: {
                color: 'white'
              }
            },
            itemStyle: {
              // 圆角效果
              barBorderRadius: [0, 33, 33, 0],
              // 颜色渐变
              color: new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [
                // 过度颜色开始
                {
                  offset: 0,
                  color: '#5052EE'
                },
                // 过度颜色结束
                {
                  offset: 1,
                  color: '#AB6EE5'
                }
              ])
            }
          }
        ]
      }
      this.chartInstance.setOption(initOption)
      // 对图表对象监听
      this.chartInstance.on('mouseover', () => {
        clearInterval(this.timerId)
      })
      this.chartInstance.on('mouseout', () => {
        this.startInterval()
      })
    },
    // 获取服务器数据
    async getData () {
      const { data: ret } = await this.$http.get('seller')
      this.allData = ret
      // 对数据从小到大排序
      this.allData.sort((a, b) => {
        return a.value - b.value
      })
      // 每五页显示一行
      this.totalPage = this.allData.length % 5 === 0 ? this.allData.length / 5 : this.allData.length / 5 + 1
      this.updateChart()
      this.startInterval()
    },
    // 更新图表
    updateChart () {
      const start = (this.currentPage - 1) * 5
      const end = this.currentPage * 5
      const showData = this.allData.slice(start, end)

      const sellerNames = showData.map((item) => {
        return item.name
      })
      const sellerValue = showData.map((item) => {
        return item.value
      })
      const dataOption = {

        yAxis: {
          data: sellerNames
        },

        series: [
          {

            data: sellerValue

          }
        ]
      }
      this.chartInstance.setOption(dataOption)
    },
    // 定时器,负责页数变换
    startInterval () {
      // 如果定时器存在，则先清除
      if (this.timerId) {
        clearInterval(this.timerId)
      }
      this.timerId = setInterval(() => {
        this.currentPage++
        if (this.currentPage > this.totalPage) {
          this.currentPage = 1
        }
        this.updateChart()
      }, 3000)
    },
    // 屏幕适配
    screenAdapter () {
      // console.log(this.$refs.seller_ref.offsetWidth)
      const titleFontSize = this.$refs.seller_ref.offsetWidth / 100 * 3.6
      // 分辨率相关的配置项
      const adapterOption = {
        title: {

          textStyle: {
            fontSize: titleFontSize
          }

        },

        series: [
          {

            barWidth: titleFontSize // 柱子宽度

          }
        ]
      }
      this.chartInstance.setOption(adapterOption)
      // 调用resize方法设配
      this.chartInstance.resize()
    }
  },
  computed: {
    ...mapState(['theme'])
  },
  watch: {
    theme () {
      this.chartInstance.dispose()
      this.initChart()
      this.screenAdapter()
      this.updateChart()
    }
  }
}
</script>

<style lang="less" scoped>

</style>
