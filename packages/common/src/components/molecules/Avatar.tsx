import React from 'react';
import { Image, StyleProp, StyleSheet, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import { TimeUtils } from '@homzhub/common/src/utils/TimeUtils';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { StringUtils } from '@homzhub/common/src/utils/StringUtils';
import { I18nService } from '@homzhub/common/src/services/Localization/i18nextService';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import Call from '@homzhub/common/src/assets/images/call.svg';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Rating } from '@homzhub/common/src/components/atoms/Rating';
import { Label, Text } from '@homzhub/common/src/components/atoms/Text';

interface IProps {
  fullName?: string;
  isOnlyAvatar?: boolean;
  image?: string;
  icon?: string;
  designation?: string;
  phoneNumber?: string;
  phoneCode?: string;
  rating?: number;
  date?: string;
  isPhoneImage?: boolean;
  isButtonType?: boolean;
  isSelected?: boolean;
  isRightIcon?: boolean;
  rightIconName?: string;
  rightIconColor?: string;
  imageSize?: number;
  onPressCamera?: () => void;
  onPressButton?: () => void;
  onPressRightIcon?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  customDesignation?: StyleProp<TextStyle>;
  initialsContainerStyle?: StyleProp<ViewStyle>;
  customText?: string;
  customTextStyle?: StyleProp<TextStyle>;
  nameStyle?: StyleProp<TextStyle>;
}

const Avatar = (props: IProps): React.ReactElement => {
  const {
    fullName = I18nService.t('common:user'),
    designation,
    containerStyle = {},
    customDesignation = {},
    phoneNumber,
    rating,
    date,
    isRightIcon = false,
    phoneCode,
    isOnlyAvatar = false,
    isButtonType = false,
    image,
    icon,
    initialsContainerStyle,
    imageSize = 42,
    onPressCamera,
    onPressRightIcon,
    rightIconName = icons.rightArrow,
    rightIconColor = theme.colors.blue,
    customText,
    onPressButton,
    customTextStyle = {},
    nameStyle = {},
    isSelected = false,
    isPhoneImage = false,
  } = props;

  const renderText = (): React.ReactElement => {
    if (customText?.length) {
      return (
        <Text type="regular" textType="semiBold" style={[styles.customText, customTextStyle]}>
          {customText}
        </Text>
      );
    }
    return (
      <Text type="small" textType="regular" style={[styles.initials, customTextStyle]}>
        {StringUtils.getInitials(fullName)}
      </Text>
    );
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.leftView}>
        <>
          {image || icon ? (
            <>
              {!!image && (
                <Image
                  source={{
                    uri: image,
                  }}
                  style={{
                    ...(theme.circleCSS(imageSize) as object),
                    borderColor: theme.colors.white,
                    borderWidth: 1,
                  }}
                />
              )}
              {!!icon && <Icon name={icons.circularCheckFilled} size={imageSize} color={theme.colors.greenOpacity} />}
            </>
          ) : (
            <View
              style={[styles.initialsContainer, { ...(theme.circleCSS(imageSize) as object) }, initialsContainerStyle]}
            >
              {renderText()}
            </View>
          )}

          {onPressCamera && (
            <TouchableOpacity style={styles.editView} onPress={onPressCamera} activeOpacity={0.8}>
              <Icon name={icons.camera} size={14} color={theme.colors.white} />
            </TouchableOpacity>
          )}
          {isSelected && (
            <View style={styles.selectedView}>
              <Icon name={icons.checkFilled} size={14} color={theme.colors.white} />
            </View>
          )}
        </>
        {!isOnlyAvatar && (
          <View style={styles.nameContainer}>
            <Label
              textType="regular"
              type="large"
              numberOfLines={1}
              minimumFontScale={0.8}
              adjustsFontSizeToFit
              style={nameStyle}
            >
              {fullName}
            </Label>
            <View style={styles.leftView}>
              {isButtonType ? (
                <Button
                  type="primary"
                  onPress={onPressButton}
                  title={designation}
                  containerStyle={styles.buttonContainer}
                  textStyle={styles.buttonStyle}
                />
              ) : (
                <Label textType="regular" type="regular" style={[styles.designation, customDesignation]}>
                  {designation}
                </Label>
              )}

              {!!phoneNumber && (
                <View style={[styles.numberContainer, isPhoneImage && styles.phoneView]}>
                  {isPhoneImage ? (
                    <Call style={styles.phoneImage} />
                  ) : (
                    <Icon name={icons.roundFilled} color={theme.colors.disabled} size={12} style={styles.iconStyle} />
                  )}
                  {!!phoneCode && (
                    <Label textType="regular" type="regular" style={styles.designation}>
                      {`(${phoneCode}) `}
                    </Label>
                  )}
                  <Label textType="regular" type="regular" style={styles.designation}>
                    {phoneNumber}
                  </Label>
                </View>
              )}
              {!!rating && (
                <View style={styles.numberContainer}>
                  <Icon name={icons.roundFilled} color={theme.colors.disabled} size={8} style={styles.iconStyle} />
                  <Rating single value={rating} />
                </View>
              )}
            </View>
          </View>
        )}
      </View>
      {(isRightIcon || !!date) && (
        <View style={[styles.rightView, !isRightIcon && { flexDirection: 'column-reverse' }]}>
          {isRightIcon && onPressRightIcon && (
            <Icon
              name={rightIconName}
              color={rightIconColor}
              size={20}
              style={styles.iconStyle}
              onPress={onPressRightIcon}
            />
          )}
          {!!date && (
            <Label textType="regular" type="regular" style={styles.designation}>
              {TimeUtils.getLocaltimeDifference(date)}
            </Label>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  leftView: {
    flexDirection: 'row',
  },
  rightView: {
    flex: 1,
    alignItems: 'flex-end',
  },
  initialsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.darkTint6,
    borderWidth: 1,
    borderColor: theme.colors.white,
  },
  designation: {
    color: theme.colors.darkTint5,
    marginTop: 2,
  },
  initials: {
    color: theme.colors.white,
  },
  customText: {
    color: theme.colors.darkTint4,
  },
  nameContainer: {
    marginLeft: 12,
    marginRight: 6,
    width: PlatformUtils.isWeb() ? 'fit-content' : theme.viewport.width / 2 - 40,
    justifyContent: 'center',
  },
  numberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconStyle: {
    marginTop: 6,
    marginHorizontal: 4,
  },
  editView: {
    ...(theme.circleCSS(26) as object),
    backgroundColor: theme.colors.blue,
    borderColor: theme.colors.white,
    borderWidth: 2,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    top: 60,
    left: 50,
  },
  buttonContainer: {
    flex: 0,
    marginVertical: 6,
  },
  buttonStyle: {
    marginVertical: 6,
    marginHorizontal: 8,
  },
  selectedView: {
    ...(theme.circleCSS(24) as object),
    backgroundColor: theme.colors.blue,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    top: 66,
    left: 30,
  },
  phoneView: {
    marginTop: 6,
  },
  phoneImage: {
    marginRight: 10,
  },
});

const memoizedComponent = React.memo(Avatar);
export { memoizedComponent as Avatar };
