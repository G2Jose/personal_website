import { Car } from "./car"
import { Line, Point } from "./types"
import { linearInterpolate } from "./utils"

export class Sensors {
  numRays: number
  rays: Line[]
  fieldOfView: number
  range: number
  car: Car

  constructor(car: Car, fieldOfView: number, numRays: number, range: number) {
    this.car = car
    this.fieldOfView = fieldOfView
    this.numRays = numRays
    this.range = range
    this.rays = []
  }

  #updateRays() {
    this.rays = new Array(this.numRays).fill(undefined).map((_, i) => {
      const angle =
        this.car.angle +
        linearInterpolate(
          +this.fieldOfView / 2,
          -this.fieldOfView / 2,
          this.numRays === 1 ? 0.5 : i / (this.numRays - 1)
        )

      const start = { x: this.car.x, y: this.car.y }
      const end = {
        x: this.car.x - Math.sin(angle) * this.range,
        y: this.car.y - Math.cos(angle) * this.range,
      }

      return { start, end }
    })
  }

  draw(context: CanvasRenderingContext2D) {
    this.#updateRays()
    this.rays.map(ray => {
      context.setLineDash([])
      context.lineWidth = 2
      context.strokeStyle = "#fff8d6"
      context.beginPath()
      context.moveTo(ray.start.x, ray.start.y)
      context.lineTo(ray.end.x, ray.end.y)
      context.stroke()
    })
  }
}
