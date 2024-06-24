import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import {
  AssetUpdates,
  IAssetUpdates,
  IMiscellaneous,
  Miscellaneous,
} from '@homzhub/common/src/domain/models/AssetMetrics';
import { Count, ICount } from '@homzhub/common/src/domain/models/Count';

interface IFFMMetrics {
  assets: ICount;
  miscellaneous: IMiscellaneous[];
  updates: IAssetUpdates;
}

@JsonObject('FFMMetrics')
export class FFMMetrics {
  @JsonProperty('assets', Count)
  private _assets = new Count();

  @JsonProperty('miscellaneous', [Miscellaneous], true)
  private _miscellaneous: Miscellaneous[] = [];

  @JsonProperty('updates', AssetUpdates, true)
  private _updates = new AssetUpdates();

  get assets(): Count {
    return this._assets;
  }

  get miscellaneous(): Miscellaneous[] {
    return this._miscellaneous;
  }

  get updates(): AssetUpdates {
    return this._updates;
  }
}
