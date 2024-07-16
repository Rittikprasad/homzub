import React, { memo, useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/core';
import { AssetRepository } from '@homzhub/common/src/domain/repositories/AssetRepository';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { theme } from '@homzhub/common/src/styles/theme';
import { icons } from '@homzhub/common/src/assets/icon';
import { EmptyState } from '@homzhub/common/src/components/atoms/EmptyState';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import { UserScreen } from '@homzhub/mobile/src/components/HOC/UserScreen';
import { AssetReviewCard } from '@homzhub/mobile/src/components/molecules/AssetReviewCard';
import { AssetReviewsSummary } from '@homzhub/mobile/src/components/molecules/AssetReviewsSummary';
import { AssetReview } from '@homzhub/common/src/domain/models/AssetReview';
import { Unit } from '@homzhub/common/src/domain/models/Unit';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { ICommonNavProps } from '@homzhub/mobile/src/navigation/interfaces';

const AssetReviews = (): React.ReactElement => {
  const { goBack } = useNavigation();
  const { params } = useRoute();
  const { t } = useTranslation(LocaleConstants.namespacesKey.property);
  const [reviews, setReviews] = useState<AssetReview[]>([]);
  const [reportCategories, setReportCategories] = useState<Unit[]>([]);
  const [reviewSummary, setReviewSummary] = useState<AssetReview | null>(null);
  const { saleListingId, leaseListingId, screenTitle } = params as ICommonNavProps;

  useEffect(() => {
    // Make APIs here
    getReportCategories().then();
  }, []);
  useEffect(() => {
    if (!saleListingId && !leaseListingId) {
      return;
    }

    try {
      AssetRepository.getListingReviews({
        ...(leaseListingId && { lease_listing: leaseListingId }),
        ...(saleListingId && { sale_listing: saleListingId }),
      }).then((response) => {
        setReviews(response);
      });
      AssetRepository.getListingReviewsSummary({
        ...(leaseListingId && { lease_listing: leaseListingId }),
        ...(saleListingId && { sale_listing: saleListingId }),
      }).then((response) => {
        setReviewSummary(response);
      });
    }catch (e: any) {      AlertHelper.error({ message: t('common:genericErrorMessage') });
    }
  }, []);

  const getReportCategories = async (): Promise<void> => {
    const response = await AssetRepository.getReviewReportCategories();
    setReportCategories(response);
  };

  return (
    <UserScreen
      title={screenTitle ?? t('assetPortfolio:portfolio')}
      pageTitle={t('assetDescription:reviews')}
      onBackPress={goBack}
    >
      {reviews.length > 0 ? (
        <View>
          {reviewSummary && reviewSummary?.reviewCount > 0 && (
            <AssetReviewsSummary reviewSummary={reviewSummary} containerStyle={styles.content} />
          )}
          {reviews.length > 0 && (
            <Label type="large" textType="semiBold" style={styles.popularWith}>
              {t('totalReviews', { total: reviews.length })}
            </Label>
          )}
          {reviews.map((review: AssetReview) => (
            <AssetReviewCard key={review.id} review={review} reportCategories={reportCategories} />
          ))}
        </View>
      ) : (
        <EmptyState title={t('property:noReview')} icon={icons.reviews} />
      )}
    </UserScreen>
  );
};

const memoizedComponent = memo(AssetReviews);
export { memoizedComponent as AssetReviews };

const styles = StyleSheet.create({
  content: {
    marginHorizontal: 16,
  },
  popularWith: {
    color: theme.colors.darkTint3,
    margin: 16,
  },
});
