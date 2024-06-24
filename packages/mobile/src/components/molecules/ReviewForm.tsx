import React, { useState, useCallback, memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { FunctionUtils } from '@homzhub/common/src/utils/FunctionUtils';
import { AssetRepository } from '@homzhub/common/src/domain/repositories/AssetRepository';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import { BottomSheet } from '@homzhub/common/src/components/molecules/BottomSheet';
import { PropertyAddressCountry } from '@homzhub/common/src/components/molecules/PropertyAddressCountry';
import RatingForm from '@homzhub/common/src/components/molecules/RatingForm';
import { AssetReview } from '@homzhub/common/src/domain/models/AssetReview';
import { Pillar } from '@homzhub/common/src/domain/models/Pillar';
import { VisitAssetDetail } from '@homzhub/common/src/domain/models/VisitAssetDetail';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { IListingReviewParams } from '@homzhub/common/src/domain/repositories/interfaces';

interface IProps {
  saleListingId: number | null;
  leaseListingId: number | null;
  asset: VisitAssetDetail;
  ratingCategories: Pillar[];
  onClose: (reset?: boolean) => void;
  onDelete?: () => void;
  editReview?: boolean;
  overallRatings?: number;
  review?: AssetReview;
}

const ReviewForm = (props: IProps): React.ReactElement => {
  const {
    asset,
    onClose = FunctionUtils.noop,
    ratingCategories,
    saleListingId,
    leaseListingId,
    onDelete = FunctionUtils.noop,
    editReview,
    review,
  } = props;
  const { t } = useTranslation(LocaleConstants.namespacesKey.property);

  const [showDeleteView, setDeleteView] = useState(false);

  const onSubmit = useCallback(
    async (data: IListingReviewParams): Promise<void> => {
      try {
        await AssetRepository.postListingReview({
          ...data,
          ...(leaseListingId && { lease_listing: leaseListingId }),
          ...(saleListingId && { sale_listing: saleListingId }),
        });
        onClose(true);
      } catch (err) {
        AlertHelper.error({ message: ErrorUtils.getErrorMessage(err.details) });
      }
    },
    [leaseListingId, saleListingId, onClose]
  );

  const update = useCallback(
    async (data: IListingReviewParams): Promise<void> => {
      if (!review) return;

      const payload: IListingReviewParams = {
        ...data,
        ...(leaseListingId && { lease_listing: leaseListingId }),
        ...(saleListingId && { sale_listing: saleListingId }),
      };

      try {
        await AssetRepository.updateReview(review.id, payload);
        onClose(true);
      } catch (err) {
        AlertHelper.error({ message: ErrorUtils.getErrorMessage(err.details) });
      }
    },
    [leaseListingId, saleListingId, review, onClose]
  );

  const onPress = (): void => {
    if (editReview) {
      setDeleteView(!showDeleteView);
      return;
    }
    onClose();
  };

  const renderDeleteView = (): React.ReactElement => {
    return (
      <BottomSheet
        visible={showDeleteView}
        headerTitle={t('common:deleteReview')}
        onCloseSheet={(): void => setDeleteView(false)}
        sheetHeight={theme.viewport.height * 0.4}
      >
        <View style={styles.deleteView}>
          <Text type="small">{t('common:deleteReviewText')}</Text>
          <View style={styles.deleteViewText}>
            <Text type="small">{t('common:doYouWantToRemove')}</Text>
          </View>
          <View style={styles.buttonContainer}>
            <Button
              onPress={(): void => setDeleteView(false)}
              type="secondary"
              title={t('common:no')}
              titleStyle={styles.buttonTitle}
            />
            <Button onPress={onDelete} type="primary" title={t('common:yes')} containerStyle={styles.submitButton} />
          </View>
        </View>
      </BottomSheet>
    );
  };

  return (
    <>
      <PropertyAddressCountry
        primaryAddress={asset.projectName}
        subAddress={asset.address}
        countryFlag={asset.country.flag}
        containerStyle={styles.container}
      />
      <Divider containerStyles={styles.dividerStyle} />
      <RatingForm
        ratings={ratingCategories}
        isEdit={editReview}
        onUpdate={update}
        onSubmit={onSubmit}
        secondaryAction={onPress}
        review={review}
      />
      {renderDeleteView()}
    </>
  );
};

const memoized = memo(ReviewForm);
export { memoized as ReviewForm };

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 24,
  },
  buttonContainer: {
    marginTop: 16,
    flexDirection: 'row',
    marginBottom: 12,
  },
  submitButton: {
    marginStart: 16,
  },
  dividerStyle: {
    backgroundColor: theme.colors.background,
    marginTop: 16,
  },
  buttonTitle: {
    marginHorizontal: 0,
    color: theme.colors.error,
  },
  deleteView: {
    margin: 10,
  },
  deleteViewText: {
    marginVertical: 10,
  },
});
