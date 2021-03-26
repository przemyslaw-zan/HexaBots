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
        hex.type = ["0,128,0", "139,69,19"].random()
        hex.highlight = false
        hex.visibility = 'unseen'
        hex.player = false
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