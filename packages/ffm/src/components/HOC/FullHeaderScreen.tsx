import React from 'react';
import { ImageBackground, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import HandleBack from '@homzhub/mobile/src/navigation/HandleBack';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Loader } from '@homzhub/common/src/components/atoms/Loader';
import { StatusBar } from '@homzhub/mobile/src/components/atoms/StatusBar';
import { Label, Text } from '@homzhub/common/src/components/atoms/Text';
import { Avatar } from '@homzhub/common/src/components/molecules/Avatar';

interface IProps {
  children: React.ReactNode;
  screenTitle?: string;
  pageTitle?: string;
  pageSubTitle?: string;
  onGoBack?: () => void;
  isUserHeader?: boolean;
  loading?: boolean;
}

const FullHeaderScreen = (props: IProps): React.ReactElement => {
  const { screenTitle, children, onGoBack, isUserHeader = false, pageTitle, pageSubTitle, loading = false } = props;
  const user = useSelector(UserSelector.getUserProfile);
  return (
    <HandleBack onBack={onGoBack}>
      <ImageBackground
        source={require('../../../../common/src/assets/images/background.png')}
        style={[styles.background, !isUserHeader && styles.userBackground]}
      >
        <StatusBar barStyle="light-content" statusBarBackground="transparent" />
        <View style={styles.userHeader}>
          <TouchableOpacity onPress={onGoBack}>
            <Icon name={icons.leftArrow} size={20} color={theme.colors.white} />
          </TouchableOpacity>
          <Text type="regular" textType="semiBold" style={styles.title} maxLength={25}>
            {screenTitle}
          </Text>
          <TouchableOpacity>
            <Avatar isOnlyAvatar imageSize={34} fullName={user?.name} />
          </TouchableOpacity>
        </View>
        <View style={styles.content}>
          <Text type="small" textType="semiBold" style={styles.title} maxLength={25}>
            {pageTitle}
          </Text>
          <Label type="regular" textType="semiBold" style={styles.title}>
            {pageSubTitle}
          </Label>
        </View>
      </ImageBackground>
      {children}
      <Loader visible={loading} />
    </HandleBack>
  );
};

export default FullHeaderScreen;

const styles = StyleSheet.create({
  background: {
    height: 200,
  },
  title: {
    color: theme.colors.white,
    marginBottom: 10,
  },
  userBackground: {
    justifyContent: 'center',
  },
  userHeader: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginTop: '2%',
  },
  content: {
    marginHorizontal: 16,
  },
});
