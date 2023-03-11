export type Point = { x: number; y: number }
export type Line = { start: Point; end: Point }
export type SensorReading = (Point & { offset: number }) | null
export type Polygon = [Point, Point, Point, Point]
export type PolygonSize = { width: number; height: number }
