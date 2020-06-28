import { Module, Logger } from "@nestjs/common";
import { SeederProviderModule } from "../providers/provider.module";
import { ContactSeederModule } from "./contacts/contact.module";
import { Seeder } from "./seeder";

/**
 * Import and provide seeder classes.
 *
 * @module
 */
@Module({
  imports: [SeederProviderModule, ContactSeederModule],
  providers: [Logger, Seeder]
})
export class SeederModule {}