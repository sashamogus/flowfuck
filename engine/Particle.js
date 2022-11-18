import { Direction } from "./Direction.js";

export default class Particle {
    constructor(char, direction = Direction.left) {
        this.char = char;
        this.direction = direction;
        this.updated = false;
    }
}
