import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import Check from '@homzhub/common/src/assets/images/check.svg';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

interface IProps {
  onGoBack: () => void;
}

const ReviewCard = ({ onGoBack }: IProps): React.ReactElement => {
  const { t } = useTranslation(LocaleConstants.namespacesKey.reports);
  return (
    <View style={styles.container}>
      <Check width={50} />
      <Text type="regular" textType="semiBold" style={styles.heading}>
        {t('inspectionSentToReview')}
      </Text>
      <Text type="small" style={styles.subHeading}>
        {t('inspectionReview')}
      </Text>
      <Button type="primary" title={t('backToReports')} onPress={onGoBack} containerStyle={styles.button} />
    </View>
  );
};

export default ReviewCard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
    marginVertical: 16,
    alignItems: 'center',
    padding: 20,
  },
  heading: {
    textAlign: 'center',
  },
  subHeading: {
    marginVertical: 50,
    textAlign: 'center',
  },
  button: {
    marginBottom: 40,
  },
});
