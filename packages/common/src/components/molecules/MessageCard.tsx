import React, { useState } from 'react';
import { Image, ImageStyle, StyleSheet, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import { useSelector } from 'react-redux';
import { DateFormats, DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import { Avatar } from '@homzhub/common/src/components/molecules/Avatar';
import UserView from '@homzhub/common/src/components/organisms/UserView';
import { Message } from '@homzhub/common/src/domain/models/Message';

interface IProps {
  details: Message[];
}

const MessageCard = (props: IProps): React.ReactElement => {
  const { details } = props;
  const {
    user: { firstName, id, profilePicture },
    createdAt,
    user,
  } = details[0];
  const [isUserView, setUserView] = useState(false);

  const userData = useSelector(UserSelector.getUserProfile);

  const isOwner = id === userData.id;
  const styles = getStyles(isOwner);

  const handleUserView = (): void => {
    setUserView(true);
  };

  const onCloseUserView = (): void => {
    setUserView(false);
  };

  const messageView = (): React.ReactElement | null => {
    // eslint-disable-next-line react/prop-types
    const messages = details.filter((item) => item.message);
    if (messages.length < 1) return null;
    return (
      <>
        <View style={styles.container}>
          {!isOwner && (
            <TouchableOpacity onPress={handleUserView} style={styles.avatar}>
              <Avatar isOnlyAvatar fullName={firstName} image={profilePicture} />
            </TouchableOpacity>
          )}
          <View style={styles.flexOne}>
            {messages.map((item, index) => {
              return (
                <View key={index} style={styles.messageContainer}>
                  <Label type="large" style={styles.message}>
                    {item.message}
                  </Label>
                </View>
              );
            })}
          </View>
        </View>
        {dateView()}
      </>
    );
  };

  const attachmentView = (): React.ReactElement | null => {
    // eslint-disable-next-line react/prop-types
    const attachments = details.filter((item) => item.attachments.length > 0);
    if (attachments.length < 1) return null;
    return (
      <>
        <View style={styles.container}>
          {!isOwner && (
            <TouchableOpacity onPress={handleUserView} style={styles.avatar}>
              <Avatar isOnlyAvatar fullName={firstName} image={profilePicture} />
            </TouchableOpacity>
          )}
          {attachments.map((attachment, index) => {
            return <Image key={index} source={{ uri: attachment.attachments[0].link }} style={styles.imageStyle} />;
          })}
        </View>
        {dateView()}
      </>
    );
  };

  const dateView = (): React.ReactElement => {
    return (
      <View style={styles.dateView}>
        {!isOwner && (
          <>
            <Label type="regular" style={styles.label}>
              {firstName}
            </Label>
            <Icon name={icons.roundFilled} color={theme.colors.disabled} size={8} style={styles.icon} />
          </>
        )}
        <Label type="regular" style={styles.label}>
          {DateUtils.convertDate(createdAt, DateFormats.HHMM_A)}
        </Label>
      </View>
    );
  };

  return (
    <>
      {messageView()}
      {attachmentView()}
      {!PlatformUtils.isWeb() && <UserView isVisible={isUserView} user={user} onClose={onCloseUserView} />}
    </>
  );
};

export default MessageCard;

interface IStyles {
  container: ViewStyle;
  avatar: ViewStyle;
  message: TextStyle;
  imageStyle: ImageStyle;
  dateView: ViewStyle;
  messageContainer: ViewStyle;
  icon: ViewStyle;
  label: TextStyle;
  flexOne: ViewStyle;
}

const getStyles = (isOwner: boolean): IStyles => {
  return StyleSheet.create({
    flexOne: {
      flex: 1,
    },
    container: {
      flexDirection: isOwner ? 'row-reverse' : 'row',
    },
    avatar: {
      alignSelf: 'flex-end',
    },
    message: {
      color: isOwner ? theme.colors.white : theme.colors.darkTint3,
    },
    imageStyle: {
      height: 150,
      width: 250,
      borderWidth: 4,
      borderRadius: 6,
      borderColor: theme.colors.background,
    },
    dateView: {
      flexDirection: isOwner ? 'row-reverse' : 'row',
      alignItems: 'center',
      marginStart: isOwner ? 0 : 44,
      padding: 8,
      marginBottom: 6,
    },
    messageContainer: {
      backgroundColor: isOwner ? theme.colors.darkTint5 : theme.colors.background,
      marginLeft: 8,
      marginTop: 4,
      padding: 10,
      borderRadius: 4,
      alignSelf: isOwner ? 'flex-end' : 'flex-start',
    },
    label: {
      color: theme.colors.darkTint6,
    },
    icon: {
      marginHorizontal: 4,
    },
  });
};
