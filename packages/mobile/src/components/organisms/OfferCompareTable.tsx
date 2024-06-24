import React, { useEffect, useState } from 'react';
import { ScrollView, View, StyleSheet, TouchableOpacity, ViewStyle, StyleProp, TextStyle } from 'react-native';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { OfferSelectors } from '@homzhub/common/src/modules/offers/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import { EmptyState } from '@homzhub/common/src/components/atoms/EmptyState';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import { Avatar } from '@homzhub/common/src/components/molecules/Avatar';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { LeaseTerm } from '@homzhub/common/src/domain/models/LeaseTerm';
import { SaleTerm } from '@homzhub/common/src/domain/models/SaleTerm';
import { Offer } from '@homzhub/common/src/domain/models/Offer';

enum HeaderKeys {
  NAME = 'Name',
  VALID_FOR = 'Valid For',
  RENT = 'Rent',
  SECURITY_DEPOSIT = 'Security Deposit',
  INCREMENT = 'Increment',
  MIN_MONTH = 'Min Month',
  MAX_MONTH = 'Max Month',
  MOVE_IN_DATE = 'Move in Date',
  SELLING_PRICE = 'Selling Price',
  BOOKING_PRICE = 'Booking Price',
}

interface ICompareData {
  uniqueKey: number;
  profilePic: string;
  validCount: number;
  dataPoints: IDataPoints;
}

interface IDataPoints {
  name?: string;
  validFor: string;
  rent?: number;
  securityDeposit?: number;
  increment?: string;
  minMonth?: number;
  maxMonth?: number;
  moveInDate?: string;
  sellingPrice?: number;
  bookingPrice?: number;
}

const headerLease = [
  HeaderKeys.NAME,
  HeaderKeys.VALID_FOR,
  HeaderKeys.RENT,
  HeaderKeys.SECURITY_DEPOSIT,
  HeaderKeys.INCREMENT,
  HeaderKeys.MIN_MONTH,
  HeaderKeys.MAX_MONTH,
  HeaderKeys.MOVE_IN_DATE,
];
const headerSale = [HeaderKeys.NAME, HeaderKeys.VALID_FOR, HeaderKeys.SELLING_PRICE, HeaderKeys.BOOKING_PRICE];

interface IProps {
  selectedOfferIds: number[];
  onPressOffer: (id: number) => void;
}

