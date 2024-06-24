import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';

export interface ICoins {
  coins_earned: number;
  coins_balance: number;
  coins_used: number;
}

@JsonObject('Coins')
export class Coins {
  @JsonProperty('coins_earned', Number)
  private _coinsEarned = 0;

  @JsonProperty('coins_balance', Number)
  private _coinsBalance = 0;

  @JsonProperty('coins_used', Number)
  private _coinsUsed = 0;

  get coinsEarned(): number {
    return this._coinsEarned;
  }

  get coinsBalance(): number {
    return this._coinsBalance;
  }

  get coinsUsed(): number {
    return this._coinsUsed;
  }
}
