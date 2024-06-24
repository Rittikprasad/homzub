import React, { FC, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { StyleSheet, View } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';
import { privacyPolicyContent } from '@homzhub/common/src/constants/PrivacyPolicyContent';

const PrivacyPolicy: FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <ReactMarkdown source={privacyPolicyContent} />
      </View>
    </View>
  );
};

export default PrivacyPolicy;

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
  },
  content: {
    maxWidth: '90%',
    alignSelf: 'center',
    marginBottom: '2%',
  },
});
