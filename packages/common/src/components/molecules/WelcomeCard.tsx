import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import House from '@homzhub/common/src/assets/images/house.svg';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Text, Label } from '@homzhub/common/src/components/atoms/Text';

interface IProps {
  handlePress: () => void;
}

const WelcomeCard = ({ handlePress }: IProps): React.ReactElement => {
  const { t } = useTranslation();
  const user = useSelector(UserSelector.getUserProfile);

  return (
    <View style={styles.container}>
      <Text type="small" textType="semiBold">
        {t('letsGetStarted')}
      </Text>
      <View style={styles.contentContainer}>
        <View>
          <Label type="large" textType="semiBold" style={styles.title}>
            {t('welcomeText')}
          </Label>
          <Label type="large" textType="semiBold" style={styles.message}>{`${user?.name},`}</Label>
        </View>
        <House />
      </View>
      <Button type="primary" title={t('property:addYourFirstProperty')} onPress={handlePress} />
    </View>
  );
};

export default WelcomeCard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
    padding: 16,
  },
  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 26,
  },
  title: {
    color: theme.colors.darkTint4,
  },
  message: {
    color: theme.colors.darkTint6,
    marginVertical: 6,
  },
});
