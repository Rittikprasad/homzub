import { DateFormats, DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { Currency } from '@homzhub/common/src/domain/models/Currency';
import { IUnit, Unit } from '@homzhub/common/src/domain/models/Unit';
import { PaidByTypes, ScheduleTypes } from '@homzhub/common/src/constants/Terms';

export interface ITransactionDetail {
  id?: number;
  lease_start_date: string;
  lease_end_date?: string;
  total_lease_period?: string;
  remaining_lease_period?: string;
  currency: Currency;
  rent: number;
  security_deposit: number;
  lease_period: number;
  minimum_lease_period: number;
  annual_rent_increment_percentage: number | null;
  status?: string;
  tentative_end_date?: string;
  agreement_date?: string;
  lease_listing?: number | null;
  lease_unit?: number;
  is_terminated?: boolean;
  maintenance_paid_by: PaidByTypes;
  utility_paid_by: PaidByTypes;
  maintenance_amount: number;
  maintenance_payment_schedule: ScheduleTypes;
  maintenance_unit?: IUnit;
}

@JsonObject('TransactionDetail')
export class TransactionDetail {
  @JsonProperty('id', Number, true)
  private _id = 0;

  @JsonProperty('lease_start_date', String)
  private _leaseStartDate = '';

  @JsonProperty('lease_end_date', String, true)
  private _leaseEndDate = '';

  @JsonProperty('total_lease_period', String, true)
  private _totalLeasePeriod = '';

  @JsonProperty('remaining_lease_period', String, true)
  private _remainingLeasePeriod = '';

  @JsonProperty('currency', Currency)
  private _currency = new Currency();

  @JsonProperty('rent', Number)
  private _rent = 0;

  @JsonProperty('security_deposit', Number)
  private _securityDeposit = 0;

  @JsonProperty('lease_period', Number, true)
  private _leasePeriod = 0;

  @JsonProperty('minimum_lease_period', Number)
  private _minimumLeasePeriod = 0;

  @JsonProperty('annual_rent_increment_percentage', Number, true)
  private _annualRentIncrementPercentage = null;

  @JsonProperty('status', String, true)
  private _status = '';

  @JsonProperty('tentative_end_date', String, true)
  private _tentativeEndDate = '';

  @JsonProperty('agreement_date', String, true)
  private _agreementDate = '';

  @JsonProperty('lease_listing', Number, true)
  private _leaseListing = null;

  @JsonProperty('lease_unit', Number, true)
  private _leaseUnit = 0;

  @JsonProperty('is_terminated', Boolean, true)
  private _isTerminated = false;

  @JsonProperty('maintenance_paid_by', String, true)
  private _maintenancePaidBy = '';

  @JsonProperty('utility_paid_by', String, true)
  private _utilityPaidBy = '';

  @JsonProperty('maintenance_amount', Number, true)
  private _maintenanceAmount = null;

  @JsonProperty('maintenance_payment_schedule', String, true)
  private _maintenancePaymentSchedule = '';

  @JsonProperty('maintenance_unit', Unit, true)
  private _maintenanceUnit: Unit = new Unit();

  get id(): number {
    return this._id;
  }

  get leaseStartDate(): string {
    return DateUtils.getDisplayDate(this._leaseStartDate, DateFormats.YYYYMMDD);
  }

  get leaseEndDate(): string {
    return DateUtils.getDisplayDate(this._leaseEndDate, DateFormats.YYYYMMDD);
  }

  get totalLeasePeriod(): string {
    return this._totalLeasePeriod;
  }

  get remainingLeasePeriod(): string {
    return this._remainingLeasePeriod;
  }

  get currency(): Currency {
    return this._currency;
  }

  get rent(): number {
    return this._rent;
  }

  get securityDeposit(): number {
    return this._securityDeposit;
  }

  get leasePeriod(): number {
    return this._leasePeriod;
  }

  get minimumLeasePeriod(): number {
    return this._minimumLeasePeriod;
  }

  get annualRentIncrementPercentage(): number | null {
    return this._annualRentIncrementPercentage;
  }

  get status(): string {
    return this._status;
  }

  get tentativeEndDate(): string {
    return this._tentativeEndDate;
  }

  get agreementDate(): string {
    return this._agreementDate;
  }

  get leaseListing(): number | null {
    return this._leaseListing;
  }

  get leaseUnit(): number {
    return this._leaseUnit;
  }

  get isTerminated(): boolean {
    return this._isTerminated;
  }

  get maintenancePaidBy(): PaidByTypes {
    return this._maintenancePaidBy as PaidByTypes;
  }

  get utilityPaidBy(): PaidByTypes {
    return this._utilityPaidBy as PaidByTypes;
  }

  get maintenanceAmount(): number | null {
    return this._maintenanceAmount;
  }

  get maintenancePaymentSchedule(): ScheduleTypes {
    return this._maintenancePaymentSchedule as ScheduleTypes;
  }

  get maintenanceUnit(): Unit {
    return this._maintenanceUnit;
  }
}
