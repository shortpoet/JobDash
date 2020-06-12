import { Task } from "./task.interface";
import { Ref } from "vue";

// export interface ITaskColumn {
//   id: number
//   category: string
//   tasks: Task[]
// }

export interface ITaskColumn {
  order: number
  category: string
  tasks: Record<string, Task>
}