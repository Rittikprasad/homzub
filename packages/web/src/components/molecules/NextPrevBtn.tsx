import React, { FC } from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button } from '@homzhub/common/src/components/atoms/Button';

interface ICustomIconProps {
  icon?: string;
  iconSize?: number;
  iconColor?: string;
  containerStyle?: StyleProp<ViewStyle>;
}

interface IProps {
  onBtnClick: (updateIndexBy: number) => void;
  leftBtnProps?: ICustomIconProps;
  rightBtnProps?: ICustomIconProps;
}

export const NextPrevBtn: FC<IProps> = ({
  onBtnClick,
  leftBtnProps: passedLeftBtnProps,
  rightBtnProps: passedRightBtnProps,
}: IProps) => {
  const onPrevBtnClick = (): void => {
    onBtnClick(-1);
  };
  const onNextBtnClick = (): void => {
    onBtnClick(1);
  };
  let leftBtnProps: ICustomIconProps = {
    icon: icons.leftArrow,
    iconSize: 18,
    iconColor: theme.colors.primaryColor,
    containerStyle: styles.nextBtn,
  };
  if (passedLeftBtnProps) {
    leftBtnProps = passedLeftBtnProps;
  }
  let rightBtnProps: ICustomIconProps = {
    icon: icons.rightArrow,
    iconSize: 18,
    iconColor: theme.colors.primaryColor,
    containerStyle: styles.nextBtn,
  };
  if (passedRightBtnProps) {
    rightBtnProps = passedRightBtnProps;
  }
  return (
    <>
      <Button type="secondary" {...leftBtnProps} onPress={onPrevBtnClick} />
      <Button type="secondary" {...rightBtnProps} onPress={onNextBtnClick} />
    </>
  );
};

const styles = StyleSheet.create({
  nextBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 24,
    border: 'none',
    marginLeft: 8,
    backgroundColor: theme.colors.lightGrayishBlue,
  },
});
