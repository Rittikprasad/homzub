import React from 'react';
import { FlexStyle, StyleSheet, TextStyle, View, ViewStyle } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';
import { Avatar } from '@homzhub/common/src/components/molecules/Avatar';
import { User } from '@homzhub/common/src/domain/models/User';

const MAX_DISPLAY_COUNT_HEADER = 3;
const MAX_DISPLAY_COUNT_CHAT = 2;
const CIRCLE_SIZE_HEADER = 55;
const CIRCLE_SIZE_CHAT = 30;

interface IProps {
  faces: User[];
  isHeader: boolean;
  containerStyle?: ViewStyle;
  loggedInUserId?: number;
}

type getStyles = (circleSize?: number, isHeader?: boolean, index?: number) => IScreenStyles;

const GroupChatAvatar = (props: IProps): React.ReactElement => {
  const styles = getStyles();
  const { faces, isHeader = true, containerStyle = {}, loggedInUserId } = props;

  const faceDisplayCount = isHeader ? MAX_DISPLAY_COUNT_HEADER : MAX_DISPLAY_COUNT_CHAT;
  const shouldShowOverflow = faces.length > faceDisplayCount;
  const overflow = faces.length - faceDisplayCount;

  const sortedFaces = faces.sort((a: User, b: User) => a.firstName.localeCompare(b.firstName));

  if (loggedInUserId) {
    const loggedInUserIndex = sortedFaces.findIndex((user: User) => user.id === loggedInUserId);
    const loggedInuser = sortedFaces[loggedInUserIndex];
    sortedFaces.splice(loggedInUserIndex, 1);
    sortedFaces.push(loggedInuser);
  }

  const facesToShow = sortedFaces.slice(0, faceDisplayCount);

  const circleSize = isHeader ? CIRCLE_SIZE_HEADER : CIRCLE_SIZE_CHAT;

  const ExtraCount = (): React.ReactElement | null => {
    const { marginStyle, extraCountStyle, initialsContainerStyle, customText } = getStyles(circleSize, isHeader);
    if (shouldShowOverflow) {
      return (
        <Avatar
          isOnlyAvatar
          containerStyle={isHeader ? marginStyle : extraCountStyle}
          imageSize={circleSize}
          customText={`+${overflow.toString()}`}
          initialsContainerStyle={initialsContainerStyle}
          customTextStyle={customText}
        />
      );
    }
    return null;
  };

  const Faces = (): React.ReactElement => {
    return (
      <>
        {facesToShow.map((face: User, index: number) => {
          const { avatarStyle, marginStyle, customText } = getStyles(circleSize, isHeader, index);

          return (
            <Avatar
              key={index}
              isOnlyAvatar
              containerStyle={isHeader ? marginStyle : avatarStyle}
              imageSize={circleSize}
              fullName={face ? face.name : ''}
              image={(!!face && face.profilePicture) || undefined}
              customTextStyle={customText}
            />
          );
        })}
      </>
    );
  };
  return (
    <View style={[styles.container, containerStyle]}>
      <Faces />
      <ExtraCount />
    </View>
  );
};
export default React.memo(GroupChatAvatar);
interface IScreenStyles {
  container: FlexStyle;
  initialsContainerStyle: ViewStyle;
  customText: TextStyle;
  extraCountStyle: ViewStyle;
  avatarStyle: ViewStyle;
  marginStyle: ViewStyle;
}
const getStyles: getStyles = (circleSize = CIRCLE_SIZE_HEADER, isHeader = true, index = 0) => {
  const isFirstFace = index === 0;
  const facesHorizontalDivisor = 3;
  const extraCountHorizontalDivisor = 1.4;

  return StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
    },
    initialsContainerStyle: {
      backgroundColor: theme.colors.background,
    },
    customText: {
      ...(!isHeader && { fontSize: circleSize / 2.5 }),
    },
    marginStyle: {
      marginLeft: -16,
    },
    avatarStyle: {
      position: 'absolute',
      ...(!isFirstFace && {
        bottom: circleSize / 2,
        left: (circleSize / facesHorizontalDivisor) * index + 1,
      }),
      zIndex: isFirstFace ? 10 : 0,
    },
    extraCountStyle: {
      position: 'absolute',
      left: circleSize / extraCountHorizontalDivisor,
      zIndex: 10,
    },
  });
};
