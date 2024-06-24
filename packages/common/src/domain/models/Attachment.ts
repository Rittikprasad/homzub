import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';

export enum MediaType {
  image = 'IMAGE',
  video = 'VIDEO',
  document = 'DOCUMENT',
}
export const AllowedAttachmentFormats = {
  ImgJpeg: 'image/jpeg',
  ImgJpg: 'image/jpg',
  ImgPng: 'image/png',
  ImgPublic: 'public.image',
  AdobePdf: 'com.adobe.pdf',
  AppPdf: 'application/pdf',
};

export enum UploadFileType {
  IMAGE = 'image',
  PDF = 'pdf',
}

export interface IAttachment {
  id?: number;
  name?: string;
  file_name?: string;
  link?: string;
  is_cover_image?: boolean;
  media_type?: string;
  media_attributes: IMediaAttributes;
}

export interface IMediaAttributes {
  title: string;
  duration: string;
  video_id: string;
  thumbnail: string;
  thumbnail_hd: string;
  thumbnail_sd: string;
}

@JsonObject('DownloadAttachment')
export class DownloadAttachment {
  @JsonProperty('download_link', String, true)
  private _downloadLink = '';

  get downloadLink(): string {
    return this._downloadLink;
  }
}

@JsonObject('MediaAttributes')
export class MediaAttributes {
  @JsonProperty('title', String, true)
  private _title = '';

  @JsonProperty('duration', String, true)
  private _duration = '';

  @JsonProperty('video_id', String, true)
  private _videoId = '';

  @JsonProperty('thumbnail', String, true)
  private _thumbnail = '';

  @JsonProperty('thumbnail_hd', String, true)
  private _thumbnailHD = '';

  @JsonProperty('thumbnail_best', String, true)
  private _thumbnailBest = '';

  @JsonProperty('thumbnail_sd', String, true)
  private _thumbnailSD = '';

  get title(): string {
    return this._title;
  }

  get duration(): string {
    return this._duration;
  }

  get videoId(): string {
    return this._videoId;
  }

  get thumbnail(): string {
    return this._thumbnail;
  }

  get thumbnailHD(): string {
    return this._thumbnailHD;
  }

  get thumbnailSD(): string {
    return this._thumbnailSD;
  }

  get thumbnailBest(): string {
    return this._thumbnailBest;
  }
}

@JsonObject('Attachment')
export class Attachment {
  @JsonProperty('id', Number, true)
  private _id = 0;

  @JsonProperty('file_name', String, true)
  private _fileName = '';

  @JsonProperty('name', String, true)
  private _name = '';

  @JsonProperty('label', String, true)
  private _label = '';

  @JsonProperty('link', String, true)
  private _link = '';

  @JsonProperty('media_type', String, true)
  private _mediaType = 'IMAGE';

  @JsonProperty('is_cover_image', Boolean, true)
  private _isCoverImage = false;

  @JsonProperty('media_attributes', MediaAttributes, true)
  private _mediaAttributes: MediaAttributes = new MediaAttributes();

  @JsonProperty('presigned_reference_key', String, true)
  private _presignedReferenceKey = '';

  @JsonProperty('attachment_link', String, true)
  private _attachmentLink = '';

  get id(): number {
    return this._id;
  }

  get fileName(): string {
    return this._fileName;
  }

  get name(): string {
    return this._name;
  }

  get label(): string {
    return this._label;
  }

  get link(): string {
    return this._link;
  }

  get mediaType(): string {
    return this._mediaType;
  }

  get isCoverImage(): boolean {
    return this._isCoverImage;
  }

  get mediaAttributes(): MediaAttributes {
    return this._mediaAttributes;
  }

  get presignedReferenceKey(): string {
    return this._presignedReferenceKey;
  }

  get attachmentLink(): string {
    return this._attachmentLink;
  }
}
