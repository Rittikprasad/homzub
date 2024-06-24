import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { IDropdownOption } from '@homzhub/common/src/components/molecules/FormDropdown';

export type SelectedPreferenceType = boolean | string | number;

export enum OptionTypes {
  Switch = 'SWITCH',
  Webview = 'WEBVIEW',
  Dropdown = 'DROPDOWN',
}

export interface ISettingsOptions {
  name: string;
  label: string;
  type: OptionTypes;
  options?: IDropdownOption[];
  selected?: string | boolean;
  url?: string;
}

@JsonObject('SettingOptions')
export class SettingOptions {
  @JsonProperty('name', String)
  private _name = '';

  @JsonProperty('label', String)
  private _label = '';

  @JsonProperty('type', String)
  private _type = '';

  @JsonProperty('url', String, true)
  private _url = 'https://www.homzhub.com/privacyPolicy';

  // Custom fields
  private _options: IDropdownOption[] = [];

  private _selected: SelectedPreferenceType = false;

  get name(): string {
    return this._name;
  }

  get label(): string {
    return this._label;
  }

  get type(): string {
    return this._type;
  }

  get options(): IDropdownOption[] {
    return this._options;
  }

  set options(value: IDropdownOption[]) {
    this._options = value;
  }

  get selected(): SelectedPreferenceType {
    return this._selected;
  }

  set selected(value: SelectedPreferenceType) {
    this._selected = value;
  }

  get url(): string {
    return this._url;
  }
}
