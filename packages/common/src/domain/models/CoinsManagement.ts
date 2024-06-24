import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { Coins, ICoins } from '@homzhub/common/src/domain/models/Coins';
import { Invites, IInvites } from '@homzhub/common/src/domain/models/Invites';

export interface ICoinsManagement {
  coins: ICoins;
  invites: IInvites;
}

@JsonObject('CoinsManagement')
export class CoinsManagement {
  @JsonProperty('coins', Coins)
  private _coins = new Coins();

  @JsonProperty('invites', Invites)
  private _invites = new Invites();

  get coins(): Coins {
    return this._coins;
  }

  get invites(): Invites {
    return this._invites;
  }
}
