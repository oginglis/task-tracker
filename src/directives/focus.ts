const focusDirective = (app: any) => {
  app.directive('focus', {
    // When the bound element is inserted into the DOM...
    mounted(el: any) {
      // Focus the element
      el.focus()
    }
  })
}


export default focusDirective;
