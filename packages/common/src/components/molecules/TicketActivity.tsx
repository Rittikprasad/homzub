import React, { PureComponent } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { WithTranslation, withTranslation } from 'react-i18next';
import { FunctionUtils } from '@homzhub/common/src/utils/FunctionUtils';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { TicketActions } from '@homzhub/common/src/modules/tickets/actions';
import { theme } from '@homzhub/common/src/styles/theme';
import { icons } from '@homzhub/common/src/assets/icon';
import { Badge } from '@homzhub/common/src/components/atoms/Badge';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import ImageThumbnail from '@homzhub/common/src/components/atoms/ImageThumbnail';
import { Label, Text } from '@homzhub/common/src/components/atoms/Text';
import {
  ActivityQuotesApproved,
  ActivityQuotesSubmitted,
} from '@homzhub/common/src/components/molecules/ActivityQuoteCard';
import ConfirmationSheet from '@homzhub/mobile/src/components/molecules/ConfirmationSheet';
import { TicketActivitySection } from '@homzhub/common/src/components/HOC/TicketActivitySection';
import { Attachment } from '@homzhub/common/src/domain/models/Attachment';
import { Ticket, TicketStatus } from '@homzhub/common/src/domain/models/Ticket';
import { TicketActivity } from '@homzhub/common/src/domain/models/TicketActivity';
import { TicketActions as TicketActionTypes } from '@homzhub/common/src/constants/ServiceTickets';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

interface IProps {
  ticketData: Ticket;
  isCloseAllowed?: boolean;
  onPressImage?: (imageNumber: number) => void;
  onPressQuote?: (url: string) => Promise<void> | void;
  containerStyle?: StyleProp<ViewStyle>;
  onOpenModal?: () => void;
  handleActiveTicketAction?: (value: TicketActionTypes) => void;
  isFFMUser?: boolean;
}

interface IDispatchProps {
  closeTicket: (payload?: boolean) => void;
}

interface IActivityStatusBadge {
  data: string[];
  extraStyle?: ViewStyle;
}

interface IState {
  showConfirmationSheet: boolean;
}

type Props = IProps & WithTranslation & IDispatchProps;

class TicketActivityCard extends PureComponent<Props> {
  public state: IState = {
    showConfirmationSheet: false,
  };

  public render(): React.ReactNode {
    const {
      t,
      ticketData,
      closeTicket,
      isCloseAllowed = false,
      containerStyle,
      onOpenModal,
      handleActiveTicketAction,
    } = this.props;
    const { showConfirmationSheet } = this.state;
    const { groupedActivities, status } = ticketData;

    const onConfirmClose = (): void => {
      const { isFFMUser = false } = this.props;
      closeTicket(isFFMUser);
      this.closeSheet();
    };

    const isWeb = PlatformUtils.isWeb();

    const onCloseTicket = (): void => {
      if (isWeb && onOpenModal && handleActiveTicketAction) {
        handleActiveTicketAction(TicketActionTypes.CLOSE_TICKET);
        onOpenModal();
      } else {
        this.openSheet();
      }
    };

    return (
      <View style={[styles.activityView, containerStyle]}>
        <View
          style={[
            styles.titleContainer,
            status !== TicketStatus.CLOSED && styles.titleBottom,
            isWeb && styles.titleContainerWeb,
            !isWeb && styles.titleContainerMobile,
          ]}
        >
          <Text type="small" textType="semiBold" style={styles.activity}>
            {t('serviceTickets:activity')}
          </Text>
          {status !== TicketStatus.CLOSED && isCloseAllowed && (
            <Button
              containerStyle={styles.closeTicketButton}
              type="secondary"
              icon={icons.tickInsideCircle}
              iconSize={20}
              iconColor={theme.colors.blue}
              onPress={onCloseTicket}
            >
              <Text type="small" textType="regular" style={styles.closeTicketText}>
                {t('closeTicket')}
              </Text>
            </Button>
          )}
        </View>
        {Object.keys(groupedActivities).map((key) => {
          return (
            <>
              <View style={styles.separator}>
                <View style={styles.dividerView} />
                <Label type="large" style={styles.dateOnSeparator}>
                  {key}
                </Label>
                <View style={styles.dividerView} />
              </View>
              {groupedActivities[key].map((activity) => this.renderActivities(activity))}
            </>
          );
        })}
        {!isWeb && (
          <ConfirmationSheet
            isVisible={showConfirmationSheet}
            onCloseSheet={this.closeSheet}
            onPressDelete={onConfirmClose}
            message={t('closeTicketConfirmation')}
            buttonTitles={[t('common:cancel'), t('common:close')]}
          />
        )}
      </View>
    );
  }

