import { Task } from "./task.interface";

export interface ITaskColumn {
  id: number
  category: string
  tasks: Task[]
}