import { readdirSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

async function runBenchmarks() {
  const benchmarkDir = __dirname
  const files = readdirSync(benchmarkDir)

  for (const file of files) {
    if (file.endsWith('.benchmark.ts')) {
      const { runBenchmarks } = await import(join(benchmarkDir, file))
      runBenchmarks()
    }
  }
}

runBenchmarks()
