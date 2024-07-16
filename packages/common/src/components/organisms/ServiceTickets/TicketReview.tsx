import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { DateFormats, DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { TicketRepository } from '@homzhub/common/src/domain/repositories/TicketRepository';
import { CommonSelectors } from '@homzhub/common/src/modules/common/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { Rating } from '@homzhub/common/src/components/atoms/Rating';
import { Label, Text } from '@homzhub/common/src/components/atoms/Text';
import RatingForm from '@homzhub/common/src/components/molecules/RatingForm';
import { AssetReview } from '@homzhub/common/src/domain/models/AssetReview';
import { Pillar } from '@homzhub/common/src/domain/models/Pillar';
import { Ticket } from '@homzhub/common/src/domain/models/Ticket';
import { IListingReviewParams, ISubmitReview } from '@homzhub/common/src/domain/repositories/interfaces';

interface IProps {
  ticketData: Ticket;
  renderRatingForm: (children: React.ReactElement, onClose: () => void, isReview: boolean) => React.ReactElement;
  successCallback?: () => void;
  onOpenRatingModal?: () => void;
  onCloseRatingModal?: () => void;
}

const TicketReview = (props: IProps): React.ReactElement => {
  const {
    ticketData: { title, createdAt, id, review },
    renderRatingForm,
    successCallback,
    onOpenRatingModal,
    onCloseRatingModal,
  } = props;
  const pillarData = useSelector(CommonSelectors.getPillars);
  const [isReview, setIsReview] = useState(false);
  const [pillars, setPillars] = useState<Pillar[]>(pillarData);
  const [reviewData, setReview] = useState<AssetReview>();
  const timeElapsed = DateUtils.getTimeElapsedInDays(createdAt);
  const { t } = useTranslation();

  useEffect(() => {
    if (isReview && review.rating > 0 && pillars) {
      /*
       * Get Ticket Review by id
       * Map selected categories with all data to display all categories for Update Call
       */
      TicketRepository.getTicketReview(id, review.id).then((res) => {
        setReview(res);
        const previousData = [...pillars];
        const updatePillars: Pillar[] = previousData.map((item): Pillar => {
          const pillarItem = item;
          res.pillarRatings.forEach((pillar) => {
            if (item.name === pillar.pillarName?.name) {
              pillarItem.rating = pillar.rating;
            }
          });

          return pillarItem;
        });
        setPillars(updatePillars);
      });
    }
  }, [isReview]);

  const onCloseForm = (): void => {
    setIsReview(false);
    if (PlatformUtils.isWeb() && onCloseRatingModal) {
      onCloseRatingModal();
    }
  };

  const onUpdate = async (payload: IListingReviewParams): Promise<void> => {
    try {
      const finalPayload: ISubmitReview = {
        param: { ticketId: id, reviewId: review.id },
        data: {
          rating: payload.rating,
          description: payload.description,
          pillar_ratings: payload.pillar_ratings,
        },
      };
      await TicketRepository.updateReviewById(finalPayload);
      setIsReview(false);
      AlertHelper.success({ message: t('serviceTickets:reviewUpdateSuccess') });
      if (successCallback) {
        successCallback();
      }
    }catch (e: any) {      setIsReview(false);
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
    }
  };

  const onSubmit = async (payload: IListingReviewParams): Promise<void> => {
    try {
      const finalPayload: ISubmitReview = {
        param: { ticketId: id },
        data: {
          rating: payload.rating,
          description: payload.description,
          pillar_ratings: payload.pillar_ratings,
        },
      };
      await TicketRepository.reviewSubmit(finalPayload);
      setIsReview(false);
      AlertHelper.success({ message: t('serviceTickets:reviewSuccess') });
      if (successCallback) {
        successCallback();
      }
    }catch (e: any) {      setIsReview(false);
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
    }
  };

  const onPressReview = (): void => {
    setIsReview(!isReview);
    if (PlatformUtils.isWeb() && onOpenRatingModal) {
      onOpenRatingModal();
    }
  };

  const renderRating = (): React.ReactElement => {
    const data = [
      {
        type: t('serviceTickets:createdOn'),
        value: DateUtils.getDisplayDate(createdAt, DateFormats.DDMM_YYYY_HH_MM),
      },
      {
        type: t('serviceTickets:timeElapsed'),
        value: `${timeElapsed} ${t(timeElapsed === 1 ? 'common:day' : 'common:days')}`,
      },
    ];

    return (
      <View style={styles.container}>
        <Text textType="semiBold" type="small" style={styles.ticketTitle}>
          {title}
        </Text>
        <View style={styles.detailContainer}>
          {data.map((item, index) => {
            return (
              <View key={index} style={styles.detailItem}>
                <Label textType="regular" type="small" style={styles.label}>
                  {item.type}
                </Label>
                <Label textType="semiBold" type="regular" style={styles.label}>
                  {item.value}
                </Label>
              </View>
            );
          })}
        </View>
        <Divider containerStyles={styles.dividerStyle} />
        <RatingForm
          ratings={pillars}
          onUpdate={onUpdate}
          onSubmit={onSubmit}
          secondaryAction={onCloseForm}
          containerStyle={styles.form}
          // eslint-disable-next-line react/prop-types
          isEdit={review.rating > 0}
          isDeleteRequired={false}
          review={reviewData}
        />
      </View>
    );
  };

  return (
    <>
      {review ? (
        <TouchableOpacity onPress={onPressReview}>
          <Rating value={review.rating} isOverallRating containerStyle={styles.overallContainer} />
        </TouchableOpacity>
      ) : (
        <Button
          type="primary"
          textType="label"
          textSize="large"
          title={t('common:writeReview')}
          onPress={onPressReview}
          containerStyle={styles.buttonContainer}
          titleStyle={styles.buttonTitle}
        />
      )}
      {isReview && renderRatingForm(renderRating(), onCloseForm, isReview)}
    </>
  );
};

export default TicketReview;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    flex: 1,
  },
  detailContainer: {
    flexDirection: 'row',
    marginVertical: 6,
  },
  buttonContainer: {
    backgroundColor: theme.colors.lightGrayishBlue,
    marginVertical: 12,
  },
  dividerStyle: {
    marginVertical: 10,
    borderColor: theme.colors.background,
  },
  buttonTitle: {
    color: theme.colors.primaryColor,
    marginVertical: 6,
  },
  detailItem: {
    flex: 0.5,
  },
  ticketTitle: {
    color: theme.colors.darkTint3,
    marginVertical: 5,
    marginTop: 10,
  },
  label: {
    color: theme.colors.darkTint3,
  },
  form: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  overallContainer: {
    marginVertical: 12,
  },
});
