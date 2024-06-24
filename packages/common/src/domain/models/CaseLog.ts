import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { Unit, IUnit } from '@homzhub/common/src/domain/models/Unit';
import { Attachment, IAttachment } from '@homzhub/common/src/domain/models/Attachment';

export enum Status {
  open = 'OPEN',
}
export interface ICaseLog {
  id: number;
  ticket_number: string;
  title?: string;
  description: string;
  status?: string;
  raised_at?: string;
  support_category?: IUnit;
  attachments?: IAttachment[];
}

@JsonObject('CaseLog')
export class CaseLog {
  @JsonProperty('id', Number, true)
  private _id = -1;

  @JsonProperty('ticket_number', String, true)
  private _ticketNumber = '';

  @JsonProperty('title', String, true)
  private _title = '';

  @JsonProperty('description', String, true)
  private _description = '';

  @JsonProperty('status', String, true)
  private _status = '';

  @JsonProperty('raised_at', String, true)
  private _raisedAt = '';

  @JsonProperty('support_category', Unit, true)
  private _supportCategory = new Unit();

  @JsonProperty('attachments', [Attachment], true)
  private _attachments = [];

  get id(): number {
    return this._id;
  }

  get ticketNumber(): string {
    return this._ticketNumber;
  }

  get title(): string {
    return this._title;
  }

  get description(): string {
    return this._description;
  }

  get status(): string {
    return this._status;
  }

  get raisedAt(): string {
    return this._raisedAt;
  }

  get supportCategory(): Unit {
    return this._supportCategory;
  }

  get attachments(): Attachment[] {
    return this._attachments;
  }
}
