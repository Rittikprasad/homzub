import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { Country, ICountry } from '@homzhub/common/src/domain/models/Country';

export interface IVisitAssetDetail {
  id: number;
  project_name: string;
  address?: string;
  country?: ICountry;
}

@JsonObject('VisitAssetDetail')
export class VisitAssetDetail {
  @JsonProperty('id', Number)
  private _id = 0;

  @JsonProperty('project_name', String, true)
  private _projectName = '';

  @JsonProperty('address', String, true)
  private _address = '';

  @JsonProperty('country', Country, true)
  private _country = new Country();

  get id(): number {
    return this._id;
  }

  get projectName(): string {
    return this._projectName;
  }

  get address(): string {
    return this._address;
  }

  get country(): Country {
    return this._country;
  }
}
