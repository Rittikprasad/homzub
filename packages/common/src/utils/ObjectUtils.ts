/* eslint-disable @typescript-eslint/no-explicit-any */

export class ObjectUtils {
  public static isOfType = (type: string, val: any): boolean => {
    return val.constructor && val.constructor.name.toLowerCase() === type.toLowerCase();
  };

  public static isEmpty = (obj: object): boolean => {
    return Object.keys(obj).length === 0 && obj.constructor === Object;
  };

  // This function sorts an array of objects based on a `key` of the object
  public static sort = (arrayOfObjects: any[], key: any): any => {
    return arrayOfObjects.sort((a, b) => {
      let comparison = 0;
      if (a[key] > b[key]) {
        comparison = 1;
      } else if (a[key] < b[key]) {
        comparison = -1;
      }
      return comparison;
    });
  };

  public static groupBy = <T>(data: T[], key: string): { [key: string]: T[] } => {
    const groupedEntity: { [key: string]: T[] } = {};

    data.forEach((item: T) => {
      // @ts-ignore
      if (groupedEntity[item[key]]) {
        // @ts-ignore
        groupedEntity[item[key]].push(item);
        return;
      }
      // @ts-ignore
      groupedEntity[item[key]] = [item];
    });

    return groupedEntity;
  };
}
