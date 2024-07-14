import React, { Component } from "react";
import { Calendar, DateData } from "react-native-calendars";
import {
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextStyle,
  ViewStyle,
} from "react-native";
import moment from "moment";
import { groupBy } from "lodash";
import {
  DateFormats,
  DateUtils,
  MonthNames,
} from "@homzhub/common/src/utils/DateUtils";
import { PlatformUtils } from "@homzhub/common/src/utils/PlatformUtils";
import { theme } from "@homzhub/common/src/styles/theme";
import { Button } from "@homzhub/common/src/components/atoms/Button";
import CalendarHeader from "@homzhub/common/src/components/atoms/CalendarHeader";
import { Label } from "@homzhub/common/src/components/atoms/Text";

const INITIAL_YEAR = 1893;
const MAX_YEAR = Number(DateUtils.getNextYear(16));

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

export class CalendarComponent extends Component<
  ICalendarProps,
  ICalendarState
> {
  constructor(props: ICalendarProps) {
    super(props);
    const { selectedDate, isCurrentDateEnable } = props;
    this.state = {
      isMonthView: false,
      isYearView: false,
      selectedDate: isCurrentDateEnable
        ? DateUtils.getCurrentDate()
        : selectedDate,
      day: moment().format(DateFormats.DD),
      month: new Date().getMonth(),
      year: moment().format(DateFormats.YYYY),
      yearTitle: "",
      yearList: [],
    };
  }

  componentDidMount(): void {
    const { selectedDate, isOnlyYearView, minDate } = this.props;
    let yearData = this.getYearsData();
    if (isOnlyYearView) {
      yearData = this.getYearsData(Number(selectedDate));
    }
    const title = `${yearData[0]} - ${yearData[yearData.length - 1]}`;
    this.setState({ yearTitle: title, yearList: yearData });
  }

  render(): React.ReactNode {
    const { isMonthView, isYearView } = this.state;
    const { isOnlyYearView } = this.props;
    const isYear = isYearView || isOnlyYearView;
    return (
      <View>
        {this.renderHeader()}
        {isMonthView
          ? this.renderListView()
          : isYear
          ? this.renderListView(true)
          : this.renderCalendar()}
      </View>
    );
  }

  renderHeader = (): React.ReactElement => {
    const { allowPastDates, maxDate, isOnlyYearView, minDate } = this.props;
    const { isMonthView, selectedDate, isYearView, yearTitle } = this.state;
    let { month, year } = this.state;
    if (selectedDate) {
      month = moment(selectedDate, "MMM DD,YYYY").month();
      year = String(moment(selectedDate, "MMM DD,YYYY").year());
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

  renderListView = (isYearView?: boolean): React.ReactNode => {
    const { selectedDate } = this.state;
    const year = String(moment(selectedDate, "MMM DD,YYYY").year());
    const { yearList } = this.state;
    const listData = isYearView ? yearList : MonthNames;
    return (
      <FlatList
        data={listData}
        renderItem={({ item, index }) => this.renderItem({ item, year, index })}
        contentContainerStyle={styles.listContent}
        keyExtractor={this.renderKeyExtractor}
        numColumns={4}
      />
    );
  };

  renderKeyExtractor = (item: string, index: number): string => {
    return `${item}-${index}`;
  };

  renderItem = ({
    item,
    year,
    index,
  }: {
    item: string;
    year: string;
    index: number;
  }): React.ReactElement => {
    const { month, isMonthView, isYearView, selectedDate } = this.state;
    const { isOnlyYearView } = this.props;
    const onPressItem = () =>
      isMonthView
        ? this.onSelectMonth(item, index)
        : this.onSelectYear(item, index);
    const yearView = isOnlyYearView
      ? Number(selectedDate) === Number(item)
      : moment(selectedDate, "MMM DD,YYYY").month() === index;
    const isSelected = isYearView ? year === item : yearView;
    const isMobile = PlatformUtils.isMobile();
    let isDisable;
    if (isYearView) {
      isDisable = Number(item) < moment().year();
    }
    if (isMonthView) {
      isDisable =
        moment.monthsShort().indexOf(item) < moment().month() &&
        Number(year) === moment().year();
    }
    return (
      <TouchableOpacity
        key={index}
        style={StyleSheet.flatten([
          customStyles.renderItemView(isSelected, isMobile),
        ])}
        onPress={onPressItem}
        disabled={isDisable}
      >
        <Label
          type="large"
          style={StyleSheet.flatten([
            customStyles.renderItemTitle(isSelected),
            isDisable && customStyles.disabledItem,
          ])}
        >
          {item}
        </Label>
      </TouchableOpacity>
    );
  };

  renderCalendar = (): React.ReactElement => {
    const { allowPastDates, maxDate, minDate } = this.props;
    const { day, month, year, selectedDate } = this.state;
    const updateMonth = month + 1;
    const date =
      selectedDate ||
      DateUtils.getFormattedDate(day, updateMonth, year, "YYYY-MM-DD");
    const markedDate = !selectedDate
      ? moment().format("YYYY-MM-DD")
      : moment(date, "MMM DD,YYYY").format("YYYY-MM-DD");
    return (
      <>
        <Calendar
          hideArrows
          renderHeader={() => null}
          minDate={
            minDate
              ? minDate
              : allowPastDates
              ? undefined
              : moment().format("YYYY-MM-DD")
          }
          maxDate={maxDate}
          current={moment(date, "MMM DD,YYYY").format("YYYY-MM-DD")}
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

  onSelectMonth = (item: string, index: number): void => {
    const { year } = this.state;
    this.setState({ month: index, isMonthView: false, isYearView: false });
    this.getSelectedDate(index, Number(year));
  };

  onSelectYear = (item: string, index: number): void => {
    const { month } = this.state;
    const { isOnlyYearView, onSelect } = this.props;
    if (isOnlyYearView) {
      this.setState({ year: item, isMonthView: false, isYearView: false });
      onSelect(item);
    } else {
      this.setState({ year: item, isMonthView: true, isYearView: false });
      this.getSelectedDate(Number(month), Number(item));
    }
  };

  onDayPress = (day: DateData): void => {
    this.setState({
      selectedDate: moment(day.dateString, "YYYY-MM-DD").format("MMM DD,YYYY"),
    });
  };

  handleSelect = (): void => {
    const { onSelect } = this.props;
    const { selectedDate } = this.state;
    onSelect(selectedDate);
  };

  handleMonthPress = (): void => {
    const { isMonthView } = this.state;
    this.setState({ isMonthView: !isMonthView, isYearView: false });
  };

  handleYearPress = (): void => {
    const { isYearView } = this.state;
    const yearData = this.getYearsData();
    const yearTitle = `${yearData[0]} - ${yearData[yearData.length - 1]}`;
    this.setState({
      isYearView: !isYearView,
      isMonthView: false,
      yearTitle,
      yearList: yearData,
    });
  };

  handleBackPress = (): void => {
    const { allowPastDates, isOnlyYearView } = this.props;
    const { isMonthView, selectedDate, isYearView, yearTitle } = this.state;
    let { month, year } = this.state;
    if (selectedDate) {
      month = moment(selectedDate, "MMM DD,YYYY").month();
      year = moment(selectedDate, "MMM DD,YYYY").year().toString();
    }
    const value = Number(yearTitle.split("-")[0]);
    const isCurrentYear = Number(year) === moment().year();
    if (
      !allowPastDates &&
      month === moment().month() &&
      !isYearView &&
      isCurrentYear
    ) {
      return;
    }
    if (isMonthView) {
      const previousYear =
        Number(year) > INITIAL_YEAR ? Number(year) - 1 : Number(year);
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

  handleNextPress = (): void => {
    const { isMonthView, selectedDate, isYearView, yearTitle } = this.state;
    const { maxDate, isOnlyYearView } = this.props;
    const value = Number(yearTitle.split("-")[1]);
    if (maxDate && moment(maxDate).month() === moment().month()) {
      return;
    }
    let { month, year } = this.state;
    if (selectedDate) {
      month = moment(selectedDate, "MMM DD,YYYY").month();
      year = moment(selectedDate, "MMM DD,YYYY").year().toString();
    }
    if (isMonthView) {
      const nextYear =
        Number(year) < MAX_YEAR - 1 ? Number(year) + 1 : Number(year);
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

  getSelectedDate = (month: number, year: number): void => {
    const { day, selectedDate } = this.state;
    let newselectedDate = moment(selectedDate, "MMM DD,YYYY");
    const isNotSelected =
      moment(newselectedDate).month() !== month ||
      moment(newselectedDate).year() !== year;
    if (isNotSelected) {
      let defaultMonth =
        year === moment().year() && month < moment().month()
          ? moment().month()
          : month;
      this.setState({
        selectedDate: `${moment.monthsShort()[month]} ${day},${year}`,
      });
    } else {
      this.setState({ selectedDate });
    }
  };

  getYearsData = (updateYear?: number): string[] => {
    const { year, selectedDate } = this.state;
    const newYear = moment(selectedDate, "MMM DD,YYYY").year();
    const formattedYear = updateYear || Number(newYear || year);
    const years = [];
    let updatedData: string[] = [];
    for (let i = INITIAL_YEAR; i <= MAX_YEAR; i++) {
      if (i < MAX_YEAR) {
        years.push(i.toString());
      }
    }
    while (years.length > 0) {
      const data = years.splice(0, 16);
      const abc = groupBy(data, () => `${data[0]}-${data[data.length - 1]}`);
      Object.keys(abc).forEach((key) => {
        const values: string[] = key.split("-");
        if (
          Number(values[0]) <= formattedYear &&
          Number(values[1]) >= formattedYear
        ) {
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
  renderItemView: (
    isSelected: boolean,
    isMobile: boolean
  ): StyleProp<ViewStyle> => ({
    width: isMobile ? theme.viewport.width * 0.24 : 60,
    marginVertical: 12,
    alignItems: "center",
    backgroundColor: isSelected
      ? theme.colors.primaryColor
      : theme.colors.white,
    borderRadius: 4,
  }),
  renderItemTitle: (isSelected: boolean): StyleProp<TextStyle> => ({
    paddingVertical: 6,
    color: isSelected ? theme.colors.white : theme.colors.darkTint2,
  }),
  disabledItem: {
    color: "grey",
    opacity: 0.5,
  },
};
