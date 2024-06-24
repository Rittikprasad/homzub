import React, { FC, useState } from 'react';
import { ImageStyle, StyleSheet, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { History } from 'history';
import { NavigationService } from '@homzhub/web/src/services/NavigationService';
import { useDown } from '@homzhub/common/src/utils/MediaQueryUtils';
import { compareUrlsWithPathname } from '@homzhub/web/src/utils/LayoutUtils';
import { UserActions } from '@homzhub/common/src/modules/user/actions';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import NavLogo from '@homzhub/common/src/assets/images/appLogoWithName.svg';
import HomzhubLogo from '@homzhub/common/src/assets/images/homzhubLogo.svg';
import { RouteNames } from '@homzhub/web/src/router/RouteNames';
import { StickyHeader } from '@homzhub/web/src/components/hoc/StickyHeader';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import Popover from '@homzhub/web/src/components/atoms/Popover';
import { Avatar } from '@homzhub/common/src/components/molecules/Avatar';
import GoogleSearchBar from '@homzhub/web/src/components/molecules/GoogleSearchBar';
import { UserProfile as UserProfileModel } from '@homzhub/common/src/domain/models/UserProfile';
import { IAuthCallback } from '@homzhub/common/src/modules/user/interface';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

interface INavItem {
  icon: string;
  text: string;
  index: number;
  isActive: boolean;
  onNavItemPress: (index: number) => void;
}
interface IDispatchProps {
  logout: (payload: IAuthCallback) => void;
}

interface IStateProps {
  userProfile: UserProfileModel;
}
const NavItem: FC<INavItem> = ({ icon, text, index, isActive, onNavItemPress }: INavItem) => {
  const isTablet = useDown(deviceBreakpoint.TABLET);
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  const navItemStyles = navItemStyle(isMobile, isActive);
  const { darkTint3, primaryColor } = theme.colors;
  const itemPressed = (): void => {
    onNavItemPress(index);
  };
  return (
    <TouchableOpacity onPress={itemPressed} style={navItemStyles.container}>
      <Icon name={icon} size={22} color={isActive ? primaryColor : darkTint3} style={navItemStyles.icon} />
      {!isTablet && (
        <Label type="large" textType="regular" minimumFontScale={0.5} style={navItemStyles.text}>
          {text}
        </Label>
      )}
    </TouchableOpacity>
  );
};
type LocationParams = { pathname: string };
interface IProps {
  location: LocationParams;
  history: History;
  setIsMenuOpen: (value: boolean) => void;
  isMenuOpen: boolean;
}
type NavbarProps = IDispatchProps & IProps & IStateProps;
const Navbar: FC<NavbarProps> = (props: NavbarProps) => {
  const { t } = useTranslation();
  const { location, history, userProfile, setIsMenuOpen, isMenuOpen } = props;
  const isDesktop = useDown(deviceBreakpoint.DESKTOP);
  const isTablet = useDown(deviceBreakpoint.TABLET);
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  const [isSelected, setIsSelected] = useState(-1);
  const navBarStyles = navBarStyle(isMobile, isTablet, isDesktop);
  const navItems = [
    {
      icon: icons.headset,
      text: t('assetMore:support'),
      url: RouteNames.protectedRoutes.HELP_SUPPORT,
    },
    // { enable later
    //   icon: icons.refer,
    //   text: t('assetMore:refer'),
    //   url: RouteNames.protectedRoutes.REFER_EARN,
    // },
  ];

  const onNavItemPress = (index: number): void => {
    setIsSelected(index);
    NavigationService.navigate(history, { path: navItems[index].url });
  };
  const popOverContentStyle = {
    height: 40,
    marginTop: 24,
    width: '90%',
    marginLeft: 16,
  };

  const popoverContent = (): React.ReactElement => {
    return (
      <View style={navBarStyles.searchBarContainer}>
        <GoogleSearchBar />
      </View>
    );
  };
  const navigateToScreen = (): void => {
    NavigationService.navigate(history, { path: RouteNames.protectedRoutes.DASHBOARD });
  };
  const navigateToProfile = (): void => {
    NavigationService.navigate(history, { path: RouteNames.protectedRoutes.PROFILE });
  };
  const { SEARCH_PROPERTY } = RouteNames.protectedRoutes;
  const isSearchBarVisible = !compareUrlsWithPathname([SEARCH_PROPERTY], location.pathname);
  return (
    <StickyHeader>
      <View style={navBarStyles.container}>
        <View style={navBarStyles.subContainer}>
          {isTablet && (
            <Button
              type="primary"
              icon={icons.hamburgerMenu}
              iconSize={22}
              iconColor={theme.colors.darkTint6}
              containerStyle={navBarStyles.menuIc}
              onPress={(): void => setIsMenuOpen(!isMenuOpen)}
            />
          )}
          <TouchableOpacity onPress={navigateToScreen}>
            <View style={navBarStyles.logo}>{isMobile ? <HomzhubLogo /> : <NavLogo />}</View>
          </TouchableOpacity>
          {isSearchBarVisible && (
            <View style={navBarStyles.search}>
              {!isMobile ? (
                <GoogleSearchBar />
              ) : (
                <Popover
                  content={popoverContent()}
                  popupProps={{
                    on: 'click',
                    arrow: false,
                    closeOnDocumentClick: true,
                    children: undefined,
                    contentStyle: popOverContentStyle,
                    className: 'my-Popup',
                  }}
                >
                  <Button
                    type="primary"
                    icon={icons.search}
                    iconSize={22}
                    iconColor={theme.colors.darkTint6}
                    containerStyle={navBarStyles.searchIc}
                    testID="btnSearch"
                  />
                </Popover>
              )}
            </View>
          )}
          <View style={navBarStyles.itemsContainer}>
            {navItems.map((item, index) => (
              <NavItem
                key={item.icon}
                icon={item.icon}
                text={item.text}
                isActive={isSelected === index}
                onNavItemPress={onNavItemPress}
                index={index}
              />
            ))}
            <TouchableOpacity onPress={navigateToProfile}>
              <View style={navBarStyles.items}>
                <Avatar isOnlyAvatar fullName={userProfile?.name ?? 'User'} image={userProfile?.profilePicture ?? ''} />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </StickyHeader>
  );
};
interface INavBarStyle {
  container: ViewStyle;
  subContainer: ViewStyle;
  logo: ViewStyle;
  search: ViewStyle;
  itemsContainer: ViewStyle;
  items: ViewStyle;
  menuIc: ViewStyle;
  searchIc: ViewStyle;
  searchBarContainer: ViewStyle;
}
const navBarStyle = (isMobile: boolean, isTablet: boolean, isDesktop: boolean): StyleSheet.NamedStyles<INavBarStyle> =>
  StyleSheet.create<INavBarStyle>({
    container: {
      width: '100%',
      backgroundColor: theme.colors.white,
      alignItems: 'center',
      shadowColor: theme.colors.shadow,
      shadowOpacity: 0.04,
      shadowRadius: 4,
      shadowOffset: {
        width: 0,
        height: 4,
      },
    },
    subContainer: {
      width: isMobile ? theme.layout.dashboardMobileWidth : theme.layout.dashboardWidth,
      flexDirection: 'row',
      paddingVertical: 4,
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    logo: {
      marginRight: 16,
    },
    search: {
      flex: 1,
      maxWidth: 403,
      marginRight: isTablet ? 0 : isDesktop ? '4%' : '10%',
      marginLeft: isTablet ? 0 : isDesktop ? '2%' : '7%',
      alignItems: isTablet ? 'flex-end' : undefined,
    },
    itemsContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
    items: {
      marginLeft: isMobile ? 0 : 30,
      flexDirection: 'row',
      alignItems: 'center',
    },
    menuIc: {
      marginRight: isMobile ? 8 : 24,
      backgroundColor: theme.colors.secondaryColor,
    },
    searchIc: {
      marginRight: 12,
      backgroundColor: theme.colors.secondaryColor,
    },
    searchBarContainer: {
      justifyContent: 'center',
      marginTop: 6,
    },
  });
interface INavItemStyle {
  container: ViewStyle;
  text: TextStyle;
  icon: ImageStyle;
}
const navItemStyle = (isMobile: boolean, isActive: boolean): StyleSheet.NamedStyles<INavItemStyle> =>
  StyleSheet.create<INavItemStyle>({
    container: {
      marginLeft: isMobile ? 0 : 30,
      flexDirection: 'row',
      alignItems: 'center',
    },
    text: {
      color: isActive ? theme.colors.primaryColor : theme.colors.darkTint4,
    },
    icon: {
      margin: 12,
    },
  });
const mapStateToProps = (state: IState): IStateProps => {
  const { getUserProfile } = UserSelector;
  return {
    userProfile: getUserProfile(state),
  };
};
export const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { logout } = UserActions;
  return bindActionCreators(
    {
      logout,
    },
    dispatch
  );
};
export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
