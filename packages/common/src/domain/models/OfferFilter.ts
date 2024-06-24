import { PickerItemProps } from 'react-native';
import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { Country } from '@homzhub/common/src/domain/models/Country';
import { Unit } from '@homzhub/common/src/domain/models/Unit';
import { VisitAssetDetail } from '@homzhub/common/src/domain/models/VisitAssetDetail';

@JsonObject('OfferFilter')
export class OfferFilter {
  @JsonProperty('assets', [VisitAssetDetail], true)
  private _assets = [];

  @JsonProperty('listing', [Unit], true)
  private _listing = [];

  @JsonProperty('country', [Country], true)
  private _country = [];

  @JsonProperty('filter_by', [Unit], true)
  private _filterBy = [];

  get assets(): VisitAssetDetail[] {
    return this._assets;
  }

  get listing(): Unit[] {
    return this._listing;
  }

  get filterBy(): Unit[] {
    return this._filterBy;
  }

  get country(): Country[] {
    return this._country;
  }

  get assetsDropdownData(): PickerItemProps[] {
    return this.assets.map((asset: VisitAssetDetail): PickerItemProps => {
      const { id, projectName } = asset;
      return { label: projectName, value: id };
    });
  }

  get listingDropdownData(): PickerItemProps[] {
    return this.listing.map((listData: Unit): PickerItemProps => {
      const { name, label } = listData;
      return { label, value: name };
    });
  }

  get countryDropdownData(): PickerItemProps[] {
    return this.country.map((country: Country): PickerItemProps => {
      const { name, id } = country;
      return { label: name, value: id };
    });
  }

  get filterDropdownData(): PickerItemProps[] {
    return this.filterBy.map((filterData: Unit): PickerItemProps => {
      const { name, label } = filterData;
      return { label, value: name };
    });
  }
}
