import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { SearchActions } from '@homzhub/common/src/modules/search/actions';
import { SearchSelector } from '@homzhub/common/src/modules/search/selectors';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import { ILocationParam } from '@homzhub/common/src/domain/repositories/interfaces';

const LocalityCard = (): React.ReactElement => {
  const dispatch = useDispatch();
  const [isCollapsed, setToggle] = useState(true);
  const selectedLocalities = useSelector(SearchSelector.getLocalities);

  const onRemove = (name: string): void => {
    dispatch(SearchActions.removeLocality(name));
  };

  const renderCard = (item: ILocationParam): React.ReactElement => {
    return (
      <View style={styles.cardContainer}>
        <Text type="small" style={styles.cardLabel} maxLength={30}>
          {item.name}
        </Text>
        {selectedLocalities.length > 1 && (
          <View>
            {isCollapsed && selectedLocalities.length > 1 ? (
              <Text type="small" style={styles.cardLabel}>
                {`+ ${selectedLocalities.length - 1} more`}
              </Text>
            ) : (
              <TouchableOpacity onPress={(): void => onRemove(item.name)}>
                <Icon name={icons.close} size={16} color={theme.colors.primaryColor} />
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    );
  };

  if (selectedLocalities.length < 1) return <View />;

  const localities = isCollapsed ? [selectedLocalities[0]] : selectedLocalities;
  return (
    <>
      <View style={styles.header}>
        <Text type="small" style={styles.headerLabel}>
          Localities
        </Text>
        <TouchableOpacity onPress={(): void => setToggle(!isCollapsed)} style={styles.arrow}>
          <Icon name={isCollapsed ? icons.downArrow : icons.upArrow} size={14} />
        </TouchableOpacity>
      </View>
      {localities.length > 0 && localities.map((item) => renderCard(item))}
    </>
  );
};

export default LocalityCard;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLabel: {
    color: theme.colors.darkTint3,
  },
  arrow: {
    backgroundColor: theme.colors.gray17,
    padding: 6,
    borderRadius: 6,
  },
  cardContainer: {
    borderWidth: 1,
    borderColor: theme.colors.primaryColor,
    marginVertical: 10,
    padding: 12,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardLabel: {
    color: theme.colors.primaryColor,
  },
});
