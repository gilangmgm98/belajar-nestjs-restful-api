export class AddressResponse {
  id: number;
  street?: string; //optional
  city?: string; //optional
  province?: string; //optional
  country: string;
  postalCode: string;
}

export class CreateAddressRequest {
  contactId: number;
  street?: string; //optional
  city?: string; //optional
  province?: string; //optional
  country: string;
  postalCode: string;
}

export class GetAddressRequest {
  contactId: number;
  addressId: number;
}

export class UpdateAddressRequest {
  id: number;
  contactId: number;
  street?: string; //optional
  city?: string; //optional
  province?: string; //optional
  country: string;
  postalCode: string;
}

export class RemoveAddressRequest {
  contactId: number;
  addressId: number;
}
