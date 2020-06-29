import { Module, Logger } from "@nestjs/common";
import { SourceProviderModule } from "../providers/source.provider.module";
import { DestinationProviderModule } from "../providers/destination.provider.module";
import { ContactSourceModule, ContactDestinationModule } from "./contacts/contact.module";
import { Archiver } from "./archiver";
import { TaskSourceModule, TaskDestinationModule } from "./tasks/task.module";
import { MessageSourceModule, MessageDestinationModule } from "./messages/message.module";

/**
 * Import and provide archiver classes.
 *
 * @module
 */
@Module({
  imports: [
    SourceProviderModule,
    DestinationProviderModule,
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