import {XY} from "./types";

/**
 * Axis-Aligned Bounding Box
 */
export class AABB {
    constructor(
        public x: number,
        public y: number,
        public width: number,
        public height: number,
    ) {
    }

    public containsPoint(point: XY): boolean {
        return (
            point.x >= this.x &&
            point.x <= this.x + this.width &&
            point.y >= this.y &&
            point.y <= this.y + this.height
        )
    }

    public intersects(other: AABB): boolean {
        return !(
            other.x > this.x + this.width ||
            other.x + other.width < this.x ||
            other.y > this.y + this.height ||
            other.y + other.height < this.y
        )
    }
}
