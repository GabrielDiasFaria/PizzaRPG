class OverWorldMap {
    constructor(config){
        this.gameObjects = config.gameObjects

        this.walls = config.walls || {}

        this.lowerImage = new Image() 
        this.lowerImage.src = config.lowerSrc
        
        this.upperImage = new Image() 
        this.upperImage.src = config.upperSrc

        this.isCutscenePlaying = false
    }

    async startCutscene(events){
        this.isCutscenePlaying = true;

        for(let i=0; i<events.length; i++){
            const eventHandler = new OverWorldEvent({
                map: this,
                event: events[i]                
            })
            await eventHandler.init()
        }

        this.isCutscenePlaying = false;
    }

    drawLowerImage(ctx, cameraPerson){
        ctx.drawImage(this.lowerImage,0 + utils.withGrid(10.5) - cameraPerson.x,0 + utils.withGrid(6) - cameraPerson.y)
    }

    drawUpperImage(ctx, cameraPerson){
        ctx.drawImage(this.upperImage,0 + utils.withGrid(10.5) - cameraPerson.x,0 + utils.withGrid(6) - cameraPerson.y)
    }

    isSpaceTaken(currentX, currentY, direction){
        const {x,y} = utils.nextPosition(currentX, currentY, direction)
        return this.walls[`${x},${y}`] || false
    }

    addWall(x,y){
        this.walls[`${x},${y}`] = true
    }

    removeWall(x,y){
        delete this.walls[`${x},${y}`]
    }

    moveWall(wasX, wasY, direction){
        this.removeWall(wasX,wasY)
        const {x,y} = utils.nextPosition(wasX, wasY, direction)
        this.addWall(x,y)
    }

    mountObjects(){
        Object.keys(this.gameObjects).forEach(key => {
            let object = this.gameObjects[key]
            object.id = key
            object.mount(this)
        })
    }
}

window.OverWorldMaps = {
    DemoRoom: {
        lowerSrc: "/images/maps/DemoLower.png",
        upperSrc: "/images/maps/DemoUpper.png",
        gameObjects: {
            hero: new Person({x: utils.withGrid(5), y: utils.withGrid(6), useShadow : true, isPlayerControlled: true}),
            npc1: new Person({x: utils.withGrid(7), y: utils.withGrid(9), src: "/images/characters/people/npc1.png", useShadow : true}),
            npc2: new Person({x: utils.withGrid(4), y: utils.withGrid(9), src: "/images/characters/people/npc2.png", useShadow : true, 
                                behaviorLoop: [{ type: "walk", direction: "left", time: 500 },
                                               { type: "stand", direction: "left", time: 1000},
                                               { type: "walk", direction: "up", time: 500 },
                                               { type: "stand", direction: "up", time: 1000 },
                                               { type: "walk", direction: "right", time: 500},
                                               { type: "stand", direction: "right", time: 1000 },
                                               { type: "walk", direction: "down", time: 500 },  
                                               { type: "stand", direction: "down", time: 1000},     
                                            ]})
        },
        walls: {
            [utils.asGridCoords(7,6)] : true,
            [utils.asGridCoords(8,6)] : true,
            [utils.asGridCoords(7,7)] : true,
            [utils.asGridCoords(8,7)] : true
        }
    },
    Kitchen: {
        lowerSrc: "/images/maps/KitchenLower.png",
        upperSrc: "/images/maps/KitchenUpper.png",
        gameObjects: {
            hero: new Person({x: utils.withGrid(3), y: utils.withGrid(5), useShadow : true}),
            npcA: new Person({x: utils.withGrid(9), y: utils.withGrid(6), src: "/images/characters/people/npc2.png", useShadow : true}),
            npcB: new Person({x: utils.withGrid(10), y: utils.withGrid(8), src: "/images/characters/people/npc3.png", useShadow : true})
        }
    },
}