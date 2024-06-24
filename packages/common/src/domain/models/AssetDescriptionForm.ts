import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { Unit } from '@homzhub/common/src/domain/models/Unit';
import { ISelectionPicker } from '@homzhub/common/src/components/atoms/SelectionPicker';
import { IDropdownOption } from '@homzhub/common/src/components/molecules/FormDropdown';

export enum AssetDescriptionDropdownTypes {
  Facing = 'facing',
  FurnishingStatus = 'furnishing_status',
  CarpetUnit = 'carpet_area_unit',
  FlooringType = 'type_of_flooring',
}

@JsonObject('AssetDescriptionDropdownValues')
export class AssetDescriptionDropdownValues {
  @JsonProperty('facing', [Unit])
  private _facing = [new Unit()];

  @JsonProperty('furnishing_status', [Unit])
  private _furnishingStatus = [new Unit()];

  @JsonProperty('carpet_area_unit', [Unit])
  private _carpetAreaUnit = [new Unit()];

  @JsonProperty('type_of_flooring', [Unit])
  private _typeOfFlooring = [new Unit()];

  get facing(): IDropdownOption[] {
    return this.transformDropdownTypes(this._facing, AssetDescriptionDropdownTypes.Facing);
  }

  get furnishingStatus(): Unit[] {
    return this._furnishingStatus;
  }

  get areaUnitDropdownValues(): IDropdownOption[] {
    return this.transformDropdownTypes(this._carpetAreaUnit, AssetDescriptionDropdownTypes.CarpetUnit);
  }

  get carpetAreaUnit(): Unit[] {
    return this._carpetAreaUnit;
  }

  get typeOfFlooring(): IDropdownOption[] {
    return this.transformDropdownTypes(this._typeOfFlooring, AssetDescriptionDropdownTypes.FlooringType);
  }

  get furnishingStatusDropdownValues(): ISelectionPicker<string>[] {
    return this._furnishingStatus?.map((item) => {
      return {
        value: item.name,
        title: item.label,
      };
    });
  }

  private transformDropdownTypes = (typeArray: Unit[], type: string): IDropdownOption[] => {
    const { Facing, FurnishingStatus, CarpetUnit } = AssetDescriptionDropdownTypes;
    return typeArray.map((item) => {
      if (type === Facing || type === FurnishingStatus) {
        return {
          value: item.name,
          label: item.label,
        };
      }

      if (type === CarpetUnit) {
        return {
          value: item.id,
          label: item.title,
        };
      }

      return {
        value: item.id,
        label: item.label,
      };
    });
  };
}
