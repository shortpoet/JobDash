import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TaskSchema } from 'src/task/schemas/task.schema';
import { TaskRetrieverService } from './task.service';
import { SOURCE_CONNECTION } from 'src/archiver/providers/providers.interface';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Task', schema: TaskSchema }], SOURCE_CONNECTION)
  ],
  providers: [TaskRetrieverService],
  exports: [TaskRetrieverService],
})
export class TaskSourceModule {}
