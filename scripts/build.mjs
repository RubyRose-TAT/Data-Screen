import { spawn } from "node:child_process"

const child = spawn("vite", ["build"], {
  shell: true,
  env: {
    ...process.env,
    SASS_SILENCE_DEPRECATIONS: "legacy-js-api",
  },
})

let suppressNextInfoLine = false

function forward(stream, writer) {
  let buffer = ""
  stream.on("data", (chunk) => {
    buffer += chunk.toString()
    const lines = buffer.split("\n")
    buffer = lines.pop() ?? ""

    for (const line of lines) {
      if (line.includes("DEPRECATION WARNING [legacy-js-api]")) {
        suppressNextInfoLine = true
        continue
      }
      if (suppressNextInfoLine && line.includes("More info: https://sass-lang.com/d/legacy-js-api")) {
        suppressNextInfoLine = false
        continue
      }
      if (line.trim() === "" && suppressNextInfoLine) {
        continue
      }
      writer(`${line}\n`)
    }
  })

  stream.on("end", () => {
    if (buffer.trim()) {
      writer(`${buffer}\n`)
    }
  })
}

forward(child.stdout, (line) => process.stdout.write(line))
forward(child.stderr, (line) => process.stderr.write(line))

child.on("close", (code) => {
  process.exit(code ?? 1)
})
