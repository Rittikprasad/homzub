import React from 'react';
import { FlatList, StyleProp, StyleSheet, TextStyle, View, ViewStyle } from 'react-native';
import { IWithMediaQuery, withMediaQuery } from '@homzhub/common/src/utils/MediaQueryUtils';
import { RNCheckbox } from '@homzhub/common/src/components/atoms/Checkbox';

export interface ICheckboxGroupData {
  id: number | string;
  label: string;
  isSelected: boolean;
  isDisabled?: boolean;
}

export interface ICheckboxGroupProps {
  data: ICheckboxGroupData[];
  onToggle: (id: number | string, isSelected: boolean) => void;
  labelStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  testID?: string;
  numOfColumns?: number;
}

type IProps = ICheckboxGroupProps & IWithMediaQuery;

class CheckboxGroup extends React.PureComponent<IProps, {}> {
  public render = (): React.ReactNode => {
    const { data, containerStyle = {}, isMobile, numOfColumns } = this.props;
    const styles = checkBoxGrpStyles(isMobile ?? false);

    const renderItem = ({ item }: { item: ICheckboxGroupData }): React.ReactElement => {
      const numColumns = numOfColumns || 2;
      // ToDo (Praharsh: 19 Mar 2021) : Check if web has chances to break here (isMobile : false).
      const style = checkBoxGrpStyles(false, numColumns);
      return <View style={style.checkBoxItem}>{this.renderCheckbox(item)}</View>;
    };

    const keyExtractor = (item: ICheckboxGroupData): string => item.id.toString();

    // ToDo (Praharsh: 19 Mar 2021) : Check if both cases can be covered using FlatList alone.
    return !numOfColumns ? (
      <View style={[styles.container, containerStyle]}>
        <View style={styles.col}>
          {data.filter((item, index) => index % 2 === 0).map((item) => this.renderCheckbox(item))}
        </View>
        <View style={styles.col}>
          {data.filter((item, index) => index % 2 !== 0).map((item) => this.renderCheckbox(item))}
        </View>
      </View>
    ) : (
      <FlatList data={data} renderItem={renderItem} keyExtractor={keyExtractor} numColumns={numOfColumns} />
    );
  };

  private renderCheckbox = (item: ICheckboxGroupData): React.ReactElement => {
    const { label, isSelected = false, isDisabled = false } = item;
    const { onToggle, labelStyle = {}, testID, isMobile, containerStyle = {} } = this.props;
    const styles = checkBoxGrpStyles(isMobile ?? false);
    const onCheckboxToggle = (): void => onToggle(item.id, !isSelected);

    return (
      <View key={`${item.id}`} style={isDisabled && styles.disabled} pointerEvents={isDisabled ? 'none' : undefined}>
        <RNCheckbox
          selected={isSelected}
          label={label}
          onToggle={onCheckboxToggle}
          labelStyle={labelStyle}
          containerStyle={[styles.checkboxContainer, containerStyle]}
          testID={testID}
        />
      </View>
    );
  };
}

const checkboxGroup = withMediaQuery<any>(CheckboxGroup);
export { checkboxGroup as CheckboxGroup };

interface ICheckBoxGrpStyle {
  container: ViewStyle;
  col: ViewStyle;
  disabled: ViewStyle;
  checkboxContainer: ViewStyle;
  checkBoxItem: ViewStyle;
}

const checkBoxGrpStyles = (isMobile: boolean, numOfColumns = 1): StyleSheet.NamedStyles<ICheckBoxGrpStyle> =>
  StyleSheet.create({
    checkBoxItem: {
      flex: 1 / numOfColumns,
    },
    container: {
      flexDirection: 'row',
      width: '100%',
    },
    col: {
      flex: isMobile ? 0.5 : undefined,
      flexDirection: isMobile ? 'column' : 'row',
      flexWrap: isMobile ? undefined : 'wrap',
    },
    disabled: {
      opacity: 0.5,
    },
    checkboxContainer: {
      marginRight: isMobile ? undefined : 40,
      marginVertical: 12,
    },
  });
