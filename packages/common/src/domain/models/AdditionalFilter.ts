import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { CategoryAmenityGroup, IAmenity } from '@homzhub/common/src/domain/models/Amenity';
import { IUnit, Unit } from '@homzhub/common/src/domain/models/Unit';

export interface IAdditionalFilters {
  facing: IUnit[];
  property_amenities: IAmenity[];
}

@JsonObject('AdditionalFilter')
export class AdditionalFilters {
  @JsonProperty('facing', [Unit])
  private _facing = [];

  @JsonProperty('property_amenities', [CategoryAmenityGroup])
  private _propertyAmenities = [];

  get facing(): Unit[] {
    return this._facing;
  }

  get propertyAmenities(): CategoryAmenityGroup[] {
    return this._propertyAmenities;
  }
}
