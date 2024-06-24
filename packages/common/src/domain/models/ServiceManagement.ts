import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { Count } from '@homzhub/common/src/domain/models/Count';
import { MetricsCount } from '@homzhub/common/src/domain/models/MetricsCount';

@JsonObject('ServiceManagement')
export class ServiceManagement {
  @JsonProperty('asset', Count)
  private _asset = new Count();

  @JsonProperty('value_added_service', MetricsCount)
  private _valueAddedService = new MetricsCount();

  get asset(): Count {
    return this._asset;
  }

  get valueAddedService(): MetricsCount {
    return this._valueAddedService;
  }
}
