//Imports
import {
    extendHex,
    defineGrid
} from 'honeycomb-grid'

//Public variables
export const camera = {
    x: 0,
    y: 0,
    zoom: 0
}
export let currentMap

//Private variables
const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")
let scales = []
let hexSize
let a_full, b_full, c_full, a_hex, b_hex, c_hex
let halfCanvasWidth, halfCanvasHeight
let Grid = defineGrid(extendHex({}))

//Public functions
export function initiateMap(map) {
    currentMap = map
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    calculateHexDimensions()
    windowResizeUpdate()
    zoomUpdate()
    draw()
}

export function zoomUpdate() {
    const hex = Grid.pointToHex(camera.x, camera.y)
    const x = hex.x
    const y = hex.y
    hexSize = scales[camera.zoom]
    calculateHexDimensions()
    let oldMap = currentMap
    Grid = defineGrid(extendHex({
        size: hexSize,
        orientation: 'flat'
    }))
    currentMap = Grid.rectangle({
        width: currentMap.width,
        height: currentMap.height
    })
    for (let i = 0; i < currentMap.length; i++) {
        currentMap[i].type = oldMap[i].type
        currentMap[i].player = oldMap[i].player
        currentMap[i].visibility = oldMap[i].visibility
        if (currentMap[i].x === x && currentMap[i].y === y) {
            camera.x = Math.round(currentMap[i].toPoint().x + b_full + (hexSize / 2))
            camera.y = Math.round(currentMap[i].toPoint().y + c_full)
        }
    }
}

//Private functions
function draw() {
    //Clearing
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.fillStyle = "black"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    //const camX = -camera.x + halfCanvasWidth
    //const camY = -camera.y + halfCanvasHeight
    ctx.translate(-camera.x + halfCanvasWidth, -camera.y + halfCanvasHeight)

    for (let hex of currentMap) {
        //Hex is ignored if it wasn't seen yet
        if (hex.visibility === 'unseen') continue

        let x = hex.toPoint().x,
            y = hex.toPoint().y

        //Checking if hex is visible within canvas
        if (Math.abs(x - camera.x) > halfCanvasWidth + hexSize ||
            Math.abs(y - camera.y) > halfCanvasHeight + hexSize) continue

        //Drawing highlight around hex
        if (hex.highlight) {
            ctx.fillStyle = "white"
            ctx.beginPath()
            ctx.moveTo(x + a_full, y - c_full)
            ctx.lineTo(x + b_full, y)
            ctx.lineTo(x + a_full, y + c_full)
            ctx.lineTo(x - a_full, y + c_full)
            ctx.lineTo(x - b_full, y)
            ctx.lineTo(x - a_full, y - c_full)
            ctx.closePath()
            ctx.fill()
        }

        //Drawing the hex
        ctx.fillStyle = `rgba(${hex.type},${hex.visibility === 'seen' ? '0.5' : '1'})`
        ctx.beginPath()
        ctx.moveTo(x + a_hex, y - c_hex)
        ctx.lineTo(x + b_hex, y)
        ctx.lineTo(x + a_hex, y + c_hex)
        ctx.lineTo(x - a_hex, y + c_hex)
        ctx.lineTo(x - b_hex, y)
        ctx.lineTo(x - a_hex, y - c_hex)
        ctx.closePath()
        ctx.fill()

        //Skipping to the next hex if not currently visible
        if (hex.visibility === 'seen') continue

        //Drawing player
        if (hex.player) {
            ctx.fillStyle = "white"
            ctx.beginPath()
            ctx.arc(x, y, hexSize / 2, 0, 2 * Math.PI)
            ctx.fill()
            ctx.lineWidth = 3;
            ctx.strokeStyle = "#8B0000"
            ctx.stroke()
            ctx.closePath()
        }
    }
    requestAnimationFrame(draw)
}

function calculateHexDimensions() {
    a_full = hexSize / 2
    b_full = hexSize
    c_full = hexSize / 2 * Math.sqrt(3)
    a_hex = a_full * 0.95
    b_hex = b_full * 0.95
    c_hex = c_full * 0.95
}

function windowResizeUpdate() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    halfCanvasWidth = canvas.width / 2
    halfCanvasHeight = canvas.height / 2
    const min = Math.min(halfCanvasWidth, halfCanvasHeight)
    scales = [min / 10, min / 7, min / 4]
}

//Hex Highlighting
canvas.addEventListener('mousemove', ({
    offsetX,
    offsetY
}) => {
    offsetX += camera.x + b_full - (canvas.width / 2)
    offsetY += camera.y + c_full - (canvas.height / 2)
    const hexCoordinates = Grid.pointToHex(offsetX, offsetY)
    for (let hex of currentMap) hex.highlight = false
    try {
        currentMap.get(hexCoordinates).highlight = true
    } catch (e) {}
})

window.addEventListener('resize', () => {
    windowResizeUpdate()
    zoomUpdate()
})

//http://jsfiddle.net/gfcarv/QKgHs/ or http://jsfiddle.net/gfcarv/tAwQV/
//https://jsfiddle.net/931wk75n/2/