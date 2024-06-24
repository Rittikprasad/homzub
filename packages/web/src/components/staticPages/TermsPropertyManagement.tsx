import React, { FC, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { StyleSheet, View } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';
import { termsPropertyManagementContent } from '@homzhub/common/src/constants/TermsPropertyManagementContent';

const TermsPropertyManagement: FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <ReactMarkdown source={termsPropertyManagementContent} />
      </View>
    </View>
  );
};

export default TermsPropertyManagement;

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
  },
  content: {
    marginBottom: '2%',
  },
});
