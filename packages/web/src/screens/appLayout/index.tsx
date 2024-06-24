import React, { FC, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { History } from 'history';
import { useUp, useDown } from '@homzhub/common/src/utils/MediaQueryUtils';
import { FunctionUtils } from '@homzhub/common/src/utils/FunctionUtils';
import { compareUrlsWithPathname } from '@homzhub/web/src/utils/LayoutUtils';
import MainRouter from '@homzhub/web/src/router/MainRouter';
import { RouteNames } from '@homzhub/web/src/router/RouteNames';
import { theme } from '@homzhub/common/src/styles/theme';
import { Navbar, NavigationInfo } from '@homzhub/web/src/components';
import Footer from '@homzhub/web/src/screens/appLayout/Footer';
import SideBar from '@homzhub/web/src/components/molecules/Drawer/BurgerMenu';
import MobileSideMenu from '@homzhub/web/src/screens/dashboard/components/MobileSideMenu';
import SideMenu from '@homzhub/web/src/screens/dashboard/components/SideMenu';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';
import {
  AppLayoutContext,
  IButtonActions,
  IFinancialsActions,
} from '@homzhub/web/src/screens/appLayout/AppLayoutContext';

interface IProps {
  location: LocationParams;
  history: History;
}

type LocationParams = { pathname: string };

const AppLayout: FC<IProps> = (props: IProps) => {
  const { location, history } = props;
  const { pathname } = location;
  const { protectedRoutes } = RouteNames;
  const {
    DASHBOARD,
    FINANCIALS,
    PORTFOLIO,
    VALUE_ADDED_SERVICES,
    SELECT_PROPERTY,
    SAVED_PROPERTIES,
    PROPERTY_VISITS,
    SETTINGS,
    NOTIFICATIONS,
    OFFERS,
    OFFERS_LISTED_PROPERTY,
  } = protectedRoutes;
  const isSideMenuVisible = compareUrlsWithPathname(
    [
      DASHBOARD,
      FINANCIALS,
      PORTFOLIO,
      VALUE_ADDED_SERVICES,
      SELECT_PROPERTY,
      SAVED_PROPERTIES,
      PROPERTY_VISITS,
      SETTINGS,
      NOTIFICATIONS,
      OFFERS,
      OFFERS_LISTED_PROPERTY,
    ],
    pathname
  );
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  const isTablet = useDown(deviceBreakpoint.TABLET);
  const [goBackClicked, setGoBackClicked] = useState(false);
  const [isMenuLoading, setIsMenuLoading] = useState(false);
  const isLaptop = useUp(deviceBreakpoint.LAPTOP);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(1);
  const [financialsActions, setFinancialsActions] = useState<IFinancialsActions>({
    financialsActionType: null,
    isOpen: false,
  });
  const [buttonGrpActions, setButtonGrpActions] = useState<IButtonActions>({
    isClicked: false,
  });

  const onMenuClose = (): void => {
    setIsMenuOpen(false);
  };

  const updateSelectedItem = (item: number): void => {
    setSelectedItem(item);
  };

  return (
    <AppLayoutContext.Provider
      value={{
        goBackClicked,
        setGoBackClicked,
        isMenuLoading,
        setIsMenuLoading,
        financialsActions,
        setFinancialsActions,
        buttonGrpActions,
        setButtonGrpActions,
      }}
    >
      <View style={styles.container}>
        <Navbar history={history} location={location} isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
        <NavigationInfo />
        <View>
          <View style={[styles.mainContent, isMobile && styles.mainContentMobile]}>
            {!isTablet && isSideMenuVisible && !isMenuLoading && <SideMenu onItemClick={FunctionUtils.noop} />}
            {!isLaptop && (
              <SideBar open={isMenuOpen} onClose={onMenuClose} page="dashboard">
                <MobileSideMenu
                  onMenuClose={onMenuClose}
                  selectedItem={selectedItem}
                  updateSelectedItem={updateSelectedItem}
                />
              </SideBar>
            )}
            <MainRouter />
          </View>
          <Footer />
        </View>
      </View>
    </AppLayoutContext.Provider>
  );
};

export default AppLayout;

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
  },
  mainContent: {
    minHeight: 'calc(100vh - 150px)',
    width: theme.layout.dashboardWidth,
    flexDirection: 'row',
    alignSelf: 'center',
    paddingBottom: '2%',
  },
  mainContentMobile: {
    width: theme.layout.dashboardMobileWidth,
  },
});
