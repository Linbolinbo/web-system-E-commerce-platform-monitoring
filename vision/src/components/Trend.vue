<template>
  <div class="com-container">
    <div class="title" :style="comStyle">
      <span>{{'▎'+ showTitle }}</span>
      <span class="iconfont title-icon" :style="comStyle" @click="showChoice=!showChoice">&#xe6eb;</span>
      <div class="select-con" v-show="showChoice" :style="marginStyle">
        <div class="select-item" v-for="item in selectTypes" :key="item.key" @click="handleSelect(item.key)">
          {{ item.text }}
        </div>
      </div>
    </div>
    <div class="com-chart" ref="trend_ref">

    </div>
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
      showChoice: false,
      choiceType: 'map',
      titleFontSize: 0
    }
  },
  // created () {
  //   // 在组件创建完成后进行回调函数的注册
  //   this.$socket.registerCallBack('trendData', this.getData)
  // },
  mounted () {
    this.initChart()
    this.getData()
    // 发送数据给服务器，告诉服务器当前需要数据
    // this.$socket.send({
    //   action: 'getData',
    //   socketType: 'trendData',
    //   charName: 'trend',
    //   value: ''
    // })
    window.addEventListener('resize', this.screenAdapter)
    this.chartInstane.resize()
    this.screenAdapter()
  },
  destroyed () {
    window.removeEventListener('resize', this.screenAdapter)
    // 在组件销毁时，进行回调函数的取消
    // this.$socket.unRegisterCallBack('trendData')
  },
  // 计算属性
  computed: {
    selectTypes () {
      if (!this.allData) {
        return []
      } else {
        return this.allData.type.filter(item => {
          return item.key !== this.choiceType
        })
      }
    },
    showTitle () {
      if (!this.allData) {
        return ''
      } else {
        return this.allData[this.choiceType].title
      }
    },
    // 设置给标题的样式
    comStyle () {
      return {
        fontSize: this.titleFontSize + 'px',
        color: getThemeValue(this.theme).titleColor

      }
    },
    marginStyle () {
      return {
        marginLeft: this.titleFontSize + 'px'
      }
    },
    ...mapState(['theme'])
  },
  methods: {
  // 初始化图表
    initChart () {
      this.chartInstane = this.$echarts.init(this.$refs.trend_ref, this.theme)
      const initOption = {
        grid: {
          left: '3%',
          top: '35%',
          right: '4%',
          bottom: '1%',
          containLabel: true
        },
        tooltip: {
          trigger: 'axis'
        },
        // 图例设置
        legend: {
          left: 20,
          top: '15%',
          icon: 'circle'
        },
        xAxis: {
          type: 'category',
          boundaryGap: false
        },
        yAxis: {
          type: 'value'
        }
      }
      this.chartInstane.setOption(initOption)
    },
    // 获取服务器数据
    async getData () {
      const { data: ret } = await this.$http.get('trend')
      this.allData = ret
      this.updateChart()
    },
    updateChart () {
      // 处理数据
      // 半透明颜色值
      const colorArr1 = [
        'rgba(73, 146, 255, .5)',
        'rgba(124, 255, 178, .5)',
        'rgba(253, 221, 96, .5)',
        'rgba(255, 110, 118, .5)',
        'rgba(88, 217, 249, .5)'
      ]
      // 全透明颜色值
      const colorArr2 = [
        'rgba(73, 146, 255, 0)',
        'rgba(124, 255, 178, 0)',
        'rgba(253, 221, 96, 0)',
        'rgba(255, 110, 118, 0)',
        'rgba(88, 217, 249, 0)'
      ]
      const timeArr = this.allData.common.month// 类目轴数据
      const valueArr = this.allData[this.choiceType].data// series的数据
      const seriesArr = valueArr.map((item, index) => {
        return {
          name: item.name,
          type: 'line',
          data: item.data,
          stack: this.choiceType, // 堆叠图，防止折线图杂乱无章
          areaStyle: {
            color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: colorArr1[index]
              },
              {
                offset: 1,
                color: colorArr2[index]
              }
            ])
          }
        }
      })
      // 图例数据，即折线的名字
      const legendArr = valueArr.map(item => {
        return item.name
      })
      const dataOption = {
        xAxis: {
          data: timeArr
        },
        legend: {
          data: legendArr
        },
        series: seriesArr
      }
      this.chartInstane.setOption(dataOption)
    },
    screenAdapter () {
      // 屏幕设配
      this.titleFontSize = this.$refs.trend_ref.offsetWidth / 100 * 3.6
      const adapterOption = {
        legend: {
          itemWidth: this.titleFontSize,
          itemHeight: this.titleFontSize,
          itemGap: this.titleFontSize,
          textStyle: {
            fontSize: this.titleFontSize / 2
          }
        }
      }
      this.chartInstane.setOption(adapterOption)
      this.chartInstane.resize()
    },
    // 商品列表选择
    handleSelect (currentType) {
      this.choiceType = currentType
      this.updateChart()
      this.showChoice = false
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
.title{
  position: absolute;
  left: 20px;
  top:20px;
  z-index:10;
  color: white;
  .title-icon{
   margin-left: 10px;
   cursor: pointer;
  }
  .select-con{
    background-color:rgb(41, 52, 65);
  }
}
</style>
