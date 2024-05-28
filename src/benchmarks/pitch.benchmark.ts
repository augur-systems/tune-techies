import Benchmark from 'benchmark'
import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const outputDir = join(__dirname, '../../benchmark-results')
console.error('outputDir', outputDir)
if (!existsSync(outputDir)) {
  mkdirSync(outputDir, { recursive: true })
}

function customReporter(results: Benchmark.Suite) {
  const output = JSON.stringify(
    results.map((bench: Benchmark.Target) => ({
      name: bench.name || 'Unnamed benchmark',
      count: bench.count,
      cycles: bench.cycles,
      hz: bench.hz,
      stats: {
        moe: bench.stats?.moe,
        rme: bench.stats?.rme,
        deviation: bench.stats?.deviation,
        mean: bench.stats?.mean,
        variance: bench.stats?.variance,
      },
    })),
    null,
    2
  )

  const outputPath = join(outputDir, `${results.name || 'results'}.json`)
  writeFileSync(outputPath, output)
}

export async function runBenchmarks() {
  const suite = new Benchmark.Suite('Pitch')

  suite.add('Example Test', function () {
    // Example test
    let x = 0
    for (let i = 0; i < 1000; i++) {
      x += i
    }
  })

  suite.on('complete', function (this: Benchmark.Suite) {
    customReporter(this)
    console.log('Fastest is ' + this.filter('fastest').map('name'))
  })

  suite.run({ async: true })
}
