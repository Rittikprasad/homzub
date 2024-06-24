import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';

export enum TypeOfPlan {
  RENT = 'RENT',
  SELL = 'SELL',
  MANAGE = 'MANAGE',
}

export interface IActions {
  id: number;
  title: string;
  type: TypeOfPlan;
}

export interface ISelectedAssetPlan {
  id: number;
  selectedPlan: TypeOfPlan;
}

export interface IAssetPlan {
  id: number;
  name: TypeOfPlan;
  description: string;
  icon: string;
}

@JsonObject('AssetPlan')
export class AssetPlan {
  @JsonProperty('id', Number)
  private _id = 0;

  @JsonProperty('name', String)
  private _name = '';

  @JsonProperty('label', String, true)
  private _label = '';

  @JsonProperty('description', String)
  private _description = '';

  @JsonProperty('icon', String)
  private _icon = '';

  get id(): number {
    return this._id;
  }

  get name(): TypeOfPlan {
    return this._name as TypeOfPlan;
  }

  get label(): string {
    return this._label;
  }

  get description(): string {
    return this._description;
  }

  get icon(): string {
    return this._icon;
  }
}
