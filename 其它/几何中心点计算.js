import fs from "fs";

// 读取 GeoJSON
const geojson = JSON.parse(
  fs.readFileSync("./赣州市.json", { encoding: "utf-8" })
);

// 计算 GeoJSON 中心点（平均坐标法）
function computeGeoJSONCenter(geoJSON) {
  let total = 0;
  let sumLng = 0;
  let sumLat = 0;

  geoJSON.features.forEach((feature) => {
    const geom = feature.geometry;
    let coords = [];

    if (geom.type === "Polygon") {
      coords = geom.coordinates[0];
    } else if (geom.type === "MultiPolygon") {
      coords = geom.coordinates[0][0];
    } else {
      return;
    }

    coords.forEach(([lng, lat]) => {
      sumLng += lng;
      sumLat += lat;
      total++;
    });
  });

  return {
    lng: sumLng / total,
    lat: sumLat / total,
  };
}

const center = computeGeoJSONCenter(geojson);

console.log("📍 赣州市行政区域几何中心点（centroid）：");
console.log(center);
