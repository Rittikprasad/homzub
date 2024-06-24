export interface IAttachmentResponse {
  data: IData[];
}

interface IData {
  id: number;
}

export interface IDocumentSource {
  uri: string;
  type: string;
  name: string;
  key?: number;
  fileCopyUri: string;
  size: number;
}

export interface IImageSource {
  filename: string;
  mime: string;
  path: string;
  size?: number;
  width?: number;
  height?: number;
}
