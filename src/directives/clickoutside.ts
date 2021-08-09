import { DirectiveBinding } from "@vue/runtime-core";

interface ClickOutsideElement extends HTMLElement {
  __vueClickEventHandler__: any
}


const clickOutsideDirective = (app: any) => {
  app.directive('click-outside', {
    mounted: function (el: ClickOutsideElement, binding: DirectiveBinding) {
      const ourClickEventHandler = (event: MouseEvent) => {
        if (!el.contains(event.target as HTMLElement) && el !== event.target) {
          binding.value(event);
        }
      };

      el.__vueClickEventHandler__ = ourClickEventHandler;

      document.addEventListener("click", ourClickEventHandler);
    },
    unmounted: function (el: ClickOutsideElement) {
      document.removeEventListener("click", el.__vueClickEventHandler__);
    }
  })
}

export default clickOutsideDirective;
