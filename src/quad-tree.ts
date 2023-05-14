import { XY } from "./types"

/**
 * Axis-Aligned Bounding Box
 */
export class AABB {
    constructor(
        public x: number,
        public y: number,
        public width: number,
        public height: number,
    ) {}

    public containsPoint(point: XY): boolean {
        return (
            point.x >= this.x &&
            point.x <= this.x + this.width &&
            point.y >= this.y &&
            point.y <= this.y + this.height
        )
    }
}

export class QuadTreeNodes {
    public northWest: QuadTree
    public northEast: QuadTree
    public southWest: QuadTree
    public southEast: QuadTree

    public asArray(): QuadTree[] {
        return [this.northWest, this.northEast, this.southWest, this.southEast]
    }
}

export class QuadTree {
    public readonly maxElements = 4

    public elements: AABB[] = Array(this.maxElements)

    public nodes = new QuadTreeNodes()

    constructor(public bounds: AABB) {}

    public subdivide() {
        const { x, y } = this.bounds
        const width = this.bounds.width / 2
        const height = this.bounds.height / 2

        const northWest = new AABB(x, y, width, height)
        const northEast = new AABB(x + width, y, width, height)
        const southWest = new AABB(x, y + height, width, height)
        const southEast = new AABB(x + width, y + height, width, height)

        this.nodes.northWest = new QuadTree(northWest)
        this.nodes.northEast = new QuadTree(northEast)
        this.nodes.southWest = new QuadTree(southWest)
        this.nodes.southEast = new QuadTree(southEast)
    }

    public insert(element: AABB) {}

    public queryRange(range: AABB) {}
}
