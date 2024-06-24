import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';

export interface IVerificationDocumentTypes {
  id: number;
  name: string;
  title: string;
  category: string;
  description: string;
  label: string;
  help_text: string;
  icon: string;
}

export interface IDocument {
  id: number;
  name: string;
  attachment_type: string;
  mime_type: string;
  link: string;
}

export interface IExistingVerificationDocuments {
  id: number | null;
  verification_document_type: IVerificationDocumentTypes;
  document: IDocument;
  is_local_document?: boolean;
}

export enum VerificationDocumentCategory {
  ID_PROOF = 'ID_PROOF',
  SELFIE_ID_PROOF = 'SELFIE_ID_PROOF',
  OCCUPANCY_CERTIFICATE = 'OCCUPANCY_CERTIFICATE',
  PROPERTY_TAX = 'PROPERTY_TAX',
  OWNERSHIP_VERIFICATION_DOCUMENT = 'OWNERSHIP_VERIFICATION_DOCUMENT',
}

export interface IPropertySelectedImages {
  id: number | null;
  description: string;
  is_cover_image: boolean;
  asset: number;
  attachment: number;
  link: string | null;
  file_name: string;
  isLocalImage?: boolean;
}

export interface IYoutubeResponse {
  id: number;
  link: string;
}

export interface IPostVerificationDocuments {
  verification_document_type_id: number;
  document_id: number;
}

@JsonObject('VerificationDocumentTypes')
export class VerificationDocumentTypes {
  @JsonProperty('id', Number)
  private _id = 0;

  @JsonProperty('category', String)
  private _category = '';

  @JsonProperty('name', String)
  private _name = '';

  @JsonProperty('title', String)
  private _title = '';

  @JsonProperty('label', String)
  private _label = '';

  @JsonProperty('icon', String)
  private _icon = '';

  @JsonProperty('help_text', String)
  private _helpText = '';

  @JsonProperty('description', String)
  private _description = '';

  get id(): number {
    return this._id;
  }

  get category(): string {
    return this._category;
  }

  get name(): string {
    return this._name;
  }

  get title(): string {
    return this._title;
  }

  get label(): string {
    return this._label;
  }

  get icon(): string {
    return this._icon;
  }

  get helpText(): string {
    return this._helpText;
  }

  get description(): string {
    return this._description;
  }
}

@JsonObject('VerificationDocument')
export class VerificationDocument {
  @JsonProperty('id', Number)
  private _id = 0;

  @JsonProperty('name', String)
  private _name = '';

  @JsonProperty('attachment_type', String)
  private _attachmentType = '';

  @JsonProperty('mime_type', String)
  private _mimeType = '';

  @JsonProperty('link', String)
  private _link = '';

  get id(): number {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get attachmentType(): string {
    return this._attachmentType;
  }

  get mimeType(): string {
    return this._mimeType;
  }

  get link(): string {
    return this._link;
  }
}

@JsonObject('ExistingVerificationDocuments')
export class ExistingVerificationDocuments {
  @JsonProperty('id', Number, true)
  private _id = null;

  @JsonProperty('verification_document_type', VerificationDocumentTypes)
  private _verificationDocumentType = new VerificationDocumentTypes();

  @JsonProperty('document', VerificationDocument)
  private _document = new VerificationDocument();

  @JsonProperty('is_local_document', Boolean, true)
  private _isLocalDocument = null;

  get id(): number | null {
    return this._id;
  }

  get verificationDocumentType(): VerificationDocumentTypes {
    return this._verificationDocumentType;
  }

  get document(): VerificationDocument {
    return this._document;
  }

  get isLocalDocument(): boolean | null {
    return this._isLocalDocument;
  }
}
