import React, {
  FC,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { StyleSheet, View } from "react-native";
import { useHistory, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { uniqBy } from "lodash";
import { PopupActions, PopupProps } from "reactjs-popup/dist/types";
import { useDown, useUp } from "@homzhub/common/src/utils/MediaQueryUtils";
import { NavigationService } from "@homzhub/web/src/services/NavigationService";
import { AnalyticsService } from "@homzhub/common/src/services/Analytics/AnalyticsService";
import { AppLayoutContext } from "@homzhub/web/src/screens/appLayout/AppLayoutContext";
import { theme } from "@homzhub/common/src/styles/theme";
import Icon, { icons } from "@homzhub/common/src/assets/icon";
import { useDispatch, useSelector } from "react-redux";
import { UserActions } from "@homzhub/common/src/modules/user/actions";
import { UserSelector } from "@homzhub/common/src/modules/user/selectors";
import { CommonSelectors } from "@homzhub/common/src/modules/common/selectors";
import { Button } from "@homzhub/common/src/components/atoms/Button";
import { Typography } from "@homzhub/common/src/components/atoms/Typography";
import Popover from "@homzhub/web/src/components/atoms/Popover";
import BreadCrumbs from "@homzhub/web/src/components/molecules/BreadCrumbs";
import PopupMenuOptions, {
  IPopupOptions,
} from "@homzhub/web/src/components/molecules/PopupMenuOptions";
import { deviceBreakpoint } from "@homzhub/common/src/constants/DeviceBreakpoints";
import { RouteNames } from "@homzhub/web/src/router/RouteNames";
import { Asset } from "@homzhub/common/src/domain/models/Asset";
import { Country } from "@homzhub/common/src/domain/models/Country";
import { Currency } from "@homzhub/common/src/domain/models/Currency";
import { pageTitles } from "@homzhub/web/src/components/molecules/NavigationInfo/constants";
import { EventType } from "@homzhub/common/src/services/Analytics/EventType";
import "@homzhub/web/src/components/molecules/NavigationInfo/NavigationInfo.scss";
import { AddPropertyStack } from "@homzhub/web/src/screens/addProperty";
import { FinancialsActions } from "@homzhub/web/src/screens/financials/FinancialsPopover";

const humanize = (str: string, state: any): string => {
  const { params } = { ...state, params: state?.params || null };
  const splicedStr = str.split("/");
  const page = params
    ? splicedStr[splicedStr.length - 2]
    : splicedStr[splicedStr.length - 1];

  if (pageTitles[page]) return pageTitles[page];
  return page.replace("/", "").replace(/^[a-z]/, (m) => m.toUpperCase());
};

interface IQuickActions extends IPopupOptions {
  route: string;
}

interface ICurrencyOption extends IPopupOptions {
  currency: Currency;
}

const quickActionOptions: IQuickActions[] = [
  {
    icon: icons.portfolioFilled,
    label: "Add Property",
    route: RouteNames.protectedRoutes.ADD_PROPERTY,
  },
];

const getCountryList = (assets: Asset[]): Country[] => {
  return uniqBy(
    assets.map((asset) => asset.country),
    "id"
  );
};

const defaultDropDownProps = (width: string): PopupProps => ({
  position: "bottom right" as "bottom right",
  on: ["click" as "click"],
  arrow: false,
  contentStyle: { minWidth: width, marginTop: "4px", alignItems: "stretch" },
  closeOnDocumentClick: true,
  children: undefined,
});

const DashBoardActionsGrp: FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  const popupRef = useRef<PopupActions>(null);
  const history = useHistory();
  const selectedCountry = useSelector(UserSelector.getUserCountryCode);
  const [selectedCurrency, setSelectedCurrency] = useState<ICurrencyOption>();
  const assets: Asset[] = useSelector(UserSelector.getUserAssets);
  const userCurrency: Currency = useSelector(UserSelector.getCurrency);
  const countriesList: Country[] = useSelector(CommonSelectors.getCountryList);
  useEffect(() => {
    const defaultCurrencyOption = {
      label: `${userCurrency.currencyCode} ${userCurrency.currencySymbol}`,
      currency: userCurrency,
    };
    setSelectedCurrency(defaultCurrencyOption);
  }, [userCurrency]);
  const currencyOptions = useCallback((): ICurrencyOption[] => {
    return countriesList.map((item) => {
      const { currencyCode, currencySymbol } = item.currencies[0];
      return {
        label: `${currencyCode} ${currencySymbol}`,
        currency: item.currencies[0],
      };
    });
  }, [countriesList]);
  const countryList = getCountryList(assets);
  const countryOptions = useCallback((): IPopupOptions[] => {
    const options = countryList.map((item) => ({
      label: item.name,
      value: item.id,
    }));
    return [{ label: t("common:all"), value: 0 }, ...options];
  }, [countryList, t]);
  const closePopup = (): void => {
    if (popupRef && popupRef.current) {
      popupRef.current.close();
    }
  };
  const onMenuItemClick = (option: IQuickActions): void => {
    closePopup();
    if (option.label === "Add Property") {
      AnalyticsService.track(EventType.AddPropertyInitiation);
    }
    NavigationService.navigate(history, {
      path: option.route,
      params: {
        currentScreen: AddPropertyStack.AddPropertyLocationScreen,
      },
    });
  };
  const onCurrencyOptionSelect = (option: ICurrencyOption): void => {
    setSelectedCurrency(option);
    dispatch(
      UserActions.updateUserPreferences({
        currency: option.currency.currencyCode,
      })
    );
    closePopup();
  };
  const onCountryOptionSelect = (option: IPopupOptions): void => {
    dispatch(UserActions.setUserCountryCode(option.value as number));
    closePopup();
  };
  const styles = dashBoardActionStyles;
  const selectedCountryIndex = countryList.findIndex(
    (data) => data.id === selectedCountry
  );
  const countryImage = (): React.ReactElement =>
    countryList[selectedCountryIndex].flag;
  const countryName =
    selectedCountry !== 0
      ? countryList[selectedCountryIndex].name
      : t("common:all");
  const isVisible = false;
  return (
    <View style={[styles.buttonsGrp, isMobile && styles.buttonsGrpMobile]}>
      {isVisible && (
        <Popover
          forwardedRef={popupRef}
          content={
            <PopupMenuOptions
              options={countryOptions()}
              onMenuOptionPress={onCountryOptionSelect}
            />
          }
          popupProps={defaultDropDownProps("100px")}
        >
          <Button
            onPress={() => {
              popupRef.current?.toggle();
            }}
            type="secondaryOutline"
            containerStyle={[
              styles.button,
              isMobile && styles.countryBtnMobile,
            ]}
          >
            {selectedCountry === 0 ? (
              <Icon
                name={icons.earthFilled}
                size={22}
                color={theme.colors.white}
                style={styles.flagStyle}
              />
            ) : (
              countryImage()
            )}
            {!isMobile && (
              <Typography
                variant="label"
                size="large"
                style={styles.buttonTitle}
              >
                {countryName}
              </Typography>
            )}
            <Icon name={icons.downArrow} color={theme.colors.white} />
          </Button>
        </Popover>
      )}
      {isVisible && (
        <Popover
          forwardedRef={popupRef}
          content={
            <PopupMenuOptions
              options={currencyOptions()}
              onMenuOptionPress={onCurrencyOptionSelect}
            />
          }
          popupProps={defaultDropDownProps("88px")}
        >
          <Button
            onPress={() => {
              popupRef.current?.toggle();
            }}
            type="secondaryOutline"
            containerStyle={styles.button}
          >
            <Typography variant="label" size="large" style={styles.buttonTitle}>
              {!isMobile
                ? selectedCurrency?.label
                : selectedCurrency?.currency.currencySymbol}
            </Typography>
            <Icon name={icons.downArrow} color={theme.colors.white} />
          </Button>
        </Popover>
      )}
      <View
        style={[
          styles.addBtnContainer,
          isMobile && styles.addBtnContainerMobile,
        ]}
      >
        <Popover
          forwardedRef={popupRef}
          content={
            <PopupMenuOptions
              options={quickActionOptions}
              onMenuOptionPress={onMenuItemClick}
            />
          }
          popupProps={defaultDropDownProps("fitContent")}
        >
          <Button
            onPress={() => {
              popupRef.current?.toggle();
            }}
            type="secondary"
            containerStyle={[styles.button, styles.addBtn]}
          >
            <Icon
              name={icons.plus}
              color={theme.colors.primaryColor}
              style={styles.buttonIconRight}
            />
            <Typography
              variant="label"
              size="large"
              style={styles.buttonBlueTitle}
            >
              {t("addCamelCase")}
            </Typography>
          </Button>
        </Popover>
      </View>
    </View>
  );
};

const GoBackCustomAction: FC = () => {
  const { t } = useTranslation();
  const styles = goBackActionStyles;
  const { setGoBackClicked } = useContext(AppLayoutContext);
  const onGoBackPress = (): void => {
    setGoBackClicked(true);
  };
  return (
    <Button
      type="secondary"
      containerStyle={[styles.button, styles.addBtn]}
      onPress={onGoBackPress}
    >
      <Icon
        name={icons.dartBack}
        color={theme.colors.white}
        style={styles.buttonIconRight}
      />
      <Typography variant="label" size="large" style={styles.buttonBlueTitle}>
        {t("backText")}
      </Typography>
    </Button>
  );
};

const AddPropertyAction: FC = () => {
  const { t } = useTranslation();
  const styles = dashBoardActionStyles;
  const history = useHistory();
  const onAddProperty = (): void => {
    AnalyticsService.track(EventType.AddPropertyInitiation);
    NavigationService.navigate(history, {
      path: RouteNames.protectedRoutes.PORTFOLIO_ADD_PROPERTY,
      params: {
        currentScreen: AddPropertyStack.AddPropertyLocationScreen,
      },
    });
  };
  return (
    <Button
      type="secondary"
      containerStyle={[styles.button, styles.addBtn]}
      onPress={onAddProperty}
    >
      <Icon
        name={icons.portfolioFilled}
        size={22}
        color={theme.colors.primaryColor}
        style={styles.buttonIconRight}
      />
      <Typography variant="label" size="large" style={styles.buttonBlueTitle}>
        {t("property:addProperty")}
      </Typography>
    </Button>
  );
};

const FinancialsActionGrp: FC = () => {
  const { t } = useTranslation();
  const styles = buttonGrpStyles;
  const { setFinancialsActions } = useContext(AppLayoutContext);
  const onPressAction = (actionType: FinancialsActions): void => {
    setFinancialsActions({
      financialsActionType: actionType,
      isOpen: true,
    });
  };
  return (
    <View style={styles.container}>
      <Button
        type="primary"
        containerStyle={[styles.buttonTertiary]}
        onPress={(): void => onPressAction(FinancialsActions.AddReminder)}
        icon={icons.calendar}
        title={t("assetFinancial:addReminder")}
        iconColor={theme.colors.white}
        iconSize={25}
        textStyle={styles.buttonTextStyle}
      />
      <Button
        type="secondary"
        containerStyle={[styles.buttonItem, styles.buttonSecondary]}
        onPress={(): void => onPressAction(FinancialsActions.AddRecord)}
        icon={icons.docFilled}
        title={t("assetFinancial:addRecord")}
        iconColor={theme.colors.primaryColor}
        iconSize={25}
        textStyle={styles.buttonTextStyle}
      />
      <Button
        type="secondary"
        containerStyle={[styles.buttonItem, styles.buttonSecondary]}
        onPress={(): void =>
          onPressAction(FinancialsActions.PropertyPayment_SelectProperties)
        }
        icon={icons.propertyPayment}
        title={t("propertyPayment:propertyPayment")}
        iconColor={theme.colors.primaryColor}
        iconSize={25}
        textStyle={styles.buttonTextStyle}
      />
    </View>
  );
};

const ValueAddedActionGrp: FC = () => {
  const { t } = useTranslation();
  const styles = buttonGrpStyles;
  const { setButtonGrpActions } = useContext(AppLayoutContext);
  const onPressAction = (): void => {
    setButtonGrpActions((prevState) => {
      return {
        ...prevState,
        isClicked: !prevState.isClicked,
      };
    });
  };
  return (
    <Button
      type="secondary"
      containerStyle={[styles.buttonItem, styles.buttonSecondary]}
      onPress={(): void => onPressAction()}
      icon={icons.portfolioFilled}
      title={t("property:buyNewService")}
      iconColor={theme.colors.primaryColor}
      iconSize={25}
      textStyle={styles.buttonTextStyle}
    />
  );
};

const GoBackActionButton: FC = () => {
  const { t } = useTranslation();
  const styles = goBackActionStyles;
  const history = useHistory();
  return (
    <Button
      type="secondary"
      containerStyle={[styles.button, styles.addBtn]}
      onPress={history.goBack}
    >
      <Icon
        name={icons.dartBack}
        color={theme.colors.white}
        style={styles.buttonIconRight}
      />
      <Typography variant="label" size="large" style={styles.buttonBlueTitle}>
        {t("backText")}
      </Typography>
    </Button>
  );
};

export const NavigationInfo: FC = () => {
  const location = useLocation();
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  const breakWords = (data: string): string => {
    const res = data.split("&").join(" & ");
    return res;
  };
  const currentScreen =
    location.pathname === "/"
      ? "Landing"
      : humanize(location.pathname, location.state);
  const renderNavInfo = (): React.ReactElement => {
    const { protectedRoutes } = RouteNames;
    switch (location.pathname) {
      case protectedRoutes.SELECT_SERVICES:
        return <GoBackCustomAction />;
      case protectedRoutes.ADD_PROPERTY:
        return <GoBackCustomAction />;
      case protectedRoutes.DASHBOARD:
        return <DashBoardActionsGrp />;
      case protectedRoutes.PORTFOLIO:
        return <AddPropertyAction />;
      case protectedRoutes.PORTFOLIO_ADD_PROPERTY:
        return <GoBackActionButton />;
      case protectedRoutes.FINANCIALS:
        return <FinancialsActionGrp />;
      case protectedRoutes.VALUE_ADDED_SERVICES:
        return <ValueAddedActionGrp />;
      default:
        return <GoBackActionButton />;
    }
  };

  const isTabUp = useUp(deviceBreakpoint.TABLET);

  return (
    <View>
      <div className="navigation-bg" />
      <View style={[styles.container, isMobile && styles.containerMobile]}>
        <View>
          <Typography
            variant="text"
            size="regular"
            fontWeight="bold"
            style={styles.link}
          >
            {breakWords(currentScreen)}
          </Typography>
          <View style={styles.breadCrumbs}>
            <BreadCrumbs />
          </View>
        </View>
        <View style={[!isTabUp && styles.infoGrpTabDown]}>
          {renderNavInfo()}
        </View>
      </View>
    </View>
  );
};

const goBackActionStyles = StyleSheet.create({
  buttonIconRight: {
    marginRight: 8,
  },
  button: {
    borderColor: theme.colors.subHeader,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginLeft: 16,
    width: "max-content",
    backgroundColor: theme.colors.subHeader,
  },
  addBtn: {
    paddingHorizontal: 24,
    marginLeft: 0,
  },
  buttonBlueTitle: {
    color: theme.colors.white,
    marginRight: 8,
  },
});

const dashBoardActionStyles = StyleSheet.create({
  buttonsGrp: {
    flexDirection: "row",
  },
  buttonIconRight: {
    marginRight: 8,
  },
  buttonsGrpMobile: {
    marginTop: 16,
  },
  button: {
    borderColor: theme.colors.white,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginLeft: 16,
    width: "max-content",
  },
  addBtn: {
    paddingHorizontal: 24,
    marginLeft: 0,
  },
  addBtnContainerMobile: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  addBtnContainer: {
    marginLeft: 16,
    alignItems: "stretch",
  },
  countryBtnMobile: {
    marginLeft: 0,
  },
  buttonTitle: {
    color: theme.colors.white,
    marginHorizontal: 6,
  },
  buttonBlueTitle: {
    color: theme.colors.primaryColor,
    marginRight: 8,
  },
  flagStyle: {
    marginRight: 8,
    borderRadius: 2,
    width: 24,
    height: 24,
  },
});

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between",
    flexDirection: "row",
    width: theme.layout.dashboardWidth,
    marginTop: 24,
    marginBottom: 20,
    alignSelf: "center",
    alignItems: "center",
  },
  containerMobile: {
    width: theme.layout.dashboardMobileWidth,
    flexDirection: "column",
    alignItems: undefined,
  },
  currentScreen: {
    color: theme.colors.white,
  },
  link: {
    color: theme.colors.white,
    textTransform: "capitalize",
  },
  breadCrumbs: {
    paddingVertical: 4,
    flexDirection: "row",
    alignItems: "center",
  },
  infoGrpTabDown: {
    width: "100vw",
    overflowX: "auto",
  },
});

const buttonGrpStyles = StyleSheet.create({
  container: {
    justifyContent: "flex-end",
    flexDirection: "row",
    alignSelf: "center",
    alignItems: "center",
  },
  buttonItem: {
    marginLeft: 10,
  },
  buttonSecondary: {
    borderColor: theme.colors.white,
    flexDirection: "row-reverse",
    alignItems: "center",
    paddingHorizontal: 8,
    width: "max-content",
  },
  buttonTertiary: {
    borderColor: theme.colors.subHeader,
    flexDirection: "row-reverse",
    alignItems: "center",
    paddingHorizontal: 8,
    width: "max-content",
    backgroundColor: theme.colors.subHeader,
  },
  buttonTextStyle: {
    marginHorizontal: 10,
  },
});
