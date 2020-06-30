import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TaskSchema } from 'src/task/schemas/task.schema';
import { TaskArchiverService } from './task.service';
import { DESTINATION_CONNECTION } from 'src/archiver/providers/providers.interface';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Task', schema: TaskSchema }], DESTINATION_CONNECTION),
  ],
  providers: [TaskArchiverService],
  exports: [TaskArchiverService],
})
export class TaskDestinationModule {}
