import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import { FileRejection, useDropzone } from "react-dropzone";
import { UploadBtn } from "@homzhub/common/src/components/molecules/UploadBox/UploadBtn";
import { VerificationDocumentCategory } from "@homzhub/common/src/domain/models/VerificationDocuments";

interface IUploadProps {
  icon: string;
  header: string;
  subHeader: string;
  onPress?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  headerStyle?: StyleProp<ViewStyle>;
  subHeaderStyle?: StyleProp<ViewStyle>;
  iconSize?: number;
  iconColor?: string;
  webOnDropAccepted?: (files: File[]) => void;
  webOnDropRejected?: (fileRejections: FileRejection[]) => void;
  multipleUpload: boolean;
  VerificationDocumentType: string;
}

export const UploadBox: React.FC<IUploadProps> = (props: IUploadProps) => {
  const {
    webOnDropAccepted,
    webOnDropRejected,
    multipleUpload,
    VerificationDocumentType,
  } = props;
  console.log("this is props in UploadBox", props);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: ".jpg,.jpeg,.png,.pdf",
    onDropAccepted: webOnDropAccepted,
    onDropRejected: webOnDropRejected,
    multiple: multipleUpload,
  });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />

      <UploadBtn {...props} />
    </div>
    // <div {...getRootProps()}>
    //   {VerificationDocumentType !==
    //     VerificationDocumentCategory.SELFIE_ID_PROOF && (
    //     <div {...getInputProps()}>open</div>
    //   )}
    //   {/* <UploadBtn {...props} /> */}
    // </div>
  );
};
