import React, { ReactElement } from 'react';
import { KeyboardAvoidingView, LayoutChangeEvent, ScrollView, StyleSheet, View } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { TabView } from 'react-native-tab-view';
import { CommonActions } from '@react-navigation/native';
// @ts-ignore
import Markdown from 'react-native-easy-markdown';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { CommonActions as Actions } from '@homzhub/common/src/modules/common/actions';
import { SearchActions } from '@homzhub/common/src/modules/search/actions';
import { RecordAssetActions } from '@homzhub/common/src/modules/recordAsset/actions';
import { RecordAssetSelectors } from '@homzhub/common/src/modules/recordAsset/selectors';
import { IListingUpdate, ListingService } from '@homzhub/common/src/services/Property/ListingService';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import PropertySearch from '@homzhub/common/src/assets/images/propertySearch.svg';
import { PropertyPostStackParamList } from '@homzhub/mobile/src/navigation/PropertyPostStack';
import { Header } from '@homzhub/mobile/src/components';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Loader } from '@homzhub/common/src/components/atoms/Loader';
import { SelectionPicker } from '@homzhub/common/src/components/atoms/SelectionPicker';
import { Text, Label } from '@homzhub/common/src/components/atoms/Text';
import { BottomSheet } from '@homzhub/common/src/components/molecules/BottomSheet';
import { AddressWithStepIndicator } from '@homzhub/common/src/components/molecules/AddressWithStepIndicator';
import { ActionController } from '@homzhub/common/src/components/organisms/ActionController';
import { PropertyPayment } from '@homzhub/common/src/components/organisms/PropertyPayment';
import PropertyVerification from '@homzhub/mobile/src/components/organisms/PropertyVerification';
import { ValueAddedServicesView } from '@homzhub/common/src/components/organisms/ValueAddedServicesView';
import { ISelectedValueServices, ValueAddedService } from '@homzhub/common/src/domain/models/ValueAddedService';
import { Asset, LeaseTypes } from '@homzhub/common/src/domain/models/Asset';
import { ISelectedAssetPlan, TypeOfPlan } from '@homzhub/common/src/domain/models/AssetPlan';
import { IFilter } from '@homzhub/common/src/domain/models/Search';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { IReviewRefer } from '@homzhub/common/src/modules/common/interfaces';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { IRoutes, ListingRoutes, Tabs } from '@homzhub/common/src/constants/Tabs';
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
  setFilter: (payload: IFilter) => void;
  clearAssetData: () => void;
  setReviewReferData: (payload: IReviewRefer) => void;
}

type libraryProps = NavigationScreenProps<PropertyPostStackParamList, ScreensKeys.AssetListing>;
type Props = WithTranslation & libraryProps & IStateProps & IDispatchProps;

interface IOwnState {
  currentIndex: number;
  isStepDone: boolean[];
  isActionSheetToggled: boolean;
  leaseType: LeaseTypes;
  isSheetVisible: boolean;
  isNextStep: boolean;
  tabViewHeights: number[];
}

const { height, width } = theme.viewport;
const TAB_LAYOUT = {
  width: width - theme.layout.screenPadding * 2,
  height,
};

class AssetListing extends React.PureComponent<Props, IOwnState> {
  private scrollRef = React.createRef<ScrollView>();
  public state = {
    currentIndex: 0,
    isStepDone: [],
    tabViewHeights: [height, height, height, height * 0.5],
    isActionSheetToggled: false,
    leaseType: LeaseTypes.Entire,
    isSheetVisible: false,
    isNextStep: false,
  };

