import { DateUtils } from '@homzhub/common/src/utils/DateUtils';

describe('DateUtils', () => {
  it('should return Full month name', () => {
    const monthName = DateUtils.getFullMonthName(3, 'MMM');
    expect(monthName).toStrictEqual('Apr');
  });

  it('should return display date', () => {
    const value = DateUtils.getDisplayDate('2020-04-03', 'DD MMM YYYY');
    expect(value).toStrictEqual('03 Apr 2020');
  });

  it('should return date from ISO', () => {
    const value = DateUtils.getDateFromISO('2020-04-03T04:04:31.00216Z', 'DD MMM YYYY');
    expect(value).toStrictEqual('03 Apr 2020');
  });
});
