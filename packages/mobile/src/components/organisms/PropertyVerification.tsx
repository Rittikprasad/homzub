import React from "react";
import { StyleSheet } from "react-native";
import DocumentPicker from "react-native-document-picker";
import ImagePicker from "react-native-image-crop-picker";
import { WithTranslation, withTranslation } from "react-i18next";
import { AlertHelper } from "@homzhub/common/src/utils/AlertHelper";
import { ObjectMapper } from "@homzhub/common/src/utils/ObjectMapper";
import { PlatformUtils } from "@homzhub/common/src/utils/PlatformUtils";
import { AssetRepository } from "@homzhub/common/src/domain/repositories/AssetRepository";
import {
  IDocsProps,
  ListingService,
} from "@homzhub/common/src/services/Property/ListingService";
import { AttachmentService } from "@homzhub/common/src/services/AttachmentService";
import { Button } from "@homzhub/common/src/components/atoms/Button";
import VerificationTypes from "@homzhub/common/src/components/organisms/VerificationTypes";
import { TypeOfPlan } from "@homzhub/common/src/domain/models/AssetPlan";
import { AllowedAttachmentFormats } from "@homzhub/common/src/domain/models/Attachment";
import { ILastVisitedStep } from "@homzhub/common/src/domain/models/LastVisitedStep";
import {
  ExistingVerificationDocuments,
  IExistingVerificationDocuments,
  IPostVerificationDocuments,
  VerificationDocumentCategory,
  VerificationDocumentTypes,
} from "@homzhub/common/src/domain/models/VerificationDocuments";
import { IUpdateAssetParams } from "@homzhub/common/src/domain/repositories/interfaces";
import {
  AttachmentError,
  AttachmentType,
} from "@homzhub/common/src/constants/AttachmentTypes";
import { LocaleConstants } from "@homzhub/common/src/services/Localization/constants";

interface IPropertyVerificationState {
  verificationTypes: VerificationDocumentTypes[];
  existingDocuments: ExistingVerificationDocuments[];
  localDocuments: ExistingVerificationDocuments[];
  isLoading: boolean;
}

interface IProps {
  typeOfPlan: TypeOfPlan;
  updateStep: () => void;
  propertyId: number;
  lastVisitedStep: ILastVisitedStep;
}

type Props = WithTranslation & IProps;

export class PropertyVerification extends React.PureComponent<
  Props,
  IPropertyVerificationState
