import { Line } from "./types"
import { linearInterpolate } from "./utils"

const INFINITY = 1000000
const MARKER_WIDTH = 5

export class Road {
  x: number
  width: number
  numLanes: number
  left: number
  right: number
  top: number
  bottom: number
  borders: Line[]

  constructor(x: number, width: number, numLanes: number) {
    this.x = x
    this.width = width
    this.numLanes = numLanes

    this.left = x - width / 2
    this.right = x + width / 2

    this.top = -INFINITY
    this.bottom = INFINITY

    const topLeft = { x: this.left, y: this.top }
    const bottomLeft = { x: this.left, y: this.bottom }
    const topRight = { x: this.right, y: this.top }
    const bottomRight = { x: this.right, y: this.bottom }

    this.borders = [
      { start: topLeft, end: bottomLeft },
      { start: topRight, end: bottomRight },
    ]
  }

  draw(context: CanvasRenderingContext2D) {
    context.lineWidth = MARKER_WIDTH
    context.strokeStyle = "white"

    this.borders.map(line => {
      context.setLineDash([])
      context.beginPath()
      context.moveTo(line.start.x, line.start.y)
      context.lineTo(line.end.x, line.end.y)
      context.stroke()
    })

    new Array(this.numLanes - 1).fill(undefined).map((_, i) => {
      const x = linearInterpolate(
        this.left,
        this.right,
        (i + 1) / this.numLanes
      )

      context.setLineDash([20, 20])

      context.beginPath()
      context.moveTo(x, this.top)
      context.lineTo(x, this.bottom)
      context.stroke()
    })
  }

  getLaneCenterX(index: number) {
    const laneWidth = this.width / this.numLanes
    return this.left + laneWidth / 2 + index * laneWidth
  }
}
