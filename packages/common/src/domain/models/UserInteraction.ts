import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { AssetVisit, IAssetVisit } from '@homzhub/common/src/domain/models/AssetVisit';
import { IUser, User } from '@homzhub/common/src/domain/models/User';

export interface IUserInteraction {
  user: IUser;
  actions: IAssetVisit[];
}

@JsonObject('UserInteraction')
export class UserInteraction {
  @JsonProperty('user', User)
  private _user = new User();

  @JsonProperty('actions', [AssetVisit], true)
  private _actions = [];

  get user(): User {
    return this._user;
  }

  get actions(): AssetVisit[] {
    return this._actions;
  }
}
