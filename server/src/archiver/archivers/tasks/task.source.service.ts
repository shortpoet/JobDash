import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task } from 'src/task/interfaces/task.interface';
import { TASK_SOURCE, TASK_DESTINATION } from './task.module';
import { TaskArchiverService } from './task.service';

@Injectable()
export class TaskSourceService {
  constructor(
    @InjectModel(TASK_SOURCE)
      readonly taskSource: Model<Task>,
    @Inject(forwardRef(() => TaskArchiverService))
      private taskArchiverService: TaskArchiverService,
  ) {}
}
