import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';

export interface IWishlist {
  lease_listing_id?: number;
  sale_listing_id?: number;
}

@JsonObject('Wishlist')
export class Wishlist {
  @JsonProperty('lease_listing_id', Number, true)
  private _leaseListingId = null;

  @JsonProperty('sale_listing_id', Number, true)
  private _saleListingId = null;

  get leaseListingId(): number | null {
    return this._leaseListingId;
  }

  get saleListingId(): number | null {
    return this._saleListingId;
  }
}
