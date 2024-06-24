import React, { Component } from 'react';
import { Calendar, DateObject } from 'react-native-calendars';
import { View, FlatList, TouchableOpacity, StyleSheet, StyleProp, TextStyle, ViewStyle } from 'react-native';
import moment from 'moment';
import { groupBy } from 'lodash';
import { DateFormats, DateUtils, MonthNames } from '@homzhub/common/src/utils/DateUtils';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import CalendarHeader from '@homzhub/common/src/components/atoms/CalendarHeader';
import { Label } from '@homzhub/common/src/components/atoms/Text';

// CONSTANTS START

const INITIAL_YEAR = 1893;
const MAX_YEAR = Number(DateUtils.getNextYear(16));

// CONSTANTS END

interface ICalendarProps {
  onSelect: (day: string) => void;
  selectedDate: string;
  isCurrentDateEnable?: boolean;
  allowPastDates?: boolean;
  maxDate?: string;
  minDate?: string;
  isOnlyYearView?: boolean;
}

interface ICalendarState {
  isMonthView: boolean;
  isYearView: boolean;
  selectedDate: string;
  day: string;
  month: number;
  year: string;
  yearTitle: string;
  yearList: string[];
}

export class CalendarComponent extends Component<ICalendarProps, ICalendarState> {
  public constructor(props: ICalendarProps) {
    super(props);
    const { selectedDate, isCurrentDateEnable } = props;
    this.state = {
      isMonthView: false,
      isYearView: false,
      selectedDate: isCurrentDateEnable ? DateUtils.getCurrentDate() : selectedDate,
      day: moment().format(DateFormats.DD),
      month: new Date().getMonth(),
      year: moment().format(DateFormats.YYYY),
      yearTitle: '',
      yearList: [],
    };
  }

  public componentDidMount = (): void => {
    const { selectedDate, isOnlyYearView } = this.props;
    let yearData = this.getYearsData();
    if (isOnlyYearView) {
      yearData = this.getYearsData(Number(selectedDate));
    }
    const title = `${yearData[0]} - ${yearData[yearData.length - 1]}`;
    this.setState({ yearTitle: title, yearList: yearData });
  };

  public render(): React.ReactNode {
    const { isMonthView, isYearView } = this.state;
    const { isOnlyYearView } = this.props;
    const isYear = isYearView || isOnlyYearView;
    return (
      <View>
        {this.renderHeader()}
        {isMonthView ? this.renderListView() : isYear ? this.renderListView(true) : this.renderCalendar()}
      </View>
    );
  }

  private renderHeader = (): React.ReactElement => {
    const { allowPastDates, maxDate, isOnlyYearView, minDate } = this.props;
    const { isMonthView, selectedDate, isYearView, yearTitle } = this.state;
    let { month, year } = this.state;
    if (selectedDate) {
      month = moment(selectedDate).month();
      year = String(moment(selectedDate).year());
    }
    const updateMonth = DateUtils.getFullMonthName(month, DateFormats.MMMM);

    const isCurrentMonth = month === moment().month();

    const title = `${updateMonth} ${year}`;

    return (
      <CalendarHeader
        isAllowPastDate={allowPastDates}
        headerTitle={title}
        month={month}
        year={year}
        headerYear={`${year}`}
        isCurrentMonth={isCurrentMonth}
        isMonthView={isMonthView}
        yearTitle={yearTitle}
        isYearView={isYearView || isOnlyYearView}
        maxDate={maxDate}
        minDate={minDate}
        onBackPress={this.handleBackPress}
        onNextPress={this.handleNextPress}
        onMonthPress={this.handleMonthPress}
        onYearPress={this.handleYearPress}
      />
    );
  };

  private renderListView = (isYearView?: boolean): React.ReactNode => {
    const { yearList } = this.state;

    const listData = isYearView ? yearList : MonthNames;

    return (
      <FlatList
        data={listData}
        renderItem={this.renderItem}
        contentContainerStyle={styles.listContent}
        keyExtractor={this.renderKeyExtractor}
        numColumns={4}
      />
    );
  };

  private renderKeyExtractor = (item: string, index: number): string => {
    return `${item}-${index}`;
  };

