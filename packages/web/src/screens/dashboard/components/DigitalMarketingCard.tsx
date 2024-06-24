import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';

// TODO (Rajat) - change cards with Image coming from api
const DigitalMarketingCard: FC = () => {
  return (
    <View>
      <View style={styles.image1}>First Image</View>
      <View style={styles.image2}>Second Image</View>
    </View>
  );
};

const styles = StyleSheet.create({
  image1: {
    borderRadius: 4,
    width: 470,
    height: 200,
    backgroundColor: theme.colors.green,
    marginTop: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  image2: {
    alignItems: 'center',
    borderRadius: 4,
    marginTop: 10,
    marginBottom: 10,
    width: 470,
    height: 200,
    backgroundColor: theme.colors.darkTint5,
  },
});

export default DigitalMarketingCard;
