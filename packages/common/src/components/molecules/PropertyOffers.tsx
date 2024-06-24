import React from 'react';
import { StyleSheet, View, StyleProp, ViewStyle, FlatList, TouchableOpacity } from 'react-native';
import { WithTranslation, withTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import { DateFormats, DateUtils } from '@homzhub/common/src/utils/DateUtils';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import TextWithIcon from '@homzhub/common/src/components/atoms/TextWithIcon';
import PropertyCard from '@homzhub/common/src/components/molecules/PropertyCard';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { LeaseTerm } from '@homzhub/common/src/domain/models/LeaseTerm';
import { SaleTerm } from '@homzhub/common/src/domain/models/SaleTerm';
import { TenantPreference } from '@homzhub/common/src/domain/models/TenantInfo';

interface IScreenProps {
  isCardExpanded: boolean;
  propertyOffer: Asset;
  onViewOffer?: () => void;
  isDetailView?: boolean;
  containerStyles?: StyleProp<ViewStyle>;
}

interface IScreenState {
  isExpanded: boolean;
}

interface IExpectation {
  title: string;
  value: string | number | TenantPreference[] | null;
}

type Props = WithTranslation & IScreenProps;

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

class PropertyOffers extends React.PureComponent<Props, IScreenState> {
  constructor(props: Props) {
    super(props);
    const { isCardExpanded } = this.props;
    this.state = {
      isExpanded: isCardExpanded || false,
    };
  }

  public render(): React.ReactElement {
    const {
      propertyOffer: { offerCount },
      containerStyles,
      t,
      onViewOffer,
      isDetailView = false,
      propertyOffer,
    } = this.props;
    const { isExpanded } = this.state;

    const offerCountHeading = `${offerCount} ${t('common:offers')}`;

    return (
      <TouchableOpacity
        style={[styles.container, containerStyles]}
        activeOpacity={!isDetailView ? 0.7 : 1}
        onPress={onViewOffer}
      >
        {!isDetailView && (
          <View style={[styles.justifyContent, styles.countWithIcon]}>
            {!!offerCount && (
              <View style={styles.offerCount}>
                <Icon name={icons.offers} color={theme.colors.blue} />
                <Label textType="semiBold" type="large" style={styles.offerText}>
                  {offerCountHeading}
                </Label>
              </View>
            )}
            <>
              {isExpanded ? (
                <Icon
                  name={icons.upArrow}
                  size={15}
                  color={theme.colors.blue}
                  onPress={(): void => this.setState({ isExpanded: false })}
                />
              ) : (
                <Icon
                  name={icons.downArrow}
                  size={15}
                  color={theme.colors.blue}
                  onPress={(): void => this.setState({ isExpanded: true })}
                />
              )}
            </>
          </View>
        )}
        <>
          <PropertyCard isExpanded={isExpanded} asset={propertyOffer} />
          {this.renderExpectation()}
        </>
      </TouchableOpacity>
    );
  }

  private renderExpectation = (): React.ReactNode => {
    const { isExpanded } = this.state;
    if (!isExpanded) {
      return null;
    }

    const {
      propertyOffer: { isLeaseListing, leaseTerm, saleTerm, currencySymbol, projectName },
      t,
    } = this.props;

    const expectationData = isLeaseListing
      ? leaseListingExpectationData(leaseTerm, currencySymbol, t)
      : saleListingExpectationData(saleTerm, currencySymbol, t);

    const filteredData = expectationData?.filter((item) => item.value);

    return (
      <>
        <Divider containerStyles={styles.divider} />
        <Label textType="semiBold" type="large" style={[styles.expectationHeading, styles.tintColor]}>
          {`${t('offers:yourExpectationFor')} ${projectName}`}
        </Label>
        {filteredData && (
          <FlatList
            data={filteredData}
            renderItem={this.renderExpectedItem}
            keyExtractor={this.renderKeyExtractor}
            numColumns={2}
            ItemSeparatorComponent={this.renderItemSeparator}
          />
        )}
      </>
    );
  };

  private renderExpectedItem = ({ item, index }: { item: IExpectation; index: number }): React.ReactElement | null => {
    const { title, value } = item;
    const { t } = this.props;

    if (!value) {
      return null;
    }

    if (title === t('moreSettings:preferencesText')) {
      const preferences = value as TenantPreference[];

      if (!preferences.length) return null;
      return (
        <View>
          <Label textType="regular" type="small" style={styles.tintColor}>
            {title}
          </Label>
          <View style={styles.preferenceView}>
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
                    containerStyle={styles.preferenceContent}
                  />
                );
              })}
          </View>
        </View>
      );
    }
    return (
      <View key={index} style={styles.expectedItem}>
        <Label textType="regular" type="small" style={styles.tintColor}>
          {title}
        </Label>
        <Label textType="semiBold" type="large" style={styles.tintColor}>
          {value}
        </Label>
      </View>
    );
  };

  private renderKeyExtractor = (item: IExpectation, index: number): string => `${item.title}-${index}`;

  private renderItemSeparator = (): React.ReactElement => <View style={styles.separator} />;
}

export default withTranslation()(PropertyOffers);

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: theme.colors.white,
    borderRadius: 4,
  },
  justifyContent: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
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
  expectationHeading: {
    marginBottom: 20,
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
  separator: {
    width: 60,
    height: 24,
  },
  viewOfferButton: {
    marginTop: 24,
  },
  expectedItem: {
    flex: 2,
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
    marginLeft: 4,
  },
});
