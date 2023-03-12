import { compact } from "lodash"
import { Car } from "./car"
import { Line, Point, SensorReading } from "./types"
import {
  getIntersection,
  getLinesFromPolygon,
  linearInterpolate,
} from "./utils"

export class Sensors {
  numRays: number
  rays: Line[]
  fieldOfView: number
  range: number
  car: Car
  readings: SensorReading[]

  constructor(car: Car, fieldOfView: number, numRays: number, range: number) {
    this.car = car
    this.fieldOfView = fieldOfView
    this.numRays = numRays
    this.range = range
    this.rays = []
    this.readings = []
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

  draw(context: CanvasRenderingContext2D, roadBorders: Line[], traffic: Car[]) {
    this.#updateRays()

    this.rays.map((ray, index) => {
      const reading = this.readings[index]

      context.setLineDash([])
      context.lineWidth = 2
      context.strokeStyle = "#fff8d6"
      context.beginPath()
      context.moveTo(ray.start.x, ray.start.y)

      if (reading) {
        context.lineTo(reading.x, reading.y)
        context.stroke()

        context.strokeStyle = "red"
        context.beginPath()
        context.moveTo(reading.x, reading.y)
        context.lineTo(ray.end.x, ray.end.y)
        context.stroke()
      } else {
        context.lineTo(ray.end.x, ray.end.y)
        context.stroke()
      }
    })

    this.readings = this.rays.map(ray =>
      this.#read(ray, [
        ...roadBorders,
        ...traffic.map(car => getLinesFromPolygon(car.polygon)).flat(),
      ])
    )
  }

  #read(ray: Line, lines: Line[]) {
    const touches = lines
      .map(border => getIntersection(ray, border))
      .filter(Boolean)

    const offsets = touches.map(touch => touch?.offset || Infinity)

    if (!offsets.length) {
      return null
    }

    const minOffset = Math.min(...offsets)
    return touches.find(touch => touch?.offset === minOffset) || null
  }
}
