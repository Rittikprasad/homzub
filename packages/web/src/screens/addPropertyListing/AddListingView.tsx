/* eslint-disable no-case-declarations */
import React, { ReactElement } from 'react';
import { LayoutChangeEvent, StyleSheet, View } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { TabView } from 'react-native-tab-view';
import { IWithMediaQuery, withMediaQuery } from '@homzhub/common/src/utils/MediaQueryUtils';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { NavigationService } from '@homzhub/web/src/services/NavigationService';
import { RecordAssetActions } from '@homzhub/common/src/modules/recordAsset/actions';
import { SearchActions } from '@homzhub/common/src/modules/search/actions';
import { RecordAssetSelectors } from '@homzhub/common/src/modules/recordAsset/selectors';
import { IListingUpdate, ListingService } from '@homzhub/common/src/services/Property/ListingService';
import { RouteNames } from '@homzhub/web/src/router/RouteNames';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { IWebProps } from '@homzhub/common/src/components/molecules/FormTextInput';
import PhoneCodePrefix from '@homzhub/web/src/components/molecules/PhoneCodePrefix';
import { SelectionPicker } from '@homzhub/common/src/components/atoms/SelectionPicker';
import { Label, Text } from '@homzhub/common/src/components/atoms/Text';
import { ActionController } from '@homzhub/common/src/components/organisms/ActionController';
import { AddressWithStepIndicator } from '@homzhub/common/src/components/molecules/AddressWithStepIndicator';
import PropertyVerification from '@homzhub/web/src/components/organisms/PropertyVerification';
import { PropertyPayment } from '@homzhub/common/src/components/organisms/PropertyPayment';
import { ValueAddedServicesView } from '@homzhub/common/src/components/organisms/ValueAddedServicesView';
import ContinuePopup, { IContinuePopupProps } from '@homzhub/web/src/components/molecules/ContinuePopup';
import { Asset, LeaseTypes } from '@homzhub/common/src/domain/models/Asset';
import { ISelectedAssetPlan, TypeOfPlan } from '@homzhub/common/src/domain/models/AssetPlan';
import { IFilter } from '@homzhub/common/src/domain/models/Search';
import { ISelectedValueServices, ValueAddedService } from '@homzhub/common/src/domain/models/ValueAddedService';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { IRoutes, ListingRoutes, ListingRoutesWeb, Tabs } from '@homzhub/common/src/constants/Tabs';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

interface IStateProps {
  selectedAssetPlan: ISelectedAssetPlan;
  assetDetails: Asset | null;
  valueAddedServices: ValueAddedService[];
}

interface IDispatchProps {
  resetState: () => void;
  getAssetById: () => void;
  setValueAddedServices: (payload: ISelectedValueServices) => void;
  getValueAddedServices: () => void;
  setAssetId: (id: number) => void;
  setFilter: (payload: IFilter) => void;
}

interface IProps {
  params?: any;
  onUploadDocument: () => any;
  isDesktop?: boolean;
  history: any; //  TODO Discuss with Shikha.
}

type Props = WithTranslation & IStateProps & IDispatchProps & IProps & IWithMediaQuery;

interface IOwnState {
  currentIndex: number;
  isStepDone: boolean[];
  isActionSheetToggled: boolean;
  leaseType: LeaseTypes;
  isSheetVisible: boolean;
  isNextStep: boolean;
  tabViewHeights: number[];
}

const { height } = theme.viewport;

class AddListingView extends React.PureComponent<Props, IOwnState> {
  public state = {
    currentIndex: 0,
    isStepDone: [],
    tabViewHeights: [height, height, height, height],
    isActionSheetToggled: false,
    leaseType: LeaseTypes.Entire,
    isSheetVisible: false,
    isNextStep: false,
  };

