import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { IDropdownOption } from '@homzhub/common/src/components/molecules/FormDropdown';
import { Country } from '@homzhub/common/src/domain/models/Country';
import { Property } from '@homzhub/common/src/domain/models/Property';
import { Unit } from '@homzhub/common/src/domain/models/Unit';

export enum Filters {
  ALL = 'ALL',
  OCCUPIED = 'OCCUPIED',
  VACANT = 'VACANT',
  FOR_SALE = 'FOR_SALE',
  FOR_RENT = 'FOR_RENT',
  EXPIRING = 'EXPIRING',
}

@JsonObject('AssetFilter')
export class AssetFilter {
  @JsonProperty('asset_group', [Unit])
  private _assetGroup = [];

  @JsonProperty('assets', [Property])
  private _assets = [];

  @JsonProperty('country', [Country])
  private _country = [];

  @JsonProperty('status', [Unit])
  private _status = [];

  get assetGroup(): Unit[] {
    return this._assetGroup;
  }

  get assets(): Property[] {
    return this._assets;
  }

  get country(): Country[] {
    return this._country;
  }

  get status(): Unit[] {
    return this._status;
  }

  get statusDropdown(): IDropdownOption[] {
    return this.status.map((item) => {
      return {
        label: item.title,
        // Using code here which remains the same.
        value: item.code,
      };
    });
  }

  get countryDropdown(): IDropdownOption[] {
    return this.country.map((item) => {
      return {
        label: item.name,
        value: item.iso2Code,
      };
    });
  }

  get assetsDropdown(): IDropdownOption[] {
    return this.assets.map((item) => {
      return {
        label: item.projectName,
        value: item.id,
      };
    });
  }

  get assetGroupDropdown(): IDropdownOption[] {
    return this.assetGroup.map((item) => {
      return {
        label: item.title,
        value: item.name,
      };
    });
  }
}
