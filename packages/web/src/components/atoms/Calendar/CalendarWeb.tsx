import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { FunctionUtils } from '@homzhub/common/src/utils/FunctionUtils';
import '@homzhub/web/src/components/atoms/Calendar/CalendarWeb.scss';

interface ICalendarProps {
  onSelect: (argDate: Date, argFormattedDate: string) => void;
  selectedValue: Date;
  selectedDate?: string;
  isYearView?: boolean;
  maxDate?: string;
  minDate?: string;
  isCurrentDateEnable?: boolean;
  bubbleSelectedDate?: (day: string | number) => void;
}

type Props = ICalendarProps;

const CalendarWeb: React.FC<Props> = (props: Props) => {
  const { onSelect, selectedValue, isYearView = false, bubbleSelectedDate } = props;

  const onChangeDate = (datum: Date): void => {
    const newDate = formatDate(datum.toString());
    onSelect(datum, newDate as string);
    onDateSelected(newDate);
  };

  const onDateSelected = (day: string | number): void => {
    if (bubbleSelectedDate) {
      bubbleSelectedDate(day);
    }
  };

  const formatDate = (dates: string): string | number => {
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

  return (
    <Calendar
      defaultValue={selectedValue}
      value={selectedValue}
      calendarType="ISO 8601"
      className="react-calender-web-custom"
      defaultView={isYearView ? 'decade' : 'month'}
      minDate={new Date()}
      onChange={(datum: Date | Date[]): void => onChangeDate(datum as Date)}
      onClickYear={isYearView ? onChangeDate : FunctionUtils.noop}
    />
  );
};

export default CalendarWeb;
