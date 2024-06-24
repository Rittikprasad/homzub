import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { Attachment, IAttachment } from '@homzhub/common/src/domain/models/Attachment';
import { IInvoice, Invoice } from '@homzhub/common/src/domain/models/Invoice';
import { ILabelColor, LabelColor } from '@homzhub/common/src/domain/models/LabelColor';

export interface IService {
  id: number;
  referenceId?: string;
  name: string;
  label?: string;
  description: string;
  display_order: string;
  is_upload_allowed?: boolean;
  icon_attachment?: IAttachment;
  attachment?: IAttachment;
  status?: ILabelColor;
  status_updated_at?: string;
  invoice?: IInvoice;
}

@JsonObject('Service')
export class Service {
  @JsonProperty('id', Number)
  private _id = '';

  @JsonProperty('reference_id', String, true)
  private _referenceId = '';

  @JsonProperty('name', String)
  private _name = '';

  @JsonProperty('label', String, true)
  private _label = '';

  @JsonProperty('description', String)
  private _description = '';

  @JsonProperty('status_updated_at', String)
  private _statusUpdatedAt = '';

  @JsonProperty('display_order', Number)
  private _displayOrder = '';

  @JsonProperty('is_upload_allowed', Boolean)
  private _isUploadAllowed = false;

  @JsonProperty('icon_attachment', Attachment, true)
  private _iconAttachment: Attachment = new Attachment();

  @JsonProperty('invoice', Invoice, true)
  private _invoice: Invoice = new Invoice();

  @JsonProperty('attachment', [Attachment])
  private _attachment: Attachment[] = [];

  @JsonProperty('status', LabelColor)
  private _status: LabelColor = new LabelColor();

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get label(): string {
    return this._label;
  }

  get description(): string {
    return this._description;
  }

  get displayOrder(): string {
    return this._displayOrder;
  }

  get attachment(): Attachment[] {
    return this._attachment;
  }

  get isUploadAllowed(): boolean {
    return this._isUploadAllowed;
  }

  get iconAttachment(): Attachment {
    return this._iconAttachment;
  }

  get status(): LabelColor {
    return this._status;
  }

  get referenceId(): string {
    return this._referenceId;
  }

  get statusUpdatedAt(): string {
    return this._statusUpdatedAt;
  }

  get invoice(): Invoice {
    return this._invoice;
  }
}
