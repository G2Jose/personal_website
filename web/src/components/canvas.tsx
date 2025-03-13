import React, {
  CanvasHTMLAttributes,
  DetailedHTMLProps,
  useCallback,
  useEffect,
  useRef,
} from "react"
import { Car } from "../pages/self-driving-car/car"
import { Road } from "../pages/self-driving-car/road"
import { Sensors } from "../pages/self-driving-car/sensors"

const CANVAS_WIDTH = 200
const CANVAS_HEIGHT = window.innerHeight

export const Canvas = (
  props: DetailedHTMLProps<
    CanvasHTMLAttributes<HTMLCanvasElement>,
    HTMLCanvasElement
  >
) => {
  const previousCanvasRef = useRef<HTMLCanvasElement | null>(null)

  const animate = useCallback(
    (
      context: CanvasRenderingContext2D,
      car: Car,
      road: Road,
      sensors: Sensors
    ) => {
      car.update()
      context.canvas.height = window.innerHeight

      context.save()
      context.translate(0, -car.y + context.canvas.height * 0.7)

      road.draw(context)
      car.draw(context)
      sensors.draw(context)

      context.restore()

      requestAnimationFrame(() => animate(context, car, road, sensors))
    },
    []
  )

  const canvasRef = useCallback((canvas: HTMLCanvasElement) => {
    if (previousCanvasRef.current) {
      const canvas = previousCanvasRef.current
      const context = canvas.getContext("2d")
      context?.clearRect(0, 0, canvas.width, canvas.height)
    }
    if (canvas) {
      previousCanvasRef.current = canvas
      const context = canvas?.getContext("2d")

      if (context) {
        const road = new Road(canvas.width / 2, canvas.width * 0.9, 3)
        const car = new Car(road.getLaneCenterX(1), 100, 30, 50)
        const sensors = new Sensors(car, Math.PI / 2, 50, 200)
        animate(context, car, road, sensors)
      }
    }
  }, [])

  return (
    <canvas
      {...props}
      ref={canvasRef}
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
      style={{
        backgroundColor: "lightgray",
        alignSelf: "center",
      }}
    />
  )
}
