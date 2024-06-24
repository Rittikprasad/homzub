import React, { ReactElement, ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { Image } from '@homzhub/common/src/components/atoms/Image';
import { PricePerUnit } from '@homzhub/common/src/components/atoms/PricePerUnit';
import { Label, Text } from '@homzhub/common/src/components/atoms/Text';

interface IPropertyDuesData {
  propertyName: string;
  address: string;
  dueCategory: string;
  price: number;
  currency_symbol: string;
}

interface IProps {
  propertyDues: IPropertyDuesData[];
  totalDue: number;
  currency: string;
}

export const PropertyDuesCardContainer = ({ ...props }: IProps): ReactElement => {
  const { totalDue, currency, propertyDues } = props;
  const { t } = useTranslation();

  return (
    <View style={styles.containerStyle}>
      <View style={styles.heading}>
        <View style={styles.duesText}>
          <Icon style={styles.walletIconStyle} name={icons.wallet} size={22} />
          <Text type="small" textType="semiBold">
            {t('assetDashboard:dues')}
          </Text>
        </View>
        <PricePerUnit
          textSizeType="small"
          textStyle={styles.dueStyle}
          priceTransformation={false}
          currency={currency}
          price={totalDue}
        />
      </View>
      <Divider />
      <View style={styles.propertyDuesContainer}>{renderPropertyDues(propertyDues, t)}</View>
    </View>
  );
};

const renderPropertyDues = (propertyDues: IPropertyDuesData[], t: TFunction): ReactNode => {
  return propertyDues.map((property, index) => {
    const { propertyName, address, dueCategory, price, currency_symbol } = property;

    return (
      <View key={`${property.propertyName}${index}`}>
        <View style={styles.propertyName}>
          <Image style={styles.flag} source={{ uri: '' }} />
          <Text type="small" textType="semiBold">
            {propertyName}
          </Text>
        </View>
        <Label type="large">{address}</Label>
        <View style={styles.dueContainer}>
          <View>
            <Label type="large">{dueCategory}</Label>
            <PricePerUnit textSizeType="small" priceTransformation={false} currency={currency_symbol} price={price} />
          </View>
          <Button
            textType="text"
            textSize="small"
            titleStyle={styles.payNowTitleStyles}
            containerStyle={styles.payNowBtnStyles}
            type="primary"
            title={t('assetFinancial:payNow')}
          />
        </View>
        {index !== propertyDues.length - 1 ? <Divider containerStyles={styles.dividerStyles} /> : null}
      </View>
    );
  });
};

const styles = StyleSheet.create({
  containerStyle: {
    marginTop: 16,
    backgroundColor: theme.colors.white,
    borderRadius: 4,
  },
  duesText: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dueStyle: {
    color: theme.colors.danger,
  },
  propertyDuesContainer: {
    padding: 16,
  },
  dividerStyles: {
    marginVertical: 24,
  },
  heading: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  flag: {
    marginRight: 6,
  },
  propertyName: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dueContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  payNowBtnStyles: {
    flex: 0,
  },
  payNowTitleStyles: {
    marginVertical: 6,
    marginHorizontal: 24,
  },
  walletIconStyle: {
    marginRight: 10,
  },
});
