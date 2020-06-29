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
  getSuccessMessage(collection) { return `Succesfully completed seeding ${collection}...`}
  getErrorMessage(collection) { return `Failed seeding ${collection}...`}

  async seed() {
    await this.contacts()
      .then(completed => {
        this.logger.debug(this.getSuccessMessage('contacts'));
        Promise.resolve(completed);
      })
      .catch(error => {
        this.logger.error(this.getErrorMessage('contacts'));
        Promise.reject(error);
      });
    await this.tasks()
      .then(completed => {
        this.logger.debug(this.getSuccessMessage('tasks'));
        Promise.resolve(completed);
      })
      .catch(error => {
        this.logger.error(this.getErrorMessage('tasks'));
        Promise.reject(error);
      });
    await this.messages()
      .then(completed => {
        this.logger.debug(this.getSuccessMessage('messages'));
        Promise.resolve(completed);
      })
      .catch(error => {
        this.logger.error(this.getErrorMessage('messages'));
        Promise.reject(error);
      });
  }
  getCreatedLengthMessage(createdRecords, type) {
    return `No. of ${type} created : ` +
    // Remove all null values and return only created contacts.
    createdRecords.filter(
      nullValueOrCreatedContact => nullValueOrCreatedContact,
    ).length
  }
  async contacts() {
    return await Promise.all(this.contactSeederService.create())
      .then(createdContacts => {
        // Can also use this.logger.verbose('...');
        this.logger.debug(this.getCreatedLengthMessage(createdContacts, 'contacts'));
        return Promise.resolve(true);
      })
      .catch(error => Promise.reject(error));
  }
  async tasks() {
    return await Promise.all(this.taskSeederService.create())
      .then(createdTasks => {
        // Can also use this.logger.verbose('...');
        this.logger.debug(this.getCreatedLengthMessage(createdTasks, 'tasks'));
        return Promise.resolve(true);
      })
      .catch(error => Promise.reject(error));
  }
  async messages() {
    return await Promise.all(this.messageSeederService.create())
      .then(createdMessages => {
        // Can also use this.logger.verbose('...');
        this.logger.debug(this.getCreatedLengthMessage(createdMessages, 'messages'));
        return Promise.resolve(true);
      })
      .catch(error => Promise.reject(error));
  }
}