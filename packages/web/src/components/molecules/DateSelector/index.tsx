import React, { useState } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import '@homzhub/web/src/components/molecules/DateSelector/style.scss';

interface IProgressBarProps {
  containerStyles?: StyleProp<ViewStyle>;
}

export const DateSelector = (props: IProgressBarProps): React.ReactElement => {
  const handleChange = (date: any): void => {
    setStartDate(date);
  };

  const { containerStyles = {} } = props;
  const [StartDate, setStartDate] = useState();
  return (
    <View style={containerStyles}>
      <Label type="regular" textType="regular" style={styles.label}>
        Add Date
      </Label>
      <View style={styles.child}>
        <Icon name={icons.schedule} size={17} style={styles.calenderIcon} />
        <DatePicker
          selected={StartDate}
          onChange={handleChange}
          timeIntervals={20}
          timeCaption="time"
          dateFormat="MMMM d, yyyy "
          minDate={new Date()}
          className="datePickerContainer"
          placeholderText="Select a Date"
        />
        <Icon name={icons.downArrowFilled} size={17} style={styles.Icon} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  barStyle: {
    borderColor: theme.colors.disabled,
    borderRadius: 2,
  },
  child: {
    flexDirection: 'row',
    borderColor: theme.colors.disabled,
    borderWidth: 1,
    height: 48,
    borderRadius: 4,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 5,
  },
  status: {
    color: theme.colors.darkTint4,
    marginTop: 6,
  },
  progressTitle: {
    color: theme.colors.gray3,
    marginTop: 6,
  },
  DatePicker: {
    width: 500,
  },
  calenderIcon: {
    color: theme.colors.darkTint5,
  },
  Icon: {
    color: theme.colors.darkTint9,
  },
  label: {
    color: theme.colors.darkTint3,
    paddingBottom: 8,
    marginTop: 16,
  },
});
