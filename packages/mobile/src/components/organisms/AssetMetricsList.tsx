import React, { useState, useCallback } from 'react';
import { StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/core';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import Logo from '@homzhub/common/src/assets/images/homzhubDashboard.svg';
import { Label, Text } from '@homzhub/common/src/components/atoms/Text';
import { PaginationComponent } from '@homzhub/mobile/src/components/atoms/PaginationComponent';
import { SnapCarousel } from '@homzhub/mobile/src/components/atoms/Carousel';
import { AssetMetrics } from '@homzhub/mobile/src/components/molecules/AssetMetrics';

export interface IMetricsData {
  name: string;
  count: string | number;
  label?: string;
  id?: number;
  isCurrency?: boolean;
  colorCode: string;
  code?: string;
}

interface IProps {
  data: IMetricsData[];
  title?: string;
  subscription?: string;
  selectedAssetType?: string;
  numOfElements?: number;
  isSubTextRequired?: boolean;
  onPlusIconClicked?: () => void;
  onMetricsClicked?: (name: string) => void;
  containerStyle?: StyleProp<ViewStyle>;
  subTitleText?: string;
  headerIcon?: string;
  showBackIcon?: boolean;
}

const COMPONENT_PADDING = 12;
const SLIDER_WIDTH = theme.viewport.width - theme.layout.screenPadding * 2;
const AssetMetricsList = (props: IProps): React.ReactElement => {
  const {
    title = 0,
    data,
    selectedAssetType,
    onPlusIconClicked,
    containerStyle,
    onMetricsClicked,
    numOfElements = 3,
    isSubTextRequired = true,
    subTitleText,
    headerIcon,
    showBackIcon = false,
  } = props;

  // HOOKS
  const { t } = useTranslation();
  const { goBack, setParams } = useNavigation();
  const { params } = useRoute();
  const [activeIndex, setActiveIndex] = useState(0);
  // HELPERS
  const bubblePlusIcon = useCallback((): void => {
    if (onPlusIconClicked) {
      onPlusIconClicked();
    }
  }, [onPlusIconClicked]);

  const splitData = useCallback((): IMetricsData[][] => {
    const newArr = [];

    for (let i = 0; i < data.length; i += numOfElements) {
      newArr.push(data.slice(i, i + numOfElements));
    }

    return newArr;
  }, [data, numOfElements]);

  const onGoBack = (): void => {
    goBack();
    // @ts-ignore
    if (params && params?.isFromNavigation) {
      setParams({ isFromNavigation: false });
    }
  };
  // HELPERS END

  const renderItem = useCallback(
    (items: IMetricsData[]): React.ReactElement => {
      return (
        <View style={styles.sliderRow}>
          {items.map((item: IMetricsData) => {
            const cardStyle = {
              minWidth: (SLIDER_WIDTH - COMPONENT_PADDING * (numOfElements + 1)) / numOfElements,
            };
            // TODO: (Shikha) - Connect with BE to handle all logic with CODE
            const handlePress = (): void => onMetricsClicked && onMetricsClicked(item.code || item.name);
            return (
              <AssetMetrics
                key={`${item.label ?? item.name}`}
                header={item.label ?? item.name}
                value={item.count}
                isCurrency={item.isCurrency ?? false}
                cardStyle={cardStyle}
                colorCode={item.colorCode}
                onPressMetrics={handlePress}
                selectedAssetType={selectedAssetType}
                // Todo : Check in multiple devices
                maxLength={items.length === 2 ? 15 : undefined}
              />
            );
          })}
        </View>
      );
    },
    [onMetricsClicked, numOfElements, selectedAssetType]
  );

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={[styles.header, !isSubTextRequired && styles.financialView]}>
        {showBackIcon && (
          <TouchableOpacity onPress={onGoBack} style={styles.backIcon}>
            <Icon name={icons.leftArrow} size={25} color={theme.colors.blue} />
          </TouchableOpacity>
        )}
        {headerIcon ? (
          <View>
            <Icon name={headerIcon} size={30} style={styles.icon} color={theme.colors.blue} />
            <View style={[styles.headerIcon, styles.logo]} />
          </View>
        ) : (
          <Logo style={styles.logo} width={50} height={50} />
        )}
        <View style={styles.headerCenter}>
          <Text type="regular" textType="bold" style={styles.assetCount}>
            {title}
          </Text>
          <View style={styles.propertiesRow}>
            {isSubTextRequired && (
              <Label type="large" textType="semiBold" style={styles.propertyText}>
                {subTitleText || t('common:properties')}
              </Label>
            )}
          </View>
        </View>
        {onPlusIconClicked && (
          <TouchableOpacity onPress={bubblePlusIcon} style={styles.plusIconContainer}>
            <Icon name={icons.circularPlus} size={32} color={theme.colors.primaryColor} testID="icnPlus" />
          </TouchableOpacity>
        )}
      </View>
      <SnapCarousel
        carouselData={splitData()}
        carouselItem={renderItem}
        activeIndex={activeIndex}
        onSnapToItem={setActiveIndex}
        sliderWidth={SLIDER_WIDTH}
        itemWidth={SLIDER_WIDTH}
      />
      <PaginationComponent
        dotsLength={splitData().length}
        activeSlide={activeIndex}
        containerStyle={styles.paginationContainer}
        activeDotStyle={[styles.dot, styles.activeDot]}
        inactiveDotStyle={[styles.dot, styles.inactiveDot]}
      />
    </View>
  );
};

const memoizedComponent = React.memo(AssetMetricsList);
export { memoizedComponent as AssetMetricsList };

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    borderRadius: 4,
    backgroundColor: theme.colors.white,
  },
  header: {
    marginHorizontal: 12,
    flexDirection: 'row',
  },
  headerCenter: {
    flex: 1,
  },
  propertiesRow: {
    flexDirection: 'row',
  },
  sliderRow: {
    flexDirection: 'row',
  },
  paginationContainer: {
    paddingVertical: 0,
    marginTop: 12,
  },
  assetCount: {
    color: theme.colors.darkTint1,
  },
  propertyText: {
    color: theme.colors.darkTint4,
  },
  logo: {
    marginEnd: 12,
  },
  dot: {
    width: 8.5,
    height: 8.5,
  },
  activeDot: {
    borderWidth: 1.5,
  },
  inactiveDot: {
    backgroundColor: theme.colors.disabled,
    borderWidth: 0,
  },
  financialView: {
    alignItems: 'center',
  },
  headerIcon: {
    backgroundColor: theme.colors.blue,
    width: 50,
    height: 50,
    opacity: 0.1,
    borderRadius: 30,
  },
  icon: {
    position: 'absolute',
    left: 10,
    top: 10,
  },
  plusIconContainer: {
    justifyContent: 'center',
    padding: 5,
  },
  backIcon: {
    alignSelf: 'center',
    marginRight: 10,
  },
});
