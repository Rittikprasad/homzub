import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import { Avatar } from '@homzhub/common/src/components/molecules/Avatar';
import { BottomSheet } from '@homzhub/common/src/components/molecules/BottomSheet';
import { User } from '@homzhub/common/src/domain/models/User';

interface IProps {
  isVisible: boolean;
  onClose: () => void;
  user: User;
}

const UserView = (props: IProps): React.ReactElement => {
  const {
    user: { name, profilePicture },
    isVisible,
    onClose,
  } = props;
  const { t } = useTranslation();
  return (
    <BottomSheet headerTitle={t('assetMore:profile')} visible={isVisible} sheetHeight={300} onCloseSheet={onClose}>
      <View style={styles.container}>
        <Avatar isOnlyAvatar fullName={name} image={profilePicture} imageSize={72} />
        <Text type="regular" style={styles.name}>
          {name}
        </Text>
      </View>
    </BottomSheet>
  );
};

export default UserView;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 10,
  },
  name: {
    marginVertical: 8,
  },
});
