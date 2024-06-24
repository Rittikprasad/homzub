import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { ISettingsOptions, SettingOptions } from '@homzhub/common/src/domain/models/SettingOptions';

export enum SettingsDataNameKeys {
  communications = 'Communications',
  dataAndPrivacy = 'Data & Privacy',
}
export interface ISettingsData {
  name: string;
  icon?: string;
  visible: boolean;
  options: ISettingsOptions[];
}

@JsonObject('SettingsData')
export class SettingsData {
  @JsonProperty('name', String)
  private _name = '';

  @JsonProperty('icon', String, true)
  private _icon = '';

  @JsonProperty('visible', Boolean)
  private _visible = false;

  @JsonProperty('options', [SettingOptions])
  private _options = [new SettingOptions()];

  get name(): string {
    return this._name;
  }

  get icon(): string {
    return this._icon;
  }

  get visible(): boolean {
    return this._visible;
  }

  get options(): SettingOptions[] {
    return this._options;
  }
}
