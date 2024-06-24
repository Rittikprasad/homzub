import { ObjectUtils } from '@homzhub/common/src/utils/ObjectUtils';

interface ITestObject {
  name: string;
  age: number;
}

describe('Object Utils', () => {
  let arrayOfObjects: ITestObject[] = [];
  let sortedArrayOfObjects: ITestObject[] = [];

  beforeAll(() => {
    arrayOfObjects = [
      { name: 'test1', age: 1 },
      { name: 'test4', age: 4 },
      { name: 'test0', age: 0 },
      { name: 'test3', age: 3 },
      { name: 'test2', age: 2 },
    ];

    sortedArrayOfObjects = [
      { name: 'test0', age: 0 },
      { name: 'test1', age: 1 },
      { name: 'test2', age: 2 },
      { name: 'test3', age: 3 },
      { name: 'test4', age: 4 },
    ];
  });

  it('should return true if the types match', () => {
    const array = [1, 2, 3];
    expect(ObjectUtils.isOfType('array', array)).toBeTruthy();
  });

  it('should return false if the types do not match', () => {
    const array = { a: 1 };
    expect(ObjectUtils.isOfType('array', array)).toBeFalsy();
  });

  it('should return sorted array of objects', () => {
    const result = ObjectUtils.sort(arrayOfObjects, 'age');
    expect(result).toStrictEqual(sortedArrayOfObjects);
  });

  it('should return same array if key based values are equal', () => {
    const equalArray: ITestObject[] = [
      { name: 'a', age: 1 },
      { name: 'b', age: 1 },
    ];
    const result = ObjectUtils.sort(equalArray, 'age');
    expect(result).toStrictEqual(equalArray);
  });
});
