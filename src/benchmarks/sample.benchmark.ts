import benchmark from 'benchmark'
const { Suite } = benchmark

export function runBenchmarks() {
  const suite = new Suite()

  suite.add('example test', function () {
    // Example test
  })

  suite.on('cycle', function (event: any) {
    console.log(String(event.target))
  })

  suite.on('complete', function (this: any) {
    console.log('Fastest is ' + this.filter('fastest').map('name'))
  })

  suite.run({ async: true })
}
