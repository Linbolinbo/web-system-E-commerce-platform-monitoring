<template>
  <div class="com-container">

    <div class="com-chart" ref="hot_ref">
  </div>
  <span class="iconfont arr-left" @click="toLeft" :style="comStyle">&#xe6ef;</span>
    <span class="iconfont arr-right" @click="toRight" :style="comStyle">&#xe6ed;</span>
    <span class="cat-name" :style="comStyle">{{ catName }}</span>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getThemeValue } from '@/utils/theme_utils.js'
export default {
  data () {
    return {
      chartInstane: null,
      allData: null, // 从服务器中获取的数据
      currentIndex: 0, // 饼状图的索引
      titleFontSize: 0
    }
  },
  computed: {
    catName () {
      if (!this.allData) {
        return ''
      } else {
        return this.allData[this.currentIndex].name
      }
    },
    comStyle () {
      return {
        fontSize: this.titleFontSize + 'px',
        color: getThemeValue(this.theme).titleColor
      }
    },
    ...mapState(['theme'])

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
  },
  methods: {
  // 初始化图表
    initChart () {
      this.chartInstane = this.$echarts.init(this.$refs.hot_ref, this.theme)
      const initOption = {
        title: {
          text: '▎ 热销商品占比',
          left: 20,
          top: 20
        },
        legend: {
          top: '15%',
          icon: 'circle'
        },
        tooltip: {
          show: true,
          formatter: arg => {
            const third = arg.data.children
            let total = 0
            third.forEach(item => {
              total += item.value
            })
            let retStr = ''
            third.forEach(item => {
              retStr += `
              ${item.name}:${parseInt(item.value / total * 100) + '%'}
              <br>
              `
            })
            return retStr
          }
        },
        series: [
          {
            type: 'pie',
            label: {
              show: false
            },
            emphasis: {
              label: {
                show: true
              },
              labelLine: {
                show: false
              }
            }
          }
        ]
      }
      this.chartInstane.setOption(initOption)
    },
    // 获取服务器数据
    async getData () {
      const { data: ret } = await this.$http.get('hotproduct')
      this.allData = ret

      this.updateChart()
    },
    updateChart () {
      // 处理数据
      const legendData = this.allData[this.currentIndex].children.map(item => {
        return item.name
      })
      const seriesData = this.allData[this.currentIndex].children.map(item => {
        return {
          name: item.name,
          value: item.value,
          children: item.children
        }
      })
      const dataOption = {
        legend: {
          data: legendData
        },
        series: [
          {
            data: seriesData
          }
        ]
      }
      this.chartInstane.setOption(dataOption)
    },
    screenAdapter () {
      // 屏幕设配
      this.titleFontSize = this.$refs.hot_ref.offsetWidth / 100 * 3.6
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: this.titleFontSize
          }
        },
        legend: {
          itemWidth: this.titleFontSize,
          itemHeight: this.titleFontSize,
          itemGap: this.titleFontSize / 2,
          itemStyle: {
            fontSize: this.titleFontSize / 2
          }
        },
        series: [
          {
            radius: this.titleFontSize * 3.5,
            center: ['50%', '50%']
          }
        ]
      }
      this.chartInstane.setOption(adapterOption)
      this.chartInstane.resize()
    },
    toLeft () {
      this.currentIndex--
      if (this.currentIndex < 0) {
        this.currentIndex = this.allData.length - 1
      }
      this.updateChart()
    },
    toRight () {
      this.currentIndex++
      if (this.currentIndex > this.allData.length - 1) {
        this.currentIndex = 0
      }
      this.updateChart()
    }
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

<style lang="less" scoped>
.arr-left{
  position: absolute;
  left:10%;
  top:50%;
  transform:translateY(-50%);
  cursor:pointer;
  color:white;
}
.arr-right{
  position: absolute;
  right:10%;
  top:50%;
  transform:translateY(-50%);
  cursor:pointer;
  color:white;

}
.cat-name{
  position: absolute;
  left:80%;
  bottom:20px;
  color:white;

}
</style>
