<template>
  <div class="screen-container" :style="containerStyle">
    <header class="screen-header">
      <div>
        <img :src="headerSrc"  alt="" />
      </div>
      <span class="logo">
        <img :src="logoSrc"  alt="" />
      </span>
      <span class="title">电商平台数据大屏实时监控系统</span>
      <div class="title-right">
        <img :src="themeSrc"  class="qiehuan" @click="handleChangeTheme"/>
        <span class="datetime">2023/3/20</span>
      </div>
    </header>
    <div class="screen-body">
      <section class="screen-left">
        <div id="left-top" :class="[fullscreenStatus.trend?'fullscreen':'']">
          <!-- 销量趋势图表 -->
          <Trend ref="trend"></Trend>
          <div class="resize">
            <!-- icon-compress-alt -->
            <span @click="changeSize('trend')" :class="['iconfont',fullscreenStatus.trend? 'icon-compress-alt':'icon-expand-alt']"></span>
          </div>
        </div>
        <div id="left-bottom" :class="[fullscreenStatus.seller?'fullscreen':'']">
          <!-- 商家销售金额图表 -->
          <Seller ref="seller"></Seller>
          <div class="resize">
            <!-- icon-compress-alt -->
            <span @click="changeSize('seller')"  :class="['iconfont',fullscreenStatus.seller? 'icon-compress-alt':'icon-expand-alt']"></span>
          </div>
        </div>
      </section>
      <section class="screen-middle" >
        <div id="middle-top" :class="[fullscreenStatus.map?'fullscreen':'']">
          <!-- 商家分布图表 -->
          <Map ref="map"></Map>
          <div class="resize">
            <!-- icon-compress-alt -->
            <span @click="changeSize('map')"  :class="['iconfont',fullscreenStatus.map? 'icon-compress-alt':'icon-expand-alt']"></span>
          </div>
        </div>
        <div id="middle-bottom" :class="[fullscreenStatus.rank?'fullscreen':'']">
          <!-- 地区销量排行图表 -->
          <Rank ref="rank"></Rank>
          <div class="resize">
            <!-- icon-compress-alt -->
            <span @click="changeSize('rank')"  :class="['iconfont',fullscreenStatus.rank? 'icon-compress-alt':'icon-expand-alt']"></span>
          </div>
          </div>
      </section>
      <section class="screen-right" >
        <div id="right-top" :class="[fullscreenStatus.hot?'fullscreen':'']">
          <!-- 热销商品占比图表 -->
          <hot ref="hot"></hot>
          <div class="resize">
            <!-- icon-compress-alt -->
            <span @click="changeSize('hot')"  :class="['iconfont',fullscreenStatus.hot? 'icon-compress-alt':'icon-expand-alt']"></span>
          </div>
          </div>
        <div id="right-bottom" :class="[fullscreenStatus.stock?'fullscreen':'']">
          <!-- 库存销量分析图表 -->
          <Stock ref="stock"></Stock>
          <div class="resize">
            <!-- icon-compress-alt -->
            <span @click="changeSize('stock')"  :class="['iconfont',fullscreenStatus.stock? 'icon-compress-alt':'icon-expand-alt']"></span>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import Hot from '@/components/Hot.vue'
import Map from '@/components/Map.vue'
import Rank from '@/components/Rank.vue'
import Seller from '@/components/Seller.vue'
import Stock from '@/components/Stock.vue'
import Trend from '@/components/Trend.vue'
import { mapState } from 'vuex'
import { getThemeValue } from '@/utils/theme_utils.js'

export default {
  data () {
    return {
      fullscreenStatus: {
        trend: false,
        seller: false,
        map: false,
        rank: false,
        hot: false,
        stock: false
      }
    }
  },
  methods: {
    changeSize (chartName) {
      this.fullscreenStatus[chartName] = !this.fullscreenStatus[chartName]

      this.$nextTick(() => {
        this.$refs[chartName].screenAdapter()
      })
    },
    handleChangeTheme () {
      // 修改VueX中的数据
      this.$store.commit('changeTheme')
    }
  },
  computed: {
    logoSrc () {
      return '/static/img/' + getThemeValue(this.theme).logoSrc
    },
    headerSrc () {
      return '/static/img/' + getThemeValue(this.theme).headerBorderSrc
    },
    themeSrc () {
      return '/static/img/' + getThemeValue(this.theme).themeSrc
    },
    containerStyle () {
      return {
        backgroundColor: getThemeValue(this.theme).backgroundColor,
        color: getThemeValue(this.theme).titleColor
      }
    },
    ...mapState(['theme'])
  },
  components: {
    Hot,
    Map,
    Rank,
    Seller,
    Stock,
    Trend
  }
}
</script>

<style lang="less" scoped>
// 全屏样式的定义
.fullscreen {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  height: 100% !important;
  margin: 0 !important;
  z-index: 9999;
}

.screen-container {
  width: 100%;
  height: 100%;
  padding: 0 20px;
  background-color: #2e2e2f;
  color: #fff;
  box-sizing: border-box;
}
.screen-header {
  width: 100%;
  font-size: 20px;
  position: relative;
  > div {
    img {
      width: 100%;
    }
  }
  .title {
    position: absolute;
    left: 50%;
    top: 50%;
    font-size: 20px;
    transform: translate(-50%, -50%);
  }
  .title-right {
    display: flex;
    align-items: center;
    position: absolute;
    right: 0px;
    top: 50%;
    transform: translateY(-80%);
  }
  .qiehuan {
    width: 28px;
    height: 21px;
    cursor: pointer;
  }
  .datetime {
    font-size: 15px;
    margin-left: 10px;
  }
  .logo {
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-80%);
    img {
      height: 35px;
      width: 154px;
    }
  }
}
.screen-body {
  width: 100%;
  height: 100%;
  display: flex;
  margin-top: 10px;
  .screen-left {
    height: 100%;
    width: 27.6%;
    #left-top {
      height: 53%;
      position: relative;
    }
    #left-bottom {
      height: 31%;
      margin-top: 25px;
      position: relative;
    }
  }
  .screen-middle {
    height: 100%;
    width: 41.5%;
    margin-left: 1.6%;
    margin-right: 1.6%;
    #middle-top {
      width: 100%;
      height: 56%;
      position: relative;
    }
    #middle-bottom {
      margin-top: 25px;
      width: 100%;
      height: 28%;
      position: relative;
    }
  }
  .screen-right {
    height: 100%;
    width: 27.6%;
    #right-top {
      height: 46%;
      position: relative;
    }
    #right-bottom {
      height: 38%;
      margin-top: 25px;
      position: relative;
    }
  }
}
.resize {
  position: absolute;
  right: 20px;
  top: 20px;
  cursor: pointer;
}
</style>
