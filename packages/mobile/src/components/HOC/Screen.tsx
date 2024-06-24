import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView, View, StyleProp, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Animated, { AnimationService } from '@homzhub/mobile/src/services/AnimationService';
import AddIcon from '@homzhub/common/src/assets/images/circularPlus.svg';
import { theme } from '@homzhub/common/src/styles/theme';
import { Loader } from '@homzhub/common/src/components/atoms/Loader';
import { PageHeader, IPageHeaderProps, TITLE_HEIGHT } from '@homzhub/mobile/src/components/atoms/PageHeader';
import { Header, IHeaderProps } from '@homzhub/mobile/src/components/molecules/Header';
import HandleBack from '@homzhub/mobile/src/navigation/HandleBack';

const { createAnimatedComponent, setAnimatedValue, interpolateAnimation } = AnimationService;
const AnimatedKeyboardAwareScrollView = createAnimatedComponent(KeyboardAwareScrollView);

interface IProps {
  children: React.ReactNode;
  scrollEnabled?: boolean;
  isLoading?: boolean;
  keyboardShouldPersistTaps?: boolean;
  backgroundColor?: string;
  headerProps?: IHeaderProps;
  pageHeaderProps?: IPageHeaderProps;
  containerStyle?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  onPlusIconClicked?: () => void;
}

export const Screen = (props: IProps): React.ReactElement => {
  const {
    children,
    isLoading = false,
    scrollEnabled = true,
    keyboardShouldPersistTaps = false,
    headerProps,
    pageHeaderProps,
    backgroundColor,
    containerStyle = {},
    contentContainerStyle = {},
    onPlusIconClicked,
  } = props;
  const navigation = useNavigation();

  // Values for Header Animations
  let opacity;
  let onScroll;
  if (!headerProps?.title && pageHeaderProps?.contentTitle) {
    const scrollY = setAnimatedValue(0);
    opacity = interpolateAnimation(scrollY, [10, TITLE_HEIGHT], [0, 1]);
    onScroll = Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }]);
  }

  return (
    <HandleBack onBack={headerProps?.onIconPress} navigation={navigation}>
      <Header {...headerProps} title={headerProps?.title ?? pageHeaderProps?.contentTitle} opacity={opacity} />
      <SafeAreaView style={[styles.container, { backgroundColor }]}>
        {scrollEnabled ? (
          <AnimatedKeyboardAwareScrollView
            keyboardShouldPersistTaps={keyboardShouldPersistTaps ? 'handled' : 'never'}
            showsVerticalScrollIndicator={false}
            style={[styles.container, containerStyle]}
            onScroll={onScroll}
          >
            <PageHeader {...pageHeaderProps} />
            <View style={[styles.contentContainer, contentContainerStyle]}>{children}</View>
          </AnimatedKeyboardAwareScrollView>
        ) : (
          <View style={[styles.container, containerStyle]}>
            <PageHeader {...pageHeaderProps} />
            <View style={[styles.contentContainer, contentContainerStyle]}>{children}</View>
          </View>
        )}
      </SafeAreaView>
      {onPlusIconClicked && (
        <TouchableOpacity onPress={onPlusIconClicked} style={styles.addIcon}>
          <AddIcon />
        </TouchableOpacity>
      )}
      <Loader visible={isLoading} />
    </HandleBack>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: theme.layout.screenPadding,
  },
  addIcon: {
    position: 'absolute',
    bottom: 40,
    right: 20,
  },
});
