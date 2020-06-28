import { Module, Logger } from "@nestjs/common";
import { SeederProviderModule } from "../providers/provider.module";
import { ContactSeederModule } from "./contacts/contact.module";
import { Seeder } from "./seeder";
import { TaskSeederModule } from "./tasks/task.module";
import { MessageSeederModule } from "./messages/message.module";

/**
 * Import and provide seeder classes.
 *
 * @module
 */
@Module({
  imports: [SeederProviderModule, ContactSeederModule, TaskSeederModule, MessageSeederModule],
  providers: [Logger, Seeder]
})
export class SeederModule {}