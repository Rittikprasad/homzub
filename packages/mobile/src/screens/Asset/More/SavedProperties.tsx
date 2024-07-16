// @ts-noCheck
import React, { ReactElement, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { CommonActions, useFocusEffect } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { DateFormats, DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { PropertyUtils } from '@homzhub/common/src/utils/PropertyUtils';
import { OffersRepository } from '@homzhub/common/src/domain/repositories/OffersRepository';
import { LeadRepository } from '@homzhub/common/src/domain/repositories/LeadRepository';
import { ILeadPayload } from '@homzhub/common/src/domain/repositories/interfaces';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { CommonParamList } from '@homzhub/mobile/src/navigation/Common';
import { AssetActions } from '@homzhub/common/src/modules/asset/actions';
import { SearchActions } from '@homzhub/common/src/modules/search/actions';
import { UserActions } from '@homzhub/common/src/modules/user/actions';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import { SearchSelector } from '@homzhub/common/src/modules/search/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { EmptyState } from '@homzhub/common/src/components/atoms/EmptyState';
import { ImagePlaceholder } from '@homzhub/common/src/components/atoms/ImagePlaceholder';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import { PricePerUnit } from '@homzhub/common/src/components/atoms/PricePerUnit';
import { AssetDetailsImageCarousel, ShieldGroup } from '@homzhub/mobile/src/components';
import { PropertyAddress } from '@homzhub/common/src/components/molecules/PropertyAddress';
import { PropertyAmenities } from '@homzhub/common/src/components/molecules/PropertyAmenities';
import { UserScreen } from '@homzhub/mobile/src/components/HOC/UserScreen';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { Attachment } from '@homzhub/common/src/domain/models/Attachment';
import { IAmenitiesIcons } from '@homzhub/common/src/domain/models/Search';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

type NavigationProps = NavigationScreenProps<CommonParamList, ScreensKeys.SavedPropertiesScreen>;

export const SavedProperties = (props: NavigationProps): React.ReactElement => {
  const { navigation, route } = props;
  const { t } = useTranslation(LocaleConstants.namespacesKey.assetMore);

  // Redux
  const filters = useSelector(SearchSelector.getFilters);
  const wishListedAssets: Asset[] = useSelector(UserSelector.getFavouriteProperties);
  const dispatch = useDispatch();

  // Local States
  const [activeSlide, setActiveSlide] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Local Const
  const transactionType = filters.asset_transaction_type || 0;

  useFocusEffect(
    React.useCallback(() => {
      dispatch(UserActions.getFavouriteProperties());
    }, [])
  );

  useEffect(() => {
    setLoading(false);
  }, []);

  const updateSlide = (currentSlideNumber: number): void => {
    setActiveSlide(currentSlideNumber);
  };

  const onFullScreenToggle = (): void => {
    setIsFullScreen(!isFullScreen);
  };

  const getProspectProfile = async (): Promise<number> => {
    try {
      setLoading(true);
      const response = await OffersRepository.getProspectsInfo();
      setLoading(false);
      return response.id;
    } catch (error) {
      setLoading(false);
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(error.details) });
      return -1;
    }
  };

  const navigateToOffer = (asset: Asset): void => {
    const { leaseNegotiation, saleNegotiation } = asset;
    const hasCreatedOffer = Boolean(leaseNegotiation) || Boolean(saleNegotiation);

    if (hasCreatedOffer) {
      navigateToOffersMadeScreen();
      return;
    }
    dispatch(SearchActions.setFilter({ asset_transaction_type: asset.leaseTerm ? 0 : 1 }));
    dispatch(AssetActions.getAsset({ propertyTermId: asset.leaseTerm ? asset.leaseTerm.id : asset.saleTerm?.id ?? 0 }));
    getProspectProfile().then((hasProspect: number): void => {
      // API Error case
      if (hasProspect === -1) return;
      // No Prospect Case
      if (hasProspect === 0) {
        navigation.navigate(ScreensKeys.ProspectProfile);
        return;
      }
      // Has Prospect case
      if (hasProspect > 0) {
        navigation.navigate(ScreensKeys.SubmitOffer);
      }
    });
  };

  const navigateToSearchScreen = (): void => {
    navigation.navigate(ScreensKeys.BottomTabs, {
      screen: ScreensKeys.Search,
      params: {
        screen: ScreensKeys.PropertySearchScreen,
      },
    });
  };

  const navigateToOffersMadeScreen = (): void => {
    navigation.navigate(ScreensKeys.BottomTabs, {
      screen: ScreensKeys.More,
      params: {
        screen: ScreensKeys.PropertyOfferList,
        initial: false,
        params: {
          isReceivedFlow: false,
        },
      },
    });
  };

  const navigateToProperty = (listingId: number, transaction: number, assetId: number, isActive: boolean): void => {
    if (isActive) {
      dispatch(SearchActions.setFilter({ asset_transaction_type: transaction }));
      navigation.navigate(ScreensKeys.PropertyAssetDescription, { propertyTermId: listingId, propertyId: assetId });
    } else {
      AlertHelper.error({ message: t('property:inValidVisit') });
    }
  };

  const navigateToPropertyVisit = (leaseTermId?: number, saleTermId?: number): void => {
    navigation.dispatch(
      CommonActions.navigate({
        name: ScreensKeys.BookVisit,
        params: {
          ...(leaseTermId && { lease_listing_id: leaseTermId }),
          ...(saleTermId && { sale_listing_id: saleTermId }),
        },
      })
    );
  };

  const getPrice = (asset: Asset): number => {
    const { leaseTerm, saleTerm } = asset;

    if (leaseTerm) {
      return Number(leaseTerm.expectedPrice);
    }
    if (saleTerm) {
      return Number(saleTerm.expectedPrice);
    }
    return 0;
  };

  const removeFromWishList = async (propertyTermId: number | undefined): Promise<void> => {
    const { asset_transaction_type } = filters;
    if (!propertyTermId) return;
    const payload: ILeadPayload = {
      propertyTermId,
      data: {
        lead_type: 'WISHLIST',
        is_wishlisted: false,
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

      dispatch(UserActions.getFavouriteProperties());
    }catch (e: any) {      const error = ErrorUtils.getErrorMessage(e.details);
      AlertHelper.error({ message: error });
    }
  };

  const renderImages = (
    attachments: Attachment[] = [],
    isActive: boolean,
    leaseTermId?: number,
    saleTermId?: number
  ): React.ReactElement => {
    const onCrossPress = (): void => {
      if (isActive) {
        removeFromWishList(leaseTermId ?? saleTermId).then();
      } else {
        AlertHelper.error({ message: t('property:inValidVisit') });
      }
    };

    return (
      <View style={styles.imageContainer}>
        {attachments && attachments.length > 0 ? (
          <AssetDetailsImageCarousel
            enterFullScreen={onFullScreenToggle}
            data={attachments}
            activeSlide={activeSlide}
            updateSlide={updateSlide}
            containerStyles={styles.carouselStyle}
          />
        ) : (
          <ImagePlaceholder containerStyle={styles.imagePlaceHolder} />
        )}
        <Icon
          onPress={onCrossPress}
          style={styles.crossStyle}
          name={icons.circularCrossFilled}
          size={20}
          color={theme.colors.white}
        />
      </View>
    );
  };

  const renderButtonGroup = (asset: Asset): ReactElement => {
    const { nextVisit, leaseTerm, saleTerm, isActive, leaseNegotiation, saleNegotiation } = asset;
    const hasCreatedOffer = Boolean(leaseNegotiation) || Boolean(saleNegotiation);
    const onScheduleVisitPress = (): void => {
      if (isActive) {
        navigateToPropertyVisit(leaseTerm?.id, saleTerm?.id);
      } else {
        AlertHelper.error({ message: t('property:inValidVisit') });
      }
    };

    const onPressMakeAnOffer = (): void => {
      if (isActive) {
        navigateToOffer(asset);
      } else {
        AlertHelper.error({ message: t('property:inValidVisit') });
      }
    };

    return (
      <View style={[nextVisit ? styles.nextVisitContainer : styles.buttonGroup, styles.screenPadding]}>
        <Button
          textType="label"
          textSize="large"
          fontType="semiBold"
          titleStyle={{ ...styles.buttonTextStyle, ...(hasCreatedOffer && styles.seeOfferButton) }}
          containerStyle={{ ...styles.commonButtonStyle, ...(hasCreatedOffer && styles.seeOfferButtonStyle) }}
          title={t(hasCreatedOffer ? 'seeOfferText' : 'makeAnOfferText')}
          type="secondary"
          onPress={onPressMakeAnOffer}
        />
        {!nextVisit ? (
          <Button
            textType="label"
            textSize="large"
            fontType="semiBold"
            titleStyle={styles.buttonTextStyle}
            containerStyle={styles.commonButtonStyle}
            title={t('assetDescription:BookVisit')}
            type="primary"
            onPress={onScheduleVisitPress}
          />
        ) : (
          <View style={styles.nextVisitText}>
            <Label type="small">Site Visit On</Label>
            <Label type="large" textType="semiBold">
              {DateUtils.getDateFromISO(nextVisit.visitDate, DateFormats.DDMMMYYYY_H)}
            </Label>
          </View>
        )}
      </View>
    );
  };

  const screenTitle = route?.params?.screenTitle ? route?.params.screenTitle : t('assetMore:more');

  return (
    <UserScreen title={screenTitle} pageTitle={t('savedProperties')} onBackPress={navigation.goBack} loading={loading}>
      <>
        {wishListedAssets && wishListedAssets.length > 0 ? (
          wishListedAssets.map((asset, index) => {
            const {
              id,
              assetType: { name },
              projectName,
              address,
              blockNumber,
              unitNumber,
              country: { currencies },
              spaces,
              furnishing,
              carpetArea,
              carpetAreaUnit,
              assetGroup: { code },
              leaseTerm,
              saleTerm,
              isActive,
            } = asset;
            const amenitiesData: IAmenitiesIcons[] = PropertyUtils.getAmenities(
              spaces,
              furnishing,
              code,
              carpetArea,
              carpetAreaUnit?.title ?? ''
            );
            const listingId = leaseTerm ? leaseTerm.id : saleTerm?.id ?? 0;
            const transaction = leaseTerm ? 0 : 1;
            return (
              <View style={styles.cardView} key={index}>
                {renderImages(asset.attachments, isActive, asset.leaseTerm?.id, asset.saleTerm?.id)}
                <TouchableOpacity
                  style={styles.screenPadding}
                  onPress={(): void => navigateToProperty(listingId, transaction, id, isActive)}
                >
                  <ShieldGroup propertyType={name} />
                  <PropertyAddress
                    isIcon
                    primaryAddress={projectName}
                    subAddress={address || `${blockNumber ?? ''} ${unitNumber ?? ''}`}
                  />
                  <View style={styles.amenities}>
                    <PricePerUnit
                      price={getPrice(asset)}
                      currency={currencies[0]}
                      unit={transactionType === 0 ? t('common:abbreviatedMonthText') : ''}
                    />
                    <PropertyAmenities data={amenitiesData} direction="row" />
                  </View>
                </TouchableOpacity>
                <Divider containerStyles={styles.dividerStyle} />
                {renderButtonGroup(asset)}
              </View>
            );
          })
        ) : (
          <EmptyState
            title={t('savedPropertiesEmptyText')}
            buttonProps={{ type: 'secondary', title: t('common:searchProperties'), onPress: navigateToSearchScreen }}
            containerStyle={styles.emptyContainer}
          />
        )}
      </>
    </UserScreen>
  );
};

const styles = StyleSheet.create({
  cardView: {
    marginBottom: 12,
    paddingTop: 10,
    paddingBottom: 16,
    backgroundColor: theme.colors.white,
    borderRadius: 4,
  },
  imagePlaceHolder: {
    minHeight: 200,
    backgroundColor: theme.colors.disabled,
  },
  crossStyle: {
    position: 'absolute',
    top: 13,
    right: 22,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 12,
    paddingHorizontal: 10,
  },
  amenities: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nextVisitContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nextVisitText: {
    marginLeft: 30,
  },
  commonButtonStyle: {
    flex: 0,
  },
  seeOfferButtonStyle: {
    borderColor: theme.colors.green,
  },
  buttonTextStyle: {
    marginHorizontal: 20,
  },
  dividerStyle: {
    marginVertical: 16,
  },
  screenPadding: {
    paddingHorizontal: theme.layout.screenPadding,
  },
  carouselStyle: {
    height: 200,
  },
  emptyContainer: {
    paddingVertical: '50%',
  },
  seeOfferButton: {
    color: theme.colors.green,
  },
});
