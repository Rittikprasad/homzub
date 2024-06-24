import moment, { Moment, unitOfTime } from 'moment';
import { I18nService } from '@homzhub/common/src/services/Localization/i18nextService';

export const MonthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const DateFormats = {
  ISO: 'YYYY-MM-DDThh:mm:ss.sss[Z]',
  ISO24Format: 'YYYY-MM-DDTHH:mm:ss.sssZ',
  ISO8601: 'YYYY-MM-DDTHH:mm:ss.SSSSZ',
  ddd: 'ddd',
  DD: 'DD',
  y: 'y',
  years: 'years',
  DDMMYYYY: 'DD-MM-YYYY',
  DDMMMYYYY: 'DD MMM YYYY',
  DoMMMYYYY: 'Do MMM YYYY',
  DD_MMM_YYYY: 'DD/MMM/YYYY',
  MMM: 'MMM',
  MMMM: 'MMMM',
  MMMDDYYYYHMMA: 'MMM D YYYY - h:mm A',
  MMMYYYY: 'MMM, YYYY',
  MMYYYY: 'MM/YYYY',
  DD_MM_YYYY: 'DD/MM/YYYY',
  MMYY: 'MM/YY',
  YYYYMMDD: 'YYYY-MM-DD',
  YYYYMMMDD: 'YYYY-MMM-DD',
  YYYY: 'YYYY',
  MMMMYYYY: 'MMMM YYYY',
  DoMMM_YYYY: 'Do MMM, YYYY',
  MM_YYYY: 'MM-YYYY',
  DD_MMMMYYYY: 'DD, MMMM YYYY',
  DD_MMMYYYY: 'DD, MMM YYYY',
  YYYYMMDD_HM: 'YYYY-MM-DD hh:mm',
  MMM_YYYY: 'MMM YYYY',
  DDMMMYYYY_H: 'DD MMM YYYY, h A',
  DDMMMYYYY_HM: 'DD/MMM/YYYY-HH:MM',
  DDMMMYYYY_Hm: 'DD/MMM/YYYY-HH:mm',
  DDMM: 'DD MMM',
  HHMM_A: 'hh:mm a',
  HHMM_AP: 'hh:mm A',
  DDMM_YYYY_HH_MM: 'DD MMM, YYYY - H:mm ',
  D_MMM_YYYY: 'D MMM, YYYY',
};

class DateUtils {
  public getFullMonthName = (monthIndex: number, format: string): string => {
    return moment().month(monthIndex).format(format);
  };

  public isLeapYear = (year: string): boolean => {
    return moment([year]).isLeapYear();
  };

  public getFormattedDate = (day: string, month: number, year: string, format: string): Date => {
    const isLeapYear = this.isLeapYear(year);
    const formattedDay = isLeapYear && month === 1 ? day : '28';
    return moment(`${year}-${month}-${formattedDay}`, format).toDate();
  };

  public getDisplayDate = (date: string, format: string): string => {
    return moment(date).format(format);
  };

  public getUtcDisplayDate = (date: string, format: string): string => {
    return moment.utc(date).format(format);
  };

  public getDateFromISO = (selectedDate: string, format: string): string => {
    return moment.utc(new Date(selectedDate)).format(format);
  };

  public getCurrentMonth = (): string => {
    return moment.utc(new Date()).format('MMM YYYY');
  };

  public getCurrentMonthName = (): string => {
    return moment.utc(new Date()).format('MMM');
  };

  public getLastMonth = (): string => {
    return moment.utc(new Date()).subtract(1, 'months').format('MMM YYYY');
  };

  public getCurrentYear = (): string => {
    return moment.utc(new Date()).format('YYYY');
  };

  public getLastYear = (): string => {
    return moment.utc(new Date()).subtract(1, 'years').format('YYYY');
  };

  public getNextYear = (count?: number): string => {
    return moment
      .utc(new Date())
      .add(count ?? 1, 'years')
      .format('YYYY');
  };

  public getCurrentFinancialYear = (): string => {
    const currentYear = this.getCurrentYear();
    const startDate = moment(`04/01/${currentYear}`).format('MMM YY');
    const endDate = moment(`03/31/${this.getNextYear()}`).format('MMM YY');
    return `${startDate} - ${endDate}`;
  };

  public getCurrentMonthStartDate = (format?: string): string => {
    return moment()
      .startOf('months')
      .format(format || 'YYYY-MM-DD');
  };

  public getCurrentMonthLastDate = (format?: string): string => {
    return moment()
      .endOf('months')
      .format(format || 'YYYY-MM-DD');
  };

  public getPreviousMonthStartDate = (format?: string): string => {
    return moment()
      .subtract(1, 'months')
      .startOf('month')
      .format(format || 'YYYY-MM-DD');
  };

  public getPreviousMonthLastDate = (format?: string): string => {
    return moment()
      .subtract(1, 'months')
      .endOf('month')
      .format(format || 'YYYY-MM-DD');
  };

  public getCurrentYearStartDate = (): string => {
    return moment().startOf('year').format('YYYY-MM-DD');
  };

