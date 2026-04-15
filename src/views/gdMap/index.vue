<template>
  <div class="large-screen">
    <!-- 地图 -->
    <mapScene ref="mapSceneRef"></mapScene>
    <div class="large-screen-wrap" id="large-screen">
      <m-header title="证照核查数据可视化平台" sub-text="Ganzhou Economic Visualization Platform">
        <!--左侧 天气 -->
        <template v-slot:left>
          <div class="m-header-weather"><span>多云</span><span>24℃</span></div>
        </template>
        <!--右侧 日期 -->
        <template v-slot:right>
          <div class="m-header-date">
            <span>{{ timeState.date }}</span>
            <span>{{ timeState.time }}</span>
          </div>
        </template>
      </m-header>
      <!-- 顶部菜单 -->
      <div class="top-menu">
        <mMenu :default-active="state.activeIndex" @select="handleMenuSelect">
          <mMenuItem index="1">证照核查</mMenuItem>
          <mMenuItem index="2">导航栏</mMenuItem>
          <mMenuItem index="3">导航栏</mMenuItem>
          <div class="top-menu-mid-space"></div>
          <mMenuItem index="4">导航栏</mMenuItem>
          <mMenuItem index="5">导航栏</mMenuItem>
          <mMenuItem index="6">导航栏</mMenuItem>
        </mMenu>
      </div>
      <!-- 顶部统计卡片 -->
      <div class="top-count-card">
        <mCountCard v-for="item in state.totalView" :info="item" :key="item.icon"></mCountCard>
      </div>
      <!-- 左边布局 图表 -->
      <div class="left-wrap">
        <div class="left-wrap-3d">
          <!-- 证照不符数量 -->
          <BulkCommoditySalesChart></BulkCommoditySalesChart>
          <!-- 证照不符占比 -->
          <YearlyEconomyTrend></YearlyEconomyTrend>
          <!-- 近期识别数量 -->
          <EconomicTrendChart></EconomicTrendChart>
          <!-- 各单位识别数量 -->
          <DistrictEconomicIncome></DistrictEconomicIncome>
        </div>
      </div>
      <!-- 右边布局 图表 -->
      <div class="right-wrap">
        <div class="right-wrap-3d">
          <!-- 整改情况统计 -->
          <QuarterlyGrowthSituation></QuarterlyGrowthSituation>
          <!-- 整改类型占比 -->
          <ProportionPopulationConsumption></ProportionPopulationConsumption>
          <!-- 整改数量统计 -->
          <ElectricityUsage></ElectricityUsage>
          <!-- 各单位完成情况 -->
          <PurposeSpecialFunds></PurposeSpecialFunds>
        </div>
      </div>
      <!-- 底部托盘 -->
      <div class="bottom-tray">
        <!-- svg线条动画 -->
        <mSvglineAnimation
          class="bottom-svg-line-left"
          :width="721"
          :height="57"
          color="#30DCFF"
          :strokeWidth="2"
          :dir="[0, 1]"
          :length="50"
          path="M1 56.6105C1 31.5123 185.586 10.0503 451.904 1.35519C458.942 1.12543 465.781 4.00883 470.505 9.22964L484.991 25.2383C487.971 28.4775 492.938 30.4201 498.254 30.4201H720.142"
        ></mSvglineAnimation>
        <mSvglineAnimation
          class="bottom-svg-line-left bottom-svg-line-right"
          :width="721"
          :height="57"
          color="#30DCFF"
          :strokeWidth="2"
          :dir="[0, 1]"
          :length="50"
          path="M1 56.6105C1 31.5123 185.586 10.0503 451.904 1.35519C458.942 1.12543 465.781 4.00883 470.505 9.22964L484.991 25.2383C487.971 28.4775 492.938 30.4201 498.254 30.4201H720.142"
        ></mSvglineAnimation>
        <!-- 做箭头 -->
        <div class="bottom-tray-arrow">
          <img src="@/assets/images/bottom-menu-arrow-big.svg" alt="" />
          <img src="@/assets/images/bottom-menu-arrow-small.svg" alt="" />
        </div>
        <!-- 底部菜单 -->
        <div class="bottom-menu">
          <div class="bottom-menu-item is-active"><span>赣州市</span></div>
          <div class="bottom-menu-item"><span>小标题</span></div>
          <div class="bottom-menu-item"><span>小标题</span></div>
          <div class="bottom-menu-item"><span>小标题</span></div>
        </div>
        <!-- 右箭头 -->
        <div class="bottom-tray-arrow is-reverse">
          <img src="@/assets/images/bottom-menu-arrow-big.svg" alt="" />
          <img src="@/assets/images/bottom-menu-arrow-small.svg" alt="" />
        </div>
      </div>
      <!-- 雷达 -->
      <div class="bottom-radar">
        <mRadar></mRadar>
      </div>
      <!-- 左右装饰线 -->
      <div class="large-screen-left-zsline"></div>
      <div class="large-screen-right-zsline"></div>
    </div>

    <!-- loading动画 -->
    <div class="loading">
      <div class="loading-text">
        <span style="--index: 1">L</span>
        <span style="--index: 2">O</span>
        <span style="--index: 3">A</span>
        <span style="--index: 4">D</span>
        <span style="--index: 5">I</span>
        <span style="--index: 6">N</span>
        <span style="--index: 7">G</span>
      </div>
      <div class="loading-progress">
        <span class="value">{{ state.progress }}</span>
        <span class="unit">%</span>
      </div>
    </div>
  </div>
