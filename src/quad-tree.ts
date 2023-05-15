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

    public intersects(other: AABB): boolean {
        return !(
            other.x > this.x + this.width ||
            other.x + other.width < this.x ||
            other.y > this.y + this.height ||
            other.y + other.height < this.y
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
    public readonly capacity = 4

    public points: XY[] = []

    public nodes = new QuadTreeNodes()

    public divided = false

    constructor(public bounds: AABB) {}

    /**
     * Insert a point into the QuadTree
     * @param point
     */
    public insert(point: XY): boolean {
        // Ignore objects that do not belong in this quad tree
        if (!this.bounds.containsPoint(point)) {
            return false // object cannot be added
        }

        // If there is space in this quad tree and if it doesn't have subdivisions,
        // add the object here
        if (!this.divided && this.points.length < this.capacity) {
            this.points.push(point)
            return true
        }

        // Otherwise, subdivide and then add the point to whichever node will accept it
        if (!this.divided) {
            this.subdivide()
        }

        // We have to add the points/data contained in this quad array to the new quads if we only want
        // the last node to hold the data
        return (
            this.nodes.northWest.insert(point) ||
            this.nodes.northEast.insert(point) ||
            this.nodes.southWest.insert(point) ||
            this.nodes.southEast.insert(point)
        )
    }

    /**
     * Find all points that appear with in a given range
     * @param range
     */
    public queryRange(range: AABB): XY[] {
        // Prepare an array of results
        const pointsInRange: XY[] = []

        // Automatically abort if the range does not intersect this quad
        if (!this.bounds.intersects(range)) {
            return pointsInRange // empty list
        }

        if (this.divided) {
            // Otherwise, add the points from the children
            pointsInRange.push(...this.nodes.northWest.queryRange(range))
            pointsInRange.push(...this.nodes.northEast.queryRange(range))
            pointsInRange.push(...this.nodes.southWest.queryRange(range))
            pointsInRange.push(...this.nodes.southEast.queryRange(range))

            return pointsInRange
        }

        // Check objects at this quad level
        for (const p of this.points) {
            if (range.containsPoint(p)) {
                pointsInRange.push(p)
            }
        }

        return pointsInRange
    }

    /**
     * Create four children that fully divide this quad into four quads of equal areas
     * @private
     */
    private subdivide() {
        if (this.divided) {
            return
        }
        this.divided = true

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

        for (const p of this.points) {
            this.nodes.northWest.insert(p)
            this.nodes.northEast.insert(p)
            this.nodes.southWest.insert(p)
            this.nodes.southEast.insert(p)
        }

        this.points = null
    }
}
