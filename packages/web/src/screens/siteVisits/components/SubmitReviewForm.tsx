import React, { useCallback, memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { FunctionUtils } from '@homzhub/common/src/utils/FunctionUtils';
import { AssetRepository } from '@homzhub/common/src/domain/repositories/AssetRepository';
import { theme } from '@homzhub/common/src/styles/theme';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { PropertyAddressCountry } from '@homzhub/common/src/components/molecules/PropertyAddressCountry';
import RatingForm from '@homzhub/common/src/components/molecules/RatingForm';
import { SiteVisitAction } from '@homzhub/web/src/screens/siteVisits/components/SiteVisitsActionsPopover';
import { AssetReview } from '@homzhub/common/src/domain/models/AssetReview';
import { Pillar } from '@homzhub/common/src/domain/models/Pillar';
import { VisitAssetDetail } from '@homzhub/common/src/domain/models/VisitAssetDetail';
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
  setSiteVisitActionType: React.Dispatch<React.SetStateAction<SiteVisitAction>>;
}

const SubmitReviewForm = (props: IProps): React.ReactElement => {
  const {
    asset,
    onClose = FunctionUtils.noop,
    ratingCategories,
    saleListingId,
    leaseListingId,
    editReview,
    review,
    setSiteVisitActionType,
  } = props;

  const { t } = useTranslation();

  const onSubmit = useCallback(
    async (data: IListingReviewParams): Promise<void> => {
      try {
        await AssetRepository.postListingReview({
          ...data,
          ...(leaseListingId && { lease_listing: leaseListingId }),
          ...(saleListingId && { sale_listing: saleListingId }),
        });
        onClose(true);
        AlertHelper.success({ message: t('property:submitReviewSuccess') });
      } catch (err: any) {
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
        AlertHelper.success({ message: t('property:submitReviewSuccess') });
      } catch (err: any) {
        AlertHelper.error({ message: ErrorUtils.getErrorMessage(err.details) });
      }
    },
    [leaseListingId, saleListingId, review, onClose]
  );

  const onPress = (): void => {
    if (editReview) {
      setSiteVisitActionType(SiteVisitAction.DELETE_REVIEW);
      return;
    }
    onClose();
  };

  const customStyles = {
    buttonContainerStyle: styles.buttonContainerStyle,
    buttonStyle: styles.buttonStyle,
  };

  return (
    <View>
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
        customStyles={customStyles}
      />
    </View>
  );
};

const memoized = memo(SubmitReviewForm);
export { memoized as SubmitReviewForm };

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
  buttonContainerStyle: {
    justifyContent: 'space-around',
  },
  buttonStyle: {
    minWidth: 120,
  },
});
