import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import FAQComponent from '@homzhub/web/src/screens/helpAndSupport/FAQComponent';

const HelpAndSupport: FC = () => {
  return (
    <View style={styles.container}>
      <FAQComponent />
    </View>
  );
};

export default HelpAndSupport;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});