  public static getDerivedStateFromProps(props: Props, state: IOwnState): IOwnState | null {
    const { assetDetails, params } = props;
    const { isNextStep } = state;
    if (assetDetails) {
      const {
        isVerificationRequired,
        isPropertyReady,
        listing: { stepList },
      } = assetDetails.lastVisitedStep;

      if (!isNextStep && isVerificationRequired) {
        return {
          ...state,
          currentIndex: 1,
          isStepDone: stepList,
        };
      }

      if (!isNextStep && isPropertyReady && params && params.isEditFlow) {
        return {
          ...state,
          currentIndex: 0,
          isStepDone: stepList,
        };
      }
    }

    return null;
  }

  public componentDidMount = (): void => {
    const { getAssetById, getValueAddedServices, assetDetails } = this.props;
    if (assetDetails) {
      this.setState({ leaseType: assetDetails.assetLeaseType });
      getValueAddedServices();
    } else {
      getAssetById();
    }
  };

  public componentDidUpdate = (prevProps: Readonly<Props>, prevState: Readonly<IOwnState>): void => {
    const { assetDetails, getValueAddedServices } = this.props;
    if (!prevProps.assetDetails && assetDetails) {
      getValueAddedServices();
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ leaseType: assetDetails.assetLeaseType });
    }
  };

  public componentWillUnmount = (): void => {
    const { resetState } = this.props;
    resetState();
  };

  public render(): React.ReactNode {
    const { currentIndex, isStepDone, isSheetVisible, tabViewHeights } = this.state;
    const {
      selectedAssetPlan: { selectedPlan },
      assetDetails,
      isDesktop,
    } = this.props;

    if (!assetDetails) return null;
    const {
      projectName,
      assetType: { name },
      address,
      country: { flag },
    } = assetDetails;

    const steps = this.getRoutes().map((route) => route.title);
    const checkServicesTab = (): boolean => {
      if (currentIndex > 3) return false;

      const { key } = this.getRoutes()[currentIndex];
      if (Tabs.SERVICE_PAYMENT === key) {
        return true;
      }
      return false;
    };
    return (
      <>
        <AddressWithStepIndicator
          steps={steps}
          selectedPan={selectedPlan}
          badgeStyle={styles.badgeStyle}
          propertyType={name}
          countryFlag={flag}
          primaryAddress={projectName}
          subAddress={address}
          currentIndex={currentIndex}
          isStepDone={isStepDone}
          onPressSteps={this.handlePreviousStep}
        />
        {this.renderTabHeader()}
        <TabView
          lazy
          renderScene={this.renderScene}
          onIndexChange={this.handleIndexChange}
          renderTabBar={(): null => null}
          swipeEnabled={false}
          navigationState={{
            index: currentIndex,
            routes: this.getRoutes(),
          }}
          style={{ height: isDesktop && checkServicesTab() ? 'auto' : tabViewHeights[currentIndex] }}
        />
        <ContinuePopup
          isSvg
          isOpen={isSheetVisible}
          {...this.renderContinueView(assetDetails)}
          onContinueRoute={RouteNames.protectedRoutes.DASHBOARD}
        />
      </>
    );
  }

  private renderContinueView = (assetDetails: Asset): IContinuePopupProps => {
    const { t } = this.props;
    const {
      lastVisitedStep: {
        isVerificationRequired,
        listing: { type },
      },
    } = assetDetails;

    const isReadyToPreview = type !== TypeOfPlan.MANAGE && !isVerificationRequired;
    const title = isReadyToPreview ? t('previewOwnProperty') : t('clickContinueToDashboard');

    const popupDetails = {
      title: t('common:congratulations'),
      subTitle: t('paymentSuccessMsg'),
      buttonSubText: title,
      buttonTitle: t('common:continue'),
    };
    return popupDetails;
  };

  public renderTabHeader = (): ReactElement => {
    const {
      t,
      selectedAssetPlan: { selectedPlan },
      isMobile,
      isTablet,
      isIpadPro,
    } = this.props;
    const { currentIndex, leaseType, isActionSheetToggled } = this.state;
    const { key, title } = this.getRoutes()[currentIndex];
    const toggleActionSheet = (): void => this.setState({ isActionSheetToggled: !isActionSheetToggled });

    return (
      <>
        {key === Tabs.ACTIONS && (
          <View style={[styles.tabHeader, isMobile && styles.tabHeaderMobile]}>
            {selectedPlan === TypeOfPlan.RENT && (
              <View
                style={[
                  PlatformUtils.isWeb() && isMobile && styles.switchTabContainer,
                  PlatformUtils.isWeb() && !isMobile && !isTablet && styles.switchTabContainerWeb,
                  PlatformUtils.isWeb() && isTablet && !isMobile && styles.switchTabContainerTab,
                ]}
              >
                <SelectionPicker
                  data={[
                    { title: t(LeaseTypes.Entire), value: LeaseTypes.Entire },
                    { title: t(LeaseTypes.Shared), value: LeaseTypes.Shared },
                  ]}
                  selectedItem={[leaseType]}
                  containerStyles={[styles.switchTab, PlatformUtils.isWeb() && isMobile && styles.switchTabMobile]}
                  onValueChange={this.onTabChange}
                />
              </View>
            )}
            <View style={[styles.tabRows, isMobile && styles.tabRowsMobile]}>
              <Text type="small" textType="semiBold">
                {title}
              </Text>
              <View style={[styles.tooltip, isMobile && styles.tooltipMobile]}>
                <Icon name={icons.tooltip} color={theme.colors.blue} size={26} onPress={toggleActionSheet} />
              </View>
            </View>
          </View>
        )}

        {[Tabs.VERIFICATIONS, Tabs.SERVICES, Tabs.SERVICE_PAYMENT].includes(key) && (
          <View style={styles.tabHeaderVerification}>
            <View style={[styles.verification]}>
              <Text type="small" textType="semiBold">
                {title === 'Service & Payment' || title === 'Services' || title === 'Payment'
                  ? [t('assetMore:premiumServices'), ' ', t('assetMore:optional')]
                  : title}
              </Text>
              <Text type="small" textType="semiBold" style={styles.skip} onPress={this.handleSkip}>
                {t('common:skip')}
              </Text>
            </View>

            {(isTablet || isIpadPro) && key === Tabs.VERIFICATIONS && (
              <>
                <Label type="regular" textType="regular" style={styles.verificationSubtitle}>
                  {t('propertyVerificationSubTitle')}
                </Label>
                <Label type="large" textType="semiBold" style={styles.helperText}>
                  {t('helperNavigationText')}
                </Label>
              </>
            )}
          </View>
        )}
      </>
    );
  };

  private renderScene = ({ route }: { route: IRoutes }): React.ReactNode => {
    const { leaseType } = this.state;
    const {
      selectedAssetPlan: { selectedPlan },
      assetDetails,
      setValueAddedServices,
      valueAddedServices,
      onUploadDocument,
    } = this.props;
    if (!assetDetails) return null;
    const handleWebView = (params: IWebProps): React.ReactElement => {
      return <PhoneCodePrefix {...params} />;
    };
    switch (route.key) {
      case Tabs.VERIFICATIONS:
        return (
          <View onLayout={(e): void => this.onLayout(e, 1)}>
            <PropertyVerification
              propertyId={assetDetails.id}
              typeOfPlan={selectedPlan}
              updateStep={this.handleNextStep}
              lastVisitedStep={assetDetails.lastVisitedStepSerialized}
              onUploadDocument={onUploadDocument}
              handleNextStep={this.handleSkip}
            />
          </View>
        );
      case Tabs.SERVICE_PAYMENT:
        const { isDesktop } = this.props;
        return (
          <View style={styles.service}>
            <View style={styles.servicesAlignment}>
              <ValueAddedServicesView
                isDesktop={isDesktop}
                propertyId={assetDetails.id}
                lastVisitedStep={assetDetails.lastVisitedStepSerialized}
                valueAddedServices={valueAddedServices}
                setValueAddedServices={setValueAddedServices}
                typeOfPlan={selectedPlan}
                handleNextStep={this.handleNextStep}
              />
            </View>
            <PropertyPayment
              propertyId={assetDetails.id}
              lastVisitedStep={assetDetails.lastVisitedStepSerialized}
              valueAddedServices={valueAddedServices}
              setValueAddedServices={setValueAddedServices}
              typeOfPlan={selectedPlan}
              handleNextStep={this.handleNextStep}
            />
          </View>
        );
      case Tabs.SERVICES:
        const { isMobile, isTablet } = this.props;
        return (
          <ValueAddedServicesView
            isMobile={isMobile}
            isTablet={isTablet}
            propertyId={assetDetails.id}
            lastVisitedStep={assetDetails.lastVisitedStepSerialized}
            valueAddedServices={valueAddedServices}
            setValueAddedServices={setValueAddedServices}
            typeOfPlan={selectedPlan}
            handleNextStep={this.handleNextStep}
          />
        );
      case Tabs.PAYMENT:
        return (
          <PropertyPayment
            propertyId={assetDetails.id}
            lastVisitedStep={assetDetails.lastVisitedStepSerialized}
            valueAddedServices={valueAddedServices}
            setValueAddedServices={setValueAddedServices}
            typeOfPlan={selectedPlan}
            handleNextStep={this.handleNextStep}
          />
        );
      default:
        return (
          <View onLayout={(e): void => this.onLayout(e, 0)}>
            <ActionController
              assetDetails={assetDetails}
              typeOfPlan={selectedPlan}
              leaseType={leaseType}
              onNextStep={this.handleNextStep}
              scrollToTop={this.scrollToTop}
              onLeaseTypeChange={this.onTabChange}
              webGroupPrefix={handleWebView}
            />
          </View>
        );
    }
  };

  private onTabChange = (leaseType: LeaseTypes): void => {
    this.setState({ leaseType });
  };

  private onLayout = (e: LayoutChangeEvent, index: number): void => {
    const { tabViewHeights } = this.state;
    const { height: newHeight } = e.nativeEvent.layout;
    const arrayToUpdate = [...tabViewHeights];

    if (newHeight !== arrayToUpdate[index]) {
      arrayToUpdate[index] = newHeight;
      this.setState({ tabViewHeights: arrayToUpdate });
    }
  };

  public getRoutes = (): IRoutes[] => {
    const {
      selectedAssetPlan: { selectedPlan },
      isDesktop,
    } = this.props;
    const routes = isDesktop ? ListingRoutesWeb : ListingRoutes;

    if (selectedPlan !== TypeOfPlan.MANAGE) {
      return routes;
    }
    return routes.filter((route) => route.key !== Tabs.VERIFICATIONS);
  };

  private handleIndexChange = (index: number): void => {
    this.setState({ currentIndex: index });
    this.scrollToTop();
  };

  private handlePreviousStep = (index: number): void => {
    const { currentIndex } = this.state;
    const value = index - currentIndex;
    if (index < currentIndex) {
      this.setState({ currentIndex: currentIndex + value, isNextStep: true });
      this.scrollToTop();
    }
  };

  private handleContinue = (): void => {
    const { resetState, assetDetails } = this.props;
    this.setState({ isSheetVisible: false });
    const { currentIndex } = this.state;
    resetState();

    if (assetDetails) {
      const {
        lastVisitedStep: {
          isPropertyReady,
          listing: { type },
        },
      } = assetDetails;
      if (isPropertyReady && type !== TypeOfPlan.MANAGE) {
        // TODO: Add Preview Logic
        this.setState({ currentIndex: currentIndex + 1, isNextStep: true });
      } else {
        this.navigateToDashboard();
      }
    }
  };

  private handleNextStep = (): void => {
    const { currentIndex, isStepDone, isSheetVisible, isNextStep } = this.state;
    const { assetDetails, getAssetById } = this.props;
    ListingService.handleListingStep({
      currentIndex,
      isStepDone,
      getAssetById,
      assetDetails,
      isSheetVisible,
      isNextStep,
      scrollToTop: this.scrollToTop,
      routes: this.getRoutes(),
      updateState: this.updateState,
    });
  };

  private updateState = (data: IListingUpdate): void => {
    const { isNextStep, isSheetVisible, currentIndex, isStepDone } = data;
    this.setState((prevState) => ({
      ...prevState,
      ...(currentIndex && { currentIndex }),
      ...(isStepDone && { isStepDone }),
      isNextStep: isNextStep ?? false,
      isSheetVisible: isSheetVisible || false,
    }));
  };

  public handleSkip = (): void => {
    const { assetDetails, isDesktop } = this.props;
    const { currentIndex } = this.state;

    if (assetDetails && assetDetails.lastVisitedStep.isPropertyReady) {
      if (assetDetails.lastVisitedStep.listing.type !== TypeOfPlan.MANAGE) {
        this.navigateToDashboard();
      } else {
        this.navigateToDashboard();
      }
    } else if (currentIndex < this.getRoutes().length) {
      if (isDesktop && currentIndex === 2) {
        this.navigateToDashboard();
        return;
      }
      if (!isDesktop && currentIndex === 3) {
        this.navigateToDashboard();
        return;
      }
      if (this.getRoutes().length === 2 && currentIndex === 1) {
        this.navigateToDashboard();
        return;
      }
      this.setState({ currentIndex: currentIndex + 1, isNextStep: true });
      this.scrollToTop();
    } else {
      this.navigateToDashboard();
    }
  };

  private navigateToDashboard = (): void => {
    const { resetState, history } = this.props;
    resetState();
    NavigationService.navigate(history, { path: RouteNames.protectedRoutes.DASHBOARD });
  };

  private scrollToTop = (): void => {
    setTimeout(() => {
      if (PlatformUtils.isWeb()) {
        window.scrollTo(0, 0);
      }
    }, 100);
  };
}
const addListingView = withMediaQuery<Props>(AddListingView);

