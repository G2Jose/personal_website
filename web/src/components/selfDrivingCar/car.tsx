import { Controls } from "./controls"
import { Line, Point, Polygon, PolygonSize } from "./types"
import { doesLineIntersectWithPolygon } from "./utils"

const ANGLE_STEP_SIZE = 0.03
const MAX_SPEED = 9
const FRICTION = 0.02
const ACCELERATION = 0.2

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

  constructor(center: Point, size: PolygonSize, roadBorders: Line[]) {
    const { x, y } = center
    const { width, height } = size
    this.x = x
    this.y = y
    this.width = width
    this.height = height

    this.speed = 0
    this.acceleration = ACCELERATION
    this.maxSpeed = MAX_SPEED
    this.friction = FRICTION

    this.angle = 0

    this.controls = new Controls()
    this.polygon = this.#createPolygon()
    this.damaged = false
    this.roadBorders = roadBorders
  }

  update() {
    this.damaged = this.#assessDamaged()
    this.#move()
    this.polygon = this.#createPolygon()
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath()
    const [p1, p2, p3, p4] = this.polygon
    ctx.moveTo(p1.x, p1.y)
    ;[p2, p3, p4].forEach(point => {
      ctx.lineTo(point.x, point.y)
    })

    ctx.fillStyle = this.damaged ? "grey" : "black"

    ctx.fill()
  }

  #assessDamaged() {
    return this.roadBorders.some(border =>
      doesLineIntersectWithPolygon(border, this.polygon)
    )
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
    if (this.damaged) {
      return
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
