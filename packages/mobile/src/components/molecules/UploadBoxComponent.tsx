import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ArrayUtils } from '@homzhub/common/src/utils/ArrayUtils';
import { IDocumentSource } from '@homzhub/common/src/services/AttachmentService/interfaces';
import { I18nService } from '@homzhub/common/src/services/Localization/i18nextService';
import FileUpload from '@homzhub/common/src/components/atoms/FileUpload';
import { UploadBox } from '@homzhub/common/src/components/molecules/UploadBox';

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
  onCapture: (DocumentSource: IDocumentSource[]) => void;
  onDelete: (uri: string) => void;
  displayThumbnail?: boolean;
  attachments: IDocumentSource[] | [];
  allowedTypes?: string[];
  children?: React.ReactElement | React.ReactNode;
}

const UploadBoxComponent = (props: IProps): React.ReactElement => {
  const { attachments, onDelete, allowedTypes, onCapture, children, ...rest } = props;

  const captureDocument = async (): Promise<void> => {
    const pickType = allowedTypes || [DocumentPicker.types.images, DocumentPicker.types.pdf];
    try {
      let documents = await DocumentPicker.pickMultiple({
        // @ts-ignore
        type: pickType,
      });
      if (ArrayUtils.haveDuplicateObjects(attachments, documents, 'uri')) {
        documents = attachments;
        throw new Error(I18nService.t('common:duplicateUpload'));
      }
      onCapture(documents);
    } catch (e) {
      if (!DocumentPicker.isCancel(e)) {
        AlertHelper.error({ message: e.message });
      }
    }
  };

  return (
    <>
      <UploadBox {...rest} onPress={captureDocument} />
      {children}
      <FileUpload attachments={attachments} onDelete={onDelete} />
    </>
  );
};

const memoised = React.memo(UploadBoxComponent);
export { memoised as UploadBoxComponent };
