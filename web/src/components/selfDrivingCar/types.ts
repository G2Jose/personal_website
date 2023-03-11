export type Point = { x: number; y: number }
export type Line = { start: Point; end: Point }
export type SensorReading = (Point & { offset: number }) | null
