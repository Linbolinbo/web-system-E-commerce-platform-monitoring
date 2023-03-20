<template>
  <div class="com-container">
    <div class="com-chart" ref="stock_ref">
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
      currentIndex: 0,
      timerId: null
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
      this.chartInstane = this.$echarts.init(this.$refs.stock_ref, this.theme)
      const initOption = {
        title: {
          text: '▎ 库存和销量分析',
          left: 20,
          top: 20
        }
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
      const { data: ret } = await this.$http.get('stock')
      this.allData = ret
      // console.log(this.allData)
      this.updateChart()
      this.startInterval()
    },
    updateChart () {
      // 处理数据
      const centerArr = [
        ['18%', '40%'],
        ['50%', '40%'],
        ['82%', '40%'],
        ['34%', '75%'],
        ['66%', '75%']
      ]
      const colorArr = [
        ['#4FF778', '#0BA82C'],
        ['#E5DD45', '#E8B11C'],
        ['#E8821C', '#E55455'],
        ['#5052EE', '#AB6EE5'],
        ['#23E5E5', '#2E72BF']
      ]
      const start = this.currentIndex * 5
      const end = (this.currentIndex + 1) * 5
      const showData = this.allData.slice(start, end)
      const seriesArr = showData.map((item, index) => {
        return {
          type: 'pie',
          radius: [50, 40],
          center: centerArr[index],
          hoverAnimation: false, // 关闭鼠标移入时效果
          labelLine: {
            show: false
          },
          label: {
            position: 'center',
            formatter: item.name + '\n\n' + item.sales,
            color: colorArr[index][0]
          },
          data: [
            {
              // name: item.name + '\n\n' + item.sales,
              value: item.sales,
              itemStyle: {
                color: new this.$echarts.graphic.LinearGradient(0, 1, 0, 0, [
                  {
                    offset: 0,
                    color: colorArr[index][0]
                  },
                  {
                    offset: 1,
                    color: colorArr[index][1]
                  }
                ])
              }
            },
            {
              value: item.stock,
              itemStyle: {
                color: '#333843'
              }
            }
          ]
        }
      })
      const dataOption = {
        series: seriesArr
      }
      this.chartInstane.setOption(dataOption)
    },
    screenAdapter () {
      // 屏幕设配
      const titleFontsize = this.$refs.stock_ref.offsetWidth / 100 * 3.6
      const innerRadius = titleFontsize * 2
      const outterRadius = innerRadius * 1.125
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontsize
          }
        },
        series: [
          {
            type: 'pie',
            radius: [outterRadius, innerRadius],
            label: {
              fontSize: titleFontsize / 2
            }
          },
          {
            type: 'pie',
            radius: [outterRadius, innerRadius],
            label: {
              fontSize: titleFontsize / 2
            }
          },
          {
            type: 'pie',
            radius: [outterRadius, innerRadius],
            label: {
              fontSize: titleFontsize / 2
            }
          },
          {
            type: 'pie',
            radius: [outterRadius, innerRadius],
            label: {
              fontSize: titleFontsize / 2
            }
          },
          {
            type: 'pie',
            radius: [outterRadius, innerRadius],
            label: {
              fontSize: titleFontsize / 2
            }
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
        this.currentIndex++
        if (this.currentIndex > 1) {
          this.currentIndex = 0
        }
        this.updateChart()
      }, 5000)
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
