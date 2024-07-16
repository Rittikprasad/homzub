import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { TabBar, TabView } from 'react-native-tab-view';
import { useSelector, useDispatch } from 'react-redux';
import { PopupActions } from 'reactjs-popup/dist/types';
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
import PropertyVisitList from '@homzhub/web/src/screens/siteVisits/components/PropertyVisitList';
import SiteVisitsActionsPopover, {
  SiteVisitAction,
} from '@homzhub/web/src/screens/siteVisits/components/SiteVisitsActionsPopover';
import { Pillar, PillarTypes } from '@homzhub/common/src/domain/models/Pillar';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { AssetVisit, VisitActions } from '@homzhub/common/src/domain/models/AssetVisit';
import {
  IAssetVisitPayload,
  IBookVisitProps,
  IUpdateVisitPayload,
  IVisitActionParam,
  VisitStatus,
} from '@homzhub/common/src/domain/repositories/interfaces';
import { IRoutes, Tabs, VisitRoutes } from '@homzhub/common/src/constants/Tabs';

interface ICustomState {
  currentIndex: number;
  dropdownValue: number;
  pillars: Pillar[];
}

interface IProps {
  onReschedule: (param: IBookVisitProps, isNew?: boolean) => void;
  setVisitPayload: (payload: IAssetVisitPayload) => void;
}

