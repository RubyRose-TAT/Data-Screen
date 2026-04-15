<template>
  <div class="left-card">
    <m-card title="各单位识别数量">
      <v-chart ref="vChart" :option="option" :autoresize="true" />
    </m-card>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue"
import * as echarts from "echarts"
import mCard from "@/components/mCard/index.vue"
import VChart from "vue-echarts"
import request, { API, isValidUnit } from "@/utils/request"

/* ================== 轮动配置 ================== */
const SHOW_COUNT = 6          // 页面展示条数
const INTERVAL = 3000         // 轮动间隔（ms）

const fullData = ref([])      // 接口返回的完整数据
const currentIndex = ref(0)   // 当前轮播起点
let timer = null
/* ============================================= */

const option = ref({
  title: {
    text: "条",
    left: "5%",
    top: "8%",
    textStyle: { color: "#D3F8F2", fontSize: 8 },
  },
  grid: {
    left: "12%",
    top: "25%",
    width: "82%",
    height: "55%",
  },
  tooltip: {
    trigger: "axis",
    axisPointer: { type: "shadow", shadowStyle: { opacity: 0.2 } },
    backgroundColor: "rgba(0,0,0,1)",
    borderWidth: 1,
    borderColor: "#999999",
    textStyle: { color: "#ffffff", fontSize: 10 },
  },
  xAxis: [
    {
      type: "category",
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { show: false },
      axisLabel: { color: "#ffffff", fontSize: 10, interval: 0 },
      data: [],
    },
    {
      axisLine: { show: false },
      data: [],
    },
  ],
  yAxis: {
    type: "value",
    axisLine: { show: false },
    axisTick: { show: false },
    splitLine: { show: false },
    axisLabel: { color: "#8B9EA4", fontSize: 9 },
  },
  series: [
    {
      type: "pictorialBar",
      symbol:
        "path://M0,10 L10,10 C5.5,10 5.5,5 5,0 C4.5,5 4.5,10 0,10 z",
      label: {
        show: true,
        position: "top",
        distance: 10,
        color: "#ffffff",
        fontSize: 10,
      },
      data: [],
    },
    {
      type: "scatter",
      z: 3,
      tooltip: { show: false },
      symbol: "image://data:image/png;base64,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",
      symbolSize: [10, 10],
      animationDurationUpdate: 1000,
      animationEasingUpdate: "cubicOut",
      data: []
    }
  ],
})

/* ===== 渲染当前 6 条 ===== */
const renderSlice = () => {
  if (!fullData.value.length) return

  const slice = fullData.value.slice(
    currentIndex.value,
    currentIndex.value + SHOW_COUNT
  )

  option.value.xAxis[0].data = slice.map(i => i["单位"])
  const totals = slice.map(i => i["总数"])

  option.value.series[0].data = totals.map((v, idx) => ({
    value: v,
    itemStyle: {
      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        {
          offset: 0,
          color: idx % 2 === 0
            ? "rgba(64, 175, 255, 1)"
            : "rgba(25, 255, 198, 1)",
        },
        {
          offset: 1,
          color: idx % 2 === 0
            ? "rgba(64, 175, 255, 0.10)"
            : "rgba(0, 204, 187, 0.10)",
        },
      ]),
    },
  }))

  option.value.series[1].data = totals.map((v, i) => [i, v])
}

onMounted(async () => {
  try {
    const { data } = await request.get(API.CMP_UNIT)
    fullData.value = data.filter(isValidUnit)
    renderSlice()

    timer = setInterval(() => {
      currentIndex.value++
      if (fullData.value.length <= SHOW_COUNT) {
        currentIndex.value = 0
      } else if (currentIndex.value > fullData.value.length - SHOW_COUNT) {
        currentIndex.value = 0
      }
      renderSlice()
    }, INTERVAL)
  } catch (err) {
    console.error("获取各单位识别数量失败：", err)
  }
})

onBeforeUnmount(() => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
})
</script>

<style lang="scss"></style>
