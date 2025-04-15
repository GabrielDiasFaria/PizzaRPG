class GameObject {
    constructor(config) {
        this.x = config.x || 0
        this.y = config.y || 0
        this.isMounted = false
        this.direction = config.direction || "down"
        this.sprite = new Sprite({
            gameObject: this,
            src: config.src || "/images/characters/people/hero.png",
            useShadow: config.useShadow
        })
    }

    mount(map){
        console.log("Mounting....")
        this.isMounted = true
        map.addWall(this.x, this.y)
    }

    update(){

    }
}