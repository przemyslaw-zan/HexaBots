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



let map = MAPGENERATOR.getRandomMap(15)
map.get([PLAYER.properties.position.x, PLAYER.properties.position.y]).player = true

for (let hex of map.hexesInRange(map[0], PLAYER.properties.visibilityRange)) {
    if (hex !== undefined) {
        hex.visibility = "visible"
    }
}

DISPLAY.initiateMap(map)
CONTROLS.initiateControls()



if (module.hot) {
    module.hot.accept()
}