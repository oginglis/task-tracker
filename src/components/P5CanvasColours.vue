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
      console.log(this.p5Canvas.title);
      this.p5Canvas.redraw();
    },
  },
  mounted() {
    console.log("P5 Mounted");

    this.textColor;
    console.log(this.canvasSize);
    let sketch2 = (p: P5) => {
      let width = (this as any).canvasSize!.width;
      let height = this.canvasSize!.height;

      let balls: any = [];

      let maxSpeed = 3;

      p.setup = () => {
        let ctx = p.createCanvas(width || 400, height || 400);
        ctx.parent(this.$el);

        this.ballColours!.forEach((colour: any, index: number) => {
          let bc = this.hslTorbg(colour.colour);
          console.log(bc);
          balls[index] = new Ball(25, bc);
        });
      };

      const isHovered = function (currentValue: any) {
        if (p.dist(p.mouseX, p.mouseY, currentValue.x, currentValue.y) < 30) {
          return true;
        } else {
          return false;
        }
      };
      p.draw = () => {
        p.background(this.hslTorbg(this.bgColor));
        p.textAlign("center");
        p.textFont("aktiv-grotesk");
        p.textSize(15);
        p.fill(this.textColor!.color);
        p.text("Choose a colour for " + this.title, width / 2, height / 2);
        for (let i = 0; i < balls.length; i++) {
          balls[i].move(
            (this as any).canvasSize!.width,
            this.canvasSize!.height
          );
        }
        for (let i = 0; i < balls.length; i++) {
          balls[i].show();
        }
        if (balls.some(isHovered)) {
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
          console.log(this.clickedColor);

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
        constructor(radius: any, bc: any) {
          this.ballColor = bc;
          this.radius = radius;
          this.pos = this.pickLocation();
          this.speed = p.createVector(
            p.random(-maxSpeed, maxSpeed),
            p.random(-maxSpeed, maxSpeed)
          );
          this.mass = 1;
        }

        clicked() {
          if (
            p.dist(p.mouseX, p.mouseY, this.pos.x, this.pos.y) <
            this.radius * 2
          ) {
            return true;
          } else {
            return false;
          }
        }

        pickLocation() {
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
                console.log("overlapping another circle, trying new location");
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

          this.pos.x += this.speed.x * 0.99;
          this.pos.y += this.speed.y * 0.99;
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
          this.correction = 60 - this.dist;
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
    let sketch = (p: P5) => {
      let spring = 0.05;
      let gravity = -0.01;
      let friction = -0.99;
      let balls: any = [];
      let width = (this as any).canvasSize!.width;
      let height = this.canvasSize!.height;
      let numBalls: number = this.ballColours!.length;
      p.setup = () => {
        let ctx = p.createCanvas(width || 400, height || 400);
        ctx.parent(this.$el);
        this.ballColours!.forEach((ball: any, index: number) => {
          let bc = this.hslTorbg(ball.colour);
          balls[index] = new Ball(
            p.random(width),
            p.random(height),
            p.random(-3, 3),
            p.random(-3, 3),
            40,
            index,
            balls,
            bc
          );
        });
        p.noStroke();
        p.fill(255, 204);
      };
      const isHovered = function (currentValue: any) {
        if (p.dist(p.mouseX, p.mouseY, currentValue.x, currentValue.y) < 30) {
          return true;
        } else {
          return false;
        }
      };
      p.draw = () => {
        p.background(this.hslTorbg(this.bgColor));
        p.textAlign("center");
        p.textFont("aktiv-grotesk");
        p.textSize(15);
        p.fill(this.textColor!.color);
        p.text("Choose a colour for " + this.title, width / 2, height / 2);
        balls.forEach((ball: any) => {
          ball.collide();
          ball.move((this as any).canvasSize!.width, this.canvasSize!.height);
          ball.display();
        });
        if (balls.some(isHovered)) {
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

          this.clickedColor = clickedBall.color;
          console.log("click ball emitted - Check this");
          this.$emit("clickColor", this.clickedColor);
        }
      };
      class Ball {
        x: number;
        y: number;
        vx: number;
        vy: number;
        diameter: number;
        id: number;
        others: Array<Ball>;
        color: String;
        constructor(
          xin: number,
          yin: number,
          vxin: number,
          vyin: number,
          din: number,
          idin: number,
          oin: Array<Ball>,
          color: String
        ) {
          this.x = xin;
          this.y = yin;
          this.vx = vxin;
          this.vy = vyin;
          this.diameter = din;
          this.id = idin;
          this.others = oin;
          this.color = color;
        }
        collide() {
          for (let i = this.id + 1; i < numBalls; i++) {
            // console.log(others[i]);
            let dx = this.others[i].x - this.x;
            let dy = this.others[i].y - this.y;
            let distance = p.sqrt(dx * dx + dy * dy);
            let minDist = this.others[i].diameter / 2 + this.diameter / 2;
            if (distance < minDist) {
              //console.log("2");
              let angle = p.atan2(dy, dx);
              let targetX = this.x + p.cos(angle) * minDist;
              let targetY = this.y + p.sin(angle) * minDist;
              let ax = (targetX - this.others[i].x) * spring;
              let ay = (targetY - this.others[i].y) * spring;
              this.vx -= ax;
              this.vy -= ay;
              this.others[i].vx += ax;
              this.others[i].vy += ay;
            }
          }
        }
        move(width: any, height: any) {
          this.vy += gravity;
          this.x += this.vx;
          this.y += this.vy;
          if (this.x + this.diameter / 2 > width) {
            this.x = width - this.diameter / 2;
            this.vx *= friction;
          } else if (this.x - this.diameter / 2 < 0) {
            this.x = this.diameter / 2;
            this.vx *= friction;
          }
          if (this.y + this.diameter / 2 > height) {
            this.y = height - this.diameter / 2;
            this.vy *= friction;
          } else if (this.y - this.diameter / 2 < 0) {
            this.y = this.diameter / 2;
            this.vy *= friction;
          }
        }
        display() {
          p.fill(this.color as any);
          p.ellipse(this.x, this.y, this.diameter, this.diameter);
        }
        clicked() {
          if (p.dist(p.mouseX, p.mouseY, this.x, this.y) < this.diameter) {
            return true;
          } else {
            return false;
          }
        }
      }
    };
    console.log(sketch);
    this.p5Canvas = new P5(sketch2);
  },
  unmounted() {
    console.log("UNMOUNTED CALLED");
    this.p5Canvas = null;
  },
});
</script>


<style scoped>
</style>
