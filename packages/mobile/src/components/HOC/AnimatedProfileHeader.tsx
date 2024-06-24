import React, { useCallback } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import LinearGradient from 'react-native-linear-gradient';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Text, FontWeightType } from '@homzhub/common/src/components/atoms/Text';
import { Loader } from '@homzhub/common/src/components/atoms/Loader';
import { Avatar } from '@homzhub/common/src/components/molecules/Avatar';
import { ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';

interface IProps {
  children: React.ReactElement;
  title?: string;
  sectionHeader?: string;
  sectionTitleType?: FontWeightType;
  isOuterScrollEnabled?: boolean;
  keyboardShouldPersistTaps?: boolean;
  loading?: boolean;
  isGradientHeader?: boolean;
  onBackPress?: () => void;
  detachedHeaderMode?: boolean;
}

const { headerGradientA, headerGradientB, headerGradientC } = theme.colors;
const gradientProps = {
  start: { x: 0, y: 0 },
  end: { x: 1, y: 0 },
  colors: [headerGradientA, headerGradientB, headerGradientC],
  locations: [0.2, 0.7, 0.9],
};

const AnimatedProfileHeader = (props: IProps): React.ReactElement => {
  const {
    title = '',
    sectionHeader,
    isOuterScrollEnabled,
    sectionTitleType = 'bold',
    children,
    keyboardShouldPersistTaps = false,
    loading = false,
    isGradientHeader = false,
    onBackPress,
    detachedHeaderMode = false,
  } = props;
  const userProfile = useSelector(UserSelector.getUserProfile);
  const navigation = useNavigation();

  const onProfilePress = useCallback(() => {
    navigation.navigate(ScreensKeys.More, {
      screen: ScreensKeys.UserProfileScreen,
      initial: false,
    });
  }, [navigation]);

  const renderContent = useCallback(
    (): React.ReactElement => (
      <>
        <View
          style={[
            styles.headerContainer,
            { backgroundColor: isGradientHeader ? theme.colors.transparent : theme.colors.primaryColor },
          ]}
        >
          <Text type="regular" textType="semiBold" style={styles.title}>
            {title}
          </Text>
          <TouchableOpacity onPress={onProfilePress}>
            <Avatar
              isOnlyAvatar
              imageSize={35}
              fullName={userProfile?.fullName ?? 'User'}
              image={userProfile?.profilePicture ?? ''}
              initialsContainerStyle={styles.initialsContainer}
            />
          </TouchableOpacity>
        </View>
      </>
    ),
    [isGradientHeader, title, onProfilePress, userProfile]
  );

  return (
    <View style={styles.container}>
      {isGradientHeader ? <LinearGradient {...gradientProps}>{renderContent()}</LinearGradient> : renderContent()}
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps={keyboardShouldPersistTaps ? 'always' : 'never'}
        showsVerticalScrollIndicator={false}
        scrollEnabled={isOuterScrollEnabled}
        nestedScrollEnabled
      >
        <>
          {isGradientHeader ? (
            <LinearGradient {...gradientProps} style={styles.headingView} />
          ) : (
            <View style={[styles.headingView, { backgroundColor: theme.colors.primaryColor }]} />
          )}
          <View style={styles.scrollView}>
            {onBackPress && (
              <View style={detachedHeaderMode ? { ...styles.header, ...styles.detachedHeaderStyle } : styles.header}>
                <Icon
                  size={24}
                  name={icons.leftArrow}
                  color={theme.colors.primaryColor}
                  style={styles.iconStyle}
                  onPress={onBackPress}
                />
                <Text type="small" textType={sectionTitleType}>
                  {sectionHeader}
                </Text>
              </View>
            )}
            {children}
          </View>
        </>
      </KeyboardAwareScrollView>
      <Loader visible={loading} />
    </View>
  );
};

const memoizedComponent = React.memo(AnimatedProfileHeader);
export { memoizedComponent as AnimatedProfileHeader };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    position: 'relative',
    paddingHorizontal: theme.layout.screenPadding,
    bottom: 85,
  },
  headingView: {
    height: 100,
    borderBottomWidth: 8,
    borderBottomColor: theme.colors.green,
  },
  initialsContainer: {
    ...(theme.circleCSS(35) as object),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.darkTint7,
    borderColor: theme.colors.white,
    borderWidth: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.layout.screenPadding,
    paddingTop: theme.viewport.width > 400 ? (PlatformUtils.isIOS() ? 30 : 40) : 30,
    paddingBottom: 10,
  },
  title: {
    color: theme.colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.layout.screenPadding,
    paddingTop: theme.layout.screenPaddingTop,
    backgroundColor: theme.colors.white,
  },
  detachedHeaderStyle: {
    paddingTop: theme.layout.screenPadding,
    paddingBottom: theme.layout.screenPadding,
    borderRadius: 4,
    marginBottom: theme.layout.screenPadding,
  },
  iconStyle: {
    paddingRight: 12,
  },
});
