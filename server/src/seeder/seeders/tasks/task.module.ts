import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TaskSchema } from 'src/task/schemas/task.schema';
import { TaskSeederService } from './task.service';

const connString = process.env.DOCKER == '1'
  ? 'mongodb://mongo/job-db'
  : 'mongodb://localhost/job-db'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Task', schema: TaskSchema }])
  ],
  providers: [TaskSeederService],
  exports: [TaskSeederService],
})
export class TaskSeederModule {}
