import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';

export interface ISpaceInspectionAttachment {
  id: number;
  attachment_url: string;
}

@JsonObject('SpaceInspectionAttachment')
export class SpaceInspectionAttachment {
  @JsonProperty('id', Number)
  private _id = 0;

  @JsonProperty('attachment_url', String)
  private _attachmentUrl = '';

  get id(): number {
    return this._id;
  }

  get attachmentUrl(): string {
    return this._attachmentUrl;
  }
}
