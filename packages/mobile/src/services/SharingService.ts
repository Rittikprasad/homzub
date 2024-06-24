import { Linking } from 'react-native';
import { ShareDialog } from 'react-native-fbsdk';
import Share, { Options, ActivityItemSource } from 'react-native-share';
import RNFetchBlob from 'rn-fetch-blob';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { I18nService } from '@homzhub/common/src/services/Localization/i18nextService';

enum ShareUrl {
  'TEXT' = 'text',
  'URL' = 'url',
}

enum AttachmentType {
  'JPG' = 'jpg',
  'JPEG' = 'jpeg',
  'PDF' = 'pdf',
  'PNG' = 'png',
}
class SharingService {
  /**
   * Shares the content
   * @param message Message to be sent
   * @param sharingUrl URL of the attachment to be sent, if any
   */
  public Share = async (social: Share.Social, message: string, sharingUrl?: string): Promise<void> => {
    const title = I18nService.t('common:homzhub');
    let linkData = '';
    const url = ShareUrl.TEXT;
    let urlFormat: ActivityItemSource;
    let options: Options = { title, message };
    try {
      const iosOptions = (): Options => {
        const textSharingFormat: ActivityItemSource = {
          placeholderItem: { type: 'text', content: message },
          item: {
            default: { type: 'text', content: message },
            message: null,
          },
          linkMetadata: {
            title: message,
          },
        };
        if (sharingUrl) {
          // For sharing url with custom title.
          urlFormat = {
            placeholderItem: { type: 'url', content: linkData },
            item: {
              default: { type: 'url', content: linkData },
            },
            subject: {
              default: title,
            },
            linkMetadata: { originalUrl: linkData, url, title },
          };
          return { ...options, activityItemSources: [urlFormat, textSharingFormat] };
        }
        return { ...options, activityItemSources: [textSharingFormat] };

        // TODO || Praharsh : Get the icon, if needed.
      };

      const androidOptions = (): Options => ({
        ...options,
        subject: title,
        ...(sharingUrl && { url: linkData }),
      });

      // Fetch attachment data from uri
      if (sharingUrl) {
        const extension = sharingUrl.split('.').reverse()[0];
        const response = await RNFetchBlob.fetch('GET', sharingUrl);
        const base64 = response.data;
        linkData = `${this.getExtensionForBase64(extension.toLowerCase())},${base64}`;
        options = PlatformUtils.isIOS() ? iosOptions() : androidOptions();
      }
      const appUrl = this.getAppUrl(social);
      const hasApp = await Linking.canOpenURL(appUrl);
      if (hasApp) {
        if (social === Share.Social.FACEBOOK) {
          const shareLinkContent = {
            contentType: 'link',
            userGenerated: false,
            quote: message,
            // Show homepage if attachment is not there
            contentUrl: sharingUrl || 'www.homzhub.com',
            ...(sharingUrl && {
              photos: [
                {
                  imageUrl: sharingUrl,
                },
              ],
            }),
            hashtag: 'homzhub',
          };

          // @ts-ignore
          await ShareDialog.show(shareLinkContent);
          return;
        }

        await Share.shareSingle({ ...options, social });
        return;
      }
      if (!hasApp) {
        const webUrl = this.getWebUrl(social, message, sharingUrl);
        await Linking.openURL(webUrl);
      }
    } catch (error) {
      AlertHelper.error({ message: error.toString() });
    }
  };

  private getAppUrl = (social: Share.Social): string => {
    switch (social) {
      case Share.Social.WHATSAPP:
        return 'whatsapp://send?';
      case Share.Social.EMAIL:
        return 'mailto://';
      case Share.Social.TWITTER:
        return 'twitter://user?';
      case Share.Social.FACEBOOK:
        return 'fb://';
      default:
        return `${social}://`;
    }
  };

  private getWebUrl = (social: Share.Social, message: string, url?: string): string => {
    switch (social) {
      case Share.Social.TWITTER:
        return url
          ? `https://twitter.com/intent/tweet?text=${message}&hashtags=homzhub&url=${url}`
          : `https://twitter.com/intent/tweet?text=${encodeURI(message)}&hashtags=homzhub`;
      case Share.Social.WHATSAPP:
        return url ? `https://wa.me/?text=${encodeURI(message + url)}` : `https://wa.me/?text=${encodeURI(message)}`;
      case Share.Social.FACEBOOK:
        return url
          ? `https://www.facebook.com/sharer/?u=${encodeURI(url)}&quote=${message}`
          : `https://www.facebook.com/sharer/?u=www.homzhub.com&quote=${message}`;
      case Share.Social.EMAIL:
      default:
        return 'mailTo://';
    }
  };

  private getExtensionForBase64 = (extension: string): string => {
    switch (extension) {
      case AttachmentType.JPEG:
      case AttachmentType.JPG:
        return 'data:image/jpeg;base64';
      case AttachmentType.PNG:
        return 'data:image/png;base64';
      case AttachmentType.PDF:
        return 'data:application/pdf';
      default:
        throw new Error(I18nService.t('common:genericErrorMessage'));
    }
  };
}

const sharingService = new SharingService();
export default sharingService;
