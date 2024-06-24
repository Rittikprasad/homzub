import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { Attachment } from '@homzhub/common/src/domain/models/Attachment';
import { DeeplinkMetaData } from '@homzhub/common/src/domain/models/DeeplinkMetaData';
import { Links, ILinks } from '@homzhub/common/src/domain/models/PaginationLinks';

export interface IAssetNotifications {
  count: number;
  unread_count: number;
  links: ILinks;
  results: INotificationsResults[];
}

export interface INotificationsResults {
  id: number;
  notification_type: string;
  title: string;
  message: string;
  link: string;
  created_at: string;
  is_read: boolean;
}

@JsonObject('Notifications')
export class Notifications {
  @JsonProperty('id', Number)
  private _id = 0;

  @JsonProperty('notification_type', Attachment)
  private _notificationType = new Attachment();

  @JsonProperty('deeplink_metadata', DeeplinkMetaData)
  private _deeplinkMetadata = new DeeplinkMetaData();

  @JsonProperty('title', String)
  private _title = '';

  @JsonProperty('message', String)
  private _message = '';

  @JsonProperty('link', String, true)
  private _link = '';

  @JsonProperty('created_at', String)
  private _createdAt = '';

  @JsonProperty('is_read', Boolean)
  private _isRead = false;

  get id(): number {
    return this._id;
  }

  get notificationType(): Attachment {
    return this._notificationType;
  }

  get title(): string {
    return this._title;
  }

  get message(): string {
    return this._message;
  }

  get link(): string {
    return this._link;
  }

  get createdAt(): string {
    return this._createdAt;
  }

  get isRead(): boolean {
    return this._isRead;
  }

  set isRead(value: boolean) {
    this._isRead = value;
  }

  get deeplinkMetadata(): DeeplinkMetaData {
    return this._deeplinkMetadata;
  }
}

@JsonObject('AssetNotifications')
export class AssetNotifications {
  @JsonProperty('count', Number)
  private _count = 0;

  @JsonProperty('unread_count', Number)
  private _unreadCount = 0;

  @JsonProperty('links', Links)
  private _links: Links = new Links();

  @JsonProperty('results', [Notifications])
  private _results: Notifications[] = [];

  get count(): number {
    return this._count;
  }

  set unreadCount(count: number) {
    this._unreadCount = count;
  }

  get unreadCount(): number {
    return this._unreadCount;
  }

  get links(): Links {
    return this._links;
  }

  get results(): Notifications[] {
    return this._results;
  }
}
