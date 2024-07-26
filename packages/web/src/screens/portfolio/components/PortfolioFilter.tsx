import React, { useState, useRef } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";
import { PopupActions } from "reactjs-popup/dist/types";
import { theme } from "@homzhub/common/src/styles/theme";
import Icon, { icons } from "@homzhub/common/src/assets/icon";
import { Typography } from "@homzhub/common/src/components/atoms/Typography";
import Popover from "@homzhub/web/src/components/atoms/Popover";
import { IDropdownOption } from "@homzhub/common/src/components/molecules/FormDropdown";
import PopupMenuOptions from "@homzhub/web/src/components/molecules/PopupMenuOptions";
import { AssetFilter } from "@homzhub/common/src/domain/models/AssetFilter";

// TODO: Integration of rest of the filter buttons and optimization: Shagun

interface IPortfolioFilterProps {
  filterData: AssetFilter;
  getStatus: (status: string) => void;
}

type IProps = IPortfolioFilterProps;
const PortfolioFilter: React.FC<IProps> = (props: IProps) => {
  const { t } = useTranslation();
  const status = t("helpAndSupport:status");
  const [selectedOption, setSelectedOption] = useState(status);
  const { filterData, getStatus } = props;
  const popupRef = useRef<PopupActions>(null);
  const popupProps = {
    position: "bottom left" as "bottom left",
    on: "click" as "click",
    arrow: false,
    contentStyle: { marginTop: "4px" },
    closeOnDocumentClick: true,
    children: undefined,
  };

  const selectedFilter = (selectedValue: IDropdownOption): void => {
    getStatus(selectedValue.value);
    setSelectedOption(selectedValue.label);
    closePopup();
  };
  const closePopup = (): void => {
    if (popupRef && popupRef.current) {
      popupRef.current.close();
    }
  };

  return (
    <View style={styles.filterSection}>
      <View>
        <Popover
          forwardedRef={popupRef}
          content={
            <PopupMenuOptions
              options={filterData.statusDropdown}
              onMenuOptionPress={selectedFilter}
            />
          }
          popupProps={popupProps}
        >
          <TouchableOpacity
            onPress={() => {
              popupRef.current?.toggle();
            }}
            activeOpacity={1}
          >
            <View style={styles.filterContainer}>
              <Typography
                size="small"
                fontWeight="semiBold"
                style={styles.filterText}
              >
                {selectedOption}
              </Typography>
              <Icon name={icons.downArrow} size={18} style={styles.icon} />
            </View>
          </TouchableOpacity>
        </Popover>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  filterSection: {
    marginVertical: "2%",
    flexDirection: "row",
  },
  filterContainer: {
    backgroundColor: theme.colors.white,
    justifyContent: "center",
    marginEnd: 12,
    borderRadius: 4,
    flexDirection: "row",
    alignItems: "center",
  },
  filterText: {
    marginHorizontal: 12,
    marginVertical: 6,
    color: theme.colors.primaryColor,
  },
  icon: {
    marginEnd: 12,
    color: theme.colors.primaryColor,
  },
});
export default PortfolioFilter;
