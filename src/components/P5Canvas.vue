<template>
  <div class="P5Canvas"></div>
</template>

<script lang="ts">
import P5 from "p5";
import { defineComponent } from "vue";

export default defineComponent({
  name: "P5Canvas",
  data: function () {
    return {};
  },
  created() {
    let sketch = (p: P5) => {
      let x = 320;
      let y = 180;
      let xspeed = 5;
      let yspeed = 2;

      let r = 25;

      p.setup = () => {
        p.createCanvas(640, 360);
      };

      p.draw = () => {
        p.background(0);
        p.ellipse(x, y, r * 2, r * 2);
        x += xspeed;
        y += yspeed;
        if (x > p.width - r || x < r) {
          xspeed = -xspeed;
        }
        if (y > p.height - r || y < r) {
          yspeed = -yspeed;
        }
      };
    };
    new P5(sketch);
  },
});
</script>


<style scoped>
</style>
