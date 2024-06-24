import React, { FC } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useDown } from '@homzhub/common/src/utils/MediaQueryUtils';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

const defaultImages = {
  owner: require('@homzhub/common/src/assets/images/yourPropertyIsInYourHands.svg'),
  tenant: require('@homzhub/common/src/assets/images/yourKeyToYourHome.svg'),
};
interface IMobileImageProps {
  relativeImage: string;
  isOwner: boolean;
}
const MobileImage: FC<IMobileImageProps> = (props: IMobileImageProps) => {
  const { relativeImage, isOwner } = props;
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  const isTablet = useDown(deviceBreakpoint.TABLET);
  const styles = imageStyles(isMobile, isTablet);

  const imageStyle = {
    width: isMobile ? 310 : 492.24,
    height: isMobile ? 400 : 500,
  };
  return (
    <View style={[styles.viewGif, !isOwner && !isMobile && !isTablet && styles.tenantViewGif]}>
      {relativeImage === '' ? (
        <img
          src={isOwner ? defaultImages.owner : defaultImages.tenant}
          width={isMobile ? 310 : 492.24}
          height={isMobile ? 400 : 500}
          alt=""
          style={imageStyle}
        />
      ) : (
        <img src={relativeImage} style={imageStyle} alt="" />
      )}
    </View>
  );
};
export default MobileImage;

interface IMobileContainer {
  viewGif: ViewStyle;
  tenantViewGif: ViewStyle;
}
const imageStyles = (isMobile: boolean, isTablet: boolean): StyleSheet.NamedStyles<IMobileContainer> =>
  StyleSheet.create<IMobileContainer>({
    viewGif: {
      justifyContent: 'center',
      alignItems: 'center',
      left: !isMobile ? (isTablet ? '0%' : '2%') : '0%',
    },
    tenantViewGif: {
      left: '0%',
    },
  });
