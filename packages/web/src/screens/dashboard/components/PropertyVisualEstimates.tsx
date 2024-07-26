import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { useTranslation } from "react-i18next";
import { TFunction } from "i18next";
import { isEqual } from "lodash";
import { PopupActions } from "reactjs-popup/dist/types";
import { useSelector } from "react-redux";
import { useDown } from "@homzhub/common/src/utils/MediaQueryUtils";
import { FinanceUtils } from "@homzhub/common/src/utils/FinanceUtil";
import { LedgerUtils } from "@homzhub/common/src/utils/LedgerUtils";
import { NavigationService } from "@homzhub/web/src/services/NavigationService";
import { RouteNames } from "@homzhub/web/src/router/RouteNames";
import { UserSelector } from "@homzhub/common/src/modules/user/selectors";
import { theme } from "@homzhub/common/src/styles/theme";
import Icon, { icons } from "@homzhub/common/src/assets/icon";
import ColumnChart from "@homzhub/web/src/components/atoms/ColumnChart";
import DonutChart from "@homzhub/web/src/components/atoms/DonutChart";
import { Divider } from "@homzhub/common/src/components/atoms/Divider";
import { EmptyState } from "@homzhub/common/src/components/atoms/EmptyState";
import Popover from "@homzhub/web/src/components/atoms/Popover";
import { Typography } from "@homzhub/common/src/components/atoms/Typography";
import { IDropdownOption } from "@homzhub/common/src/components/molecules/FormDropdown";
import PopupMenuOptions from "@homzhub/web/src/components/molecules/PopupMenuOptions";
import { Asset } from "@homzhub/common/src/domain/models/Asset";
import {
  GeneralLedgers,
  LedgerTypes,
} from "@homzhub/common/src/domain/models/GeneralLedgers";
import { deviceBreakpoint } from "@homzhub/common/src/constants/DeviceBreakpoints";
import {
  DateFilter,
  IDropdownObject,
} from "@homzhub/common/src/constants/FinanceOverview";

export interface IGeneralLedgersParams {
  selectedTimeRange: DateFilter;
  financialYear: {
    startDate: string;
    endDate: string;
    startMonthIndex: number;
    endMonthIndex: number;
  };
  selectedCountry?: number;
  selectedProperty?: number;
}

interface IProps {
  selectedCountry?: number;
  selectedProperty?: number;
}

interface IPropertyOption {
  icon: string;
  label: string;
  value: number;
}

const popupProps = {
  position: "bottom left" as "bottom left",
  on: "click" as "click",
  arrow: false,
  contentStyle: { marginTop: "4px" },
  closeOnDocumentClick: true,
  children: undefined,
};

const getPropertyList = (
  t: TFunction,
  assets: Asset[],
  selectedCountry: number
): IPropertyOption[] => {
  const properties = (
    selectedCountry === 0
      ? assets
      : assets.filter((asset) => selectedCountry === asset.country.id)
  ).map((asset) => ({
    label: asset.projectName,
    value: asset.id,
    icon: icons.stackFilled,
  }));
  return [
    {
      label: t("assetFinancial:allProperties"),
      icon: icons.stackFilled,
      value: 0,
    },
    ...properties,
  ];
};

