import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { PortfolioRepository } from '@homzhub/common/src/domain/repositories/PortfolioRepository';
import { CommonParamList } from '@homzhub/mobile/src/navigation/Common';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import Logo from '@homzhub/common/src/assets/images/homzhubLogo.svg';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { SVGUri } from '@homzhub/common/src/components/atoms/Svg';
import { Text, Label } from '@homzhub/common/src/components/atoms/Text';
import { AssetMetrics } from '@homzhub/common/src/domain/models/AssetMetrics';
import { UserProfile } from '@homzhub/common/src/domain/models/UserProfile';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

interface IStateProps {
  user: UserProfile | null;
}

interface IOwnState {
  assetCount: number;
}

type libraryProps = WithTranslation & NavigationScreenProps<CommonParamList, ScreensKeys.LandingScreen>;
type Props = IStateProps & libraryProps;
const IMAGE = 'https://homzhub-bucket.s3.amazonaws.com/Group+1168.svg';

class LandingScreen extends React.PureComponent<Props, IOwnState> {
  public focusListener: any;

  public state = {
    assetCount: 0,
  };

  public componentDidMount = (): void => {
    const { navigation } = this.props;
    this.focusListener = navigation.addListener('focus', () => {
      this.getAssetCount().then();
    });
  };

  public render(): React.ReactNode {
    const { t, user } = this.props;
    const { assetCount } = this.state;
    const description = assetCount > 0 ? t('addYourProperty') : t('description');
    return (
      <>
        <SafeAreaView style={styles.container}>
          <View style={styles.contentContainer}>
            <Logo width={60} height={60} style={styles.logo} />
            <Text type="large" textType="semiBold" style={styles.title}>
              {t('welcomeUser', { username: user?.fullName })}
            </Text>
            <Text type="regular" textType="regular" style={styles.description}>
              {description}
            </Text>
            <View style={styles.imageContainer}>
              <SVGUri preserveAspectRatio="xMidYMid meet" uri={IMAGE} />
            </View>
            <Label type="large" textType="regular" style={styles.label}>
              {t('searchProject')}
            </Label>
            <Button
              title={t('addProperty')}
              type="primary"
              onPress={this.onAddProperty}
              containerStyle={styles.addProperty}
              testID="btnAddProperty"
            />
            <Button
              title={t('assetDashboard:dashboard')}
              type="primary"
              onPress={this.onDashboard}
              containerStyle={styles.addProperty}
              testID="btnDashboard"
            />
          </View>
        </SafeAreaView>
      </>
    );
  }

  private onAddProperty = (): void => {
    const { navigation } = this.props;
    // @ts-ignore
    navigation.navigate(ScreensKeys.PropertyPostStack, { screen: ScreensKeys.AssetLocationSearch });
  };

  private onDashboard = (): void => {
    const { navigation } = this.props;
    // @ts-ignore
    navigation.navigate(ScreensKeys.BottomTabs);
  };

  private getAssetCount = async (): Promise<void> => {
    try {
      const response: AssetMetrics = await PortfolioRepository.getAssetMetrics();
      const {
        assetMetrics: { assets },
      } = response;
      this.setState({ assetCount: assets.count });
    }catch (e: any) {      const error = ErrorUtils.getErrorMessage(e.details);
      AlertHelper.error({ message: error });
    }
  };
}

export const mapStateToProps = (state: IState): IStateProps => {
  return {
    user: UserSelector.getUserProfile(state),
  };
};

export default connect<IStateProps, null, WithTranslation, IState>(
  mapStateToProps,
  null
)(withTranslation(LocaleConstants.namespacesKey.property)(LandingScreen));

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.blue,
    justifyContent: 'center',
  },
  contentContainer: {
    justifyContent: 'center',
    marginHorizontal: 16,
    paddingHorizontal: 24,
    paddingVertical: 40,
    borderRadius: 8,
    backgroundColor: theme.colors.white,
  },
  imageContainer: {
    alignSelf: 'center',
    width: 296,
    height: 132,
  },
  logo: {
    alignSelf: 'center',
    marginBottom: 24,
  },
  title: {
    textAlign: 'center',
  },
  description: {
    marginTop: 28,
    marginBottom: 36,
    textAlign: 'center',
    color: theme.colors.darkTint3,
  },
  label: {
    marginTop: 44,
    textAlign: 'center',
    color: theme.colors.darkTint4,
  },
  addProperty: {
    flex: 0,
    marginTop: 16,
  },
});
