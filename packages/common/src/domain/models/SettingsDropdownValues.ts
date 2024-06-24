import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { IDropdownOption } from '@homzhub/common/src/components/molecules/FormDropdown';
import { Currency, ICurrency } from '@homzhub/common/src/domain/models/Currency';
import { IUnit, Unit } from '@homzhub/common/src/domain/models/Unit';

export interface ISettingsDropdownValues {
  currency: ICurrency[];
  language: IUnit[];
  financial_year: IUnit[];
  metric_unit: IUnit[];
}

@JsonObject('SettingsDropdownValues')
export class SettingsDropdownValues {
  @JsonProperty('currency', [Currency])
  private _currency = [new Currency()];

  @JsonProperty('language', [Unit])
  private _language = [new Unit()];

  @JsonProperty('financial_year', [Unit])
  private _financialYear = [new Unit()];

  @JsonProperty('metric_unit', [Unit])
  private _metricUnit = [new Unit()];

  get currency(): IDropdownOption[] {
    return this._currency.map((item) => {
      return { label: `${item.currencyCode} ${item.currencySymbol}`, value: item.currencyCode };
    });
  }

  get language(): IDropdownOption[] {
    return this._language.map((item) => {
      return { label: item.label, value: item.id };
    });
  }

  get financialYear(): IDropdownOption[] {
    return this._financialYear.map((item) => {
      return { label: item.label, value: item.id };
    });
  }

  get metricUnit(): IDropdownOption[] {
    return this._metricUnit.map((item) => {
      return { label: item.label, value: item.name };
    });
  }
}
