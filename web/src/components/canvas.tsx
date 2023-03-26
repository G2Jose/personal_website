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
import {
  areNeuralNetworkSizesEqual,
  getFittestCar,
  restoreNeuralNetwork,
  saveNeuralNetwork,
  shouldSaveCarsNeuralNetwork,
} from "./selfDrivingCar/utils"
import { Visualizer } from "./selfDrivingCar/visualizer"

export const Canvas = (
  props: DetailedHTMLProps<
    CanvasHTMLAttributes<HTMLCanvasElement>,
    HTMLCanvasElement
  >
) => {
  const CAR_CANVAS_WIDTH = 200

  const NN_CANVAS_WIDTH = Math.min(
    typeof window !== "undefined" ? window.innerWidth - CAR_CANVAS_WIDTH : 300,
    500
  )

  const CANVAS_HEIGHT = typeof window !== "undefined" ? window.innerHeight : 700

  const [neuralNetwork, setNeuralNetwork] = useState<NeuralNetwork | undefined>(
    undefined
  )

  const previousCarCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const previousNNCanvasRef = useRef<HTMLCanvasElement | null>(null)

  if (
    previousCarCanvasRef.current &&
    previousCarCanvasRef.current.width !== CAR_CANVAS_WIDTH
  ) {
    previousCarCanvasRef.current.width = CAR_CANVAS_WIDTH
  }

  if (
    previousNNCanvasRef.current &&
    previousNNCanvasRef.current.width !== NN_CANVAS_WIDTH
  ) {
    previousNNCanvasRef.current.width = NN_CANVAS_WIDTH
  }

  if (
    previousCarCanvasRef.current &&
    previousCarCanvasRef.current.height !== CANVAS_HEIGHT
  ) {
    previousCarCanvasRef.current.height = CANVAS_HEIGHT
  }

  if (
    previousNNCanvasRef.current &&
    previousNNCanvasRef.current.height !== CANVAS_HEIGHT
  ) {
    previousNNCanvasRef.current.height = CANVAS_HEIGHT
  }

  const fittestCarRef = useRef<Car | null>(null)

  const animateCar = useCallback(
    ({
      carContext,
      cars,
      road,
      sensors,
      traffic,
    }: {
      carContext: CanvasRenderingContext2D
      cars: Car[]
      road: Road
      sensors: Sensors[]
      traffic: Car[]
    }) => {
      cars.forEach(car => car.update(traffic))

      traffic.forEach(c => c.update([...traffic, ...cars]))

      carContext.canvas.height = window.innerHeight

      carContext.save()

      const fittestCar = getFittestCar(cars)

      if (fittestCarRef.current?.identifier !== fittestCar.identifier) {
        fittestCarRef.current = fittestCar
      }

      if (shouldSaveCarsNeuralNetwork(fittestCar, traffic)) {
        console.log("saving new best neural network")
        saveNeuralNetwork(fittestCar.neuralNetwork)
      }

      if (neuralNetwork?.identifier !== fittestCar.neuralNetwork?.identifier) {
        setNeuralNetwork(fittestCar.neuralNetwork)
      }

      carContext.translate(0, -fittestCar.y + carContext.canvas.height * 0.7)

      road.draw(carContext)

      carContext.globalAlpha = 0.1

      cars.forEach(car => car.draw(carContext))

      carContext.globalAlpha = 1

      fittestCar.draw(carContext)

      traffic.forEach(car => car.draw(carContext))

      sensors.forEach(sensor =>
        sensor.update(carContext, road.borders, traffic)
      )

      fittestCar.sensors.update(carContext, road.borders, traffic, "visible")

      carContext.restore()

      requestAnimationFrame(() =>
        animateCar({ carContext: carContext, cars, road, sensors, traffic })
      )
    },
    [neuralNetwork]
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
        const cars = new Array(1000).fill(undefined).map((x, i) => {
          const car = new Car({
            center: { x: road.getLaneCenterX(1), y: 100 },
            size: { width: 30, height: 50 },
            roadBorders: road.borders,
            type: "primary",
          })
          const storedNN: null | NeuralNetwork = restoreNeuralNetwork()

          if (!storedNN) return car

          if (
            storedNN &&
            areNeuralNetworkSizesEqual(car.neuralNetwork, storedNN)
          ) {
            car.neuralNetwork = storedNN
            if (i > 0) {
              NeuralNetwork.mutate(car.neuralNetwork, 0.2)
            }
          }
          return car
        })

        const traffic = [
          new Car({
            center: { x: road.getLaneCenterX(1), y: -70 },
            size: { width: 30, height: 50 },
            roadBorders: road.borders,
            color: "red",
            type: "traffic",
          }),
          new Car({
            center: { x: road.getLaneCenterX(0), y: 150 },
            size: { width: 30, height: 50 },
            roadBorders: road.borders,
            color: "red",
            type: "traffic",
          }),
          new Car({
            center: { x: road.getLaneCenterX(2), y: 200 },
            size: { width: 30, height: 50 },
            roadBorders: road.borders,
            color: "red",
            type: "traffic",
          }),
          new Car({
            center: { x: road.getLaneCenterX(1), y: -400 },
            size: { width: 30, height: 50 },
            roadBorders: road.borders,
            color: "red",
            type: "traffic",
          }),
          new Car({
            center: { x: road.getLaneCenterX(0), y: -150 },
            size: { width: 30, height: 50 },
            roadBorders: road.borders,
            color: "red",
            type: "traffic",
          }),
          new Car({
            center: { x: road.getLaneCenterX(2), y: -175 },
            size: { width: 30, height: 50 },
            roadBorders: road.borders,
            color: "red",
            type: "traffic",
          }),

          new Car({
            center: { x: road.getLaneCenterX(2), y: -500 },
            size: { width: 30, height: 50 },
            roadBorders: road.borders,
            color: "red",
            type: "traffic",
          }),

          new Car({
            center: { x: road.getLaneCenterX(0), y: -700 },
            size: { width: 30, height: 50 },
            roadBorders: road.borders,
            color: "red",
            type: "traffic",
          }),

          new Car({
            center: { x: road.getLaneCenterX(1), y: -1000 },
            size: { width: 30, height: 50 },
            roadBorders: road.borders,
            color: "red",
            type: "traffic",
          }),

          new Car({
            center: { x: road.getLaneCenterX(1), y: -1200 },
            size: { width: 30, height: 50 },
            roadBorders: road.borders,
            color: "red",
            type: "traffic",
          }),

          new Car({
            center: { x: road.getLaneCenterX(0), y: -1100 },
            size: { width: 30, height: 50 },
            roadBorders: road.borders,
            color: "red",
            type: "traffic",
          }),
          new Car({
            center: { x: road.getLaneCenterX(2), y: -1300 },
            size: { width: 30, height: 50 },
            roadBorders: road.borders,
            color: "red",
            type: "traffic",
          }),
        ]

        const sensors = cars.map(car => car.sensors)
        setNeuralNetwork(cars[0].neuralNetwork)
        animateCar({ carContext: carContext, cars, road, sensors, traffic })
      }
    }
  }, [])

  const animateNeuralNetwork = useCallback(
    ({
      neuralNetworkContext,
      time,
    }: {
      neuralNetworkContext: CanvasRenderingContext2D
      time: number
    }) => {
      if (neuralNetwork) {
        Visualizer.drawNetwork(neuralNetworkContext, neuralNetwork)
        neuralNetworkContext.lineDashOffset = -time / 50
      }

      requestAnimationFrame(time => {
        animateNeuralNetwork({ neuralNetworkContext, time })
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
          animateNeuralNetwork({ neuralNetworkContext: nnContext, time: 0 })
        }
      }
    },
    [neuralNetwork]
  )

  return (
    <div
      style={{ backgroundColor: "#232127", height: "100vh", width: "100vw" }}
    >
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
          backgroundColor: "#222128",
          alignSelf: "center",
        }}
      />
    </div>
  )
}