  public static getDerivedStateFromProps(props: Props, state: IOwnState): IOwnState | null {
    const {
      assetDetails,
      route: { params },
    } = props;
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

  public componentWillUnmount(): void {
    const { clearAssetData } = this.props;
    clearAssetData();
  }

  public render(): React.ReactNode {
    const { currentIndex, isStepDone, isSheetVisible, tabViewHeights } = this.state;
    const {
      selectedAssetPlan: { selectedPlan },
      assetDetails,
    } = this.props;

    if (!assetDetails) return <Loader visible />;

    const {
      projectName,
      assetType: { name },
      address,
      country: { flag },
    } = assetDetails;

    const steps = this.getRoutes().map((route) => route.title);
    const title = ListingService.getHeader(selectedPlan);

    return (
      <>
        <Header icon={icons.leftArrow} title={title} onIconPress={this.goBack} />
        <KeyboardAvoidingView style={styles.flexOne} behavior={PlatformUtils.isIOS() ? 'padding' : undefined}>
          <ScrollView
            style={styles.screen}
            contentContainerStyle={styles.screenContent}
            showsVerticalScrollIndicator={false}
            ref={this.scrollRef}
          >
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
              initialLayout={TAB_LAYOUT}
              renderScene={this.renderScene}
              onIndexChange={this.handleIndexChange}
              renderTabBar={(): null => null}
              swipeEnabled={false}
              navigationState={{
                index: currentIndex,
                routes: this.getRoutes(),
              }}
              style={{ height: tabViewHeights[currentIndex] }}
            />
          </ScrollView>
        </KeyboardAvoidingView>
        {this.openActionBottomSheet()}
        <BottomSheet
          visible={isSheetVisible}
          isCloseOnDrag={false}
          renderHeader={false}
          sheetHeight={450}
          onCloseSheet={this.onCloseSheet}
        >
          {this.renderContinueView(assetDetails)}
        </BottomSheet>
      </>
    );
  }

  public renderTabHeader = (): ReactElement => {
    const {
      t,
      selectedAssetPlan: { selectedPlan },
      valueAddedServices,
      route: { params },
    } = this.props;
    const { currentIndex, leaseType, isActionSheetToggled } = this.state;
    const { key, title } = this.getRoutes()[currentIndex];
    const servicesHeader = [t('assetMore:premiumServices'), t('assetMore:optional')];
    const hasServices = valueAddedServices.length > 0;

    const toggleActionSheet = (): void => this.setState({ isActionSheetToggled: !isActionSheetToggled });

    const renderHeader = (): React.ReactElement => {
      if (key !== Tabs.SERVICES) {
        return (
          <Text type="small" textType="semiBold">
            {title}
          </Text>
        );
      }
      return (
        <View style={styles.headerRow}>
          {servicesHeader.map((item, index) => {
            return (
              <Text type="small" key={index} textType={index === 0 ? 'semiBold' : 'light'}>
                {item}{' '}
              </Text>
            );
          })}
        </View>
      );
    };

    const isEdit = params?.previousScreen === ScreensKeys.Dashboard || params?.isEditFlow;

    return (
      <View style={styles.tabHeader}>
        {!isEdit && key === Tabs.ACTIONS && selectedPlan === TypeOfPlan.RENT && (
          <SelectionPicker
            data={[
              { title: t(LeaseTypes.Entire), value: LeaseTypes.Entire },
              { title: t(LeaseTypes.Shared), value: LeaseTypes.Shared },
            ]}
            selectedItem={[leaseType]}
            containerStyles={styles.switchTab}
            onValueChange={this.onTabChange}
          />
        )}
        <View style={styles.tabRows}>
          {renderHeader()}
          {[Tabs.VERIFICATIONS, Tabs.SERVICES].includes(key) && (
            <Text type="small" textType="semiBold" style={styles.skip} onPress={this.handleSkip}>
              {t(key === Tabs.VERIFICATIONS ? 'common:doItLater' : 'common:skip')}
            </Text>
          )}
          {key === Tabs.ACTIONS && (
            <Icon name={icons.tooltip} color={theme.colors.blue} size={26} onPress={toggleActionSheet} />
          )}
        </View>
        {key === Tabs.VERIFICATIONS && (
          <>
            <Label type="regular" textType="regular" style={styles.verificationSubtitle}>
              {t('confirmPropertyDetailsText')}
            </Label>
            <Label
              type="large"
              textType="semiBold"
              style={styles.helperText}
              onPress={this.navigateToVerificationHelper}
            >
              {t('helperNavigationText')}
            </Label>
          </>
        )}
        {key === Tabs.SERVICES && hasServices && (
          <>
            <Label type="regular" textType="regular" style={styles.verificationSubtitle}>
              {t('chooseServiceText')}
            </Label>
          </>
        )}
      </View>
    );
  };

  private renderContinueView = (assetDetails: Asset): ReactElement => {
    const { t } = this.props;
    const {
      lastVisitedStep: {
        isVerificationRequired,
        listing: { type },
      },
    } = assetDetails;
    const isReadyToPreview = type !== TypeOfPlan.MANAGE && !isVerificationRequired;
    const title = isReadyToPreview ? t('previewOwnProperty') : t('clickContinueToDashboard');

    return (
      <>
        <View style={styles.sheetContent}>
          <Text type="large" style={styles.sheetTitle}>
            {t('common:congratulations')}
          </Text>
          <Text type="small">{t('paymentSuccessMsg')}</Text>
          <PropertySearch style={styles.image} />
          <Label type="large" style={styles.continue}>
            {title}
          </Label>
        </View>
        <Button
          type="primary"
          title={t('common:continue')}
          containerStyle={styles.buttonStyle}
          onPress={this.handleContinue}
        />
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
      route: { params },
    } = this.props;
    const isManage = selectedPlan === TypeOfPlan.MANAGE;

    if (!assetDetails) return null;

    switch (route.key) {
      case Tabs.VERIFICATIONS:
        return (
          <View onLayout={(e): void => this.onLayout(e, 1)}>
            <PropertyVerification
              propertyId={assetDetails.id}
              typeOfPlan={selectedPlan}
              updateStep={this.handleNextStep}
              lastVisitedStep={assetDetails.lastVisitedStepSerialized}
            />
          </View>
        );
      case Tabs.SERVICES:
        return (
          <View onLayout={(e): void => this.onLayout(e, isManage ? 1 : 2)}>
            <ValueAddedServicesView
              propertyId={assetDetails.id}
              lastVisitedStep={assetDetails.lastVisitedStepSerialized}
              valueAddedServices={valueAddedServices}
              setValueAddedServices={setValueAddedServices}
              typeOfPlan={selectedPlan}
              handleNextStep={this.handleNextStep}
            />
          </View>
        );
      case Tabs.PAYMENT:
        return (
          <View onLayout={(e): void => this.onLayout(e, isManage ? 2 : 3)}>
            <PropertyPayment
              goBackToService={this.goBackToServices}
              propertyId={assetDetails.id}
              lastVisitedStep={assetDetails.lastVisitedStepSerialized}
              valueAddedServices={valueAddedServices}
              setValueAddedServices={setValueAddedServices}
              typeOfPlan={selectedPlan}
              handleNextStep={this.handleNextStep}
              isFromListing
            />
          </View>
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
              leaseUnit={params?.leaseUnit}
              startDate={params?.startDate}
            />
          </View>
        );
    }
  };

  private onCloseSheet = (): void => {
    this.setState({ isSheetVisible: false });
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

  private openActionBottomSheet = (): React.ReactNode => {
    const { isActionSheetToggled } = this.state;
    const {
      t,
      selectedAssetPlan: { selectedPlan },
    } = this.props;
    const closeActionSheet = (): void => this.setState({ isActionSheetToggled: false });
    if (!isActionSheetToggled) {
      return null;
    }
    return (
      <BottomSheet
        visible={isActionSheetToggled}
        onCloseSheet={closeActionSheet}
        headerTitle={selectedPlan === TypeOfPlan.RENT ? t('lease') : t('terms')}
        sheetHeight={500}
        isShadowView
      >
        <Markdown
          markdownStyles={{
            h2: { fontWeight: '600', fontSize: 20, marginVertical: 10 },
            h4: { fontWeight: '300', fontSize: 24, color: theme.colors.darkTint2 },
            strong: { fontWeight: '600', fontSize: 16 },
            text: { fontWeight: 'normal', fontSize: 14 },
          }}
          style={{ margin: theme.layout.screenPadding }}
        >
          {`${ListingService.getHeader(selectedPlan).toUpperCase()} Helper Text`}
        </Markdown>
      </BottomSheet>
    );
  };

  public getRoutes = (): IRoutes[] => {
    const {
      selectedAssetPlan: { selectedPlan },
    } = this.props;
    const routes = ListingRoutes;

    if (selectedPlan !== TypeOfPlan.MANAGE) {
      return routes;
    }

    return routes.filter((route) => route.key !== Tabs.VERIFICATIONS);
  };

  private goBack = (): void => {
    const {
      navigation,
      route: { params },
      resetState,
    } = this.props;

    if (params && params.previousScreen === ScreensKeys.Dashboard) {
      resetState();
    }

    navigation.goBack();
  };

  private goBackToServices = (): void => {
    const { currentIndex } = this.state;
    this.setState({ currentIndex: currentIndex - 1 });
    this.scrollToTop();
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
    resetState();

    if (assetDetails) {
      const {
        lastVisitedStep: {
          isPropertyReady,
          listing: { type },
        },
      } = assetDetails;
      if (isPropertyReady && type !== TypeOfPlan.MANAGE) {
        this.navigateToPreview(assetDetails);
      } else {
        this.navigateToDashboard();
      }
    }
  };

  private navigateToPreview = (assetDetails: Asset): void => {
    const { navigation, setFilter, resetState } = this.props;
    const {
      id,
      leaseListingIds,
      saleListingIds,
      lastVisitedStep: {
        listing: { type },
      },
    } = assetDetails;
    const planType = type === TypeOfPlan.RENT ? 0 : 1;
    setFilter({ asset_transaction_type: planType });
    const saleId = saleListingIds && saleListingIds.length > 0 ? saleListingIds[0] : 0;
    const leaseId = leaseListingIds && leaseListingIds.length > 0 ? leaseListingIds[0] : 0;

    const propertyTermId = type === TypeOfPlan.RENT && leaseId > 0 ? leaseId : saleId;
    this.setState({
      isNextStep: false,
    });

    navigation.navigate(ScreensKeys.PropertyAssetDescription, {
      propertyTermId,
      isPreview: true,
      propertyId: id,
    });
    resetState();
  };

  private handleNextStep = (): void => {
    const { currentIndex, isStepDone, isSheetVisible, isNextStep } = this.state;
    const {
      assetDetails,
      getAssetById,
      route: { params },
    } = this.props;

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
      onPreview: this.navigateToPreview,
      params,
    });
  };

