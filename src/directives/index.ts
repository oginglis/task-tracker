import tooltipDirective from "./Tooltip/";
import focusDirective from "./focus"


// register all directives
const directives = (app: any) => {
  tooltipDirective(app);
  focusDirective(app);

};

export default directives;
