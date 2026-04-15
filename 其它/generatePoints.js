import fs from "fs"

// 读取 ganzhou.json 文件
const geojson = JSON.parse(fs.readFileSync("./public/assets/json/赣州市.json", "utf8"))

// 自动生成 infoData
const infoData = geojson.features.map(f => {
  const name = f.properties.name
  const [lng, lat] = f.properties.centroid // 比 center 更适合落点

  return {
    name,
    level: "正常",
    value: 0,
    lng,
    lat
  }
})

// 自动生成 scatter 点位
const scatterData = geojson.features.map(f => {
  const [lng, lat] = f.properties.centroid
  return {
    value: 1,
    lng,
    lat
  }
})

fs.writeFileSync("./src/views/gdMap/map/infoData.js",
  "export default " + JSON.stringify(infoData, null, 2),
  "utf8"
)

fs.writeFileSync("./src/views/gdMap/map/scatter.js",
  "export default " + JSON.stringify(scatterData, null, 2),
  "utf8"
)

console.log("已生成 infoData.js 和 scatter.js！")
