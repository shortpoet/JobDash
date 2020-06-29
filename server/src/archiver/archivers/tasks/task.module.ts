import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TaskSchema } from 'src/task/schemas/task.schema';
import { TaskArchiverService } from './task.service';
import { DESTINATION_CONNECTION, SOURCE_CONNECTION } from 'src/archiver/providers/providers.interface';
import { TaskSourceService } from './task.source.service';
export const TASK_SOURCE = 'TaskSource'
export const TASK_DESTINATION = 'TaskDestination'

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: TASK_SOURCE, schema: TaskSchema }], SOURCE_CONNECTION
    ),
    forwardRef(() => TaskDestinationModule)
  ],
  providers: [TaskArchiverService, TaskSourceService],
  exports: [TaskArchiverService],
})
export class TaskSourceModule {}

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: TASK_DESTINATION, schema: TaskSchema }], DESTINATION_CONNECTION
    ),
    forwardRef(() => TaskSourceModule)
  ],
  providers: [TaskArchiverService, TaskSourceService],
  exports: [TaskArchiverService],
})
export class TaskDestinationModule {}
