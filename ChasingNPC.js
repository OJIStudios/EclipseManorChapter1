class ChasingNPC extends Person {
  constructor(config) {
    super(config);
    this.chaseRadius = config.chaseRadius || 4;
    this.canChase = true;

    this.talking = []; // Disable interaction
    this.customText = ""; // No [E] prompt
  }

  update(state) {
    // Always update position/sprite first
    if (this.movingProgressRemaining > 0) {
      this.updatePosition();
      this.updateSprite(state);
      return;
    }

    // Normal behavior if player-controlled
    if (this.isPlayerControlled && state.arrow && !state.map.isCutscenePlaying) {
      this.startBehavior(state, {
        type: "walk",
        direction: state.arrow,
      });
      this.updateSprite(state);
      return;
    }

    // Chasing logic
    const hero = state.map.gameObjects["hero"];
    const dx = hero.x - this.x;
    const dy = hero.y - this.y;
    const distance = Math.abs(dx) + Math.abs(dy);

    if (
      this.canChase &&
      distance <= this.chaseRadius &&
      !state.map.isCutscenePlaying
    ) {
      let direction = null;

      // Choose direction toward hero
      if (Math.abs(dx) > Math.abs(dy)) {
        direction = dx > 0 ? "right" : "left";
      } else if (dy !== 0) {
        direction = dy > 0 ? "down" : "up";
      }

      if (direction) {
        this.startBehavior(state, {
          type: "walk",
          direction: direction,
          retry: true, // will retry if blocked
        });
      }
    }

    this.updateSprite(state);
  }
}
