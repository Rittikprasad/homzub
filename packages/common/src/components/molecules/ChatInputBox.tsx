import React, { useState } from 'react';
import { ImageBackground, StyleProp, StyleSheet, TextInput, TouchableOpacity, View, ViewStyle } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { CommonActions } from '@homzhub/common/src/modules/common/actions';
import { CommonSelectors } from '@homzhub/common/src/modules/common/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';

interface IProps {
  onUploadImage: () => void;
  onPressCamera: () => void;
  onInputFocus: () => void;
  onFocusOut: () => void;
  onSubmit: (text: string, isAttachment?: boolean) => void;
  containerStyle?: StyleProp<ViewStyle>;
  hasAttachments?: boolean;
}

const ChatInputBox = (props: IProps): React.ReactElement => {
  const {
    onSubmit,
    onUploadImage,
    containerStyle,
    onInputFocus,
    onPressCamera,
    onFocusOut,
    hasAttachments = true,
  } = props;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const attachmentUrl: string = useSelector(CommonSelectors.getMessageAttachment);

  // states
  const [value, setValue] = useState('');
  const [isImage, setIsImage] = useState(false);

  const onChangeText = (text: string): void => {
    setValue(text);
  };

  const onPressIcon = (): void => {
    setIsImage(!isImage);
    if (attachmentUrl) {
      clearAttachment();
    }
  };

  const onPressSend = (): void => {
    onSubmit(value, !!attachmentUrl);
    setValue('');
    if (attachmentUrl) {
      clearAttachment();
    }
  };

  const clearAttachment = (): void => {
    dispatch(CommonActions.clearAttachment());
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {hasAttachments && (
        <TouchableOpacity onPress={onPressIcon}>
          <Icon
            name={isImage ? icons.circularCrossFilled : icons.circularPlus}
            color={theme.colors.blue}
            size={28}
            style={styles.icon}
          />
        </TouchableOpacity>
      )}
      {isImage && !attachmentUrl && (
        <View style={styles.iconView}>
          <Icon
            name={icons.filledGallery}
            color={theme.colors.blue}
            size={28}
            onPress={onUploadImage}
            style={styles.gallery}
          />
          <Icon
            name={icons.camera}
            color={theme.colors.blue}
            size={28}
            onPress={onPressCamera}
            style={styles.gallery}
          />
        </View>
      )}
      {!!attachmentUrl && (
        <View style={styles.imageContainer}>
          <ImageBackground source={{ uri: attachmentUrl }} style={styles.image}>
            <Icon
              name={icons.close}
              color={theme.colors.white}
              size={25}
              style={styles.iconContainer}
              onPress={clearAttachment}
            />
          </ImageBackground>
        </View>
      )}
      {!isImage && (
        <TextInput
          onFocus={onInputFocus}
          onBlur={onFocusOut}
          placeholder={t('common:typeYourMessage')}
          value={value}
          onChangeText={onChangeText}
          style={styles.input}
        />
      )}
      <TouchableOpacity onPress={onPressSend}>
        <Icon name={icons.circularArrow} color={theme.colors.blue} size={40} style={styles.send} />
      </TouchableOpacity>
    </View>
  );
};

export default ChatInputBox;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 14,
    backgroundColor: theme.colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  icon: {
    marginRight: 6,
  },
  gallery: {
    marginLeft: 8,
    paddingVertical: 18.5,
  },
  input: {
    paddingVertical: 24,
    color: theme.colors.darkTint1,
    flex: 1,
  },
  send: {
    marginHorizontal: 4,
  },
  imageContainer: {
    flex: 1,
    paddingVertical: 10,
  },
  image: {
    width: 150,
    height: 100,
  },
  iconContainer: {
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.crossIconContainer,
  },
  iconView: {
    flexDirection: 'row',
    flex: 1,
  },
});
