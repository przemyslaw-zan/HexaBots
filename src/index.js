"use strict"
//Import CSS
import './styles/main.scss'
//Import JS
import * as MAPGENERATOR from './scripts/mapgenerator.js'
import * as DISPLAY from './scripts/display.js'

//https://github.com/flauwekeul/honeycomb
console.clear();




let map = MAPGENERATOR.getRandomMap(15)
DISPLAY.initiateMap(map)




if (module.hot) {
    module.hot.accept()
}

//For testing purposes only

//Zoom controls
document.querySelectorAll("button")[3].addEventListener('mousedown', () => {
    if (DISPLAY.camera.zoom > 0) DISPLAY.camera.zoom--
    DISPLAY.zoomUpdate()
})

document.querySelectorAll("button")[5].addEventListener('mousedown', () => {
    if (DISPLAY.camera.zoom < 2) DISPLAY.camera.zoom++
    DISPLAY.zoomUpdate()
})

//Position controls
let timer = null;
document.querySelector("body").addEventListener('mouseup', () => {
    clearInterval(timer)
})

document.querySelectorAll("button")[0].addEventListener('mousedown', () => {
    timer = setInterval(() => {
        DISPLAY.camera.y -= 5
    }, 10)
})

document.querySelectorAll("button")[1].addEventListener('mousedown', () => {
    timer = setInterval(() => {
        DISPLAY.camera.x -= 5
    }, 10)
})

document.querySelectorAll("button")[2].addEventListener('mousedown', () => {
    timer = setInterval(() => {
        DISPLAY.camera.x += 5
    }, 10)
})

document.querySelectorAll("button")[4].addEventListener('mousedown', () => {
    timer = setInterval(() => {
        DISPLAY.camera.y += 5
    }, 10)
})