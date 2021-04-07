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

let map = MAPGENERATOR.getRandomMap(37)
for (let hex of map) {
    if (hex.walkable) {
        PLAYER.properties.position.x = hex.x
        PLAYER.properties.position.y = hex.y
        hex.player = true
        break
    }
}
DISPLAY.initiateMap(map)
CONTROLS.initiateControls()

if (module.hot) {
    module.hot.accept()
}