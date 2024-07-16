import React, { FC, useState, useEffect } from 'react';
import { View, StyleSheet, ViewStyle, ImageStyle, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { ButtonGroupProps, CarouselProps } from 'react-multi-carousel';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { AnalyticsHelper } from '@homzhub/common/src/utils/AnalyticsHelper';
import { LeadRepository } from '@homzhub/common/src/domain/repositories/LeadRepository';
import { AnalyticsService } from '@homzhub/common/src/services/Analytics/AnalyticsService';
import { UserActions } from '@homzhub/common/src/modules/user/actions';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Image } from '@homzhub/common/src/components/atoms/Image';
import { ImagePlaceholder } from '@homzhub/common/src/components/atoms/ImagePlaceholder';
import MultiCarousel from '@homzhub/web/src/components/molecules/MultiCarousel';
import { NextPrevBtn } from '@homzhub/web/src/components';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { Attachment } from '@homzhub/common/src/domain/models/Attachment';
import { HeroSectionData } from '@homzhub/common/src/constants/LandingScreen';
import { SearchSelector } from '@homzhub/common/src/modules/search/selectors';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import { ILeadPayload } from '@homzhub/common/src/domain/repositories/interfaces';
import { EventType } from '@homzhub/common/src/services/Analytics/EventType';

interface IProps {
  cardImageCarouselStyle?: ViewStyle;
  cardImageStyle?: ImageStyle;
  imagesArray?: Attachment[];
  leaseId?: number;
  saleId?: number;
  isListView?: boolean;
  assetData?: Asset;
}

const defaultResponsive = {
  desktop: {
    breakpoint: {
      max: 3840,
      min: 0,
    },
    items: 1,
    slidesToSlide: 1,
  },
};

const CardImageCarousel: FC<IProps> = ({
  cardImageCarouselStyle,
  cardImageStyle,
  imagesArray,
  leaseId,
  saleId,
  isListView,
  assetData,
}: IProps) => {
  const [isFavourite, setFavourite] = useState(false);
  const dispatch = useDispatch();

  const properties = useSelector(UserSelector.getFavouritePropertyIds);
  const filters = useSelector(SearchSelector.getFilters);

  useEffect(() => {
    if (properties.length === 0) {
      setFavourite(false);
      return;
    }

    for (let i = 0; i < properties.length; i++) {
      const item = properties[i];
      if (item.leaseListingId && leaseId) {
        if (item.leaseListingId === leaseId) {
          setFavourite(true);
          break;
        }
      } else if (item.saleListingId && saleId) {
        if (item.saleListingId === saleId) {
          setFavourite(true);
          break;
        }
      }

      setFavourite(false);
    }
  }, [properties]);

  const handleFavourite = async (): Promise<void> => {
    const { asset_transaction_type } = filters;
    const payload: ILeadPayload = {
      // @ts-ignore
      propertyTermId: leaseId ?? saleId,
      data: {
        lead_type: 'WISHLIST',
        is_wishlisted: !isFavourite,
        user_search: null,
      },
    };

    try {
      if (asset_transaction_type === 0) {
        // RENT FLOW
        await LeadRepository.postLeaseLeadDetail(payload);
      } else {
        // SALE FLOW
        await LeadRepository.postSaleLeadDetail(payload);
      }
      if (assetData) {
        const trackData = AnalyticsHelper.getPropertyTrackData(assetData);
        AnalyticsService.track(EventType.PropertyShortList, {
          ...trackData,
        });
      }
      dispatch(UserActions.getFavouriteProperties());
    } catch (e: any) {
      AlertHelper.error({ message: e.message, statusCode: e.details.statusCode });
    }
  };

  const getOutLineColor = (): string => {
    if (imagesArray && imagesArray.length === 0) {
      return theme.colors.darkTint5;
    }
    return theme.colors.white;
  };

  if (imagesArray === undefined) {
    return null;
  }
  return (
    <View style={cardImageCarouselStyle}>
      {imagesArray.length !== 0 ? (
        imagesArray.length === 1 ? (
          <View>
            <Image
              style={[styles.image, cardImageStyle]}
              source={{
                uri: imagesArray[0].link,
              }}
            />
          </View>
        ) : (
          <MultiCarousel passedProps={carouselProps}>
            {imagesArray.map((item) => (
              <View key={item.id}>
                <Image
                  style={[styles.image, cardImageStyle]}
                  source={{
                    uri: item.link,
                  }}
                />
              </View>
            ))}
          </MultiCarousel>
        )
      ) : (
        <ImagePlaceholder height={isListView ? 230 : 210} />
      )}
      {!assetData?.isAssetOwner && (
        <TouchableOpacity style={styles.favouriteIcon} onPress={handleFavourite}>
          <Icon
            name={isFavourite ? icons.filledHeart : icons.heartOutline}
            size={20}
            color={isFavourite ? theme.colors.favourite : getOutLineColor()}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

type IIProps = ButtonGroupProps & IProps;

const CarouselButtons = ({ next, previous, leaseId, saleId }: IIProps): React.ReactElement => {
  const [currentImage, setCurrentImage] = useState(0);
  const updateCarouselIndex = (updateIndexBy: number): void => {
    if (updateIndexBy === 1 && next) {
      next();
      if (currentImage === HeroSectionData.length - 1) {
        setCurrentImage(0);
      } else {
        setCurrentImage(currentImage + 1);
      }
    } else if (updateIndexBy === -1 && previous) {
      previous();
      if (currentImage === 0) {
        setCurrentImage(HeroSectionData.length - 1);
      } else {
        setCurrentImage(currentImage - 1);
      }
    }
  };

  return (
    <>
      <NextPrevBtn
        leftBtnProps={{
          icon: icons.leftArrow,
          iconSize: 20,
          iconColor: theme.colors.white,
          containerStyle: [styles.leftRightButtons, styles.leftButton],
        }}
        rightBtnProps={{
          icon: icons.rightArrow,
          iconSize: 20,
          iconColor: theme.colors.white,
          containerStyle: [styles.leftRightButtons, styles.rightButton],
        }}
        onBtnClick={updateCarouselIndex}
      />
    </>
  );
};

const carouselProps: CarouselProps = {
  children: undefined,
  arrows: false,
  autoPlay: false,
  draggable: true,
  focusOnSelect: false,
  infinite: true,
  renderButtonGroupOutside: true,
  customButtonGroup: <CarouselButtons />,
  responsive: defaultResponsive,
  showDots: false,
};

export default CardImageCarousel;

const styles = StyleSheet.create({
  image: {
    flex: 1,
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
  },
  leftRightButtons: {
    borderWidth: 0,
    position: 'absolute',
    width: 'fitContent',
    backgroundColor: theme.colors.transparent,
    top: 100,
  },
  leftButton: {
    left: 0,
  },
  rightButton: {
    right: 0,
  },
  favouriteIcon: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
});