  public getCurrentYearLastDate = (): string => {
    return moment().endOf('year').format('YYYY-MM-DD');
  };

  public getCurrentWeekStartDate = (format?: string, unit?: unitOfTime.StartOf): string => {
    return moment()
      .startOf(unit || 'week')
      .format(format || 'YYYY-MM-DD');
  };

  public getCurrentWeekLastDate = (format?: string, unit?: unitOfTime.StartOf): string => {
    return moment()
      .endOf(unit || 'week')
      .format(format || 'YYYY-MM-DD');
  };

  public getLastWeekStartDate = (format?: string, unit?: unitOfTime.StartOf): string => {
    return moment()
      .subtract(1, 'week')
      .startOf(unit || 'week')
      .format(format || 'YYYY-MM-DD');
  };

  public getLastWeekLastDate = (format?: string, unit?: unitOfTime.StartOf): string => {
    return moment()
      .subtract(1, 'week')
      .endOf(unit || 'week')
      .format(format || 'YYYY-MM-DD');
  };

  public getCurrentDate = (): string => {
    return moment(new Date()).format('YYYY-MM-DD');
  };

  public getCurrentTime = (): string => {
    const current = moment().format('YYYY-MM-DD HH').split(' ');
    return current[1];
  };

  public getPreviousYearStartDate = (count?: number): string => {
    return moment()
      .subtract(count || 1, 'years')
      .startOf('year')
      .format('YYYY-MM-DD');
  };

  public getPreviousYearLastDate = (count?: number): string => {
    return moment()
      .subtract(count || 1, 'years')
      .endOf('year')
      .format('YYYY-MM-DD');
  };

  public getFutureYearLastDate = (count: number): string => {
    return moment().add(count, 'years').endOf('year').format('YYYY-MM-DD');
  };

  public getCurrentMonthIndex = (): number => {
    return moment.utc(new Date()).month();
  };

  public getMonthIndex = (date: string): number => {
    return moment(date).month();
  };

  public timeDifference = (givenTime: string): string => {
    const day = moment(givenTime).date();
    const month = moment(givenTime).month();
    const year = moment(givenTime).year();
    return moment([year, month, day]).fromNow();
  };

  public getFutureDate = (dateCount: number): string => {
    return moment().add(dateCount, 'days').calendar();
  };

  public getYear = (yearCount: number): string => {
    return moment.utc(new Date()).subtract(yearCount, 'years').format('YYYY');
  };

  public getDate = (dateCount: number): string => {
    return moment.utc(new Date()).subtract(dateCount, 'days').format('YYYY-MM-DD');
  };

  public getNextDate = (dateCount: number, date?: string, dateFormat?: string, format?: string): string => {
    return moment
      .utc(date || new Date(), dateFormat)
      .add(dateCount, 'days')
      .format(format || 'YYYY-MM-DD');
  };

  public getPreviousDate = (dateCount: number, date?: string, dateFormat?: string, format?: string): string => {
    return moment
      .utc(date || new Date(), dateFormat)
      .subtract(dateCount, 'days')
      .format(format || 'YYYY-MM-DD');
  };

  public convertTimeFormat = (date: string, format: string): string[] => {
    return moment.utc(date).format(format).split(' ');
  };

  public getISOFormat = (date: string, time: number): string => {
    const dateFormat = moment.utc(`${date} ${time}:00`).format('YYYY-MM-DD HH:mm');
    return moment.utc(dateFormat).toISOString();
  };

  public getCurrentDateISO = (): string => {
    return moment(new Date()).format(DateFormats.ISO);
  };

  public getUtcFormattedDate = (date: string, format: string): string => {
    const formattedDate = this.getDisplayDate(date, 'YYYY-MM-DD');
    return moment.utc(formattedDate).format(format);
  };

  public getDateString = (date: string): string => {
    if (date === moment().format('YYYY-MM-DD')) {
      return I18nService.t('today');
    }
    if (date === moment().add(1, 'days').format('YYYY-MM-DD')) {
      return I18nService.t('tomorrow');
    }
    return date;
  };

  public isPastTime = (time: number, date: string): boolean => {
    const current = moment().format('YYYY-MM-DD HH').split(' ');
    if (moment(date).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD')) {
      return Number(current[1]) >= time;
    }
    return false;
  };

  public getYearList = (startYear: number, endYear: number): { value: number; label: string }[] => {
    const years = [];
    const dateStart = moment().subtract(startYear, 'y');
    const dateEnd = moment().add(endYear, 'y');
    while (dateEnd.diff(dateStart, 'years') >= 0) {
      years.push(dateStart.format('YYYY'));
      dateStart.add(1, 'year');
    }
    return years.map((year) => ({
      label: year,
      value: parseInt(year, 10),
    }));
  };

  public getUtcFormatted = (date: string, format1: string, format2?: string): string => {
    return moment.utc(date, format1).format(format2 || 'YYYY-MM-DD');
  };

