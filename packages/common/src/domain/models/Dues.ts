import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { Amount, IAmount } from '@homzhub/common/src/domain/models/Amount';
import { DueItem, IDueItem } from '@homzhub/common/src/domain/models/DueItem';

export interface IDues {
  total: IAmount;
  line_items: IDueItem[];
}
@JsonObject('Dues')
export class Dues {
  @JsonProperty('total', Amount)
  private _total = new Amount();

  @JsonProperty('line_items', [DueItem])
  private _dueItems = [];

  get total(): Amount {
    return this._total;
  }

  get dueItems(): DueItem[] {
    return this._dueItems;
  }
}
