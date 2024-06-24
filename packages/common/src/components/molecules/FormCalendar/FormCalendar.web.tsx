/* eslint-disable no-unused-vars */ // TODO - remove this once all cases are resolved
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { Component } from 'react';
import {
  StyleProp,
  StyleSheet,
  Text as RNText,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
  LayoutChangeEvent,
} from 'react-native';
import { FormikProps } from 'formik';
import moment from 'moment';
import { withTranslation, WithTranslation } from 'react-i18next';
import { PopupProps, PopupActions } from 'reactjs-popup/dist/types';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { FunctionUtils } from '@homzhub/common/src/utils/FunctionUtils';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import Popover from '@homzhub/web/src/components/atoms/Popover';
import { FontWeightType, Label, Text, TextFieldType, TextSizeType } from '@homzhub/common/src/components/atoms/Text';
import '@homzhub/common/src/components/molecules/FormCalendar/webCalendar.scss';

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
  isCurrentDateEnable?: boolean;
  bubbleSelectedDate?: (day: string | number) => void;
  popupProps?: PopupProps;
}

interface IFormCalendarState {
  isCalendarVisible: boolean;
  width: number | string;
}

class FormCalendar extends Component<IFormCalendarProps, IFormCalendarState> {
  public state = {
    isCalendarVisible: false,
    width: 0,
    date: new Date(),
  };

  private popupRef = React.createRef<PopupActions>();

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
      textSize = 'regular',
      fontType = 'regular',
      placeHolderStyle = {},
      dateStyle = {},
      dateContainerStyle = {},
      maxDate,
      minDate,
      isYearView = false,
      isCurrentDateEnable = false,
      popupProps,
    } = this.props;
    const { width, date } = this.state;
    const { position } = { ...popupProps, position: popupProps?.position || 'bottom left' };
    const availableDate = (): string => {
      if (selectedValue) {
        return selectedValue;
      }
      return formProps?.values[name] === moment().format('YYYY-MM-DD') ? 'Today' : formProps?.values[name];
    };

    const defaultDropDownProps = (width_dropdown: string | number): PopupProps => ({
      position,
      on: 'click',
      arrow: false,
      contentStyle: { minWidth: width_dropdown, marginTop: '4px' },
      closeOnDocumentClick: true,
      children: undefined,
    });

    const labelStyles = { ...theme.form.formLabel };
    let TextField = Text;
    if (textType === 'label') {
      TextField = Label;
    }
    const onLayout = (e: LayoutChangeEvent): void => {
      this.setState({ width: e.nativeEvent.layout.width });
    };

    const isPlaceholderStyle = selectedValue === '' || !availableDate();
    return (
      <View style={containerStyle}>
        <TextField type={textSize} textType={fontType} style={labelStyles}>
          {label || t('common:availableFrom')}
          {isMandatory && <RNText style={styles.asterix}> *</RNText>}
        </TextField>
        {!PlatformUtils.isMobile() && (
          <Popover
            content={this.renderCalendar()}
            popupProps={defaultDropDownProps(width)}
            forwardedRef={this.popupRef}
          >
            <View onLayout={onLayout}>
              <TouchableOpacity
                testID="toCalenderInput"
                style={[styles.dateView, dateContainerStyle]}
                onPress={this.onCalendarOpen}
              >
                <View style={styles.dateLeft}>
                  {!isYearView && <Icon name={icons.calendar} color={iconColor || theme.colors.darkTint5} size={18} />}
                  <Text
                    type="small"
                    textType="regular"
                    style={[styles.dateText, isPlaceholderStyle && placeHolderStyle, dateStyle]}
                  >
                    {availableDate() || placeHolder}
                  </Text>
                </View>

                <Icon name={icons.downArrowFilled} color={theme.colors.darkTint7} size={16} />
              </TouchableOpacity>
            </View>
          </Popover>
        )}
      </View>
    );
  }

  private renderCalendar = (): React.ReactElement => {
    const { date } = this.state;
    const { isYearView, minDate } = this.props;
    return (
      <Calendar
        value={date}
        calendarType="ISO 8601"
        className="react-calender-web"
        defaultView={isYearView ? 'decade' : 'month'}
        minDate={new Date()}
        onChange={(datum: Date | Date[]): void => this.onChangeDate(datum)}
        onClickYear={isYearView ? this.onChangeDate : FunctionUtils.noop}
      />
    );
  };

  private onChangeDate = (datum: Date | Date[]): void => {
    const newDate = this.formatDate(datum.toString());
    this.onDateSelected(newDate);
  };

  private onDateSelected = (day: string | number): void => {
    const { name, formProps, bubbleSelectedDate } = this.props;
    this.setState({ isCalendarVisible: false });
    if (bubbleSelectedDate) {
      bubbleSelectedDate(day);
    } else {
      formProps?.setFieldValue(name, day);
      formProps?.setFieldTouched(name);
    }
    if (this.popupRef && this.popupRef.current) {
      this.popupRef.current?.close();
    }
  };

  private onCalendarOpen = (): void => {
    const { isCalendarVisible } = this.state;
    this.setState({ isCalendarVisible: !isCalendarVisible });
  };

  private onCalendarClose = (): void => {
    this.setState({ isCalendarVisible: false });
  };

  private formatDate = (dates: string): string | number => {
    const { isYearView } = this.props;
    const d = new Date(dates);
    let month = `${d.getMonth() + 1}`;
    let day = `${d.getDate()}`;
    const year = d.getFullYear();

    if (month.length < 2) month = `0${month}`;
    if (day.length < 2) day = `0${day}`;
    if (isYearView) {
      return year;
    }

    return [year, month, day].join('-');
  };
}

const styles = StyleSheet.create({
  dateView: {
    borderWidth: 1,
    borderColor: theme.colors.disabled,
    flexDirection: 'row',
    paddingVertical: 13,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 4,
  },
  dateLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    marginLeft: 16,
    color: theme.colors.darkTint1,
  },
  asterix: {
    color: theme.colors.error,
    fontSize: 12,
    fontWeight: 'bold',
  },
});
const HOC = withTranslation()(FormCalendar);
export { HOC as FormCalendar };
