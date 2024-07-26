import React, { FC, useState, useEffect } from "react";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import { useHistory } from "react-router-dom";
import { PopupActions } from "reactjs-popup/dist/types";
import { bindActionCreators, Dispatch } from "redux";
import { connect } from "react-redux";
import { TFunction } from "i18next";
import { useTranslation } from "react-i18next";
import ReactTooltip from "react-tooltip";
import { NavigationService } from "@homzhub/web/src/services/NavigationService";
import { RouteNames } from "@homzhub/web/src/router/RouteNames";
import { UserActions } from "@homzhub/common/src/modules/user/actions";
import Icon from "@homzhub/common/src/assets/icon";
import { theme } from "@homzhub/common/src/styles/theme";
import GetAppPopup from "@homzhub/web/src/components/molecules/GetAppPopup";
import { Hoverable } from "@homzhub/web/src/components/hoc/Hoverable";
import { IAuthCallback } from "@homzhub/common/src/modules/user/interface";
import { LocaleConstants } from "@homzhub/common/src/services/Localization/constants";
import {
  IMenuItemList,
  MenuItemList,
  sideMenuItems,
} from "@homzhub/common/src/constants/DashBoard";

interface IFormProps {
  onItemClick: (ItemId: number) => void;
}

interface IMenuItem {
  id: number;
  name: string;
  icon: string;
  url: string;
}

interface IDispatchProps {
  logout: (payload: IAuthCallback) => void;
}

type Props = IFormProps & IDispatchProps;

const SideMenu: FC<Props> = (props: Props) => {
  const { logout } = props;
  const history = useHistory();
  const {
    location: { pathname },
  } = history;
  const [selectedItem, setSelectedItem] = useState({
    id: 1,
    url: RouteNames.protectedRoutes.DASHBOARD,
  });
  useEffect(() => {
    for (let index = 0; index < MenuItemList.length; index++) {
      if (MenuItemList[index].url === pathname) {
        setSelectedItem({
          id: MenuItemList[index].id,
          url: MenuItemList[index].url,
        });
      }
    }
  }, [pathname]);

  const popupRefGetApp = React.createRef<PopupActions>();

  const onOpenModal = (): void => {
    if (popupRefGetApp.current && popupRefGetApp.current.open) {
      popupRefGetApp.current.open();
    }
  };

  const onCloseModal = (): void => {
    if (popupRefGetApp.current && popupRefGetApp.current.close) {
      popupRefGetApp.current.close();
    }
  };

  const { t } = useTranslation(LocaleConstants.namespacesKey.assetMore);
  const onItemPress = (item: IMenuItem): void => {
    const { id, url } = item;
    setSelectedItem({ id, url });
    if (item.name === sideMenuItems.logout) {
      logout({
        callback: (status: boolean): void => {
          if (status) {
            NavigationService.navigate(history, {
              path: RouteNames.publicRoutes.APP_BASE,
            });
          }
        },
      });
    } else if (
      item.name === sideMenuItems.bankDetails ||
      item.name === sideMenuItems.referAndEarn
    ) {
      onOpenModal();
    } else {
      NavigationService.navigate(history, { path: MenuItemList[id - 1].url });
    }
  };
  const isSelectedItem = (id: number): boolean =>
    selectedItem.id === id && selectedItem.url === pathname;
  return (
    <View style={styles.menu}>
      {MenuItemList.map((item, index) => {
        return renderMenuItem(item, t, isSelectedItem(item.id), onItemPress);
      })}
      <Text>hello</Text>
      <GetAppPopup
        popupRef={popupRefGetApp}
        onOpenModal={onOpenModal}
        onCloseModal={onCloseModal}
      />
    </View>
  );
};

const renderMenuItem = (
  item: IMenuItemList,
  t: TFunction,
  isActive: boolean,
  onItemPress: (item: IMenuItem) => void
): React.ReactNode => {
  const { menuItem, hoveredItem, activeBar, iconStyle } = styles;
  const iconColor = (isActiveColor: boolean): string => {
    const { error, blue, darkTint4 } = theme.colors;
    return item.name === sideMenuItems.logout
      ? error
      : isActiveColor
      ? blue
      : darkTint4;
  };
  let setTooltipTimeout: number;
  const TOOLTIP_TIMEOUT = 2000;

  const hideTooltip = (): void => {
    setTooltipTimeout = setTimeout(ReactTooltip.hide, TOOLTIP_TIMEOUT);
  };

  const clearTooltipTimeout = (): void => {
    ReactTooltip.hide();
    clearTimeout(setTooltipTimeout);
  };

  const onMenuItemPress = (): void => onItemPress(item);

  return (
    <Hoverable onHoverOut={clearTooltipTimeout} key={item.id}>
      {(isHovered: boolean): React.ReactNode => (
        <TouchableOpacity
          data-tip
          data-for={item.name}
          activeOpacity={100}
          onPress={onMenuItemPress}
          style={[menuItem, (isHovered || isActive) && hoveredItem]}
        >
          <View style={[activeBar, isActive && { opacity: 100 }]} />
          <Icon
            name={item.icon}
            color={iconColor(isHovered || isActive)}
            size={24}
            style={iconStyle}
          />
          <ReactTooltip
            id={item.name}
            afterShow={hideTooltip}
            place="right"
            effect="solid"
            resizeHide={isHovered}
          >
            <Text style={styles.hoverText}>{t(`${item.name}`)}</Text>
          </ReactTooltip>
        </TouchableOpacity>
      )}
    </Hoverable>
  );
};

const styles = StyleSheet.create({
  menu: {
    width: 60,
    flexDirection: "column",
    alignSelf: "flex-start",
    paddingVertical: theme.layout.screenPadding,
    marginRight: 24,
    borderRadius: 4,
    backgroundColor: theme.colors.white,
    zIndex: 1200,
  },
  menuItem: {
    position: "relative",
    flexDirection: "row",
    width: "100%",
    height: 40,
    backgroundColor: theme.colors.white,
  },
  hoveredItem: {
    backgroundColor: theme.colors.blueOpacity,
  },
  activeBar: {
    opacity: 0,
    width: 3,
    borderBottomRightRadius: 100,
    borderTopRightRadius: 100,
    backgroundColor: theme.colors.primaryColor,
  },
  iconStyle: {
    alignSelf: "center",
    marginHorizontal: "auto",
  },
  hoverText: {
    color: theme.colors.white,
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
export default connect(null, mapDispatchToProps)(SideMenu);
