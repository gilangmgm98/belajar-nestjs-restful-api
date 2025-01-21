import { HttpException, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from '../common/prisma.service';
import { ValidationService } from '../common/validation.service';
import { Logger } from 'winston';
import {
  AddressResponse,
  CreateAddressRequest,
  GetAddressRequest,
  RemoveAddressRequest,
  UpdateAddressRequest,
} from 'src/model/address.model';
import { AddressValidation } from './address.validation';
import { ContactService } from '../contact/contact.service';
import { Address, User } from '@prisma/client';

@Injectable()
export class AddressSevice {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
    private validationService: ValidationService,
    private contactService: ContactService,
  ) {}

  async create(
    user: User,
    request: CreateAddressRequest,
  ): Promise<AddressResponse> {
    this.logger.debug(
      `AddressService.create(user: ${JSON.stringify(user)}, ${JSON.stringify(request)})`,
    );
    const createRequest = await this.validationService.validate(
      AddressValidation.CREATE,
      request,
    );

    await this.contactService.checkContactExist(
      user.username,
      createRequest.contactId,
    );

    const address = await this.prismaService.address.create({
      data: createRequest,
    });

    return this.toAddressResponse(address);
  }

  toAddressResponse(address: Address): AddressResponse {
    return {
      id: address.id,
      street: address.street,
      city: address.city,
      province: address.province,
      country: address.country,
      postalCode: address.postalCode,
    };
  }

  async checkAddressExist(
    contactId: number,
    addressId: number,
  ): Promise<Address> {
    const address = await this.prismaService.address.findFirst({
      where: {
        id: addressId,
        contactId: contactId,
      },
    });

    if (!address) {
      throw new HttpException('Address not found', 404);
    }

    return address;
  }

  async get(user: User, request: GetAddressRequest): Promise<AddressResponse> {
    this.logger.debug(
      `AddressService.get(user: ${JSON.stringify(user)}, ${JSON.stringify(request)})`,
    );
    const getRequest: GetAddressRequest = await this.validationService.validate(
      AddressValidation.GET,
      request,
    );

    await this.contactService.checkContactExist(
      user.username,
      request.contactId,
    );

    const address = await this.checkAddressExist(
      getRequest.contactId,
      getRequest.addressId,
    );

    return this.toAddressResponse(address);
  }

  async update(
    user: User,
    request: UpdateAddressRequest,
  ): Promise<AddressResponse> {
    this.logger.debug(
      `AddressService.update(user: ${JSON.stringify(user)}, ${JSON.stringify(request)})`,
    );

    const updateRequest: UpdateAddressRequest = this.validationService.validate(
      AddressValidation.UPDATE,
      request,
    );

    await this.contactService.checkContactExist(
      user.username,
      updateRequest.contactId,
    );

    let address = await this.checkAddressExist(
      updateRequest.contactId,
      updateRequest.id,
    );

    address = await this.prismaService.address.update({
      data: updateRequest,
      where: {
        id: address.id,
        contactId: address.contactId,
      },
    });

    return this.toAddressResponse(address);
  }

  async remove(
    user: User,
    request: RemoveAddressRequest,
  ): Promise<AddressResponse> {
    this.logger.debug(
      `AddressService.remove(user: ${JSON.stringify(user)}, ${JSON.stringify(request)})`,
    );
    const removeRequest: RemoveAddressRequest = this.validationService.validate(
      AddressValidation.REMOVE,
      request,
    );

    await this.contactService.checkContactExist(
      user.username,
      removeRequest.contactId,
    );

    await this.checkAddressExist(
      removeRequest.contactId,
      removeRequest.addressId,
    );

    const address = await this.prismaService.address.delete({
      where: {
        id: removeRequest.addressId,
        contactId: removeRequest.contactId,
      },
    });

    return this.toAddressResponse(address);
  }

  async list(user: User, contactId: number): Promise<AddressResponse[]> {
    this.logger.debug(
      `AddressService.list(user: ${JSON.stringify(user)}, contactId: ${contactId})`,
    );

    await this.contactService.checkContactExist(user.username, contactId);

    const addresses = await this.prismaService.address.findMany({
      where: {
        contactId: contactId,
      },
    });

    return addresses.map((address) => this.toAddressResponse(address));
  }
}
