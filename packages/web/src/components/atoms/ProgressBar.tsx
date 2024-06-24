import React from 'react';
import { View, StyleProp, ViewStyle, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

interface IProgressBarProps {
  progress: number;
  fromDate?: string;
  toDate?: string;
  filledColor?: string;
  isPropertyVacant: boolean;
  isTakeActions?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
}

const ProgressBar = (props: IProgressBarProps): React.ReactElement => {
  const { progress, isPropertyVacant, filledColor = theme.colors.highPriority, fromDate, toDate } = props;
  const { t } = useTranslation(LocaleConstants.namespacesKey.assetPortfolio);

  const renderProgress = (): React.ReactElement => {
    return (
      <View style={customStyles.containerStyle(isPropertyVacant)}>
        <View style={customStyles.fillerStyle(progress, isPropertyVacant, filledColor)} />
      </View>
    );
  };
  return (
    <>
      <View style={styles.container}>
        <Icon name={isPropertyVacant ? icons.house : icons.calendar} color={theme.colors.darkTint5} size={22} />
        <Label type="large" style={styles.label}>
          {isPropertyVacant ? t('listingScore') : t('leasePeriod')}
        </Label>
      </View>
      {renderProgress()}
      <View style={styles.subTitleContainer}>
        <Label type="regular" style={styles.text}>
          {fromDate}
        </Label>
        <Label type="regular" style={styles.text}>
          {toDate}
        </Label>
      </View>
    </>
  );
};
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
    marginLeft: 25,
  },
  label: {
    color: theme.colors.darkTint4,
    marginLeft: 5,
  },
});
const customStyles = {
  containerStyle: (isVacant: boolean): StyleProp<ViewStyle> => ({
    backgroundColor: isVacant ? theme.colors.background : theme.colors.green,
    height: 5,
    marginLeft: 25,
    marginTop: 10,
  }),
  fillerStyle: (progress: number, isVacant: boolean, filledColor: string): StyleProp<ViewStyle> => ({
    height: '100%',
    width: progress * 100,
    backgroundColor: isVacant ? theme.colors.green : filledColor,
  }),
};
export default ProgressBar;
