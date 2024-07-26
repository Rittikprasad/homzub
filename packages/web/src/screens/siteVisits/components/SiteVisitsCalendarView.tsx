import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { groupBy } from "lodash";
import { AlertHelper } from "@homzhub/common/src/utils/AlertHelper";
import { DateFormats, DateUtils } from "@homzhub/common/src/utils/DateUtils";
import { ErrorUtils } from "@homzhub/common/src/utils/ErrorUtils";
import { FunctionUtils } from "@homzhub/common/src/utils/FunctionUtils";
import { useOnly } from "@homzhub/common/src/utils/MediaQueryUtils";
import { StringUtils } from "@homzhub/common/src/utils/StringUtils";
import { AssetActions } from "@homzhub/common/src/modules/asset/actions";
import { AssetSelectors } from "@homzhub/common/src/modules/asset/selectors";
import { icons } from "@homzhub/common/src/assets/icon";
import { theme } from "@homzhub/common/src/styles/theme";
import { Badge } from "@homzhub/common/src/components/atoms/Badge";
import { Button } from "@homzhub/common/src/components/atoms/Button";
import { Divider } from "@homzhub/common/src/components/atoms/Divider";
import { EmptyState } from "@homzhub/common/src/components/atoms/EmptyState";
import { Avatar } from "@homzhub/common/src/components/molecules/Avatar";
import { Loader } from "@homzhub/common/src/components/atoms/Loader";
import { AddressWithVisitDetail } from "@homzhub/common/src/components/molecules/AddressWithVisitDetail";
// import EventWithProfile from '@homzhub/mobile/src/components/molecules/EventWithProfile';
import {
  AssetVisit,
  ISlotItem,
  IVisitByKey,
} from "@homzhub/common/src/domain/models/AssetVisit";
import { IState } from "@homzhub/common/src/modules/interfaces";
import {
  IAssetVisitPayload,
  IBookVisitProps,
  VisitStatus,
} from "@homzhub/common/src/domain/repositories/interfaces";
import { ILabelColor } from "@homzhub/common/src/domain/models/LabelColor";
import { UserRepository } from "@homzhub/common/src/domain/repositories/UserRepository";
import { UserInteraction } from "@homzhub/common/src/domain/models/UserInteraction";
import { Typography } from "@homzhub/common/src/components/atoms/Typography";
import { TimeSlot } from "@homzhub/common/src/constants/ContactFormData";
import { Tabs } from "@homzhub/common/src/constants/Tabs";
import CalendarWeb from "@homzhub/web/src/components/atoms/Calendar/CalendarWeb";
import { deviceBreakpoint } from "@homzhub/common/src/constants/DeviceBreakpoints";

interface IProps {
  onReschedule: (param: IBookVisitProps, isNew?: boolean) => void;
  selectedAssetId: number;
  setVisitPayload: (payload: IAssetVisitPayload) => void;
}

interface ICustomState {
  selectedDate: Date;
  transformedDate: string;
  timeSlot: ISlotItem[];
  isCalendarVisible: boolean;
  isProfileVisible: boolean;
  selectedSlot: number;
  visitsData: IVisitByKey[][];
  userDetail: UserInteraction;
}

type Props = IProps;

