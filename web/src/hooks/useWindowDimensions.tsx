import { useEffect, useState } from "react"

const isSmallDevice = (width: number) => {
  if (typeof document === "undefined") return true
  return (
    width > parseFloat(getComputedStyle(document.documentElement).fontSize) * 42
  )
}

export const useWindowDimensions = () => {
  const width = typeof window !== "undefined" ? window.innerWidth : 300
  const height = typeof window !== "undefined" ? window.innerHeight : 800

  const [dimensions, setDimensions] = useState({
    width,
    height,
    isSmallDevice: isSmallDevice(width),
  })

  useEffect(() => {
    const handler = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      setDimensions({ width, height, isSmallDevice: isSmallDevice(width) })
    }
    addEventListener("resize", handler)

    return () => {
      removeEventListener("resize", handler)
    }
  }, [])

  return dimensions
}
