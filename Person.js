class Person extends GameObject {
    constructor(config){
        super(config)
        this.movingProgressRemaining = 0

        this.isPlayerControlled = config.isPlayerControlled || false

        this.directionUpdate = {
            "up": ["y", -1],
            "down": ["y", 1],
            "left": ["x", -1],
            "right": ["x", 1]
        }
    }


    updatePosition(state){        
        const [property, change] = this.directionUpdate[this.direction]
        this[property] += change
        this.movingProgressRemaining -= 1

        if(this.movingProgressRemaining === 0){          
            utils.emitEvent("PersonWalkingComplete", {
                detail: { whoId: this.id }
            })
        }
    }

    update(state){
        if(this.movingProgressRemaining > 0){
            this.updatePosition(state)            
        } else {
            if(!state.map.isCutscenePlaying && this.isPlayerControlled && state.arrow){
                this.startBehavior(state, { type: "walk", direction: state.arrow })
            }
            this.updateSprite(state)  
        }               
    }

    startBehavior(state, behavior){
        this.direction = behavior.direction
        if(behavior.type === "walk"){
            if(state.map.isSpaceTaken(this.x, this.y, this.direction)){

                behavior.retry && setTimeout(() => {
                    this.startBehavior(state, behavior)
                }, 1000)

                return
            }

            setTimeout(() => {
                state.map.moveWall(this.x, this.y, this.direction)
                this.movingProgressRemaining = 16
                this.updateSprite(state)
            }, behavior.time)
        }    
        
        if(behavior.type === "stand"){
            setTimeout(() => {
                utils.emitEvent("PersonStandComplete", { detail: { whoId: this.id } })
            }, behavior.time)
        }
    }

    updateSprite(state){
        if(this.movingProgressRemaining > 0){
            this.sprite.setAnimation("walk-"+this.direction)
            return
        }
        this.sprite.setAnimation("idle-"+this.direction)  
    }
}