<template>
  <div class="map-level">
    <canvas id="canvas"></canvas>
    <div class="return-btn" @click="goBack">返回上一级</div>
    <div class="map-btn-group">
      <div class="btn" :class="{ active: state.bar }" @click="setEffectToggle('bar')">柱状图</div>
      <div class="btn" :class="{ active: state.flyLine }" @click="setEffectToggle('flyLine')">飞线</div>
      <div class="btn" :class="{ active: state.scatter }" @click="setEffectToggle('scatter')">散点图</div>
      <div class="btn" :class="{ active: state.card }" @click="setEffectToggle('card')">标牌</div>
      <div class="btn" :class="{ active: state.particle }" @click="setEffectToggle('particle')">粒子特效</div>
      <div class="btn" :class="{ active: state.path }" @click="setEffectToggle('path')">路径轨迹</div>
      <div class="btn" :class="{ active: state.mirror }" @click="setEffectToggle('mirror')">倒影</div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, onBeforeUnmount, reactive } from "vue"
import { World } from "./map"
let app = null

const state = reactive({
  bar: true, // 柱状图
  flyLine: false, // 飞线
  scatter: false, // 散点图
  card: false, // 标牌
  particle: false, // 粒子
  mirror: false, // 倒影
  path: false, // 路径轨迹
})
const setEffectToggle = (type) => {
  console.log(app.currentScene)
  if (["bar", "flyLine", "scatter", "card", "path"].includes(type) && app && app.currentScene === "childScene") {
    return false
  }
  // 设置按钮状态
  state[type] = !state[type]

  if (type === "bar") {
    app.barGroup.visible = state[type]
    app.setLabelVisible("labelGroup", state[type])
  }
  if (type === "particle") {
    app.particles.enable = state[type]
    app.particles.instance.visible = state[type]
  }
  if (type === "flyLine") {
    app.flyLineGroup.visible = state[type]
    app.flyLineFocusGroup.visible = state[type]
  }
  if (type === "scatter") {
    app.scatterGroup.visible = state[type]
  }
  if (type === "card") {
    app.setLabelVisible("badgeGroup", state[type])
  }
  if (type === "mirror") {
    app.groundMirror.visible = state[type]
  }
  if (type === "path") {
    app.pathLineGroup.visible = state[type]
  }
}
// 设置按钮启用和禁用
const setEnable = (bool) => {
  state.bar = bool
  state.flyLine = bool
  state.scatter = bool
  state.card = bool
  state.path = bool
}
// 返回上一级
const goBack = () => {
  app && app.goBack()
}
onMounted(() => {
  app = new World(document.getElementById("canvas"), {
    geoProjectionCenter: [108.55, 34.32],
    setEnable: setEnable,
  })
})
onBeforeUnmount(() => {
  app && app.destroy()
})
</script>

<style lang="scss">
.map-level {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  #canvas {
    width: 100%;
    height: 100%;
    background: #000;
  }
}

// 返回按钮
.return-btn {
  position: absolute;
  left: 50%;
  bottom: 10px;
  transform: translateX(-50%);
  padding: 5px 24px;
  color: #fff;
  border: 1px solid #2bc4dc;
  margin-bottom: 10px;
  font-size: 12px;
  text-align: center;
  opacity: 0.5;
  display: none;
  cursor: pointer;
  transition: all 0.3s;
  &:hover {
    opacity: 1;
  }
}
// 右侧按钮组
.map-btn-group {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  .btn {
    padding: 5px 12px;
    color: #fff;
    border: 1px solid #2bc4dc;
    margin-bottom: 10px;
    font-size: 12px;
    text-align: center;
    opacity: 0.5;
    cursor: pointer;
    transition: all 0.3s;
    &.active {
      opacity: 1;
    }
  }
}
// 信息框
.info-point {
  background: rgba(0, 0, 0, 0.5);
  color: #a3dcde;
  font-size: 14px;
  width: 170px;
  height: 106px;
  padding: 16px 12px 0;
  margin-bottom: 30px;
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
        color: #fff;
      }
    }
  }
}
// 标牌
.badges-label {
  z-index: 99999;
  &-outline {
    position: absolute;
  }
  &-wrap {
    position: relative;
    padding: 10px 10px;
    background: #0e1937;
    border: 1px solid #1e7491;
    font-size: 12px;
    font-weight: bold;
    color: #fff;
    // margin-bottom: 50px;
    bottom: 50px;
    z-index: 99999;
    span {
      color: #ffe70b;
    }
    &:after {
      position: absolute;
      right: 0;
      bottom: 0;
      width: 10px;
      height: 10px;
      display: block;
      content: "";
      border-right: 2px solid #6cfffe;
      border-bottom: 2px solid #6cfffe;
    }
    &:before {
      position: absolute;
      left: 0;
      top: 0;
      width: 10px;
      height: 10px;
      display: block;
      content: "";
      border-left: 2px solid #6cfffe;
      border-top: 2px solid #6cfffe;
    }
    .icon {
      position: absolute;
      width: 27px;
      height: 20px;
      left: 50%;
      transform: translateX(-13px);
      bottom: -40px;
    }
  }
}

.area-name-label {
  &-wrap {
    color: #5fc6dc;
    opacity: 1;
    text-shadow: 1px 1px 0px #000;
  }
}
.provinces-name-label {
  &-wrap {
    color: #5fc6dc;
    opacity: 0;
    text-shadow: 1px 1px 0px #000;
  }
}
.provinces-label-style02 {
  z-index: 2;
  &-wrap {
    transform: translate(0%, 200%);
    opacity: 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 40px;
    z-index: 2;
  }
  .number {
    color: #fff;
    font-size: 18px;
    font-weight: 700;
    margin-bottom: 10px;
    /* .unit {
      color: #fff;
      font-size: 12px;
      font-weight: 400;
      opacity: 0.5;
      padding-left: 5px;
    } */
  }

  .no {
    display: flex;
    justify-content: center;
    align-items: center;
    color: #7efbf6;
    /* text-shadow: 0px 0px 4px 0px #7efbf6; */
    text-shadow: 0 0 5px #7efbf6;
    font-size: 16px;
    /* font-weight: 700; */
    width: 30px;
    height: 30px;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 50%;
    border: 2px solid rgba(255, 255, 255, 0.5);
  }
  .yellow {
    .no {
      color: #fef99e !important;
      text-shadow: 0 0 5px #fef99e !important;
    }
  }
}

.fixed-loading {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 99;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
}
.page-loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 60px;
  height: 60px;
  background: rgba(0, 0, 0, 0.8);
  border-radius: 10px;
}
.page-loading {
  width: 30px;
  height: 30px;
  border: 2px solid #fff;
  border-top-color: transparent;
  border-radius: 100%;
  animation: loading infinite 0.75s linear;
}

@keyframes loading {
  from {
    transform: rotate(0);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>
