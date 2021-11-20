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
      default(): Array<{}> {
        return [
          { colour: "hsl(39, 81%, 73%)", active: true },
          { colour: "hsl(13, 80%, 48%)", active: false },
          { colour: "hsl(341, 67%, 47%)", active: false },
          { colour: "hsl(75, 56%, 38%)", active: false },
          { colour: "hsl(10, 30%, 62%)", active: false },
          { colour: "hsl(0, 0%, 100%)", active: false },
          { colour: "hsl(319, 57%, 39%)", active: false },
          { colour: "hsl(2, 73%, 43%)", active: false },
          { colour: "hsl(207, 15%, 12%)", active: false },
          { colour: "hsl(196, 44%, 51%)", active: false },
          { colour: "hsl(12, 73%, 51%)", active: false },
          { colour: "hsl(164, 35%, 52%)", active: false },
          { colour: "hsl(31, 80%, 54%)", active: false },
          { colour: "hsl(205, 80%, 40%)", active: false },
          { colour: "hsl(41, 62%, 51%)", active: false },
          { colour: "hsl(186, 56%, 42%)", active: false },
          { colour: "hsl(195, 23%, 27%)", active: false },
          { colour: "hsl(316, 38%, 58%)", active: false },
          { colour: "hsl(207, 15%, 12%)", active: false },
          { colour: "hsl(212, 73%, 36%)", active: false },
        ];
      },
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
    this.textColor;
    console.log(this.canvasSize);
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
    this.p5Canvas = new P5(sketch);
  },
  unmounted() {
    this.p5Canvas = null;
  },
});
</script>


<style scoped>
</style>
