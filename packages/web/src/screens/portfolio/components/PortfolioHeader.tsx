import React from 'react';
import { View, StyleSheet } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';

const PortfolioHeader: React.FC = () => {
  return (
    <View style={styles.headerContainer}>
      <Typography size="large">Header Here</Typography>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    height: 140,
    backgroundColor: theme.colors.white,
  },
});

export default PortfolioHeader;
