import React, { FC } from 'react';
import { StyleSheet, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useUp } from '@homzhub/common/src/utils/MediaQueryUtils';
import { NavigationService } from '@homzhub/web/src/services/NavigationService';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { RouteNames } from '@homzhub/web/src/router/RouteNames';
import { UserActions } from '@homzhub/common/src/modules/user/actions';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { IAuthCallback } from '@homzhub/common/src/modules/user/interface';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

interface INavProps {
  onMenuClose: () => void;
  selectedItem: number;
  updateSelectedItem: (item: number) => void;
}
interface IDispatchProps {
  logout: (payload: IAuthCallback) => void;
}

type Props = INavProps & IDispatchProps;

const MobileSideMenu: FC<Props> = (props: Props) => {
  const { onMenuClose, logout, selectedItem, updateSelectedItem } = props;
  const history = useHistory();
  const { t } = useTranslation(LocaleConstants.namespacesKey.landing);
  const mobileItems = [
    {
      id: 1,
      text: t('landing:home'),
      icon: icons.dashboard,
      url: RouteNames.protectedRoutes.DASHBOARD,
    },
    {
      id: 2,
      text: t('assetFinancial:financial'),
      icon: icons.barChartOutline,
      url: RouteNames.protectedRoutes.FINANCIALS,
    },
    {
      id: 3,
      text: t('common:properties'),
      icon: icons.portfolio,
      url: RouteNames.protectedRoutes.PORTFOLIO,
    },
    {
      id: 4,
      text: t('serviceTickets:serviceTickets'),
      icon: icons.serviceRequest,
      url: RouteNames.protectedRoutes.SERVICE_TICKETS,
    },
    {
      id: 5,
      text: t('assetMore:savedProperties'),
      icon: icons.heartOutline,
      url: RouteNames.protectedRoutes.SAVED_PROPERTIES,
    },
    {
      id: 6,
      text: t('assetMore:propertyVisits'),
      icon: icons.visit,
      url: RouteNames.protectedRoutes.PROPERTY_VISITS,
    },
    {
      id: 7,
      text: t('common:offers'),
      icon: icons.offers,
      url: RouteNames.protectedRoutes.OFFERS,
    },
    {
      id: 8,
      text: t('assetMore:notifications'),
      icon: icons.bell,
      url: RouteNames.protectedRoutes.NOTIFICATIONS,
    },
    {
      id: 9,
      text: t('assetMore:marketPlace'),
      icon: icons.settingOutline,
      url: RouteNames.protectedRoutes.VALUE_ADDED_SERVICES,
    },
    {
      id: 10,
      text: t('assetMore:settings'),
      icon: icons.gearFilled,
      url: RouteNames.protectedRoutes.SETTINGS,
    },
    {
      id: 11,
      text: t('common:logout'),
      icon: icons.logOut,
      url: RouteNames.publicRoutes.APP_BASE,
    },
  ];
  const menuItems = [...mobileItems];
  const onNavItemPress = (index: number): void => {
    const menuItem = menuItems[index];
    updateSelectedItem(menuItem.id);
    if (menuItem.text === t('common:logout') && menuItem.url === RouteNames.publicRoutes.APP_BASE) {
      onMenuClose();
      logout({
        callback: (status: boolean): void => {
          if (status) {
            NavigationService.navigate(history, { path: RouteNames.publicRoutes.APP_BASE });
          }
        },
      });
    } else {
      onMenuClose();
      NavigationService.navigate(history, { path: menuItems[index].url });
      setTimeout(() => {
        if (PlatformUtils.isWeb()) {
          window.scrollTo(0, 0);
        }
      }, 100);
    }
  };
  return (
    <>
      {menuItems.map((item, index) => {
        return (
          <NavItem
            key={item.text}
            item={item}
            isDisabled={false}
            isActive={selectedItem === item.id}
            onNavItemPress={onNavItemPress}
            index={index}
          />
        );
      })}
    </>
  );
};

interface IMenuItem {
  id: number;
  text: string;
  icon: string;
  url: string;
}
interface INavItem {
  item: IMenuItem;
  index: number;
  isActive: boolean;
  isDisabled: boolean;
  onNavItemPress: (index: number) => void;
}

const NavItem: FC<INavItem> = ({ item, index, isDisabled, isActive, onNavItemPress }: INavItem) => {
  const isLaptop = useUp(deviceBreakpoint.LAPTOP);
  const styles = navItemStyle(isLaptop, isActive);
  const itemPressed = (): void => {
    onNavItemPress(index);
  };
  return (
    <TouchableOpacity disabled={isDisabled} onPress={itemPressed} style={styles.container}>
      <View style={styles.itemContainer}>
        <View style={styles.itemWrapper}>
          <Icon name={item.icon} size={24} style={styles.iconStyle} />
          <Typography
            variant="text"
            size="small"
            fontWeight="regular"
            minimumFontScale={0.5}
            style={[styles.text, !isLaptop && styles.mobileText, isDisabled && styles.textDisabled]}
          >
            {item.text}
          </Typography>
        </View>
        <Icon name={icons.rightArrow} size={24} style={styles.iconStyle} />
      </View>
      <Divider containerStyles={[styles.activeNavItemBar, !isLaptop && styles.mobileActiveItem]} />
    </TouchableOpacity>
  );
};
interface INavItemStyle {
  container: ViewStyle;
  itemContainer: ViewStyle;
  activeNavItemBar: ViewStyle;
  mobileActiveItem: ViewStyle;
  text: TextStyle;
  mobileText: TextStyle;
  header: ViewStyle;
  textDisabled: TextStyle;
  itemWrapper: ViewStyle;
  iconStyle: ViewStyle;
}
const navItemStyle = (isLaptop: boolean, isActive: boolean): StyleSheet.NamedStyles<INavItemStyle> =>
  StyleSheet.create<INavItemStyle>({
    container: {
      marginTop: isLaptop ? 8 : 0,
      paddingLeft: !isLaptop ? 24 : 30,
      backgroundColor: isActive ? theme.colors.blueOpacity : theme.colors.white,
      borderLeftWidth: isActive ? 3 : 0,
      borderLeftColor: theme.colors.blue,
      borderRadius: 5,
    },
    itemContainer: {
      alignItems: 'center',
      justifyContent: 'space-between',
      flexDirection: 'row',
      paddingRight: 24,
    },
    text: {
      color: isActive ? theme.colors.primaryColor : theme.colors.darkTint4,
    },
    textDisabled: {
      color: theme.colors.darkTint8,
    },
    activeNavItemBar: {
      width: '100%',
      marginTop: 8,
      borderColor: theme.colors.primaryColor,
      opacity: isActive ? 1 : 0,
    },
    mobileActiveItem: {
      borderColor: theme.colors.background,
      marginTop: 0,
      opacity: 1,
      marginLeft: 40,
    },
    header: {
      backgroundColor: theme.colors.gray6,
      color: theme.colors.gray7,
      lineHeight: 80,
      paddingLeft: 18,
      textTransform: 'uppercase',
      letterSpacing: 1,
      width: '100%',
      alignItems: 'center',
    },
    mobileText: {
      lineHeight: 64,
      height: 64,
      paddingLeft: 16,
      color: isActive ? theme.colors.blue : theme.colors.darkTint4,
    },
    itemWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    iconStyle: {
      color: theme.colors.blue,
    },
  });
export const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { logout } = UserActions;
  return bindActionCreators(
    {
      logout,
    },
    dispatch
  );
};
export default connect(null, mapDispatchToProps)(MobileSideMenu);
