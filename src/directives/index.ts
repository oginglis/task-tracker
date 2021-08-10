import tooltipDirective from "./Tooltip/";
import focusDirective from "./focus"
import vClickOutside from "./clickoutside"

// register all directives
const directives = (app: any) => {
  tooltipDirective(app);
  focusDirective(app);

};

export default directives;
