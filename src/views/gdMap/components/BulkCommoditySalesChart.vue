<template>
  <div class="left-card">
    <m-card title="证照不符数量">
      <v-chart ref="vChart" :option="option" :autoresize="true" />
    </m-card>
  </div>
</template>
<script setup>
import { ref, onMounted, nextTick, onBeforeUnmount } from "vue"
import * as echarts from "echarts"
import request, { API, safeMax } from "@/utils/request"
import mCard from "@/components/mCard/index.vue"
import VChart from "vue-echarts"

const option = ref({
  title: {
    text: "条",
    left: "5%",
    top: "8%",
    textStyle: {
      color: "#D3F8F2",
      fontSize: 8,
    },
  },
  grid: {
    left: "12%",
    top: "25%",
    width: "82%",
    height: "55%",
  },
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "shadow",
      shadowStyle: { opacity: 0 },
    },
    backgroundColor: "rgba(0,0,0,1)",
    borderWidth: 1,
    borderColor: "#ffffff",
    textStyle: {
      color: "#ffffff",
      fontSize: 10,
    },
  },
  xAxis: [
    {
      type: "category",
      interval: 0,
      axisLine: {
        show: false,
        lineStyle: {
          color: "#435459",
        },
      },
      axisTick: {
        show: false,
      },
      splitLine: {
        show: false,
      },
      axisLabel: {
        color: "#ffffff",
        fontSize: 10,
        interval: 0,
        padding: [0, 0, 0, 0],
      },
      data: [],
    },
    {
      axisLine: {
        show: false,
        lineStyle: {
          color: "rgba(0,0,0,0)",
        },
      },
      data: [],
    },
  ],
  yAxis: {
    type: "value",

    axisLine: {
      show: false,
    },
    axisTick: {
      show: false,
    },
    splitLine: {
      show: true,
      lineStyle: {
        type: [2, 2],
        dashOffset: 5,
        color: ["rgba(255, 255, 255, 1)"],
        opacity: 1,
        width: 0.3,
      },
    },
    axisLabel: {
      color: "#8B9EA4",
      fontSize: 9,
    },
  },
  series: [
    {
      name: "",
      data: [],
      type: "bar",
      barWidth: 4,
      stack: "b",
      z: 3,
      yAxisIndex: 0,
      showBackground: false,
      backgroundStyle: {
        color: "rgba(180, 180, 180, 0.2)",
      },
      label: {
        show: true,
        position: "top",
        distance: 15,
        color: "#ffffff",
        fontSize: 10,
      },
      itemStyle: {
        borderRadius: 2,
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: "#19FFC6" },
          { offset: 1, color: "#33AAFF" },
        ]),
      },
    },
    {
      type: "custom",
      renderItem: (params, api) => {
        const categoryIndex = api.value(0)

        const categoryData = api.value(1)

        const basicsCoord = api.coord([categoryIndex, categoryData])

        const topBasicsYAxis = basicsCoord[1]

        const basicsXAxis = basicsCoord[0]

        return {
          type: "image",
          style: {
            x: basicsXAxis - 4.5,
            y: topBasicsYAxis - 9,
            width: 10,
            height: 10,
            image:
              "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAAAXNSR0IArs4c6QAAAL1JREFUOE9j/P///38GMgAjSKOMdxRJWp9sXcYA18giJMLw99MHhv9//mA1hJGZhYGZX4Dhz7s3DCgaGVlYGDjVtBi+37rO8P/PbxTNjCysDJyqWgzfb18Dy6FoBKmEKfh17wZcM0iMTUkDrgmkDkMjSJCFnZ3hwbr5KDYqBCUy/Pn5Ey6GVSMzMxPDw01LUDTK+8Uw/P37j0YayXIqWYGDHuTInsQbHeAE8PEDw/+/JCYAUtIcPDpI0QRTCwDhurXXJ/EmUwAAAABJRU5ErkJggg==",
          },
        }
      },
      xAxisIndex: 1,
      data: [],
    },
    {
      type: "bar",
      barWidth: 32,
      xAxisIndex: 1,
      barGap: "-220%",
      data: [],
      // 设置高亮样式
      emphasis: {
        focus: "none",
        itemStyle: { color: "rgba(255,255,255,0.8)" },
      },
      itemStyle: {
        color: "rgba(122,140,153,0.6)",
        opacity: 0.1,
      },
      z: 0,
    },
  ],
})

const fetchData = async () => {
  try {
    const { data } = await request.get(API.CMP_DIFFERENCES)

    const labels = data.map(i => i._id)
    const values = data.map(i => i.count)
    const max = safeMax(values)

    option.value.xAxis[0].data = labels
    option.value.series[0].data = values
    option.value.series[1].data = values.map((v, i) => [i, v])
    option.value.series[2].data = values.map(() => max)
  } catch (err) {
    console.error("获取证照不符数量失败：", err)
  }
}

onMounted(fetchData)
</script>
<style lang="scss"></style>
