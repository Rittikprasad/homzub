import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import DetailCard, { ICardProp } from '@homzhub/common/src/components/molecules/DetailCard';

interface IProps {
  item: ICardProp;
  isCheck: boolean;
  onItemSelect: (value: any) => void;
}

const RadioItem = (props: IProps): React.ReactElement => {
  const { onItemSelect, isCheck, item } = props;
  return (
    <TouchableOpacity onPress={(): void => onItemSelect(item.value)} style={styles.row}>
      <Icon
        name={isCheck ? icons.circleFilled : icons.circleOutline}
        color={theme.colors.darkTint3}
        style={styles.icon}
        size={14}
      />
      <DetailCard heading={item.heading} label={item.label} description={item.description} />
    </TouchableOpacity>
  );
};

export default RadioItem;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  icon: {
    marginTop: 6,
    marginHorizontal: 16,
  },
});
