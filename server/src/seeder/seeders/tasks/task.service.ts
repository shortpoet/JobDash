import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task } from 'src/task/interfaces/task.interface';
import { tasks } from './data';

@Injectable()
export class TaskSeederService {
  constructor(@InjectModel('Task') private readonly taskModel: Model<Task>) { }
  // fetch all messages
  create(): Array<Promise<Task>> {
    return tasks.map(async (task: Task) => {
      return await this.taskModel
        .findOne({ _id: task._id })
        .exec()
        .then(async dbTask => {
          // We check if a language already exists.
          // If it does don't create a new one.
          if (dbTask) {
            return Promise.resolve(null);
          }
          return Promise.resolve(
            await this.taskModel.create(task),
          );
        })
        .catch(error => Promise.reject(error));
    });
  }
}