const SiteVisitsGridView: React.FC<IProps> = (props: IProps) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [customState, setCustomState] = useState<ICustomState>({
    currentIndex: 0,
    dropdownValue: 1,
    pillars: [],
  });
  const { currentIndex } = customState;
  const { getAssetVisit, setVisitType, clearVisits, setVisitIds } = AssetActions;
  const visits = useSelector((state: IState) => AssetSelectors.getAssetVisitsByDate(state));
  const asset = useSelector((state: IState) => PortfolioSelectors.getCurrentAssetPayload(state));
  const isLoading = useSelector((state: IState) => AssetSelectors.getVisitLoadingState(state));
  useEffect(() => {
    getRatingPillars().then();
    getVisitsData();
  }, []);

  useEffect(() => {
    getVisitsData();
  }, [currentIndex]);

  const getRatingPillars = async (): Promise<void> => {
    try {
      const pillars = await CommonRepository.getPillars(PillarTypes.LISTING_REVIEW);
      setCustomState((state) => {
        return {
          ...state,
          pillars,
        };
      });
      // eslint-disable-next-line no-empty
    } catch (err) {}
  };
  const getVisitsData = (): void => {
    const { setVisitPayload } = props;
    const { dropdownValue } = customState;
    const currentRoute = VisitRoutes[currentIndex];
    const payload: IAssetVisitPayload | null = VisitUtils.getVisitPayload({
      assetPayload: asset,
      dropdownValue,
      isFromProperty: false,
      visitType: currentRoute.key,
      setVisitPayload,
    });

    if (!payload) return;

    dispatch(getAssetVisit(payload));
  };
  const getVisitStatus = (): number | null => {
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
  const handleIndexChange = (index: number): void => {
    const { key } = VisitRoutes[index];
    setVisitType(key);
    clearVisits();
    setCustomState((state) => {
      return { ...state, currentIndex: index, dropdownValue: 1 };
    });
  };

  const handleInvalidVisit = (): void => {
    AlertHelper.error({ message: t('property:inValidVisit') });
  };

  const onDropdownValueSelect = (startDate: string, endDate: string, visitType: Tabs): void => {
    const { setVisitPayload } = props;

    const payload = VisitUtils.onDropdownValueSelect({
      assetPayload: asset,
      visitType,
      startDate,
      endDate,
      isFromProperty: false,
      setVisitPayload,
    });

    if (!payload) return;

    dispatch(getAssetVisit(payload));
  };

  const handleDropdownSelection = (value: string | number, visitType: Tabs): void => {
    const currentDate = DateUtils.getCurrentDateISO();
    setCustomState((state) => {
      return {
        ...state,
        dropdownValue: value as number,
      };
    });
    const data = VisitUtils.getDropdownData(visitType);
    const selectedData = data.find((item) => item.value === (value as number));
    if (selectedData) {
      const fromDate =
        visitType === Tabs.UPCOMING && selectedData.startDate < currentDate ? currentDate : selectedData.startDate;
      onDropdownValueSelect(fromDate, selectedData.endDate, visitType);
    }
  };

  const handleVisitActions = async (param: IVisitActionParam): Promise<void> => {
    const { action, isValidVisit } = param;
    if (!action) return;

    if (!isValidVisit) {
      handleInvalidVisit();
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
      //   if (isUserView) {   // Write logic to open UserDetail Popover instead of BottomSheet
      //     const {
      //       userDetail: {
      //         user: { id },
      //       },
      //     } = customState;
      //     this.onShowProfile(id);
      //   } else {
      onCloseModal();
      getVisitsData();
    } catch (e: any) {
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(e) });
    }
  };

  const onShowProfile = (id: number): void => {
    UserRepository.getUserInteractions(id)
      .then((response) => {
        // this.setState({ // Write logic to open UserDetail Popover instead of BottomSheet
        //   isProfileVisible: true,
        //   userDetail: response,
        // });
      })
      .catch((e) => {
        AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
      });
  };

  const handleRescheduleVisit = (argsAsset: AssetVisit, key: Tabs, userId?: number): void => {
    const { onReschedule } = props;
    const { id, leaseListing, saleListing, isValidVisit } = argsAsset;
    dispatch(setVisitIds([id]));
    const param = {
      ...(leaseListing && leaseListing > 0 && { lease_listing_id: leaseListing }),
      ...(saleListing && saleListing > 0 && { sale_listing_id: saleListing }),
    };
    if (!isValidVisit) {
      handleInvalidVisit();
      return;
    }
    if (key === Tabs.COMPLETED) {
      onReschedule({ ...param, userId }, true);
    } else {
      onReschedule(param, false);
    }
  };

  const handleConfirmation = (param: IVisitActionParam): void => {
    const { isValidVisit, id, isUserView } = param;
    if (!isValidVisit) {
      handleInvalidVisit();
      return;
    }

    setParamsVisitAction({
      id,
      action: VisitActions.CANCEL,
      isValidVisit,
      isUserView,
    });
    setIsPopoverActive(true);
  };

  const renderScene = ({ route }: { route: IRoutes }): React.ReactElement | null => {
    const { dropdownValue, pillars } = customState;
    let dropdownData;
    switch (route.key) {
      case Tabs.UPCOMING:
        dropdownData = VisitUtils.getDropdownData(Tabs.UPCOMING);
        return (
          <View>
            <PropertyVisitList
              visitType={route.key}
              visitData={visits}
              dropdownData={dropdownData}
              dropdownValue={dropdownValue}
              isLoading={isLoading}
              handleAction={handleVisitActions}
              handleReschedule={(item: AssetVisit): void => handleRescheduleVisit(item, Tabs.UPCOMING)}
              handleDropdown={handleDropdownSelection}
              handleUserView={onShowProfile}
              handleConfirmation={handleConfirmation}
            />
          </View>
        );
      case Tabs.MISSED:
        dropdownData = VisitUtils.getDropdownData(Tabs.MISSED);
        return (
          <View>
            <PropertyVisitList
              visitType={route.key}
              visitData={visits}
              isLoading={isLoading}
              dropdownValue={dropdownValue}
              dropdownData={dropdownData}
              handleAction={handleVisitActions}
              handleReschedule={(item: AssetVisit): void => handleRescheduleVisit(item, Tabs.MISSED)}
              handleDropdown={handleDropdownSelection}
              handleUserView={onShowProfile}
              handleConfirmation={handleConfirmation}
            />
          </View>
        );
      case Tabs.COMPLETED:
        dropdownData = VisitUtils.getDropdownData(Tabs.COMPLETED);
        return (
          <View>
            <PropertyVisitList
              visitType={route.key}
              visitData={visits}
              isLoading={isLoading}
              dropdownValue={dropdownValue}
              dropdownData={dropdownData}
              handleAction={handleVisitActions}
              handleReschedule={(item: AssetVisit, userId: number | undefined): void =>
                // eslint-disable-next-line prettier/prettier
                handleRescheduleVisit(item, Tabs.COMPLETED, userId)
              }
              handleDropdown={handleDropdownSelection}
              handleUserView={onShowProfile}
              pillars={pillars}
              resetData={getVisitsData}
              handleConfirmation={handleConfirmation}
              //   reviewVisitId={reviewVisitId} // When Navigated from Notifications
            />
          </View>
        );
      default:
        return <EmptyState icon={icons.schedule} title={t('property:noVisits')} />;
    }
  };

  const [isPopoverActive, setIsPopoverActive] = useState(false);
  const [paramsVisitAction, setParamsVisitAction] = useState({} as IVisitActionParam);

  const popupRef = useRef<PopupActions>(null);
  const onOpenModal = (): void => {
    if (popupRef && popupRef.current) {
      popupRef.current.open();
    }
  };
  const onCloseModal = (): void => {
    if (popupRef && popupRef.current) {
      setIsPopoverActive(false);
      popupRef.current.close();
    }
  };

  useEffect(() => {
    if (isPopoverActive) {
      onOpenModal();
    }
  }, [isPopoverActive]);

  const statusIndex = getVisitStatus();
  return (
    <View>
      <TabView
        initialLayout={theme.viewport}
        style={styles.tabView}
        renderScene={renderScene}
        onIndexChange={handleIndexChange}
        renderTabBar={(tabProps): React.ReactElement => {
          const {
            navigationState: { index, routes },
          } = tabProps;
          const currentRoute = routes[index];
          return (
            <TabBar
              {...tabProps}
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
      <SiteVisitsActionsPopover
        popupRef={popupRef}
        onCloseModal={onCloseModal}
        siteVisitActionType={SiteVisitAction.CANCEL}
        paramsVisitAction={paramsVisitAction}
        handleVisitActions={handleVisitActions}
      />
    </View>
  );
};

export default SiteVisitsGridView;

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: theme.colors.white,
    marginTop: 10,
  },
  tabLabel: {
    color: theme.colors.darkTint3,
  },
  tabView: {
    backgroundColor: theme.colors.white,
  },
});