const mapStateToProps = (state: IState): IStateProps => {
  const { getSelectedAssetPlan, getAssetDetails, getValueAddedServices } = RecordAssetSelectors;
  return {
    selectedAssetPlan: getSelectedAssetPlan(state),
    assetDetails: getAssetDetails(state),
    valueAddedServices: getValueAddedServices(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { resetState, getAssetById, setValueAddedServices, getValueAddedServices, setAssetId } = RecordAssetActions;
  const { setFilter } = SearchActions;
  return bindActionCreators(
    {
      resetState,
      getAssetById,
      setValueAddedServices,
      getValueAddedServices,
      setFilter,
      setAssetId,
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation(LocaleConstants.namespacesKey.property)(addListingView));

const styles = StyleSheet.create({
  flexOne: {
    flex: 1,
  },
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  tabHeader: {
    paddingVertical: 16,
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
  },
  tabHeaderMobile: {
    paddingVertical: 16,
    flexDirection: 'column',
  },
  tabHeaderVerification: {
    paddingVertical: 16,
  },
  switchTab: {
    marginBottom: 4,
    marginTop: 20,
  },
  switchTabMobile: {
    marginHorizontal: 'auto',
    flex: 1,
  },
  switchTabContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  switchTabContainerWeb: {
    width: '30%',
  },
  switchTabContainerTab: {
    width: '50%',
  },
  tabRows: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginRight: 'auto',
  },
  tabRowsMobile: {
    marginTop: '6%',
    width: '100%',
  },
  tooltip: {
    left: 9,
  },
  tooltipMobile: {
    left: 'auto',
  },

  badgeStyle: {
    paddingVertical: 3,
    paddingHorizontal: 18,
    borderRadius: 2,
  },
  skip: {
    color: theme.colors.blue,
  },
  sheetContent: {
    alignItems: 'center',
    paddingTop: 40,
  },
  sheetTitle: {
    marginBottom: 8,
  },
  image: {
    marginVertical: 30,
  },
  continue: {
    marginBottom: 12,
    color: theme.colors.darkTint5,
  },
  buttonStyle: {
    flex: 0,
    marginHorizontal: 16,
    height: 50,
  },
  screenContent: {
    paddingHorizontal: theme.layout.screenPadding,
    paddingTop: theme.layout.screenPadding,
  },
  service: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  verificationSubtitle: {
    marginTop: 12,
    marginBottom: 8,
  },
  helperText: {
    color: theme.colors.primaryColor,
  },
  verification: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  servicesAlignment: { width: '73%' },
});
