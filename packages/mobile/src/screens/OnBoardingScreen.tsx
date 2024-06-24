import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { withTranslation, WithTranslation } from 'react-i18next';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { UserActions } from '@homzhub/common/src/modules/user/actions';
import { CommonRepository } from '@homzhub/common/src/domain/repositories/CommonRepository';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { GuestStackNavigatorParamList } from '@homzhub/mobile/src/navigation/GuestStack';
import { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { StatusBar } from '@homzhub/mobile/src/components/atoms/StatusBar';
import { SVGUri } from '@homzhub/common/src/components/atoms/Svg';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import { PaginationComponent, SnapCarousel } from '@homzhub/mobile/src/components';
import { BottomSheet } from '@homzhub/common/src/components/molecules/BottomSheet';
import { OnBoarding } from '@homzhub/common/src/domain/models/OnBoarding';
import { User, UserType } from '@homzhub/common/src/constants/OnBoarding';

interface IDispatchProps {
  updateOnBoarding: (isOnBoardingCompleted: boolean) => void;
  setAddPropertyFlow: (payload: boolean) => void;
}

interface IOnBoardingScreenState {
  activeSlide: number;
  data: OnBoarding[];
  isSheetVisible: boolean;
  selectedType: string;
  message: string;
}

type libraryProps = WithTranslation & NavigationScreenProps<GuestStackNavigatorParamList, ScreensKeys.OnBoarding>;
type Props = IDispatchProps & libraryProps;

export class OnBoardingScreen extends React.PureComponent<Props, IOnBoardingScreenState> {
  public state = {
    activeSlide: 0,
    data: [],
    isSheetVisible: false,
    selectedType: '',
    message: '',
  };

  public componentDidMount = async (): Promise<void> => {
    await this.getOnBoardingData();
  };

  public render(): React.ReactNode {
    const { t } = this.props;
    const { data, activeSlide, isSheetVisible, selectedType, message } = this.state;

    if (data.length === 0) {
      return null;
    }

    const currentSlide: OnBoarding = data[activeSlide];
    return (
      <>
        <StatusBar barStyle="dark-content" statusBarBackground={theme.colors.white} />
        <SafeAreaView style={styles.container}>
          <View style={styles.flexOne}>
            <Text type="small" textType="bold" style={styles.skip} onPress={this.handleSkip}>
              {t('login')}
            </Text>
            <View style={styles.textContainer}>
              <Text type="large" textType="bold" style={styles.title}>
                {currentSlide.title}
              </Text>
              <Text type="small" textType="regular" style={styles.description}>
                {currentSlide.description}
              </Text>
            </View>
            <SnapCarousel
              carouselData={data}
              carouselItem={this.renderCarouselItem}
              activeIndex={activeSlide}
              onSnapToItem={this.onSnapToItem}
              itemWidth={theme.viewport.width - 30}
              contentStyle={styles.imageView}
            />
            <PaginationComponent
              dotsLength={data.length}
              activeSlide={activeSlide}
              activeDotStyle={styles.activeDot}
              inactiveDotStyle={styles.inactiveDot}
            />
            <Text type="regular" textType="semiBold" style={styles.heading}>
              {t('wantTo')}
            </Text>
            <Button
              type="primary"
              title={t('property:addProperty')}
              icon={icons.plus}
              iconSize={26}
              iconColor={theme.colors.white}
              onPress={this.onAddProperty}
              containerStyle={styles.button}
              titleStyle={styles.buttonTitle}
              testID="btnAddProperty"
            />
            <Button
              type="secondary"
              title={t('property:searchProperty')}
              icon={icons.search}
              iconSize={20}
              iconColor={theme.colors.blue}
              titleStyle={styles.buttonTitle}
              onPress={this.searchProperty}
              containerStyle={styles.button}
              testID="btnSearchProperty"
            />
          </View>
          <BottomSheet visible={isSheetVisible} onCloseSheet={this.onCloseSheet} sheetHeight={500}>
            <>
              <Text type="regular" textType="semiBold" style={styles.sheetTitle}>
                {t('iAm')}
              </Text>
              <View style={styles.sheetContent}>
                {UserType.map((item) => {
                  const isSelected = selectedType === item.key;
                  return (
                    <Button
                      key={item.id}
                      type={isSelected ? 'primary' : 'secondary'}
                      fontType="regular"
                      title={t(item.name)}
                      icon={item.icon}
                      iconSize={24}
                      iconColor={isSelected ? theme.colors.white : theme.colors.darkTint3}
                      titleStyle={[
                        styles.selectionButton,
                        { color: isSelected ? theme.colors.white : theme.colors.darkTint2 },
                      ]}
                      onPress={(): void => this.onSelectType(item.key)}
                      containerStyle={styles.buttonContainer}
                      testID="btnSelect"
                    />
                  );
                })}
              </View>
              {!!message && (
                <Text type="small" textType="regular" style={styles.message}>
                  {message}
                </Text>
              )}
              <Button
                type="primary"
                title={t('continue')}
                disabled={!selectedType || selectedType !== User.OWNER}
                onPress={this.onContinue}
                containerStyle={styles.continueBtn}
                testID="btnContinue"
              />
            </>
          </BottomSheet>
        </SafeAreaView>
      </>
    );
  }

  // TODO: Refactor
  private renderCarouselItem = (item: OnBoarding): React.ReactElement => {
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
        <SVGUri uri={item.imageUrl} height={height} width={imgWidth} />
      </View>
    );
  };

  private onSelectType = (key: User): void => {
    const { t } = this.props;
    let message = '';
    switch (key) {
      case User.OWNER:
        message = t('auth:clickToSignUp');
        break;
      case User.AGENT:
      case User.MANAGER:
        message = t('auth:appNotReady');
        break;
      default:
        message = '';
    }
    this.setState({
      selectedType: key,
      message,
    });
  };

  private onContinue = (): void => {
    const { selectedType } = this.state;
    const { navigation, setAddPropertyFlow } = this.props;
    if (selectedType === User.OWNER) {
      navigation.navigate(ScreensKeys.AuthStack, { screen: ScreensKeys.SignUp, params: {} });
      setAddPropertyFlow(true);
      this.onCloseSheet();
    }
  };

  private onAddProperty = (): void => {
    const { navigation, setAddPropertyFlow } = this.props;
    navigation.navigate(ScreensKeys.AuthStack, { screen: ScreensKeys.SignUp, params: {} });
    setAddPropertyFlow(true);
  };

  private onCloseSheet = (): void => {
    this.setState({
      isSheetVisible: false,
    });
  };

  private onSnapToItem = (slideNumber: number): void => {
    this.setState({ activeSlide: slideNumber });
  };

  private handleSkip = (): void => {
    const { navigation } = this.props;
    navigation.navigate(ScreensKeys.AuthStack, { screen: ScreensKeys.Login, params: {} });
  };

  private getOnBoardingData = async (): Promise<void> => {
    try {
      const response = await CommonRepository.getOnBoarding();
      this.setState({
        data: response,
      });
    } catch (error) {
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(error.details) });
    }
  };

  private searchProperty = (): void => {
    const { navigation } = this.props;
    navigation.navigate(ScreensKeys.SearchStack);
  };
}

