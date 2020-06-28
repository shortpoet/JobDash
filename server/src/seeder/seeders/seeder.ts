import { Logger, Injectable } from "@nestjs/common";
import { ContactSeederService } from "./contacts/contact.service";

@Injectable()
export class Seeder {
  constructor(
    private readonly logger: Logger,
    private readonly contactSeederService: ContactSeederService,
  ) { }
  async seed() {
    await this.contacts()
      .then(completed => {
        this.logger.debug('Successfuly completed seeding contacts...');
        Promise.resolve(completed);
      })
      .catch(error => {
        this.logger.error('Failed seeding users...');
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
}