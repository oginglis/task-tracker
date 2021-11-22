<template>
  <div id="canvas" ref="canva" class="flexcanvas"></div>
</template>

<script lang="ts">
import P5 from "p5";
import { defineComponent, PropType } from "vue";
import { TrackerDimensions } from "../types/Dimensions";
import tinyColor from "tinycolor2";
import { Color } from "../types/Color";
export default defineComponent({
  name: "P5Canvas",
  data: function () {
    return {
      clickedColor: "",
      p5Canvas: {} as any,
    };
  },
  props: {
    canvasSize: {
      type: Object as PropType<TrackerDimensions>,
    },
    bgColor: {
      type: String,
      default: "hsl(39, 81%, 73%)",
    },
    ballColours: {
      type: Array as PropType<Array<Color>>,
    },
    title: {
      type: String,
      default: "Task Tracker",
    },
    textColor: {
      type: Object,
    },
  },
  methods: {
    hslTorbg: function (hsl: any): string {
      let col = tinyColor(hsl);
      return col.toRgbString();
    },
  },
  beforeUpdate() {},
  watch: {
    canvasSize: function (newSize) {
      this.p5Canvas.resizeCanvas(newSize.width, newSize.height);

      this.p5Canvas.width = newSize.width;
      this.p5Canvas.height = newSize.height;
      // this.p5Canvas.showBalls().forEach((ball: any) => {
      //   ball.pickLocation(newSize.width, newSize.height);
      // });
      // console.log(this.p5Canvas.title);
      this.p5Canvas.redraw();
    },
  },
  mounted() {
    console.log("P5 Mounted");

    this.textColor;

    let sketch2 = (p: P5) => {
      let width = (this as any).canvasSize!.width;
      let height = this.canvasSize!.height;

      let balls: any = [];

      let maxSpeed = 5;

      p.setup = () => {
        let ctx = p.createCanvas(width || 400, height || 400);
        ctx.parent(this.$el);
        let filteredBallColours = this.ballColours!.filter((colour) => {
          return colour.colour !== (this as any).bgColor;
        });

        filteredBallColours!.forEach((colour: any, index: number) => {
          let bc = this.hslTorbg(colour.colour);

          balls[index] = new Ball(25, bc, width, height);
        });
      };

      p.draw = () => {
        p.background(this.hslTorbg(this.bgColor));
        p.textAlign("center");
        p.textFont("aktiv-grotesk");
        p.textSize(15);
        p.fill(this.textColor!.color);
        p.text(this.title, width / 2, height / 2);
        for (let i = 0; i < balls.length; i++) {
          balls[i].move(
            (this as any).canvasSize!.width,
            this.canvasSize!.height
          );
        }
        for (let i = 0; i < balls.length; i++) {
          balls[i].show();
        }
        if (
          balls.some((ball: any) => {
            return ball.clicked() === true;
          })
        ) {
          p.cursor(p.HAND);
        } else {
          p.cursor(p.ARROW);
        }
      };

      p.mouseClicked = () => {
        if (balls.some((ball: any) => ball.clicked())) {
          let clickedBall = balls.find((ball: any) => {
            return ball.clicked() === true;
          });

          this.clickedColor = clickedBall.ballColor;
          console.log("Ball Clicked + Emitting Click Colour Event");
          this.$emit("clickColor", this.clickedColor);
        }
      };

      class Ball {
        radius: any;
        ballColor: any;
        pos: any;
        speed: any;
        mass: any;
        direction: any;
        correction: any;
        v1: any;
        v2: any;
        dist: any;
        constructor(radius: any, bc: any, w: any, h: any) {
          this.ballColor = bc;
          this.radius = radius;
          this.pos = this.pickLocation(w, h);
          this.speed = p.createVector(
            p.random(-maxSpeed, maxSpeed),
            p.random(-maxSpeed, maxSpeed)
          );
          this.mass = 1;
        }

        clicked() {
          if (
            p.dist(p.mouseX, p.mouseY, this.pos.x, this.pos.y) < this.radius
          ) {
            return true;
          } else {
            return false;
          }
        }

        pickLocation(width: any, height: any) {
          //spawn within canvas
          let xOption = p.random(this.radius, width - this.radius);
          let yOption = p.random(this.radius, height - this.radius);

          // check whether spawning on this location doesn't overlap other circles
          for (let i = 0; i < balls.length; i++) {
            // don't check for current circle
            if (balls[i] != this) {
              // get distance to other circle
              let d = p.dist(xOption, yOption, balls[i].pos.x, balls[i].pos.y);
              // check whether overlapping
              if (d <= this.radius + balls[i].radius) {
                // generate new location and rerun check

                xOption = p.random(this.radius, width - this.radius);
                yOption = p.random(this.radius, height - this.radius);
                i = -1;
              }
            }
          }
          return p.createVector(xOption, yOption);
        }

        move(width: any, height: any) {
          for (let i = 0; i < balls.length; i++) {
            if (balls[i] != this) {
              let d = p.dist(
                this.pos.x,
                this.pos.y,
                balls[i].pos.x,
                balls[i].pos.y
              );
              if (d < this.radius + balls[i].radius) {
                this.collision(balls[i]);
              }
            }
          }

          if (
            this.pos.x - this.radius < 0 ||
            this.pos.x + this.radius > width
          ) {
            this.speed.x *= -1;
          }
          if (
            this.pos.y - this.radius < 0 ||
            this.pos.y + this.radius > height
          ) {
            this.speed.y *= -1;
          }

          this.pos.x += this.speed.x;
          this.pos.y += this.speed.y;
          this.pos.x = p.constrain(this.pos.x, 0, 500);
          this.pos.y = p.constrain(this.pos.y, 0, 500);
        }

        // takes ball object as input, sets speedvector to new x,y speed
        collision(other: any) {
          this.v1 = 0;
          this.v2 = 0;
          this.direction = P5.Vector.sub(other.pos, this.pos);
          this.dist = this.direction.mag();
          this.direction.normalize();
          //this is 60 because that is the radius you give them times two
          this.correction = 50 - this.dist;
          this.pos.sub(P5.Vector.mult(this.direction, this.correction / 2));
          other.pos.add(P5.Vector.mult(this.direction, this.correction / 2));
          this.v1 = this.direction.dot(this.speed) * 0.5;
          this.v2 = this.direction.dot(other.speed) * 0.5;
          this.direction.mult(this.v1 - this.v2);
          this.speed.sub(P5.Vector.mult(this.direction, 1));
          other.speed.add(P5.Vector.mult(this.direction, 1));
        }

        show() {
          p.fill(this.ballColor as any);
          p.noStroke();
          p.ellipse(this.pos.x, this.pos.y, this.radius * 2);
        }
      }
    };

    this.p5Canvas = new P5(sketch2);
  },
  beforeUnmount() {
    this.p5Canvas.remove();
    this.p5Canvas = null;
  },
  unmounted() {
    console.log("P5 Unmounted");
    this.p5Canvas = null;
  },
});
</script>


<style scoped>
</style>
