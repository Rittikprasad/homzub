import React, { useState } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme } from '@homzhub/common/src/styles/theme';
import { useDown } from '@homzhub/common/src/utils/MediaQueryUtils';
import { SearchField } from '@homzhub/web/src/components/atoms/SearchField';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import LogsCards from '@homzhub/web/src/screens/helpAndSupport/CaseLogs/LogsCards';
import HaveAnyQuestionsForm from '@homzhub/web/src/screens/helpAndSupport/HaveAnyQuestionsForm';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

const CaseLogsCard = (): React.ReactElement => {
  const { t } = useTranslation();
  const [searchText, setSearchText] = useState('');
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  const isTablet = useDown(deviceBreakpoint.TABLET);
  const styles = askQuesFormStyle(isMobile, isTablet);
  const onChange = (text: string): void => {
    setSearchText(text);
  };
  return (
    <View style={styles.container}>
      <View style={styles.child1}>
        <View style={styles.header}>
          <Text type="regular" textType="semiBold" style={styles.headerTitle}>
            Case Logs(32)
          </Text>
          <SearchField
            placeholder={t('property:search')}
            value={searchText}
            updateValue={onChange}
            containerStyle={styles.searchBar}
          />
        </View>
        <LogsCards />
        <LogsCards />
        <LogsCards />
        <LogsCards />
      </View>
      <View style={styles.child2}>
        <HaveAnyQuestionsForm />
      </View>
    </View>
  );
};

interface IAskQuesFormStyle {
  container: ViewStyle;
  child1: ViewStyle;
  child2: ViewStyle;
  searchBar: ViewStyle;
  header: ViewStyle;
  text: ViewStyle;
  headerTitle: ViewStyle;
}

const askQuesFormStyle = (isMobile: boolean, isTablet: boolean): StyleSheet.NamedStyles<IAskQuesFormStyle> =>
  StyleSheet.create<IAskQuesFormStyle>({
    container: {
      flexDirection: isTablet ? 'column' : 'row',
    },
    child1: {
      borderRadius: 4,
      backgroundColor: theme.colors.white,
      padding: 12,
      flex: 2,
    },
    child2: {
      flex: 1,
    },
    searchBar: {
      height: 32,
      marginTop: isMobile ? 12 : 0,
    },
    header: {
      flexDirection: isMobile ? 'column' : 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 12,
      paddingVertical: 28,
    },
    text: {
      color: theme.colors.blue,
    },
    headerTitle: {
      color: theme.colors.darkTint1,
    },
  });
export default CaseLogsCard;
