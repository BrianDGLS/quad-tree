import { layers } from "./layers"
import { choose, getRandomInt } from "./utils"
import { Context } from "./types"
import { XY } from "./xy"
import { AABB } from "./aabb"
import { QuadTree } from "./quad-tree"

const CANVAS_WIDTH = 640
const CANVAS_HEIGHT = 480

const $stage = document.getElementById("stage")

$stage.style.width = `${CANVAS_WIDTH}px`
$stage.style.height = `${CANVAS_HEIGHT}px`

$stage.querySelectorAll("canvas").forEach(($canvas) => {
    $canvas.width = CANVAS_WIDTH
    $canvas.height = CANVAS_HEIGHT
})

function renderPoint(ctx: Context, point: XY, color = "gray", radius = 2) {
    ctx.save()
    ctx.fillStyle = color
    ctx.translate(point.x, point.y)
    ctx.beginPath()
    ctx.arc(0, 0, radius, 0, 2 * Math.PI)
    ctx.closePath()
    ctx.fill()
    ctx.restore()
}

function renderBounds(
    ctx: Context,
    bounds: AABB,
    color = "gray",
    lineWidth = 1,
) {
    ctx.save()
    ctx.strokeStyle = color
    ctx.lineWidth = lineWidth
    ctx.translate(bounds.x, bounds.y)
    ctx.strokeRect(0, 0, bounds.width, bounds.height)
    ctx.restore()
}

function renderQuadTree(ctx: Context, quadTree: QuadTree) {
    ctx.save()
    if (quadTree.divided) {
        renderQuadTree(ctx, quadTree.nodes.northWest)
        renderQuadTree(ctx, quadTree.nodes.northEast)
        renderQuadTree(ctx, quadTree.nodes.southWest)
        renderQuadTree(ctx, quadTree.nodes.southEast)
    } else {
        renderBounds(ctx, quadTree.bounds, "rgba(255, 255, 255, .1)")
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

let panelSpeed = 2
let panelVX = choose(-panelSpeed, panelSpeed)
let panelVY = choose(-panelSpeed, panelSpeed)
const panelSize = 100
const panel = new AABB(
    CANVAS_WIDTH / 2,
    CANVAS_HEIGHT / 2,
    panelSize,
    panelSize,
)

window.onload = function () {
    const { bg, game, ui } = layers

    function frame() {
        requestAnimationFrame(frame)

        bg.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
        game.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
        ui.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

        game.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
        renderQuadTree(game, quadTree)

        for (const p of quadTree.queryRange(quadTree.bounds)) {
            renderPoint(game, p)
        }

        for (const p of quadTree.queryRange(panel)) {
            renderPoint(ui, p, "green", 4)
        }

        renderBounds(ui, panel, "green", 4)

        panel.x += panelVX
        panel.y += panelVY

        if (panel.x < 0) {
            panelVX = panelSpeed
        }

        if (panel.x + panelSize > CANVAS_WIDTH) {
            panelVX = -panelSpeed
        }

        if (panel.y < 0) {
            panelVY = panelSpeed
        }

        if (panel.y + panelSize > CANVAS_HEIGHT) {
            panelVY = -panelSpeed
        }
    }

    frame()
}
