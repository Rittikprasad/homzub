import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, TextStyle, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import { DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { I18nService } from '@homzhub//common/src/services/Localization/i18nextService';
import { StringUtils } from '@homzhub/common/src/utils/StringUtils';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Rating } from '@homzhub/common/src/components/atoms/Rating';
import { BottomSheet } from '@homzhub/common/src/components/molecules/BottomSheet';
import TicketReview from '@homzhub/common/src/components/organisms/ServiceTickets/TicketReview';
import { Ticket, TicketPriority, TicketStatus } from '@homzhub/common/src/domain/models/Ticket';
import { User } from '@homzhub/common/src/domain/models/User';
import { IUpdateTicket } from '@homzhub/common/src/domain/repositories/interfaces';
import { FFMTicketAction, TicketStatusTitle } from '@homzhub/common/src/constants/ServiceTickets';

interface IDataType {
  [key: string]: string;
}

interface IProps {
  cardData: Ticket;
  isOddElement: boolean;
  onCardPress: () => void;
  isFromMore?: boolean;
  onSubmitReview?: () => void;
  handleAction?: (payload: IUpdateTicket) => void;
  renderWebRating?: (children: React.ReactElement, onClose: () => void, isOpen: boolean) => React.ReactElement;
}

const getColor = (color: string, statusFFM?: string): string => {
  if (statusFFM === 'PENDING') {
    return theme.colors.error;
  }
  return color;
};

/* Get color for status  */
const getStatusColor = (type: string, statusFFM?: string): string => {
  switch (type) {
    case TicketStatus.OPEN:
      return getColor(theme.colors.red, statusFFM);
    case TicketStatus.QUOTE_REQUESTED:
      return getColor(theme.colors.blueTint5, statusFFM);
    case TicketStatus.QUOTE_SUBMITTED:
      return getColor(theme.colors.blueTint4, statusFFM);
    case TicketStatus.QUOTE_APPROVED:
      return getColor(theme.colors.greenTint6, statusFFM);
    case TicketStatus.PAYMENT_REQUESTED:
      return getColor(theme.colors.pinkRed, statusFFM);
    case TicketStatus.PAYMENT_DONE:
      return getColor(theme.colors.greenTint7, statusFFM);
    case TicketStatus.WORK_INITIATED:
      return getColor(theme.colors.blueTint3, statusFFM);
    case TicketStatus.CLOSED:
      return getColor(theme.colors.greenTint8, statusFFM);
    default:
      return theme.colors.darkTint3;
  }
};

/* Get color for card border  */
const cardColor = (type: string): string => {
  switch (type) {
    case TicketPriority.HIGH:
      return theme.colors.error;
    case TicketPriority.MEDIUM:
      return theme.colors.yellow;
    case TicketPriority.LOW:
      return theme.colors.blue;
    default:
      return theme.colors.darkTint3;
  }
};

/* Get values for card keys  */
const keyValue = (key: string, data: IDataType, ffmStatus?: string): string => {
  if (key === 'helpAndSupport:status') {
    if (ffmStatus === 'PENDING') {
      return I18nService.t('serviceTickets:approvalPending');
    }
    const status = data[key] as TicketStatus;
    // @ts-ignore
    return TicketStatusTitle[status];
  }
  return data[key];
};

