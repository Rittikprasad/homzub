import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';

export interface IProject {
  id: number;
  name: string;
}

@JsonObject('Project')
export class Project {
  @JsonProperty('id', Number)
  private _id = 0;

  @JsonProperty('name', String)
  private _name = '';

  get id(): number {
    return this._id;
  }

  get name(): string {
    return this._name;
  }
}
