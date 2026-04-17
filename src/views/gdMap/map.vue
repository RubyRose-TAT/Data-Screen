<template>
  <div class="map">
    <canvas id="canvasMap"></canvas>
    <div v-if="drilledDown" class="drill-back" @click="handleDrillUp">
      <span class="drill-back-icon">←</span>
      <span>返回上级</span>
    </div>
    <div v-if="drillLoading" class="drill-loading">县级地图加载中...</div>
  </div>
</template>
<script setup>
import { onMounted, shallowRef, onBeforeUnmount, ref } from "vue";
import { World } from "./map.js";
import emitter from "@/utils/emitter";
const worldInstance = shallowRef(null);
const drilledDown = ref(false);
const drilledName = ref("");
const drillLoading = ref(false);
onMounted(() => {
  emitter.$on("loadMap", loadMap);
  emitter.$on("mapDrillDown", onDrillDown);
  emitter.$on("mapDrillUp", onDrillUp);
  emitter.$on("mapDrillLoading", onDrillLoading);
});
onBeforeUnmount(() => {
  if (worldInstance.value) {
    worldInstance.value.destroy();
    worldInstance.value = null;
  }
  emitter.$off("loadMap", loadMap);
  emitter.$off("mapDrillDown", onDrillDown);
  emitter.$off("mapDrillUp", onDrillUp);
  emitter.$off("mapDrillLoading", onDrillLoading);
});
function loadMap(assets) {
  worldInstance.value = new World(document.getElementById("canvasMap"), assets);
  worldInstance.value.time.pause();
}
async function play() {
  worldInstance.value.time.resume();
  worldInstance.value.animateTl.timeScale(1);
  worldInstance.value.animateTl.play();
}
function handleDrillUp() {
  if (worldInstance.value) {
    worldInstance.value.drillUp();
  }
}
function onDrillDown({ name }) {
  drilledDown.value = true;
  drilledName.value = name;
}
function onDrillUp() {
  drilledDown.value = false;
  drilledName.value = "";
}
function onDrillLoading(loading) {
  drillLoading.value = Boolean(loading);
}
defineExpose({
  loadMap,
  play,
  worldInstance,
});
</script>

<style lang="scss">
$drill-title-zh-size: 24px;
$drill-title-en-size: 9px;

.map {
  position: absolute;
  z-index: 1;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background-color: #000;

  .drill-back {
    position: absolute;
    // 放到顶部第一张统计卡（证照不符总数）下方
    top: 176px;
    left: calc(50% - 340px);
    transform: translateX(-50%);
    z-index: 2000;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    width: 220px;
    padding: 8px 16px;
    background: rgba(8, 33, 58, 0.35);
    border: 1px solid rgba(115, 208, 255, 0.4);
    border-radius: 4px;
    color: #73d0ff;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      background: rgba(8, 33, 58, 0.5);
      border-color: rgba(115, 208, 255, 0.8);
    }

    .drill-back-icon {
      font-size: 16px;
      font-weight: bold;
    }
  }

  .drill-loading {
    position: absolute;
    top: 220px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 2001;
    padding: 8px 18px;
    color: #d5f6ff;
    font-size: 13px;
    letter-spacing: 1px;
    background: rgba(8, 33, 58, 0.72);
    border: 1px solid rgba(115, 208, 255, 0.45);
    border-radius: 4px;
  }

  .info-point {
    background: rgba(0, 0, 0, 0.5);
    color: #a3dcde;
    font-size: 14px;
    width: 170px;
    height: 106px;
    padding: 16px 12px 0;
    margin-bottom: 30px;
    will-change: transform;
    &-wrap {
      &:after,
      &:before {
        display: block;
        content: "";
        position: absolute;
        top: 0;
        width: 15px;
        height: 15px;
        border-top: 1px solid #4b87a6;
      }
      &:before {
        left: 0;
        border-left: 1px solid #4b87a6;
      }
      &:after {
        right: 0;
        border-right: 1px solid #4b87a6;
      }
      &-inner {
        &:after,
        &:before {
          display: block;
          content: "";
          position: absolute;
          bottom: 0;
          width: 15px;
          height: 15px;
          border-bottom: 1px solid #4b87a6;
        }
        &:before {
          left: 0;
          border-left: 1px solid #4b87a6;
        }
        &:after {
          right: 0;
          border-right: 1px solid #4b87a6;
        }
      }
    }
    &-line {
      position: absolute;
      top: 7px;
      right: 12px;
      display: flex;
      .line {
        width: 5px;
        height: 2px;
        margin-right: 5px;
        background: #17e5c3;
      }
    }
    &-content {
      .content-item {
        display: flex;
        height: 28px;
        line-height: 28px;
        background: rgba(35, 47, 58, 0.6);
        margin-bottom: 5px;
        .label {
          width: 60px;
          padding-left: 10px;
        }
        .value {
          color: #ffffff;
        }
      }
    }
  }
  .provinces-label {
    &-wrap {
      transform: translate(50%, 200%);
      opacity: 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 18px;
      width: 200px;
      height: 53px;
      border-radius: 30px 30px 30px 0px;
      background: rgba(0, 0, 0, 0.4);
    }
    .number {
      color: #fff;
      font-size: 30px;
      font-weight: 700;

      .unit {
        color: #fff;
        font-size: 12px;
        font-weight: 400;
        opacity: 0.5;
        padding-left: 5px;
      }
    }
    .name {
      color: #fff;
      font-size: 16px;
      font-weight: 700;
      span {
        display: block;
      }
      .en {
        color: #fff;
        font-size: 10px;
        opacity: 0.5;
        font-weight: 700;
      }
    }
    .no {
      color: #7efbf6;
      text-shadow: 0 0 5px #7efbf6, 0 0 10px #7efbf6;
      font-size: 30px;
      font-weight: 700;
    }
    .yellow {
      .no {
        color: #fef99e !important;
        text-shadow: 0 0 5px #fef99e, 0 0 10px #fef99e !important;
      }
    }
  }

  .china-label {
    color: #fff;

    font-size: 12px;
    will-change: transform;
    .other-label {
      display: flex;
      align-items: center;
      padding: 5px;
      border-radius: 4px;
      background: rgba(0, 0, 0, 0.6);
      will-change: transform;
    }

    &.blur {
      filter: blur(2px);
      opacity: 0.5;
    }
    .label-icon {
      display: block;
      width: 20px;
      height: 20px;
      margin: 0 10px 0 0;
    }
  }
  .map-label {
    padding: 5px;
    color: #fff;
    will-change: transform;
    font-size: 36px;
    font-weight: bold;
    letter-spacing: 4.5px;
    -webkit-box-reflect: below 0 -webkit-linear-gradient(transparent, transparent
          20%, rgba(255, 255, 255, 0.3));
    .other-label {
      display: flex;
      flex-direction: column;
      &.drill-title {
        span {
          font-size: $drill-title-zh-size;
          &:last-child {
            font-size: $drill-title-en-size;
          }
        }
      }
    }
    span {
      font-size: 46px;
      &:last-child {
        font-size: 12px;
        font-weight: normal;
        letter-spacing: 0px;
        color: #a7d5ef;
      }
    }
  }
  .decoration-label {
    // &.reflect {
    //   -webkit-box-reflect: below 0 -webkit-linear-gradient(transparent, transparent 20%, rgba(255, 255, 255, 0.3));
    // }
    // padding-bottom: 10px;
    .label-icon {
      display: block;
      width: 40px;
      height: 40px;
    }
  }
  .other-label {
    transform: translateY(200%);
    opacity: 0;
    background: none;
    will-change: transform;
  }
}
</style>
