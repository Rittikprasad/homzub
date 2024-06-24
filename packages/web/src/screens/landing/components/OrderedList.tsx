import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';

interface IProps {
  label: string;
}
const OrderedList: FC<IProps> = (props: IProps) => {
  const { label } = props;
  return (
    <View style={styles.container}>
      <View style={styles.bulletIcon} />
      <Typography size="small" variant="text">
        {label}
      </Typography>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 6,
  },
  bulletIcon: {
    height: 8,
    width: 8,
    borderRadius: 100 / 2,
    backgroundColor: theme.colors.darkTint3,
    marginTop: 6,
    marginRight: 6,
  },
});

export default OrderedList;
