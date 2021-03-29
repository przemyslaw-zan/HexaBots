"use strict"
//Import CSS
import './styles/main.scss'
//Import JS
import * as MAPGENERATOR from './scripts/mapgenerator.js'
import * as DISPLAY from './scripts/display.js'
import * as CONTROLS from './scripts/controls.js'
import * as PLAYER from './scripts/player.js'

//https://github.com/flauwekeul/honeycomb
console.clear();


const mapSize = 37

let map = MAPGENERATOR.getRandomMap(mapSize)
PLAYER.properties.position.x = Math.round(mapSize/2)-1
PLAYER.properties.position.y = 2

DISPLAY.initiateMap(map)
CONTROLS.initiateControls()

document.querySelector("#move_s").click()


if (module.hot) {
    module.hot.accept()
}