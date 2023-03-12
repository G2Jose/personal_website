import React, {
  CanvasHTMLAttributes,
  DetailedHTMLProps,
  useCallback,
  useRef,
  useState,
} from "react"
import { Car } from "./selfDrivingCar/car"
import { NeuralNetwork } from "./selfDrivingCar/neuralNetwork"
import { Road } from "./selfDrivingCar/road"
import { Sensors } from "./selfDrivingCar/sensors"
import { Visualizer } from "./selfDrivingCar/visualizer"

const CAR_CANVAS_WIDTH = 200
const NN_CANVAS_WIDTH = 400

const isBrowser = typeof window !== "undefined"

const CANVAS_HEIGHT = isBrowser ? window.innerHeight : "700px"

export const Canvas = (
  props: DetailedHTMLProps<
    CanvasHTMLAttributes<HTMLCanvasElement>,
    HTMLCanvasElement
  >
) => {
  const [neuralNetwork, setNeuralNetwork] = useState<NeuralNetwork | undefined>(
    undefined
  )

  const previousCarCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const previousNNCanvasRef = useRef<HTMLCanvasElement | null>(null)

  const animateCar = useCallback(
    ({
      carContext,
      car,
      road,
      sensors,
      traffic,
    }: {
      carContext: CanvasRenderingContext2D
      car: Car
      road: Road
      sensors: Sensors
      traffic: Car[]
    }) => {
      car.update(traffic)

      traffic.forEach(c => c.update([...traffic, car]))

      carContext.canvas.height = window.innerHeight

      carContext.save()
      carContext.translate(0, -car.y + carContext.canvas.height * 0.7)

      road.draw(carContext)
      car.draw(carContext)

      traffic.forEach(car => car.draw(carContext))

      sensors.draw(carContext, road.borders, traffic)

      carContext.restore()

      requestAnimationFrame(() =>
        animateCar({ carContext: carContext, car, road, sensors, traffic })
      )
    },
    []
  )

  const carCanvasRef = useCallback((carCanvas: HTMLCanvasElement) => {
    if (previousCarCanvasRef.current) {
      const canvas = previousCarCanvasRef.current
      const carContext = canvas.getContext("2d")
      carContext?.clearRect(0, 0, canvas.width, canvas.height)
    }
    if (carCanvas) {
      previousCarCanvasRef.current = carCanvas
      const carContext = carCanvas?.getContext("2d")

      if (carContext) {
        const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9, 3)
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

        const sensors = car.sensors
        setNeuralNetwork(car.neuralNetwork)
        animateCar({ carContext: carContext, car, road, sensors, traffic })
      }
    }
  }, [])

  const animateNeuralNetwork = useCallback(
    ({
      neuralNetworkContext,
    }: {
      neuralNetworkContext: CanvasRenderingContext2D
    }) => {
      if (neuralNetwork) {
        Visualizer.drawNetwork(neuralNetworkContext, neuralNetwork)
      }

      requestAnimationFrame(() => {
        animateNeuralNetwork({ neuralNetworkContext })
      })
    },
    [neuralNetwork]
  )

  const nnCanvasRef = useCallback(
    (nnCanvas: HTMLCanvasElement) => {
      if (previousNNCanvasRef.current) {
        const canvas = previousNNCanvasRef.current
        const nnContext = canvas.getContext("2d")
        nnContext?.clearRect(0, 0, canvas.width, canvas.height)
      }
      if (nnCanvas) {
        previousNNCanvasRef.current = nnCanvas
        const nnContext = nnCanvas?.getContext("2d")

        if (nnContext) {
          animateNeuralNetwork({ neuralNetworkContext: nnContext })
        }
      }
    },
    [neuralNetwork]
  )

  return (
    <div>
      <canvas
        {...props}
        ref={carCanvasRef}
        width={CAR_CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        style={{
          backgroundColor: "lightgray",
          alignSelf: "center",
        }}
      />
      <canvas
        {...props}
        ref={nnCanvasRef}
        width={NN_CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        style={{
          backgroundColor: "black",
          alignSelf: "center",
        }}
      />
    </div>
  )
}
