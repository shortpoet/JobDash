import { Logger, Injectable } from "@nestjs/common";
import { ContactSeederService } from "./contacts/contact.service";
import { TaskSeederService } from "./tasks/task.service";
import { MessageSeederService } from "./messages/message.service";

@Injectable()
export class Seeder {
  constructor(
    private readonly logger: Logger,
    private readonly contactSeederService: ContactSeederService,
    private readonly taskSeederService: TaskSeederService,
    private readonly messageSeederService: MessageSeederService,
  ) { }
  async seed() {
    await this.contacts()
      .then(completed => {
        this.logger.debug('Successfuly completed seeding contacts...');
        Promise.resolve(completed);
      })
      .catch(error => {
        this.logger.error('Failed seeding contacts...');
        Promise.reject(error);
      });
    await this.tasks()
      .then(completed => {
        this.logger.debug('Successfuly completed seeding tasks...');
        Promise.resolve(completed);
      })
      .catch(error => {
        this.logger.error('Failed seeding tasks...');
        Promise.reject(error);
      });
    await this.messages()
      .then(completed => {
        this.logger.debug('Successfuly completed seeding messages...');
        Promise.resolve(completed);
      })
      .catch(error => {
        this.logger.error('Failed seeding messages...');
        Promise.reject(error);
      });
  }
  async contacts() {
    return await Promise.all(this.contactSeederService.create())
      .then(createdContacts => {
        // Can also use this.logger.verbose('...');
        this.logger.debug(
          'No. of contacts created : ' +
            // Remove all null values and return only created contacts.
            createdContacts.filter(
              nullValueOrCreatedContact => nullValueOrCreatedContact,
            ).length,
        );
        return Promise.resolve(true);
      })
      .catch(error => Promise.reject(error));
  }
  async tasks() {
    return await Promise.all(this.taskSeederService.create())
      .then(createdTasks => {
        // Can also use this.logger.verbose('...');
        this.logger.debug(
          'No. of tasks created : ' +
            // Remove all null values and return only created contacts.
            createdTasks.filter(
              nullValueOrCreatedTask => nullValueOrCreatedTask,
            ).length,
        );
        return Promise.resolve(true);
      })
      .catch(error => Promise.reject(error));
  }
  async messages() {
    return await Promise.all(this.messageSeederService.create())
      .then(createdMessages => {
        // Can also use this.logger.verbose('...');
        this.logger.debug(
          'No. of messages created : ' +
            // Remove all null values and return only created contacts.
            createdMessages.filter(
              nullValueOrCreatedMessage => nullValueOrCreatedMessage,
            ).length,
        );
        return Promise.resolve(true);
      })
      .catch(error => Promise.reject(error));
  }
}