import React, { Component } from "react";
import {
  StyleProp,
  StyleSheet,
  Text as RNText,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { FormikProps } from "formik";
import moment from "moment";
import { withTranslation, WithTranslation } from "react-i18next";
import Icon, { icons } from "@homzhub/common/src/assets/icon";
import { theme } from "@homzhub/common/src/styles/theme";
import {
  FontWeightType,
  Label,
  Text,
  TextFieldType,
  TextSizeType,
} from "@homzhub/common/src/components/atoms/Text";
// import { CalendarComponent } from "@homzhub/mobile/src/components/atoms/CalendarComponent";
import { CalendarComponent } from "@homzhub/mobile/src/components/atoms/CalendarComponent";
import { BottomSheet } from "@homzhub/common/src/components/molecules/BottomSheet";

interface IFormCalendarProps extends WithTranslation {
  name: string;
  calendarTitle?: string;
  isYearView?: boolean;
  formProps?: FormikProps<any>;
  selectedValue?: string;
  label?: string;
  iconColor?: string;
  placeHolder?: string;
  allowPastDates?: boolean;
  isMandatory?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  placeHolderStyle?: StyleProp<TextStyle>;
  dateContainerStyle?: StyleProp<TextStyle>;
  dateStyle?: StyleProp<TextStyle>;
  textType?: TextFieldType;
  textSize?: TextSizeType;
  fontType?: FontWeightType;
  maxDate?: string;
  minDate?: string;
  isDisabled?: boolean;
  isCurrentDateEnable?: boolean;
  bubbleSelectedDate?: (day: string) => void;
}

interface IFormCalendarState {
  isCalendarVisible: boolean;
}

class FormCalendar extends Component<IFormCalendarProps, IFormCalendarState> {
  public state = {
    isCalendarVisible: false,
  };

  public render(): React.ReactNode {
    const {
      t,
      name,
      formProps,
      selectedValue,
      containerStyle = {},
      label,
      placeHolder,
      allowPastDates,
      textType,
      iconColor,
      isMandatory = false,
      textSize = "regular",
      fontType = "regular",
      placeHolderStyle = {},
      dateStyle = {},
      dateContainerStyle = {},
      maxDate,
      minDate,
      isYearView = false,
      isCurrentDateEnable = false,
      isDisabled = false,
      calendarTitle,
    } = this.props;
    const { isCalendarVisible } = this.state;
    const availableDate = (): string => {
      if (selectedValue) {
        return selectedValue;
      }

      return formProps?.values[name] === moment().format("YYYY-MM-DD")
        ? "Today"
        : formProps?.values[name];
    };

    const labelStyles = { ...theme.form.formLabel };
    let TextField = Text;
    if (textType === "label") {
      TextField = Label;
    }
    const isPlaceholderStyle = selectedValue === "" || !availableDate();

    return (
      <View style={containerStyle}>
        <TextField type={textSize} textType={fontType} style={labelStyles}>
          {label || t("common:availableFrom")}
          {isMandatory && <RNText style={styles.asterix}> *</RNText>}
        </TextField>

        <TouchableOpacity
          testID="toCalenderInput"
          style={[
            styles.dateView,
            dateContainerStyle,
            isDisabled && styles.disabled,
          ]}
          onPress={this.onCalendarOpen}
          disabled={isDisabled}
        >
          <View style={styles.dateLeft}>
            {!isYearView && (
              <Icon
                name={icons.calendar}
                color={iconColor || theme.colors.darkTint5}
                size={18}
              />
            )}
            <Text
              type="small"
              textType="regular"
              style={[
                styles.dateText,
                isPlaceholderStyle && placeHolderStyle,
                dateStyle,
              ]}
            >
              {availableDate() || placeHolder}
            </Text>
          </View>

          <Icon
            name={icons.downArrowFilled}
            color={theme.colors.darkTint7}
            size={16}
          />
        </TouchableOpacity>
        <BottomSheet
          visible={isCalendarVisible}
          onCloseSheet={this.onCalendarClose}
          headerTitle={calendarTitle ?? t("common:availableFrom")}
          isShadowView
          sheetHeight={580}
        >
          <CalendarComponent
            allowPastDates={allowPastDates}
            maxDate={maxDate}
            minDate={minDate}
            isOnlyYearView={isYearView}
            onSelect={this.onDateSelected}
            isCurrentDateEnable={isCurrentDateEnable}
            selectedDate={selectedValue ?? formProps?.values[name]}
          />
        </BottomSheet>
      </View>
    );
  }

  private onDateSelected = (day: string): void => {
    console.log("In onDateSelected", day);
    const { name, formProps, bubbleSelectedDate, isDisabled } = this.props;
    if (isDisabled) {
      return;
    }
    this.setState({ isCalendarVisible: false });
    if (bubbleSelectedDate) {
      bubbleSelectedDate(day);
    } else {
      formProps?.setFieldValue(name, day);
      formProps?.setFieldTouched(name);
    }
  };

  private onCalendarOpen = (): void => {
    const { isCalendarVisible } = this.state;
    this.setState({ isCalendarVisible: !isCalendarVisible });
  };

  private onCalendarClose = (): void => {
    this.setState({ isCalendarVisible: false });
  };
}

const styles = StyleSheet.create({
  dateView: {
    borderWidth: 1,
    borderColor: theme.colors.disabled,
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 4,
    marginTop: 6,
  },
  dateLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateText: {
    marginLeft: 16,
    color: theme.colors.darkTint1,
  },
  asterix: {
    color: theme.colors.error,
    fontSize: 12,
    fontWeight: "bold",
  },
  disabled: {
    opacity: 0.5,
  },
});
const HOC = withTranslation()(FormCalendar);
export { HOC as FormCalendar };
