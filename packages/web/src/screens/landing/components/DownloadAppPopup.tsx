import React, { CSSProperties, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { DeviceUtils } from '@homzhub/common/src/utils/DeviceUtils';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import AppLogo from '@homzhub/common/src/assets/images/propertyManager.svg';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import Popover from '@homzhub/web/src/components/atoms/Popover';
import { WithShadowView } from '@homzhub/common/src/components/atoms/WithShadowView';
import StoreButton from '@homzhub/web/src/components/molecules/MobileStoreButton';

const DownloadAppPopup: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    setDevice().then();
  }, []);

  const setDevice = async (): Promise<void> => {
    const Os: string = await DeviceUtils.getDeviceOs();
    const isMobile = Os.toLowerCase() === 'ios' || Os.toLowerCase() === 'android';
    setIsOpen(isMobile);
  };
  const popOverContentStyle: CSSProperties = {
    width: '100%',
    alignItems: 'center',
    position: 'absolute',
    bottom: '0px',
    height: '250px',
    borderRadius: '10px 10px 0px 0px',
  };
  const renderPopOverContent = (): React.ReactElement => {
    return (
      <View style={styles.contentContainer}>
        <WithShadowView isBottomShadow>
          <View style={styles.contentHeader}>
            <Text style={styles.title} type="small" textType="semiBold">
              {t('landing:downloadNow')}
            </Text>
            <Icon name={icons.close} size={20} onPress={(): void => setIsOpen(false)} />
          </View>
        </WithShadowView>
        <View style={styles.appLogo}>
          <AppLogo height={60} />
        </View>
        <View style={styles.storeButtonGroup}>
          <StoreButton
            store="appleLarge"
            containerStyle={styles.button}
            imageIconStyle={styles.imageIconStyle}
            mobileImageIconStyle={styles.appImageIconStyle}
          />
          <StoreButton
            store="googleLarge"
            containerStyle={styles.button}
            imageIconStyle={styles.imageIconStyle}
            mobileImageIconStyle={styles.appImageIconStyle}
          />
        </View>
      </View>
    );
  };
  return (
    <Popover
      content={renderPopOverContent}
      popupProps={{
        open: isOpen,
        onClose: (): void => setIsOpen(false),
        modal: true,
        arrow: false,
        contentStyle: popOverContentStyle,
        closeOnDocumentClick: true,
        children: undefined,
      }}
    />
  );
};

export default DownloadAppPopup;

const styles = StyleSheet.create({
  button: {
    width: '100%',
    maxWidth: '100%',
  },
  imageIconStyle: {
    width: '100%',
    height: 80,
    resizeMode: 'stretch',
    maxWidth: '100%',
  },
  appImageIconStyle: {
    width: '106px',
  },
  contentContainer: {
    marginBottom: 24,
  },
  contentHeader: { flexDirection: 'row', alignItems: 'center', margin: 16 },
  title: { flex: 1, textAlign: 'center' },
  appLogo: { marginTop: 10, alignItems: 'center' },
  storeButtonGroup: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', marginBottom: 10 },
});
