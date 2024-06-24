import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { StringUtils } from '@homzhub/common/src/utils/StringUtils';
import { TimeUtils } from '@homzhub/common/src/utils/TimeUtils';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { ImagePlaceholder } from '@homzhub/common/src/components/atoms/ImagePlaceholder';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import { Avatar } from '@homzhub/common/src/components/molecules/Avatar';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { User } from '@homzhub/common/src/domain/models/User';

interface IProps {
  asset: Asset;
  users: User[];
  date: string;
  handleContactDetails: (isVisible: boolean, detail: User) => void;
  navigateToDetail?: () => void;
  isFromDetail?: boolean;
}

const UserWithAddressCard = (props: IProps): React.ReactElement => {
  const {
    asset: { attachments, projectName, address },
    users,
    handleContactDetails,
    isFromDetail = false,
    navigateToDetail,
    date,
  } = props;

  const renderDetailContainer = (): React.ReactElement => {
    return (
      <TouchableOpacity
        style={[styles.row, isFromDetail && styles.user]}
        activeOpacity={navigateToDetail ? 0.5 : 1}
        onPress={navigateToDetail}
      >
        {isFromDetail && (
          <View>
            {attachments.length > 0 ? (
              <Image
                source={{
                  uri: attachments.filter((item) => item.isCoverImage)[0].link,
                }}
                style={styles.carouselImage}
              />
            ) : (
              <ImagePlaceholder width={80} height={80} containerStyle={styles.placeholder} />
            )}
          </View>
        )}
        <View style={styles.flexOne}>
          <Label type="large" textType="semiBold" style={styles.project}>
            {projectName}
          </Label>
          <Label style={styles.address}>{address}</Label>
        </View>
        <View>
          {isFromDetail && <Icon name={icons.rightArrow} size={18} style={styles.arrow} />}
          <Label style={styles.time}>{TimeUtils.getLocaltimeDifference(date)}</Label>
        </View>
      </TouchableOpacity>
    );
  };

  const renderUsers = (): React.ReactElement => {
    return (
      <View style={styles.userContainer}>
        {users.map((item, index) => {
          return (
            <Avatar
              key={index}
              fullName={item.name}
              designation={StringUtils.toTitleCase(item.role.replace(/_/g, ' '))}
              isRightIcon
              image={item.profilePicture}
              onPressRightIcon={(): void => handleContactDetails(true, item)}
              containerStyle={styles.user}
            />
          );
        })}
      </View>
    );
  };

  return (
    <>
      {renderDetailContainer()}
      {renderUsers()}
    </>
  );
};

export default UserWithAddressCard;

const styles = StyleSheet.create({
  flexOne: {
    flex: 1,
  },
  project: {
    color: theme.colors.darkTint2,
  },
  address: {
    color: theme.colors.darkTint4,
  },
  time: {
    color: theme.colors.darkTint5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  userContainer: {
    marginVertical: 16,
  },
  user: {
    marginBottom: 16,
  },
  placeholder: {
    backgroundColor: theme.colors.darkTint5,
    borderRadius: 4,
    marginRight: 12,
  },
  carouselImage: {
    height: 80,
    width: 80,
    marginRight: 10,
  },
  arrow: {
    alignSelf: 'flex-end',
    marginBottom: 16,
  },
});
