import { execSync } from "node:child_process"
import { readFileSync } from "node:fs"

const files = execSync("rg --files src vite.config.js", { encoding: "utf8" })
  .split("\n")
  .filter(Boolean)
  .filter((file) => file.endsWith(".js") || file.endsWith(".mjs") || file.endsWith(".vue"))

const violations = []

for (const file of files) {
  const content = readFileSync(file, "utf8")
  const lines = content.split("\n")
  let isInBlockComment = false
  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i]
    const line = rawLine.trim()

    if (line.includes("/*")) {
      isInBlockComment = true
    }

    if (isInBlockComment || line.startsWith("//")) {
      if (line.includes("*/")) {
        isInBlockComment = false
      }
      continue
    }
    if (/\bdebugger\b/.test(line)) {
      violations.push(`${file}:${i + 1} found debugger statement`)
    }
    if (/console\.log\(/.test(line)) {
      violations.push(`${file}:${i + 1} found console.log call`)
    }
  }

  if (file.endsWith(".js") || file.endsWith(".mjs")) {
    execSync(`node --check "${file}"`, { stdio: "ignore" })
  }
}

if (violations.length > 0) {
  console.error("Lint failed:")
  for (const violation of violations) {
    console.error(`- ${violation}`)
  }
  process.exit(1)
}

console.log(`Lint passed (${files.length} files checked).`)
