import { Module } from '@nestjs/common';
import { AddressSevice } from './address.service';
import { AddressController } from './address.controller';
import { ContactModule } from '../contact/contact.module';

@Module({
  providers: [AddressSevice],
  controllers: [AddressController],
  exports: [],
  imports: [ContactModule],
})
export class AddressModule {}
