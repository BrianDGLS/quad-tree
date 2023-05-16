import { layers } from "./layers"

const CANVAS_WIDTH = 640
const CANVAS_HEIGHT = 480

const $stage = document.getElementById("stage") as HTMLDivElement

$stage.style.width = `${CANVAS_WIDTH}px`
$stage.style.height = `${CANVAS_HEIGHT}px`

$stage.querySelectorAll("canvas").forEach(($canvas) => {
    $canvas.width = CANVAS_WIDTH
    $canvas.height = CANVAS_HEIGHT
})

window.onload = function () {
    const { bg, game, effects, ui, offscreen } = layers

    function frame() {
        requestAnimationFrame(frame)

        bg.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
        game.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
        effects.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
        ui.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
    }

    frame()
}
