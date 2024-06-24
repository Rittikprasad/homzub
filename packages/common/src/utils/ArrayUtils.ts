class ArrayUtils {
  /**
   * Method to check if two JSON arrays have common entries.
   * @param array1 First array
   * @param array2 Second array
   * @param param Param to be checked for in arrays for equality
   */
  public haveDuplicateObjects = (array1: Array<any>, array2: Array<any>, param: string): boolean => {
    const duplicates = array2.filter((e1) => array1.some((e2) => e1[param] === e2[param]));
    return duplicates.length > 0;
  };
}

const arrayUtils = new ArrayUtils();
export { arrayUtils as ArrayUtils };