  private renderItem = ({ item, index }: { item: string; index: number }): React.ReactElement => {
    const { month, isMonthView, isYearView, year } = this.state;
    const { isOnlyYearView, selectedDate } = this.props;
    const onPressItem = (): void => (isMonthView ? this.onSelectMonth(item, index) : this.onSelectYear(item, index));
    const yearView = isOnlyYearView ? Number(selectedDate) === Number(item) : month === index;
    const isSelected = isYearView ? year === item : yearView;
    const isMobile = PlatformUtils.isMobile();

    return (
      <TouchableOpacity
        key={index}
        style={StyleSheet.flatten([customStyles.renderItemView(isSelected, isMobile)])}
        onPress={onPressItem}
      >
        <Label type="large" style={StyleSheet.flatten([customStyles.renderItemTitle(isSelected)])}>
          {item}
        </Label>
      </TouchableOpacity>
    );
  };

  private renderCalendar = (): React.ReactElement => {
    const { allowPastDates, maxDate, minDate } = this.props;
    const { day, month, year, selectedDate } = this.state;
    const updateMonth = month + 1;
    const date = selectedDate || DateUtils.getFormattedDate(day, updateMonth, year, 'YYYY-MM-DD').toDateString();
    const markedDate = !selectedDate ? moment().format('YYYY-MM-DD') : moment(date).format('YYYY-MM-DD');

    return (
      <>
        <Calendar
          hideArrows
          // @ts-ignore
          renderHeader={(): null => null}
          minDate={minDate ? DateUtils.getDisplayDate(minDate, 'YYYY-MM-DD') : allowPastDates ? undefined : new Date()}
          maxDate={maxDate}
          current={date}
          key={date}
          style={styles.calendarStyle}
          onDayPress={this.onDayPress}
          markingType="custom"
          theme={{}}
          markedDates={{
            [markedDate]: {
              customStyles: {
                container: {
                  backgroundColor: theme.colors.primaryColor,
                  borderRadius: 4,
                },
                text: {
                  color: theme.colors.white,
                },
              },
            },
          }}
        />
        <Button
          type="primary"
          title="Select"
          containerStyle={styles.buttonStyle}
          disabled={!selectedDate}
          onPress={this.handleSelect}
        />
      </>
    );
  };

  private onSelectMonth = (item: string, index: number): void => {
    const { year } = this.state;
    this.setState({ month: index, isMonthView: false, isYearView: false });
    this.getSelectedDate(index, Number(year));
  };

  private onSelectYear = (item: string, index: number): void => {
    const { month } = this.state;
    const { isOnlyYearView, onSelect } = this.props;
    if (isOnlyYearView) {
      this.setState({ year: item, isMonthView: false, isYearView: false });
      onSelect(item);
    } else {
      this.setState({ year: item, isMonthView: true, isYearView: false });
      this.getSelectedDate(Number(month), index);
    }
  };

  private onDayPress = (day: DateObject): void => {
    this.setState({ selectedDate: day.dateString });
  };

  private handleSelect = (): void => {
    const { onSelect } = this.props;
    const { selectedDate } = this.state;
    onSelect(selectedDate);
  };

  private handleMonthPress = (): void => {
    const { isMonthView } = this.state;
    this.setState({ isMonthView: !isMonthView, isYearView: false });
  };

  private handleYearPress = (): void => {
    const { isYearView } = this.state;
    const yearData = this.getYearsData();
    const yearTitle = `${yearData[0]} - ${yearData[yearData.length - 1]}`;
    this.setState({ isYearView: !isYearView, isMonthView: false, yearTitle, yearList: yearData });
  };

  /**
   * Handle Back Press Functionality
   * Cases: Day, Month and Year view
   */
  private handleBackPress = (): void => {
    const { allowPastDates, isOnlyYearView } = this.props;
    const { isMonthView, selectedDate, isYearView, yearTitle } = this.state;
    let { month, year } = this.state;

    // For year view
    const value = Number(yearTitle.split('-')[0]);
    // For year view

    if (selectedDate) {
      month = moment(selectedDate).month();
      year = moment(selectedDate).year().toString();
    }

    if (!allowPastDates && month === moment().month() && !isYearView) {
      return;
    }

    if (isMonthView) {
      const previousYear = Number(year) > INITIAL_YEAR ? Number(year) - 1 : Number(year);
      this.getSelectedDate(month, previousYear);
      this.setState({ year: previousYear.toString() });
    } else if ((isYearView || isOnlyYearView) && value > INITIAL_YEAR) {
      const previousYear = value - 1;
      const yearData = this.getYearsData(previousYear);
      const title = `${yearData[0]} - ${yearData[yearData.length - 1]}`;
      this.setState({ yearTitle: title, yearList: yearData });
    } else {
      const previousMonth = month < 1 ? 11 : month - 1;
      const updatedYear = month < 1 ? Number(year) - 1 : Number(year);
      this.getSelectedDate(previousMonth, updatedYear);
      this.setState({ month: previousMonth, year: updatedYear.toString() });
    }
  };