const OfferCompareTable = ({ selectedOfferIds, onPressOffer }: IProps): React.ReactElement => {
  const negotiations = useSelector(OfferSelectors.getNegotiations);
  const listingDetail = useSelector(OfferSelectors.getListingDetail);
  const [compareData, setCompareData] = useState<ICompareData[]>([]);
  const [expectation, setExpectation] = useState<IDataPoints | null>(null);
  const [header, setHeader] = useState<string[]>([]);
  const { t } = useTranslation();

  useEffect(() => {
    const offer: Offer[] = [];
    negotiations.forEach((item) => {
      selectedOfferIds.forEach((id) => {
        if (id === item.id) {
          offer.push(item);
        }
      });
    });
    const formattedOffer = getFormattedOffer(offer, listingDetail);
    const formattedExpectation = getFormattedExpectation(listingDetail);
    setCompareData(formattedOffer);
    setExpectation(formattedExpectation);
  }, []);

  const getFormattedOffer = (offer: Offer[], listingData: Asset | null): ICompareData[] => {
    if (!listingData) return [];

    return offer.map((item) => {
      const {
        id,
        user,
        validDays,
        validCount,
        annualRentIncrementPercentage: increment,
        rent,
        securityDeposit,
        minLockInPeriod,
        leasePeriod,
        price,
        bookingAmount,
        moveInDate,
      } = item;
      if (listingData.leaseTerm) {
        return {
          uniqueKey: id,
          profilePic: user.profilePicture,
          validCount,
          dataPoints: {
            name: user.name,
            validFor: validDays,
            rent: rent > 0 ? rent : 0,
            securityDeposit: securityDeposit > 0 ? securityDeposit : 0,
            increment: increment ? increment.toString() : '-',
            minMonth: minLockInPeriod > 0 ? minLockInPeriod : 0,
            maxMonth: leasePeriod > 0 ? leasePeriod : 0,
            moveInDate: moveInDate || '-',
          },
        };
      }
      return {
        uniqueKey: id,
        profilePic: user.profilePicture,
        validCount,
        dataPoints: {
          name: user.name,
          validFor: validDays,
          sellingPrice: price > 0 ? price : 0,
          bookingPrice: bookingAmount > 0 ? bookingAmount : 0,
        },
      };
    });
  };

  const getFormattedExpectation = (listingData: Asset | null): IDataPoints | null => {
    if (!listingData) return null;
    const listing = listingData.leaseTerm ? listingData.leaseTerm : listingData.saleTerm;
    if (!listing) return null;

    if (listingData.leaseTerm) {
      const {
        expectedPrice,
        securityDeposit,
        annualRentIncrementPercentage: increment,
        maximumLeasePeriod,
        minimumLeasePeriod,
        availableFromDate,
      } = listing as LeaseTerm;
      setHeader(headerLease);
      return {
        validFor: '',
        ...(expectedPrice > 0 && { rent: Number(expectedPrice) }),
        ...(securityDeposit > 0 && { securityDeposit }),
        increment: increment ? increment.toString() : '-',
        ...(minimumLeasePeriod > 0 && { minMonth: minimumLeasePeriod }),
        ...(maximumLeasePeriod > 0 && { maxMonth: maximumLeasePeriod }),
        ...(availableFromDate && { moveInDate: availableFromDate }),
      };
    }
    const { expectedPrice, expectedBookingAmount } = listing as SaleTerm;
    setHeader(headerSale);
    return {
      validFor: '',
      ...(expectedPrice && { sellingPrice: Number(expectedPrice) }),
      ...(expectedBookingAmount && { bookingPrice: Number(expectedBookingAmount) }),
    };
  };

  if (!expectation) {
    return <EmptyState />;
  }

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View>
          <View style={[styles.row, styles.topView]}>
            <Label type="large" style={{ width: theme.viewport.width / 2.5 }}>
              {t('offers:yourExpectation', { property: listingDetail?.projectName })}
            </Label>
            {Object.keys(expectation).map((key, index) => {
              const title = header.filter((item) => item !== HeaderKeys.NAME);
              return (
                <View style={styles.topContent} key={index}>
                  {index !== 0 && (
                    <>
                      <Label type="regular" style={styles.topText}>
                        {title[index]}
                      </Label>
                      <Label type="regular" textType="semiBold" style={styles.topText}>
                        {/* @ts-ignore */}
                        {expectation[key]}
                      </Label>
                    </>
                  )}
                </View>
              );
            })}
          </View>
          <View style={[styles.row, styles.headerContainer]}>
            {header.map((item, index) => {
              return (
                <View style={customStyles.contentBox(index === 0)} key={index}>
                  <Label type="large" style={styles.header}>
                    {item}
                  </Label>
                </View>
              );
            })}
          </View>
          {compareData.map((item: ICompareData, compareIndex) => {
            const offerData = item.dataPoints;
            const onPressRow = (): void => onPressOffer(item.uniqueKey);
            return (
              <TouchableOpacity style={[styles.row, styles.rowContent]} key={compareIndex} onPress={onPressRow}>
                {Object.keys(offerData).map((key, index) => {
                  const isNotValidKey = key === 'validFor' && item.validCount < 6;
                  return (
                    <View style={customStyles.contentBox(index === 0)} key={key}>
                      {key === 'name' && (
                        <Avatar
                          fullName={offerData[key]}
                          image={item.profilePic}
                          imageSize={42}
                          containerStyle={{ width: theme.viewport.width / 2.5 }}
                          nameStyle={{ width: theme.viewport.width / 3.5 }}
                        />
                      )}
                      {key !== 'name' && (
                        <Label type="large" style={customStyles.text(isNotValidKey)}>
                          {/* @ts-ignore */}
                          {offerData[key]}
                        </Label>
                      )}
                    </View>
                  );
                })}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

export default OfferCompareTable;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  row: {
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  header: {
    margin: 6,
    textAlign: 'center',
    color: theme.colors.darkTint5,
  },
  headerContainer: {
    paddingVertical: 12,
  },
  topView: {
    paddingVertical: 12,
    backgroundColor: theme.colors.blueTint11,
    alignItems: 'center',
  },
  topContent: {
    minWidth: theme.viewport.width / 3.5,
  },
  topText: {
    margin: 6,
    textAlign: 'center',
    color: theme.colors.darkTint3,
  },
  rowContent: {
    marginVertical: 6,
    paddingVertical: 10,
  },
});

const customStyles = {
  contentBox: (isFirstKey?: boolean): StyleProp<ViewStyle> => ({
    minWidth: isFirstKey ? theme.viewport.width / 2.5 : theme.viewport.width / 3.5,
    flexDirection: 'row',
    justifyContent: isFirstKey ? 'flex-start' : 'center',
  }),
  text: (isNotValidKey?: boolean): StyleProp<TextStyle> => ({
    textAlign: 'center',
    backgroundColor: isNotValidKey ? theme.colors.redOpacity : theme.colors.white,
    color: isNotValidKey ? theme.colors.red : theme.colors.darkTint3,
    height: 25,
    paddingHorizontal: 8,
  }),
};
