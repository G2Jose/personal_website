import React from "react"
import { Canvas } from "../../components/canvas"

const SelfDrivingCarPage = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <Canvas />
    </div>
  )
}

export default SelfDrivingCarPage
