import React, { Component, ReactElement, ReactNode } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { withTranslation, WithTranslation } from "react-i18next";
import { findIndex } from "lodash";
import { AlertHelper } from "@homzhub/common/src/utils/AlertHelper";
import { PlatformUtils } from "@homzhub/common/src/utils/PlatformUtils";
import {
  IWithMediaQuery,
  withMediaQuery,
} from "@homzhub/common/src/utils/MediaQueryUtils";
import { AssetRepository } from "@homzhub/common/src/domain/repositories/AssetRepository";
import Icon, { icons } from "@homzhub/common/src/assets/icon";
import { theme } from "@homzhub/common/src/styles/theme";
import Selfie from "@homzhub/common/src/assets/images/selfie.svg";
import ImageThumbnail from "@homzhub/common/src/components/atoms/ImageThumbnail";
import { Label, Text } from "@homzhub/common/src/components/atoms/Text";
import { UploadBox } from "@homzhub/common/src/components/molecules/UploadBox";
import { TypeOfPlan } from "@homzhub/common/src/domain/models/AssetPlan";
import { AllowedAttachmentFormats } from "@homzhub/common/src/domain/models/Attachment";
import {
  ExistingVerificationDocuments,
  VerificationDocumentCategory,
  VerificationDocumentTypes,
} from "@homzhub/common/src/domain/models/VerificationDocuments";
import { selfieInstruction } from "@homzhub/common/src/constants/AsssetVerification";

interface IVerificationProps {
  typeOfPlan: TypeOfPlan;
  existingDocuments: ExistingVerificationDocuments[];
  localDocuments: ExistingVerificationDocuments[];
  handleUpload: (
    verificationData: VerificationDocumentTypes,
    Files?: File[]
  ) => void;
  deleteDocument: (
    document: ExistingVerificationDocuments,
    isLocalDocument?: boolean
  ) => Promise<void>;
  handleTypes?: (types: VerificationDocumentTypes[]) => void;
}

interface IVerificationState {
  verificationTypes: VerificationDocumentTypes[];
}

type IProps = IVerificationProps & IWithMediaQuery & WithTranslation;

class VerificationTypes extends Component<IProps, IVerificationState> {
  public state = {
    verificationTypes: [],
  };

  public componentDidMount = async (): Promise<void> => {
    await this.getVerificationTypes();
  };

  public render(): ReactNode {
    const { verificationTypes } = this.state;
    console.log("7777777777777777777777777777", verificationTypes);
    const { isMobile } = this.props;
    return (
      <View style={[styles.container, isMobile && styles.mobileUploadBox]}>
        {verificationTypes.map(
          (verificationType: VerificationDocumentTypes, index: number) => {
            const data: VerificationDocumentTypes = verificationType;
            return (
              <View style={styles.proofChild} key={index}>
                <Text type="small" textType="semiBold" style={styles.title}>
                  {index + 1}. {data.title}
                </Text>
                {verificationType.name ===
                VerificationDocumentCategory.SELFIE_ID_PROOF ? (
                  <>
                    {PlatformUtils.isWeb() ? (
                      <View style={styles.webSelfie}>
                        <Selfie />
                      </View>
                    ) : (
                      <Selfie style={styles.selfie} />
                    )}
                    {selfieInstruction.map((instruction, i) => {
                      return (
                        <Label
                          type="regular"
                          textType="regular"
                          style={styles.instruction}
                          key={i}
                        >
                          {instruction}
                        </Label>
                      );
                    })}
                  </>
                ) : (
                  <>
                    {data.description !== "" && (
                      <Label
                        type="regular"
                        textType="regular"
                        style={styles.subTitle}
                      >
                        {data.description}
                      </Label>
                    )}
                  </>
                )}
                {this.renderImageOrUploadBox(verificationType)}
              </View>
            );
          }
        )}
      </View>
    );
  }

