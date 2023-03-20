<template>
  <div class="com-container" @dblclick="reverMap">
    <div class="com-chart" ref="map_ref">
  </div>
  </div>
</template>

<script>
import axios from 'axios'
import { mapState } from 'vuex'
import { getProvinceMapInfo } from '@/utils/map_utils'
export default {
  data () {
    return {
      chartInstane: null,
      allData: null, // 从服务器中获取的数据
      mapData: {}
    }
  },
  mounted () {
    this.initChart()
    this.getData()
    window.addEventListener('resize', this.screenAdapter)
    this.chartInstane.resize()
    // this.this.screenAdapter()
  },
  destroyed () {
    window.removeEventListener('resize', this.screenAdapter)
  },
  methods: {
  // 初始化图表
    async initChart () {
      this.chartInstane = this.$echarts.init(this.$refs.map_ref, this.theme)
      const ret = await axios.get('http://127.0.0.1:8999/static/map/china.json')
      // 调用$echarts.registerMap（）方法注册地图数据
      this.$echarts.registerMap('china', ret.data)
      const initOption = {
        title: {
          text: '▎ 商家分布',
          left: 20,
          top: 20
        },
        geo: {
          type: 'map',
          map: 'china',
          top: '5%',
          bottom: '5%',
          itemStyle: {
            areaColor: '#2E72BF',
            borderColor: '#333'
          }
        },
        legend: {
          left: '5%',
          bottom: '5%',
          orient: 'vertical'
        }
      }
      this.chartInstane.setOption(initOption)
      this.chartInstane.on('click', async (arg) => {
        // 在utils中引入getProvinceMapInfo()方法来得到我们省份的路劲和拼音
        const provinceInfo = getProvinceMapInfo(arg.name)
        // console.log(provinceInfo)
        if (!this.mapData[provinceInfo.key]) {
          const ret = await axios.get('http://127.0.0.1:8999' + provinceInfo.path)
          this.mapData[provinceInfo.key] = ret.data
          this.$echarts.registerMap(provinceInfo.key, ret.data)
        }

        const changeOption = {
          geo: {
            map: provinceInfo.key
          }
        }
        this.chartInstane.setOption(changeOption)
      })
    },
    // 获取服务器数据
    async getData () {
      const { data: ret } = await this.$http.get('map')
      this.allData = ret
      this.updateChart()
    },
    updateChart () {
      // 处理数据
      // 图例数据
      const legendArr = this.allData.map(item => {
        return item.name
      })
      const seriesArr = this.allData.map(item => {
        return {
          type: 'effectScatter',
          rippleEffect: {
            scale: 5,
            brushType: 'stroke'
          },
          name: item.name,
          data: item.children,
          // 在地图中显示散点图
          coordinateSystem: 'geo'
        }
      })
      const dataOption = {
        legend: {
          data: legendArr
        },
        series: seriesArr
      }
      this.chartInstane.setOption(dataOption)
    },
    screenAdapter () {
      // 屏幕设配
      const titleFontSize = this.$refs.map_ref.offsetWidth / 100 * 3.6
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize
          }
        },
        legend: {
          itemWidth: titleFontSize / 2,
          itemHeight: titleFontSize / 2,
          itemGap: titleFontSize / 2,
          textStyle: {
            fontSize: titleFontSize / 2
          }
        }
      }
      this.chartInstane.setOption(adapterOption)
      this.chartInstane.resize()
    },
    // 回到中国地图
    reverMap () {
      const revertOption = {
        geo: {
          map: 'china'
        }
      }
      this.chartInstane.setOption(revertOption)
    }
  },
  computed: {
    ...mapState(['theme'])
  },
  watch: {
    theme () {
      this.chartInstane.dispose()
      this.initChart()
      // this.screenAdapter()
      this.updateChart()
    }
  }

}
</script>

<style>

</style>
