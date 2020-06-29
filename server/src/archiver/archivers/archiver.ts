import { Logger, Injectable } from "@nestjs/common";
import { ContactArchiverService } from "./contacts/contact.service";
import { TaskArchiverService } from "./tasks/task.service";
import { MessageArchiverService } from "./messages/message.service";

@Injectable()
export class Archiver {
  constructor(
    private readonly logger: Logger,
    private readonly contactArchiverService: ContactArchiverService,
    private readonly taskArchiverService: TaskArchiverService,
    private readonly messageArchiverService: MessageArchiverService,
  ) { }
  getSuccessMessage(collection) { return `Successfully completed archiving ${collection}...`}
  getErrorMessage(collection) { return `Failed archiving ${collection}...`}
  async archive() {
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
    const contacts = await this.contactArchiverService.getAllContact()
    return await Promise.all(this.contactArchiverService.create(contacts))
      .then(createdContacts => {
        // Can also use this.logger.verbose('...');
        this.logger.debug(this.getCreatedLengthMessage(createdContacts, 'contacts'));
        return Promise.resolve(true);
      })
      .catch(error => Promise.reject(error));
  }
  async tasks() {
    const tasks = await this.taskArchiverService.getAllTask()
    return await Promise.all(this.taskArchiverService.create(tasks))
    .then(createdTasks => {
      // Can also use this.logger.verbose('...');
      this.logger.debug(this.getCreatedLengthMessage(createdTasks, 'tasks'));
      return Promise.resolve(true);
    })
    .catch(error => Promise.reject(error));
  }
  async messages() {
    const messages = await this.messageArchiverService.getAllMessage()
    return await Promise.all(this.messageArchiverService.create(messages))
      .then(createdMessages => {
        // Can also use this.logger.verbose('...');
        this.logger.debug(this.getCreatedLengthMessage(createdMessages, 'messages'));
        return Promise.resolve(true);
      })
      .catch(error => Promise.reject(error));
  }
}