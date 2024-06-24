import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { Attachment } from '@homzhub/common/src/domain/models/Attachment';

@JsonObject('ServicePlans')
export class ServicePlans {
  @JsonProperty('id', Number)
  private _id = '';

  @JsonProperty('name', String)
  private _name = '';

  @JsonProperty('label', String, true)
  private _label = '';

  @JsonProperty('description', String)
  private _description = '';

  @JsonProperty('display_order', Number)
  private _displayOrder = '';

  @JsonProperty('attachment', Attachment, true)
  private _attachment: Attachment = new Attachment();

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

  get attachment(): Attachment {
    return this._attachment;
  }
}
