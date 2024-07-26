import React, { useState, useRef } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  PickerItemProps,
} from "react-native";
import { PopupActions } from "reactjs-popup/dist/types";
import { theme } from "@homzhub/common/src/styles/theme";
import Icon, { icons } from "@homzhub/common/src/assets/icon";
import Popover from "@homzhub/web/src/components/atoms/Popover";
import { Typography } from "@homzhub/common/src/components/atoms/Typography";
import PopupMenuOptions from "@homzhub/web/src/components/molecules/PopupMenuOptions";

export enum OffersDropdownType {
  Country = "countary_id",
  Listing = "type",
  Assets = "asset_id",
  Filter = "filter_by",
  Sort = "sort_by",
}

interface IOffersFilterProps {
  filterData: PickerItemProps[];
  defaultTitle: string;
  onSelectFilter: (
    selectedFilterType: OffersDropdownType,
    value: string | number
  ) => void;
  offerType: OffersDropdownType;
}

type IProps = IOffersFilterProps;
const OffersDropdown: React.FC<IProps> = (props: IProps) => {
  const { filterData, defaultTitle, onSelectFilter, offerType } = props;
  const [selectedOption, setSelectedOption] = useState(defaultTitle);
  const popupRef = useRef<PopupActions>(null);
  const popupProps = {
    position: "bottom left" as "bottom left",
    on: "click" as "click",
    arrow: false,
    contentStyle: { marginTop: "4px" },
    closeOnDocumentClick: true,
    children: undefined,
  };

  const selectedFilter = (selectedValue: PickerItemProps): void => {
    onSelectFilter(offerType, selectedValue.value);
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
              options={filterData}
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
export default OffersDropdown;
