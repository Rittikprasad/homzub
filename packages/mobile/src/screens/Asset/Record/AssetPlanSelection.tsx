import React, { ReactElement } from 'react';
import { View, StyleSheet } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { CommonParamList } from '@homzhub/mobile/src/navigation/Common';
import { PortfolioActions } from '@homzhub/common/src/modules/portfolio/actions';
import { RecordAssetActions } from '@homzhub/common/src/modules/recordAsset/actions';
import { RecordAssetSelectors } from '@homzhub/common/src/modules/recordAsset/selectors';
import { DashboardRepository } from '@homzhub/common/src/domain/repositories/DashboardRepository';
import { theme } from '@homzhub/common/src/styles/theme';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { SVGUri } from '@homzhub/common/src/components/atoms/Svg';
import { PaginationComponent, SnapCarousel } from '@homzhub/mobile/src/components';
import PlanSelection from '@homzhub/common/src/components/organisms/PlanSelection';
import { Screen } from '@homzhub/mobile/src/components/HOC/Screen';
import { AssetAdvertisement, AssetAdvertisementResults } from '@homzhub/common/src/domain/models/AssetAdvertisement';
import { AssetPlan, ISelectedAssetPlan, TypeOfPlan } from '@homzhub/common/src/domain/models/AssetPlan';
import { ISetAssetPayload } from '@homzhub/common/src/modules/portfolio/interfaces';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

interface IDispatchProps {
  getAssetPlanList: () => void;
  setSelectedPlan: (payload: ISelectedAssetPlan) => void;
  resetState: () => void;
  setCurrentAsset: (payload: ISetAssetPayload) => void;
}

interface IStateProps {
  assetPlan: AssetPlan[];
  assetId: number;
}

type OwnProps = WithTranslation & NavigationScreenProps<CommonParamList, ScreensKeys.AssetPlanSelection>;
type Props = OwnProps & IDispatchProps & IStateProps;

interface IAssetPlanState {
  banners: AssetAdvertisement;
  activeSlide: number;
  loading: boolean;
}

class AssetPlanSelection extends React.PureComponent<Props, IAssetPlanState> {
  public state = {
    banners: {} as AssetAdvertisement,
    activeSlide: 0,
    loading: false,
  };

  public componentDidMount = async (): Promise<void> => {
    await this.getAssetAdvertisements();
  };

  public render(): React.ReactElement {
    const {
      t,
      route: { params },
    } = this.props;
    const { loading } = this.state;
    return (
      <>
        <Screen headerProps={{ title: t('nextSteps'), onIconPress: this.goBack }} isLoading={loading}>
          <PlanSelection
            carouselView={this.renderCarousel()}
            onSkip={this.onSkip}
            onSelectPlan={this.onSelectPlan}
            isSubLeased={params?.isSubleased}
          />
        </Screen>
      </>
    );
  }

  private renderCarousel = (): React.ReactElement => {
    return <View style={styles.carouselContainer}>{this.renderAdvertisements()}</View>;
  };

  public renderAdvertisements = (): React.ReactNode => {
    const { banners, activeSlide } = this.state;
    if (!banners) {
      return null;
    }
    return (
      <>
        <SnapCarousel
          carouselData={banners?.results ?? []}
          carouselItem={this.renderCarouselItem}
          itemWidth={theme.viewport.width}
          activeIndex={activeSlide}
          onSnapToItem={this.onSnapToItem}
        />
        <PaginationComponent
          dotsLength={banners?.results?.length ?? 0}
          activeSlide={activeSlide}
          activeDotStyle={styles.activeDotStyle}
          inactiveDotStyle={styles.inactiveDotStyle}
        />
      </>
    );
  };

  private renderCarouselItem = (item: AssetAdvertisementResults): React.ReactElement => {
    return <SVGUri uri={item.attachment.link} />;
  };

  public onSnapToItem = (slideNumber: number): void => {
    this.setState({ activeSlide: slideNumber });
  };

  private onSkip = (): void => {
    const {
      navigation,
      resetState,
      route: { params },
    } = this.props;
    resetState();
    if (params?.isFromPortfolioList) {
      navigation.goBack();
      return;
    }
    // @ts-ignore
    navigation.navigate(ScreensKeys.BottomTabs, {
      screen: ScreensKeys.Portfolio,
      params: { screen: ScreensKeys.PropertyDetailScreen, initial: false },
    });
  };

  private onSelectPlan = (): void => {
    const {
      navigation,
      route: { params },
    } = this.props;

    // @ts-ignore
    navigation.navigate(ScreensKeys.PropertyPostStack, {
      screen: ScreensKeys.AssetListing,
      params: {
        leaseUnit: params?.leaseUnit,
        startDate: params?.startDate,
      },
    });
  };

  public getPlanName = (name: string): string => {
    const { t } = this.props;
    switch (name) {
      case TypeOfPlan.RENT:
        return t('rent');
      case TypeOfPlan.SELL:
        return t('sell');
      default:
        return t('inviteTenant');
    }
  };

  private goBack = (): void => {
    const { navigation } = this.props;
    navigation.goBack();
  };

  public getAssetAdvertisements = async (): Promise<void> => {
    const requestPayload = {
      category: 'service',
    };
    try {
      this.toggleLoader();
      const response: AssetAdvertisement = await DashboardRepository.getAdvertisements(requestPayload);
      this.setState({ banners: response });
      this.toggleLoader();
    } catch (e) {
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.message) });
      this.toggleLoader();
    }
  };

  private toggleLoader = (): void => this.setState((prevState) => ({ loading: !prevState.loading }));
}

const mapStateToProps = (state: IState): IStateProps => {
  const { getAssetPlans, getCurrentAssetId } = RecordAssetSelectors;
  return {
    assetPlan: getAssetPlans(state),
    assetId: getCurrentAssetId(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { getAssetPlanList, setSelectedPlan, resetState } = RecordAssetActions;
  const { setCurrentAsset } = PortfolioActions;
  return bindActionCreators(
    {
      getAssetPlanList,
      setSelectedPlan,
      resetState,
      setCurrentAsset,
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation(LocaleConstants.namespacesKey.property)(AssetPlanSelection));

const styles = StyleSheet.create({
  carouselContainer: {
    height: 350,
    backgroundColor: theme.colors.white,
  },
  activeDotStyle: {
    width: 18,
    height: 10,
    borderRadius: 7,
    backgroundColor: theme.colors.primaryColor,
  },
  inactiveDotStyle: {
    ...(theme.circleCSS(16) as object),
    backgroundColor: theme.colors.darkTint9,
    borderColor: theme.colors.transparent,
  },
});
