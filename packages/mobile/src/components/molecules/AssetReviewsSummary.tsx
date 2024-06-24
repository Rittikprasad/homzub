import React, { useCallback, useState } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme } from '@homzhub/common/src/styles/theme';
import { SnapCarousel } from '@homzhub/mobile/src/components/atoms/Carousel';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { Label, Title } from '@homzhub/common/src/components/atoms/Text';
import { PaginationComponent } from '@homzhub/mobile/src/components/atoms/PaginationComponent';
import { Rating } from '@homzhub/common/src/components/atoms/Rating';
import { AssetReview } from '@homzhub/common/src/domain/models/AssetReview';
import { Pillar } from '@homzhub/common/src/domain/models/Pillar';

interface IProps {
  reviewSummary: AssetReview;
  showDivider?: boolean;
  titleRequired?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  sliderWidth?: number;
}

const SLIDER_WIDTH = theme.viewport.width - theme.layout.screenPadding * 4;

const AssetReviewsSummary = ({
  reviewSummary,
  containerStyle,
  titleRequired = true,
  showDivider = true,
  sliderWidth = SLIDER_WIDTH,
}: IProps): React.ReactElement => {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);
  const { reviewCount, rating, pillarRatings } = reviewSummary;

  const splitData = useCallback((): Pillar[][] => {
    const newArr = [];

    for (let i = 0; i < pillarRatings.length; i += 3) {
      newArr.push(pillarRatings.slice(i, i + 3));
    }

    return newArr;
  }, [pillarRatings]);

  const renderItem = (item: Pillar[]): React.ReactElement => {
    return (
      <View style={styles.ratingContainer}>
        {item.map(
          (rat: Pillar): React.ReactElement => (
            <Rating circle key={rat.pillarName?.id} value={rat.rating} title={rat.pillarName?.name} />
          )
        )}
      </View>
    );
  };

  return (
    <>
      <View style={containerStyle}>
        {titleRequired && (
          <Label type="large" textType="semiBold" style={styles.headerTitle}>
            {t('common:overall')}
          </Label>
        )}
        <View style={styles.overallContainer}>
          <Title type="small">{rating}</Title>
          {rating && <Rating value={rating} />}
          <Label style={styles.basedOn}>{t('property:basedOn', { count: reviewCount })}</Label>
        </View>
        <SnapCarousel
          carouselData={splitData()}
          carouselItem={renderItem}
          activeIndex={activeIndex}
          onSnapToItem={setActiveIndex}
          sliderWidth={sliderWidth}
          itemWidth={sliderWidth}
        />
        <PaginationComponent
          dotsLength={splitData().length}
          activeSlide={activeIndex}
          containerStyle={styles.paginationContainer}
          activeDotStyle={[styles.dot, styles.activeDot]}
          inactiveDotStyle={[styles.dot, styles.inactiveDot]}
        />
      </View>
      {showDivider && <Divider containerStyles={styles.divider} />}
    </>
  );
};

const styles = StyleSheet.create({
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  overallContainer: {
    marginTop: 16,
    marginBottom: 24,
    alignItems: 'center',
  },
  paginationContainer: {
    paddingVertical: 16,
  },
  dot: {
    width: 7,
    height: 7,
  },
  activeDot: {
    borderWidth: 1.5,
  },
  inactiveDot: {
    backgroundColor: theme.colors.disabled,
    borderWidth: 0,
  },
  headerTitle: {
    marginTop: 16,
    color: theme.colors.darkTint3,
  },
  basedOn: {
    color: theme.colors.darkTint4,
    marginTop: 4,
  },
  divider: {
    borderColor: theme.colors.background,
  },
});

const memoizedComponent = React.memo(AssetReviewsSummary);
export { memoizedComponent as AssetReviewsSummary };
