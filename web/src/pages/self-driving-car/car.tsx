import { Controls } from "./controls"

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

  constructor(x: number, y: number, width: number, height: number) {
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
  }

  update() {
    this.#move()
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save()
    ctx.translate(this.x, this.y)
    ctx.rotate(-this.angle)
    ctx.beginPath()

    ctx.rect(-this.width / 2, -this.height / 2, this.width, this.height)
    ctx.fill()

    ctx.restore()
  }

  #move() {
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
