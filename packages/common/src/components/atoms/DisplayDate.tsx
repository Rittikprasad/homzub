import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { DateFormats, DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import { Label } from '@homzhub/common/src/components/atoms/Text';

interface IProps {
  date: string;
  isYearRequired?: boolean;
  containerStyle?: ViewStyle;
}

const DisplayDate = (props: IProps): React.ReactElement => {
  const { date, isYearRequired = false, containerStyle } = props;
  return (
    <View style={[containerStyle && containerStyle]}>
      <View style={[styles.dateStyle, isYearRequired && styles.withYear]}>
        <Label type="large" textType="bold" style={styles.dateTextStyle}>
          {DateUtils.getDisplayDate(date, DateFormats.DD)}
        </Label>
        <Label type="regular" style={styles.monthYearStyle}>
          {DateUtils.getDisplayDate(date, DateFormats.MMM)}
        </Label>
        {isYearRequired && (
          <Label type="regular" style={styles.monthYearStyle}>
            {DateUtils.getDisplayDate(date, DateFormats.y)}
          </Label>
        )}
      </View>
    </View>
  );
};

export default React.memo(DisplayDate);

const styles = StyleSheet.create({
  dateStyle: {
    alignItems: 'center',
    width: 52,
    height: 60,
    borderWidth: 1,
    borderColor: theme.colors.darkTint10,
    borderRadius: 4,
    paddingVertical: 12,
    marginEnd: 12,
  },
  withYear: {
    height: 80,
  },
  dateTextStyle: {
    color: theme.colors.darkTint2,
  },
  monthYearStyle: {
    color: theme.colors.darkTint6,
  },
});
