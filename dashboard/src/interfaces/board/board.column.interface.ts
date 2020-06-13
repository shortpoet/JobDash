import { Task } from "../task/task.interface";
import { Ref } from "vue";

// export interface ITaskColumn {
//   id: number
//   category: string
//   tasks: Task[]
// }

export interface IBoardColumn {
  order: number
  category: string
  tasks: Record<string, Task>
}