import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import arrayMove from 'array-move';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Hoverable } from '@homzhub/web/src/components/hoc/Hoverable';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import { IDragOption } from '@homzhub/web/src/components/molecules/OverviewCarousel';

interface IProps {
  options: IDragOption[];
  onSavePress: (option: any[]) => void;
  modalClose?: () => void;
}
const DragandDrop = ({ options, onSavePress, modalClose }: IProps): React.ReactElement => {
  const { primaryColor, darkTint4 } = theme.colors;
  const { t } = useTranslation();
  const [option, setOption] = useState(options);
  const SortableItem = SortableElement(
    ({ value }: any): React.ReactElement => (
      <View style={styles.listItems}>
        <Hoverable key={value.label}>
          {(isHovered: boolean): React.ReactNode => (
            <TouchableOpacity style={[styles.option, isHovered && styles.hoverOptions]}>
              <View style={[{ backgroundColor: value.colorCode }, styles.circleIcon]} />

              <Label type="large" textType="semiBold" style={styles.optionText}>
                {value.label}
              </Label>
              <Icon
                name={icons.dragIndicator}
                style={styles.dragIndicator}
                size={16}
                color={isHovered ? theme.colors.primaryColor : theme.colors.darkTint10}
              />
            </TouchableOpacity>
          )}
        </Hoverable>
      </View>
    )
  );

  const Sortable = SortableContainer(({ items }: any): React.ReactElement => {
    return (
      <View style={styles.draggableList}>
        {items.map((item: any, index: number) => (
          <View key={index}>
            <SortableItem
              key={`item-${item}`}
              index={index}
              value={item}
              useDragHandle
              helperClass="dragging-helper-class"
            />
          </View>
        ))}
      </View>
    );
  });
  const onSortEnd = ({ oldIndex, newIndex }: any): void => {
    setOption(arrayMove(option, oldIndex, newIndex));
    document.body.style.cursor = 'default';
  };
  const onSortStart = (): void => {
    document.body.style.cursor = 'grabbing';
  };
  const onResetPress = (): void => {
    setOption(options);
  };
  return (
    <View style={styles.optionContainer}>
      <View style={styles.headerContainer}>
        <View>
          <Typography variant="text" size="small" fontWeight="semiBold" style={styles.headerText}>
            {t('property:customiseDashboard')}
          </Typography>
        </View>
        <View style={styles.icon}>
          <Hoverable>
            {(isHovered: boolean): React.ReactNode => (
              <TouchableOpacity>
                <Icon name={icons.close} size={16} color={isHovered ? primaryColor : darkTint4} onPress={modalClose} />
              </TouchableOpacity>
            )}
          </Hoverable>
        </View>
      </View>
      <Divider />
      <View style={styles.contentBox}>
        <Typography variant="text" size="small" fontWeight="regular" style={styles.content}>
          {t('property:dragAndDropText')}
        </Typography>
      </View>
      <Sortable
        items={option}
        onSortEnd={onSortEnd}
        lockAxis="y"
        distance={2}
        onSortStart={onSortStart}
        transitionDuration={0}
      />
      <Divider />

      <View style={styles.bottomContainer}>
        <Button type="secondaryOutline" onPress={onResetPress} containerStyle={[styles.button, styles.resetButton]}>
          <Typography variant="text" size="small" fontWeight="regular" style={styles.btnText}>
            {t('propertySearch:reset')}
          </Typography>
        </Button>
        <Button type="primary" onPress={(): void => onSavePress(option)} containerStyle={styles.button}>
          <Typography variant="text" size="small" fontWeight="regular" style={styles.saveBtnText}>
            {t('common:save')}
          </Typography>
        </Button>
      </View>
    </View>
  );
};

export default DragandDrop;

const styles = StyleSheet.create({
  optionContainer: {
    backgroundColor: theme.colors.white,
    position: 'relative',
    borderradius: 8,
    width: '100%',
    height: 'fitContent',
  },
  option: {
    flexDirection: 'row',
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  icon: {
    position: 'absolute',
    right: 20,
    top: 10,
  },

  activeOption: {
    backgroundColor: theme.colors.background,
  },
  optionText: {
    color: theme.colors.darkTint4,
  },
  optionTextHovered: {
    color: theme.colors.primaryColor,
  },
  button: {
    height: 44,
    width: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetButton: {
    alignItems: 'flex-start',
  },
  btnText: {
    color: theme.colors.blue,
    position: 'absolute',
  },
  saveBtnText: {
    color: theme.colors.white,
    position: 'relative',
  },
  bottomContainer: {
    flexDirection: 'row',
    borderRadius: 2,
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginVertical: 16,
  },
  headerText: {
    marginLeft: 20,
    marginTop: 10,
    marginBottom: 14,
  },
  content: {
    fontSize: 14,
  },
  contentBox: {
    margin: 20,
  },
  listItems: {
    position: 'relative',
    border: `1px solid ${theme.colors.divider}`,
    marginHorizontal: 20,
    marginBottom: 10,
    zIndex: 999999,
    display: 'flex',
    borderRadius: 4,
  },
  headerContainer: {
    flexDirection: 'row',
  },
  circleIcon: {
    marginHorizontal: 8,
    height: 10,
    width: 10,
    borderRadius: 8,
  },
  dragIndicator: {
    position: 'absolute',
    right: 0,
    paddingRight: 15,
  },
  draggableList: {
    paddingBottom: 30,
  },
  hoverOptions: {
    borderRightWidth: 3,
    borderRightColor: theme.colors.primaryColor,
  },
});
