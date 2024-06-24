import { FunctionUtils } from '@homzhub/common/src/utils/FunctionUtils';
import { AttachmentService } from '@homzhub/common/src/services/AttachmentService';
import { ImageService } from '@homzhub/common/src/services/Property/ImageService';
import { NavigationService } from '@homzhub/mobile/src/services/NavigationService';
import { Attachment } from '@homzhub/common/src/domain/models/Attachment';
import { ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { ServiceOption } from '@homzhub/common/src/constants/Services';

class ServiceHelper {
  public handleServiceActions = (
    value: string,
    assetId: number,
    attachment: Attachment[],
    invoice?: Attachment
  ): void => {
    const {
      navigation: { navigate },
    } = NavigationService;
    switch (value) {
      case ServiceOption.ADD_IMAGE:
        // eslint-disable-next-line no-case-declarations
        const attachmentData = attachment.map((item) => {
          return {
            attachment: item.id,
            is_cover_image: false,
          };
        });
        ImageService.postAttachment({ propertyId: assetId, attachmentData })
          .then(() => {
            navigate(ScreensKeys.AddPropertyImage, { assetId });
          })
          .catch();
        break;
      case ServiceOption.DOWNLOAD_TO_DEVICE:
        attachment.forEach((item) => {
          AttachmentService.downloadAttachment(item.presignedReferenceKey, item.fileName);
        });
        break;
      case ServiceOption.DOWNLOAD_INVOICE:
        if (invoice) {
          AttachmentService.downloadAttachment(invoice.presignedReferenceKey, invoice.fileName);
        }
        break;
      default:
        FunctionUtils.noop();
    }
  };
}

const serviceHelper = new ServiceHelper();
export { serviceHelper as ServiceHelper };
