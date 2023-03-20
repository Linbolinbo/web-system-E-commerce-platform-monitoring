<template>
  <div class="com-container">

    <div class="com-chart" ref="rank_ref">
 </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {
      chartInstane: null,
      allData: null, // 从服务器中获取的数据
      startValue: 0, // 区域缩放起点值
      endValue: 9, // 区域缩放终点值
      timerId: null // 定时器的标识
    }
  },
  mounted () {
    this.initChart()
    this.getData()
    window.addEventListener('resize', this.screenAdapter)
    this.chartInstane.resize()
    this.screenAdapter()
  },
  destroyed () {
    window.removeEventListener('resize', this.screenAdapter)
    clearInterval(this.timerId)
  },
  methods: {
  // 初始化图表
    initChart () {
      this.chartInstane = this.$echarts.init(this.$refs.rank_ref, this.theme)
      const initOption = {
        title: {
          text: '▎ 地区销售排行',
          left: 20,
          top: 20
        },
        grid: {
          top: '40%',
          left: '5%',
          right: '5%',
          bottom: '5%',
          containLabel: true
        },
        tooltip: {
          show: true
        },
        xAxis: {
          type: 'category'
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            type: 'bar',
            itemStyle: {
              barBorderRadius: [10, 10, 0, 0]
            }
          }
        ]
      }
      this.chartInstane.setOption(initOption)
      this.chartInstane.on('mouseover', () => {
        clearInterval(this.timerId)
      })
      this.chartInstane.on('mouseout', () => {
        this.startInterval()
      })
    },
    // 获取服务器数据
    async getData () {
      const { data: ret } = await this.$http.get('rank')
      this.allData = ret
      this.allData.sort((a, b) => {
        return b.value - a.value
      })
      // console.log(this.allData)
      this.updateChart()
      this.startInterval()
    },
    updateChart () {
      // 处理数据
      const colorArr = [
        ['#0BA82C', '#4FF778'],
        ['#2E728F', '#23E5E5'],
        ['#5052EE', '#AB6EE5']
      ]
      const provinceArr = this.allData.map(item => {
        return item.name
      })
      const valuerArr = this.allData.map(item => {
        return item.value
      })
      const dataOption = {
        xAxis: {
          data: provinceArr
        },
        // 区域范围调整
        dataZoom: {
          show: false,
          startValue: this.startValue,
          endValue: this.endValue
        },
        series: [
          {
            data: valuerArr,
            itemStyle: {
              color: (arg) => {
                let targetColorArr = null
                if (arg.value > 300) {
                  targetColorArr = colorArr[0]
                } else if (arg.value > 200) {
                  targetColorArr = colorArr[1]
                } else {
                  targetColorArr = colorArr[2]
                }
                return new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: targetColorArr[0]
                  },
                  {
                    offset: 1,
                    color: targetColorArr[1]
                  }
                ])
              }
            }
          }
        ]
      }
      this.chartInstane.setOption(dataOption)
    },
    screenAdapter () {
      // 屏幕设配
      const titleFontSize = this.$refs.rank_ref.offsetWidth / 100 * 3.6
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize
          }
        },
        series: [
          {
            barWidth: titleFontSize

          }
        ]
      }
      this.chartInstane.setOption(adapterOption)
      this.chartInstane.resize()
    },
    startInterval () {
      if (this.timerId) {
        clearInterval(this.timerId)
      }
      this.timerId = setInterval(() => {
        this.startValue++
        this.endValue++
        if (this.endValue > this.allData.length - 1) {
          this.startValue = 0
          this.endValue = 9
        }
        this.updateChart()
      }, 2000)
    }
  },
  computed: {
    ...mapState(['theme'])
  },
  watch: {
    theme () {
      this.chartInstane.dispose()
      this.initChart()
      this.screenAdapter()
      this.updateChart()
    }
  }
}
</script>

<style>

</style>
