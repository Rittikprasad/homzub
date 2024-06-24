import React from 'react';
import { LayoutChangeEvent, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { NavigationState, SceneRendererProps, TabView } from 'react-native-tab-view';
import { withTranslation, WithTranslation } from 'react-i18next';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { DateFormats, DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { ObjectUtils } from '@homzhub/common/src/utils/ObjectUtils';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { AssetRepository } from '@homzhub/common/src/domain/repositories/AssetRepository';
import { RecordAssetRepository } from '@homzhub/common/src/domain/repositories/RecordAssetRepository';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import { Loader } from '@homzhub/common/src/components/atoms/Loader';
import {
  ILeaseFormData,
  initialLeaseFormData,
  SubLeaseUnit,
} from '@homzhub/common/src/components/organisms/SubLeaseUnit';
import { Currency } from '@homzhub/common/src/domain/models/Currency';
import { TenantPreference } from '@homzhub/common/src/domain/models/TenantInfo';
import { AssetGroupTypes } from '@homzhub/common/src/constants/AssetGroup';
import { FurnishingTypes, ScheduleTypes } from '@homzhub/common/src/constants/Terms';
import { LeaseTypes } from '@homzhub/common/src/domain/models/Asset';
import { SpaceType } from '@homzhub/common/src/domain/models/AssetGroup';
import { TypeOfPlan } from '@homzhub/common/src/domain/models/AssetPlan';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { ILeaseTermParams, LeaseTerm } from '@homzhub/common/src/domain/models/LeaseTerm';
import { IUpdateAssetParams } from '@homzhub/common/src/domain/repositories/interfaces';
import { IExtraTrackData, ListingType } from '@homzhub/common/src/services/Analytics/interfaces';

interface IRoute {
  key: string;
  title: string;
  id?: number;
  initialValues: ILeaseFormData;
}

interface IProps extends WithTranslation {
  currentAssetId: number;
  leaseType: LeaseTypes;
  assetLeaseType: LeaseTypes;
  currencyData: Currency;
  assetGroupType: AssetGroupTypes;
  furnishing: FurnishingTypes;
  scrollToTop: () => void;
  onLeaseTypeChange: (leaseType: LeaseTypes) => void;
  onNextStep: (type: TypeOfPlan, params?: IUpdateAssetParams, trackParam?: IExtraTrackData) => Promise<void>;
  leaseUnit?: number;
  startDate?: string;
}

interface IOwnState {
  currentIndex: number;
  routes: IRoute[];
  singleLeaseUnitKey: number;
  tabHeight: number;
  singleLeaseInitValues: ILeaseFormData;
  preferences: TenantPreference[];
  availableSpaces: SpaceType[];
  loading: boolean;
}

class LeaseTermController extends React.PureComponent<IProps, IOwnState> {
  private scrollRef = React.createRef<ScrollView>();
  public constructor(props: IProps) {
    super(props);
    this.state = {
      currentIndex: 0,
      singleLeaseUnitKey: -1,
      tabHeight: theme.viewport.height,
      singleLeaseInitValues: { ...initialLeaseFormData },
      routes: [],
      preferences: [],
      availableSpaces: [],
      loading: true,
    };
  }

  public componentDidMount = async (): Promise<void> => {
    const { assetGroupType } = this.props;

    await this.getInitData();

    // Fetch the tenant preferences list
    if (assetGroupType === AssetGroupTypes.RES) {
      await this.getTenantPreferences();
    }

    // Fetch all the spaces for the asset
    await this.getAvailableSpaces();
    this.setState({ loading: false });
  };

  public render = (): React.ReactNode => {
    const { leaseType, currencyData, assetGroupType, furnishing, leaseUnit, startDate } = this.props;
    const { preferences, availableSpaces, singleLeaseUnitKey, singleLeaseInitValues, loading } = this.state;
    return (
      <>
        {leaseType === LeaseTypes.Shared ? (
          this.renderTab()
        ) : (
          <SubLeaseUnit
            initialValues={singleLeaseInitValues}
            singleLeaseUnitKey={singleLeaseUnitKey}
            assetGroupType={assetGroupType}
            furnishing={furnishing}
            currencyData={currencyData}
            preferences={preferences}
            availableSpaces={availableSpaces}
            onSubmit={this.onSubmit}
            leaseUnit={leaseUnit}
            startDate={startDate}
          />
        )}
        <Loader visible={loading} />
      </>
    );
  };

  private renderTab = (): React.ReactNode => {
    const { currentIndex, routes, tabHeight } = this.state;

    // TODO: Need to fix for web
    if (PlatformUtils.isWeb() && routes.length < 1) {
      return null;
    }
    return (
      <TabView
        initialLayout={theme.viewport}
        swipeEnabled={false}
        renderTabBar={this.renderTabBar}
        renderScene={this.renderScene}
        onIndexChange={this.onTabChange}
        style={[styles.tabContainer, { height: tabHeight }]}
        navigationState={{
          index: currentIndex,
          routes,
        }}
      />
    );
  };

  private renderScene = ({ route }: { route: IRoute }): React.ReactElement => {
    const { currencyData, assetGroupType, furnishing, leaseUnit, startDate } = this.props;
    const { preferences, availableSpaces } = this.state;

    return (
      <View onLayout={this.onUnitLayout}>
        <SubLeaseUnit
          route={route}
          initialValues={route.initialValues}
          assetGroupType={assetGroupType}
          furnishing={furnishing}
          currencyData={currencyData}
          preferences={preferences}
          availableSpaces={availableSpaces}
          onSubmit={this.onSubmit}
          leaseUnit={leaseUnit}
          startDate={startDate}
        />
      </View>
    );
  };

  private renderTabBar = (
    props: SceneRendererProps & {
      navigationState: NavigationState<IRoute>;
    }
  ): React.ReactElement => {
    const { routes, index } = props.navigationState;

    let width = (theme.viewport.width - 88) / routes.length;
    if (routes.length > 2) {
      width = theme.viewport.width * 0.3;
    }

    return (
      <View style={styles.tabBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} ref={this.scrollRef}>
          {routes.map((route, curIndex: number) => {
            const isSelected = route.key === routes[index].key;
            let style = {};
            let type = 'regular';

            if (isSelected) {
              style = { color: theme.colors.active };
              type = 'semiBold';
            }

            const onPress = (): void => this.onTabChange(curIndex);

            return (
              <View key={route.key} style={[styles.tab, { width }, isSelected && styles.indicator]}>
                <TouchableOpacity onPress={onPress}>
                  <Label type="large" textType={type as 'regular' | 'semiBold'} style={[styles.tabTitle, style]}>
                    {route.title}
                  </Label>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.onDelete}>
                  <Icon name={icons.circularCrossFilled} size={20} color={theme.colors.active} />
                </TouchableOpacity>
              </View>
            );
          })}
        </ScrollView>
        <TouchableOpacity onPress={this.onTabAdd} style={styles.addButton}>
          <Icon name={icons.plus} color={theme.colors.active} size={24} />
        </TouchableOpacity>
      </View>
    );
  };

  private onUnitLayout = (e: LayoutChangeEvent): void => {
    const { height } = e.nativeEvent.layout;
    this.setState({ tabHeight: height });
  };

  private onTabChange = (index: number): void => {
    this.setState({ currentIndex: index });
  };

  private onTabAdd = (): void => {
    const { routes, currentIndex } = this.state;
    const { t } = this.props;

    const areMandatoryFilled = this.checkAvailableMandatorySpaces();
    if (areMandatoryFilled || !routes[currentIndex].id) {
      const messageKey = areMandatoryFilled ? 'cannotAddUnit' : 'finishCurrent';
      AlertHelper.error({ message: t(messageKey) }); // TODOS: Lakshit: Require clarity on availability of statusCode
      return;
    }

    this.setState(
      {
        routes: [
          ...routes,
          {
            key: `${Math.random()}`,
            title: t('unit', { unitNo: routes.length + 1 }),
            initialValues: { ...initialLeaseFormData },
          },
        ],
        currentIndex: routes.length,
      },
      (): void => {
        setTimeout(() => {
          this.scrollRef.current?.scrollToEnd({ animated: true });
        }, 0);
      }
    );
  };

  private onDelete = async (): Promise<void> => {
    const { currentIndex, routes } = this.state;
    const { t, currentAssetId } = this.props;

    if (routes.length === 1) {
      AlertHelper.error({ message: t('lessUnitsToDelete') }); // TODOS: Lakshit: Require clarity on availability of statusCode
      return;
    }

    if (routes[currentIndex].id) {
      try {
        // @ts-ignore
        await AssetRepository.deleteLeaseTerm(currentAssetId, routes[currentIndex].id);
        await this.getAvailableSpaces();
      } catch (err) {
        AlertHelper.error({ message: ErrorUtils.getErrorMessage(err.details), statusCode: err.details.statusCode });
        return;
      }
    }

    let routesToUpdate = [...routes];
    routesToUpdate.splice(currentIndex, 1);

    routesToUpdate = routesToUpdate.map((route, index) => ({ ...route, title: t('unit', { unitNo: index + 1 }) }));

    this.setState({
      routes: routesToUpdate,
      currentIndex: currentIndex === routes.length - 1 ? currentIndex - 1 : currentIndex,
    });
  };

  private onSubmit = async (values: ILeaseTermParams, key?: string, proceed = true): Promise<void> => {
    const { onNextStep, leaseType, currentAssetId, scrollToTop, t, leaseUnit } = this.props;
    const { routes } = this.state;

    try {
      this.setState({ loading: true });
      const response = leaseUnit
        ? await AssetRepository.createUnitListing({ propertyId: currentAssetId, unitId: leaseUnit, leaseTerms: values })
        : await AssetRepository.createLeaseTerms(currentAssetId, [values]);

      if (leaseType === LeaseTypes.Shared) {
        const routesToUpdate = routes.map((route) => {
          if (route.key === key && !leaseUnit) {
            const responseData = response as { ids: number[] };
            return { ...route, id: responseData.ids[0] };
          }
          if (route.key === key) {
            const responseData = response as { id: number };
            return { ...route, id: responseData.id };
          }
          return route;
        });
        this.setState({ routes: routesToUpdate }, scrollToTop);

        AlertHelper.success({ message: t('unitCreated', { unit: values.lease_unit?.name }) });

        await this.getAvailableSpaces();
        if (proceed) {
          await onNextStep(
            TypeOfPlan.RENT,
            { is_subleased: true },
            { listing_type: ListingType.RENT, price: values.expected_monthly_rent }
          );
        } else {
          await AssetRepository.updateAsset(currentAssetId, { is_subleased: true });
        }
      } else {
        if (!leaseUnit) {
          const responseData = response as { ids: number[] };
          this.setState({ singleLeaseUnitKey: responseData.ids[0] });
        } else {
          const responseData = response as { id: number };
          this.setState({ singleLeaseUnitKey: responseData.id });
        }

        await onNextStep(
          TypeOfPlan.RENT,
          { is_subleased: false },
          { listing_type: ListingType.RENT, price: values.expected_monthly_rent }
        );
      }
      this.setState({ loading: false });
    } catch (err) {
      this.setState({ loading: false });
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(err.details), statusCode: err.details.statusCode });
    }
  };

  // APIs
  private getInitData = async (): Promise<void> => {
    const { currentAssetId, t, assetLeaseType } = this.props;

    try {
      const response = await AssetRepository.getLeaseTerms(currentAssetId);

      if (response.length > 0 && assetLeaseType === LeaseTypes.Entire) {
        this.setState({
          singleLeaseUnitKey: response[0].id,
          singleLeaseInitValues: this.extractInitValues(response[0]),
        });
        if (response[0].status === 'APPROVED') {
          AlertHelper.info({
            message: t('property:propertyEditMsg'),
          });
        }
      }

      if (response.length > 0 && assetLeaseType === LeaseTypes.Shared) {
        const routes: IRoute[] = [];
        ObjectUtils.sort(response, 'id').forEach((term: LeaseTerm) => {
          routes.push({
            key: `${Math.random()}`,
            id: term.id,
            title: term.leaseUnit.name,
            initialValues: this.extractInitValues(term),
          });
        });
        this.setState({ routes });
      }

      if (response.length <= 0) {
        this.setState({
          routes: [{ key: '1', title: t('unit', { unitNo: 1 }), initialValues: { ...initialLeaseFormData } }],
        });
      }
    } catch (err) {
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(err.details), statusCode: err.details.statusCode });
    }
  };

  private getTenantPreferences = async (): Promise<void> => {
    const { currentAssetId } = this.props;
    try {
      const response = await RecordAssetRepository.getTenantPreferences(currentAssetId);
      this.setState({ preferences: response });
    } catch (e) {
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details), statusCode: e.details.statusCode });
    }
  };

  private getAvailableSpaces = async (): Promise<void> => {
    const { currentAssetId } = this.props;
    try {
      const response = await AssetRepository.getAssetAvailableSpaces(currentAssetId);
      this.setState({ availableSpaces: response });
    } catch (e) {
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details), statusCode: e.details.statusCode });
    }
  };
  // APIs END

  // HELPERS

  private checkAvailableMandatorySpaces = (): boolean => {
    const { availableSpaces } = this.state;
    let areMandatoryFilled = false;

    for (let i = 0; i < availableSpaces.length; i++) {
      if (availableSpaces[i].isMandatory && availableSpaces[i].count === 0) {
        areMandatoryFilled = true;
        break;
      }
    }

    return areMandatoryFilled;
  };

  private extractInitValues = (data: LeaseTerm): ILeaseFormData => {
    return {
      showMore: data.annualRentIncrementPercentage !== null,
      monthlyRent: data.expectedPrice.toString(10),
      securityDeposit: data.securityDeposit.toString(10),
      annualIncrement:
        data.annualRentIncrementPercentage === -1 ? '' : data.annualRentIncrementPercentage?.toString() ?? '',
      description: data.description,
      minimumLeasePeriod: data.minimumLeasePeriod,
      maximumLeasePeriod: data.maximumLeasePeriod,
      availableFrom: DateUtils.getDisplayDate(data.availableFromDate, DateFormats.YYYYMMDD),
      utilityBy: data.utilityPaidBy,
      rentFreePeriod: data.rentFreePeriod === -1 ? '' : data.rentFreePeriod?.toString() ?? '',
      maintenanceBy: data.maintenancePaidBy,
      maintenanceAmount: data.maintenanceAmount === -1 ? '' : data.maintenanceAmount?.toString() ?? '',
      maintenanceSchedule: ScheduleTypes.MONTHLY,
      maintenanceUnit: data.maintenanceUnit ?? -1,
      spaces: data.leaseUnit.spaces,
      selectedPreferences: data.tenantPreferences,
      status: data.status,
    };
  };

  // HELPERS END
}

export default withTranslation(LocaleConstants.namespacesKey.property)(LeaseTermController);

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  tabContainer: {
    flex: 0,
  },
  tab: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: theme.colors.disabled,
    borderBottomWidth: 2,
    paddingBottom: 12,
  },
  tabTitle: {
    color: theme.colors.darkTint3,
    paddingHorizontal: 8,
  },
  addButton: {
    borderBottomColor: theme.colors.disabled,
    borderBottomWidth: 2,
    paddingBottom: 10,
  },
  indicator: {
    borderBottomColor: theme.colors.active,
  },
});