  private updateState = (data: IListingUpdate): void => {
    const { isNextStep, isSheetVisible, currentIndex, isStepDone } = data;

    this.setState((prevState) => ({
      ...prevState,
      ...(currentIndex && currentIndex >= 0 && { currentIndex }),
      ...(isStepDone && { isStepDone }),
      isNextStep: isNextStep ?? false,
      isSheetVisible: isSheetVisible ?? false,
    }));
  };

  private navigateToVerificationHelper = (): void => {
    const { navigation } = this.props;
    navigation.navigate(ScreensKeys.MarkdownScreen, { title: 'Property Verification', isFrom: 'verification' });
  };

  public handleSkip = (): void => {
    const { assetDetails } = this.props;
    const { currentIndex } = this.state;

    if (assetDetails && assetDetails.lastVisitedStep.isPropertyReady) {
      if (assetDetails.lastVisitedStep.listing.type !== TypeOfPlan.MANAGE) {
        this.navigateToPreview(assetDetails);
      } else {
        this.navigateToDashboard();
      }
    } else if (currentIndex < this.getRoutes().length - 2) {
      this.setState({ currentIndex: currentIndex + 1, isNextStep: true });
      this.scrollToTop();
    } else {
      this.navigateToDashboard();
    }
  };

  private navigateToDashboard = (): void => {
    const {
      t,
      navigation,
      resetState,
      setReviewReferData,
      route: { params },
    } = this.props;
    resetState();
    if (params && !params.isEditFlow) {
      setReviewReferData({ message: t('property:listingCreation'), isSheetVisible: true });
    }
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: ScreensKeys.BottomTabs }],
      })
    );
  };

  private scrollToTop = (): void => {
    setTimeout(() => {
      this.scrollRef.current?.scrollTo({ x: 0, y: 0, animated: true });
    }, 100);
  };
}

const mapStateToProps = (state: IState): IStateProps => {
  const { getSelectedAssetPlan, getAssetDetails, getValueAddedServices } = RecordAssetSelectors;
  return {
    selectedAssetPlan: getSelectedAssetPlan(state),
    assetDetails: getAssetDetails(state),
    valueAddedServices: getValueAddedServices(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { resetState, getAssetById, setValueAddedServices, getValueAddedServices, clearAssetData } = RecordAssetActions;
  const { setFilter } = SearchActions;
  const { setReviewReferData } = Actions;
  return bindActionCreators(
    {
      resetState,
      getAssetById,
      setValueAddedServices,
      getValueAddedServices,
      setFilter,
      clearAssetData,
      setReviewReferData,
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation(LocaleConstants.namespacesKey.property)(AssetListing));

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
  },
  switchTab: {
    marginBottom: 20,
    marginTop: 4,
  },
  tabRows: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badgeStyle: {
    paddingVertical: 3,
    paddingHorizontal: 18,
    borderRadius: 2,
  },
  helperText: {
    color: theme.colors.primaryColor,
  },
  verificationSubtitle: {
    marginTop: 12,
    marginBottom: 8,
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
  headerRow: {
    flexDirection: 'row',
  },
});
