import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { DateFormats, DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { Rating } from '@homzhub/common/src/components/atoms/Rating';
import { Label, Text } from '@homzhub/common/src/components/atoms/Text';
import { AddressWithVisitDetail } from '@homzhub/common/src/components/molecules/AddressWithVisitDetail';
import { Avatar } from '@homzhub/common/src/components/molecules/Avatar';
import { BottomSheet } from '@homzhub/common/src/components/molecules/BottomSheet';
import { AssetVisit, IVisitActions, RoleType, VisitActions } from '@homzhub/common/src/domain/models/AssetVisit';
import { IVisitActionParam, VisitStatus } from '@homzhub/common/src/domain/repositories/interfaces';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { Tabs } from '@homzhub/common/src/constants/Tabs';

// CONSTANTS
const confirmation = ['Yes', 'No'];
// END CONSTANTS

interface IProps {
  visit: AssetVisit;
  visitType?: Tabs;
  isFromVisitScreen?: boolean;
  isUserView?: boolean;
  isRightIcon?: boolean;
  onPressReview?: (visit: AssetVisit) => void;
  handleUserView?: (id: number) => void;
  handleReschedule: (visit: AssetVisit, userId?: number) => void;
  handleConfirmation?: (param: IVisitActionParam) => void;
  handleAction: (param: IVisitActionParam) => void;
  navigateToAssetDetails: (listingId: number, assetId: number, isValidVisit: boolean) => void;
  mainContainerStyles?: StyleProp<ViewStyle>;
}

const VisitCard = (props: IProps): React.ReactElement => {
  const {
    visit: {
      id,
      asset,
      isAssetOwner,
      startDate,
      endDate,
      actions,
      comments,
      status,
      role,
      user,
      updatedAt,
      createdAt,
      saleListing,
      leaseListing,
      isValidVisit,
      review,
    },
    visit,
    visitType,
    isUserView,
    onPressReview,
    handleReschedule,
    handleUserView,
    handleAction,
    handleConfirmation,
    navigateToAssetDetails,
    isFromVisitScreen = true,
    isRightIcon = true,
    mainContainerStyles,
  } = props;
  const { t } = useTranslation(LocaleConstants.namespacesKey.property);
  const [isCancelSheet, setCancelSheet] = useState(false);
  const [currentVisitId, setVisitId] = useState(0);

  const containerStyle = [isFromVisitScreen && styles.container, actions.length > 1 && styles.newVisit];
  const listingId = saleListing === 0 || !saleListing ? leaseListing : saleListing;

  const onReschedule = (): void => handleReschedule(visit, user.id);
  const onPressIcon = (): void => handleUserView && handleUserView(user.id);
  const onNavigation = (): void => navigateToAssetDetails(listingId ?? 0, asset.id, isValidVisit);

  const getUserVisitStatus = (): Tabs => {
    const formattedDate = DateUtils.getDisplayDate(startDate, DateFormats.ISO24Format);
    const currentDate = DateUtils.getDisplayDate(new Date().toISOString(), DateFormats.ISO24Format);
    const dateDiff = DateUtils.getDateDiff(formattedDate, currentDate);
    if (dateDiff > 0) {
      return Tabs.UPCOMING;
    }
    if (dateDiff < 0 && status === VisitStatus.PENDING) {
      return Tabs.MISSED;
    }
    return Tabs.COMPLETED;
  };

  const getUserRole = (): string => {
    switch (role) {
      case RoleType.PROPERTY_AGENT:
        return t('propertyAgent');
      case RoleType.BUYER:
        return t('buyer');
      case RoleType.TENANT:
        return t('tenant');
      case RoleType.OWNER:
        return t('owner');
      default:
        return role;
    }
  };

  const getVisitStatus = (): IVisitActions | null => {
    switch (status) {
      case VisitStatus.ACCEPTED:
        return {
          title: t('visitScheduled'),
          color: theme.colors.green,
          icon: icons.circularCheckFilled,
        };
      case VisitStatus.REJECTED:
        return {
          title: t('visitDeclined'),
          color: theme.colors.error,
          icon: icons.circularCrossFilled,
        };
      case VisitStatus.CANCELLED:
        return {
          title: t('visitCancelled'),
          color: theme.colors.error,
          icon: icons.circularCrossFilled,
        };
      case VisitStatus.PENDING:
        return {
          title: t('awaiting'),
          color: theme.colors.darkTint3,
          icon: icons.watch,
        };
      default:
        return null;
    }
  };

  const getActions = (action: string): IVisitActions | null => {
    const { APPROVE, REJECT, CANCEL } = VisitActions;
    switch (action) {
      case APPROVE:
        return {
          title: t('common:accept'),
          color: theme.colors.green,
          icon: icons.circularCheckFilled,
          action: (actionId): void =>
            handleAction({
              id: actionId,
              action: VisitActions.APPROVE,
              isValidVisit,
            }),
        };
      case REJECT:
        return {
          title: t('common:reject'),
          color: theme.colors.error,
          icon: icons.circularCrossFilled,
          action: (actionId): void =>
            handleAction({
              id: actionId,
              action: VisitActions.REJECT,
              isValidVisit,
            }),
        };
      case CANCEL:
        return {
          title: t('common:cancel'),
          color: theme.colors.error,
          action: (actionId): void =>
            handleConfirmation ? handleConfirmation({ id: actionId, isValidVisit }) : handleVisitCancel(actionId),
        };
      default:
        return null;
    }
  };

  const handleVisitCancel = (actionId: number): void => {
    if (!isValidVisit) {
      AlertHelper.error({ message: t('property:inValidVisit') });
      return;
    }
    setCancelSheet(true);
    setVisitId(actionId);
  };

  const onPressConfirmation = (item: string): void => {
    if (item === 'Yes') {
      handleAction({
        id: currentVisitId,
        action: VisitActions.CANCEL,
        // Setting to true explicitly since bottomsheet will open only when visit is valid.
        isValidVisit: true,
      });
    }
    onCancelSheet();
  };

  const onCancelSheet = (): void => {
    setCancelSheet(false);
  };

  const userVisitStatus = visitType ?? getUserVisitStatus();
  const isMissed = userVisitStatus === Tabs.MISSED;
  const isCompleted = userVisitStatus === Tabs.COMPLETED;

  const renderUpcomingView = (): React.ReactElement => {
    const visitStatus = getVisitStatus();
    const isSmallerView = (visitStatus?.title?.length ?? 0) > 16 && theme.viewport.width < 350;
    return (
      <>
        <Divider containerStyles={styles.dividerStyle} />
        <View style={[isSmallerView ? styles.buttonSmallerView : styles.buttonView]}>
          {actions?.length < 2 && (
            <Button
              type="secondary"
              icon={visitStatus?.icon}
              iconColor={visitStatus?.color}
              iconSize={20}
              title={visitStatus?.title}
              containerStyle={[styles.statusView, !PlatformUtils.isWeb() && { flex: 0 }]}
              titleStyle={[styles.statusTitle, { color: visitStatus?.color }]}
              maxLength={18}
            />
          )}
          {actions?.map((action: string, index: number): React.ReactElement | null => {
            const actionData = getActions(action);
            if (!actionData) return null;
            const onPressButton = (): void => actionData.action && actionData.action(id);
            return (
              <Button
                key={index}
                type="secondary"
                icon={actionData.icon}
                iconColor={actionData.color}
                iconSize={20}
                onPress={onPressButton}
                title={actionData.title}
                containerStyle={[styles.statusView, isSmallerView && styles.smallStatusView]}
                titleStyle={[styles.actionTitle, { color: actionData.color }]}
              />
            );
          })}
        </View>
      </>
    );
  };

  const renderCompletedButtons = (): React.ReactNode => {
    if (isAssetOwner && !review) return null;
    const onPress = (): void => onPressReview && onPressReview(visit);

    return (
      <>
        <Divider containerStyles={styles.dividerStyle} />
        {/* // eslint-disable-next-line react-native/no-inline-styles */}
        <View style={[styles.buttonContainer, { flexDirection: !review ? 'row' : 'column' }]}>
          {!review ? (
            <TouchableOpacity style={styles.writeReviewButton} onPress={onPress}>
              <Label textType="semiBold" type="regular" style={styles.writeReviewText}>
                {t('writeReview')}
              </Label>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={onPress}>
              <Rating isOverallRating value={review?.rating ?? 0} />
            </TouchableOpacity>
          )}
        </View>
      </>
    );
  };

  const renderCancelConfirmation = (): React.ReactElement => {
    return (
      <BottomSheet visible={isCancelSheet} headerTitle={t('cancelVisit')} onCloseSheet={onCancelSheet}>
        <View style={styles.sheetContent}>
          <Text type="small" style={{ color: theme.colors.darkTint1 }}>
            {t('wantCancelVisit')}
          </Text>
          <View style={styles.sheetButtonView}>
            {confirmation.map((item, index) => {
              return (
                <Button
                  type="secondary"
                  key={index}
                  title={item}
                  onPress={(): void => onPressConfirmation(item)}
                  containerStyle={item === 'Yes' ? styles.yesButton : styles.confirmationContainer}
                  titleStyle={item === 'Yes' ? styles.yesText : styles.confirmationTitle}
                />
              );
            })}
          </View>
        </View>
      </BottomSheet>
    );
  };

  return (
    <>
      <View style={[isFromVisitScreen && styles.mainContainer, mainContainerStyles]}>
        <View style={[containerStyle]}>
          {!isUserView && (
            <Avatar
              fullName={user.name}
              isRightIcon={isRightIcon}
              onPressRightIcon={onPressIcon}
              designation={getUserRole()}
              date={updatedAt ?? createdAt}
              image={user.profilePicture}
              containerStyle={styles.avatar}
            />
          )}
          <AddressWithVisitDetail
            primaryAddress={asset.projectName}
            subAddress={asset.address}
            startDate={startDate}
            isPropertyOwner={isAssetOwner}
            endDate={endDate}
            comments={comments}
            isMissedVisit={isMissed}
            isCompletedVisit={isCompleted}
            onPressSchedule={onReschedule}
            containerStyle={styles.horizontalStyle}
            navigateToAssetDetails={onNavigation}
          />
          {userVisitStatus === Tabs.UPCOMING && renderUpcomingView()}
          {userVisitStatus === Tabs.COMPLETED && renderCompletedButtons()}
        </View>
      </View>
      {!PlatformUtils.isWeb() && renderCancelConfirmation()}
    </> // Popover for Cancel Visit
  );
};

export default VisitCard;

const styles = StyleSheet.create({
  mainContainer: {
    marginVertical: 10,
    marginHorizontal: 16,
  },
  container: {
    borderWidth: 1,
    borderRadius: 5,
    paddingVertical: 16,
    borderColor: theme.colors.darkTint10,
  },
  newVisit: {
    borderWidth: 0,
    backgroundColor: theme.colors.moreSeparator,
  },
  dividerStyle: {
    backgroundColor: theme.colors.background,
    marginVertical: 16,
  },
  buttonView: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginHorizontal: 16,
  },
  buttonSmallerView: {
    alignItems: 'flex-start',
    marginHorizontal: 16,
  },
  statusView: {
    borderWidth: 0,
    flexDirection: 'row-reverse',
    backgroundColor: theme.colors.transparent,
  },
  statusTitle: {
    marginVertical: 0,
    marginHorizontal: 6,
  },
  actionTitle: {
    marginVertical: 0,
    marginHorizontal: 16,
  },
  horizontalStyle: {
    marginHorizontal: 16,
  },
  sheetContent: {
    alignSelf: 'center',
  },
  sheetButtonView: {
    flexDirection: 'row',
    marginTop: 24,
  },
  confirmationContainer: {
    marginHorizontal: 6,
  },
  yesButton: {
    backgroundColor: theme.colors.error,
    borderColor: theme.colors.error,
  },
  yesText: {
    color: theme.colors.white,
  },
  confirmationTitle: {
    marginVertical: 0,
    paddingVertical: 8,
  },
  avatar: {
    paddingHorizontal: 10,
    marginBottom: 8,
  },
  smallStatusView: {
    marginRight: 10,
    marginTop: 4,
  },
  writeReviewButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: theme.colors.lightGrayishBlue,
  },
  writeReviewText: {
    color: theme.colors.primaryColor,
  },
  buttonContainer: {
    marginHorizontal: 12,
  },
});
