import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task } from 'src/task/interfaces/task.interface';
import { TASK_SOURCE, TASK_DESTINATION } from './task.module';
import { TaskSourceService } from './task.source.service';

// @Injectable()
// export class TaskSourceService {
//   constructor(
//     @InjectModel(TASK_SOURCE)
//       readonly taskSource: Model<Task>,
//     @Inject(forwardRef(() => TaskArchiverService))
//       private taskArchiverService: TaskArchiverService,
//   ) {}
// }

@Injectable()
export class TaskArchiverService {
  constructor(
    @InjectModel(TASK_DESTINATION)
      private readonly taskDestination: Model<Task>,
    @Inject(forwardRef(() => TaskSourceService))
      private taskSourceService: TaskSourceService,
  ) { }

  async getAllTask(): Promise<Task[]> {
    const tasks = await this.taskSourceService.taskSource.find().exec();
    return tasks;
  }

  // fetch all messages
  create(tasks): Array<Promise<Task>> {
    return tasks.map(async (task: Task) => {
      return await this.taskDestination
        .findOne({ _id: task._id })
        .exec()
        .then(async dbTask => {
          // We check if a language already exists.
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
