import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { Country, ICountry } from '@homzhub/common/src/domain/models/Country';
import { ILocationDetails, LocationDetails } from '@homzhub/common/src/domain/models/LocationDetails';

export interface IAddress {
  id: number;
  address: string;
  address_line_1: string;
  address_line_2: string;
  postal_code: string;
  city_name: string;
  state_name: string;
  country_name: string;
  country: ICountry;
  is_primary: boolean;
  location: ILocationDetails;
}
@JsonObject('Address')
export class Address {
  @JsonProperty('id', Number)
  private _id = 0;

  @JsonProperty('address', String, true)
  private _address = '';

  @JsonProperty('address_line_1', String, true)
  private _addressLine1 = '';

  @JsonProperty('address_line_2', String, true)
  private _addressLine2 = '';

  @JsonProperty('postal_code', String)
  private _postalCode = '';

  @JsonProperty('city_name', String, true)
  private _cityName = '';

  @JsonProperty('state_name', String, true)
  private _stateName = '';

  @JsonProperty('country_name', String, true)
  private _countryName = '';

  @JsonProperty('is_primary', Boolean)
  private _isPrimary = false;

  @JsonProperty('location', LocationDetails, true)
  private _location = null;

  @JsonProperty('country', Country, true)
  private _country = new Country();

  get id(): number {
    return this._id;
  }

  get address(): string {
    return this._address;
  }

  get addressLine1(): string {
    return this._addressLine1;
  }

  get addressLine2(): string {
    return this._addressLine2;
  }

  get postalCode(): string {
    return this._postalCode;
  }

  get isPrimary(): boolean {
    return this._isPrimary;
  }

  get location(): LocationDetails | null {
    return this._location;
  }

  get cityName(): string {
    return this._cityName;
  }

  get stateName(): string {
    return this._stateName;
  }

  get countryName(): string {
    return this._countryName;
  }

  get country(): Country {
    return this._country;
  }
}
