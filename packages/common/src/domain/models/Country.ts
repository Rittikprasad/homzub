import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { flags } from '@homzhub/common/src/components/atoms/Flag';
import { IDropdownOption } from '@homzhub/common/src/components/molecules/FormDropdown';
import { Currency, ICurrency } from '@homzhub/common/src/domain/models/Currency';
import { PhoneCode } from '@homzhub/common/src/domain/models/PhoneCode';

export interface ICountry {
  id: number;
  name: string;
  iso2_code: string;
  iso3_code: string;
  phone_codes: string[];
  currencies: ICurrency[];
}

@JsonObject('Country')
export class Country {
  @JsonProperty('id', Number)
  private _id = 0;

  @JsonProperty('name', String, true)
  private _name = '';

  @JsonProperty('iso2_code', String, true)
  private _iso2Code = '';

  @JsonProperty('iso3_code', String, true)
  private _iso3Code = '';

  @JsonProperty('phone_codes', [PhoneCode], true)
  private _phoneCodes = [];

  @JsonProperty('currencies', [Currency], true)
  private _currencies = [];

  get id(): number {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get iso2Code(): string {
    return this._iso2Code;
  }

  get iso3Code(): string {
    return this._iso3Code;
  }

  get phoneCodes(): PhoneCode[] {
    return this._phoneCodes;
  }

  get currencies(): Currency[] {
    return this._currencies;
  }

  get phoneCodesDropdownData(): IDropdownOption[] {
    const countryCodeOptions: IDropdownOption[] = [];
    this.phoneCodes.forEach((item) => {
      const data = {
        label: `${this.name} (${item.phoneCode})`,
        value: item.phoneCode,
      };
      countryCodeOptions.push(data);
    });
    return countryCodeOptions;
  }

  get flag(): React.ReactElement {
    // @ts-ignore
    return flags[this.iso2Code];
  }
}
