//Imports
import * as DISPLAY from '../scripts/display.js'
import * as PLAYER from '../scripts/player.js'

//Public variables
//-

//Private variables
//-

//Public functions
export function initiateControls() {
    updateVisibility(DISPLAY.currentMap.get([PLAYER.properties.position.x, PLAYER.properties.position.y]))

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
        if (DISPLAY.camera.zoom < 3) DISPLAY.camera.zoom++
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
    let targetHex = neighbors[direction]

    //Checking if hex is not outside map
    if (targetHex === undefined) {
        window.alert("You are trying to leave the map!")
        return
    }

    //Checking if target hex is walkable
    if (targetHex.walkable === false) {
        window.alert("You can't walk here!")
        return
    }

    //Moving the player
    hex.player = false

    const coords = animationPath(hex.toPoint(), targetHex.toPoint())
    let i = 0
    let animation = setInterval(() => {
        DISPLAY.animation.x = coords[i].x
        DISPLAY.animation.y = coords[i].y
        i++
        if (i >= coords.length) {
            clearInterval(animation)
            DISPLAY.animation.x = -999
            DISPLAY.animation.y = -999
        }
    }, 10)

    targetHex.player = true
    PLAYER.properties.position.x = targetHex.x
    PLAYER.properties.position.y = targetHex.y

    updateVisibility(targetHex)

    //DISPLAY.camera.x = targetHex.toPoint().x
    //DISPLAY.camera.y = targetHex.toPoint().y
}

function updateVisibility(centerHex) {
    DISPLAY.currentMap.forEach((hex, i, arr) => {
        if (arr[i].visibility === "visible") arr[i].visibility = "seen"
    })
    let visibleHexes = DISPLAY.currentMap.hexesInRange(centerHex, PLAYER.properties.visibilityRange)
    visibleHexes.forEach((hex) => {
        let line = DISPLAY.currentMap.hexesBetween(centerHex, hex)
        line.forEach((hex, i, arr) => {
            hex.visibility = "visible"
            if (!hex.seeThrough) arr.length = i++ //This line acts like "break"
        })
    })
}

function animationPath(startHex, endHex) {
    const numberOfSteps = 20
    const stepX = (endHex.x - startHex.x) / (numberOfSteps - 1)
    const stepY = (endHex.y - startHex.y) / (numberOfSteps - 1)
    const arr = []
    for (let i = 0; i < numberOfSteps; i++) {
        const x = startHex.x + stepX * i
        const y = startHex.y + stepY * i
        arr.push({
            x,
            y
        })
    }
    return arr
}