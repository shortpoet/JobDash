import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TaskSchema } from 'src/task/schemas/task.schema';
import { TaskArchiverService } from './task.service';
import { DESTINATION_CONNECTION, SOURCE_CONNECTION } from 'src/archiver/providers/providers.interface';
export const TASK_SOURCE = 'TaskSource'
export const TASK_DESTINATION = 'TaskDestination'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: TASK_SOURCE, schema: TaskSchema }], SOURCE_CONNECTION)
  ],
  providers: [TaskArchiverService],
  exports: [TaskArchiverService],
})
export class TaskSourceModule {}

@Module({
  imports: [
    MongooseModule.forFeature([{ name: TASK_DESTINATION, schema: TaskSchema }], DESTINATION_CONNECTION)
  ],
  providers: [TaskArchiverService],
  exports: [TaskArchiverService],
})
export class TaskDestinationModule {}
