import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { ServiceBundleItems } from '@homzhub/common/src/domain/models/ServiceBundleItems';
import { ServicePlanPricing } from '@homzhub/common/src/domain/models/ServicePlanPricing';

@JsonObject('PlatformPlans')
export class PlatformPlans {
  @JsonProperty('id', Number)
  private _id = '';

  @JsonProperty('name', String)
  private _name = '';

  @JsonProperty('label', String)
  private _label = '';

  @JsonProperty('description', String)
  private _description = '';

  @JsonProperty('tier', Number)
  private _tier = '';

  @JsonProperty('end_date', Number, true)
  private _endDate = '';

  @JsonProperty('min_assets', Number)
  private _minAssets = '';

  @JsonProperty('max_assets', Number)
  private _maxAssets = '';

  @JsonProperty('upgrade_option', Number, true)
  private _upgradeOption = '';

  @JsonProperty('apple_product_id', String, true)
  private _appleProductId = null;

  @JsonProperty('service_plan_bundles', [ServiceBundleItems], true)
  private _servicePlanBundle: ServiceBundleItems[] = [];

  @JsonProperty('service_plan_pricings', [ServicePlanPricing], true)
  private _servicePlanPricing: ServicePlanPricing[] = [];

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get label(): string {
    return this._label;
  }

  get description(): string {
    return this._description;
  }

  get tier(): string {
    return this._tier;
  }

  get endDate(): string {
    return this._endDate;
  }

  get minAssets(): string {
    return this._minAssets;
  }

  get maxAssets(): string {
    return this._maxAssets;
  }

  get upgradeOption(): string {
    return this._upgradeOption;
  }

  get servicePlanBundle(): ServiceBundleItems[] {
    return this._servicePlanBundle;
  }

  get servicePlanPricing(): ServicePlanPricing[] {
    return this._servicePlanPricing;
  }

  get appleProductId(): string | null {
    return this._appleProductId;
  }
}
