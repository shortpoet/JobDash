import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task } from 'src/task/interfaces/task.interface';
import { CreateTaskDTO } from './create-task.dto';
const fs = require('fs')

const storeData = (data, type) => {
  const path = `${process.cwd()}\\seed\\${type}.seed.json`
  try {
    fs.writeFileSync(path, JSON.stringify(data))
  } catch (err) {
    console.error(err)
  }
}

@Injectable()
export class TaskRetrieverService {
  constructor(@InjectModel('Task') private readonly taskSource: Model<Task>) { }
  async getAllTask(writeJson: boolean = false): Promise<Task[]> {
    const response: Task[] = await this.taskSource.find().exec();
    const tasks = response.map(task => new CreateTaskDTO(task));
    if (writeJson) {
      storeData(tasks, 'tasks')
    }
    return tasks;
  }
}
@Injectable()
export class TaskArchiverService {
  constructor(@InjectModel('Task') private readonly taskDestination: Model<Task>) { }
  create(tasks): Array<Promise<Task>> {
    return tasks.map(async (task: Task) => {
      return await this.taskDestination
        .findOne({ _id: task._id })
        .exec()
        .then(async dbTask => {
          // We check if a task already exists.
          // If it does don't create a new one.
          if (dbTask) {
            return Promise.resolve(null);
          }
          return Promise.resolve(
            await this.taskDestination.create(task),
          );
        })
        .catch(error => Promise.reject(error));
    });
  }
}
