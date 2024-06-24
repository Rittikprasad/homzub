// @ts-nocheck
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon from '@homzhub/common/src/assets/icon';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { MoreProfile } from '@homzhub/mobile/src/components/atoms/MoreProfile';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import GradientScreen from '@homzhub/ffm/src/components/HOC/GradientScreen';
import { ScreenKeys } from '@homzhub/ffm/src/navigation/interfaces';
import { IMoreScreenItem, MoreScreenTypes, FFM_MORE_SCREEN } from '@homzhub/common/src/constants/MoreScreens';

const More = (): React.ReactElement => {
  const { t } = useTranslation();
  const { navigate } = useNavigation();
  const screenKeys: string[] = Object.keys(FFM_MORE_SCREEN);

  const onPressIcon = (): void => {
    navigate(ScreenKeys.UserProfile);
  };

  const handleNavigation = (type: MoreScreenTypes): void => {
    switch (type) {
      case MoreScreenTypes.SUPPLIES:
      default:
        navigate(ScreenKeys.ComingSoon);
        break;
    }
  };

  const renderSeparator = (): React.ReactElement => {
    return <Divider containerStyles={styles.divider} />;
  };

  const renderItem = (item: IMoreScreenItem): React.ReactElement => {
    return (
      <TouchableOpacity onPress={(): void => handleNavigation(item.type)}>{renderItemWithIcon(item)}</TouchableOpacity>
    );
  };

  const renderItemWithIcon = (item: IMoreScreenItem): React.ReactElement => {
    return (
      <View key={`item-${item.id}`} style={styles.moreItem}>
        <View style={styles.iconAndText}>
          <Icon name={item.icon} size={22} color={item.iconColor} style={styles.iconPosition} />
          <Text
            type="small"
            textType="regular"
            style={[styles.itemText, { color: item.textColor }]}
            minimumFontScale={0.1}
            numberOfLines={2}
            allowFontScaling
          >
            {t(item.title)}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <GradientScreen isScrollable isUserHeader screenTitle={t('assetMore:more')} containerStyle={styles.container}>
      <MoreProfile headerContainerStyle={styles.profileContainer} onIconPress={onPressIcon} />
      <View style={styles.background}>
        {screenKeys.map((section: string, sectionCount: number): React.ReactElement => {
          const currentData: IMoreScreenItem[] = FFM_MORE_SCREEN[section];
          return (
            <React.Fragment key={sectionCount}>
              {currentData.map((item, index) => {
                return (
                  <React.Fragment key={index}>
                    {renderItem(item)}
                    {index !== currentData.length - 1 && renderSeparator()}
                  </React.Fragment>
                );
              })}
              {sectionCount !== screenKeys.length - 1 && <Divider containerStyles={styles.listSeparator} />}
            </React.Fragment>
          );
        })}
      </View>
    </GradientScreen>
  );
};

export default More;

const styles = StyleSheet.create({
  container: {
    padding: 0,
  },
  profileContainer: {
    flex: 0,
  },
  moreItem: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  itemText: {
    marginStart: 10,
  },
  divider: {
    borderColor: theme.colors.unreadNotification,
    borderWidth: 1,
    marginLeft: 65,
  },
  iconAndText: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconPosition: {
    paddingHorizontal: 5,
  },
  listSeparator: {
    borderColor: theme.colors.moreSeparator,
    borderWidth: 10,
  },
  background: {
    backgroundColor: theme.colors.white,
  },
});