  private renderActivities = (activity: TicketActivity): React.ReactElement | null => {
    const { t, onPressQuote } = this.props;
    const {
      TICKET_RAISED,
      PAYMENT_DONE,
      TICKET_REASSIGNED,
      QUOTE_APPROVED,
      WORK_INITIATED,
      WORK_COMPLETED,
      WORK_UPDATE,
      QUOTE_REQUESTED,
      QUOTE_SUBMITTED,
    } = TicketStatus;
    const {
      role,
      comment,
      createdAt,
      activityType: { label, code },
      user,
      data,
    } = activity;

    const renderActivityData = (): React.ReactElement | null => {
      switch (code) {
        case TICKET_REASSIGNED:
          return this.renderActivityStatusBadge({
            data: this.getActionContent(code, data?.assignedTo?.firstName ?? ''),
          });
        case QUOTE_SUBMITTED:
          return <ActivityQuotesSubmitted quoteData={data?.quoteRequestCategory ?? []} onQuotePress={onPressQuote} />;
        case QUOTE_APPROVED:
        case PAYMENT_DONE:
          return <ActivityQuotesApproved quoteData={data?.quotes ?? []} description={comment} />;
        case WORK_COMPLETED:
          return this.renderWorkCompleted(data?.attachments ?? []);
        case TICKET_RAISED:
        case QUOTE_REQUESTED:
        case WORK_INITIATED:
        default:
          return this.renderActivityStatusBadge({ data: this.getActionContent(code, data?.assignedTo?.firstName) });
      }
    };

    const title = code === WORK_UPDATE && data ? data.title : code === PAYMENT_DONE ? t('paymentDone') : label;
    return (
      <TicketActivitySection role={role} user={user} time={createdAt} label={title} description={comment}>
        {renderActivityData()}
      </TicketActivitySection>
    );
  };

  private renderWorkCompleted = (attachments: Attachment[]): React.ReactElement => {
    const { t, onPressImage = FunctionUtils.noop } = this.props;
    const count = attachments.length;
    const customStyle = customStyles(count);

    return (
      <>
        {attachments.length > 0 && (
          <View style={styles.completedQuotesContainer}>
            <Label textType="semiBold" type="large" style={styles.completedLabel}>
              {t('uploadedPhotos')}
            </Label>
            <ImageThumbnail
              imageUrl={attachments[0].link}
              isIconVisible={false}
              isLastThumbnail={false}
              containerStyle={styles.thumbnailContainer}
              imageWrapperStyle={styles.thumbnailHeight}
              onPressLastThumbnail={(): void => onPressImage(0)}
              onPressImage={(): void => onPressImage(0)}
            />
            {count > 1 && (
              <View style={styles.thumbnailView}>
                <ImageThumbnail
                  imageUrl={attachments[1].link}
                  isIconVisible={false}
                  isLastThumbnail={false}
                  containerStyle={customStyle.thumbnailLeft}
                  imageWrapperStyle={styles.thumbnailHeight}
                  onPressImage={(): void => onPressImage(1)}
                />
                {count > 2 && (
                  <ImageThumbnail
                    imageUrl={attachments[2].link}
                    isIconVisible={false}
                    isLastThumbnail={count > 3}
                    dataLength={count - 2}
                    containerStyle={customStyle.thumbnailRight}
                    imageWrapperStyle={styles.thumbnailHeight}
                    onPressLastThumbnail={(): void => onPressImage(2)}
                  />
                )}
              </View>
            )}
          </View>
        )}
        {this.renderActivityStatusBadge({ data: [t('ticketClosed'), t('submitReview')] })}
      </>
    );
  };

