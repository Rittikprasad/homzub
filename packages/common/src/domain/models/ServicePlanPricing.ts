import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { Currency } from '@homzhub/common/src/domain/models/Currency';

@JsonObject('ServicePlanPricing') // Used in Landing Screen, Platform Plans - Web
export class ServicePlanPricing {
  @JsonProperty('id', Number)
  private _id = 0;

  @JsonProperty('actual_price', Number, true)
  private _actualPrice = 0;

  @JsonProperty('discounted_price', Number, true)
  private _discountedPrice = null;

  @JsonProperty('duration', String)
  private _duration = '';

  @JsonProperty('free_trial_duration', Number, true)
  private _freeTrialDuration = 0;

  @JsonProperty('banner', String)
  private _banner = '';

  @JsonProperty('currency', Currency, true)
  private _currency: Currency = new Currency();

  get id(): number {
    return this._id;
  }

  get actualPrice(): number {
    return this._actualPrice;
  }

  get discountedPrice(): number | null {
    return this._discountedPrice;
  }

  get duration(): string {
    return this._duration;
  }

  get freeTrialDuration(): number {
    return this._freeTrialDuration;
  }

  get banner(): string {
    return this._banner;
  }

  get currency(): Currency {
    return this._currency;
  }
}