> {
  public state = {
    verificationTypes: [],
    existingDocuments: [],
    localDocuments: [],
    isLoading: false,
  };

  public componentDidMount = async (): Promise<void> => {
    const { propertyId } = this.props;
    await ListingService.getExistingDocuments(propertyId, this.updateState);
  };

  public render(): React.ReactElement {
    const { t, typeOfPlan } = this.props;
    const { existingDocuments, localDocuments, isLoading, verificationTypes } =
      this.state;
    const totalDocuments = existingDocuments.concat(localDocuments);

    const uploadedTypes = totalDocuments.map(
      (doc: ExistingVerificationDocuments) => doc.verificationDocumentType.name
    );
    const containsAllReqd = uploadedTypes.length === verificationTypes.length;

    return (
      <>
        <VerificationTypes
          typeOfPlan={typeOfPlan}
          existingDocuments={existingDocuments}
          localDocuments={localDocuments}
          handleUpload={this.handleVerificationDocumentUploads}
          deleteDocument={this.onDeleteDocument}
          handleTypes={this.handleVerificationTypes}
        />
        <Button
          type="primary"
          title={t("common:continue")}
          disabled={!containsAllReqd || isLoading}
          containerStyle={styles.buttonStyle}
          onPress={this.postPropertyVerificationDocuments}
        />
      </>
    );
  }

  // HANDLERS START

  public onDeleteDocument = async (
    document: ExistingVerificationDocuments,
    isLocalDocument?: boolean
  ): Promise<void> => {
    const { localDocuments, existingDocuments } = this.state;
    const { propertyId } = this.props;
    await ListingService.deleteDocument(
      {
        document,
        localDocuments,
        existingDocuments,
        isLocalDocument,
        propertyId,
      },
      this.updateState
    );
  };

  public handleVerificationTypes = (
    types: VerificationDocumentTypes[]
  ): void => {
    this.setState({
      verificationTypes: types,
    });
  };

  public handleVerificationDocumentUploads = async (
    data: VerificationDocumentTypes
  ): Promise<void> => {
    const verificationDocumentId = data.id;
    const verificationDocumentType = data.name;
    if (
      verificationDocumentType === VerificationDocumentCategory.SELFIE_ID_PROOF
    ) {
      this.captureSelfie(verificationDocumentId, data);
    } else {
      await this.uploadDocument(verificationDocumentId, data);
    }
  };

  public captureSelfie = (
    verificationDocumentId: number,
    data: VerificationDocumentTypes
  ): void => {
    ImagePicker.openCamera({
      width: 400,
      height: 400,
      compressImageMaxWidth: 400,
      compressImageMaxHeight: 400,
      compressImageQuality: PlatformUtils.isAndroid() ? 1 : 0.8,
      useFrontCamera: true,
      cropping: true,
    })
      .then((image: any) => {
        const source = {
          uri: image.path,
          type: image.mime,
          name: PlatformUtils.isIOS()
            ? image.filename ??
              image.path.substring(image.path.lastIndexOf("/") + 1)
            : image.path.substring(image.path.lastIndexOf("/") + 1),
        };
        this.updateLocalDocuments(verificationDocumentId, source, data);
      })
      .catch((e) => {
        if (e.code !== "E_PICKER_CANCELLED") {
          AlertHelper.error({ message: "error" });
        }
      });
  };

  public uploadDocument = async (
    verificationDocumentId: number,
    data: VerificationDocumentTypes
  ): Promise<void> => {
    try {
      const document = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      if (Object.values(AllowedAttachmentFormats).includes(document.type)) {
        const source = {
          uri: document.uri,
          type: document.type,
          name: document.name,
        };
        this.updateLocalDocuments(verificationDocumentId, source, data);
      } else {
        AlertHelper.error({ message: data.helpText });
      }
    } catch (e) {
      if (!DocumentPicker.isCancel(e)) {
        AlertHelper.error({ message: e.message });
      }
    }
  };

  public updateLocalDocuments = (
    verificationDocumentId: number,
    source: { uri: string; type: string; name: string },
    data: VerificationDocumentTypes
  ): void => {
    const imageObject: IExistingVerificationDocuments = {
      id: null,
      verification_document_type: ObjectMapper.serialize(data),
      document: {
        id: data.id,
        name: source.name,
        attachment_type: source.type,
        mime_type: source.type,
        link: source.uri,
      },
      is_local_document: true,
    };
    const { localDocuments } = this.state;
    this.setState({
      localDocuments: [
        ...localDocuments,
        ObjectMapper.deserialize(ExistingVerificationDocuments, imageObject),
      ],
    });
  };

  public updateState = (data: IDocsProps): void => {
    const { existingDocuments, localDocuments, clonedDocuments, key } = data;
    this.setState((prevState) => ({
      ...prevState,
      ...(existingDocuments && { existingDocuments }),
      ...(localDocuments && { localDocuments }),
      ...(clonedDocuments && key && { [key]: clonedDocuments }),
    }));
  };

  // HANDLERS END

  // API'S START

  public postPropertyVerificationDocuments = async (): Promise<void> => {
    const { propertyId, updateStep, t, lastVisitedStep, typeOfPlan } =
      this.props;
    const { localDocuments, existingDocuments } = this.state;

    const updateAssetPayload: IUpdateAssetParams = {
      last_visited_step: {
        ...lastVisitedStep,
        listing: {
          ...lastVisitedStep.listing,
          type: typeOfPlan,
          is_verification_done: true,
        },
      },
    };

    if (localDocuments.length === 0) {
      await AssetRepository.updateAsset(propertyId, updateAssetPayload);
      updateStep();
      return;
    }
    const formData = new FormData();
    localDocuments.forEach((document: ExistingVerificationDocuments) => {
      formData.append("files[]", {
        // @ts-ignore
        name: document.document.name,
        uri: document.document.link,
        // @ts-ignore
        type: document.document.mimeType,
      });
    });

    this.setState({ isLoading: true });

    try {
      const response = await AttachmentService.uploadImage(
        formData,
        AttachmentType.ASSET_VERIFICATION
      );

      const { data } = response;
      const postRequestBody: IPostVerificationDocuments[] = [];

      localDocuments.forEach(
        (document: ExistingVerificationDocuments, index: number) => {
          postRequestBody.push({
            verification_document_type_id: document.verificationDocumentType.id,
            document_id: data[index].id,
          });
        }
      );

      existingDocuments.forEach((document: ExistingVerificationDocuments) => {
        if (!document.id) {
          postRequestBody.push({
            verification_document_type_id: document.verificationDocumentType.id,
            document_id: document.document.id,
          });
        }
      });
      this.setState({ isLoading: false });

      await AssetRepository.postVerificationDocuments(
        propertyId,
        postRequestBody
      );
      await ListingService.getExistingDocuments(propertyId, this.updateState);
      await AssetRepository.updateAsset(propertyId, updateAssetPayload);
      updateStep();
    } catch (e) {
      this.setState({ isLoading: false });
      if (e === AttachmentError.UPLOAD_IMAGE_ERROR) {
        AlertHelper.error({ message: t("common:fileCorrupt") });
      }
    }
  };

  // API'S END
}

export default withTranslation(LocaleConstants.namespacesKey.property)(
  PropertyVerification
);

const styles = StyleSheet.create({
  buttonStyle: {
    flex: 0,
    marginVertical: 20,
  },
});
