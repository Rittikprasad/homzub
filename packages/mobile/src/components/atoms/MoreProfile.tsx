import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import { connect } from 'react-redux';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Label, Text } from '@homzhub/common/src/components/atoms/Text';
import { Avatar } from '@homzhub/common/src/components/molecules/Avatar';
import { UserProfile as UserProfileModel } from '@homzhub/common/src/domain/models/UserProfile';

interface IProps {
  onIconPress: () => void;
  headerContainerStyle?: ViewStyle;
}

interface IStateProps {
  userProfile: UserProfileModel;
}

type Props = IProps & IStateProps;

class MoreProfile extends Component<Props> {
  public render(): React.ReactNode {
    return <View style={styles.container}>{this.renderHeader()}</View>;
  }

  private renderHeader = (): React.ReactElement | null => {
    const { onIconPress, userProfile, headerContainerStyle } = this.props;

    return (
      <TouchableOpacity onPress={onIconPress} style={[styles.headerContainer, headerContainerStyle]}>
        <View style={styles.flexRow}>
          <Avatar
            isOnlyAvatar
            imageSize={60}
            fullName={userProfile?.name ?? 'User'}
            initialsContainerStyle={styles.initialsContainer}
            image={userProfile?.profilePicture ?? ''}
          />
          <View style={styles.nameContainer}>
            <Text maxLength={14} type="regular" textType="semiBold">
              {userProfile?.name ?? 'User'}
            </Text>
            <Label type="large" textType="semiBold" style={styles.progressMsg}>
              {`${userProfile?.profileProgress}% Profile Completed`}
            </Label>
          </View>
        </View>
        <Icon name={icons.rightArrow} size={18} color={theme.colors.lowPriority} />
      </TouchableOpacity>
    );
  };
}

const mapStateToProps = (state: IState): IStateProps => {
  const { getUserProfile } = UserSelector;
  return {
    userProfile: getUserProfile(state),
  };
};

const moreProfile = connect(mapStateToProps)(MoreProfile);
export { moreProfile as MoreProfile };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderTopEndRadius: 4,
    borderTopStartRadius: 4,
  },
  flexRow: {
    flexDirection: 'row',
  },
  headerContainer: {
    flex: 1,
    backgroundColor: theme.colors.moreSeparator,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.layout.screenPadding,
    height: 120,
  },
  initialsContainer: {
    elevation: 10,
    shadowColor: theme.colors.shadow,
    shadowRadius: 4,
  },
  nameContainer: {
    marginStart: 12,
    justifyContent: 'center',
  },
  progressMsg: {
    color: theme.colors.green,
  },
});
