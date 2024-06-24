import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { IDropdownOption } from '@homzhub/common/src/components/molecules/FormDropdown';
import { AdditionalFilters, IAdditionalFilters } from '@homzhub/common/src/domain/models/AdditionalFilter';
import { AssetGroup, IAssetGroup } from '@homzhub/common/src/domain/models/AssetGroup';
import { CarpetArea, ICarpetArea } from '@homzhub/common/src/domain/models/CarpetArea';
import { ISort, Sort } from '@homzhub/common/src/domain/models/Sort';
import { ITransactionType, TransactionType } from '@homzhub/common/src/domain/models/Transaction';

export interface IFilters {
  asset_group: IAssetGroup;
  transaction_type: ITransactionType[];
  carpet_area: ICarpetArea[];
  additional_filters: IAdditionalFilters;
  sort_by: ISort;
}

@JsonObject('Filters')
export class Filters {
  @JsonProperty('asset_group', AssetGroup)
  private _assetGroup = new AssetGroup();

  @JsonProperty('transaction_type', [TransactionType])
  private _transactionType = [];

  @JsonProperty('carpet_area', [CarpetArea], true)
  private _carpetArea = [];

  @JsonProperty('additional_filters', AdditionalFilters, true)
  private _additionalFilters = null;

  @JsonProperty('sort_by', [Sort], true)
  private _sortBy = [];

  get assetGroup(): AssetGroup {
    return this._assetGroup;
  }

  get transactionType(): TransactionType[] {
    return this._transactionType;
  }

  get carpetArea(): CarpetArea[] {
    return this._carpetArea;
  }

  get additionalFilters(): AdditionalFilters | null {
    return this._additionalFilters;
  }

  get sortBy(): Sort[] {
    return this._sortBy;
  }

  get defaultSort(): string {
    let defaultValue = '';
    this.sortBy.forEach((item) => {
      if (item.default) {
        defaultValue = item.orderingColumn;
      }
    });
    return defaultValue;
  }

  get sortDropDownData(): IDropdownOption[] {
    const options: IDropdownOption[] = [];
    this.sortBy.forEach((item) => {
      const data = {
        label: item.title,
        value: item.orderingColumn,
      };
      options.push(data);
    });
    return options;
  }
}
