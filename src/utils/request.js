import axios from "axios"

const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
})

export const API = {
  CMP_UNIT: "/cmp/unit",
  CMP_DIFFERENCES: "/cmp/differences",
}

export const isValidUnit = (item) =>
  item["单位"] &&
  item["单位"] !== "全市" &&
  item["单位"] !== "未知" &&
  item["单位"] !== "未知单位"

export const safeMax = (arr) =>
  arr.reduce((a, b) => Math.max(a, b), -Infinity)

export default request
