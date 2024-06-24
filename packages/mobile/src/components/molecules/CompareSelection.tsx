import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Text } from '@homzhub/common/src//components/atoms/Text';

interface IProps {
  selected: number;
  totalCount?: number;
  onClear: () => void;
  onCompare: () => void;
}

const CompareSelection = (props: IProps): React.ReactElement => {
  const { selected, totalCount = 3, onClear, onCompare } = props;
  const { t } = useTranslation();
  const isDisabled = selected <= 1;
  return (
    <View style={styles.container}>
      <Text type="small" textType="regular" style={styles.title}>
        {t('offers:offerSelected', { selected, total: totalCount })}
      </Text>
      <View style={styles.buttonView}>
        <Button
          type="primary"
          title={t('clearAll')}
          containerStyle={styles.clearButton}
          titleStyle={styles.clearTitle}
          onPress={onClear}
        />
        <View style={styles.separator} />
        <Button
          type="primary"
          title={t('compare')}
          containerStyle={[styles.compareButton, isDisabled && { backgroundColor: theme.colors.disabled }]}
          titleStyle={styles.compareTitle}
          disabled={isDisabled}
          onPress={onCompare}
        />
      </View>
    </View>
  );
};

export default CompareSelection;

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.darkTint2,
    padding: 16,
    alignItems: 'center',
  },
  title: {
    color: theme.colors.white,
  },
  buttonView: {
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 8,
  },
  clearButton: {
    backgroundColor: theme.colors.subHeader,
    flex: 0,
  },
  clearTitle: {
    color: theme.colors.white,
    marginVertical: 8,
  },
  separator: {
    marginHorizontal: 12,
  },
  compareButton: {
    backgroundColor: theme.colors.white,
    flex: 0,
  },
  compareTitle: {
    color: theme.colors.darkTint2,
    marginVertical: 8,
  },
});
