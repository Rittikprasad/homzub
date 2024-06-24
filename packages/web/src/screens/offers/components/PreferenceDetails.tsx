import React, { FC } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import { DateFormats, DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { useIsIpadPro, useOnly } from '@homzhub/common/src/utils/MediaQueryUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import { icons } from '@homzhub/common/src/assets/icon';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import TextWithIcon from '@homzhub/common/src/components/atoms/TextWithIcon';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { LeaseTerm } from '@homzhub/common/src/domain/models/LeaseTerm';
import { SaleTerm } from '@homzhub/common/src/domain/models/SaleTerm';
import { TenantPreference } from '@homzhub/common/src/domain/models/TenantInfo';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

interface IProps {
  isCardExpanded?: boolean;
  property: Asset;
  onViewOffer?: () => void;
  isDetailView?: boolean;
  containerStyles?: StyleProp<ViewStyle>;
  colunm?: number;
}

interface IExpectation {
  title: string;
  value: string | number | TenantPreference[] | null;
}

const leaseListingExpectationData = (
  listingData: LeaseTerm | null,
  currencySymbol: string,
  t: TFunction
): IExpectation[] | null => {
  if (!listingData) {
    return null;
  }

  const {
    expectedPrice,
    securityDeposit,
    annualRentIncrementPercentage,
    availableFromDate,
    minimumLeasePeriod,
    maximumLeasePeriod,
    tenantPreferences,
  } = listingData;

  return [
    {
      title: t('offers:rentalPrice'),
      value: `${currencySymbol} ${expectedPrice}`,
    },
    {
      title: t('offers:proposedSecurityDeposit'),
      value: `${currencySymbol} ${securityDeposit}`,
    },
    {
      title: t('property:annualIncrementSuffix'),
      value: annualRentIncrementPercentage ? `${annualRentIncrementPercentage}%` : 'NA',
    },
    {
      title: t('property:moveInDate'),
      value: DateUtils.getDisplayDate(availableFromDate, DateFormats.D_MMM_YYYY),
    },
    {
      title: t('property:minimumLeasePeriod'),
      value: `${minimumLeasePeriod} ${t('common:months')}`,
    },
    {
      title: t('property:maximumLeasePeriod'),
      value: `${maximumLeasePeriod} ${t('common:months')}`,
    },
    {
      title: t('moreSettings:preferencesText'),
      value: tenantPreferences,
    },
  ];
};

const saleListingExpectationData = (
  listingData: SaleTerm | null,
  currencySymbol: string,
  t: TFunction
): IExpectation[] | null => {
  if (!listingData) {
    return null;
  }

  const { expectedPrice, expectedBookingAmount } = listingData;

  return [
    {
      title: t('offers:sellPrice'),
      value: `${currencySymbol} ${expectedPrice}`,
    },
    {
      title: t('property:bookingAmount'),
      value: `${currencySymbol} ${expectedBookingAmount}`,
    },
  ];
};
const PreferenceDetails: FC<IProps> = (props: IProps) => {
  const {
    property: { isLeaseListing, leaseTerm, saleTerm, currencySymbol, projectName },
    containerStyles,
  } = props;
  const { t } = useTranslation();
  const isMobile = useOnly(deviceBreakpoint.MOBILE);
  const isTab = useOnly(deviceBreakpoint.TABLET);
  const isIPadPro = useIsIpadPro();
  const expectationData = isLeaseListing
    ? leaseListingExpectationData(leaseTerm, currencySymbol, t)
    : saleListingExpectationData(saleTerm, currencySymbol, t);
  const filteredData = expectationData?.filter((item) => item.value);
  if (filteredData === undefined) return null;
  const data = Object.values(filteredData);

  const renderExpectation = (): React.ReactNode =>
    data.map((item, index): React.ReactElement | null => {
      if (item.title === t('moreSettings:preferencesText')) {
        const preferences = item.value as TenantPreference[];
        if (!preferences.length) return null;
        return (
          <View>
            <Label textType="regular" type="small" style={[styles.tintColor, styles.topMargin]}>
              {item.title}
            </Label>
            <View style={[styles.preferenceView, isMobile && styles.preferenceViewMobile]}>
              {!!preferences.length &&
                preferences.map((preference, valueIndex) => {
                  return (
                    <TextWithIcon
                      key={valueIndex}
                      icon={icons.check}
                      text={preference.name}
                      variant="label"
                      textSize="large"
                      iconColor={theme.colors.green}
                      containerStyle={[
                        styles.preferenceContent,
                        isIPadPro && !isTab && styles.preferenceContentIPadPro,
                        isMobile && styles.preferenceContentMobile,
                      ]}
                    />
                  );
                })}
            </View>
          </View>
        );
      }
      return (
        <View
          key={index}
          style={[
            styles.expectedItem,
            (isTab || isIPadPro) && styles.expectedItemTab,
            isMobile && styles.expectedItemMob,
            (!isMobile ? (isTab ? index === 5 : index === 3) : (index + 1) % 2 === 0) && styles.separator,
          ]}
        >
          <Label textType="regular" type="small" style={styles.tintColor}>
            {item.title}
          </Label>
          <Label textType="semiBold" type="large" style={styles.tintColor}>
            {item.value}
          </Label>
        </View>
      );
    });

  return (
    <>
      <View
        style={[
          styles.container,
          isMobile && styles.containerMobile,
          isTab && styles.containerTab,
          containerStyles,
          isIPadPro && !isTab && styles.containerIPadPro,
        ]}
      >
        <Label textType="semiBold" type="large" style={styles.tintColor}>
          {`${t('offers:yourExpectationFor')} ${projectName}`}
        </Label>
        <View style={styles.expectedData}>{filteredData && renderExpectation()}</View>
      </View>
    </>
  );
};

export default PreferenceDetails;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 14,
    width: 540,
  },
  containerIPadPro: {
    width: 347,
  },

  containerMobile: {
    width: '100%',
    marginHorizontal: 0,
    top: 16,
  },
  containerTab: {
    width: '100%',
    paddingBottom: 16,
    marginHorizontal: 0,
  },
  button: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
    backgroundColor: theme.colors.reminderBackground,
  },
  innerContainer: {
    marginHorizontal: 20,
    marginVertical: 16,
    height: '210px',
  },
  topMargin: {
    marginTop: 20,
  },
  offerText: {
    color: theme.colors.blue,
    marginLeft: 6,
  },
  tintColor: {
    color: theme.colors.darkTint3,
  },
  preferenceContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  offerCount: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    marginVertical: 16,
    borderColor: theme.colors.darkTint10,
  },

  separator: {
    marginRight: 0,
  },
  viewOfferButton: {
    marginTop: 24,
  },
  expectedItem: {
    marginRight: 60,
    marginTop: 20,
  },
  expectedItemTab: {
    marginRight: 20,
  },
  expectedItemMob: {
    marginRight: '3.1%',
    width: 124,
  },
  countWithIcon: {
    marginBottom: 15,
  },
  preferenceView: {
    flexDirection: 'row',
    marginVertical: 4,
    flexWrap: 'wrap',
  },
  preferenceContent: {
    flexDirection: 'row-reverse',
    marginEnd: 14,
  },
  preferenceContentIPadPro: {
    marginEnd: 4,
  },
  preferenceContentMobile: {
    marginEnd: 10,
    paddingBottom: 6,
  },
  expectedData: { flexDirection: 'row', flexWrap: 'wrap' },
  preferenceViewMobile: {
    width: '288px',
  },
});
