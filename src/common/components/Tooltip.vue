<template>
  <span :tooltip="tooltipText" :position="position"><slot /></span>
</template>

<script  lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Tooltip",
  props: {
    tooltipText: {
      type: String,
      default: "Tooltip text",
    },
    position: {
      default: "top",
      type: String,
    },
  },
});
</script>

<style scoped>
[tooltip] {
  position: relative;
  font-family: aktiv-grotesk, sans-serif;
  font-weight: 200;
  font-style: normal;
  /* position: TOP */
  /* position: BOTTOM */
  /* position: LEFT */
  /* position: RIGHT */
  /* FX All The Things */
}
[tooltip] > * {
  display: inline-block;
}
[tooltip]:before,
[tooltip]:after {
  text-transform: none;

  /* opinion 2 */
  font-size: 1rem;
  /* opinion 3 */
  line-height: 1;
  user-select: none;
  pointer-events: none;
  position: absolute;
  display: none;
  opacity: 0;
}
[tooltip]:before {
  content: "";
  border: 5px solid transparent;
  /* opinion 4 */
  z-index: 1001;
  /* absurdity 1 */
}
[tooltip]:after {
  content: attr(tooltip);
  /* magic! */
  /* most of the rest of this is opinion */

  text-align: center;
  /* Let the content set the size of the tooltips but this will also keep them from being obnoxious */
  min-width: 3em;
  max-width: 21em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0.5rem;
  border-radius: 0.3rem;
  box-shadow: 0 1em 2em -0.5em rgba(0, 0, 0, 0.35);
  background: #495057;
  color: #fff;
  z-index: 1000;
  font-family: aktiv-grotesk, sans-serif;
  font-weight: 200;
  font-style: normal;
  /* absurdity 2 */
}
[tooltip]:hover:before,
[tooltip]:hover:after {
  display: block;
}
[tooltip]:not([position]):before,
[tooltip][position^="top"]:before {
  bottom: 100%;
  border-bottom-width: 0;
  border-top-color: #495057;
}
[tooltip]:not([position]):after,
[tooltip][position^="top"]::after {
  bottom: calc(100% + 5px);
}
[tooltip]:not([position])::before,
[tooltip]:not([position])::after,
[tooltip][position^="top"]::before,
[tooltip][position^="top"]::after {
  left: 50%;
  transform: translate(-50%, -0.5em);
}
[tooltip][position^="bottom"]::before {
  top: 105%;
  border-top-width: 0;
  border-bottom-color: #495057;
}
[tooltip][position^="bottom"]::after {
  top: calc(105% + 5px);
}
[tooltip][position^="bottom"]::before,
[tooltip][position^="bottom"]::after {
  left: 50%;
  transform: translate(-50%, 0.5em);
}
[tooltip][position^="left"]::before {
  top: 50%;
  border-right-width: 0;
  border-left-color: #495057;
  left: calc(0em - 5px);
  transform: translate(-0.5em, -50%);
}
[tooltip][position^="left"]::after {
  top: 50%;
  right: calc(100% + 5px);
  transform: translate(-0.5em, -50%);
}
[tooltip][position^="right"]::before {
  top: 50%;
  border-left-width: 0;
  border-right-color: #495057;
  right: calc(0em - 5px);
  transform: translate(0.5em, -50%);
}
[tooltip][position^="right"]::after {
  top: 50%;
  left: calc(100% + 5px);
  transform: translate(0.5em, -50%);
}
[tooltip]:not([position]):hover::before,
[tooltip]:not([position]):hover::after,
[tooltip][position^="top"]:hover::before,
[tooltip][position^="top"]:hover::after,
[tooltip][position^="bottom"]:hover::before,
[tooltip][position^="bottom"]:hover::after {
  animation: tooltips-vert 300ms ease-out 0.5s forwards;
}
[tooltip][position^="left"]:hover::before,
[tooltip][position^="left"]:hover::after,
[tooltip][position^="right"]:hover::before,
[tooltip][position^="right"]:hover::after {
  animation: tooltips-horz 300ms ease-out 0.5s forwards;
}
/* don't show empty tooltips */
[tooltip=""]::before,
[tooltip=""]::after {
  display: none !important;
}
/* KEYFRAMES */
@keyframes tooltips-vert {
  to {
    opacity: 0.9;
    transform: translate(-50%, 0);
  }
}
@keyframes tooltips-horz {
  to {
    opacity: 0.9;
    transform: translate(0, -50%);
  }
}
</style>