const PropertyVisualsEstimates = ({
  selectedCountry,
  selectedProperty: selectedPropertyProp,
}: IProps): React.ReactElement => {
  const { t } = useTranslation();
  const dateFilterOptions = FinanceUtils.renderFilterOptions(t);
  const defaultFilterOption = dateFilterOptions.find(
    (d: IDropdownOption) => d.value === DateFilter.thisMonth
  );
  const assets = useSelector(UserSelector.getUserAssets);
  const financialYear = useSelector(UserSelector.getUserFinancialYear);
  const { currencySymbol } = useSelector(UserSelector.getCurrency);
  const propertyOptions = getPropertyList(t, assets, selectedCountry ?? 0);
  const popupRef = useRef<PopupActions>(null);
  const popupRefCalendar = useRef<PopupActions>(null);
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  const initialProperty =
    propertyOptions.filter(
      (property) => property.value === selectedPropertyProp
    )[0] || propertyOptions[0];
  const [selectedProperty, setSelectedProperty] = useState(initialProperty);
  const [selectedDateFilter, setSelectedDateFilter] =
    useState(defaultFilterOption);
  const [ledgerData, setLedgerData] = useState<GeneralLedgers[]>([]);
  const styles = propertyVisualEstimatesStyle(isMobile);
  const dateFilter = selectedDateFilter?.value ?? DateFilter.thisMonth;
  useEffect(() => {
    FinanceUtils.getGeneralLedgers(
      {
        selectedTimeRange: dateFilter,
        financialYear,
        selectedProperty: selectedProperty.value,
        selectedCountry,
      },
      (data) => {
        setLedgerData(data);
      },
      () => {
        // todo: handle failure case here
      }
    ).then();
  }, [dateFilter, financialYear, selectedProperty, selectedCountry]);
  useEffect(() => {
    if (selectedPropertyProp) {
      setSelectedProperty(
        propertyOptions.filter(
          (property) => property.value === selectedPropertyProp
        )[0]
      );
    }
  }, [selectedPropertyProp]);
  const columnGraphData = FinanceUtils.getBarGraphData(
    { selectedTimeRange: dateFilter, financialYear },
    ledgerData
  );
  const closePopup = (): void => {
    if (
      (popupRef && popupRef.current) ||
      (popupRefCalendar && popupRefCalendar.current)
    ) {
      popupRef.current.close() || popupRefCalendar.current.close();
    }
  };
  const onPropertyOptionPress = (value: IPropertyOption): void => {
    closePopup();
    setSelectedProperty(value);
  };
  const onDateFilterOptionPress = (selectedOption: IDropdownObject): void => {
    closePopup();
    setSelectedDateFilter(selectedOption);
  };
  const isDropDownVisible = !(
    RouteNames.protectedRoutes.FINANCIALS ===
    NavigationService?.appHistory?.location.pathname
  );
  return (
    <View style={styles.chartsContainer}>
      <View style={styles.header}>
        {isDropDownVisible && (
          <Popover
            forwardedRef={popupRefCalendar}
            content={
              <PopupMenuOptions
                options={propertyOptions}
                onMenuOptionPress={onPropertyOptionPress}
              />
            }
            popupProps={popupProps}
          >
            <TouchableOpacity
              onPress={() => {
                popupRefCalendar.current?.toggle();
              }}
              activeOpacity={1}
              style={styles.chooseProperty}
            >
              <Icon
                name={icons.portfolio}
                size={18}
                color={theme.colors.darkTint4}
              />
              <Typography
                variant="label"
                size="regular"
                style={styles.optionLabel}
              >
                {selectedProperty.label}
              </Typography>
              <Icon
                name={icons.downArrow}
                size={18}
                color={theme.colors.darkTint4}
                style={styles.dropdownIcon}
              />
            </TouchableOpacity>
          </Popover>
        )}
        <View style={styles.columnChartOption}>
          <View style={styles.monthInfo}>
            <Icon
              name={icons.calendar}
              size={18}
              color={theme.colors.darkTint4}
              style={styles.dropdownIcon}
            />
            <Typography
              variant="label"
              size="regular"
              style={styles.optionLabel}
            >
              {FinanceUtils.renderCalenderLabel({
                selectedTimeRange: dateFilter,
                financialYear,
              })}
            </Typography>
          </View>
          <Popover
            forwardedRef={popupRef}
            content={
              <PopupMenuOptions
                options={dateFilterOptions}
                onMenuOptionPress={onDateFilterOptionPress}
              />
            }
            popupProps={{ ...popupProps, position: "bottom right" }}
          >
            <TouchableOpacity
              onPress={() => {
                popupRef.current?.toggle();
              }}
              activeOpacity={1}
              style={styles.chooseTimeRange}
            >
              <Typography
                variant="label"
                size="regular"
                style={[styles.optionLabel, styles.timeRangeLabel]}
              >
                {selectedDateFilter?.displayValueAfterSelection ??
                  selectedDateFilter?.label}
              </Typography>
              <Icon
                name={icons.downArrow}
                size={18}
                color={theme.colors.blue}
              />
            </TouchableOpacity>
          </Popover>
        </View>
      </View>
      <View style={styles.mainContainer}>
        {ledgerData.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <View style={styles.donutChart}>
              <Typography variant="label" size="large" fontWeight="bold">
                {t("assetDashboard:expenses")}
              </Typography>
              <DonutChart
                data={LedgerUtils.filterByType(LedgerTypes.debit, ledgerData)}
                currencySymbol={currencySymbol}
              />
            </View>
            {isMobile && <Divider containerStyles={styles.dividerStyles} />}
            <View style={styles.columnChart}>
              <Typography variant="label" size="large" fontWeight="bold">
                {t("assetDashboard:incomeText")}
              </Typography>
              <ColumnChart
                data={columnGraphData}
                currencySymbol={currencySymbol}
              />
            </View>
          </>
        )}
      </View>
    </View>
  );
};

