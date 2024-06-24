import { CurrencyUtils } from '@homzhub/common/src/utils/CurrencyUtils';

describe('CurrencyUtils', () => {
  it('should return for INR currency less than 1 lakh', () => {
    const value = CurrencyUtils.getCurrency('INR', 9999);
    expect(value).toStrictEqual('9,999');
  });

  it('should return for INR currency more than 1 lakh and less than 1 crore', () => {
    const value = CurrencyUtils.getCurrency('INR', 2000000);
    expect(value).toStrictEqual('20.00L');
  });

  it('should return for INR currency more than 1 Crore and less than 10 crore', () => {
    const value = CurrencyUtils.getCurrency('INR', 20000000);
    expect(value).toStrictEqual('2Cr');
  });

  it('should return for INR currency more 10 Crore and less than 100 Crore', () => {
    const value = CurrencyUtils.getCurrency('INR', 200000000);
    expect(value).toStrictEqual('20Cr');
  });

  it('should return for INR currency more than 100', () => {
    const value = CurrencyUtils.getCurrency('INR', 2000000000);
    expect(value).toStrictEqual('1B+');
  });

  it('should return for other currency', () => {
    ['USD', 'SGD', 'AUD'].forEach((currency) => {
      const value = CurrencyUtils.getCurrency(currency, 9999);
      expect(value).toStrictEqual('9,999');
    });
  });

  it('should return for other currency less than 1000000', () => {
    ['USD', 'SGD', 'AUD'].forEach((currency) => {
      const value = CurrencyUtils.getCurrency(currency, 70000);
      expect(value).toStrictEqual('70K');
    });
  });

  it('should return for other currency less than 10000000', () => {
    ['USD', 'SGD', 'AUD'].forEach((currency) => {
      const value = CurrencyUtils.getCurrency(currency, 7000000);
      expect(value).toStrictEqual('7.00Mn');
    });
  });

  it('should return for other currency less than 1000000000', () => {
    ['USD', 'SGD', 'AUD'].forEach((currency) => {
      const value = CurrencyUtils.getCurrency(currency, 70000000);
      expect(value).toStrictEqual('70Mn');
    });
  });

  it('should return for other currency less than 1000000000000', () => {
    ['USD', 'SGD', 'AUD'].forEach((currency) => {
      const value = CurrencyUtils.getCurrency(currency, 700000000);
      expect(value).toStrictEqual('700Mn');
    });
  });

  it('should return for other currency less than 10000000000000', () => {
    ['USD', 'SGD', 'AUD'].forEach((currency) => {
      const value = CurrencyUtils.getCurrency(currency, 7000000000);
      expect(value).toStrictEqual('7B');
    });
  });

  it('should return for other currency less than 100000000000000', () => {
    ['USD', 'SGD', 'AUD'].forEach((currency) => {
      const value = CurrencyUtils.getCurrency(currency, 70000000000);
      expect(value).toStrictEqual('70B');
    });
  });

  it('should return for other currency less than 1000000000000000', () => {
    ['USD', 'SGD', 'AUD'].forEach((currency) => {
      const value = CurrencyUtils.getCurrency(currency, 700000000000);
      expect(value).toStrictEqual('700B');
    });
  });

  it('should return for other currency less than 10000000000000000', () => {
    ['USD', 'SGD', 'AUD'].forEach((currency) => {
      const value = CurrencyUtils.getCurrency(currency, 7000000000000);
      expect(value).toStrictEqual('1T+');
    });
  });
});