  private renderImageOrUploadBox = (
    currentData: VerificationDocumentTypes
  ): ReactElement => {
    const {
      handleUpload,
      existingDocuments,
      localDocuments,
      deleteDocument,
      isMobile,
      isOnlyTablet,
      t,
    } = this.props;
    const onPress = (): void => {
      handleUpload(currentData);
    };
    const imageSelection = (files?: File[]): void => {
      if (files) {
        console.log("88888888888888888", files);
        handleUpload(currentData, files);
      }
    };
    const totalDocuments = existingDocuments.concat(localDocuments);
    const thumbnailIndex = findIndex(
      totalDocuments,
      (document: ExistingVerificationDocuments) => {
        return currentData.id === document.verificationDocumentType.id;
      }
    );
    const onDropRejection = (): void => {
      AlertHelper.error({ message: t("unsupportedFormat") });
    };

    if (thumbnailIndex !== -1) {
      const currentDocument: ExistingVerificationDocuments =
        totalDocuments[thumbnailIndex];
      const thumbnailImage = currentDocument.document.link;
      const fileType = currentDocument.document.link
        .split("/")
        ?.pop()
        ?.split(".");
      const onDeleteImageThumbnail = (): Promise<void> =>
        deleteDocument(
          currentDocument,
          currentDocument.isLocalDocument || undefined
        );

      const { mimeType } = currentDocument.document;
      return mimeType === AllowedAttachmentFormats.AppPdf ||
        !fileType ||
        fileType[1] === "pdf" ? (
        <View style={styles.pdfContainer}>
          <Text type="small" textType="regular" style={styles.pdfName}>
            {currentDocument.document.name || fileType || [0]}
          </Text>
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={onDeleteImageThumbnail}
          >
            <Icon name={icons.close} size={22} color={theme.colors.shadow} />
          </TouchableOpacity>
        </View>
      ) : (
        <View
          style={[
            styles.imageContainer,
            isMobile && styles.imageContainerMobile,
            isOnlyTablet && styles.imageContainerTablet,
          ]}
        >
          <ImageThumbnail
            imageUrl={thumbnailImage}
            onIconPress={onDeleteImageThumbnail}
            imageWrapperStyle={[
              PlatformUtils.isWeb() && !isMobile && styles.imageWrapper,
              PlatformUtils.isWeb() &&
                !isMobile &&
                currentData.name === "SELFIE_ID_PROOF" &&
                styles.selfieWrapper,
            ]}
            imageContainerStyle={[
              isOnlyTablet && styles.imageContainerTablet,
              PlatformUtils.isWeb() &&
                !isMobile &&
                currentData.name === "SELFIE_ID_PROOF" &&
                styles.selfieWrapper,
            ]}
          />
        </View>
      );
    }
    return PlatformUtils.isMobile() ? (
      <UploadBox
        icon={currentData.icon}
        header={currentData.label}
        subHeader={currentData.helpText}
        onPress={onPress}
        containerStyle={styles.uploadBox}
      />
    ) : (
      <UploadBox
        icon={currentData.icon}
        header={currentData.label}
        subHeader={currentData.helpText}
        onPress={onPress}
        containerStyle={styles.uploadBox}
        webOnDropAccepted={imageSelection}
        webOnDropRejected={onDropRejection}
        multipleUpload={false}
        VerificationDocumentType={currentData.name}
      />
    );
  };

  public getVerificationTypes = async (): Promise<void> => {
    const { typeOfPlan, handleTypes } = this.props;
    console.log(
      "this is props in verification types component 77777",
      this.props
    );
    try {
      const response: VerificationDocumentTypes[] =
        await AssetRepository.getVerificationDocumentTypes();

      const filteredResponse = response.filter(
        (data: VerificationDocumentTypes) => {
          return data.category === typeOfPlan || data.category === "IDENTITY";
        }
      );
      if (handleTypes) {
        handleTypes(filteredResponse);
      }
      this.setState({
        verificationTypes: filteredResponse,
      });
    } catch (error) {
      AlertHelper.error({
        message: error.message,
        statusCode: error.details.statusCode,
      });
    }
  };
}
const translatedVerificationTypes = withTranslation()(VerificationTypes);

export default withMediaQuery<any>(translatedVerificationTypes);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginTop: 4,
    backgroundColor: theme.colors.white,
  },
  proofChild: {
    marginBottom: 10,
    marginTop: 20,
  },
  uploadBox: {
    marginTop: 20,
  },
  mobileUploadBox: {
    width: PlatformUtils.isWeb() ? "100%" : "auto",
    paddingHorizontal: PlatformUtils.isWeb() ? 8 : 16,
  },
  title: {
    color: theme.colors.darkTint4,
  },
  subTitle: {
    color: theme.colors.darkTint3,
    marginVertical: 10,
  },
  pdfContainer: {
    flex: 0,
    flexDirection: "row",
    backgroundColor: theme.colors.white,
    padding: 16,
    borderColor: theme.colors.primaryColor,
    borderWidth: 1,
    borderStyle: "solid",
    marginTop: 10,
    borderRadius: 4,
  },
  iconContainer: {
    width: 30,
    height: 30,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: 13,
    right: 10,
    bottom: 0,
  },
  pdfName: {
    flex: 0.9,
  },
  instruction: {
    color: theme.colors.darkTint3,
    marginBottom: 6,
  },
  selfie: {
    alignSelf: "center",
    marginVertical: 12,
  },
  webSelfie: {
    marginLeft: 70,
    marginTop: 20,
  },
  imageContainer: {
    marginRight: 100,
  },
  imageContainerMobile: {
    marginRight: undefined,
  },
  imageWrapper: {
    height: 280,
  },
  selfieWrapper: {
    height: 400,
    width: 320,
  },
  imageContainerTablet: {
    width: 650,
  },
});
