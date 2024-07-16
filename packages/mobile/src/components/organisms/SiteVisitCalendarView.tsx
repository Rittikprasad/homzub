import React, { Component } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { groupBy, isEmpty } from 'lodash';
import { withTranslation, WithTranslation } from 'react-i18next';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { DateFormats, DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { StringUtils } from '@homzhub/common/src/utils/StringUtils';
import { AssetActions } from '@homzhub/common/src/modules/asset/actions';
import { AssetSelectors } from '@homzhub/common/src/modules/asset/selectors';
import { AssetRepository } from '@homzhub/common/src/domain/repositories/AssetRepository';
import { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Badge } from '@homzhub/common/src/components/atoms/Badge';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { EmptyState } from '@homzhub/common/src/components/atoms/EmptyState';
import { Avatar } from '@homzhub/common/src/components/molecules/Avatar';
import CalendarHeader from '@homzhub/common/src/components/atoms/CalendarHeader';
import { CalendarComponent } from '@homzhub/mobile/src/components/atoms/CalendarComponent';
import { Loader } from '@homzhub/common/src/components/atoms/Loader';
import { AddressWithVisitDetail } from '@homzhub/common/src/components/molecules/AddressWithVisitDetail';
import { BottomSheet } from '@homzhub/common/src/components/molecules/BottomSheet';
import EventWithProfile from '@homzhub/mobile/src/components/molecules/EventWithProfile';
import { AssetVisit, ISlotItem, IVisitByKey, VisitActions } from '@homzhub/common/src/domain/models/AssetVisit';
import { IState } from '@homzhub/common/src/modules/interfaces';
import {
  IAssetVisitPayload,
  IBookVisitProps,
  IUpdateVisitPayload,
  IVisitActionParam,
  VisitStatus,
} from '@homzhub/common/src/domain/repositories/interfaces';
import { ILabelColor } from '@homzhub/common/src/domain/models/LeaseTransaction';
import { UserRepository } from '@homzhub/common/src/domain/repositories/UserRepository';
import { UserInteraction } from '@homzhub/common/src/domain/models/UserInteraction';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { TimeSlot } from '@homzhub/common/src/constants/ContactFormData';
import { Tabs } from '@homzhub/common/src/constants/Tabs';

interface IDispatchProps {
  getAssetVisit: (payload: IAssetVisitPayload) => void;
  setVisitIds: (payload: number[]) => void;
}

interface IStateProps {
  visits: IVisitByKey[][];
  isLoading: boolean;
}

interface IProps {
  onReschedule: (param: IBookVisitProps, isNew?: boolean) => void;
  selectedAssetId: number;
  navigateToAssetDetail: (listingId: number | null, id: number, isValidVisit: boolean) => void;
}

interface IScreenState {
  currentDate: string;
  timeSlot: ISlotItem[];
  isCalendarVisible: boolean;
  isProfileVisible: boolean;
  selectedSlot: number;
  visitsData: IVisitByKey[][];
  userDetail: UserInteraction;
}

const allSlot = { id: 0, from: 0, to: 0, icon: '', formatted: 'All' };

type Props = IProps & IDispatchProps & IStateProps & WithTranslation;

class SiteVisitCalendarView extends Component<Props, IScreenState> {
  public state = {
    currentDate: DateUtils.getUtcFormattedDate(new Date().toDateString(), DateFormats.DD_MMMMYYYY),
    timeSlot: [allSlot].concat(TimeSlot),
    isCalendarVisible: false,
    isProfileVisible: false,
    selectedSlot: 0,
    visitsData: [],
    userDetail: {} as UserInteraction,
  };

  public static getDerivedStateFromProps(props: Props, state: IScreenState): IScreenState | null {
    const { visits } = props;
    const { visitsData } = state;
    if (visits && visitsData) {
      return {
        ...state,
        visitsData: visits,
      };
    }

    return null;
  }

  public componentDidMount(): void {
    this.getVisitsData();
  }

  public render(): React.ReactNode {
    const { t, isLoading } = this.props;
    const { currentDate, isCalendarVisible, visitsData, isProfileVisible, userDetail } = this.state;
    const date = DateUtils.getUtcFormatted(currentDate, DateFormats.DD_MMMMYYYY, DateFormats.YYYYMMDD);
    return (
      <>
        <CalendarHeader
          headerTitle={currentDate}
          onMonthPress={this.handleFullCalendar}
          onNextPress={this.handleNextDay}
          onBackPress={this.handlePreviousDay}
        />
        {this.renderTimeSlot()}
        {visitsData.length > 0 ? (
          <ScrollView style={styles.visitView} showsVerticalScrollIndicator={false}>
            {visitsData.map((visitItem: IVisitByKey[]) => {
              return visitItem.map((visit) => {
                return this.renderVisits(visit);
              });
            })}
          </ScrollView>
        ) : (
          <EmptyState icon={icons.schedule} title={t('noVisits')} />
        )}
        <BottomSheet
          visible={isCalendarVisible}
          onCloseSheet={this.onCloseCalendar}
          headerTitle={t('maintenanceSchedule')}
          isShadowView
          sheetHeight={580}
        >
          <CalendarComponent allowPastDates selectedDate={date} onSelect={this.onSelectDate} />
        </BottomSheet>
        {!isEmpty(userDetail) && (
          <BottomSheet
            visible={isProfileVisible}
            onCloseSheet={this.onCloseProfile}
            headerTitle={t('Profile')}
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
        <Loader visible={isLoading} />
      </>
    );
  }

  private renderTimeSlot = (): React.ReactElement => {
    const { timeSlot, selectedSlot } = this.state;
    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollView}>
        {timeSlot.map((slot, index) => {
          const onSelectSlot = (): void => this.handleSlotSelection(slot.id);
          const isSelected = selectedSlot === slot.id;
          return (
            <Button
              key={index}
              type="secondary"
              icon={slot.icon}
              iconColor={isSelected ? theme.colors.white : theme.colors.darkTint4}
              iconSize={16}
              title={slot.formatted}
              onPress={onSelectSlot}
              titleStyle={[styles.slotTitle, isSelected && styles.selectedTitle]}
              containerStyle={[styles.slotButton, isSelected && styles.selectedSlot]}
            />
          );
        })}
      </ScrollView>
    );
  };

  private renderVisits = (visit: IVisitByKey): React.ReactElement => {
    const { navigateToAssetDetail } = this.props;
    const { key, results } = visit;
    const visitData = results as AssetVisit[];
    const visitByStatus = this.getVisitByStatus(visitData);

    const navigateToAssetDescription = (): void => {
      const { leaseListing, saleListing, isValidVisit, id } = visitData[0];
      const listingId = saleListing === 0 ? leaseListing : saleListing;
      navigateToAssetDetail(listingId, id, isValidVisit);
    };

    return (
      <View style={styles.visitCard}>
        <AddressWithVisitDetail
          primaryAddress={key}
          navigateToAssetDetails={navigateToAssetDescription}
          subAddress={visitData[0].asset.address}
          startDate={visitData[0].startDate}
          endDate={visitData[0].endDate}
          isPropertyOwner={visitData[0].isAssetOwner}
          onPressSchedule={(): void => this.handleRescheduleAll(visitData)}
          containerStyle={styles.addressView}
        />
        <Divider containerStyles={styles.dividerStyle} />
        <View style={styles.userView}>
          {visitByStatus.map((visitItem, index) => {
            const { key: status, results: assetResults } = visitItem;
            const assetVisit = assetResults as AssetVisit[];
            const badge = this.getBadgesData(status);
            return (
              <>
                {badge && <Badge title={badge.label} badgeColor={badge.color} badgeStyle={styles.badge} />}
                {assetVisit.map((item) => {
                  const designation = item.role.replace('_', ' ');
                  return (
                    <>
                      <Avatar
                        isRightIcon
                        key={item.id}
                        fullName={item.user.name}
                        designation={StringUtils.toTitleCase(designation)}
                        date={item.updatedAt ?? item.createdAt}
                        image={item.user.profilePicture}
                        onPressRightIcon={(): void => this.onShowProfile(item.user.id)}
                        containerStyle={styles.avatar}
                      />
                      {results.length - 1 !== index && <Divider containerStyles={styles.dividerStyle} />}
                    </>
                  );
                })}
              </>
            );
          })}
        </View>
      </View>
    );
  };

  private onCloseCalendar = (): void => {
    this.setState({
      isCalendarVisible: false,
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

  private onCloseProfile = (): void => {
    this.setState({
      isProfileVisible: false,
    });
  };

  private onSelectDate = (date: string): void => {
    this.setState(
      {
        currentDate: DateUtils.getDisplayDate(date, DateFormats.DD_MMMMYYYY),
        isCalendarVisible: false,
        selectedSlot: 0,
      },
      () => this.getVisitsData()
    );
  };

  private showConfirmation = (param: IVisitActionParam): void => {
    const { t } = this.props;
    const { id, isValidVisit, isUserView } = param;

    if (!isValidVisit) {
      this.handleInvalidVisit();
      return;
    }

    AlertHelper.alert({
      title: t('cancelVisit'),
      message: t('wantCancelVisit'),
      onOkay: () =>
        this.handleVisitActions({
          id,
          action: VisitActions.CANCEL,
          isValidVisit,
          isUserView,
        }).then(),
    });
  };

  private handleInvalidVisit = (): void => {
    const { t } = this.props;
    this.onCloseProfile();
    AlertHelper.error({ message: t('property:inValidVisit') });
  };

  private handleSchedule = (asset: AssetVisit): void => {
    const { onReschedule, setVisitIds, getAssetVisit } = this.props;
    const { id, leaseListing, saleListing, isValidVisit } = asset;
    if (!isValidVisit) {
      this.handleInvalidVisit();
      return;
    }

    const param = {
      ...(leaseListing && leaseListing > 0 && { lease_listing_id: leaseListing }),
      ...(saleListing && saleListing > 0 && { sale_listing_id: saleListing }),
    };

    setVisitIds([id]);
    getAssetVisit({ id });
    onReschedule(param, false);
    this.onCloseProfile();
  };

  private handleVisitActions = async (param: IVisitActionParam): Promise<void> => {
    const { action, isValidVisit } = param;
    const {
      userDetail: {
        user: { id },
      },
    } = this.state;
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
      this.onShowProfile(id);
    }catch (e: any) {      AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
    }
  };

  private getBadgesData = (status: string): ILabelColor | null => {
    const { currentDate } = this.state;
    const date = DateUtils.getUtcFormatted(currentDate, DateFormats.DD_MMMMYYYY, DateFormats.YYYYMMDD);
    const todayDate = DateUtils.getDisplayDate(new Date().toDateString(), DateFormats.YYYYMMDD);
    switch (status) {
      case VisitStatus.ACCEPTED:
        if (date > todayDate) {
          return {
            label: Tabs.UPCOMING,
            color: theme.colors.green,
          };
        }
        return {
          label: Tabs.COMPLETED,
          color: theme.colors.green,
        };
      case VisitStatus.PENDING:
        if (date < todayDate) {
          return {
            label: Tabs.MISSED,
            color: theme.colors.error,
          };
        }
        return {
          label: Tabs.UPCOMING,
          color: theme.colors.green,
        };
      case VisitStatus.CANCELLED:
        return {
          label: Tabs.CANCELLED,
          color: theme.colors.error,
        };
      case VisitStatus.REJECTED:
        return {
          label: Tabs.DECLINED,
          color: theme.colors.error,
        };
      default:
        return null;
    }
  };

  private getVisitByStatus = (visitData: AssetVisit[]): IVisitByKey[] => {
    const groupData = groupBy(visitData, (result) => result.status);
    return Object.keys(groupData).map((key) => {
      const results = groupData[key];
      return {
        key,
        results,
      };
    });
  };

  private getVisitsData = (): void => {
    const { getAssetVisit, selectedAssetId } = this.props;
    const { currentDate, selectedSlot, timeSlot } = this.state;
    const date = DateUtils.getUtcFormatted(currentDate, DateFormats.DD_MMMYYYY, DateFormats.YYYYMMDD);
    let start_datetime = '';
    if (selectedSlot > 0) {
      timeSlot.forEach((item) => {
        if (item.id === selectedSlot) {
          const formattedDate = DateUtils.getISOFormattedDate(date, item.from);
          start_datetime = DateUtils.getUtcFormatted(formattedDate, DateFormats.YYYYMMDD_HM, DateFormats.ISO24Format);
        }
      });
    }
    const payload: IAssetVisitPayload = {
      ...(selectedSlot === 0 && { start_date: date }),
      ...(selectedSlot > 0 && { start_datetime }),
      ...(selectedAssetId !== 0 && { asset_id: selectedAssetId }),
    };

    getAssetVisit(payload);
  };

  private handleNextDay = (): void => {
    const { currentDate } = this.state;
    this.setState(
      {
        currentDate: DateUtils.getNextDate(1, currentDate, DateFormats.DD_MMMMYYYY, DateFormats.DD_MMMMYYYY),
        selectedSlot: 0,
      },
      (): void => this.getVisitsData()
    );
  };

  private handlePreviousDay = (): void => {
    const { currentDate } = this.state;
    this.setState(
      {
        currentDate: DateUtils.getPreviousDate(1, currentDate, DateFormats.DD_MMMMYYYY, DateFormats.DD_MMMMYYYY),
        selectedSlot: 0,
      },
      (): void => this.getVisitsData()
    );
  };

  private handleFullCalendar = (): void => {
    this.setState((prevState) => {
      return {
        isCalendarVisible: !prevState.isCalendarVisible,
      };
    });
  };

  private handleSlotSelection = (value: string | number): void => {
    this.setState(
      {
        selectedSlot: value as number,
      },
      (): void => {
        this.getVisitsData();
      }
    );
  };

  private handleRescheduleAll = (results: AssetVisit[]): void => {
    const { setVisitIds, onReschedule } = this.props;
    const visitIds: number[] = [];
    results.forEach((visit) => {
      visitIds.push(visit.id);
    });
    const { leaseListing, saleListing, isValidVisit } = results[0];
    const param = {
      ...(leaseListing && leaseListing > 0 && { lease_listing_id: leaseListing }),
      ...(saleListing && saleListing > 0 && { sale_listing_id: saleListing }),
    };
    if (!isValidVisit) {
      this.handleInvalidVisit();
      return;
    }
    setVisitIds(visitIds);
    onReschedule(param);
  };
}

const mapStateToProps = (state: IState): IStateProps => {
  return {
    visits: AssetSelectors.getVisitsByAsset(state),
    isLoading: AssetSelectors.getVisitLoadingState(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { getAssetVisit, setVisitIds } = AssetActions;
  return bindActionCreators(
    {
      getAssetVisit,
      setVisitIds,
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation(LocaleConstants.namespacesKey.property)(SiteVisitCalendarView));

const styles = StyleSheet.create({
  scrollView: {
    marginVertical: 16,
    flexDirection: 'row',
  },
  slotTitle: {
    marginHorizontal: 10,
    marginVertical: 4,
    color: theme.colors.darkTint4,
  },
  selectedTitle: {
    color: theme.colors.white,
  },
  slotButton: {
    backgroundColor: theme.colors.background,
    borderWidth: 0,
    paddingHorizontal: 12,
    marginHorizontal: 10,
    flexDirection: 'row-reverse',
  },
  selectedSlot: {
    backgroundColor: theme.colors.blue,
  },
  visitView: {
    minHeight: 450,
    marginTop: 10,
  },
  visitCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: theme.colors.darkTint10,
  },
  addressView: {
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  dividerStyle: {
    borderColor: theme.colors.darkTint10,
    marginVertical: 10,
  },
  userView: {
    paddingHorizontal: 10,
    marginVertical: 16,
  },
  avatar: {
    marginVertical: 12,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 14,
  },
});