  private renderActivityStatusBadge = (props: IActivityStatusBadge): React.ReactElement => {
    const { data, extraStyle } = props;
    return (
      <View style={[styles.activityBadgeContainer, extraStyle]}>
        {data.map((status: string, index: number) => (
          <Badge
            badgeColor={theme.colors.gray11}
            title={status}
            badgeStyle={styles.activityBadge}
            titleStyle={styles.activityBadgeText}
            key={index}
          />
        ))}
      </View>
    );
  };

  private openSheet = (): void => {
    this.setState({ showConfirmationSheet: true });
  };

  private closeSheet = (): void => {
    this.setState({ showConfirmationSheet: false });
  };

  private getActionContent = (code: string, name = 'Homzhub'): string[] => {
    const { t } = this.props;
    switch (code) {
      case TicketStatus.TICKET_RAISED:
        return [t('ticketAssignedTo', { name }), t('awaitingAction', { name })];
      case TicketStatus.TICKET_REASSIGNED:
        return [t('ticketReassignedTo', { name }), t('awaitingAction', { name })];
      case TicketStatus.QUOTE_REQUESTED:
      case TicketStatus.MORE_QUOTE_REQUESTED:
        return [t('awaitingQuotes')];
      case TicketStatus.WORK_INITIATED:
        return [t('awaitingCompletionProof')];
      case TicketStatus.TICKET_CLOSED:
        return [t('ticketClosed'), t('submitReview')];
      default:
        return [];
    }
  };
}

const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { closeTicket } = TicketActions;
  return bindActionCreators(
    {
      closeTicket,
    },
    dispatch
  );
};

export default connect(
  null,
  mapDispatchToProps
)(withTranslation(LocaleConstants.namespacesKey.serviceTickets)(TicketActivityCard));

const styles = StyleSheet.create({
  activityView: {
    backgroundColor: theme.colors.background,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxHeight: 75,
    paddingHorizontal: 20,
  },
  titleContainerMobile: {
    flex: 1,
    paddingHorizontal: 16,
    marginTop: 16,
  },
  titleContainerWeb: {
    paddingVertical: 20,
    justifyContent: 'space-evenly',
    borderBottomColor: theme.colors.darkTint10,
    borderBottomWidth: 1,
    borderStyle: 'solid',
  },
  titleBottom: {
    marginBottom: 16,
  },
  closeTicketButton: {
    flex: 0.7,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 7,
    borderColor: theme.colors.disabled,
    borderRadius: 4,
    borderWidth: 1,
  },
  closeTicketText: {
    marginStart: 5,
    color: theme.colors.blue,
  },
  activity: {
    flex: 1,
  },
  activityBadgeContainer: {
    marginBottom: 16,
  },
  activityBadge: {
    marginTop: 16,
    minHeight: 26,
    justifyContent: 'center',
    borderRadius: 6,
    marginEnd: 16,
  },
  activityBadgeText: {
    color: theme.colors.darkTint4,
  },
  separator: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginVertical: 10,
  },
  dateOnSeparator: {
    paddingHorizontal: 10,
  },
  dividerView: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.darkTint10,
    width: 120,
  },
  thumbnailContainer: {
    flex: 1,
    marginVertical: 4,
  },

  thumbnailHeight: {
    height: 120,
  },
  completedQuotesContainer: {
    backgroundColor: theme.colors.gray8,
    padding: 16,
    paddingTop: 5,
    marginTop: 16,
    borderRadius: 5,
    marginEnd: 16,
  },
  completedLabel: {
    marginVertical: 5,
  },
  thumbnailView: {
    flex: 1,
    flexDirection: 'row',
  },
});

interface IStyles {
  thumbnailLeft: ViewStyle;
  thumbnailRight: ViewStyle;
}

const customStyles = (count = 0): IStyles => {
  return StyleSheet.create({
    thumbnailLeft: {
      flex: 1,
      marginRight: count > 2 ? 6.5 : 0,
    },
    thumbnailRight: {
      flex: 1,
      marginLeft: count > 2 ? 6.5 : 0,
    },
  });
};
