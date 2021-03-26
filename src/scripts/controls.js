//Imports
import * as DISPLAY from '../scripts/display.js'
import * as PLAYER from '../scripts/player.js'

//Public variables
//-

//Private variables
//-

//Public functions
export function initiateControls() {
    //Player controls    
    document.querySelector("#move_q").addEventListener('click', () => {
        movePlayer(3)
    })
    document.querySelector("#move_w").addEventListener('click', () => {
        movePlayer(4)
    })
    document.querySelector("#move_e").addEventListener('click', () => {
        movePlayer(5)
    })
    document.querySelector("#move_a").addEventListener('click', () => {
        movePlayer(2)
    })
    document.querySelector("#move_s").addEventListener('click', () => {
        movePlayer(1)
    })
    document.querySelector("#move_d").addEventListener('click', () => {
        movePlayer(0)
    })

    //Zoom controls
    document.querySelector("#zoom_out").addEventListener('mousedown', () => {
        if (DISPLAY.camera.zoom > 0) DISPLAY.camera.zoom--
        DISPLAY.zoomUpdate()
    })

    document.querySelector("#zoom_in").addEventListener('mousedown', () => {
        if (DISPLAY.camera.zoom < 2) DISPLAY.camera.zoom++
        DISPLAY.zoomUpdate()
    })

    //Camera position controls
    let timer = null;
    document.addEventListener('mouseup', () => {
        clearInterval(timer)
    })
    document.addEventListener('keyup', () => {
        clearInterval(timer)
    })

    document.querySelector("#camera_up").addEventListener('mousedown', () => {
        timer = setInterval(() => {
            DISPLAY.camera.y -= 5
        }, 10)
    })

    document.querySelector("#camera_left").addEventListener('mousedown', () => {
        timer = setInterval(() => {
            DISPLAY.camera.x -= 5
        }, 10)
    })

    document.querySelector("#camera_right").addEventListener('mousedown', () => {
        timer = setInterval(() => {
            DISPLAY.camera.x += 5
        }, 10)
    })

    document.querySelector("#camera_down").addEventListener('mousedown', () => {
        timer = setInterval(() => {
            DISPLAY.camera.y += 5
        }, 10)
    })

    //Keyboard controls
    document.addEventListener('keydown', (e) => {
        switch (e.code) {
            case "ArrowUp":
                clearInterval(timer)
                timer = setInterval(() => {
                    DISPLAY.camera.y -= 5
                }, 10)
                break
            case "ArrowLeft":
                clearInterval(timer)
                timer = setInterval(() => {
                    DISPLAY.camera.x -= 5
                }, 10)
                break
            case "ArrowRight":
                clearInterval(timer)
                timer = setInterval(() => {
                    DISPLAY.camera.x += 5
                }, 10)
                break
            case "ArrowDown":
                clearInterval(timer)
                timer = setInterval(() => {
                    DISPLAY.camera.y += 5
                }, 10)
                break
            case "KeyQ":
                movePlayer(3)
                break
            case "KeyW":
                movePlayer(4)
                break
            case "KeyE":
                movePlayer(5)
                break
            case "KeyA":
                movePlayer(2)
                break
            case "KeyS":
                movePlayer(1)
                break
            case "KeyD":
                movePlayer(0)
        }
    })
}

//Private functions
function movePlayer(direction) {
    let hex = DISPLAY.currentMap.get([PLAYER.properties.position.x, PLAYER.properties.position.y])
    let neighbors = DISPLAY.currentMap.neighborsOf(hex)

    //Checking if hex is not outside map
    if (neighbors[direction] === undefined) {
        window.alert("You are trying to leave the map!")
        return
    }

    //Moving the player
    hex.player = false
    neighbors[direction].player = true
    PLAYER.properties.position.x = neighbors[direction].x
    PLAYER.properties.position.y = neighbors[direction].y

    //Changing previously visible hexes to "seen"
    DISPLAY.currentMap.forEach((item, i, arr) => {
        if (arr[i].visibility === "visible") arr[i].visibility = "seen"
    })

    //Changing hexes in range to "visible"
    let visibleHexes = DISPLAY.currentMap.hexesInRange(neighbors[direction], PLAYER.properties.visibilityRange)
    visibleHexes.forEach((item) => {
        item.visibility = "visible"
    })
}