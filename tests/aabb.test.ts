import { describe, it } from "vitest"
import { AABB } from "../src/quad-tree"

describe("Checking bounds contains a point", () => {
    it.concurrent("should know that a contains b", ({ expect }) => {
        const a = new AABB(0, 0, 20, 20)
        const b = { x: 10, y: 10 }

        expect(a.containsPoint(b)).toBeTruthy()
    })

    it.concurrent(
        "should know that a contains b when a.x is equal to b.x",
        ({ expect }) => {
            const a = new AABB(0, 0, 20, 20)
            const b = { x: 0, y: 10 }

            expect(a.containsPoint(b)).toBeTruthy()
        },
    )

    it.concurrent(
        "should know that a contains b when a.y is equal to b.y",
        ({ expect }) => {
            const a = new AABB(0, 0, 20, 20)
            const b = { x: 10, y: 0 }

            expect(a.containsPoint(b)).toBeTruthy()
        },
    )

    it.concurrent(
        "should know that a does contain b when b.x is equal to a.x + a.width",
        ({ expect }) => {
            const a = new AABB(0, 0, 20, 20)
            const b = { x: 10, y: a.y + a.height }

            expect(a.containsPoint(b)).toBeTruthy()
        },
    )

    it.concurrent(
        "should know that a does contain b when b.y is equal to a.y + a.height",
        ({ expect }) => {
            const a = new AABB(0, 0, 20, 20)
            const b = { x: 10, y: a.y + a.height }

            expect(a.containsPoint(b)).toBeTruthy()
        },
    )

    it.concurrent("should know that a does not contain b", ({ expect }) => {
        const a = new AABB(0, 0, 20, 20)
        const b = { x: 21, y: 21 }

        expect(a.containsPoint(b)).toBeFalsy()
    })

    it.concurrent(
        "should know that a does not contain b when only b.x is inside",
        ({ expect }) => {
            const a = new AABB(0, 0, 20, 20)
            const b = { x: 10, y: 21 }

            expect(a.containsPoint(b)).toBeFalsy()
        },
    )

    it.concurrent(
        "should know that a does not contain b when only b.y is inside",
        ({ expect }) => {
            const a = new AABB(0, 0, 20, 20)
            const b = { x: 21, y: 10 }

            expect(a.containsPoint(b)).toBeFalsy()
        },
    )
})
