import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { Attachment } from '@homzhub/common/src/domain/models/Attachment';
import { IUnit, Unit } from '@homzhub/common/src/domain/models/Unit';

export interface IAssetGroup extends IUnit {
  space_types: SpaceType[];
  asset_types: IUnit[];
}

export enum SpaceFieldTypes {
  Counter = 'COUNTER',
  CheckBox = 'CHECKBOX',
  TextBox = 'TEXTBOX',
}

export interface ISpaceCount {
  space_type: number;
  count: number;
  description?: string;
}

@JsonObject('SpaceType')
export class SpaceType extends Unit {
  @JsonProperty('field_type', String)
  private _fieldType = '';

  @JsonProperty('is_primary', Boolean)
  private _isPrimary = false;

  @JsonProperty('is_mandatory', Boolean)
  private _isMandatory = false;

  @JsonProperty('description', String, true)
  private _description = '';

  @JsonProperty('attachment', Attachment)
  private _attachment = new Attachment();

  @JsonProperty('count', Number, true)
  private _count = -1;

  get fieldType(): string {
    return this._fieldType;
  }

  get isPrimary(): boolean {
    return this._isPrimary;
  }

  get isMandatory(): boolean {
    return this._isMandatory;
  }

  get attachment(): Attachment {
    return this._attachment;
  }

  set description(text: string) {
    this._description = text;
  }

  get description(): string {
    return this._description;
  }

  get count(): number {
    return this._count;
  }

  set count(value: number) {
    this._count = value;
  }

  // CUSTOM FIELDS
  private _unitCount = 0;

  get unitCount(): number {
    return this._unitCount;
  }

  set unitCount(value: number) {
    this._unitCount = value;
  }

  private _isDisabled = false;

  get isDisabled(): boolean {
    return this._isDisabled;
  }

  set isDisabled(value: boolean) {
    this._isDisabled = value;
  }

  get spaceList(): ISpaceCount {
    return {
      space_type: this.id,
      count: this.unitCount,
    };
  }

  get spaceListEntire(): ISpaceCount {
    return {
      space_type: this.id,
      count: this.count,
    };
  }
}

@JsonObject('AssetGroup')
export class AssetGroup {
  @JsonProperty('id', Number)
  private _id = -1;

  @JsonProperty('name', String)
  private _name = '';

  @JsonProperty('asset_types', [Unit])
  private _assetTypes: Unit[] = [];

  @JsonProperty('space_types', [SpaceType])
  private _spaceTypes: SpaceType[] = [];

  get id(): number {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get assetTypes(): Unit[] {
    return this._assetTypes;
  }

  get spaceTypes(): SpaceType[] {
    return this._spaceTypes;
  }
}
