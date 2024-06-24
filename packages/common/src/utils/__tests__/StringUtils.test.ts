import { StringUtils } from '@homzhub/common/src/utils/StringUtils';

describe('String Utils', () => {
  it('should return true for a valid url', () => {
    const validUrl = 'https://google.com';
    expect(StringUtils.isValidUrl(validUrl)).toStrictEqual(true);
  });

  it('should return false for an invalid url', () => {
    const invalidUrl = 'htps://googlecom';
    expect(StringUtils.isValidUrl(invalidUrl)).toStrictEqual(false);
  });

  it('should return title cases string', () => {
    const testString = 'this is a test';
    expect(StringUtils.toTitleCase(testString)).toStrictEqual('This Is A Test');
  });
});
