import { Injectable, HttpException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Task } from './interfaces/task.interface';
import { CreateTaskDTO } from './dto/create-task.dto';

@Injectable()
export class TaskService {
  constructor(@InjectModel('Task') private readonly taskModel: Model<Task>) { }
  // fetch all tasks
  async getAllTask(): Promise<Task[]> {
    // console.log('get tasks')
    const tasks: Task[] = await this.taskModel.find()
      .populate('Contact')
      // .populate({
      //   path: 'contact',
      //   populate: {
      //     path: 'contact',
      //     model: 'Contact'
      //   }
      // })
      .exec();
    // console.log(tasks)
    // console.log(tasks.map(task => task._id))
    return tasks;
  }
  // Get a single task
  async getTask(taskID): Promise<Task> {
    const task = await this.taskModel.findById(taskID).populate('contact').exec();
    return task;
  }
  // post a single task
  async addTask(createTaskDTO: CreateTaskDTO): Promise<Task> {
    const tasks = await this.getAllTask()
    console.log('get task')
    // console.log(tasks)
    console.log(tasks.map(task => task._id))
    
    const newTask = await this.taskModel(createTaskDTO);
    console.log(newTask)
    return newTask.save();
  }
  // Edit task details
  async updateTask(taskID, createTaskDTO: CreateTaskDTO): Promise<Task> {
    const updatedTask = await this.taskModel
      .findByIdAndUpdate(taskID, createTaskDTO, { new: true });
    return updatedTask;
  }
  // Delete a task
  async deleteTask(taskID): Promise<any> {
    const deletedTask = await this.taskModel.findByIdAndRemove(taskID);
    return deletedTask;
  }
}