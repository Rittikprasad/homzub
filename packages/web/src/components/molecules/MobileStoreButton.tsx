import React, { ReactElement } from 'react';
import { Image, ImageStyle, StyleProp, StyleSheet, TouchableOpacity } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { IWithMediaQuery, withMediaQuery } from '@homzhub/common/src/utils/MediaQueryUtils';
import { LinkingService } from '@homzhub/web/src/services/LinkingService';
import { PixelEventType, PixelService } from '@homzhub/web/src/services/PixelService';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

export type imageType =
  | 'apple'
  | 'google'
  | 'appleLarge'
  | 'googleLarge'
  | 'instagram'
  | 'twitter'
  | 'youtube'
  | 'linkedin'
  | 'facebook';

export interface IStoreButtonProps extends WithTranslation {
  store: imageType;
  containerStyle: StyleProp<ImageStyle>;
  imageIconStyle: StyleProp<ImageStyle>;
  mobileImageIconStyle: StyleProp<ImageStyle>;
}

type IProps = IStoreButtonProps & IWithMediaQuery;

class MobileStoreButton extends React.PureComponent<IProps> {
  public render(): ReactElement {
    const { t, store, isMobile, containerStyle, imageIconStyle, mobileImageIconStyle = {} } = this.props;
    const clickHandler = (): void => {
      PixelService.ReactPixel.track(PixelEventType.ViewContent, { content_type: t('downloadApp') });
      LinkingService.redirectInNewTab(redirectUrl);
    };
    const url = LinkingService.getImage(store);
    const redirectUrl = LinkingService.getUrl(store);
    return (
      <TouchableOpacity style={[styles.storeStyle, containerStyle]} onPress={clickHandler}>
        <Image source={{ uri: url }} style={[imageIconStyle, isMobile && mobileImageIconStyle]} />
      </TouchableOpacity>
    );
  }
}

const StoreButton = withTranslation(LocaleConstants.namespacesKey.landing)(withMediaQuery<IProps>(MobileStoreButton));
export default StoreButton;

const styles = StyleSheet.create({
  storeStyle: {
    flex: 1,
    width: 130,
    height: 50,
    alignItems: 'center',
  },
});
