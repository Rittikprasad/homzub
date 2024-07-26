import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, TouchableOpacity, View, ViewStyle } from "react-native";
import { useTranslation } from "react-i18next";
import { ButtonGroupProps, CarouselProps } from "react-multi-carousel";
import { cloneDeep } from "lodash";
import { PopupActions } from "reactjs-popup/dist/types";
import { useDown } from "@homzhub/common/src/utils/MediaQueryUtils";
import { theme } from "@homzhub/common/src/styles/theme";
import { icons } from "@homzhub/common/src/assets/icon";
import { Hoverable } from "@homzhub/web/src/components/hoc/Hoverable";
import { Button } from "@homzhub/common/src/components/atoms/Button";
import Popover from "@homzhub/web/src/components/atoms/Popover";
import { Typography } from "@homzhub/common/src/components/atoms/Typography";
import DragAndDrop from "@homzhub/web/src/components/molecules/DragAndDrop";
import MultiCarousel from "@homzhub/web/src/components/molecules/MultiCarousel";
import { NextPrevBtn } from "@homzhub/web/src/components/molecules/NextPrevBtn";
import OverviewCard from "@homzhub/web/src/components/molecules//OverviewCard";
import { deviceBreakpoint } from "@homzhub/common/src/constants/DeviceBreakpoints";

export interface IOverviewCarousalData {
  icon?: string;
  count: number;
  colorCode: string;
  label: string;
  iconColor?: string;
  imageBackgroundColor?: string;
}
interface IProps {
  data: IOverviewCarousalData[];
  onMetricsClicked?: (name: string) => void;
  carouselTitle?: string;
  isVisible?: boolean;
  isActive?: string;
  isCarousel?: boolean;
  isIcon?: boolean;
}

export interface IDragOption {
  icon?: string;
  iconRight?: string;
  checked?: boolean;
  label: string;
  colorCode: string;
  count: number;
  iconColor?: string;
  imageBackgroundColor?: string;
}
const OverviewCarousel: React.FC<IProps> = ({
  data,
  onMetricsClicked,
  carouselTitle,
  isVisible,
  isActive = "",
  isCarousel = true,
  isIcon,
}: IProps) => {
  const [detailsOptions, setDetailsOptions] = useState<IOverviewCarousalData[]>(
    []
  );
  const [selectedCard, setSelectedCard] = useState(isActive);
  const updateOptions = (updatedOptions: IOverviewCarousalData[]): void => {
    setDetailsOptions(cloneDeep(updatedOptions));
  };

  const customCarouselProps: CarouselProps = {
    children: undefined,
    arrows: false,
    draggable: true,
    focusOnSelect: false,
    renderButtonGroupOutside: true,
    customButtonGroup: (
      <CarouselControlsGrp
        carouselTitle={carouselTitle}
        options={detailsOptions}
        updatedOptions={updateOptions}
        isVisible={isVisible}
      />
    ),
    responsive: CarouselResponsive,
  };
  useEffect(() => {
    setDetailsOptions(data);
  }, [data]);
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  const styles = overviewCarousalStyle(isMobile, isCarousel);
  const onSelection = (item: string): void => {
    setSelectedCard(item);
    if (onMetricsClicked) {
      onMetricsClicked(item);
    }
  };

  return (
    <View style={styles.carouselContainer}>
      {isCarousel && (
        <MultiCarousel passedProps={customCarouselProps}>
          {detailsOptions.map((item: IOverviewCarousalData) => {
            const onCardPress = (): void => onSelection(item.label);
            return (
              <Card
                key={item.label}
                data={item}
                onCardSelect={onCardPress}
                isActive={selectedCard === item.label}
              />
            );
          })}
        </MultiCarousel>
      )}
      {!isCarousel && (
        <View style={[propertyDetailsControlStyle.selectionCard]}>
          {detailsOptions.map((item: IOverviewCarousalData) => {
            const onCardPress = (): void => onSelection(item.label);
            return (
              <Card
                key={item.label}
                data={item}
                onCardSelect={onCardPress}
                isActive={selectedCard === item.label}
                isIcon={isIcon}
              />
            );
          })}
        </View>
      )}
    </View>
  );
};
interface IOverviewCarousalStyle {
  container: ViewStyle;
  carouselContainer: ViewStyle;
}
const overviewCarousalStyle = (
  isMobile?: boolean,
  isCarousel?: boolean
): StyleSheet.NamedStyles<IOverviewCarousalStyle> =>
  StyleSheet.create<IOverviewCarousalStyle>({
    container: {
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 8,
      flexDirection: isMobile ? "column" : "row",
      justifyContent: "space-between",
      borderRadius: 4,
      backgroundColor: theme.colors.white,
    },
    carouselContainer: {
      width: isCarousel ? (isMobile ? "100%" : "55%") : undefined,
      marginTop: isMobile ? (!isCarousel ? 12 : 24) : undefined,
      flexDirection: "column-reverse",
    },
  });

