import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';

@JsonObject('OfferLeft')
export class OfferLeft {
  @JsonProperty('sale', Number)
  private _sale = 0;

  @JsonProperty('lease', Number)
  private _lease = 0;

  get sale(): number {
    return this._sale;
  }

  get lease(): number {
    return this._lease;
  }
}

@JsonObject('OfferManagement')
export class OfferManagement {
  @JsonProperty('total_offers', Number)
  private _total_offers = 0;

  @JsonProperty('offers_received', Number)
  private _offers_received = 0;

  @JsonProperty('offers_made', Number)
  private _offers_made = 0;

  @JsonProperty('offers_left', OfferLeft)
  private _offers_left = new OfferLeft();

  get totalOffers(): number {
    return this._total_offers;
  }

  get offerReceived(): number {
    return this._offers_received;
  }

  get offerMade(): number {
    return this._offers_made;
  }

  get offerLeft(): OfferLeft {
    return this._offers_left;
  }
}
