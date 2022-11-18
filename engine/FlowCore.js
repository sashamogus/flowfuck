import Block from "./Block.js";
import Particle from "./Particle.js";
import { Direction, dmap } from "./Direction.js";

export default class FlowCore {
    constructor(text) {
        var lines = text.split("\n");
        this.H = lines.length;
        this.W = -1;
        for (var i = 0; i < lines.length; i++) {
            this.W = Math.max(this.W, lines[i].length);
        }

        // initialize blocks and particles as an grid
        this.blocks = [];
        this.particles = [];
        for (var i = 0; i < this.H; i++) {
            var line = lines[i];
            var b_row = [];
            var p_row = [];
            var start = -1;
            var target = "";
            for (var j = 0; j < this.W; j++) {
                var b = j < line.length ? line[j] : " ";
                b_row[j] = b;
                p_row[j] = "";
                if (start == -1) {
                    var q = "\"'`";
                    if (q.indexOf(b) != -1) {
                        start = j;
                        target = b;
                    }
                } else {
                    if (b == target) {
                        b_row[start] = " ";
                        b_row[j] = " ";
                        for (var k = start + 1; k < j; k++) {
                            p_row[k] = b_row[k];
                            b_row[k] = " ";
                        }
                        start = -1;
                        target = "";
                    }
                }
            }
            for (var j = 0; j < this.W; j++) {
                b_row[j] = new Block(b_row[j], this, i, j);
                p_row[j] = new Particle(p_row[j]);
            }
            this.blocks[i] = b_row;
            this.particles[i] = p_row;
        }
    }

    render() {
        var ret = "";
        for (var i = 0; i < this.H; i++) {
            for (var j = 0; j < this.W; j++) {
                var b = this.blocks[i][j].char;
                if (this.particles[i][j].char != "") {
                    b = this.particles[i][j].char;
                }
                ret += b;
            }
            ret += "\n";
        }

        return ret;
    }

    get_block(y, x) {
        if (y < 0 || x < 0 || y >= this.H || x >= this.W) {
            return null;
        }
        return this.blocks[y][x];
    }
    get_particle(y, x) {
        if (y < 0 || x < 0 || y >= this.H || x >= this.W) {
            return null;
        }
        return this.particles[y][x];
    }
    create_particle(y, x, char, direction) {
        this.particles[y][x] = new Particle(char, direction);
    }

    move_particles() {
        for (var i = 0; i < this.H; i++) {
            for (var j = 0; j < this.W; j++) {
                var p = this.particles[i][j];
                if (p.char == "") continue;
                p.updated = false;
            }
        }
        for (var i = 0; i < this.H; i++) {
            for (var j = 0; j < this.W; j++) {
                var p = this.particles[i][j];
                if (p.char == "") continue;
                if (p.updated) continue;

                var y = (i + dmap[p.direction][0] + this.H) % this.H;
                var x = (j + dmap[p.direction][1] + this.W) % this.W;

                var pa = this.get_particle(y, x);
                if (pa == null) continue;
                if (pa.char != "") continue;

                var ba = this.get_block(y, x);
                if (ba == null) continue;
                if (ba.eater == true) {
                    if (ba.eat(p)) {
                        this.particles[i][j] = new Particle("");
                        continue;
                    }
                }
                if (ba.collision == true) continue;

                if (ba.flow != Direction.none) {
                    p.direction = ba.flow;
                }

                this.particles[y][x] = p;
                this.particles[i][j] = new Particle("");
                p.updated = true;
            }
        }
    }

    update_blocks() {
        for (var i = 0; i < this.H; i++) {
            for (var j = 0; j < this.W; j++) {
                var b = this.blocks[i][j];
                b.update();
            }
        }
    }
}