  public getISOFormattedDate = (date: string, time: number): string => {
    if (time < 10) {
      return `${date}T0${time}:00:00:000Z`;
    }
    return `${date}T${time}:00:00:000Z`;
  };

  public getDaysInMonth = (month: number): number => {
    return new Date(parseInt(this.getCurrentYear(), 10), month, 0).getDate();
  };

  public getMonthRange = (startIndex: number, endIndex: number): string[] => {
    if (startIndex === 0 && endIndex === 11) return MonthNames;
    return [...MonthNames.slice(startIndex), ...MonthNames.slice(0, endIndex + 1)];
  };

  public getMomentObj = (date: string): Moment => {
    return moment(date);
  };

  public getDateDiff = (date1: string, date2: string, unit?: unitOfTime.Diff): number => {
    return moment(date1).diff(date2, unit);
  };

  public getCurrentDate24Format = (): string => {
    return moment().format(DateFormats.ISO24Format);
  };

  public getDayMonth = (date: string): string => {
    return moment(date).format(DateFormats.DDMM);
  };

  public getISOWeekNumber = (date: Date): number => moment(date).isoWeek();

  public getDateDifferenceMessage = (lastDate: string): string => {
    const currentDate = new Date();
    const lastMessageDate = new Date(lastDate);

    const millisecondDifference = Math.abs(currentDate.getTime() - lastMessageDate.getTime());
    const hoursDifference = millisecondDifference / 36e5;
    const dayDifference = Math.trunc(millisecondDifference / (1000 * 60 * 60 * 24));

    const isFewMomentAgo = hoursDifference < 1;
    const isMoreThanAHour = hoursDifference > 1 && dayDifference < 1;
    const isLessThanAWeek = dayDifference >= 1 && dayDifference <= 7;

    if (isFewMomentAgo) {
      return I18nService.t('assetMore:fewMomentAgo');
    }
    if (isMoreThanAHour) {
      return I18nService.t('assetMore:hrAgo', { hour: Math.trunc(hoursDifference) });
    }
    if (isLessThanAWeek) {
      return I18nService.t('assetMore:daysAgo', { day: dayDifference });
    }

    return moment(lastMessageDate.toString()).format(DateFormats.DDMM);
  };

  public convertDate = (date: string, format: string): string => {
    return moment(date, DateFormats.ISO8601).format(format);
  };

  public getTimeElapsedInDays = (date: string, unit?: unitOfTime.Diff): number => {
    const currentDate = new Date().toISOString();
    return this.getDateDiff(currentDate, date, unit ?? 'days');
  };

  public getCountInUnit = (date: string, unit?: unitOfTime.Diff): number => {
    const currentDate = new Date().toISOString();
    const date1 = new Date(date).toISOString();
    return this.getDateDiff(date1, currentDate, unit || 'days');
  };

  public getHours = (date: string): number => {
    const currentDate = new Date().getTime();
    const date1 = new Date(date).getTime();
    return Math.round((date1 - currentDate) / 36e5);
  };

  public convertDateFormatted = (date: string, format = DateFormats.DDMMMYYYY_Hm): string => {
    return moment(date).format(format);
  };

  public isPastDate = (date: string): boolean => {
    return moment(date).isBefore(moment(), 'day');
  };

  public getFutureDateByUnit = (
    date: string,
    dateCount: number,
    unit: unitOfTime.DurationConstructor,
    format?: string
  ): string => {
    return moment(date)
      .add(dateCount, unit)
      .format(format || 'YYYY-MM-DD');
  };

  public getDateDifference = (date: string, unit?: unitOfTime.Diff): number => {
    return moment().diff(moment(date), unit || 'hours');
  };

  public ascendingDateSort = (arr: Array<any>, keyToCheck: string): Array<any> =>
    [...arr].sort((a, b) => moment(a[keyToCheck]).valueOf() - moment(b[keyToCheck]).valueOf());

  public descendingDateSort = (arr: Array<any>, keyToCheck: string): Array<any> =>
    [...arr].sort((a, b) => moment(b[keyToCheck]).valueOf() - moment(a).valueOf());

  public isSameOrAfter = (date1: string, date2 = moment()): boolean => moment(date1).isSameOrAfter(date2);

  public isAfter = (date1: string, date2 = moment()): boolean => moment(date1).isAfter(date2);

  public isBefore = (date1: string, date2 = moment()): boolean => moment(date1).isBefore(date2);

  public getNextMonth = (format?: string): string => {
    return moment()
      .add(1, 'month')
      .format(format || 'MMMM');
  };

  public getPreviousMonth = (format?: string): string => {
    return moment()
      .subtract(1, 'month')
      .format(format || 'MMMM');
  };

  public getMonth = (format?: string): string => {
    return moment().format(format || 'MMMM');
  };

  public convertToISO = (date: string): string => {
    return `${date}T00:00:00Z`;
  };

  public isDatePassed = (date: string): boolean => {
    return moment(date).isBefore();
  };
}

const dateUtils = new DateUtils();
export { dateUtils as DateUtils };
