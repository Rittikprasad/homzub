/* eslint-disable @typescript-eslint/ban-ts-comment */
import ImagePicker, {
  Image as ImagePickerResponse,
} from "react-native-image-crop-picker";
import { AlertHelper } from "@homzhub/common/src/utils/AlertHelper";
import { PlatformUtils } from "@homzhub/common/src/utils/PlatformUtils";
import { AttachmentService } from "@homzhub/common/src/services/AttachmentService";
import { PermissionsService } from "@homzhub/common/src/services/Permissions/PermissionService";
import { AttachmentType } from "@homzhub/common/src/constants/AttachmentTypes";
import { PERMISSION_TYPE } from "@homzhub/common/src/constants/PermissionTypes";
import { ISpaceAttachment } from "@homzhub/common/src/modules/ffm/interface";

interface IUploadImage {
  selectedImages: ISpaceAttachment[];
  onUploadImage: (payload: ISpaceAttachment[]) => void;
  setLoading: (loading: boolean) => void;
  onClose: () => void;
}

class ImageService {
  public handleGalleryUpload = async (props: IUploadImage): Promise<void> => {
    const { selectedImages, onUploadImage, setLoading, onClose } = props;

    try {
      // @ts-ignore
      const images: ImagePickerResponse[] = await ImagePicker.openPicker({
        multiple: true,
        compressImageQuality: PlatformUtils.isAndroid() ? 1 : 0.8,
        includeBase64: true,
        mediaType: "photo",
      });
      setLoading(true);
      const formData = new FormData();
      images.forEach((image) => {
        formData.append("files[]", {
          // @ts-ignore
          name: PlatformUtils.isIOS()
            ? image.filename
            : image.path.substring(image.path.lastIndexOf("/") + 1),
          uri: image.path,
          type: image.mime,
        });
      });

      try {
        const response = await AttachmentService.uploadImage(
          formData,
          AttachmentType.INSPECTION_REPORT_IMAGES
        );

        const { data } = response;
        const localSelectedImages: ISpaceAttachment[] = [...selectedImages];
        images.forEach((image, index: number) => {
          localSelectedImages.push({
            id: data[index].id,
            attachmentUrl: data[index].link,
          });
        });
        setLoading(false);
        onUploadImage(localSelectedImages);
      } catch (e) {
        setLoading(false);
        AlertHelper.error({ message: e.message });
        onClose();
      }
    } catch (e) {
      setLoading(false);
      if (e.code !== "E_PICKER_CANCELLED") {
        AlertHelper.error({ message: e.message });
      }
    }
  };

  public handleCameraUpload = async (props: IUploadImage): Promise<void> => {
    const { selectedImages, onUploadImage, setLoading, onClose } = props;
    const permissionCheck = await PermissionsService.checkPermission(
      PERMISSION_TYPE.camera
    );

    try {
      if (permissionCheck) {
        // @ts-ignore
        const image: ImagePickerResponse = await ImagePicker.openCamera({
          multiple: true,
          compressImageMaxHeight: 400,
          compressImageMaxWidth: 400,
          compressImageQuality: PlatformUtils.isAndroid() ? 1 : 0.8,
          includeBase64: true,
          mediaType: "photo",
        });
        setLoading(true);
        const formData = new FormData();
        formData.append("files[]", {
          // @ts-ignore
          name: PlatformUtils.isIOS()
            ? image.filename
            : image.path.substring(image.path.lastIndexOf("/") + 1),
          uri: image.path,
          type: image.mime,
        });

        try {
          const response = await AttachmentService.uploadImage(
            formData,
            AttachmentType.INSPECTION_REPORT_IMAGES
          );
          const { data } = response;
          const localSelectedImages: ISpaceAttachment[] = selectedImages;
          if (data) {
            localSelectedImages.push({
              id: data[0].id,
              attachmentUrl: data[0].link,
            });
            setLoading(false);
            onUploadImage(localSelectedImages);
          }
        } catch (e) {
          setLoading(false);
          AlertHelper.error({ message: e.message });
          onClose();
        }
      }
    } catch (e) {
      setLoading(false);
      if (e.code !== "E_PICKER_CANCELLED") {
        AlertHelper.error({ message: e.message });
      }
    }
  };
}

const imageService = new ImageService();
export { imageService as ImageService };
