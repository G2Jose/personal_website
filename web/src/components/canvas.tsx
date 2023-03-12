import React, {
  CanvasHTMLAttributes,
  DetailedHTMLProps,
  useCallback,
  useEffect,
  useRef,
} from "react"
import { Car } from "./selfDrivingCar/car"
import { Road } from "./selfDrivingCar/road"
import { Sensors } from "./selfDrivingCar/sensors"

const CANVAS_WIDTH = 200

const isBrowser = typeof window !== "undefined"

const CANVAS_HEIGHT = isBrowser ? window.innerHeight : "700px"

export const Canvas = (
  props: DetailedHTMLProps<
    CanvasHTMLAttributes<HTMLCanvasElement>,
    HTMLCanvasElement
  >
) => {
  const previousCanvasRef = useRef<HTMLCanvasElement | null>(null)

  const animate = useCallback(
    ({
      context,
      car,
      road,
      sensors,
      traffic,
    }: {
      context: CanvasRenderingContext2D
      car: Car
      road: Road
      sensors: Sensors
      traffic: Car[]
    }) => {
      car.update(traffic)

      traffic.forEach(c => c.update([...traffic, car]))

      context.canvas.height = window.innerHeight

      context.save()
      context.translate(0, -car.y + context.canvas.height * 0.7)

      road.draw(context)
      car.draw(context)

      traffic.forEach(car => car.draw(context))

      sensors.draw(context, road.borders, traffic)

      context.restore()

      requestAnimationFrame(() =>
        animate({ context, car, road, sensors, traffic })
      )
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
        const car = new Car({
          center: { x: road.getLaneCenterX(1), y: 100 },
          size: { width: 30, height: 50 },
          roadBorders: road.borders,
          controllable: true,
        })

        const traffic = [
          new Car({
            center: { x: road.getLaneCenterX(2), y: 100 },
            size: { width: 30, height: 50 },
            roadBorders: road.borders,
          }),
        ]

        const sensors = new Sensors(car, Math.PI / 2, 50, 200)
        animate({ context, car, road, sensors, traffic })
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
