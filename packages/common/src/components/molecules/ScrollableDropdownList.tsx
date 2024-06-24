import React from 'react';
import { FlatList, PickerItemProps, View, StyleSheet, ViewStyle, StyleProp, TextStyle } from 'react-native';
import { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Dropdown } from '@homzhub/common/src/components/atoms/Dropdown';
import { TextFieldType, TextSizeType } from '@homzhub/common/src/components/atoms/Text';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';

export interface IDropdownData {
  key: string;
  dropdownData: PickerItemProps[];
  selectedValue: string;
  placeholder: string;
}

interface IProps {
  data: IDropdownData[];
  onDropdown: (selectedValues: (ISelectedValue | undefined)[]) => void;
  dropDownTitle?: string;
  isScrollable?: boolean;
  isOutlineView?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  mainContainerStyle?: StyleProp<ViewStyle>;
  allowDeselect?: boolean;
  dropDownTitleType?: TextSizeType;
  dropDownFieldType?: TextFieldType;
  dropDownTitleStyle?: StyleProp<TextStyle>;
}

export interface ISelectedValue {
  key: string;
  value: string;
}

interface IScreenState {
  data: IDropdownData[];
  selectedValues: (ISelectedValue | undefined)[];
}

class ScrollableDropdownList extends React.PureComponent<IProps, IScreenState> {
  constructor(props: IProps) {
    super(props);
    const { data } = this.props;
    this.state = {
      data,
      selectedValues: [],
    };
  }

  public static getDerivedStateFromProps = (props: IProps, state: IScreenState): IScreenState => {
    if (JSON.stringify(props.data) !== JSON.stringify(state.data)) {
      return {
        ...state,
        data: props.data,
      };
    }

    return state;
  };

  public render(): React.ReactElement {
    const { data } = this.state;
    const {
      data: dropdownData,
      dropDownTitle,
      isScrollable = true,
      mainContainerStyle,
      dropDownTitleType = 'regular',
      dropDownTitleStyle,
      dropDownFieldType,
    } = this.props;

    return (
      <View style={[styles.mainContainer, mainContainerStyle]}>
        {!!dropDownTitle && (
          <Typography size={dropDownTitleType} variant={dropDownFieldType} style={dropDownTitleStyle}>
            {dropDownTitle}
          </Typography>
        )}
        <View>
          <FlatList
            extraData={dropdownData}
            horizontal
            data={data}
            scrollEnabled={isScrollable}
            renderItem={this.renderDropdown}
            ItemSeparatorComponent={this.renderItemSeparator}
            keyExtractor={this.renderKeyExtractor}
            showsHorizontalScrollIndicator={false}
          />
        </View>
      </View>
    );
  }

  private renderItemSeparator = (): React.ReactElement => <View style={styles.separator} />;

  private renderKeyExtractor = (item: IDropdownData, index: number): string => `${index}`;

  private renderDropdown = ({ item, index }: { item: IDropdownData; index: number }): React.ReactElement => {
    const { dropdownData, selectedValue, placeholder } = item;
    const { containerStyle, isOutlineView = false } = this.props;
    return (
      <Dropdown
        data={dropdownData}
        value={selectedValue}
        onDonePress={this.onDropdownSelect}
        dropdownIndex={index}
        placeholder={placeholder}
        listHeight={500}
        listTitle={placeholder}
        isOutline={isOutlineView}
        containerStyle={[styles.dropdownContainer, containerStyle]}
        textStyle={styles.placeholder}
        iconColor={theme.colors.blue}
        icon={icons.downArrow}
        fontSize="large"
        fontWeight="semiBold"
        iconStyle={styles.dropdownIcon}
      />
    );
  };

  private onDropdownSelect = (value: string, index: number): void => {
    if (index < 0) {
      return;
    }
    this.setState((oldState: IScreenState): IScreenState => {
      const { onDropdown, data, allowDeselect = true } = this.props;

      const updatedData = [...oldState.data];
      const updatedSelectedValues: (ISelectedValue | undefined)[] = [...oldState.selectedValues];

      const oldSelectedValue = updatedData[index].selectedValue;

      if (allowDeselect && oldSelectedValue === value) {
        updatedData[index].selectedValue = '';
        updatedSelectedValues[index] = undefined;
      } else {
        updatedData[index].selectedValue = value;
        const { key } = data[index];
        updatedSelectedValues[index] = { key, value };
      }
      onDropdown(updatedSelectedValues);
      return { data: updatedData, selectedValues: updatedSelectedValues };
    });
  };
}

export default ScrollableDropdownList;

const styles = StyleSheet.create({
  separator: {
    width: 12,
    height: 12,
  },
  mainContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownContainer: {
    backgroundColor: theme.colors.white,
    borderWidth: 0,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  placeholder: {
    color: theme.colors.blue,
  },
  dropdownIcon: {
    marginStart: 12,
  },
});
