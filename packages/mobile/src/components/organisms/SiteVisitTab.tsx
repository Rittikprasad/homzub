import React, { PureComponent } from 'react';
import { LayoutChangeEvent, StyleSheet, View } from 'react-native';
import { TabBar, TabView } from 'react-native-tab-view';
import { WithTranslation, withTranslation } from 'react-i18next';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { isEmpty } from 'lodash';
import { StackNavigationProp } from '@react-navigation/stack/lib/typescript/src/types';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { DateFormats, DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { VisitUtils } from '@homzhub/common/src/utils/VisitUtils';
import { AssetRepository } from '@homzhub/common/src/domain/repositories/AssetRepository';
import { CommonRepository } from '@homzhub/common/src/domain/repositories/CommonRepository';
import { UserRepository } from '@homzhub/common/src/domain/repositories/UserRepository';
import { AssetActions } from '@homzhub/common/src/modules/asset/actions';
import { AssetSelectors } from '@homzhub/common/src/modules/asset/selectors';
import { PortfolioSelectors } from '@homzhub/common/src/modules/portfolio/selectors';
import { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { EmptyState } from '@homzhub/common/src/components/atoms/EmptyState';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import { BottomSheet } from '@homzhub/common/src/components/molecules/BottomSheet';
import EventWithProfile from '@homzhub/mobile/src/components/molecules/EventWithProfile';
import PropertyVisitList from '@homzhub/mobile/src/components/organisms/PropertyVisitList';
import { Pillar, PillarTypes } from '@homzhub/common/src/domain/models/Pillar';
import { AssetVisit, IVisitByKey, VisitActions } from '@homzhub/common/src/domain/models/AssetVisit';
import { IState } from '@homzhub/common/src/modules/interfaces';
import {
  IAssetVisitPayload,
  IBookVisitProps,
  IUpdateVisitPayload,
  IVisitActionParam,
  VisitStatus,
} from '@homzhub/common/src/domain/repositories/interfaces';
import { PortfolioNavigatorParamList } from '@homzhub/mobile/src/navigation/PortfolioStack';
import { CommonParamList } from '@homzhub/mobile/src/navigation/Common';
import { ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { IRoutes, Tabs, VisitRoutes } from '@homzhub/common/src/constants/Tabs';
import { UserInteraction } from '@homzhub/common/src/domain/models/UserInteraction';
import { ISetAssetPayload } from '@homzhub/common/src/modules/portfolio/interfaces';

const { height } = theme.viewport;

interface IDispatchProps {
  getAssetVisit: (payload: IAssetVisitPayload) => void;
  setVisitIds: (payload: number[]) => void;
  setVisitType: (payload: Tabs) => void;
  clearVisits: () => void;
}

interface IStateProps {
  visits: IVisitByKey[];
  asset: ISetAssetPayload;
  isLoading: boolean;
}

type NavigationType =
  | StackNavigationProp<CommonParamList, ScreensKeys.PropertyVisits>
  | StackNavigationProp<PortfolioNavigatorParamList, ScreensKeys.PropertyDetailScreen>;

interface IProps {
  isFromProperty?: boolean;
  onReschedule: (param: IBookVisitProps, isNew?: boolean) => void;
  selectedAssetId?: number;
  isViewChanged?: boolean;
  navigation?: NavigationType;
  setVisitPayload?: (payload: IAssetVisitPayload) => void;
  visitId?: number | null;
  reviewVisitId?: number;
}

interface IScreenState {
  currentIndex: number;
  dropdownValue: number;
  heights: number[];
  isFromNav: boolean;
  userDetail: UserInteraction;
  isProfileVisible: boolean;
  pillars: Pillar[];
}

type Props = IDispatchProps & IStateProps & IProps & WithTranslation;

class SiteVisitTab extends PureComponent<Props, IScreenState> {
  public _unsubscribe: any;

  public constructor(props: Props) {
    super(props);
    this.state = {
      currentIndex: props.reviewVisitId ? 2 : 0,
      dropdownValue: 1,
      heights: [height, height, height],
      isFromNav: true,
      userDetail: {} as UserInteraction,
      isProfileVisible: false,
      pillars: [],
    };
  }

  public componentDidMount(): void {
    const { navigation, reviewVisitId } = this.props;
    this.getRatingPillars().then();

    if (navigation) {
      // @ts-ignore
      this._unsubscribe = navigation.addListener('focus', () => {
        this.getVisitsData();
      });
    }

    if (reviewVisitId) {
      this.setState({ currentIndex: 2 }, this.getVisitsData);
    }
    this.getVisitsData();
  }

  public componentWillUnmount(): void {
    const { navigation } = this.props;
    if (navigation) {
      this._unsubscribe();
    }
  }

  public render(): React.ReactNode {
    const { currentIndex, heights, userDetail, isProfileVisible } = this.state;
    const { t } = this.props;
    const statusIndex = this.getVisitStatus();
    return (
      <>
        <TabView
          initialLayout={theme.viewport}
          style={[styles.tabView, { minHeight: heights[currentIndex] }]}
          renderScene={this.renderScene}
          onIndexChange={this.handleIndexChange}
          renderTabBar={(props): React.ReactElement => {
            const {
              navigationState: { index, routes },
            } = props;
            const currentRoute = routes[index];
            return (
              <TabBar
                {...props}
                style={styles.tabBar}
                indicatorStyle={{ backgroundColor: currentRoute.color }}
                renderLabel={({ route }): React.ReactElement => {
                  return (
                    <Text type="small" style={styles.tabLabel} numberOfLines={1}>
                      {route.title}
                    </Text>
                  );
                }}
              />
            );
          }}
          swipeEnabled={false}
          navigationState={{
            index: statusIndex || currentIndex,
            routes: VisitRoutes,
          }}
        />
        {!isEmpty(userDetail) && (
          <BottomSheet
            visible={isProfileVisible}
            onCloseSheet={this.onCloseProfile}
            headerTitle={t('assetMore:profile')}
            isShadowView
            sheetHeight={600}
          >
            <EventWithProfile
              detail={userDetail}
              handleVisitAction={this.handleVisitActions}
              handleConfirmation={this.showConfirmation}
              handleReschedule={this.handleSchedule}
            />
          </BottomSheet>
        )}
      </>
    );
  }

  private renderScene = ({ route }: { route: IRoutes }): React.ReactElement | null => {
    const { visits, isLoading, reviewVisitId, t, navigation } = this.props;
    const { dropdownValue, pillars } = this.state;
    let dropdownData;
    switch (route.key) {
      case Tabs.UPCOMING:
        dropdownData = VisitUtils.getDropdownData(Tabs.UPCOMING);
        return (
          <View onLayout={(e): void => this.onLayout(e, 0)}>
            <PropertyVisitList
              navigation={navigation}
              visitType={route.key}
              visitData={visits}
              dropdownData={dropdownData}
              dropdownValue={dropdownValue}
              isLoading={isLoading}
              handleAction={this.handleVisitActions}
              handleReschedule={(item): void => this.handleRescheduleVisit(item, Tabs.UPCOMING)}
              handleDropdown={this.handleDropdownSelection}
              handleUserView={this.onShowProfile}
            />
          </View>
        );
      case Tabs.MISSED:
        dropdownData = VisitUtils.getDropdownData(Tabs.MISSED);
        return (
          <View onLayout={(e): void => this.onLayout(e, 1)}>
            <PropertyVisitList
              navigation={navigation}
              visitType={route.key}
              visitData={visits}
              isLoading={isLoading}
              dropdownValue={dropdownValue}
              dropdownData={dropdownData}
              handleAction={this.handleVisitActions}
              handleReschedule={(item): void => this.handleRescheduleVisit(item, Tabs.MISSED)}
              handleDropdown={this.handleDropdownSelection}
              handleUserView={this.onShowProfile}
            />
          </View>
        );
      case Tabs.COMPLETED:
        dropdownData = VisitUtils.getDropdownData(Tabs.COMPLETED);
        return (
          <View onLayout={(e): void => this.onLayout(e, 2)}>
            <PropertyVisitList
              navigation={navigation}
              visitType={route.key}
              visitData={visits}
              isLoading={isLoading}
              dropdownValue={dropdownValue}
              dropdownData={dropdownData}
              handleAction={this.handleVisitActions}
              handleReschedule={(item, userId): void => this.handleRescheduleVisit(item, Tabs.COMPLETED, userId)}
              handleDropdown={this.handleDropdownSelection}
              handleUserView={this.onShowProfile}
              pillars={pillars}
              resetData={this.getVisitsData}
              reviewVisitId={reviewVisitId}
            />
          </View>
        );
      default:
        return <EmptyState icon={icons.schedule} title={t('property:noVisits')} />;
    }
  };

  private onDropdownValueSelect = (startDate: string, endDate: string, visitType: Tabs): void => {
    const { getAssetVisit, selectedAssetId, setVisitPayload, isFromProperty = false, asset } = this.props;

    const payload = VisitUtils.onDropdownValueSelect({
      assetPayload: asset,
      visitType,
      startDate,
      endDate,
      isFromProperty,
      selectedAssetId,
      setVisitPayload,
    });

    if (!payload) return;

    getAssetVisit(payload);
  };

  private onLayout = (e: LayoutChangeEvent, index: number): void => {
    const { heights } = this.state;
    const { height: newHeight } = e.nativeEvent.layout;
    const arrayToUpdate = [...heights];

    if (newHeight !== arrayToUpdate[index]) {
      arrayToUpdate[index] = newHeight;
      this.setState({ heights: arrayToUpdate });
    }
  };

  private onCloseProfile = (): void => {
    this.setState({
      isProfileVisible: false,
    });
  };

  private onShowProfile = (id: number): void => {
    UserRepository.getUserInteractions(id)
      .then((response) => {
        this.setState({
          isProfileVisible: true,
          userDetail: response,
        });
      })
      .catch((e) => {
        AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
      });
  };

  private handleRescheduleVisit = (asset: AssetVisit, key: Tabs, userId?: number): void => {
    const { onReschedule, setVisitIds } = this.props;
    const { id, leaseListing, saleListing, isValidVisit } = asset;
    setVisitIds([id]);
    const param = {
      ...(leaseListing && leaseListing > 0 && { lease_listing_id: leaseListing }),
      ...(saleListing && saleListing > 0 && { sale_listing_id: saleListing }),
    };
    if (!isValidVisit) {
      this.handleInvalidVisit();
      return;
    }
    if (key === Tabs.COMPLETED) {
      onReschedule({ ...param, userId }, true);
    } else {
      onReschedule(param, false);
    }
  };

  private handleInvalidVisit = (): void => {
    const { t } = this.props;
    this.onCloseProfile();
    AlertHelper.error({ message: t('property:inValidVisit') });
  };

  private handleIndexChange = (index: number): void => {
    const { setVisitType, clearVisits } = this.props;
    const { key } = VisitRoutes[index];
    setVisitType(key);
    clearVisits();
    this.setState({ currentIndex: index, dropdownValue: 1 }, this.getVisitsData);
  };

  private handleVisitActions = async (param: IVisitActionParam): Promise<void> => {
    const { action, isValidVisit, isUserView } = param;
    if (!action) return;

    if (!isValidVisit) {
      this.handleInvalidVisit();
      return;
    }

    const payload: IUpdateVisitPayload = {
      id: param.id,
      data: {
        status: action,
      },
    };

    try {
      await AssetRepository.updatePropertyVisit(payload);
      if (isUserView) {
        const {
          userDetail: {
            user: { id },
          },
        } = this.state;
        this.onShowProfile(id);
      } else {
        this.getVisitsData();
      }
    } catch (e) {
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
    }
  };

  private handleDropdownSelection = (value: string | number, visitType: Tabs): void => {
    const currentDate = DateUtils.getCurrentDateISO();
    this.setState({
      dropdownValue: value as number,
    });
    const data = VisitUtils.getDropdownData(visitType);
    const selectedData = data.find((item) => item.value === (value as number));
    if (selectedData) {
      const fromDate =
        visitType === Tabs.UPCOMING && selectedData.startDate < currentDate ? currentDate : selectedData.startDate;
      this.onDropdownValueSelect(fromDate, selectedData.endDate, visitType);
    }
  };

  private handleSchedule = (visit: AssetVisit): void => {
    const { onReschedule, setVisitIds, getAssetVisit } = this.props;
    const { id, leaseListing, saleListing, isValidVisit } = visit;
    const param = {
      ...(leaseListing && leaseListing > 0 && { lease_listing_id: leaseListing }),
      ...(saleListing && saleListing > 0 && { sale_listing_id: saleListing }),
    };
    if (!isValidVisit) {
      this.handleInvalidVisit();
      return;
    }
    setVisitIds([id]);
    getAssetVisit({ id });
    onReschedule(param, false);
    this.onCloseProfile();
  };

  private getVisitStatus = (): number | null => {
    const { visits } = this.props;

    if (visits.length === 1) {
      // @ts-ignore
      const { startDate, status } = visits[0].results[0];
      const formattedDate = DateUtils.getDisplayDate(startDate, DateFormats.ISO24Format);
      const currentDate = DateUtils.getDisplayDate(new Date().toISOString(), DateFormats.ISO24Format);
      const dateDiff = DateUtils.getDateDiff(formattedDate, currentDate);
      if (dateDiff > 0) {
        return 0; // UPCOMING
      }
      if (dateDiff < 0 && status === VisitStatus.PENDING) {
        return 1; // MISSED
      }
      return 2; // COMPLETED
    }
    return null;
  };

  private showConfirmation = (param: IVisitActionParam): void => {
    const { t } = this.props;
    const { isValidVisit, id, isUserView } = param;

    if (!isValidVisit) {
      this.handleInvalidVisit();
      return;
    }

    AlertHelper.alert({
      title: t('property:cancelVisit'),
      message: t('property:wantCancelVisit'),
      onOkay: () =>
        this.handleVisitActions({
          id,
          action: VisitActions.CANCEL,
          isValidVisit,
          isUserView,
        }).then(),
    });
  };

  private getVisitsData = (): void => {
    const { getAssetVisit, asset, isFromProperty = false, selectedAssetId, setVisitPayload, visitId } = this.props;
    const { currentIndex, dropdownValue, isFromNav } = this.state;
    const currentRoute = VisitRoutes[currentIndex];
    let payload: IAssetVisitPayload | null;
    if (isFromNav && visitId) {
      payload = {
        id: visitId,
      };
      this.setState({ isFromNav: false });
    } else {
      payload = VisitUtils.getVisitPayload({
        assetPayload: asset,
        dropdownValue,
        isFromProperty,
        visitType: currentRoute.key,
        visitId,
        selectedAssetId,
        setVisitPayload,
      });
    }

    if (!payload) return;

    getAssetVisit(payload);
  };

  private getRatingPillars = async (): Promise<void> => {
    try {
      const pillars = await CommonRepository.getPillars(PillarTypes.LISTING_REVIEW);
      this.setState({ pillars });
      // eslint-disable-next-line no-empty
    } catch (err) {}
  };
}

export const mapStateToProps = (state: IState): IStateProps => {
  return {
    visits: AssetSelectors.getAssetVisitsByDate(state),
    isLoading: AssetSelectors.getVisitLoadingState(state),
    asset: PortfolioSelectors.getCurrentAssetPayload(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { getAssetVisit, setVisitIds, setVisitType, clearVisits } = AssetActions;
  return bindActionCreators(
    {
      getAssetVisit,
      setVisitIds,
      setVisitType,
      clearVisits,
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(SiteVisitTab));

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: theme.colors.white,
    marginTop: 10,
  },
  tabLabel: {
    color: theme.colors.darkTint3,
  },
  tabView: {
    flex: 0,
    backgroundColor: theme.colors.white,
  },
});
