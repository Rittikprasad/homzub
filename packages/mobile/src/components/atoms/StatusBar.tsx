import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import React, { useState, useEffect, memo } from 'react';
import { View, StatusBar, StatusBarStyle, NativeModules } from 'react-native';

const { StatusBarManager } = NativeModules;

export interface IStatusBarProps {
  barStyle: StatusBarStyle;
  statusBarBackground: string;
  isStatusBarHidden?: boolean;
}

const HomzhubStatusBar = (props: IStatusBarProps): React.ReactElement => {
  const { barStyle, statusBarBackground, isStatusBarHidden = false } = props;

  const [barHeight, setBarHeight] = useState(0);
  useEffect(() => {
    if (PlatformUtils.isIOS()) {
      StatusBarManager.getHeight(({ height }: { height: number }) => {
        setBarHeight(height);
      });
    } else {
      setBarHeight(StatusBar.currentHeight ?? 0);
    }
  }, []);

  return (
    <View
      style={{
        backgroundColor: statusBarBackground,
        height: barHeight,
      }}
    >
      <StatusBar
        animated
        translucent={PlatformUtils.isAndroid()}
        hidden={isStatusBarHidden}
        backgroundColor={statusBarBackground}
        barStyle={barStyle}
      />
    </View>
  );
};

const memoizedComponent = memo(HomzhubStatusBar);
export { memoizedComponent as StatusBar };
