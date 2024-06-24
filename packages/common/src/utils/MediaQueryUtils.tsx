import React, { useEffect, useState } from 'react';
import { Dimensions } from 'react-native';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

interface IScaledSize {
  width: number;
  height: number;
  scale: number;
  fontScale: number;
}

export interface IDeviceScreenLimits {
  down: number;
  up: number;
}

/**
 * custom hook that return window size whenever window size changes
 */
function useViewPort(): IScaledSize {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const onChangeHandler = ({ window }: { window: IScaledSize; screen: IScaledSize }): void => {
    setDimensions(window);
  };

  useEffect(() => {
    Dimensions.addEventListener('change', onChangeHandler);
    return (): void => Dimensions.removeEventListener('change', onChangeHandler);
  }, []);

  return dimensions;
}

// useOnly(tablet) => '@media (min-width: 768px) and (max-width: 991.98px)'
function useOnly(screenSize: IDeviceScreenLimits): boolean {
  const screenWidth = useViewPort().width;
  return screenWidth >= screenSize.down && screenWidth < screenSize.up;
}

// useBetween(tablet, desktop) => '@media (min-width: 768px) and (max-width: 1199.98px)'
function useBetween(firstScreenSize: IDeviceScreenLimits, secondScreeSize: IDeviceScreenLimits): boolean {
  const screenWidth = useViewPort().width;
  return screenWidth > firstScreenSize.down && screenWidth < secondScreeSize.up;
}

// useUp(tablet) => '@media (min-width: 768px)'
function useUp(screenSize: IDeviceScreenLimits): boolean {
  const screenWidth = useViewPort().width;
  return screenWidth >= screenSize.down;
}

// useDown(tablet) => '@media (max-width: 991.98px)'
function useDown(screenSize: IDeviceScreenLimits): boolean {
  const screenWidth = useViewPort().width;
  return screenWidth < screenSize.up;
}

function useIsIpadPro(): boolean {
  const screenWidth = useViewPort().width;
  const screenHeight = useViewPort().height;
  return screenWidth >= 768 && screenHeight >= 1024;
}

interface IWithMediaQuery {
  isMobile?: boolean;
  isTablet?: boolean;
  isOnlyTablet?: boolean;
  isIpadPro?: boolean;
  screenHeight?: number;
  screenWidth?: number;
}

const withMediaQuery = <P extends {}>(
  WrappedComponent: React.ComponentType<P>
): React.ComponentType<P & IWithMediaQuery> => {
  return (props: P): JSX.Element => {
    return (
      <WrappedComponent
        isMobile={useDown(deviceBreakpoint.MOBILE)}
        isTablet={useDown(deviceBreakpoint.TABLET)}
        isOnlyTablet={useOnly(deviceBreakpoint.TABLET)}
        isIpadPro={useIsIpadPro()}
        screenHeight={useViewPort()?.height ?? 0}
        screenWidth={useViewPort()?.width ?? 0}
        {...props}
      />
    );
  };
};

export { useViewPort, useOnly, useBetween, useUp, useDown, useIsIpadPro, withMediaQuery, IWithMediaQuery };
