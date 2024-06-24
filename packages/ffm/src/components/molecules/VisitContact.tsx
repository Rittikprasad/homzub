import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import { Avatar } from '@homzhub/common/src/components/molecules/Avatar';
import { AssetKey } from '@homzhub/common/src/domain/models/AssetKey';
import { User } from '@homzhub/common/src/domain/models/User';

interface IProps {
  user?: User;
  imageSize?: number;
  assetKey?: AssetKey;
  containerStyle?: ViewStyle;
}

const VisitContact = ({ assetKey, user, containerStyle, imageSize = 50 }: IProps): React.ReactElement => {
  const name = assetKey ? assetKey.keyHolderName : user?.name;
  const phoneCode = assetKey ? assetKey.keyHolderPhoneCode : user?.countryCode;
  const phoneNumber = assetKey ? assetKey.keyHolderContactNumber : user?.phoneNumber;
  const userAddress = user?.userAddress.length ? user?.userAddress[0].address : '';
  const address = assetKey ? assetKey.keyHolderAddressLine1 : userAddress;
  const image = assetKey ? assetKey.keyHolderProfileImageUrl ?? '' : user?.profilePicture ?? '';

  return (
    <View style={containerStyle}>
      <Avatar
        isPhoneImage
        imageSize={imageSize}
        image={image}
        fullName={name}
        phoneCode={phoneCode}
        phoneNumber={phoneNumber}
        containerStyle={styles.container}
      />
      {!!address && (
        <Label type="regular" style={styles.address}>
          {address}
        </Label>
      )}
    </View>
  );
};

export default VisitContact;

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  address: {
    color: theme.colors.darkTint3,
    marginVertical: 16,
  },
});
