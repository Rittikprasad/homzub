import React, { FC } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme } from '@homzhub/common/src/styles/theme';
import { icons } from '@homzhub/common/src/assets/icon';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Image } from '@homzhub/common/src/components/atoms/Image';
import { Text } from '@homzhub/common/src/components/atoms/Text';

interface IProps {
  closeModal: () => void;
  updateData: () => void;
}
const ConfirmationContent: FC<IProps> = (props: IProps) => {
  const { closeModal, updateData } = props;
  const { t } = useTranslation();

  const handlePress = (): void => {
    closeModal();
    updateData();
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Button icon={icons.close} type="text" iconSize={20} iconColor={theme.colors.darkTint3} onPress={handlePress} />
      </View>
      <View style={styles.textContainer}>
        <Text type="regular" textType="semiBold">
          {t('common:congratulations')}
        </Text>
        <Text type="small" textType="regular" style={styles.text}>
          {t('property:listingCancelled')}
        </Text>

        <Image source={require('@homzhub/common/src/assets/images/confirmCheck.svg')} style={styles.image} />
        <Button title={t('common:done')} type="primary" containerStyle={styles.button} onPress={handlePress} />
      </View>
    </View>
  );
};
export default ConfirmationContent;
const styles = StyleSheet.create({
  textContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    top: 42,
  },
  text: {
    paddingTop: 12,
    paddingBottom: 24,
    textAlign: 'center',
  },
  container: {
    marginHorizontal: '5%',
    marginVertical: 30,
    height: 372,
  },
  header: {
    flexDirection: 'row-reverse',
  },
  button: {
    width: '100%',
    height: 44,
    top: 60,
  },
  image: {
    height: 120,
    width: 120,
  },
});
