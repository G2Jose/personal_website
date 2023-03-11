import { Line, Point, SensorReading } from "./types"
import { Polygon } from "./types"

export const linearInterpolate = (
  start: number,
  end: number,
  fraction: number
) => start + (end - start) * fraction

export const getIntersection = (line1: Line, line2: Line): SensorReading => {
  const A = line1.start
  const B = line1.end
  const C = line2.start
  const D = line2.end
  const tTop = (D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x)
  const uTop = (C.y - A.y) * (A.x - B.x) - (C.x - A.x) * (A.y - B.y)
  const bottom = (D.y - C.y) * (B.x - A.x) - (D.x - C.x) * (B.y - A.y)

  if (bottom != 0) {
    const t = tTop / bottom
    const u = uTop / bottom
    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
      return {
        x: linearInterpolate(A.x, B.x, t),
        y: linearInterpolate(A.y, B.y, t),
        offset: t,
      }
    }
  }

  return null
}

export const doesLineIntersectWithPolygon = (line: Line, polygon: Polygon) => {
  const points = polygon
  const lines = points.reduce((acc, curr, i) => {
    const nextPoint = points[(i + 1) % points.length]
    return [
      ...acc,
      {
        start: { x: curr.x, y: curr.y },
        end: { x: nextPoint.x, y: nextPoint.y },
      },
    ]
  }, [] as Line[])

  return lines.some(polygonLine => getIntersection(polygonLine, line))
}
