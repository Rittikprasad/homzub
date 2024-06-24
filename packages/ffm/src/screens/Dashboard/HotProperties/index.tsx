import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { FFMSelector } from '@homzhub/common/src/modules/ffm/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import GradientScreen from '@homzhub/ffm/src/components/HOC/GradientScreen';
import HotPropertiesTab from '@homzhub/ffm/src/screens/Dashboard/HotProperties/HotPropertiesTab';

const HotProperties = (): React.ReactElement => {
  const { goBack } = useNavigation();
  const { t } = useTranslation();
  const { hotProperties } = useSelector(FFMSelector.getFFMLoaders);

  return (
    <GradientScreen
      isUserHeader
      onGoBack={goBack}
      loading={hotProperties}
      screenTitle="Dashboard"
      pageTitle={t('property:hotProperties')}
      containerStyle={styles.container}
      pageHeaderStyle={styles.header}
    >
      <HotPropertiesTab />
    </GradientScreen>
  );
};

export default HotProperties;

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    padding: 0,
  },
  header: {
    backgroundColor: theme.colors.white,
    marginTop: 0,
    marginBottom: 0,
    padding: 16,
  },
});
