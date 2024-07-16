import React, { memo, useState, useCallback, ReactElement } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { AssetRepository } from '@homzhub/common/src/domain/repositories/AssetRepository';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Avatar } from '@homzhub/common/src/components/molecules/Avatar';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import { TextArea } from '@homzhub/common/src/components/atoms/TextArea';
import { Rating } from '@homzhub/common/src/components/atoms/Rating';
import { SiteVisitAction } from '@homzhub/web/src/screens/siteVisits/components/SiteVisitsActionsPopover';
import { AssetReview } from '@homzhub/common/src/domain/models/AssetReview';
import { AssetReviewComment } from '@homzhub/common/src/domain/models/AssetReviewComment';
import { Unit } from '@homzhub/common/src/domain/models/Unit';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

export interface IAssetReviewProps {
  review: AssetReview;
  reportCategories?: Unit[];
  hideButtons?: boolean;
  hideShowMore?: boolean;
}

interface IProps extends IAssetReviewProps {
  onCloseModal: () => void;
  isUnderReview: boolean;
  setSiteVisitActionType?: React.Dispatch<React.SetStateAction<SiteVisitAction>>;
}

const MAX_LENGTH = 50;

const AssetReviewCard = (props: IProps): React.ReactElement => {
  // Local constant variables
  const { review, hideButtons = false, hideShowMore, onCloseModal, isUnderReview, setSiteVisitActionType } = props;
  const {
    id: reviewId,
    description,
    reviewedBy,
    modifiedAt: reviewedAt,
    rating: overallRating,
    pillarRatings: pillars,
    comments,
  } = review;
  const comment = comments.length > 0 ? comments[0].comment : '';
  const commentDate = comments.length > 0 ? comments[0].modifiedAt : undefined;
  const { t } = useTranslation(LocaleConstants.namespacesKey.property);
  const owner = useSelector(UserSelector.getUserProfile);

  // State const's
  const [showMore, setShowMore] = useState(hideShowMore);
  const [showMoreReply, setShowMoreReply] = useState(false);
  const [replyMode, setReplyMode] = useState(false);
  const [reply, setReply] = useState(comment);

  const enableReportForm = useCallback((): void => {
    // Code to switch Popover
    if (setSiteVisitActionType) {
      setSiteVisitActionType(SiteVisitAction.REPORT_REVIEW);
    }
  }, []);

  const toggleShowMore = useCallback((): void => {
    setShowMore((oldValue) => !oldValue);
  }, []);

  const toggleShowMoreReply = useCallback((): void => {
    setShowMoreReply((oldValue) => !oldValue);
  }, []);

  const toggleReplyMode = useCallback((): void => {
    setReplyMode((oldValue) => !oldValue);
  }, []);

  const onCancel = useCallback((): void => {
    const { comments: reviewComments } = review;
    if (reviewComments.length > 0) {
      setReply(reviewComments[0].comment);
    } else {
      setReply('');
    }
    toggleReplyMode();
  }, []);

  const onSubmit = async (): Promise<void> => {
    const { comments: reviewComments } = review;
    try {
      if (reply && reviewComments.length > 0) {
        await AssetRepository.editReviewComment(reviewId, reviewComments[0].id, { comment: reply });
        reviewComments[0].comment = reply;
      } else {
        const response: AssetReviewComment = await AssetRepository.addReviewComment(reviewId, { comment: reply });
        review.comments = [response];
      }
      onCloseModal();
      AlertHelper.info({ message: t('common:responseSubmitSuccess') });
    } catch (error: any) {
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(error.details) });
      onCancel();
    } finally {
      toggleReplyMode();
    }
  };

  const onDeleteReply = async (): Promise<void> => {
    const { comments: reviewComments } = review;
    try {
      if (reviewComments.length > 0) {
        await AssetRepository.deleteReviewComment(reviewId, reviewComments[0].id);
        setReply('');
        setReplyMode(false);
        reviewComments[0].comment = '';
        review.comments = [];
      }
    } catch (error: any) {
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(error.details) });
    }
  };

  const renderReplyComment = (): ReactElement => {
    return (
      <View style={styles.commentStyle}>
        <Divider containerStyles={styles.divider} />
        <Avatar fullName={owner.fullName} designation={t('owner')} date={commentDate} />
        <View style={styles.replyContent}>
          <Label type="large" maxLength={!showMoreReply ? MAX_LENGTH : undefined} style={styles.review}>
            {reply}
          </Label>
          <View style={styles.replyCRUDButtons}>
            <View style={styles.replyCRUDButtons}>
              <TouchableOpacity onPress={toggleReplyMode}>
                <Icon name={icons.noteBook} size={16} color={theme.colors.darkTint4} />
              </TouchableOpacity>
              <TouchableOpacity onPress={onDeleteReply}>
                <Icon name={icons.trash} size={16} color={theme.colors.error} style={styles.deleteIcon} />
              </TouchableOpacity>
            </View>
            {reply.length > MAX_LENGTH && (
              <TouchableOpacity onPress={toggleShowMoreReply}>
                <Label type="large" textType="semiBold" style={styles.showMore}>
                  {showMoreReply ? t('showLess') : t('showMore')}
                </Label>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
  };

  const renderTextArea = (): ReactElement => {
    return (
      <>
        <TextArea
          value={reply}
          placeholder={t('writeComment')}
          onMessageChange={setReply}
          textAreaStyle={styles.textArea}
        />
        <View style={styles.replyButtonContainer}>
          <Button
            onPress={onCancel}
            type="secondary"
            title={t('common:cancel')}
            containerStyle={styles.replyButton}
            titleStyle={styles.replyButtonTitle}
          />
          <Button
            onPress={onSubmit}
            disabled={reply.length === 0 || comment === reply}
            type="primary"
            title={t('common:submit')}
            containerStyle={[styles.replyButton, styles.replySubmit]}
            titleStyle={styles.replyButtonTitle}
          />
        </View>
      </>
    );
  };

  const renderReviewActions = (): ReactElement => {
    const disabledStyle = isUnderReview && { color: theme.colors.disabled };

    return (
      <View style={styles.rowStyle}>
        <TouchableOpacity disabled={isUnderReview} onPress={toggleReplyMode}>
          <View style={styles.replyContainer}>
            <Icon name={icons.reply} size={12} color={isUnderReview ? theme.colors.disabled : theme.colors.darkTint4} />
            <Label type="large" textType="semiBold" style={[styles.reply, disabledStyle]}>
              {t('common:reply')}
            </Label>
          </View>
        </TouchableOpacity>
        <TouchableOpacity disabled={isUnderReview} onPress={enableReportForm}>
          <View style={styles.reportContainer}>
            <Icon name={icons.flag} size={12} color={isUnderReview ? theme.colors.disabled : theme.colors.darkTint4} />
            <Label type="large" textType="semiBold" style={[styles.reply, disabledStyle]}>
              {t('common:report')}
            </Label>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <>
      <View style={styles.container}>
        <Avatar
          fullName={reviewedBy.fullName}
          image={reviewedBy.profilePicture}
          designation={t('tenant')}
          date={reviewedAt}
        />
        {!!description && (
          <Label type="large" numberOfLines={!showMore ? 2 : undefined} style={styles.review}>
            {description}
          </Label>
        )}
        <Rating isOverallRating value={overallRating ?? 0} containerStyle={styles.comment} />
        {showMore && (
          <View style={styles.pillarContainer}>
            {pillars.map((pillarRating, index) => {
              return (
                <Rating
                  key={pillarRating.id}
                  title={pillarRating.pillarName?.name ?? ''}
                  value={pillarRating.rating}
                  containerStyle={index !== pillars.length - 1 && styles.rating}
                />
              );
            })}
          </View>
        )}
        <View
          style={[
            styles.buttonContainer,
            // @ts-ignore
            { justifyContent: reply || replyMode || hideButtons ? 'flex-end' : 'space-between' },
          ]}
        >
          {!reply && !replyMode && !hideButtons && renderReviewActions()}
          {!hideShowMore ? (
            <TouchableOpacity onPress={toggleShowMore}>
              <Label type="large" textType="semiBold" style={styles.showMore}>
                {showMore ? t('showLess') : t('showMore')}
              </Label>
            </TouchableOpacity>
          ) : null}
        </View>
        {!isUnderReview && replyMode && renderTextArea()}
        {!isUnderReview && !!reply && !replyMode && renderReplyComment()}
        {!hideButtons && isUnderReview && (
          <View style={styles.underReview}>
            <Icon name={icons.flag} size={12} color={theme.colors.danger} />
            <Label type="regular" style={styles.underReviewText}>
              {t('underReviewMessage')}
            </Label>
          </View>
        )}
      </View>
      <Divider containerStyles={styles.cardDivider} />
    </>
  );
};

const memoizedComponent = memo(AssetReviewCard);
export { memoizedComponent as AssetReviewCard };

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginBottom: 20,
  },
  review: {
    color: theme.colors.darkTint5,
    marginVertical: 12,
  },
  replyContent: {
    marginStart: 54,
  },
  replyCRUDButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 16,
  },
  replyButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  pillarContainer: {
    marginTop: 16,
  },
  showMore: {
    color: theme.colors.primaryColor,
  },
  replyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reply: {
    marginStart: 8,
    color: theme.colors.darkTint4,
  },
  replyButton: {
    width: 80,
  },
  replyButtonTitle: {
    marginHorizontal: 12,
    marginVertical: 6,
  },
  replySubmit: {
    marginStart: 12,
  },
  rating: {
    marginBottom: 16,
  },
  textArea: {
    height: 80,
    borderRadius: 4,
  },
  divider: {
    borderColor: theme.colors.background,
    marginVertical: 16,
  },
  deleteIcon: {
    marginStart: 16,
  },
  rowStyle: {
    flexDirection: 'row',
  },
  reportContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginStart: 24,
  },
  underReview: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 60,
    backgroundColor: theme.colors.alertOpacity,
    paddingVertical: 12,
    marginTop: 16,
    borderRadius: 2,
    justifyContent: 'center',
  },
  underReviewText: {
    color: theme.colors.danger,
    marginStart: 6,
  },
  cardDivider: {
    borderColor: theme.colors.background,
    marginBottom: 20,
  },
  commentStyle: {
    marginStart: 8,
  },
  comment: {
    marginTop: 10,
  },
});
