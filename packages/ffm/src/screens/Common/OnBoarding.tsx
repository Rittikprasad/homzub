import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { I18nService } from '@homzhub/common/src/services/Localization/i18nextService';
import { FFMActions } from '@homzhub/common/src/modules/ffm/actions';
import { FFMSelector } from '@homzhub/common/src/modules/ffm/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import { SnapCarousel } from '@homzhub/mobile/src/components/atoms/Carousel';
import { StatusBar } from '@homzhub/mobile/src/components/atoms/StatusBar';
import { SVGUri } from '@homzhub/common/src/components/atoms/Svg';
import { Label, Text } from '@homzhub/common/src/components/atoms/Text';
import { OnBoarding as OnBoardingModel } from '@homzhub/common/src/domain/models/OnBoarding';
import { Unit } from '@homzhub/common/src/domain/models/Unit';
import { ScreenKeys } from '@homzhub/ffm/src/navigation/interfaces';

const OnBoarding = (route: { route: object }): React.ReactElement => {
  // console.log('🚀 ~ file: OnBoarding.tsx ~ line 19 ~ props', route.route);
  const dispatch = useDispatch();
  const { navigate, replace } = useNavigation();
  const onBoardingData = useSelector(FFMSelector.getOnBoardingData);
  const roles = useSelector(FFMSelector.getRoles);
  const loaders = useSelector(FFMSelector.getFFMLoaders);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    getScreenData();
  }, []);

  const getScreenData = (): void => {
    dispatch(FFMActions.getOnBoardingData());
    dispatch(FFMActions.getRoles());
  };

  const renderCarousel = (carouselItem: OnBoardingModel): React.ReactElement => {
    const {
      viewport: { width, height: viewportHeight },
      DeviceDimensions: { SMALL, MEDIUM },
    } = theme;
    /* eslint-disable */
    const height =
      width > SMALL.width
        ? width > MEDIUM.width
          ? PlatformUtils.isIOS()
            ? 450
            : viewportHeight / 2.5
          : width === MEDIUM.width
          ? 280
          : 220
        : 150;
    /* eslint-enable */
    const imgWidth = width > SMALL.width ? (width > MEDIUM.width ? 320 : width === MEDIUM.width ? 350 : 330) : 280;
    return (
      <View style={styles.imageView}>
        <SVGUri uri={carouselItem.imageUrl} height={height} width={imgWidth} />
      </View>
    );
  };

  const onPressRole = (role: Unit): void => {
    dispatch(FFMActions.setSelectedRole(role));
    if (typeof route.route.params == 'undefined') {
      navigate(ScreenKeys.Signup);
    } else {
      replace(ScreenKeys.WorkLocations);
    }
  };

  const onPressLogin = (): void => {
    navigate(ScreenKeys.Login);
  };

  const onSnapToItem = (slideNumber: number): void => {
    setActiveSlide(slideNumber);
  };

  const currentSlide: OnBoardingModel = onBoardingData[activeSlide];

  return (
    <>
      <StatusBar barStyle="dark-content" statusBarBackground={theme.colors.white} />
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text type="large" textType="bold" style={styles.title}>
            {currentSlide?.title}
          </Text>
          {onBoardingData.length > 0 && (
            <SnapCarousel
              carouselData={onBoardingData}
              carouselItem={renderCarousel}
              activeIndex={activeSlide}
              onSnapToItem={onSnapToItem}
              itemWidth={theme.viewport.width - 30}
              contentStyle={styles.imageView}
            />
          )}
          <Text type="large" textType="bold" style={styles.title}>
            {I18nService.t('iam')}
          </Text>
          <View style={styles.roleView}>
            {roles.length > 0 &&
              roles.map((item, index) => (
                <TouchableOpacity key={index} style={styles.roleContent} onPress={(): void => onPressRole(item)}>
                  <SVGUri uri={item.iconUrl} height={40} width={40} stroke={theme.colors.active} strokeWidth={0.4} />
                  <Label type="regular" textType="semiBold" style={styles.role}>
                    {item.name}
                  </Label>
                </TouchableOpacity>
              ))}
          </View>

          {typeof route.route.params == 'undefined' && (
            <Label type="large" textType="regular" style={styles.helpText}>
              {`${I18nService.t('alreadyAccount')}  `}
              <Label type="large" textType="bold" style={styles.login} onPress={onPressLogin}>
                {I18nService.t('login')}
              </Label>
            </Label>
          )}
        </View>
      </SafeAreaView>
    </>
  );
};

export default OnBoarding;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  content: {
    marginVertical: 60,
  },
  title: {
    textAlign: 'center',
    color: theme.colors.blackTint1,
  },
  imageView: {
    alignSelf: 'center',
    marginVertical: PlatformUtils.isAndroid() ? 20 : 0,
  },
  roleView: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    margin: 40,
  },
  roleContent: {
    alignItems: 'center',
  },
  role: {
    textAlign: 'center',
    marginVertical: 6,
    color: theme.colors.gray15,
  },
  helpText: {
    textAlign: 'center',
    color: theme.colors.darkTint3,
  },
  login: {
    textAlign: 'center',
    marginVertical: 6,
    color: theme.colors.primaryColor,
  },
});
