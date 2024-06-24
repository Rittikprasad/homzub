import urlRegex from 'url-regex';
import { FormUtils } from '@homzhub/common/src/utils/FormUtils';

export class StringUtils {
  public static isValidUrl = (url: string): boolean => {
    return urlRegex({ exact: true, strict: true }).test(url);
  };

  public static toTitleCase = (str: string): string => {
    return str.replace(/\w\S*/g, (txt) => {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };

  public static getInitials = (fullName: string): string => {
    const initials = fullName.match(/\b\w/g) || [];
    return ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();
  };

  public static isValidEmail = (email: string): boolean => {
    const regex = RegExp(FormUtils.emailRegex, 'g');
    return regex.test(email);
  };

  public static splitter = (value: string, delimiter: string, toTitleCase = true): string => {
    const result = value
      .split(delimiter)
      .map((item: string) => (toTitleCase ? StringUtils.toTitleCase(item) : item))
      .join(' ');
    return result;
  };

  public static wordCount = (value: string): number => {
    return value.split(' ').length;
  };

  public static truncateByChars = (value: string, count: number): string => {
    if (count >= value.length) return value;
    return `${value.slice(0, count + 1)}...`;
  };

  public static truncateByWords = (value: string, count: number): string => {
    if (count >= this.wordCount(value)) return value;
    return `${value
      .split(' ')
      .slice(0, count + 1)
      .join(' ')}...`;
  };

  public static isValidIfsc = (ifsc: string): boolean => {
    const regex = RegExp(FormUtils.isfcRegex, 'g');
    return regex.test(ifsc);
  };

  public static isValidPan = (pan: string): boolean => {
    const regex = RegExp(FormUtils.panRegex, 'g');
    return regex.test(pan);
  };
}