</template>
<script setup>
import { shallowRef, ref, reactive, onMounted, onBeforeUnmount } from "vue"
import mapScene from "./map.vue"
import mHeader from "@/components/mHeader/index.vue"
import mCountCard from "@/components/mCountCard/index.vue"
import mMenu from "@/components/mMenu/index.vue"
import mRadar from "@/components/mRadar/index.vue"
import mMenuItem from "@/components/mMenuItem/index.vue"
import mSvglineAnimation from "@/components/mSvglineAnimation/index.vue"
import BulkCommoditySalesChart from "./components/BulkCommoditySalesChart.vue"
import YearlyEconomyTrend from "./components/YearlyEconomyTrend.vue"
import EconomicTrendChart from "./components/EconomicTrendChart.vue"
import DistrictEconomicIncome from "./components/DistrictEconomicIncome.vue"
import PurposeSpecialFunds from "./components/PurposeSpecialFunds.vue"
import ProportionPopulationConsumption from "./components/ProportionPopulationConsumption.vue"
import ElectricityUsage from "./components/ElectricityUsage.vue"
import QuarterlyGrowthSituation from "./components/QuarterlyGrowthSituation.vue"

import { Assets } from "./assets.js"
import emitter from "@/utils/emitter"
import gsap from "gsap"
import autofit from "autofit.js"
import request, { API } from "@/utils/request"

const assets = shallowRef(null)
const mapSceneRef = ref(null)
const state = reactive({
  // 进度
  progress: 0,
  // 当前顶部导航索引
  activeIndex: "1",
  // 卡片统计数据
  totalView: [
    {
      icon: "xiaoshoujine",
      zh: "证照不符总数",
      en: "Total License Mismatches",
      value: 0,
      unit: "条",
    },
    {
      icon: "zongxiaoliang",
      zh: "已处理总数",
      en: "Total Cases Processed",
      value: 0,
      unit: "条",
    },
        {
      icon: "xiaoshoujine",
      zh: "完成率",
      en: "Completion Rate",
      value: 0,
      unit: "%",
      decimals: 1,
    },
  ],
})
async function loadTotalViewData() {
  try {
    const { data } = await request.get(API.CMP_UNIT)

    // /cmp/unit 返回的是数组，直接找“全市”
    const cityRow = Array.isArray(data)
      ? data.find(i => i["单位"] === "全市")
      : null

    if (!cityRow) return

    const total = Number(cityRow["总数"] ?? 0)
    const done = Number(cityRow["已处理量"] ?? 0)
    const rate = Number(cityRow["完成率"] ?? 0)   // 0–1

    // 回填顶部卡片
    state.totalView[0].value = total
    state.totalView[1].value = done
    state.totalView[2].value = Math.round(rate * 1000) / 10
  } catch (err) {
    console.error("获取 /cmp/unit 失败：", err)
  }
}
onMounted(() => {
  // 定时器
  updateClock()
  clockTimer = setInterval(updateClock, 1000)
  loadTotalViewData()
  rateTimer = setInterval(loadTotalViewData, 30000)
  // 监听地图播放完成，执行事件
  emitter.$on("mapPlayComplete", handleMapPlayComplete)
  // 自动适配
  assets.value = autofit.init({
    dh: 1080,
    dw: 1920,
    el: "#large-screen",
    resize: true,
  })
  // 初始化资源
  initAssets(async () => {
    // 加载地图
    emitter.$emit("loadMap", assets.value)
    // 隐藏loading
    await hideLoading()
    // 播放场景
    mapSceneRef.value.play()
  })
})
onBeforeUnmount(() => {
  clockTimer && clearInterval(clockTimer)
  rateTimer && clearInterval(rateTimer)
  emitter.$off("mapPlayComplete", handleMapPlayComplete)
  autofit.off()
})
// 初始化加载资源
function initAssets(onLoadCallback) {
  assets.value = new Assets()
  // 资源加载进度
  let params = {
    progress: 0,
  }
  assets.value.instance.on("onProgress", (path, itemsLoaded, itemsTotal) => {
    let p = Math.floor((itemsLoaded / itemsTotal) * 100)
    gsap.to(params, {
      progress: p,
      onUpdate: () => {
        state.progress = Math.floor(params.progress)
      },
    })
  })
  // 资源加载完成
  assets.value.instance.on("onLoad", () => {
    onLoadCallback && onLoadCallback()
  })
}

