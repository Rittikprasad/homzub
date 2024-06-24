/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const compareUrlsWithPathname = (urls: any[], pathname: string) => {
  // TODO: check for all edge cases

  if (urls.includes(pathname)) {
    return true;
  }
  return urls.reduce((value, item) => {
    const urlSections = item.split('/');
    const pathnameSections = pathname.split('/');
    if (urlSections.length !== pathnameSections.length) {
      return value;
    }
    const updatedUrl = urlSections
      .map((section: string[], index: any | number) => {
        if (section[0] === ':') {
          return pathnameSections[index];
        }
        return section;
      })
      .join('/');
    return value || updatedUrl === pathname;
  }, false);
};
