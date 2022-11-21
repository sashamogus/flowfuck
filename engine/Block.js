import { Direction, dmap } from "./Direction.js";
import Fuck from "./Fuck.js";

export default class Block {
    constructor(char, flowcore, y, x) {
        this.flowcore = flowcore;
        this.y = y;
        this.x = x;

        this.char = char;
        this.collision = true;
        this.eater = false;
        this.eat_direction = [];
        this.eaten = [];
        this.fuck = null;
        this.input = false;
        this.output = false;
        this.flow = Direction.none;
        switch (char.toLowerCase()) {
            case " ":
                this.collision = false;
                break;
            case "l":
                this.collision = false;
                this.flow = Direction.left;
                break;
            case "r":
                this.collision = false;
                this.flow = Direction.right;
                break;
            case "u":
                this.collision = false;
                this.flow = Direction.up;
                break;
            case "d":
                this.collision = false;
                this.flow = Direction.down;
                break;
            case "x":
                this.eater = true;
                this.eat_direction = [
                    Direction.left,
                    Direction.right,
                    Direction.down,
                    Direction.up,
                ];
                break;
            case "f":
                this.eater = true;
                this.eat_direction = [];
                this.fuck = new Fuck();
                break;
            case "i":
                this.input = true;
                break;
            case "o":
                this.eater = true;
                this.eat_direction = [
                    Direction.left,
                    Direction.right,
                    Direction.down,
                    Direction.up,
                ];
                this.output = true;
                break;
        }
    }

    eat(particle) {
        if (this.eat_direction.includes(particle.direction)) {
            this.eaten.push(particle);
            return true;
        } else {
            return false;
        }
    }

    update() {
        if (this.fuck != null) {
            this.fuck.update(this);
        }
        if (this.input == true) {
            if (this.flowcore.input.length > 0) {
                if (
                    this.create_particle(this.flowcore.input[0], Direction.left)
                ) {
                    this.flowcore.input = this.flowcore.input.substr(1);
                }
            }
        }
        if (this.output == true) {
            this.eaten.forEach((p) => {
                this.flowcore.output += p.char;
            });
        }
        if (this.eater == true) {
            this.eaten = [];
        }
    }

    create_particle(char, direction) {
        // var y =
        // (this.y + dmap[direction][0] + this.flowcore.H) % this.flowcore.H;
        // var x =
        // (this.x + dmap[direction][1] + this.flowcore.W) % this.flowcore.W;

        var y = this.y;
        var x = this.x;

        var p = this.flowcore.get_particle(y, x);
        if (p == null) return false;
        if (p.char != "") return false;

        this.flowcore.create_particle(y, x, char, direction);
        return true;
    }
}
