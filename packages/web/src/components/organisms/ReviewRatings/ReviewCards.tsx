import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme } from '@homzhub/common/src/styles/theme';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import { Rating } from '@homzhub/common/src/components/atoms/Rating';
import { Avatar } from '@homzhub/common/src/components/molecules/Avatar';
import { AssetReview } from '@homzhub/common/src/domain/models/AssetReview';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

interface IProps {
  reviewData: AssetReview;
}

const ReviewCards = (props: IProps): React.ReactElement => {
  const {
    reviewData: { description, postedAt, rating, reviewedBy, pillarRatings },
  } = props;

  const { t } = useTranslation(LocaleConstants.namespacesKey.assetDescription);

  return (
    <View style={styles.container}>
      <View style={styles.comment}>
        <Avatar
          fullName={reviewedBy.name}
          image={reviewedBy.profilePicture}
          imageSize={50}
          designation={t('common:admin')}
          date={postedAt}
        />
      </View>
      <Label type="large" textType="light" style={styles.comment}>
        {description}
      </Label>
      <Rating isOverallRating value={rating ?? 0} />
      <View style={styles.containerPillar}>
        {pillarRatings.map((pillar, index) => {
          return (
            <Rating
              key={pillar.id}
              title={pillar.pillarName?.name ?? ''}
              value={pillar.rating}
              containerStyle={index !== pillarRatings.length - 1 && styles.rating}
            />
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
    flex: 1,
  },
  comment: {
    marginVertical: 12,
    flexDirection: 'row',
  },
  rating: {
    marginBottom: 16,
  },
  containerPillar: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginTop: 16,
  },
});

export default ReviewCards;
