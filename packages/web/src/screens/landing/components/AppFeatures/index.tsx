import React, { FC, useState } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDown, useOnly } from '@homzhub/common/src/utils/MediaQueryUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import FeatureCard from '@homzhub/web/src/screens/landing/components/AppFeatures/FeatureCard';
import MobileImage from '@homzhub/web/src/screens/landing/components/AppFeatures/MobileImage';
import { SelectionPicker } from '@homzhub/common/src/components/atoms/SelectionPicker';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

const AppFeatures: FC = () => {
  const { t } = useTranslation();
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  const isTablet = useDown(deviceBreakpoint.TABLET);
  const onlyTablet = useOnly(deviceBreakpoint.TABLET);
  const [image, setImage] = useState('');
  const [isOwner, setIsOwner] = useState(true);
  const [selectedTab, setSelectedTab] = useState(0);

  const styles = containerStyles(isMobile);
  const relativeImage = (data: string): void => {
    setImage(data);
  };

  const onTabChange = (argSelectedTab: number): void => {
    setSelectedTab(argSelectedTab);
    setIsOwner(!isOwner);
  };
  return (
    <View style={styles.containers}>
      <View style={styles.content}>
        <Typography
          variant={!isMobile ? 'text' : 'label'}
          size={!isMobile ? 'small' : 'large'}
          style={styles.title}
          fontWeight="semiBold"
        >
          {t('landing:appFeatures')}
        </Typography>
        <Typography
          variant={isMobile ? 'text' : 'title'}
          size={onlyTablet ? 'regular' : 'large'}
          fontWeight="semiBold"
          style={styles.subHeading}
        >
          {t('landing:appFeatureTitle')}
        </Typography>
      </View>

      <View style={styles.selectionPicker}>
        <SelectionPicker
          data={[
            { title: t('landing:homeOwner'), value: 0 },
            { title: t('landing:tenantBuyer'), value: 1 },
          ]}
          selectedItem={[selectedTab]}
          onValueChange={onTabChange}
          itemWidth={isMobile ? 140 : 175}
          containerStyles={styles.pickerContainer}
          primary={false}
        />
      </View>
      {(isOwner || isMobile || isTablet) && (
        <View style={styles.body}>
          <FeatureCard onDataPress={relativeImage} isOwner={isOwner} />
          <MobileImage relativeImage={image} isOwner={isOwner} />
        </View>
      )}
      {!isOwner && !isMobile && !isTablet && (
        <View style={styles.body}>
          <MobileImage relativeImage={image} isOwner={isOwner} />
          <FeatureCard onDataPress={relativeImage} isOwner={isOwner} />
        </View>
      )}
    </View>
  );
};

interface IContainerStyle {
  containers: ViewStyle;
  content: ViewStyle;
  title: ViewStyle;
  subHeading: ViewStyle;
  body: ViewStyle;
  buttonContainer: ViewStyle;
  pickerContainer: ViewStyle;
  selectionPicker: ViewStyle;
}

const containerStyles = (isMobile: boolean): StyleSheet.NamedStyles<IContainerStyle> =>
  StyleSheet.create<IContainerStyle>({
    containers: {
      backgroundColor: theme.colors.grey5,
    },
    content: {
      alignItems: 'center',
      justifyContent: 'flex-start',
      marginHorizontal: '10%',
      marginBottom: 40,
    },
    title: {
      color: theme.colors.lightGreen,
      marginTop: 100,
    },
    subHeading: {
      marginTop: 21,
      marginBottom: 20,
      textAlign: 'center',
      color: theme.colors.darkTint2,
    },
    body: {
      top: 58,
      marginBottom: isMobile ? '5%' : '15%',
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonContainer: {
      width: isMobile ? 140 : 'fit-content',
    },
    pickerContainer: {
      height: 54,
    },
    selectionPicker: { justifyContent: 'center', alignItems: 'center' },
  });

export default AppFeatures;
