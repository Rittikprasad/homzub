import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';

export interface ILocationDetails {
  id: number;
  city_name: string;
  region_name: string;
  country_name: string;
  iso2_code: string;
  iso3_code: string;
  phone_codes: string[];
  city: number;
  region: number;
  country: number;
}

@JsonObject('LocationDetails')
export class LocationDetails {
  @JsonProperty('id', Number)
  private _id = 0;

  @JsonProperty('city_name', String)
  private _cityName = '';

  @JsonProperty('region_name', String)
  private _regionName = '';

  @JsonProperty('country_name', String)
  private _countryName = '';

  @JsonProperty('iso2_code', String)
  private _iso2Code = '';

  @JsonProperty('iso3_code', String)
  private _iso3Code = '';

  @JsonProperty('phone_codes', [String])
  private _phoneCodes = [];

  @JsonProperty('city', Number)
  private _city = 0;

  @JsonProperty('region', Number)
  private _region = 0;

  @JsonProperty('country', Number)
  private _country = 0;

  get id(): number {
    return this._id;
  }

  get cityName(): string {
    return this._cityName;
  }

  get regionName(): string {
    return this._regionName;
  }

  get countryName(): string {
    return this._countryName;
  }

  get iso2Code(): string {
    return this._iso2Code;
  }

  get iso3Code(): string {
    return this._iso3Code;
  }

  get phoneCodes(): any[] {
    return this._phoneCodes;
  }

  get city(): number {
    return this._city;
  }

  get region(): number {
    return this._region;
  }

  get country(): number {
    return this._country;
  }
}
