import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';
import { Label } from '@homzhub/common/src/components/atoms/Text';

export interface ICardProp extends IOwnProps {
  id: number;
  value: number;
  selectedValue: string;
}

export interface IOwnProps {
  heading: string;
  label?: string;
  description?: string;
  containerStyle?: ViewStyle;
  rightNode?: React.ReactNode;
  outerContainerStyle?: StyleProp<ViewStyle>;
}

const DetailCard = (props: IOwnProps): React.ReactElement => {
  const { heading, label, description, containerStyle, rightNode, outerContainerStyle } = props;
  return (
    <View style={[outerContainerStyle, !!rightNode && styles.container]}>
      <View style={[containerStyle && containerStyle]}>
        <Label type="large" textType="semiBold" style={styles.label}>
          {heading}
        </Label>
        {label && (
          <Label type="large" style={styles.label}>
            {label}
          </Label>
        )}
        {description && (
          <Label type="large" style={styles.label}>
            {description}
          </Label>
        )}
      </View>
      {rightNode && rightNode}
    </View>
  );
};

export default DetailCard;

const styles = StyleSheet.create({
  label: {
    color: theme.colors.darkTint3,
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
