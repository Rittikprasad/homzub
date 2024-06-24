class CurrencyUtils {
  public getCurrency = (currency: string, value: number): string => {
    switch (currency) {
      case 'INR':
        if (value < 100000) {
          return value.toString().replace(/(\d)(?=(\d\d\d)+$)/g, '$1,');
        }
        if (value >= 100000 && value < 10000000) {
          return `${(value / 100000).toFixed(2)}L`;
        }
        if (value >= 10000000 && value < 100000000) {
          return `${Math.round(value / 10000000)}Cr`;
        }
        if (value >= 100000000 && value < 1000000000) {
          return `${Math.round(value / 10000000)}Cr`;
        }
        return '1B+';
      default:
        if (value <= 10000) {
          return value.toLocaleString();
        }
        if (value <= 1000000) {
          return `${Math.round(value / 1000)}K`;
        }
        if (value <= 10000000) {
          return `${(value / 1000000).toFixed(2)}Mn`;
        }
        if (value <= 1000000000) {
          return `${Math.round(value / 1000000)}Mn`;
        }
        if (value <= 1000000000000) {
          return `${Math.round(value / 1000000000)}B`;
        }
        return '1T+';
    }
  };
}

const currencyUtils = new CurrencyUtils();
export { currencyUtils as CurrencyUtils };
