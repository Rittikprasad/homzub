import React from "react";
import { StyleSheet, View } from "react-native";
import moment from "moment";
import { FunctionUtils } from "@homzhub/common/src/utils/FunctionUtils";
import Icon, { icons } from "@homzhub/common/src/assets/icon";
import { theme } from "@homzhub/common/src/styles/theme";
import { Divider } from "@homzhub/common/src/components/atoms/Divider";
import { Text } from "@homzhub/common/src/components/atoms/Text";

interface IProps {
  isAllowPastDate?: boolean;
  headerTitle?: string;
  headerYear?: string;
  yearTitle?: string;
  isMonthView?: boolean;
  isYearView?: boolean;
  isCurrentMonth?: boolean;
  maxDate?: string;
  minDate?: string;
  month?: number;
  year?: string;
  onBackPress?: () => void;
  onNextPress?: () => void;
  onMonthPress?: () => void;
  onYearPress?: () => void;
}

const CalendarHeader = (props: IProps): React.ReactElement => {
  const {
    isAllowPastDate,
    maxDate,
    minDate,
    onBackPress,
    onNextPress,
    onMonthPress,
    onYearPress,
    isCurrentMonth,
    headerTitle,
    headerYear,
    isMonthView = false,
    isYearView = false,
    yearTitle,
    month,
    year,
  } = props;

  const isCurrentYear = year === String(moment().year());
  const yearView =
    moment().year() > Number(yearTitle?.split("-")[0]) &&
    moment().year() < Number(yearTitle?.split("-")[1]);

  const getIsNextDisable = () => {
    if (maxDate && month && year) {
      return (
        moment(maxDate).month() === moment().month() ||
        (moment(maxDate).month() === month &&
          moment(maxDate).year() === Number(year))
      );
    }
    return false;
  };

  const getIsPreviousDisable = () => {
    if (minDate) {
      return moment(minDate).year() === moment().year();
    }
    return !isAllowPastDate;
  };

  const isNextDisable = isYearView
    ? getIsNextDisable()
    : isMonthView
    ? getIsNextDisable()
    : getIsNextDisable();

  const isPreviousDisable = isYearView
    ? getIsPreviousDisable() && yearView
    : isMonthView
    ? getIsPreviousDisable() && isCurrentYear && !isYearView
    : getIsPreviousDisable() &&
      (isMonthView ? !isCurrentMonth : isCurrentMonth) &&
      isCurrentYear &&
      !isYearView;

  return (
    <>
      <View style={styles.headerContainer}>
        <Icon
          name={icons.leftArrow}
          onPress={!isPreviousDisable ? onBackPress : FunctionUtils.noop}
          size={22}
          color={
            isPreviousDisable
              ? theme.colors.disabled
              : theme.colors.primaryColor
          }
        />
        {!isYearView && !isMonthView && (
          <Text
            type="small"
            textType="semiBold"
            onPress={onMonthPress}
            style={styles.headerTitle}
          >
            {headerTitle}
          </Text>
        )}
        {isMonthView && (
          <Text
            type="small"
            textType="semiBold"
            onPress={onYearPress}
            style={styles.headerTitle}
          >
            {headerYear}
          </Text>
        )}
        {isYearView && (
          <Text type="small" textType="semiBold" style={styles.headerTitle}>
            {yearTitle}
          </Text>
        )}
        <Icon
          name={icons.rightArrow}
          size={22}
          color={
            isNextDisable ? theme.colors.disabled : theme.colors.primaryColor
          }
          onPress={!isNextDisable ? onNextPress : FunctionUtils.noop}
        />
      </View>
      <Divider />
    </>
  );
};

export default CalendarHeader;

const styles = StyleSheet.create({
  headerContainer: {
    justifyContent: "space-between",
    flexDirection: "row",
    paddingVertical: 20,
    paddingHorizontal: 24,
  },
  headerTitle: {
    color: theme.colors.primaryColor,
  },
});