interface ICardProps {
  data: IOverviewCarousalData;
  isActive: boolean;
  onCardSelect: () => void;
  icon?: string;
  isIcon?: boolean;
}

const Card = ({
  isActive,
  onCardSelect,
  data,
  isIcon,
}: ICardProps): React.ReactElement => {
  return (
    <Hoverable>
      {(isHovered: boolean): React.ReactNode => (
        <TouchableOpacity
          activeOpacity={100}
          onPress={onCardSelect}
          style={[
            propertyDetailsControlStyle.overViewCard,
            !isIcon && propertyDetailsControlStyle.OverviewCardIcon,
          ]}
        >
          <OverviewCard
            icon={data?.icon ? data?.icon : icons.portfolioFilled}
            count={data.count}
            title={data.label}
            isActive={isActive}
            isHovered={isHovered}
            iconColor={data?.iconColor}
            activeColor={data.colorCode}
            iconBackgroundColor={data.imageBackgroundColor}
            isIcon={isIcon}
          />
        </TouchableOpacity>
      )}
    </Hoverable>
  );
};
const CarouselControlsGrp = ({
  next,
  previous,
  options,
  updatedOptions,
  carouselTitle,
  isVisible,
}: ICarouselControlsGrp & ButtonGroupProps): React.ReactElement => {
  const { t } = useTranslation();
  const detailsOptions = getPropertyDetailsOptions(options);
  const [settingsOptions, setSettingsOptions] =
    useState<IDragOption[]>(detailsOptions);
  const styles = propertyDetailsControlStyle;
  const popupRef = useRef<PopupActions>(null);
  const updateCarouselIndex = (updateIndexBy: number): void => {
    if (updateIndexBy === 1 && next) {
      next();
    } else if (updateIndexBy === -1 && previous) {
      previous();
    }
  };

  const updateOptionsList = (newOptions: IOverviewCarousalData[]): void => {
    if (popupRef && popupRef.current) {
      popupRef.current.close();
    }
    setSettingsOptions(newOptions);
    updatedOptions(newOptions);
  };

  const onSheetClose = (): void => {
    if (popupRef && popupRef.current) {
      popupRef.current.close();
    }
  };
  return (
    <View style={styles.container}>
      <Typography
        variant="text"
        size="small"
        fontWeight="regular"
        style={styles.heading}
      >
        {carouselTitle || t("assetPortfolio:propertyDetails")}
      </Typography>
      <Popover
        content={
          <DragAndDrop
            options={settingsOptions}
            onSavePress={updateOptionsList}
            modalClose={onSheetClose}
          />
        }
        forwardedRef={popupRef}
        popupProps={{
          on: "click",
          closeOnDocumentClick: false,
          arrow: false,
          children: undefined,
          onClose: onSheetClose,
          modal: true,
          lockScroll: true,
        }}
      >
        <>
          {isVisible && (
            <Button
              onPress={() => {
                popupRef.current?.toggle();
              }}
              icon={icons.gearFilled}
              iconSize={16}
              iconColor={theme.colors.blue}
              containerStyle={styles.settings}
              type="secondary"
            />
          )}
        </>
      </Popover>
      <NextPrevBtn onBtnClick={updateCarouselIndex} />
    </View>
  );
};
interface ICarouselControlsGrp {
  options: IOverviewCarousalData[];
  updatedOptions: (options: IOverviewCarousalData[]) => void;
  carouselTitle?: string;
  isVisible?: boolean;
}

const getPropertyDetailsOptions = (
  data: IOverviewCarousalData[]
): IDragOption[] => {
  const settingsOptions: IDragOption[] = [];
  data.forEach((option): void => {
    settingsOptions.push({
      label: option.label,
      icon: option?.icon ? option?.icon : icons.portfolioFilled,
      checked: false,
      colorCode: option.colorCode,
      count: option.count,
      iconColor: option.iconColor,
      imageBackgroundColor: option.imageBackgroundColor,
    });
  });
  return settingsOptions;
};

// region style
const propertyDetailsControlStyle = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 8,
    marginBottom: 8,
  },
  heading: {
    flex: 1,
    color: theme.colors.darkTint1,
  },
  settings: {
    marginHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    width: 32,
    height: 32,
    borderWidth: 0,
    marginLeft: 8,
    backgroundColor: theme.colors.lightGrayishBlue,
  },
  selectionCard: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  overViewCard: {
    padding: 0,
    margin: 0,
  },
  OverviewCardIcon: {
    minWidth: "45%",
  },
});
const CarouselResponsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 1304 },
    items: 3,
    slidesToSlide: 1,
  },
  desktop: {
    breakpoint: { max: 1303, min: 1248 },
    items: 3,
    slidesToSlide: 1,
  },
  tablet: {
    breakpoint: { max: 1248, min: 768 },
    items: 2,
    slidesToSlide: 1,
  },
  mobile: {
    breakpoint: { max: 767, min: 0 },
    items: 1,
    slidesToSlide: 1,
  },
};
export default OverviewCarousel;
