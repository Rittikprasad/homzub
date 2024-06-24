import React, { useCallback, useEffect, useState } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useTranslation } from 'react-i18next';
import { cloneDeep } from 'lodash';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Rating } from '@homzhub/common/src/components/atoms/Rating';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import { TextArea } from '@homzhub/common/src/components/atoms/TextArea';
import { AssetReview } from '@homzhub/common/src/domain/models/AssetReview';
import { Pillar } from '@homzhub/common/src/domain/models/Pillar';
import { IListingReviewParams } from '@homzhub/common/src/domain/repositories/interfaces';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

interface IProps {
  ratings: Pillar[];
  onUpdate: (payload: IListingReviewParams) => Promise<void>;
  onSubmit: (payload: IListingReviewParams) => Promise<void>;
  secondaryAction: () => void;
  isEdit?: boolean;
  isDeleteRequired?: boolean;
  review?: AssetReview;
  containerStyle?: StyleProp<ViewStyle>;
  customStyles?: ICustomStyles;
}

export interface ICustomStyles {
  buttonContainerStyle: StyleProp<ViewStyle>;
  buttonStyle: StyleProp<ViewStyle>;
}

const RatingForm = (props: IProps): React.ReactElement => {
  const {
    onSubmit,
    onUpdate,
    isEdit,
    ratings,
    review,
    secondaryAction,
    isDeleteRequired = true,
    containerStyle,
    customStyles,
  } = props;
  const { t } = useTranslation(LocaleConstants.namespacesKey.property);
  const { buttonContainerStyle, buttonStyle } = { ...customStyles };
  const [overallRating, setOverallRating] = useState(0);
  const [description, setDescription] = useState('');
  const [categoryRatings, setCategoryRatings] = useState<Pillar[]>([]);

  useEffect(() => {
    if (review) {
      setOverallRating(review?.rating);
      setDescription(review?.description);
    }
    setCategoryRatings(cloneDeep(ratings));
  }, [ratings, review]);

  const updatePillarRating = useCallback(
    (newRating: number, id: number): void => {
      const stateToUpdate = [...categoryRatings];
      const categoryToUpdate = stateToUpdate.find((pillar) => pillar.id === id);

      if (!categoryToUpdate || categoryToUpdate.rating === newRating) {
        return;
      }

      categoryToUpdate.rating = newRating;
      setCategoryRatings(stateToUpdate);
    },
    [categoryRatings]
  );

  const onClick = async (): Promise<void> => {
    let finalPayload: IListingReviewParams;
    const payload = {
      rating: overallRating,
      description,
    };

    if (isEdit) {
      finalPayload = {
        ...payload,
        pillar_ratings: categoryRatings.map((pillar: Pillar) => ({
          pillar: (pillar.pillarName?.id || pillar.id) ?? 0,
          rating: pillar.rating,
        })),
      };
      await onUpdate(finalPayload);
    } else {
      finalPayload = {
        ...payload,
        pillar_ratings: categoryRatings.map((pillar: Pillar) => ({ pillar: pillar.id, rating: pillar.rating })),
      };
      await onSubmit(finalPayload);
    }
  };

  const isWeb = PlatformUtils.isWeb();

  return (
    <KeyboardAwareScrollView
      style={[styles.container, containerStyle]}
      showsVerticalScrollIndicator={false}
      bounces={false}
      keyboardShouldPersistTaps="handled"
    >
      <Label type="large" textType="semiBold" style={styles.overallExperience}>
        {t('overallExperience')}
      </Label>
      <Rating isOverallRating value={overallRating} onChange={setOverallRating} />
      <View style={styles.pillarContainer}>
        {categoryRatings.map((pillarRating) => {
          return (
            <Rating
              key={pillarRating.id}
              title={(pillarRating.name || pillarRating.pillarName?.name) ?? ''}
              value={pillarRating.rating}
              onChange={(newRating): void => updatePillarRating(newRating, pillarRating.id)}
              containerStyle={styles.rating}
            />
          );
        })}
      </View>
      <TextArea
        label={t('assetDescription:description')}
        helpText={t('common:optional')}
        value={description}
        wordCountLimit={500}
        placeholder={t('bestReasons')}
        onMessageChange={setDescription}
        textAreaStyle={styles.textArea}
      />
      <View style={[styles.buttonContainer, buttonContainerStyle]}>
        <Button
          onPress={secondaryAction}
          type="secondary"
          title={isEdit && isDeleteRequired ? t('common:delete') : t('common:notNow')}
          titleStyle={isEdit && isDeleteRequired ? styles.buttonTitle : styles.buttonTitleText}
          containerStyle={[
            isEdit && isDeleteRequired ? styles.deleteButton : undefined,
            buttonStyle,
            isWeb && styles.buttonWeb,
          ]}
        />
        <Button
          onPress={onClick}
          disabled={isEdit ? false : overallRating === 0}
          type="primary"
          title={isEdit ? t('common:update') : t('common:submit')}
          containerStyle={[styles.submitButton, buttonStyle, isWeb && styles.buttonWeb]}
        />
      </View>
    </KeyboardAwareScrollView>
  );
};

export default RatingForm;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 24,
  },
  pillarContainer: {
    marginTop: 20,
    marginBottom: 4,
  },
  overallExperience: {
    textAlign: 'center',
    color: theme.colors.darkTint3,
    marginBottom: 16,
    marginTop: 12,
  },
  buttonContainer: {
    marginTop: 16,
    flexDirection: 'row',
    marginBottom: 12,
    justifyContent: 'space-around',
  },
  submitButton: {
    marginStart: 16,
  },
  textArea: {
    height: 100,
    borderRadius: 4,
  },
  rating: {
    marginBottom: 16,
  },
  buttonTitle: {
    marginHorizontal: 0,
    color: theme.colors.error,
  },
  buttonTitleText: {
    marginHorizontal: 0,
    color: theme.colors.active,
  },
  deleteButton: {
    borderColor: theme.colors.error,
  },
  buttonWeb: {
    width: 120,
  },
});
