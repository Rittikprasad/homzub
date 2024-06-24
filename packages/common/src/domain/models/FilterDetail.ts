import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { Currency, ICurrency } from '@homzhub/common/src/domain/models/Currency';
import { Filters, IFilters } from '@homzhub/common/src/domain/models/Filters';
import { IUnit, Unit } from '@homzhub/common/src/domain/models/Unit';

export interface IFilterDetails {
  currency: ICurrency[];
  asset_group_list: IUnit[];
  filters: IFilters;
}

@JsonObject('FilterDetail')
export class FilterDetail {
  @JsonProperty('currency', [Currency])
  private _currency = [];

  @JsonProperty('asset_group_list', [Unit])
  private _assetGroupList = [];

  @JsonProperty('filters', Filters)
  private _filters = new Filters();

  get currency(): Currency[] {
    return this._currency;
  }

  get assetGroupList(): Unit[] {
    return this._assetGroupList;
  }

  get filters(): Filters {
    return this._filters;
  }
}
