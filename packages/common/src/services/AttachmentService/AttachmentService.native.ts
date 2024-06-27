import RNFetchBlob from 'rn-fetch-blob';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ConfigHelper } from '@homzhub/common/src/utils/ConfigHelper';
import { PlatformUtils } from '@homzhub/common/src//utils/PlatformUtils';
import { AssetRepository } from '@homzhub/common/src//domain/repositories/AssetRepository';
import { I18nService } from '@homzhub/common/src/services/Localization/i18nextService';
import { PermissionsService } from '@homzhub/common/src/services/Permissions/PermissionService';
import { StoreProviderService } from '@homzhub/common/src/services/StoreProviderService';
import { DownloadAttachment } from '@homzhub/common/src/domain/models/Attachment';
import { PERMISSION_TYPE } from '@homzhub/common/src/constants/PermissionTypes';
import { AttachmentType, AttachmentError } from '@homzhub/common/src/constants/AttachmentTypes';

const baseUrl = ConfigHelper.getBaseUrl();

class AttachmentService {
  public uploadImage = async (formData: any, type: AttachmentType): Promise<any> => {
    const token = StoreProviderService.getUserToken();
    console.log(token, 'token')

    return await fetch(`${baseUrl}v1/attachments/upload/?category=${type}`, {
      method: 'POST',
      headers: {
        'content-type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })
      .then((response) => {
        console.log(response,'attached file')
        return response.json()
      })
      .then((responseJson) => {
        console.log(responseJson,'responseJson')
        return responseJson;
      })
      .catch((e) => {
        Promise.reject(AttachmentError.UPLOAD_IMAGE_ERROR);
      });
  };

  public downloadAttachment = async (refKey: string, fileName: string): Promise<void> => {
    const response: DownloadAttachment = await AssetRepository.downloadAttachment(refKey);
    const permission = await PermissionsService.checkPermission(PERMISSION_TYPE.storage);

    if (response && permission) {
      try {
        const { dirs } = RNFetchBlob.fs;
        const dir = PlatformUtils.isIOS() ? dirs.DocumentDir : dirs.DownloadDir;
        const url = response.downloadLink;

        RNFetchBlob.config({
          IOSBackgroundTask: true,
          fileCache: true,
          indicator: true,
          path: `${dir}/${fileName}`,
          addAndroidDownloads: {
            useDownloadManager: true,
            notification: true,
            path: `${dir}/${fileName}`,
            title: fileName,
          },
        })
          .fetch('GET', url)
          .then((res) => {
            if (PlatformUtils.isIOS()) {
              RNFetchBlob.ios.previewDocument(res.path());
            } else {
              AlertHelper.success({ message: I18nService.t('downloadSuccess') });
            }
          })
          .catch((err) => {
            AlertHelper.error({ message: err }); //  TODOS: Lakshit: Require clarity on usage.
          });
      } catch (err) {
        AlertHelper.error({ message: err }); // TODOS: Lakshit- Require clarity on usage.
      }
    }
  };

  public getFormattedFileName = (name: string, extension: string, maxLength = 15): string =>
    name.length > maxLength ? `${name.slice(0, maxLength)}...${extension}` : name;
}

const attachmentService = new AttachmentService();
export { attachmentService as AttachmentService };
