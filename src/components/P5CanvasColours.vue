<template>
  <div id="canvas" class="flexcanvas"></div>
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
  mounted() {
    let sketch = (p: P5) => {
      let spring = 0.05;
      let gravity = -0.01;
      let friction = -0.99;
      let balls: any = [];
      let width = this.canvasSize!.width;
      let height = this.canvasSize!.height;
      let numBalls: number = this.ballColours!.length;
      p.setup = () => {
        let ctx = p.createCanvas(width || 400, height || 400);
        ctx.parent(this.$el);

        this.ballColours!.forEach((ball: any, index) => {
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
          ball.move();
          ball.display();
        });

        if (balls.some(isHovered)) {
          p.cursor(p.HAND);
        } else {
          p.cursor(p.ARROW);
        }
      };

      p.mousePressed = () => {
        balls.forEach((ball: any) => {
          if (ball.clicked()) {
            this.clickedColor = ball.color;
          }
        });

        if (balls.some((ball: any) => ball.clicked())) {
          this.$emit("clickColor", this.clickedColor);
        }
        // if(balls.some((ball: any) => ball.clicked()){
        //     this.clickedColor = ball.color;
        //     this.$emit("clickColor", this.clickedColor);
        //   }

        // });
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
        move() {
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
    new P5(sketch);
  },
});
</script>


<style scoped>
</style>
