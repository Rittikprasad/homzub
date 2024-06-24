// Add all languages you wish to support here
export enum SupportedLanguages {
  English = 'en-US',
  Marathi = 'mr-IN',
  Hindi = 'hi-IN',
  Telugu = 'te-IN',
  Tamil = 'ta-IN',
  Malayalam = 'ml-IN',
  Kannada = 'kn-IN',
  Gujarati = 'gu-IN',
  Chinese = 'zh-CN',
  Korean = 'ko',
  Japanese = 'ja',
  Thai = 'th',
}
const whitelist = Object.values(SupportedLanguages);

/**
 * Add translation files here, one per language
 * key must be from among the above enum `supportedLanguages`
 */
const resources = {
  [SupportedLanguages.English]: require('@homzhub/common/src/assets/languages/en.json'),
  [SupportedLanguages.Marathi]: require('@homzhub/common/src/assets/languages/mr.json'),
  [SupportedLanguages.Tamil]: require('@homzhub/common/src/assets/languages/ta.json'),
  [SupportedLanguages.Telugu]: require('@homzhub/common/src/assets/languages/te.json'),
  [SupportedLanguages.Gujarati]: require('@homzhub/common/src/assets/languages/gu.json'),
  [SupportedLanguages.Hindi]: require('@homzhub/common/src/assets/languages/hi.json'),
  [SupportedLanguages.Malayalam]: require('@homzhub/common/src/assets/languages/ml.json'),
  [SupportedLanguages.Kannada]: require('@homzhub/common/src/assets/languages/kn.json'),
  [SupportedLanguages.Korean]: require('@homzhub/common/src/assets/languages/ko.json'),
  [SupportedLanguages.Japanese]: require('@homzhub/common/src/assets/languages/ja.json'),
  [SupportedLanguages.Chinese]: require('@homzhub/common/src/assets/languages/zh.json'),
  [SupportedLanguages.Thai]: require('@homzhub/common/src/assets/languages/th.json'),
};

// Add namespaces here
enum namespacesKey {
  common = 'common',
  auth = 'auth',
  property = 'property',
  propertySearch = 'propertySearch',
  assetDescription = 'assetDescription',
  assetDashboard = 'assetDashboard',
  assetPortfolio = 'assetPortfolio',
  assetFinancial = 'assetFinancial',
  assetMore = 'assetMore',
  moreSettings = 'moreSettings',
  landing = 'landing',
  moreProfile = 'moreProfile',
  serviceTickets = 'serviceTickets',
  helpAndSupport = 'helpAndSupport',
  microSite = 'microSite',
  offers = 'offers',
  propertyPayment = 'propertyPayment',
  reports = 'reports',
}
const namespaces = Object.values(namespacesKey);
const defaultNamespace = namespacesKey.common;
const fallback = SupportedLanguages.English;

export const LocaleConstants = {
  whitelist,
  defaultNamespace,
  namespaces,
  fallback,
  resources,
  namespacesKey,
};
