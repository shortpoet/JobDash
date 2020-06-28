// ./src/task/task.controller.ts

import { Controller, Get, Res, HttpStatus, Post, Body, Put, Query, NotFoundException, Delete, Param } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDTO } from './dto/create-task.dto';
import { query } from 'express';
var mongoose = require('mongoose')

@Controller('task')
export class TaskController {
    constructor(private taskService: TaskService) { }

    // add a task
    @Post('/create')
    async addTask(@Res() res, @Body() createTaskDTO: CreateTaskDTO) {
        console.log('create task')
        // console.log(createTaskDTO)
        // console.log(createTaskDTO.contact)
        // console.log(mongoose.Types.ObjectId.isValid(createTaskDTO))
        const task = await this.taskService.addTask(createTaskDTO);
        // console.log(task.locked)
        return res.status(HttpStatus.OK).json({
            dtoLog: "Task has been created successfully",
            task
        })
    }

    // Retrieve tasks list
    @Get('tasks')
    async getAllTask(@Res() res) {
        const tasks = await this.taskService.getAllTask();
        // console.log('logging tasks')
        // console.log(tasks)
        // tasks.forEach(task => {
        //     console.log(task)
        //     console.log(task.contact)
        // })
        return res.status(HttpStatus.OK).json(tasks);
    }

    // Fetch a particular task using ID
    @Get('task/:taskID')
    async getTask(@Res() res, @Param('task_id') taskID) {
        const task = await this.taskService.getTask(taskID);
        if (!task) throw new NotFoundException('Task does not exist!');
        return res.status(HttpStatus.OK).json(task);
    }

    // Update a task's details
    @Put('/update')
    async updateTask(@Res() res, @Query('task_id') task_id, @Body() createTaskDTO: CreateTaskDTO) {
        console.log(createTaskDTO._id)
        const task = await this.taskService.updateTask(task_id, createTaskDTO);
        // console.log(task.id)
        if (!task) throw new NotFoundException('Task does not exist!');
        return res.status(HttpStatus.OK).json({
            dtoLog: 'Task has been successfully updated',
            task
        });
    }

    // Delete a task
    @Delete('/delete')
    async deleteTask(@Res() res, @Query('task_id') task_id) {
        const task = await this.taskService.deleteTask(task_id);
        if (!task) throw new NotFoundException('Task does not exist');
        return res.status(HttpStatus.OK).json({
            dtoLog: 'Task has been deleted',
            task
        })
    }
}