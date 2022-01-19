import {TodoType} from "./Todo"

export interface ListType {
  backgroundColour: string;
  width: number;
  height: number;
  title: string;
  id: number;
  todos?: Array<TodoType>; 
}


