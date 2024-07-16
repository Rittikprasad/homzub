import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import FileUpload from '@homzhub/common/src/components/atoms/FileUpload';
import { UploadBox } from '@homzhub/common/src/components/molecules/UploadBox';
import { IDocumentSource } from '@homzhub/common/src/services/AttachmentService/interfaces';

interface IProps {
  icon: string;
  header: string;
  subHeader: string;
  containerStyle?: StyleProp<ViewStyle>;
  headerStyle?: StyleProp<ViewStyle>;
  subHeaderStyle?: StyleProp<ViewStyle>;
  iconSize?: number;
  iconColor?: string;
  key?: number;
  onCapture?: (attachments: IDocumentSource[]) => void;
  onDropAccepted?: (attachments: File[]) => void;
  onDelete: (uri: string, name?: string) => void;
  displayThumbnail?: boolean;
  attachments: IDocumentSource[] | File[];
  allowedTypes?: string[];
  children?: React.ReactElement | React.ReactNode;
}

const UploadBoxComponent = (props: IProps): React.ReactElement => {
  const { attachments, onDelete, onCapture, children, onDropAccepted, ...rest } = props;
  const { t } = useTranslation();

  const captureDocument = (files: File[]): void => {
    try {
      if (files.length) {
        const promise = Promise.resolve();
        const promises = files.map((file: File) =>
          promise.then(() => {
            return new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = (): void => {
                const customFile: IDocumentSource = {
                  name: file.name,
                  uri: reader.result as string,
                  type: file.type,
                  size: file.size,
                  fileCopyUri: reader.result as string,
                };

                resolve({
                  file,
                  customFile,
                });
              };
              reader.onerror = reject;
              reader.readAsDataURL(file);
            });
          })
        );

        promise.then(() => {
          Promise.all(promises).then((res) => {
            const fileData: File[] = res.map((item: any) => item.file);
            const customFiles: IDocumentSource[] = res.map((item: any) => item.customFile);
            if (onDropAccepted) {
              onDropAccepted(fileData);
            }
            if (onCapture) {
              onCapture(customFiles);
            }
          });
        });
      }
    } catch (e: any) {
      AlertHelper.error({ message: e.message });
    }
  };

  const onDropRejection = (): void => {
    AlertHelper.error({ message: t('unsupportedFormat') });
  };

  return (
    <>
      <UploadBox {...rest} webOnDropAccepted={captureDocument} webOnDropRejected={onDropRejection} />
      {children}
      <FileUpload attachments={attachments} onDelete={onDelete} />
    </>
  );
};

const memoised = React.memo(UploadBoxComponent);
export { memoised as UploadBoxComponent };
