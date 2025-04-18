class GameObject {
    constructor(config) {
        this.id = null
        this.x = config.x || 0
        this.y = config.y || 0
        this.isMounted = false
        this.direction = config.direction || "down"
        this.sprite = new Sprite({
            gameObject: this,
            src: config.src || "/images/characters/people/hero.png",
            useShadow: config.useShadow
        })

        this.behaviorLoop = config.behaviorLoop || []
        this.behaviorLoopIndex = 0
    }

    mount(map){
        this.isMounted = true
        map.addWall(this.x, this.y)

        setTimeout(() => {
            this.doBehaviorEvent(map)
        }, 5000)
    }

    update(){

    }

    async doBehaviorEvent(map){

        if(map.isCutscenePlaying || this.behaviorLoop.length === 0){
            return
        }

        let eventConfig = this.behaviorLoop[this.behaviorLoopIndex]
        eventConfig.who = this.id

        const eventHandler = new OverWorldEvent({ map, event: eventConfig })
        await eventHandler.init()

        this.behaviorLoopIndex += 1
        if(this.behaviorLoopIndex === this.behaviorLoop.length){
            this.behaviorLoopIndex = 0
        }

        this.doBehaviorEvent(map)
    }
}