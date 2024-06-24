export enum AttachmentType {
  ASSET_IMAGE = 'asset_images',
  ASSET_DOCUMENT = 'asset_documents',
  ASSET_VERIFICATION = 'verification_documents',
  ASSET_RECORD = 'financial_record',
  PROFILE_IMAGE = 'profile_images',
  CHAT_DOCUMENT = 'chat_document',
  TICKET_DOCUMENTS = 'ticket_documents',
  INSPECTION_REPORT_IMAGES = 'inspection_report_images',
}

export enum AttachmentError {
  UPLOAD_IMAGE_ERROR = 'File is corrupted',
}

export interface IFile {
  name: string;
  type: string;
  path: string;
  size: number;
}
