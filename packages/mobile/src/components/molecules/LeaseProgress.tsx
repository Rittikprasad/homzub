import React from 'react';
import { StyleProp, StyleSheet, TextStyle, View, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import * as Progress from 'react-native-progress';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import { AssetCreationStep } from '@homzhub/common/src/domain/models/LastVisitedStep';

interface IProgressBarProps {
  progress?: number;
  fromDate?: string;
  toDate?: string;
  filledColor?: string;
  isPropertyVacant?: boolean;
  assetCreation?: AssetCreationStep;
  labelStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
}

const LeaseProgress = (props: IProgressBarProps): React.ReactElement => {
  const {
    progress,
    filledColor = theme.colors.highPriority,
    isPropertyVacant,
    fromDate,
    toDate,
    labelStyle = {},
    containerStyle = {},
    assetCreation,
  } = props;

  const { t } = useTranslation(LocaleConstants.namespacesKey.assetPortfolio);

  const getTitle = (): string => {
    if (!assetCreation) return '';

    if (!assetCreation.isDetailsDone) return t('addPropertyDetails');

    if (!assetCreation.isHighlightsDone) return t('addPropertyHighlights');

    return t('addPropertyImages');
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <Icon name={isPropertyVacant ? icons.house : icons.calendar} color={theme.colors.darkTint5} size={22} />
      <View style={styles.contentContainer}>
        <Label type="large" style={[styles.label, labelStyle]}>
          {isPropertyVacant ? t('propertyProfileCompletion') : t('leasePeriod')}
        </Label>
        <Progress.Bar
          progress={progress}
          width={null}
          color={isPropertyVacant ? theme.colors.green : filledColor}
          style={styles.barStyle}
          unfilledColor={isPropertyVacant ? theme.colors.background : theme.colors.green}
          borderRadius={4}
        />
        <View style={styles.subTitleContainer}>
          {isPropertyVacant ? (
            <Label type="regular" style={styles.text}>
              {getTitle()}
            </Label>
          ) : (
            <>
              <Label type="regular" style={styles.text}>
                {fromDate}
              </Label>
              <Label type="regular" style={styles.text}>
                {toDate}
              </Label>
            </>
          )}
        </View>
      </View>
    </View>
  );
};

const memoizedComponent = React.memo(LeaseProgress);
export { memoizedComponent as LeaseProgress };

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
  },
  contentContainer: {
    flex: 1,
    marginStart: 8,
  },
  barStyle: {
    borderColor: theme.colors.background,
    marginTop: 8,
  },
  subTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 6,
  },
  text: {
    color: theme.colors.darkTint6,
  },
  label: {
    color: theme.colors.darkTint4,
  },
});
