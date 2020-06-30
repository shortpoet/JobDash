import { Module, Logger } from "@nestjs/common";
import { ArchiverProviderModule } from "../providers/provider.module";
import { Archiver } from "./archiver";
import { ContactSourceModule } from "./contacts/contact.source.module";
import { ContactDestinationModule } from "./contacts/contact.destination.module";
import { TaskSourceModule } from "./tasks/task.source.module";
import { TaskDestinationModule } from "./tasks/task.destination.module";
import { MessageSourceModule } from "./messages/message.source.module";
import { MessageDestinationModule } from "./messages/message.destination.module";

/**
 * Import and provide archiver classes.
 *
 * @module
 */
@Module({
  imports: [
    ArchiverProviderModule,
    ContactSourceModule,
    ContactDestinationModule,
    TaskSourceModule,
    TaskDestinationModule,
    MessageSourceModule,
    MessageDestinationModule
  ],
  providers: [
    Logger,
    Archiver
  ]
})
export class ArchiverModule {}