export const TicketCard = (props: IProps): React.ReactElement => {
  const {
    cardData,
    onCardPress,
    isFromMore = false,
    onSubmitReview,
    isOddElement,
    renderWebRating,
    handleAction,
  } = props;
  const {
    id,
    title,
    createdAt,
    updatedAt,
    status,
    closedAt,
    closedBy,
    asset: { formattedAddressWithProjectAndCity },
    assignedTo: { fullName },
    assignedToRole,
    ffmStatus,
    ffmStatusUpdatedAt,
    ffmStatusUpdatedBy,
    overallRating,
  } = cardData;

  const { t } = useTranslation();
  const user = useSelector(UserSelector.getUserProfile);

  const isClosed = status === TicketStatus.CLOSED;
  const isRejected = ffmStatus === 'REJECTED';
  const isAcceptedClosed = ffmStatus === 'ACCEPTED_AND_CLOSED';

  // Data formation for closed and open tickets
  const openTicket = {
    'serviceTickets:createdOn': DateUtils.convertDateFormatted(createdAt),
    'serviceTickets:updatedOn': DateUtils.convertDateFormatted(updatedAt),
    'helpAndSupport:status': status,
    'serviceTickets:assignedTo': fullName || assignedToRole,
  };
  const closedTicket = {
    'serviceTickets:closedOn': DateUtils.convertDateFormatted(
      (isRejected || isAcceptedClosed) && ffmStatusUpdatedAt ? ffmStatusUpdatedAt : closedAt
    ),
    'serviceTickets:closedBy':
      (isRejected || isAcceptedClosed) && ffmStatusUpdatedBy ? ffmStatusUpdatedBy.firstName : closedBy.firstName,
  };

  const dataByStatus: IDataType = isClosed || isRejected ? closedTicket : openTicket;

  // HANDLERS START

  const onColorChange = (value: string, statusFFM?: string): TextStyle => {
    const color = getStatusColor(value, statusFFM);
    return { ...styles.detail, color };
  };

  const handleFFMAction = (action: string): void => {
    if (handleAction) {
      handleAction({ id, action: action.toUpperCase() });
    }
  };
  const getTitle = (updatedBy: User): string => {
    const isLoggedInUser = user.id === updatedBy.id;
    return `${StringUtils.toTitleCase(ffmStatus)} by ${isLoggedInUser ? 'You' : updatedBy.firstName}`;
  };
  // HANDLERS END

  const renderActions = (): React.ReactElement => {
    return (
      <View style={styles.actionContainer}>
        {FFMTicketAction.map((item, index) => {
          return (
            <>
              <Button
                type="secondary"
                iconSize={16}
                icon={item.icon}
                title={item.title}
                iconColor={item.color}
                onPress={(): void => handleFFMAction(item.title)}
                titleStyle={[styles.actionTitle, { color: item.color }]}
                containerStyle={styles.actionButton}
              />
              {index !== FFMTicketAction.length - 1 && <View style={styles.actionDivider} />}
            </>
          );
        })}
      </View>
    );
  };

  const renderFFMClosedView = (): React.ReactElement | null => {
    const isTicketClosed = ffmStatus === 'CLOSED';
    if (!isTicketClosed && !isRejected && !isAcceptedClosed) return null;

    return (
      <View style={styles.closedView}>
        {isRejected && ffmStatusUpdatedBy ? (
          <View style={styles.rejected}>
            <Icon name={icons.circularCrossFilled} color={theme.colors.red} size={16} />
            <Label type="large" textType="semiBold" style={styles.rejectedTitle}>
              {getTitle(ffmStatusUpdatedBy)}
            </Label>
          </View>
        ) : (
          <>
            <Label type="large" style={styles.title}>
              {t('common:experience')}
            </Label>
            <Rating
              isOverallRating
              size={16}
              value={overallRating ?? 0}
              isTitleRequired={false}
              containerStyle={styles.rating}
            />
          </>
        )}
      </View>
    );
  };

  const renderRatingSheet = (children: React.ReactElement, onClose: () => void): React.ReactElement => {
    return (
      <BottomSheet visible headerTitle={t('serviceTickets:ticketReview')} sheetHeight={600} onCloseSheet={onClose}>
        {children}
      </BottomSheet>
    );
  };

  const renderRatingView = (): React.ReactElement => {
    return (
      <View style={styles.experienceContent}>
        <Divider containerStyles={styles.divider} />
        <TicketReview
          ticketData={cardData}
          renderRatingForm={renderWebRating && !PlatformUtils.isMobile() ? renderWebRating : renderRatingSheet}
          successCallback={onSubmitReview}
        />
      </View>
    );
  };

  const isWeb = PlatformUtils.isWeb();

  return (
    <View style={[styles.container, isWeb && isOddElement ? styles.oddElement : styles.evenElement]}>
      <TouchableOpacity disabled={ffmStatus === 'PENDING'} onPress={onCardPress}>
        <View style={styles.row}>
          <View style={[styles.line, { backgroundColor: cardColor(cardData.priority) }]} />
          <View>
            <View style={styles.titleView}>
              <Label type="large" textType="semiBold" style={styles.title}>
                {title}
              </Label>
              {isFromMore && !isRejected && (
                <Label type="regular" style={styles.subTitle}>
                  {formattedAddressWithProjectAndCity}
                </Label>
              )}
            </View>
            <View style={styles.detailsContainer}>
              {Object.keys(dataByStatus).map((key, indexValue: number) => (
                <View key={indexValue} style={styles.detailsColumn}>
                  <Label type="small" textType="regular" style={styles.details}>
                    {t(key)}
                  </Label>
                  <Label type="regular" textType="semiBold" style={onColorChange(dataByStatus[key], ffmStatus)}>
                    {keyValue(key, dataByStatus, ffmStatus)}
                  </Label>
                </View>
              ))}
            </View>
          </View>
        </View>
      </TouchableOpacity>
      {ffmStatus === 'PENDING' && renderActions()}
      {renderFFMClosedView()}
      {isClosed && !ffmStatusUpdatedBy && renderRatingView()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderColor: theme.colors.darkTint10,
    borderWidth: 1,
    borderRadius: 4,
    marginVertical: 12,
  },
  row: {
    flexDirection: 'row',
  },
  detailsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingLeft: 16,
    marginBottom: 20,
  },
  details: {
    color: theme.colors.darkTint3,
    marginBottom: 6,
  },
  detailsColumn: {
    paddingTop: 12,
    width: '50%',
  },
  line: {
    borderTopEndRadius: 10,
    borderBottomEndRadius: 10,
    paddingLeft: 5,
    width: 3,
    backgroundColor: theme.colors.error,
    marginVertical: 18,
  },
  buttonContainer: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  button: {
    flex: 0,
  },
  detail: {
    color: theme.colors.darkTint3,
  },
  buttonTitle: {
    marginHorizontal: 12,
    marginVertical: 6,
  },
  divider: {
    marginBottom: 10,
  },
  submit: {
    marginStart: 12,
  },
  textArea: {
    height: 80,
    borderRadius: 4,
  },
  experienceContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  iconView: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconPadding: {
    marginRight: 15,
  },
  titleView: {
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  title: {
    color: theme.colors.darkTint3,
  },
  subTitle: {
    color: theme.colors.darkTint4,
  },
  commentBox: {
    marginTop: 16,
  },
  oddElement: {
    maxWidth: '50%',
  },
  evenElement: {
    marginHorizontal: '1%',
  },
  actionContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: theme.colors.disabled,
  },
  actionButton: {
    borderWidth: 0,
    flexDirection: 'row-reverse',
  },
  actionTitle: {
    marginHorizontal: 6,
  },
  actionDivider: {
    borderRightWidth: 1,
    borderColor: theme.colors.disabled,
  },
  closedView: {
    padding: 14,
    borderTopWidth: 1,
    borderTopColor: theme.colors.disabled,
  },
  rejected: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rejectedTitle: {
    marginHorizontal: 6,
    color: theme.colors.red,
  },
  rating: {
    backgroundColor: theme.colors.white,
    justifyContent: 'flex-start',
  },
});