const styles = StyleSheet.create({
  flexOne: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  textContainer: {
    paddingTop: 35,
    alignItems: 'center',
  },
  description: {
    textAlign: 'center',
    marginHorizontal: 10,
  },
  button: {
    flex: 0,
    marginHorizontal: 36,
    marginBottom: 10,
    flexDirection: 'row-reverse',
  },
  buttonContainer: {
    width: 90,
    flex: 0,
    marginRight: 10,
    marginBottom: 10,
    paddingVertical: 15,
    borderColor: theme.colors.disabled,
    flexDirection: 'column-reverse',
  },
  activeDot: {
    width: 16,
    backgroundColor: theme.colors.blue,
    borderColor: theme.colors.blue,
  },
  inactiveDot: {
    backgroundColor: theme.colors.darkTint9,
    borderColor: theme.colors.darkTint9,
    borderRadius: 5,
    width: 10,
    height: 10,
  },
  title: {
    color: theme.colors.blackTint1,
    padding: 10,
    fontSize: 24,
    textAlign: 'center',
    lineHeight: 28,
  },
  heading: {
    color: theme.colors.darkTint3,
    alignSelf: 'center',
    paddingBottom: 16,
  },
  buttonTitle: {
    marginHorizontal: 12,
  },
  sheetTitle: {
    textAlign: 'center',
    marginBottom: 20,
  },
  sheetContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 50,
    marginHorizontal: 20,
  },
  selectionButton: {
    marginHorizontal: 0,
    width: 100,
  },
  message: {
    textAlign: 'center',
    color: theme.colors.darkTint5,
    marginBottom: 8,
    paddingHorizontal: 10,
  },
  continueBtn: {
    flex: 0,
    justifyContent: 'center',
    marginHorizontal: 30,
    height: 50,
  },
  skip: {
    color: theme.colors.blue,
    alignSelf: 'flex-end',
    marginHorizontal: 20,
  },
  imageView: {
    alignItems: 'center',
    marginTop: 10,
  },
});

export const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { updateOnBoarding, setAddPropertyFlow } = UserActions;
  return bindActionCreators(
    {
      updateOnBoarding,
      setAddPropertyFlow,
    },
    dispatch
  );
};

export default connect(null, mapDispatchToProps)(withTranslation()(OnBoardingScreen));
