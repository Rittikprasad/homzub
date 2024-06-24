import React from 'react';
import { useDispatch } from 'react-redux';
import { FlatList, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FinancialActions } from '@homzhub/common/src/modules/financials/actions';
import { theme } from '@homzhub/common/src/styles/theme';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import ReminderCard from '@homzhub/common/src/components/molecules/ReminderCard';
import { Reminder } from '@homzhub/common/src/domain/models/Reminder';
import { ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';

interface IProps {
  list: Reminder[];
}

const ReminderList = ({ list }: IProps): React.ReactElement => {
  const { navigate } = useNavigation();
  const dispatch = useDispatch();

  const onPressCard = (id: number): void => {
    dispatch(FinancialActions.setCurrentReminderId(id));
    navigate(ScreensKeys.AddReminderScreen, { isEdit: true });
  };

  const keyExtractor = (item: Reminder): string => `${item.id}`;

  const renderItem = ({ item }: { item: Reminder }): React.ReactElement => (
    <ReminderCard reminder={item} onPressCard={(): void => onPressCard(item.id)} />
  );

  const itemSeparator = (): React.ReactElement => <Divider containerStyles={styles.divider} />;

  return (
    <FlatList
      data={list}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      scrollEnabled={false}
      ItemSeparatorComponent={itemSeparator}
    />
  );
};

export default ReminderList;

const styles = StyleSheet.create({
  divider: {
    marginVertical: 8,
    borderColor: theme.colors.background,
    borderWidth: 1,
  },
});
