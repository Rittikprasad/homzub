import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { NotificationScreens } from '@homzhub/mobile/src/services/constants';

export enum NotificationType {
  SYSTEM_NOTIFICATION = 'SYSTEM_NOTIFICATION',
  SITE_VISIT = 'SITE_VISIT',
  PROPERTY_DETAIL = 'PROPERTY_DETAIL',
  PROPERTY_PREVIEW = 'PROPERTY_PREVIEW',
  REVIEW_AND_RATING = 'REVIEW_AND_RATING',
  SERVICE_TICKET = 'SERVICE_TICKET',
  OFFER = 'OFFER',
  ASSET = 'ASSET',
  CAMPAIGN = 'CAMPAIGN',
  VALUE_ADDED_SERVICE = 'VALUE_ADDED_SERVICE',
  ASSET_DOCUMENT = 'ASSET_DOCUMENT',
  REFER_AND_EARN = 'REFER_AND_EARN',
  DUE = 'DUE',
}

@JsonObject('DeeplinkMetaData')
export class DeeplinkMetaData {
  @JsonProperty('asset_id', Number, true)
  private _assetId = -1;

  @JsonProperty('lease_listing_id', Number, true)
  private _leaseListingId = -1;

  @JsonProperty('sale_listing_id', Number, true)
  private _saleListingId = -1;

  @JsonProperty('object_id', Number, true)
  private _objectId = -1;

  @JsonProperty('type', String, true)
  private _type = '';

  @JsonProperty('screen', String, true)
  private _screen = '';

  @JsonProperty('lease_unit_id', Number, true)
  private _leaseUnitId = -1;

  @JsonProperty('message_group_id', String, true)
  private _messageGroupId = '';

  @JsonProperty('message_group_name', String, true)
  private _messageGroupName = '';

  @JsonProperty('image_link', String, true)
  private _imageLink = '';

  get assetId(): number {
    return this._assetId;
  }

  get leaseListingId(): number {
    return this._leaseListingId;
  }

  get saleListingId(): number {
    return this._saleListingId;
  }

  get objectId(): number {
    return this._objectId;
  }

  get type(): NotificationType {
    return this._type as NotificationType;
  }

  get screen(): string {
    return this._screen as NotificationScreens;
  }

  get leaseUnitId(): number {
    return this._leaseUnitId;
  }

  get messageGroupId(): string {
    return this._messageGroupId;
  }

  get messageGroupName(): string {
    return this._messageGroupName;
  }

  get imageLink(): string {
    return this._imageLink;
  }
}
