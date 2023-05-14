import { layers } from "./layers"
import { AABB, QuadTree } from "./quad-tree"
import { Context } from "./types"
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

function renderBounds(ctx: Context, bounds: AABB) {
    ctx.save()
    ctx.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height)
    ctx.restore()
}

function renderQuadTree(ctx: Context, quadTree: QuadTree) {
    ctx.save()
    ctx.strokeStyle = "green"
    renderBounds(ctx, quadTree.bounds)
    if (quadTree.isSubdivided()) {
        renderQuadTree(ctx, quadTree.nodes.northWest)
        renderQuadTree(ctx, quadTree.nodes.northEast)
        renderQuadTree(ctx, quadTree.nodes.southWest)
        renderQuadTree(ctx, quadTree.nodes.southEast)
    }
    ctx.restore()
}

const quadTree = new QuadTree(new AABB(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT))
const pointCount = 200
for (let i = 0; i < pointCount; i++) {
    quadTree.insert({
        x: getRandomInt(0, CANVAS_WIDTH),
        y: getRandomInt(0, CANVAS_HEIGHT),
    })
}

window.onload = function () {
    const { bg, game, ui } = layers

    function frame() {
        requestAnimationFrame(frame)

        bg.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
        game.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
        ui.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

        game.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
        renderQuadTree(game, quadTree)

        game.save()
        game.fillStyle = "red"
        for (const p of quadTree.queryRange(quadTree.bounds)) {
            game.fillRect(p.x, p.y, 2, 2)
        }
        game.restore()
    }

    frame()
}
