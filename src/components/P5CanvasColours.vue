<template>
  <div id="canvas"></div>
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
    return {};
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
      let gravity = -0.02;
      let friction = -0.9;
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
            30,
            index,
            balls,
            bc
          );
        });
        p.noStroke();
        p.fill(255, 204);
      };

      p.draw = () => {
        p.background(this.hslTorbg(this.bgColor));
        balls.forEach((ball: any) => {
          ball.collide();
          ball.move();
          ball.display();
        });
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
          din: number,
          idin: number,
          oin: Array<Ball>,
          color: String
        ) {
          this.x = xin;
          this.y = yin;
          this.vx = 0;
          this.vy = 0;
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
            //   console.log(distance);
            //console.log(minDist);
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
      }
    };
    new P5(sketch);
  },
});
</script>


<style scoped>
</style>
