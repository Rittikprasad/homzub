import React from 'react';
import { View, StyleSheet } from 'react-native';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Label, Text } from '@homzhub/common/src/components/atoms/Text';
import { Currency } from '@homzhub/common/src/domain/models/Currency';
import { Transaction } from '@homzhub/common/src/domain/models/LeaseTransaction';

interface IProps {
  rentData: Transaction;
  depositData: Transaction;
  currency: Currency;
}

export const RentAndMaintenance = ({ rentData, depositData, currency }: IProps): React.ReactElement => {
  const { label, amount } = rentData;
  return (
    <View style={styles.container}>
      <View>
        <View style={styles.contentView}>
          <Icon name={icons.home} color={theme.colors.darkTint3} size={20} style={styles.iconStyle} />
          <Label type="large">{label}</Label>
        </View>
        <Text type="small" textType="semiBold" style={styles.amount}>
          {`${currency?.currencySymbol} ${amount}`}
        </Text>
      </View>
      <View>
        <View style={styles.contentView}>
          <Icon name={icons.settingOutline} color={theme.colors.darkTint3} size={20} style={styles.iconStyle} />
          <Label type="large">{depositData.label}</Label>
        </View>
        <Text type="small" textType="semiBold" style={styles.amount}>
          {`${currency?.currencySymbol} ${depositData.amount}`}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: PlatformUtils.isWeb() ? 270 : undefined,
  },
  contentView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconStyle: {
    marginRight: 8,
  },
  amount: {
    marginTop: 2,
    marginLeft: 24,
  },
});
