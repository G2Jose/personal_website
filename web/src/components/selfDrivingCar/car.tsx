import { Controls } from "./controls"
import { NeuralNetwork } from "./neuralNetwork"
import { Sensors } from "./sensors"
import { Line, Point, Polygon, PolygonSize } from "./types"
import { doesLineIntersectWithPolygon, getLinesFromPolygon } from "./utils"

const ANGLE_STEP_SIZE = 0.03
const MAX_SPEED = 9
const MAX_SPEED_TRAFFIC = MAX_SPEED / 2
const FRICTION = 0.02
const ACCELERATION = 0.2

const NUM_SENSORS = 5

class Car {
  x: number
  y: number
  width: number
  height: number

  speed: number
  acceleration: number
  angle: number
  maxSpeed: number
  friction: number

  controls: Controls

  polygon: Polygon

  damaged: boolean
  roadBorders: Line[]

  color: string

  identifier: string

  neuralNetwork?: NeuralNetwork

  sensors: Sensors

  type: "traffic" | "primary"

  constructor({
    center,
    size,
    roadBorders,
    color = "blue",
    type,
  }: {
    center: Point
    size: PolygonSize
    roadBorders: Line[]
    color?: string
    type: "traffic" | "primary"
  }) {
    this.identifier = crypto.randomUUID()
    this.type = type
    const { x, y } = center
    const { width, height } = size
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.color = color

    this.speed = 0
    this.acceleration = ACCELERATION
    this.maxSpeed = type === "primary" ? MAX_SPEED : MAX_SPEED_TRAFFIC
    this.friction = FRICTION

    this.angle = 0

    this.controls = new Controls(
      type === "primary" ? "primary-ai" : "traffic-ai"
    )
    this.sensors = new Sensors(this, Math.PI / 2, NUM_SENSORS, 200)

    if (type === "primary") {
      this.neuralNetwork = new NeuralNetwork([this.sensors.numRays, 6, 4])
    }

    this.polygon = this.#createPolygon()
    this.damaged = false
    this.roadBorders = roadBorders
  }

  update(traffic: Car[]) {
    this.damaged = this.#assessDamaged(traffic) || this.damaged
    this.#move()

    this.polygon = this.#createPolygon()

    if (this.neuralNetwork) {
      const offsets = this.sensors.readings.map(reading =>
        reading?.offset ? 1 - reading.offset : 0
      )

      NeuralNetwork.feedForward(offsets, this.neuralNetwork)
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath()
    const [p1, p2, p3, p4] = this.polygon
    ctx.moveTo(p1.x, p1.y)
    ;[p2, p3, p4].forEach(point => {
      ctx.lineTo(point.x, point.y)
    })

    ctx.fillStyle =
      this.damaged && this.type === "primary" ? "grey" : this.color

    ctx.fill()
  }

  #assessDamaged(traffic: Car[]) {
    const damagedFromRoad = this.roadBorders.some(border =>
      doesLineIntersectWithPolygon(border, this.polygon)
    )

    const damagedFromTraffic = traffic
      .filter(car => car.identifier !== this.identifier)
      .map(car => {
        const lines = getLinesFromPolygon(car.polygon)
        return lines.some(line =>
          doesLineIntersectWithPolygon(line, this.polygon)
        )
      })
      .reduce((acc, curr) => acc || curr, false)

    return damagedFromTraffic || damagedFromRoad
  }

  #createPolygon() {
    const radius = Math.hypot(this.width, this.height) / 2
    // width / height = tan(angle)
    const alpha = Math.atan2(this.width, this.height)

    return [
      {
        x: this.x - Math.sin(this.angle - alpha) * radius,
        y: this.y - Math.cos(this.angle - alpha) * radius,
      },
      {
        x: this.x - Math.sin(this.angle + alpha) * radius,
        y: this.y - Math.cos(this.angle + alpha) * radius,
      },
      {
        x: this.x - Math.sin(Math.PI + this.angle - alpha) * radius,
        y: this.y - Math.cos(Math.PI + this.angle - alpha) * radius,
      },
      {
        x: this.x - Math.sin(Math.PI + this.angle + alpha) * radius,
        y: this.y - Math.cos(Math.PI + this.angle + alpha) * radius,
      },
    ] as Polygon
  }

  #move() {
    if (this.damaged && this.type === "primary") {
      return
    }

    if (this.neuralNetwork) {
      const outputs = NeuralNetwork.getOutputs(this.neuralNetwork)
      this.controls.forward = outputs[0] > 0
      this.controls.reverse = outputs[1] > 0
      this.controls.left = outputs[2] > 0
      this.controls.right = outputs[3] > 0
    }

    if (this.controls.forward) this.speed += this.acceleration
    if (this.controls.reverse) this.speed -= this.acceleration

    const flip = this.speed ? (this.speed < 0 ? -1 : 1) : 0

    if (this.controls.left) this.angle += ANGLE_STEP_SIZE * flip
    if (this.controls.right) this.angle -= ANGLE_STEP_SIZE * flip

    if (this.speed > this.maxSpeed) this.speed = this.maxSpeed
    if (this.speed < -this.maxSpeed / 2) this.speed = -this.maxSpeed / 2

    if (this.speed > 0) this.speed = Math.max(this.speed - this.friction, 0)
    if (this.speed < 0) this.speed = Math.min(this.speed + this.friction, 0)

    this.x -= Math.sin(this.angle) * this.speed
    this.y -= Math.cos(this.angle) * this.speed
  }
}

export { Car }
