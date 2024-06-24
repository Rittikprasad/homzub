import React, { FC, useRef, useState, useEffect } from 'react';
import { StyleSheet, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { PopupActions } from 'reactjs-popup/dist/types';
import { useHistory } from 'react-router-dom';
import { useDown, useOnly, useUp } from '@homzhub/common/src/utils/MediaQueryUtils';
import { NavigationService } from '@homzhub/web/src/services/NavigationService';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { compareUrlsWithPathname } from '@homzhub/web/src/utils/LayoutUtils';
import { RouteNames } from '@homzhub/web/src/router/RouteNames';
import { theme } from '@homzhub/common/src/styles/theme';
import { icons } from '@homzhub/common/src/assets/icon';
import NavLogo from '@homzhub/common/src/assets/images/appLogoWithName.svg';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { StickyHeader } from '@homzhub/web/src/components';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { Image } from '@homzhub/common/src/components/atoms/Image';
import Popover from '@homzhub/web/src/components/atoms/Popover';
import SideBar from '@homzhub/web/src/components/molecules/Drawer/BurgerMenu';
import LimitedOfferPopUp from '@homzhub/web/src/screens/microSite/components/LimitedOfferPopUp';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

interface IProps {
  storeLinksSectionRef?: any;
  membershipPlan?: boolean;
}
interface INavProps {
  storeLinksSectionRef?: any;
  onMenuClose: () => void;
  openModal?: () => void;
  membershipPlan?: boolean;
}
const LandingNavBar: FC<IProps> = (props: IProps) => {
  const [scrollLength, setScrollLength] = useState(0);
  const popupRef = useRef<PopupActions>(null);

  useEffect(() => {
    if (scrollLength > 0) {
      window.scrollTo({
        top: scrollLength,
        left: 0,
        behavior: 'smooth',
      });
    }
    setScrollLength(0);
  }, [scrollLength]);
  const history = useHistory();
  const {
    location: { pathname },
  } = history;
  const { publicRoutes } = RouteNames;
  const { APP_BASE } = publicRoutes;
  const isMenuVisible = compareUrlsWithPathname([APP_BASE], pathname);
  const { storeLinksSectionRef, membershipPlan = false } = props;
  const { t } = useTranslation();
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  const isLaptop = useUp(deviceBreakpoint.LAPTOP);
  const styles = navBarStyle(isMobile);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const banner = {
    width: 205,
    height: 50,
    right: 18,
  };

  const onMenuClose = (): void => {
    setIsMenuOpen(false);
  };
  const onMenuOpen = (): void => {
    setIsMenuOpen(true);
  };
  const navigateToScreen = (path: string): void => {
    NavigationService.navigate(history, { path });
    setTimeout(() => {
      if (PlatformUtils.isWeb()) {
        window.scrollTo(0, 0);
      }
    }, 100);
  };
  const onButtonScrollPress = (): void => {
    if (storeLinksSectionRef) {
      storeLinksSectionRef.measure((x: number, y: number) => {
        setScrollLength(Math.floor(y));
      });
    }
  };
  const containerStyle = {
    width: !isMobile ? 450 : '95%',
  };
  const handlePopupClose = (): void => {
    if (popupRef && popupRef.current) {
      popupRef.current.close();
    }
  };
  const openModal = (): void => {
    if (popupRef && popupRef.current) {
      popupRef.current.open();
    }
  };
  return (
    <>
      <StickyHeader>
        <View style={styles.container}>
          <View style={styles.content}>
            <View style={styles.subContainer}>
              <TouchableOpacity onPress={(): void => navigateToScreen(RouteNames.publicRoutes.APP_BASE)}>
                <View style={styles.logo}>
                  <NavLogo />
                </View>
              </TouchableOpacity>
              {isLaptop && isMenuVisible && !membershipPlan && <RenderNavItems onMenuClose={onMenuClose} />}
            </View>

            {isLaptop ? (
              <View style={styles.subContainer}>
                {!isMenuVisible && !membershipPlan && (
                  <TouchableOpacity onPress={openModal}>
                    <View>
                      <Image
                        source={require('@homzhub/common/src/assets/images/healthCheckButton.svg')}
                        style={banner}
                      />
                    </View>
                  </TouchableOpacity>
                )}
                {!membershipPlan && (
                  <Button
                    type="primary"
                    textType="label"
                    textSize="large"
                    title={t('landing:downloadApp')}
                    containerStyle={styles.downloadButton}
                    titleStyle={styles.downloadButtonTitle}
                    onPress={onButtonScrollPress}
                  />
                )}
                <Button
                  type="text"
                  fontType="regular"
                  title={t('login')}
                  onPress={(): void => navigateToScreen(RouteNames.publicRoutes.LOGIN)}
                />
                <Button
                  type="primary"
                  title={t('signUp')}
                  onPress={(): void => navigateToScreen(RouteNames.publicRoutes.SIGNUP)}
                />
              </View>
            ) : (
              <View style={styles.tabViewHeader}>
                {!isMobile && !isMenuVisible && !membershipPlan && (
                  <TouchableOpacity onPress={openModal}>
                    <View>
                      <Image
                        source={require('@homzhub/common/src/assets/images/healthCheckButton.svg')}
                        style={banner}
                      />
                    </View>
                  </TouchableOpacity>
                )}
                <Button
                  type="text"
                  icon={icons.hamburgerMenu}
                  iconSize={30}
                  iconColor={theme.colors.darkTint2}
                  onPress={onMenuOpen}
                />
              </View>
            )}
          </View>
          <Popover
            forwardedRef={popupRef}
            content={<LimitedOfferPopUp handlePopupClose={handlePopupClose} />}
            popupProps={{
              closeOnDocumentClick: true,
              children: undefined,
              modal: true,
              onClose: handlePopupClose,
              contentStyle: containerStyle,
            }}
          />
        </View>
      </StickyHeader>
      {!isLaptop && (
        <SideBar open={isMenuOpen} onClose={onMenuClose} menuProps={{ right: true }} page="landing">
          <RenderNavItems
            storeLinksSectionRef={storeLinksSectionRef}
            onMenuClose={onMenuClose}
            openModal={openModal}
            membershipPlan={membershipPlan}
          />
        </SideBar>
      )}
    </>
  );
};
const RenderNavItems: FC<INavProps> = (props: INavProps) => {
  const { storeLinksSectionRef, onMenuClose, openModal, membershipPlan } = props;
  const [isSelected, setIsSelected] = useState(0);
  const [scrollLength, setScrollLength] = useState(0);
  const history = useHistory();
  const {
    location: { pathname },
  } = history;
  const { publicRoutes } = RouteNames;
  const { APP_BASE } = publicRoutes;
  const isMenuVisible = compareUrlsWithPathname([APP_BASE], pathname);
  // const history = useHistory(); TODO: Lakshit: Remove once Landing Page is Updated.
  // To scroll to the appropriate section when clicked.
  useEffect(() => {
    if (scrollLength > 0) {
      window.scrollTo({
        top: scrollLength,
        left: 0,
        behavior: 'smooth',
      });
    }
    setScrollLength(0);
  }, [scrollLength]);
  const { t } = useTranslation(LocaleConstants.namespacesKey.landing);
  const isLaptop = useUp(deviceBreakpoint.LAPTOP);
  const isTablet = useOnly(deviceBreakpoint.TABLET);
  const styles = navItemStyle(isLaptop, false);
  const mobileItems = [
    {
      text: t('landing:downloadApp'),
      url: RouteNames.publicRoutes.APP_BASE,
      disabled: false,
    },
  ];
  const login = [
    {
      text: t('common:login'),
      url: RouteNames.publicRoutes.LOGIN,
      disabled: false,
    },
    {
      text: t('common:signUp'),
      url: RouteNames.publicRoutes.SIGNUP,
      disabled: false,
    },
  ];
  const healthCheckItem = [
    {
      text: t('microSite:freePropertyHealthCheck'),
      url: RouteNames.publicRoutes.APP_BASE,
      disabled: false,
    },
  ];
  let menuItems = isLaptop ? [] : [...mobileItems, ...login];
  if (!isMenuVisible) {
    menuItems = !membershipPlan
      ? !isTablet
        ? [...healthCheckItem, ...mobileItems, ...login]
        : [...mobileItems, ...login]
      : [...login];
  }
  const onNavItemPress = (index: number): void => {
    setIsSelected(index);
    if (menuItems[index].text === t('microSite:freePropertyHealthCheck')) {
      if (openModal) {
        onMenuClose();

        openModal();
      }
    }
    if (menuItems[index].text === t('landing:downloadApp')) {
      if (storeLinksSectionRef) {
        storeLinksSectionRef.measure((x: number, y: number) => {
          setScrollLength(Math.floor(y));
          onMenuClose();
        });
      }
    }
    if (menuItems[index].url !== RouteNames.publicRoutes.APP_BASE) {
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
      {!isLaptop && (
        <View style={styles.container}>
          <Typography variant="text" size="small" fontWeight="regular" style={styles.header}>
            {t('menu')}
          </Typography>
        </View>
      )}
      {menuItems.map((item, index) => {
        return (
          <NavItem
            key={item.text}
            text={item.text}
            isDisabled={item.disabled}
            isActive={isSelected === index}
            onNavItemPress={onNavItemPress}
            index={index}
            isMenuVisible={isMenuVisible}
          />
        );
      })}
    </>
  );
};
interface INavItem {
  text: string;
  index: number;
  isActive: boolean;
  isDisabled: boolean;
  onNavItemPress: (index: number) => void;
  isMenuVisible: boolean;
}
const NavItem: FC<INavItem> = ({ text, index, isDisabled, isActive, onNavItemPress, isMenuVisible }: INavItem) => {
  const isLaptop = useUp(deviceBreakpoint.LAPTOP);
  const styles = navItemStyle(isLaptop, isActive);
  const itemPressed = (): void => {
    onNavItemPress(index);
  };
  return (
    <TouchableOpacity disabled={isDisabled} onPress={itemPressed} style={styles.container}>
      <Typography
        variant="text"
        size="small"
        fontWeight="regular"
        minimumFontScale={0.5}
        style={[styles.text, !isLaptop && styles.mobileText, isDisabled && styles.textDisabled]}
      >
        {text}
      </Typography>
      <Divider containerStyles={[styles.activeNavItemBar, !isLaptop && styles.mobileActiveItem]} />
    </TouchableOpacity>
  );
};
interface INavBarStyle {
  container: ViewStyle;
  subContainer: ViewStyle;
  content: ViewStyle;
  logo: ViewStyle;
  downloadButton: ViewStyle;
  downloadButtonTitle: ViewStyle;
  tabViewHeader: ViewStyle;
}
const navBarStyle = (isMobile: boolean): StyleSheet.NamedStyles<INavBarStyle> =>
  StyleSheet.create<INavBarStyle>({
    container: {
      width: '100%',
      backgroundColor: theme.colors.white,
      alignItems: 'center',
      shadowColor: theme.colors.shadow,
      shadowOpacity: 0.12,
      shadowRadius: 8,
      shadowOffset: {
        width: 0,
        height: 4,
      },
    },
    subContainer: {
      flexDirection: 'row',
    },

    content: {
      width: isMobile ? theme.layout.dashboardMobileWidth : theme.layout.dashboardWidth,
      flexDirection: 'row',
      paddingVertical: 24,
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    logo: {
      marginRight: 16,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    downloadButton: {
      backgroundColor: theme.colors.blueOpacity,
    },
    downloadButtonTitle: {
      color: theme.colors.blue,
    },
    tabViewHeader: {
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
    },
  });
interface INavItemStyle {
  container: ViewStyle;
  activeNavItemBar: ViewStyle;
  mobileActiveItem: ViewStyle;
  text: TextStyle;
  mobileText: TextStyle;
  header: ViewStyle;
  textDisabled: TextStyle;
}
const navItemStyle = (isLaptop: boolean, isActive: boolean): StyleSheet.NamedStyles<INavItemStyle> =>
  StyleSheet.create<INavItemStyle>({
    container: {
      marginTop: isLaptop ? 8 : 0,
      marginLeft: !isLaptop ? 0 : 30,
      alignItems: isLaptop ? 'center' : 'flex-start',
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
      borderColor: theme.colors.darkTint12,
      opacity: 1,
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
      color: theme.colors.darkTint4,
    },
  });
export default React.memo(LandingNavBar);
