import React, { FC, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { StyleSheet, View } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';
import { termsServicesandPaymentContent } from '@homzhub/common/src/constants/TermsServicesandPaymentContent';

const TermsServicesPayment: FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <ReactMarkdown source={termsServicesandPaymentContent} />
      </View>
    </View>
  );
};

export default TermsServicesPayment;

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    height: '100%',
  },
  content: {
    maxWidth: '90%',
    alignSelf: 'center',
    marginBottom: '2%',
  },
});
