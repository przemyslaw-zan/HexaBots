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
export const animation = {
    x: -999,
    y: -999
}
export let currentMap

//Private variables
const mainCanvas = document.querySelector("#mainCanvas")
const animCanvas = document.querySelector("#animationCanvas")
const mainCtx = mainCanvas.getContext("2d")
const animCtx = animCanvas.getContext("2d")
let scales = []
let hexSize
let a_full, b_full, c_full, a_hex, b_hex, c_hex
let halfCanvasWidth, halfCanvasHeight
let Grid = defineGrid(extendHex({}))

//Public functions
export function initiateMap(map) {
    currentMap = map
    mainCanvas.width = window.innerWidth
    mainCanvas.height = window.innerHeight
    animCanvas.width = window.innerWidth
    animCanvas.height = window.innerHeight
    calculateHexDimensions()
    windowResizeUpdate()
    zoomUpdate()
    drawMap()
    drawAnimtions()
}

export function zoomUpdate() {
    const hex = Grid.pointToHex(camera.x, camera.y)
    const x = hex.x
    const y = hex.y
    hexSize = scales[camera.zoom]
    calculateHexDimensions()
    Grid = defineGrid(extendHex({
        size: hexSize,
        orientation: 'flat'
    }))
    const replacementMap = Grid.rectangle({
        width: currentMap.width,
        height: currentMap.height
    })
    for (let i = 0; i < currentMap.length; i++) {
        currentMap[i].size = replacementMap[i].size
        if (currentMap[i].x === x && currentMap[i].y === y) {
            camera.x = Math.round(currentMap[i].toPoint().x + b_full + (hexSize / 2))
            camera.y = Math.round(currentMap[i].toPoint().y + c_full)
        }
    }
}

//Private functions
function drawMap() {
    //Clearing
    mainCtx.setTransform(1, 0, 0, 1, 0, 0)
    mainCtx.fillStyle = "black"
    mainCtx.fillRect(0, 0, mainCanvas.width, mainCanvas.height)

    //Positioning the camera
    mainCtx.translate(-camera.x + halfCanvasWidth, -camera.y + halfCanvasHeight)

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
            mainCtx.strokeStyle = "white"
            mainCtx.beginPath()
            mainCtx.moveTo(x + a_full, y - c_full)
            mainCtx.lineTo(x + b_full, y)
            mainCtx.lineTo(x + a_full, y + c_full)
            mainCtx.lineTo(x - a_full, y + c_full)
            mainCtx.lineTo(x - b_full, y)
            mainCtx.lineTo(x - a_full, y - c_full)
            mainCtx.closePath()
            mainCtx.stroke()
        }

        //Drawing the hex
        mainCtx.fillStyle = `rgba(${hex.type},${hex.visibility === 'seen' ? '0.25' : '1'})`
        mainCtx.beginPath()
        mainCtx.moveTo(x + a_hex, y - c_hex)
        mainCtx.lineTo(x + b_hex, y)
        mainCtx.lineTo(x + a_hex, y + c_hex)
        mainCtx.lineTo(x - a_hex, y + c_hex)
        mainCtx.lineTo(x - b_hex, y)
        mainCtx.lineTo(x - a_hex, y - c_hex)
        mainCtx.closePath()
        mainCtx.fill()

        //Skipping to the next hex if not currently visible
        if (hex.visibility === 'seen') continue

        //Drawing player
        if (hex.player) {
            mainCtx.fillStyle = "white"
            mainCtx.beginPath()
            mainCtx.arc(x, y, hexSize / 2, 0, 2 * Math.PI)
            mainCtx.fill()
            mainCtx.lineWidth = 3;
            mainCtx.strokeStyle = "#8B0000"
            mainCtx.stroke()
            mainCtx.closePath()
        }
    }

    requestAnimationFrame(drawMap)
}

function drawAnimtions() {
    //Clearing
    animCtx.setTransform(1, 0, 0, 1, 0, 0)
    animCtx.clearRect(0, 0, mainCanvas.width, mainCanvas.height)

    //Positioning the camera
    animCtx.translate(-camera.x + halfCanvasWidth, -camera.y + halfCanvasHeight)

    animCtx.fillStyle = "white"
    animCtx.beginPath()
    animCtx.arc(animation.x, animation.y, hexSize / 2, 0, 2 * Math.PI)
    animCtx.fill()
    animCtx.lineWidth = 3;
    animCtx.strokeStyle = "#8B0000"
    animCtx.stroke()
    animCtx.closePath()

    requestAnimationFrame(drawAnimtions)
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
    mainCanvas.width = window.innerWidth
    mainCanvas.height = window.innerHeight
    animCanvas.width = window.innerWidth
    animCanvas.height = window.innerHeight
    halfCanvasWidth = mainCanvas.width / 2
    halfCanvasHeight = mainCanvas.height / 2
    const min = Math.min(halfCanvasWidth, halfCanvasHeight)
    scales = [min / 15, min / 10, min / 7, min / 4]
}

//Hex Highlighting
animCanvas.addEventListener('click', ({
    offsetX,
    offsetY
}) => {
    offsetX += camera.x + b_full - (mainCanvas.width / 2)
    offsetY += camera.y + c_full - (mainCanvas.height / 2)
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