//Imports
import {
    extendHex,
    defineGrid
} from 'honeycomb-grid'

//Public variables
//-

//Private variables
let Grid = defineGrid(extendHex({
    orientation: 'flat'
}))

//Public functions
export function getRandomMap(size) {
    let map = Grid.rectangle({
        width: size,
        height: size
    })
    for (let hex of map) {
        hex.type = ["green", "saddlebrown"].random()
        hex.highlight = false
    }
    return map
}

//Private functions
Array.prototype.random = function () {
    return this[Math.floor((Math.random() * this.length))];
}

/*
let img = new Image()
img.src = 'url'
let pattern = ctx.createPattern(img, 'repeat')
*/