  /**
   * Handle Next Press Functionality
   * Cases: Day, Month and Year view
   */
  private handleNextPress = (): void => {
    const { isMonthView, selectedDate, isYearView, yearTitle } = this.state;
    const { maxDate, isOnlyYearView } = this.props;

    // For year view
    const value = Number(yearTitle.split('-')[1]);
    // For year view

    let { month, year } = this.state;
    if (maxDate && moment(maxDate).month() === moment().month()) {
      return;
    }
    if (selectedDate) {
      month = moment(selectedDate).month();
      year = moment(selectedDate).year().toString();
    }

    if (isMonthView) {
      const nextYear = Number(year) < MAX_YEAR - 1 ? Number(year) + 1 : Number(year);
      this.getSelectedDate(month, nextYear);
      this.setState({ year: nextYear.toString() });
    } else if ((isYearView || isOnlyYearView) && value < MAX_YEAR - 1) {
      const nextYear = value + 1;
      const yearData = this.getYearsData(nextYear);
      const title = `${yearData[0]} - ${yearData[yearData.length - 1]}`;
      this.setState({ yearTitle: title, yearList: yearData });
    } else {
      const nextMonth = month <= 10 ? month + 1 : 0;
      const nextYear = month <= 10 ? Number(year) : Number(year) + 1;
      this.getSelectedDate(nextMonth, nextYear);
      this.setState({ month: nextMonth, year: nextYear.toString() });
    }
  };

  private getSelectedDate = (month: number, year: number): void => {
    const { selectedDate } = this.props;
    const isNotSelected = moment(selectedDate).month() !== month || moment(selectedDate).year() !== year;
    if (isNotSelected) {
      this.setState({ selectedDate: '' });
    } else {
      this.setState({ selectedDate });
    }
  };

  /**
   * Created Year list for year view
   * Grouping by INITIAL and MAX year on the gap of 16 years
   */
  private getYearsData = (updateYear?: number): string[] => {
    const { year, selectedDate } = this.state;
    const newYear = moment(selectedDate).year();
    const formattedYear = updateYear || Number(newYear || year);
    const years = [];
    let updatedData: string[] = [];

    // for years list
    for (let i = INITIAL_YEAR; i <= MAX_YEAR; i++) {
      if (i < MAX_YEAR) {
        years.push(i.toString());
      }
    }

    while (years.length > 0) {
      const data = years.splice(0, 16);
      const abc = groupBy(data, () => `${data[0]}-${data[data.length - 1]}`);

      // eslint-disable-next-line no-loop-func
      Object.keys(abc).forEach((key) => {
        const values: string[] = key.split('-');
        if (Number(values[0]) <= formattedYear && Number(values[1]) >= formattedYear) {
          updatedData = abc[key];
        }
      });
    }

    return updatedData;
  };
}

const styles = StyleSheet.create({
  buttonStyle: {
    flex: 0,
    margin: 16,
  },
  listContent: {
    marginVertical: 16,
  },
  calendarStyle: {
    height: 310,
  },
});

const customStyles = {
  headerTitle: (isMonthView: boolean): StyleProp<TextStyle> => ({
    color: isMonthView ? theme.colors.darkTint2 : theme.colors.primaryColor,
  }),
  renderItemView: (isSelected: boolean, isMobile: boolean): StyleProp<ViewStyle> => ({
    width: isMobile ? theme.viewport.width * 0.24 : 60,
    marginVertical: 12,
    alignItems: 'center',
    backgroundColor: isSelected ? theme.colors.primaryColor : theme.colors.white,
    borderRadius: 4,
  }),
  renderItemTitle: (isSelected: boolean, isDisable?: boolean): StyleProp<TextStyle> => ({
    paddingVertical: 6,
    color: isSelected ? theme.colors.white : isDisable ? theme.colors.disabled : theme.colors.darkTint2,
  }),
};
