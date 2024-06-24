import React, { FC, useEffect, useState, useRef, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { PopupActions } from 'reactjs-popup/dist/types';
import { useHistory } from 'react-router';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { DateFormats, DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { FunctionUtils } from '@homzhub/common/src/utils/FunctionUtils';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { PropertyUtils } from '@homzhub/common/src/utils/PropertyUtils';
import { OffersRepository } from '@homzhub/common/src/domain/repositories/OffersRepository';
import { LeadRepository } from '@homzhub/common/src/domain/repositories/LeadRepository';
import { IBookVisitProps, ILeadPayload } from '@homzhub/common/src/domain/repositories/interfaces';
import { NavigationService } from '@homzhub/web/src/services/NavigationService';
import { RouteNames } from '@homzhub/web/src/router/RouteNames';
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
import { Loader } from '@homzhub/common/src/components/atoms/Loader';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import { PricePerUnit } from '@homzhub/common/src/components/atoms/PricePerUnit';
import { AssetDetailsImageCarousel } from '@homzhub/common/src/components/molecules/AssetDetailsImageCarousel';
import EstPortfolioValue from '@homzhub/web/src/components/molecules/EstPortfolioValue';
import { PropertyAddress } from '@homzhub/common/src/components/molecules/PropertyAddress';
import { PropertyAmenities } from '@homzhub/common/src/components/molecules/PropertyAmenities';
import { renderPopUpTypes } from 'screens/propertyDetails/components/PropertyCardDetails';
import SiteVisitsActionsPopover, {
  SiteVisitAction,
} from '@homzhub/web/src/screens/siteVisits/components/SiteVisitsActionsPopover';
import TenancyFormPopover from '@homzhub/web/src/screens/propertyDetails/components/TenancyFormPopover';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { Attachment } from '@homzhub/common/src/domain/models/Attachment';
import { IAmenitiesIcons } from '@homzhub/common/src/domain/models/Search';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { IState } from '@homzhub/common/src/modules/interfaces';

// TODO -- saved property metrics integration :Shagun
const SavedProperty: FC = () => {
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

  useEffect(() => {
    dispatch(UserActions.getFavouriteProperties());
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
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(error.details), statusCode: error.details.statusCode });
      return -1;
    }
  };

  const userProfile = useSelector((state: IState) => UserSelector.getUserProfile(state));

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
        setPropertyLeaseType(renderPopUpTypes.tenancy);
        return;
      }
      // Has Prospect case
      if (hasProspect > 0) {
        setPropertyLeaseType(renderPopUpTypes.offer);
      }
      onOpenModalTenancy(); // Open Modal
    });
  };

  const history = useHistory();

  const navigateToOffersMadeScreen = (): void => {
    NavigationService.navigate(history, {
      path: RouteNames.protectedRoutes.OFFERS,
      params: {
        isReceivedFlow: false,
      },
    });
  };

  const navigateToProperty = (listingId: number, transaction: number, projectName: string): void => {
    dispatch(SearchActions.setFilter({ asset_transaction_type: transaction }));
    NavigationService.navigate(history, {
      path: RouteNames.publicRoutes.PROPERTY_DETAIL.replace(':propertyName', `${projectName}`),
      params: { listingId, assetTransactionType: transaction },
    });
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
    } catch (e) {
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details), statusCode: e.details.statusCode });
    }
  };

  const renderButtonGroup = (asset: Asset): ReactElement => {
    const { nextVisit, isActive, leaseNegotiation, saleNegotiation } = asset;
    const hasCreatedOffer = Boolean(leaseNegotiation) || Boolean(saleNegotiation);
    const onScheduleVisitPress = (): void => {
      if (isActive) {
        onOpenModalVisits(); // Open Modal
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
          titleStyle={[styles.buttonTextStyle, hasCreatedOffer && styles.seeOfferButton]}
          containerStyle={[styles.commonButtonStyle, hasCreatedOffer && styles.seeOfferButtonStyle]}
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

  const renderImages = (
    attachments: Attachment[] = [],
    leaseTermId?: number,
    saleTermId?: number
  ): React.ReactElement => {
    const onCrossPress = (): void => {
      removeFromWishList(leaseTermId ?? saleTermId).then();
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

  const popupRefSiteVisits = useRef<PopupActions>(null);

  const onOpenModalVisits = (): void => {
    if (popupRefSiteVisits && popupRefSiteVisits.current) {
      popupRefSiteVisits.current.open();
    }
  };

  const onCloseModalVisits = (): void => {
    if (popupRefSiteVisits && popupRefSiteVisits.current) {
      popupRefSiteVisits.current.close();
    }
  };

  const popupRefTenancy = useRef<PopupActions>(null);

  const onOpenModalTenancy = (): void => {
    if (popupRefTenancy && popupRefTenancy.current) {
      popupRefTenancy.current.open();
    }
  };

  const onCloseModalTenancy = (): void => {
    if (popupRefTenancy && popupRefTenancy.current) {
      popupRefTenancy.current.close();
    }
  };

  const [propertyLeaseType, setPropertyLeaseType] = useState(renderPopUpTypes.tenancy);
  const changePopUpStatus = (datum: string): void => {
    setPropertyLeaseType(datum as renderPopUpTypes);
  };

  const onSuccessCallback = (): void => {
    dispatch(UserActions.getFavouriteProperties());
    onCloseModalVisits();
    onCloseModalTenancy();
  };

  return (
    <View style={styles.container}>
      <View style={styles.overviewContainer}>
        <EstPortfolioValue propertiesCount={5} />
      </View>
      <Loader visible={loading} />
      <View style={styles.propertiesContainer}>
        {wishListedAssets && wishListedAssets.length > 0 ? (
          wishListedAssets.map((asset, index) => {
            const {
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
            const params: IBookVisitProps = {
              ...(leaseTerm && { lease_listing_id: leaseTerm.id }),
              ...(saleTerm && { sale_listing_id: saleTerm.id }),
            };
            return (
              <View style={styles.cardView} key={index}>
                {renderImages(asset.attachments, asset.leaseTerm?.id, asset.saleTerm?.id)}
                <TouchableOpacity
                  style={styles.screenPadding}
                  onPress={(): void => navigateToProperty(listingId, transaction, projectName)}
                >
                  <View style={styles.propertyAddress}>
                    <PropertyAddress
                      isIcon
                      primaryAddress={projectName}
                      subAddress={address || `${blockNumber ?? ''} ${unitNumber ?? ''}`}
                    />
                  </View>
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
                <SiteVisitsActionsPopover
                  popupRef={popupRefSiteVisits}
                  onCloseModal={onCloseModalVisits}
                  siteVisitActionType={SiteVisitAction.SCHEDULE_VISIT}
                  paramsBookVisit={params}
                  onSuccessCallback={onSuccessCallback}
                />
                <TenancyFormPopover
                  popupRef={popupRefTenancy}
                  propertyLeaseType={propertyLeaseType}
                  changePopUpStatus={changePopUpStatus}
                  userData={userProfile}
                  asset={asset}
                  onSuccessCallback={onSuccessCallback}
                />
              </View>
            );
          })
        ) : (
          <EmptyState
            title={t('savedPropertiesEmptyText')}
            buttonProps={{ type: 'secondary', title: t('common:searchProperties'), onPress: FunctionUtils.noop }}
            containerStyle={styles.emptyContainer}
          />
        )}
      </View>
    </View>
  );
};
export default SavedProperty;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    width: '93%',
  },
  overviewContainer: {
    backgroundColor: theme.colors.white,
    maxHeight: 140,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
    borderRadius: 4,
  },
  propertiesContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginVertical: 24,
  },
  cardView: {
    marginBottom: 12,
    marginVertical: 24,
    paddingTop: 10,
    paddingBottom: 16,
    backgroundColor: theme.colors.white,
    borderRadius: 4,
    width: '32%',
  },
  propertyAddress: {
    height: 105,
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
    flex: 1,
    maxWidth: 140,
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
