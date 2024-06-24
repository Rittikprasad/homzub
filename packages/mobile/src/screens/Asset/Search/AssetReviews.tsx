import React, { memo, useState, useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { AssetRepository } from '@homzhub/common/src/domain/repositories/AssetRepository';
import { theme } from '@homzhub/common/src/styles/theme';
import { AssetSelectors } from '@homzhub/common/src/modules/asset/selectors';
import { Dropdown } from '@homzhub/common/src/components/atoms/Dropdown';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import { AssetReviewCard } from '@homzhub/mobile/src/components/molecules/AssetReviewCard';
import { AssetReviewsSummary } from '@homzhub/mobile/src/components/molecules/AssetReviewsSummary';
import { Screen } from '@homzhub/mobile/src/components/HOC/Screen';
import { AssetReview } from '@homzhub/common/src/domain/models/AssetReview';
import { SearchStackParamList } from '@homzhub/mobile/src/navigation/SearchStack';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

const SLIDER_WIDTH = theme.viewport.width - theme.layout.screenPadding * 2;
enum SortType {
  MostRecent = 'MostRecent',
  Positive = 'Positive',
  Critical = 'Critical',
}
type Props = NavigationScreenProps<SearchStackParamList, ScreensKeys.AssetReviews>;

const AssetReviews = (props: Props): React.ReactElement => {
  const {
    navigation,
    route: { params },
  } = props;
  const reviewSummary = useSelector(AssetSelectors.getAssetReviews);
  const { t } = useTranslation(LocaleConstants.namespacesKey.assetDescription);

  const [reviews, setReviews] = useState<AssetReview[]>([]);
  const [sortType, setSortType] = useState<SortType>(SortType.MostRecent);
  const [loading, setLoading] = useState(true);
  const dropDownOptions = useRef([
    { value: SortType.MostRecent, label: t('mostRecent') },
    { value: SortType.Positive, label: t('positive') },
    { value: SortType.Critical, label: t('critical') },
  ]);

  useEffect(() => {
    try {
      AssetRepository.getListingReviews(params).then((response) => {
        setReviews(response.sort((a, b) => new Date(b.modifiedAt).getTime() - new Date(a.modifiedAt).getTime()));
      });
    } catch (err) {
      AlertHelper.error({ message: t('common:genericErrorMessage') });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (reviews.length <= 0) {
      return;
    }

    let sorted: AssetReview[] = [];

    switch (sortType) {
      case SortType.Positive:
        sorted = [...reviews].sort((a, b) => b.rating - a.rating);
        break;
      case SortType.Critical:
        sorted = [...reviews].sort((a, b) => a.rating - b.rating);
        break;
      default:
        sorted = [...reviews].sort((a, b) => new Date(b.modifiedAt).getTime() - new Date(a.modifiedAt).getTime());
        break;
    }

    setReviews(sorted);
  }, [sortType]);

  return (
    <Screen
      backgroundColor={theme.colors.white}
      headerProps={{
        type: 'secondary',
        title: t('customerReviews'),
        onIconPress: navigation.goBack,
      }}
      contentContainerStyle={styles.screen}
      isLoading={loading}
    >
      {reviewSummary && (
        <AssetReviewsSummary reviewSummary={reviewSummary} containerStyle={styles.padding} sliderWidth={SLIDER_WIDTH} />
      )}
      <View style={styles.heading}>
        <Label type="large" textType="semiBold" style={styles.reviewHeading}>
          {t('property:totalReviews', { total: reviews.length })}
        </Label>
        <Dropdown
          data={dropDownOptions.current}
          value={sortType}
          onDonePress={setSortType}
          listHeight={theme.viewport.height / 2}
          testID="drpTimeRange"
          isOutline
          containerStyle={styles.dropdownStyle}
          fontSize="regular"
        />
      </View>
      {reviews.map((review: AssetReview) => (
        <AssetReviewCard key={review.id} review={review} hideButtons />
      ))}
    </Screen>
  );
};

const memoizedComponent = memo(AssetReviews);
export { memoizedComponent as AssetReviews };

const styles = StyleSheet.create({
  screen: {
    paddingHorizontal: 0,
  },
  padding: {
    marginHorizontal: 16,
  },
  heading: {
    marginHorizontal: 16,
    marginVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  reviewHeading: {
    color: theme.colors.darkTint3,
  },
  dropdownStyle: {
    width: 132,
  },
});
