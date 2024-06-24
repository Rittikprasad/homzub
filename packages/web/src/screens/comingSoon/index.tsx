import React, { FC } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme } from '@homzhub/common/src/styles/theme';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

const ComingSoon: FC = () => {
  const { t } = useTranslation(LocaleConstants.namespacesKey.common);
  return (
    <View style={styles.comingSoonContent}>
      <Text type="large">{t('comingSoonText')}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  comingSoonContent: {
    alignItems: 'center',
    paddingVertical: 190,
    backgroundColor: theme.colors.white,
    marginBottom: 24,
    width: '95%',
  },
});

export default ComingSoon;
