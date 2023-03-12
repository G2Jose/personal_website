export class Level {
  inputs: number[]
  outputs: number[]
  biases: number[]

  weights: number[][]

  constructor(inputCount: number, outputCount_: number) {
    const outputCount = outputCount_ ?? inputCount
    this.inputs = new Array(inputCount)
    this.outputs = new Array(outputCount)

    this.biases = new Array(outputCount)
      .fill(undefined)
      .map(_ => Math.random() * 2 - 1)

    this.weights = this.inputs
      .fill(0)
      .map(_ =>
        new Array(outputCount).fill(undefined).map(_ => Math.random() * 2 - 1)
      )
  }

  static feedForward(inputs: number[], level: Level) {
    level.inputs = inputs

    level.outputs = new Array(level.outputs.length)
      .fill(undefined)
      .map((x, i) => {
        const sum = level.inputs.reduce((acc, curr, j) => {
          return acc + curr * level.weights[j][i]
        }, 0)

        if (sum > level.biases[i]) return 1
        else return 0
      })

    return level.outputs
  }
}

export class NeuralNetwork {
  levels: Level[]

  constructor(neuronCounts: number[]) {
    this.levels = new Array(neuronCounts.length).fill(undefined).map((x, i) => {
      return new Level(neuronCounts[i], neuronCounts[i + 1])
    })
  }

  getOutputs() {
    const lastLevel = this.levels[this.levels.length - 1]

    return lastLevel.outputs
  }

  static feedForward(inputs: number[], network: NeuralNetwork) {
    return network.levels.reduce((previousLevelOutput, currentLevel) => {
      const outputs = Level.feedForward(previousLevelOutput, currentLevel)

      return outputs
    }, inputs)
  }
}
