<template>
  <div class="right-card">
    <m-card title="各单位完成情况">
      <VChart ref="vChart" :option="option" autoresize />
    </m-card>
  </div>
</template>
<script setup>
import { ref, onMounted, onBeforeUnmount, provide } from "vue"
import * as echarts from "echarts"
import VChart from "vue-echarts"
import mCard from "@/components/mCard/index.vue"
import request, { API, isValidUnit, safeMax } from "@/utils/request"

provide("echarts", echarts)

const vChart = ref(null)

const allData = ref([])
const startIndex = ref(0)
let timer = null
let maxValue = 0

const SHOW_COUNT = 4
const INTERVAL = 3000

const option = ref({
  grid: {
    left: "6%",
    top: "12%",
    width: "88%",
    height: "80%",
  },

  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "shadow",
      shadowStyle: { opacity: 0.15 },
    },
    backgroundColor: "rgba(0,0,0,0.85)",
    borderWidth: 0,
    textStyle: {
      color: "#ffffff",
      fontSize: 11,
    },
    formatter: (params) => {
      const p = params.find(i => i.seriesName !== "背景")
      return `${p.name}<br/>整改数量：${p.value} 条`
    }
  },

  xAxis: {
    type: "value",
    axisLine: { show: false },
    axisTick: { show: false },
    splitLine: { show: false },
    axisLabel: { show: false },
  },

  yAxis: [
    {
      type: "category",
      inverse: true,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { show: false },
      data: [],   // 动态注入
    },
    {
      type: "category",
      inverse: true,
      axisLine: { show: false },
      axisTick: { show: false },
      data: [],
    },
  ],

  series: [
    {
      name: "整改数量",
      type: "bar",
      barWidth: 7,
      z: 2,
      data: [],
      label: {
        show: true,
        position: "middle",
        padding: [-18, 0, 0, 0],
        distance: 12,
        formatter: (params) =>
          `{name|${params.name}}                                                                              {value|${params.value}}{unit|条}`,
        rich: {
          name: {
            color: "rgba(255,255,255,0.75)",
            fontSize: 13,
            fontWeight: "normal",
            textBorderWidth: 0,
            textBorderColor: "transparent",
            textShadowBlur: 0,
            textShadowColor: "transparent",
          },
          value: {
            color: "#16C1A6",
            fontSize: 12,
            fontWeight: "bold",
            padding: [0, 6, 0, 10],
          },
          unit: {
            color: "rgba(255,255,255,0.75)",
            fontSize: 10,
            padding: [0, 0, 0, 2],
          },
        },
      },
      itemStyle: {
        borderWidth: 1,
        borderColor: "rgba(26,57,77,0.8)",
        color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
          { offset: 0, color: "rgba(64,175,255,0.9)" },
          { offset: 1, color: "rgba(25,255,198,0.9)" },
        ]),
      },
    },

    {
      name: "背景",
      type: "bar",
      barGap: "-100%",
      barWidth: 10,
      z: 0,
      tooltip: { show: false },
      data: [],
      itemStyle: {
        color: "none",
        borderColor: "rgba(120,160,180,0.35)",
        borderWidth: 1,
      },
    },
  ],
})

/** 拉接口 */
const fetchData = async () => {
  try {
    const res = await request.get(API.CMP_UNIT)

    // 只保留单位 + 数据总量
    allData.value = res.data
    .filter(isValidUnit)
    .map(item => ({
      name: item["单位"],
      value: item["总数"],
    }))
    .sort((a, b) => b.value - a.value)
    maxValue = safeMax(allData.value.map(i => i.value))

    updateChart()
    startScroll()
  } catch (err) {
    console.error("获取各单位完成情况失败：", err)
  }
}

const updateChart = () => {
  if (!allData.value.length) return

  const total = allData.value.length

  const current = []
  for (let i = 0; i < SHOW_COUNT; i++) {
    current.push(allData.value[(startIndex.value + i) % total])
  }

  option.value.yAxis[0].data = current.map(i => i.name)
  option.value.yAxis[1].data = current.map(() => "")

  option.value.series[0].data = current.map((item, idx) => ({
    value: item.value,
    itemStyle: {
      color: new echarts.graphic.LinearGradient(0, 0, 1, 1, [
        { offset: 0, color: "rgba(3,65,128,1)" },
        { offset: 1, color: "rgba(115,208,255,1)" },
      ]),
    },
  }))

  const axisMax = Math.ceil(maxValue * 1.08)
  option.value.xAxis.max = axisMax           
  option.value.series[1].data = new Array(SHOW_COUNT).fill(axisMax)

  startIndex.value = (startIndex.value + 1) % total
}

/** 启动轮动 */
const startScroll = () => {
  timer && clearInterval(timer)
  timer = setInterval(updateChart, INTERVAL)
}

onMounted(fetchData)

onBeforeUnmount(() => {
  timer && clearInterval(timer)
})
</script>

<style lang="scss"></style>