// 隐藏loading
async function hideLoading() {
  return new Promise((resolve, reject) => {
    let tl = gsap.timeline()
    tl.to(".loading-text span", {
      y: "200%",
      opacity: 0,
      ease: "power4.inOut",
      duration: 2,
      stagger: 0.2,
    })
    tl.to(".loading-progress", { opacity: 0, ease: "power4.inOut", duration: 2 }, "<")
    tl.to(
      ".loading",
      {
        opacity: 0,
        ease: "power4.inOut",
        onComplete: () => {
          resolve()
        },
      },
      "-=1"
    )
  })
}

function handleMenuSelect(index) {
  state.activeIndex = index
}
// 地图开始动画播放完成
function handleMapPlayComplete() {
  let tl = gsap.timeline({ paused: false })
  let leftCards = gsap.utils.toArray(".left-card")
  let rightCards = gsap.utils.toArray(".right-card")
  let countCards = gsap.utils.toArray(".count-card")
  tl.addLabel("start", 0.5)
  tl.addLabel("menu", 0.5)
  tl.addLabel("card", 1)
  tl.addLabel("countCard", 3)
  tl.to(".m-header", { y: 0, opacity: 1, duration: 1.5, ease: "power4.out" }, "start")
  tl.to(".bottom-tray", { y: 0, opacity: 1, duration: 1.5, ease: "power4.out" }, "start")
  tl.to(
    ".top-menu",
    {
      y: 0,
      opacity: 1,
      duration: 1.5,
      ease: "power4.out",
    },
    "-=1"
  )
  tl.to(".bottom-radar", { y: 0, opacity: 1, duration: 1.5, ease: "power4.out" }, "-=2")
  tl.to(leftCards, { x: 0, opacity: 1, stagger: 0.2, duration: 1.5, ease: "power4.out" }, "card")
  tl.to(rightCards, { x: 0, opacity: 1, stagger: 0.2, duration: 1.5, ease: "power4.out" }, "card")
  tl.to(
    countCards,
    {
      y: 0,
      opacity: 1,
      stagger: 0.2,
      duration: 1.5,
      ease: "power4.out",
    },
    "card"
  )
}

const timeState = reactive({
  date: "--",
  time: "--",
})

let clockTimer = null
let rateTimer = null

function pad2(n) {
  return String(n).padStart(2, "0")
}

function updateClock() {
  const now = new Date()
  const y = now.getFullYear()
  const m = pad2(now.getMonth() + 1)
  const d = pad2(now.getDate())
  const hh = pad2(now.getHours())
  const mm = pad2(now.getMinutes())
  const ss = pad2(now.getSeconds())

  timeState.date = `${y}-${m}-${d}`
  timeState.time = `${hh}:${mm}:${ss}`
}
</script>

<style lang="scss">
@use "~@/assets/style/home.scss" as *;
.m-header-weather,
.m-header-date {
  span {
    padding-right: 10px;
    color: #c4f3fe;
    font-size: 14px;
  }
}
.top-menu {
  position: absolute;
  left: 0px;
  right: 0px;
  top: 40px;
  z-index: 3;
  display: flex;
  justify-content: center;
  .top-menu-mid-space {
    width: 800px;
  }
}
.top-count-card {
  transform: translateX(-26%);
  width: 100%;
  display: flex;
  justify-content: center;    // ★水平居中
  align-items: center;
  gap: 10px; 
}
.bottom-radar {
  position: absolute;
  right: 500px;
  bottom: 100px;
  z-index: 3;
}
.main-btn-group {
  display: flex;
  left: 50%;
  transform: translateX(-50%);
  bottom: 10px;
  z-index: 999;
  &.disabled {
    pointer-events: none;
  }
  .btn {
    margin-right: 10px;
  }
}
.bottom-svg-line-left,
.bottom-svg-line-right {
  position: absolute;
  right: 50%;
  width: 721px;
  height: 57px;
  margin-right: -5px;
  bottom: -21px;
}
.bottom-svg-line-right {
  transform: scaleX(-1);
  left: 50%;
  right: inherit;
  margin-right: inherit;
  margin-left: -5px;
}
/* 初始化动画开始位置 */
.m-header {
  transform: translateY(-100%);
  opacity: 0;
}
.top-menu {
  transform: translateY(-250%);
  opacity: 0;
}
.count-card {
  transform: translateY(150%);
  opacity: 0;
}
.left-card {
  transform: translateX(-150%);
  opacity: 0;
}
.right-card {
  transform: translateX(150%);
  opacity: 0;
}
.bottom-tray {
  transform: translateY(100%);
  opacity: 0;
}
.bottom-radar {
  transform: translateY(100%);
  opacity: 0;
}
</style>
