import tooltipDirective from "./Tooltip/";
import focusDirective from "./focus"
import clickOutside from "./clickoutside"

// register all directives
const directives = (app: any) => {
  tooltipDirective(app);
  focusDirective(app);
  clickOutside(app);
};

export default directives;
