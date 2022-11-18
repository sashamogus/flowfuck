import { Direction } from "./Direction.js";

const MEMORY_SIZE = 256;
const MEMORY_MASK = 0xff;

export default class Fuck {
    constructor() {
        this.memory = [];
        for (var i = 0; i < MEMORY_SIZE; i++) {
            this.memory[i] = 0;
        }
        this.memory_ptr = 0;

        this.program = [];
        this.program_ptr = 0;

        this.input = "";
        this.output_direction = Direction.left;
    }

    update(block) {
        block.eaten.forEach((p) => {
            switch (p.direction) {
                case Direction.left:
                    this.input = p.char;
                    break;
                case Direction.down:
                    this.program.push(p.char);
                    break;
            }
        });

        block.eat_direction = [];
        if (this.program_ptr < this.program.length) {
            switch (this.program[this.program_ptr]) {
                case "+":
                    this.memory[this.memory_ptr] =
                        (this.memory[this.memory_ptr] + 1) & MEMORY_MASK;
                    break;
                case "-":
                    this.memory[this.memory_ptr] =
                        (this.memory[this.memory_ptr] + MEMORY_MASK - 1) &
                        MEMORY_MASK;
                    break;
                case ">":
                    this.memory_ptr = (this.memory_ptr + 1) % MEMORY_SIZE;
                    break;
                case "<":
                    this.memory_ptr =
                        (this.memory_ptr + MEMORY_SIZE - 1) % MEMORY_SIZE;
                    break;
                case "[":
                    if (this.memory[this.memory_ptr] == 0) {
                        var n = 0;
                        for (
                            var i = this.program_ptr;
                            i < this.program.length;
                            i++
                        ) {
                            var c = this.program[i];
                            if (c == "[") n++;
                            if (c == "]") n--;
                            if (n == 0) {
                                this.program_ptr = i;
                                break;
                            }
                        }
                        if (n != 0) {
                            this.program_ptr--;
                        }
                    }
                    break;
                case "]":
                    if (this.memory[this.memory_ptr] != 0) {
                        var n = 0;
                        for (var i = this.program_ptr; i >= 0; i--) {
                            var c = this.program[i];
                            if (c == "[") n++;
                            if (c == "]") n--;
                            if (n == 0) {
                                this.program_ptr = i;
                                break;
                            }
                        }
                        if (n != 0) {
                            this.program_ptr--;
                        }
                    }
                    break;
                case ".":
                    // create a particle on the left side
                    if (
                        block.create_particle(
                            String.fromCharCode(this.memory[this.memory_ptr]),
                            this.output_direction
                        ) == false
                    ) {
                        this.program_ptr--;
                    }
                    break;
                case ",":
                    if (this.input != "") {
                        this.memory[this.memory_ptr] = this.input.charCodeAt(0);
                        this.input = "";
                    } else {
                        this.program_ptr--;
                    }
                    break;
                case "l":
                    this.output_direction = Direction.left;
                    break;
                case "r":
                    this.output_direction = Direction.right;
                    break;
                case "d":
                    this.output_direction = Direction.down;
                    break;
                case "u":
                    this.output_direction = Direction.up;
                    break;
            }
            this.program_ptr++;
        } else {
            block.eat_direction.push(Direction.down);
        }

        if (this.input == "") {
            block.eat_direction.push(Direction.left);
        }
    }
}
