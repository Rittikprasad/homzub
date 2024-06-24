import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';

@JsonObject('AssetOfferSummary')
export class AssetOfferSummary {
  @JsonProperty('total_offers', Number, true)
  private total_offers = 0;

  @JsonProperty('active_offers', Number, true)
  private active_offers = 0;

  @JsonProperty('pending_offers', Number, true)
  private pending_offers = 0;

  get totalOffers(): number {
    return this.total_offers;
  }

  get activeOffers(): number {
    return this.active_offers;
  }

  get pendingOffers(): number {
    return this.pending_offers;
  }
}
