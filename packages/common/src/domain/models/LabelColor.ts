import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';

export interface ILabelColor {
  label: string;
  color?: string;
  color_code?: string;
}

@JsonObject('LabelColor')
export class LabelColor {
  @JsonProperty('label', String)
  private _label = '';

  @JsonProperty('color', String, true)
  private _color = '';

  // Todo (Praharsh) : Confirm if this field is required else remove
  @JsonProperty('color_code', String, true)
  private _colorCode = '';

  @JsonProperty('code', String, true)
  private _code = '';

  get label(): string {
    return this._label;
  }

  get color(): string {
    return this._color;
  }

  get colorCode(): string {
    return this._colorCode;
  }

  get code(): string {
    return this._code;
  }
}