const memoizedComponent = React.memo(PropertyVisualsEstimates, isEqual);
export { memoizedComponent as PropertyVisualsEstimates };

interface IStyle {
  header: ViewStyle;
  chartsContainer: ViewStyle;
  mainContainer: ViewStyle;
  donutChart: ViewStyle;
  monthInfo: ViewStyle;
  columnChartOption: ViewStyle;
  columnChart: ViewStyle;
  chooseProperty: ViewStyle;
  chooseTimeRange: ViewStyle;
  timeRangeLabel: TextStyle;
  optionLabel: TextStyle;
  dropdownIcon: ViewStyle;
  dividerStyles: ViewStyle;
}

const propertyVisualEstimatesStyle = (
  isMobile: boolean
): StyleSheet.NamedStyles<IStyle> =>
  StyleSheet.create<IStyle>({
    chartsContainer: {
      backgroundColor: theme.colors.white,
      borderRadius: 4,
      marginTop: 24,
    },
    header: {
      flexDirection: isMobile ? "column" : "row",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      paddingTop: 24,
      paddingBottom: 16,
    },
    dividerStyles: {
      marginVertical: 20,
    },
    chooseProperty: {
      width: isMobile ? "100%" : 300,
      minWidth: "max-content",
      marginBottom: isMobile ? 20 : undefined,
      flexDirection: "row",
      paddingHorizontal: isMobile ? 4 : 12,
      paddingVertical: 4,
      borderColor: theme.colors.darkTint9,
      borderWidth: 1,
      borderRadius: 4,
      alignItems: "stretch",
    },
    chooseTimeRange: {
      minWidth: isMobile ? "100%" : "max-content",
      flexDirection: "row",
      paddingHorizontal: isMobile ? 4 : 12,
      paddingVertical: 6,
      alignItems: "center",
      borderRadius: 4,
      backgroundColor: theme.colors.background,
    },
    timeRangeLabel: {
      color: theme.colors.blue,
    },
    monthInfo: {
      flexDirection: "row",
      marginRight: isMobile ? 8 : 24,
      alignItems: "center",
    },
    optionLabel: {
      flex: 1,
      marginHorizontal: 4,
      color: theme.colors.darkTint4,
    },
    dropdownIcon: {
      marginRight: 8,
    },
    mainContainer: {
      flexDirection: isMobile ? "column" : "row",
      justifyContent: isMobile ? undefined : "space-around",
      borderTopColor: theme.colors.background,
      borderTopWidth: 1,
      paddingBottom: 15,
      paddingTop: 16,
      paddingHorizontal: 16,
    },
    donutChart: {
      flex: 0.3,
    },
    columnChart: {
      flex: 0.5,
    },
    columnChartOption: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
  });
