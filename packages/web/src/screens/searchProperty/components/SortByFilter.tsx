import React, { useState, useRef } from "react";
import { View, StyleSheet, LayoutChangeEvent } from "react-native";
import { PopupActions, PopupProps } from "reactjs-popup/dist/types";

import { theme } from "@homzhub/common/src/styles/theme";
import { icons } from "@homzhub/common/src/assets/icon";
import { Button } from "@homzhub/common/src/components/atoms/Button";
import Popover from "@homzhub/web/src/components/atoms/Popover";
import PopupMenuOptions, {
  IPopupOptions,
} from "@homzhub/web/src/components/molecules/PopupMenuOptions";
import { FilterDetail } from "@homzhub/common/src/domain/models/FilterDetail";
import { IFilter } from "@homzhub/common/src/domain/models/Search";

const defaultDropDownProps = (width: number): PopupProps => ({
  position: "bottom left",
  arrow: false,
  contentStyle: {
    width,
  },
  children: undefined,
  on: "click",
  closeOnDocumentClick: true,
});

interface IProps {
  filters: IFilter;
  filterData: FilterDetail | null;
  onSelectSort: (option: IPopupOptions) => void;
}

export const SortByFilter = (props: IProps): React.ReactElement | null => {
  const { filterData, onSelectSort } = props;
  const [title, setTitle] = useState("");
  const [width, setWidth] = useState(0);
  const popupRef = useRef<PopupActions>(null);
  if (!filterData) {
    return null;
  }
  const {
    filters: { sortDropDownData },
  } = filterData;

  const onLayout = (e: LayoutChangeEvent): void => {
    setWidth(e.nativeEvent.layout.width);
  };

  const selectSort = (value: IPopupOptions): void => {
    onSelectSort(value);
    setTitle(value.label);
    if (popupRef && popupRef.current) popupRef.current.close();
  };

  const popupContent = (): React.ReactElement | null => {
    return (
      <PopupMenuOptions
        options={sortDropDownData}
        onMenuOptionPress={selectSort}
        labelType="regular"
      />
    );
  };

  return (
    <View>
      <Popover
        forwardedRef={popupRef}
        content={popupContent()}
        popupProps={defaultDropDownProps(width)}
      >
        <View onLayout={onLayout}>
          <Button
            onPress={() => {
              popupRef.current?.toggle();
            }}
            type="primary"
            title={title || filterData?.filters.sortBy[0].title}
            containerStyle={styles.filterButton}
            titleStyle={styles.filterButtonTitle}
            icon={icons.downArrow}
            iconSize={20}
            iconColor={theme.colors.blue}
            iconStyle={styles.icon}
          />
        </View>
      </Popover>
    </View>
  );
};

const styles = StyleSheet.create({
  filterButton: {
    width: "auto",
    height: 28,
    backgroundColor: theme.colors.lightGrayishBlue,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  filterButtonTitle: {
    alignItems: "center",
    textAlign: "center",
    marginVertical: 3,
    marginHorizontal: 6,
    color: theme.colors.blue,
    flexWrap: "wrap",
    flexShrink: 1,
  },
  icon: {
    alignSelf: "center",
  },
});
