import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { Currency, ICurrency } from '@homzhub/common/src/domain/models/Currency';
import { Unit } from '@homzhub/common/src/domain/models/Unit';
import { IValueBundle, ValueBundle } from '@homzhub/common/src/domain/models/ValueBundle';

export interface IGetServicesByIds {
  assetGroupId?: number;
  countryId?: number;
  city?: string;
  withoutParam?: boolean;
}

export interface ISelectedValueServices {
  id: number;
  value: boolean;
}

export interface IValueAddedServices {
  id: number;
  bundlePrice: string;
  discountedPrice: number;
  currency: ICurrency;
  valueBundle: IValueBundle;
}

@JsonObject('ValueAddedService')
export class ValueAddedService {
  @JsonProperty('id', Number, true)
  private _id = -1;

  @JsonProperty('bundle_price', Number, true)
  private _bundlePrice = -1;

  @JsonProperty('validity', Number, true)
  private _validity = -1;

  @JsonProperty('discounted_price', Number, true)
  private _discountedPrice = 0;

  @JsonProperty('price_label', String, true)
  private _priceLabel = '';

  @JsonProperty('is_partial', Boolean, true)
  private _isPartial = false;

  @JsonProperty('currency', Currency, true)
  private _currency = new Currency();

  @JsonProperty('value_bundle', ValueBundle, true)
  private _valueBundle = new ValueBundle();

  @JsonProperty('value', Boolean, true)
  private _value = false;

  @JsonProperty('asset_city', Unit, true)
  private _assetCity = null;

  get id(): number {
    return this._id;
  }

  get bundlePrice(): number {
    return this._bundlePrice;
  }

  get discountedPrice(): number {
    return this._discountedPrice;
  }

  get price(): number {
    return this.discountedPrice || this.bundlePrice;
  }

  get currency(): Currency {
    return this._currency;
  }

  get valueBundle(): ValueBundle {
    return this._valueBundle;
  }

  get value(): boolean {
    return this._value;
  }

  set value(value: boolean) {
    this._value = value;
  }

  get validity(): number {
    return this._validity;
  }

  get priceLabel(): string {
    return this._priceLabel;
  }

  get isPartial(): boolean {
    return this._isPartial;
  }

  get assetCity(): Unit | null {
    return this._assetCity;
  }
}
