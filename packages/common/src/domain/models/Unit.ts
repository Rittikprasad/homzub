import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';

export interface IUnit {
  id: number;
  order?: number;
  name?: string;
  label: string;
  title?: string;
  code?: string;
  value?: string;
  description?: string;
  fieldType?: string;
}

@JsonObject('Unit')
export class Unit {
  @JsonProperty('id', Number, true)
  private _id = -1;

  @JsonProperty('order', Number, true)
  private _order = -1;

  @JsonProperty('name', String, true)
  private _name = '';

  @JsonProperty('label', String, true)
  private _label = '';

  @JsonProperty('value', String, true)
  private _value = '';

  @JsonProperty('title', String, true)
  private _title = '';

  @JsonProperty('code', String, true)
  private _code = '';

  @JsonProperty('type', String, true)
  private _type = '';

  @JsonProperty('description', String, true)
  private _description = '';

  @JsonProperty('field_type', String, true)
  private _fieldType = '';

  @JsonProperty('icon_url', String, true)
  private _iconUrl = '';

  get id(): number {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get code(): string {
    return this._code;
  }

  get label(): string {
    return this._label;
  }

  get title(): string {
    return this._title;
  }

  get order(): number {
    return this._order;
  }

  get value(): string {
    return this._value;
  }

  get type(): string {
    return this._type;
  }

  get description(): string {
    return this._description;
  }

  get fieldType(): string {
    return this._fieldType;
  }

  get iconUrl(): string {
    return this._iconUrl;
  }
}
