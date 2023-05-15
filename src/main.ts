import { layers } from "./layers"
import { AABB, QuadTree } from "./quad-tree"
import { Context, XY } from "./types"
import { getRandomInt } from "./utils"

const CANVAS_WIDTH = 640
const CANVAS_HEIGHT = 480

const $stage = document.getElementById("stage")

$stage.style.width = `${CANVAS_WIDTH}px`
$stage.style.height = `${CANVAS_HEIGHT}px`

$stage.querySelectorAll("canvas").forEach(($canvas) => {
    $canvas.width = CANVAS_WIDTH
    $canvas.height = CANVAS_HEIGHT
})

function renderPoint(ctx: Context, point: XY) {
    ctx.save()
    ctx.fillStyle = "red"
    ctx.translate(point.x, point.y)
    ctx.fillRect(0, 0, 4, 4)
    ctx.restore()
}

function renderBounds(ctx: Context, bounds: AABB) {
    ctx.save()
    ctx.translate(bounds.x, bounds.y)
    ctx.strokeRect(0, 0, bounds.width, bounds.height)
    ctx.restore()
}

function renderQuadTree(ctx: Context, quadTree: QuadTree) {
    ctx.save()
    ctx.strokeStyle = "green"
    if (quadTree.divided) {
        renderQuadTree(ctx, quadTree.nodes.northWest)
        renderQuadTree(ctx, quadTree.nodes.northEast)
        renderQuadTree(ctx, quadTree.nodes.southWest)
        renderQuadTree(ctx, quadTree.nodes.southEast)
    } else {
        renderBounds(ctx, quadTree.bounds)
    }
    ctx.restore()
}

const quadTree = new QuadTree(new AABB(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT))
const pointCount = 20
for (let i = 0; i < pointCount; i++) {
    quadTree.insert({
        x: getRandomInt(0, CANVAS_WIDTH),
        y: getRandomInt(0, CANVAS_HEIGHT),
    })
}

window.onload = function () {
    const { bg, game, ui } = layers

    function frame() {
        // requestAnimationFrame(frame)

        bg.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
        game.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
        ui.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

        game.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
        renderQuadTree(game, quadTree)

        for (const p of quadTree.queryRange(quadTree.bounds)) {
            renderPoint(game, p)
        }
    }

    frame()
}
