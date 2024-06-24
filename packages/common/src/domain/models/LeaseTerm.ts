import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { Currency } from '@homzhub/common/src/domain/models/Currency';
import { LeaseUnit, ILeaseUnit } from '@homzhub/common/src/domain/models/LeaseUnit';
import { TenantPreference } from '@homzhub/common/src/domain/models/TenantInfo';
import { Unit } from '@homzhub/common/src/domain/models/Unit';
import { FurnishingTypes, PaidByTypes, ScheduleTypes } from '@homzhub/common/src/constants/Terms';

export interface ILeaseTermination {
  app_permissions: {
    is_asset_owner: boolean;
  };
}

export interface ILeaseTermParams {
  lease_listing?: number;
  expected_monthly_rent: number;
  security_deposit: number;
  annual_rent_increment_percentage: number | null;
  minimum_lease_period: number;
  maximum_lease_period: number;
  available_from_date: string;
  utility_paid_by: PaidByTypes;
  maintenance_paid_by: PaidByTypes;
  maintenance_amount: number | null;
  maintenance_unit: number | null;
  maintenance_payment_schedule: ScheduleTypes | null;
  description: string;
  rent_free_period: number | null;
  tenant_preferences?: number[];
  furnishing?: FurnishingTypes;
  lease_unit?: ILeaseUnit | number;
  is_edited?: boolean;
}

@JsonObject('LeaseTerm')
export class LeaseTerm {
  @JsonProperty('id', Number)
  private _id = -1;

  @JsonProperty('expected_monthly_rent', Number)
  private _expectedPrice = -1;

  @JsonProperty('security_deposit', Number)
  private _securityDeposit = -1;

  @JsonProperty('minimum_lease_period', Number)
  private _minimumLeasePeriod = -1;

  @JsonProperty('maximum_lease_period', Number)
  private _maximumLeasePeriod = -1;

  @JsonProperty('rent_free_period', Number, true)
  private _rentFreePeriod = null;

  @JsonProperty('annual_rent_increment_percentage', Number, true)
  private _annualRentIncrementPercentage = null;

  @JsonProperty('available_from_date', String)
  private _availableFromDate = '';

  @JsonProperty('maintenance_paid_by', String, true)
  private _maintenancePaidBy = PaidByTypes.OWNER;

  @JsonProperty('utility_paid_by', String, true)
  private _utilityPaidBy = PaidByTypes.TENANT;

  @JsonProperty('maintenance_unit', Unit, true)
  private _maintenanceUnit: Unit | null = null;

  @JsonProperty('maintenance_amount', Number, true)
  private _maintenanceAmount = null;

  @JsonProperty('maintenance_payment_schedule', String, true)
  private _maintenanceSchedule = null;

  @JsonProperty('furnishing', String, true)
  private _furnishing = FurnishingTypes.NONE;

  @JsonProperty('description', String, true)
  private _description = '';

  @JsonProperty('tenant_preferences', [TenantPreference], true)
  private _tenantPreferences = [];

  @JsonProperty('lease_unit', LeaseUnit, true)
  private _leaseUnit = new LeaseUnit();

  @JsonProperty('currency', Currency, true)
  private _currency = null;

  @JsonProperty('status', String, true)
  private _status = '';

  get tenantPreferences(): TenantPreference[] {
    return this._tenantPreferences;
  }

  get id(): number {
    return this._id;
  }

  get expectedPrice(): number {
    return this._expectedPrice;
  }

  get securityDeposit(): number {
    return this._securityDeposit;
  }

  get minimumLeasePeriod(): number {
    return this._minimumLeasePeriod;
  }

  get annualRentIncrementPercentage(): number | null {
    return this._annualRentIncrementPercentage;
  }

  get availableFromDate(): string {
    return this._availableFromDate;
  }

  get maintenancePaidBy(): PaidByTypes {
    return this._maintenancePaidBy;
  }

  get utilityPaidBy(): PaidByTypes {
    return this._utilityPaidBy;
  }

  get maintenanceAmount(): number | null {
    return this._maintenanceAmount;
  }

  get maintenanceSchedule(): ScheduleTypes | null {
    return this._maintenanceSchedule;
  }

  get furnishing(): string {
    return this._furnishing;
  }

  get description(): string {
    return this._description;
  }

  get maximumLeasePeriod(): number {
    return this._maximumLeasePeriod;
  }

  get maintenanceUnit(): number | null {
    return this._maintenanceUnit?.id ?? null;
  }

  get rentFreePeriod(): number | null {
    return this._rentFreePeriod;
  }

  get leaseUnit(): LeaseUnit {
    return this._leaseUnit;
  }

  get currency(): Currency | null {
    return this._currency;
  }

  get status(): string {
    return this._status;
  }
}
