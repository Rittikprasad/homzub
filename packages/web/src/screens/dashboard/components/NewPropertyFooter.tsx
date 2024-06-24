import React from 'react';
import { StyleSheet, View } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';
import { Label, Text } from '@homzhub/common/src/components/atoms/Text';

// TODO (LAKSHIT) - change dummy data with actual api data

const NewPropertyFooter = (): React.ReactElement => {
  return (
    <View style={styles.card}>
      <View style={styles.infoTime}>
        <Text type="small" textType="semiBold" style={styles.infoTimeText}>
          10:90
        </Text>
        <Label type="regular" style={styles.infoTimeSubText}>
          Subvention
        </Label>
      </View>
      <View style={styles.infoDiscount}>
        <Label type="large" textType="semiBold" style={styles.infoDiscountText}>
          Bulk discount 5% OFF
        </Label>
        <Label type="small" textType="semiBold" style={styles.infoDiscountSubText}>
          2 more buyers to go!
        </Label>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: theme.colors.white,
    marginHorizontal: 4,
    borderTopColor: theme.colors.background,
    borderTopWidth: 1,
    paddingBottom: 20,
    paddingTop: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: '70px',
  },
  infoTime: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'pink',
    paddingHorizontal: '4%',
  },
  infoDiscount: {
    display: 'flex',
    flexDirection: 'column',
  },
  infoTimeText: {
    color: theme.colors.error,
  },
  infoDiscountText: {
    color: theme.colors.green,
  },
  infoDiscountSubText: {
    color: theme.colors.darkTint5,
    textAlign: 'right',
  },
  infoTimeSubText: {
    color: theme.colors.error,
    paddingLeft: '2%',
  },
});

export default NewPropertyFooter;