const SiteVisitsCalendarView: React.FC<Props> = (props: Props) => {
  const allSlot = { id: 0, from: 0, to: 0, icon: "", formatted: "All" };

  const [customState, setCustomState] = useState<ICustomState>({
    selectedDate: new Date(),
    transformedDate: DateUtils.getUtcFormattedDate(
      new Date().toDateString(),
      DateFormats.DD_MMMMYYYY
    ),
    timeSlot: [allSlot].concat(TimeSlot),
    isCalendarVisible: false,
    isProfileVisible: false,
    selectedSlot: 0,
    visitsData: [],
    userDetail: {} as UserInteraction,
  });

  const dispatch = useDispatch();
  const { getAssetVisit, setVisitIds } = AssetActions;
  const { t } = useTranslation();
  const visits = useSelector((state: IState) =>
    AssetSelectors.getVisitsByAsset(state)
  );
  const isLoading = useSelector((state: IState) =>
    AssetSelectors.getVisitLoadingState(state)
  );
  const { selectedDate, transformedDate, selectedSlot, timeSlot } = customState;
  console.log("this is selectedDate 8888888888888888888", selectedDate);

  useEffect(() => {
    getVisitsData();
  }, [transformedDate, selectedSlot]);

  const renderTimeSlot = (): React.ReactElement => {
    return (
      <View style={[styles.slotsGrid, !isDesktop && styles.slotsScroll]}>
        {timeSlot.map((slot, index) => {
          const onSelectSlot = (): void => handleSlotSelection(slot.id);
          const isSelected = selectedSlot === slot.id;
          return (
            <View style={styles.slotItem} key={slot.id + slot.from}>
              <Button
                key={index}
                type="secondary"
                icon={slot.icon}
                iconColor={
                  isSelected ? theme.colors.white : theme.colors.darkTint4
                }
                iconSize={16}
                title={slot.formatted}
                onPress={onSelectSlot}
                titleStyle={[
                  styles.slotTitle,
                  isSelected && styles.selectedTitle,
                ]}
                containerStyle={[
                  styles.slotButton,
                  isSelected && styles.selectedSlot,
                ]}
              />
            </View>
          );
        })}
      </View>
    );
  };

  const renderVisits = (visit: IVisitByKey): React.ReactElement => {
    const { key, results } = visit;
    const visitData = results as AssetVisit[];
    const visitByStatus = getVisitByStatus(visitData);

    return (
      <View style={styles.visitCard}>
        <AddressWithVisitDetail
          primaryAddress={key}
          navigateToAssetDetails={FunctionUtils.noop}
          subAddress={visitData[0].asset.address}
          startDate={visitData[0].startDate}
          endDate={visitData[0].endDate}
          isPropertyOwner={visitData[0].isAssetOwner}
          onPressSchedule={(): void => handleRescheduleAll(visitData)}
          containerStyle={styles.addressView}
          isRescheduleAll
        />
        <Divider containerStyles={styles.dividerStyle} />
        <View style={styles.userView}>
          {visitByStatus.map((visitItem, index) => {
            const { key: status, results: assetResults } = visitItem;
            const assetVisit = assetResults as AssetVisit[];
            const badge = getBadgesData(status);
            return (
              <>
                {badge && (
                  <Badge
                    title={badge.label}
                    badgeColor={badge.color as string}
                    badgeStyle={styles.badge}
                  />
                )}
                {assetVisit.map((item) => {
                  const designation = item.role.replace("_", " ");
                  return (
                    <>
                      <Avatar
                        isRightIcon
                        key={item.id}
                        fullName={item.user.name}
                        designation={StringUtils.toTitleCase(designation)}
                        date={item.updatedAt ?? item.createdAt}
                        image={item.user.profilePicture}
                        onPressRightIcon={(): void =>
                          onShowProfile(item.user.id)
                        }
                        containerStyle={styles.avatar}
                      />
                      {results.length - 1 !== index && (
                        <Divider containerStyles={styles.dividerStyle} />
                      )}
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

  const onShowProfile = (id: number): void => {
    UserRepository.getUserInteractions(id)
      .then((response) => {
        setCustomState((state) => {
          return {
            ...state,
            isProfileVisible: true,
            userDetail: response,
          };
        });
      })
      .catch((e) => {
        AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
      });
  };

  const onCloseProfile = (): void => {
    setCustomState((state) => {
      return {
        ...state,
        isProfileVisible: false,
      };
    });
  };

  const onSelectDate = (argDate: Date, argFormattedDate: string): void => {
    setCustomState((state) => {
      return {
        ...state,
        selectedDate: argDate,
        transformedDate: DateUtils.getDisplayDate(
          argFormattedDate,
          DateFormats.DD_MMMMYYYY
        ),
        isCalendarVisible: false,
        selectedSlot: 0,
      };
    });
  };

  const handleInvalidVisit = (): void => {
    onCloseProfile();
    AlertHelper.error({ message: t("property:inValidVisit") });
  };

  // const showConfirmation = (param: IVisitActionParam): void => { TODO: User Profile Story
  //     const { id, isValidVisit, isUserView } = param;

  //     if (!isValidVisit) {
  //         handleInvalidVisit();
  //         return;
  //     }

  //     AlertHelper.alert({
  //         title: t('cancelVisit'),
  //         message: t('wantCancelVisit'),
  //         onOkay: () =>
  //             handleVisitActions({
  //                 id,
  //                 action: VisitActions.CANCEL,
  //                 isValidVisit,
  //                 isUserView,
  //             }).then(),
  //     });
  // };

  // const handleSchedule = (asset: AssetVisit): void => { TODO: User Profile Story
  //     const { onReschedule } = props;
  //     const { id, leaseListing, saleListing, isValidVisit } = asset;
  //     if (!isValidVisit) {
  //         handleInvalidVisit();
  //         return;
  //     }

  //     const param = {
  //         ...(leaseListing && leaseListing > 0 && { lease_listing_id: leaseListing }),
  //         ...(saleListing && saleListing > 0 && { sale_listing_id: saleListing }),
  //     };

  //     dispatch(setVisitIds([id]));
  //     dispatch(getAssetVisit({ id }));
  //     onReschedule(param, false);
  //     onCloseProfile();
  // };

  // const handleVisitActions = async (param: IVisitActionParam): Promise<void> => { TODO: User Profile Story
  //     const { action, isValidVisit } = param;
  //     const {
  //         userDetail: {
  //             user: { id },
  //         },
  //     } = customState;
  //     if (!action) return;
  //     if (!isValidVisit) {
  //         handleInvalidVisit();
  //         return;
  //     }
  //     const payload: IUpdateVisitPayload = {
  //         id: param.id,
  //         data: {
  //             status: action,
  //         },
  //     };

  //     try {
  //         await AssetRepository.updatePropertyVisit(payload);
  //         onShowProfile(id);
  //     } catch (e) {
  //         AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
  //     }
  // };

  const getBadgesData = (status: string): ILabelColor | null => {
    const date = DateUtils.getUtcFormatted(
      transformedDate,
      DateFormats.DD_MMMMYYYY,
      DateFormats.YYYYMMDD
    );
    const todayDate = DateUtils.getDisplayDate(
      new Date().toDateString(),
      DateFormats.YYYYMMDD
    );
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

  const getVisitByStatus = (visitData: AssetVisit[]): IVisitByKey[] => {
    const groupData = groupBy(visitData, (result) => result.status);
    return Object.keys(groupData).map((key) => {
      const results = groupData[key];
      return {
        key,
        results,
      };
    });
  };

  const getVisitsData = (): void => {
    const payload: IAssetVisitPayload = setCalendarVisitPayload();
    dispatch(getAssetVisit(payload));
  };

  const setCalendarVisitPayload = (): IAssetVisitPayload => {
    const { selectedAssetId, setVisitPayload } = props;
    const date = DateUtils.getUtcFormatted(
      transformedDate,
      DateFormats.DD_MMMYYYY,
      DateFormats.YYYYMMDD
    );
    let start_datetime = "";
    if (selectedSlot > 0) {
      timeSlot.forEach((item) => {
        if (item.id === selectedSlot) {
          const formattedDate = DateUtils.getISOFormattedDate(date, item.from);
          start_datetime = DateUtils.getUtcFormatted(
            formattedDate,
            DateFormats.YYYYMMDD_HM,
            DateFormats.ISO24Format
          );
        }
      });
    }

    const payload = {
      ...(selectedSlot === 0 && { start_date: date }),
      ...(selectedSlot > 0 && { start_datetime }),
      ...(selectedAssetId !== 0 && { asset_id: selectedAssetId }),
    };
    setVisitPayload(payload);
    return payload;
  };

  const handleSlotSelection = (value: string | number): void => {
    setCustomState((state) => {
      return {
        ...state,
        selectedSlot: value as number,
      };
    });
  };

  const handleRescheduleAll = (results: AssetVisit[]): void => {
    const { onReschedule } = props;
    const visitIds: number[] = [];
    results.forEach((visit) => {
      visitIds.push(visit.id);
    });
    const { leaseListing, saleListing, isValidVisit } = results[0];
    const param = {
      ...(leaseListing &&
        leaseListing > 0 && { lease_listing_id: leaseListing }),
      ...(saleListing && saleListing > 0 && { sale_listing_id: saleListing }),
    };
    if (!isValidVisit) {
      handleInvalidVisit();
      return;
    }
    dispatch(setVisitIds(visitIds));
    onReschedule(param);
  };

  const isDesktop = useOnly(deviceBreakpoint.DESKTOP);
  const isTablet = useOnly(deviceBreakpoint.TABLET);

  return (
    <View style={[styles.container, isDesktop && styles.containerWeb]}>
      <View
        style={[
          styles.subContainerCalendar,
          isDesktop && styles.subContainerCalendarWeb,
          isTablet && styles.subContainerCalendarTab,
        ]}
      >
        <View style={styles.calendarParentContainer}>
          <View style={styles.calendarTitle}>
            <Typography size="small" variant="text" fontWeight="bold">
              {t("common:selectDate")}
            </Typography>
          </View>
          <View
            style={[
              styles.containerCalendar,
              !isDesktop && styles.containerCalendarMobile,
            ]}
          >
            <CalendarWeb selectedValue={selectedDate} onSelect={onSelectDate} />
          </View>
        </View>
        <View style={styles.slotsContainer}>
          <View style={styles.slotsTitle}>
            <Typography size="small" variant="text" fontWeight="bold">
              {t("common:selectTimings")}
            </Typography>
          </View>
          {renderTimeSlot()}
        </View>
      </View>
      <View
        style={[
          styles.subContainerVisits,
          isDesktop && styles.subContainerVisitsWeb,
        ]}
      >
        {visits.length > 0 ? (
          <ScrollView
            style={styles.visitView}
            showsVerticalScrollIndicator={false}
          >
            {visits.map((visitItem: IVisitByKey[]) => {
              return visitItem.map((visit) => {
                return renderVisits(visit);
              });
            })}
          </ScrollView>
        ) : (
          <EmptyState icon={icons.schedule} title={t("property:noVisits")} />
        )}
      </View>
      {/* {!isEmpty(userDetail) && ( // TODO: Lakshit:  User Profile Story
          <BottomSheet
            visible={isProfileVisible}
            onCloseSheet={onCloseProfile}
            headerTitle={t('Profile')}
            isShadowView
            sheetHeight={600}
          >
            <EventWithProfile
              detail={userDetail}
              handleVisitAction={handleVisitActions}
              handleConfirmation={showConfirmation}
              handleReschedule={handleSchedule}
            />
          </BottomSheet>
        )} */}
      <Loader visible={isLoading} />
    </View>
  );
};

export default SiteVisitsCalendarView;

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
  },
  containerWeb: {
    flexDirection: "row",
  },
  subContainerCalendar: {
    borderWidth: 1,
    borderColor: theme.colors.divider,
  },
  subContainerCalendarWeb: {
    width: "40%",
  },
  subContainerCalendarTab: {
    alignItems: "center",
  },
  subContainerVisits: {
    width: "100%",
  },
  subContainerVisitsWeb: {
    width: "60%",
  },
  calendarParentContainer: {
    marginTop: 16,
  },
  containerCalendar: {
    marginLeft: 24,
  },
  containerCalendarMobile: {
    marginRight: 8,
    marginLeft: 8,
  },
  calendarTitle: {
    marginBottom: 16,
    marginLeft: 24,
  },
  slotsContainer: {
    marginRight: 4,
  },
  slotsTitle: {
    marginTop: 16,
    marginLeft: 24,
  },
  slotsGrid: {
    marginVertical: 16,
    marginHorizontal: 16,
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    flexWrap: "wrap",
  },
  slotsScroll: {
    overflow: "scroll",
    flexWrap: "nowrap",
  },
  slotItem: {
    marginVertical: 5,
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
    flexDirection: "row-reverse",
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
    alignSelf: "flex-start",
    paddingVertical: 4,
    paddingHorizontal: 14,
  },
});
