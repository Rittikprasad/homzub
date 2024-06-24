import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { PopupActions } from 'reactjs-popup/dist/types';
import { Dispatch, bindActionCreators } from 'redux';
import { History } from 'history';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { IWithMediaQuery, withMediaQuery } from '@homzhub/common/src/utils/MediaQueryUtils';
import { PropertyUtils } from '@homzhub/common/src/utils/PropertyUtils';
import { CommonActions } from '@homzhub/common/src/modules/common/actions';
import { OffersRepository } from '@homzhub/common/src/domain/repositories/OffersRepository';
import { IRedirectionDetailsWeb, NavigationService } from '@homzhub/web/src/services/NavigationService';
import { RouteNames } from '@homzhub/web/src/router/RouteNames';
import { SearchSelector } from '@homzhub/common/src/modules/search/selectors';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { ImagePlaceholder } from '@homzhub/common/src/components/atoms/ImagePlaceholder';
import { PricePerUnit } from '@homzhub/common/src/components/atoms/PricePerUnit';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import { AssetDetailsImageCarousel } from '@homzhub/common/src/components/molecules/AssetDetailsImageCarousel';
import { Avatar } from '@homzhub/common/src/components/molecules/Avatar';
import ConfirmationPopup from '@homzhub/web/src/components/molecules/ConfirmationPopup';
import GalleryView from '@homzhub/web/src/components/molecules/GalleryView';
import { PropertyAddressCountry } from '@homzhub/common/src/components/molecules/PropertyAddressCountry';
import { PropertyAmenities } from '@homzhub/common/src/components/molecules/PropertyAmenities';
import { ShieldGroup } from '@homzhub/web/src/components/molecules/ShieldGroupHeader';
import TenancyFormPopover from '@homzhub/web/src/screens/propertyDetails/components/TenancyFormPopover';
import TabSection from '@homzhub/web/src/screens/propertyDetails/components/TabSection';
import SiteVisitsActionsPopover, {
  SiteVisitAction,
} from '@homzhub/web/src/screens/siteVisits/components/SiteVisitsActionsPopover';
import { IRouteProps } from '@homzhub/web/src/screens/propertyDetails';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { IFilter, IAmenitiesIcons } from '@homzhub/common/src/domain/models/Search';
import { UserProfile as UserProfileModel } from '@homzhub/common/src/domain/models/UserProfile';
import { DynamicLinkTypes, RouteTypes } from '@homzhub/web/src/services/constants';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { IBookVisitProps } from '@homzhub/common/src/domain/repositories/interfaces';

export enum renderPopUpTypes {
  tenancy = 'TENANT',
  offer = 'OFFER',
  confirm = 'CONFIRM',
  editOffer = 'EDIT_OFFER',
}

interface IStateProps {
  filters: IFilter;
  userProfile: UserProfileModel;
  isAuthenticated: boolean;
}

interface IDispatchProps {
  setRedirectionDetails: (payload: IRedirectionDetailsWeb) => void;
}

interface IProp {
  assetDetails: Asset | null;
  propertyTermId: number;
  history: History<IRouteProps>;
}
interface IStateData {
  propertyLeaseType: string;
  hasCreatedOffer: boolean;
}

type Props = IProp & IStateProps & IDispatchProps & WithTranslation & IWithMediaQuery;

export class PropertyCardDetails extends React.PureComponent<Props, IStateData> {
  public popupRef: React.RefObject<PopupActions> = React.createRef<PopupActions>();
  public popupRefSiteVisits: React.MutableRefObject<PopupActions | null> = React.createRef<PopupActions>();

  constructor(props: Props) {
    super(props);
    this.state = {
      propertyLeaseType: renderPopUpTypes.tenancy,
      hasCreatedOffer: this.hasCreatedOffersValue(),
    };
  }

  public componentDidMount = (): void => {
    const { isAuthenticated } = this.props;
    if (isAuthenticated) {
      this.getProspectProfile();
    }
  };

  public componentDidUpdate = (): void => {
    const { history } = this.props;
    const { location } = history;
    const { state } = location;
    const { popupInitType } = state;
    if (popupInitType) {
      if (popupInitType === renderPopUpTypes.tenancy) {
        this.onOpenModal();
      } else if (popupInitType === renderPopUpTypes.offer) {
        this.handleMakeAnOffer();
      }
    }
  };

  public render = (): React.ReactNode => {
    const {
      assetDetails,
      filters: { asset_transaction_type },
      userProfile,
      isTablet,
      isMobile,
      isIpadPro,
      t,
      propertyTermId,
      history,
      isAuthenticated,
      setRedirectionDetails,
    } = this.props;
    if (!assetDetails) {
      return null;
    }

    const {
      projectName,
      unitNumber,
      blockNumber,
      address,
      country: { flag },
      carpetArea,
      carpetAreaUnit,
      furnishing,
      spaces,
      assetType,
      leaseTerm,
      saleTerm,
      listedOn,
      contacts: { fullName, profilePicture },
      country: { currencies },
      assetGroup: { code, name },
      isAssetOwner,
    } = assetDetails;
    const propertyType = assetType ? assetDetails.assetType.name : '';
    const propertyTimelineData = PropertyUtils.getPropertyTimelineData(
      name,
      listedOn,
      (leaseTerm?.availableFromDate || saleTerm?.availableFromDate) ?? '',
      asset_transaction_type || 0,
      saleTerm
    );
    const amenitiesData: IAmenitiesIcons[] = PropertyUtils.getAmenities(
      spaces,
      furnishing,
      code,
      carpetArea,
      carpetAreaUnit?.title ?? '',
      true
    );
    const styles = propertyDetailStyle(isMobile, isTablet);
    const { propertyLeaseType, hasCreatedOffer } = this.state;

    const popupDetails = {
      title: t('offers:offerSucessHeader'),
      subTitle: t('offers:offerSucessSubHeader'),
    };

    const backgroundColor = hasCreatedOffer ? theme.colors.reviewCardOpacity : theme.colors.blueOpacity;
    let currencyData = currencies[0];

    if (leaseTerm && leaseTerm.currency) {
      currencyData = leaseTerm.currency;
    }

    if (saleTerm && saleTerm.currency) {
      currencyData = saleTerm.currency;
    }
    const salePrice = saleTerm && Number(saleTerm.expectedPrice) > 0 ? Number(saleTerm.expectedPrice) : 0;
    const price = leaseTerm && leaseTerm.expectedPrice > 0 ? leaseTerm.expectedPrice : salePrice;

    const changePopUpStatus = (datum: string): void => {
      this.setState({ propertyLeaseType: datum });
    };
    const refreshPage = (): void => {
      this.setState({ hasCreatedOffer: true }, () => {
        this.getProspectProfile();
      });
    };

    const onCloseModal = (): void => {
      if (this.popupRefSiteVisits && this.popupRefSiteVisits.current) {
        this.popupRefSiteVisits.current.close();
      }
    };
    const params: IBookVisitProps = {
      ...(leaseTerm && { lease_listing_id: leaseTerm.id }),
      ...(saleTerm && { sale_listing_id: saleTerm.id }),
    };

    const handlePublicFlow = (action: renderPopUpTypes): void => {
      const redirectionDetails = {
        dynamicLinks: {
          routeType: RouteTypes.Public,
          type: DynamicLinkTypes.AssetDescription,
          params: {
            popupInitType: action,
            asset_name: projectName,
            asset_transaction_type,
            propertyTermId,
          },
        },
        shouldRedirect: true,
      };
      setRedirectionDetails(redirectionDetails);
      NavigationService.navigate(history, { path: RouteNames.publicRoutes.LOGIN });
    };
    return (
      <>
        <View style={styles.container}>
          <View style={styles.gallery}>
            {assetDetails?.attachments.length <= 0 && (
              <ImagePlaceholder height="100%" containerStyle={styles.placeholder} />
            )}
            {!isMobile && assetDetails?.attachments.length > 0 && (
              <GalleryView attachments={assetDetails?.attachments ?? []} />
            )}
            {isMobile && <AssetDetailsImageCarousel data={assetDetails.attachments} />}
          </View>
          <View style={styles.cardDetails}>
            <ShieldGroup propertyType={propertyType} isInfoRequired />

            <PropertyAddressCountry
              isIcon
              primaryAddress={projectName}
              countryFlag={flag}
              subAddress={address ?? `${unitNumber} ${blockNumber}`}
              containerStyle={styles.addressStyle}
              primaryAddressTextStyles={{ size: 'regular' }}
            />
            <PricePerUnit
              price={price}
              currency={currencyData}
              unit={asset_transaction_type === 0 ? 'mo' : ''}
              textStyle={styles.pricing}
              textSizeType="large"
            />
            <PropertyAmenities
              data={amenitiesData}
              direction="row"
              containerStyle={styles.amenitiesContainer}
              contentContainerStyle={styles.amenities}
            />
            <Divider />
            <View style={styles.timelineContainer}>{this.renderPropertyTimelines(propertyTimelineData)}</View>
            <Divider />
            <View style={styles.avatar}>
              <Avatar fullName={fullName} imageSize={50} image={profilePicture} designation={t('property:Owner')} />
            </View>
            {!isAssetOwner && <Divider />}
            {!isAssetOwner && (
              <View style={styles.footer}>
                <View style={(isMobile || isTablet || isIpadPro) && styles.enquireContainer}>
                  <Button
                    type="primary"
                    containerStyle={[styles.enquire, { backgroundColor }]}
                    onPress={
                      isAuthenticated ? this.handleMakeAnOffer : (): void => handlePublicFlow(renderPopUpTypes.offer)
                    }
                  >
                    <Icon
                      name={icons.offers}
                      size={24}
                      color={hasCreatedOffer ? theme.colors.green : theme.colors.blue}
                    />
                    <Typography
                      size="small"
                      variant="text"
                      fontWeight="semiBold"
                      style={[styles.textStyleEnquire, hasCreatedOffer && styles.seeOffers]}
                    >
                      {t(hasCreatedOffer ? 'assetMore:seeOfferText' : 'assetMore:makeAnOfferText')}
                    </Typography>
                  </Button>
                </View>
                <View style={(isMobile || isTablet || isIpadPro) && styles.scheduleContainer}>
                  <Button
                    type="primary"
                    containerStyle={[styles.enquire, styles.schedule]}
                    disabled={isAssetOwner}
                    onPress={
                      isAuthenticated ? this.onOpenModal : (): void => handlePublicFlow(renderPopUpTypes.tenancy)
                    }
                  >
                    <Icon name={icons.timer} size={22} color={theme.colors.white} />
                    <Typography size="small" variant="text" fontWeight="semiBold" style={styles.textStyleSchedule}>
                      {t('propertySearch:scheduleVisit')}
                    </Typography>
                  </Button>
                </View>
                <SiteVisitsActionsPopover
                  popupRef={this.popupRefSiteVisits}
                  onCloseModal={onCloseModal}
                  siteVisitActionType={SiteVisitAction.SCHEDULE_VISIT}
                  paramsBookVisit={params}
                />
              </View>
            )}
          </View>
        </View>
        <View style={styles.dividerContainer}>
          <TabSection assetDetails={assetDetails} propertyTermId={propertyTermId} />
        </View>
        <TenancyFormPopover
          userData={userProfile}
          propertyLeaseType={propertyLeaseType}
          popupRef={this.popupRef}
          changePopUpStatus={changePopUpStatus}
          asset={assetDetails}
        />
        {propertyLeaseType === renderPopUpTypes.confirm && (
          <ConfirmationPopup {...popupDetails} refreshPage={refreshPage} />
        )}
      </>
    );
  };

  private renderPropertyTimelines = (data: { label: string; value: string }[]): React.ReactElement => {
    const { isMobile, isTablet } = this.props;
    const styles = propertyDetailStyle(isMobile, isTablet);

    return (
      <>
        {data.map((item: { label: string; value: string }, index: number) => {
          return (
            <View key={index} style={styles.utilityItem}>
              <Label type="large" textType="regular" style={styles.utilityItemText}>
                {item.label}
              </Label>
              <Label type="large" textType="semiBold" style={styles.utilityItemSubText}>
                {item.value}
              </Label>
            </View>
          );
        })}
      </>
    );
  };

  public onOpenModal = (): void => {
    if (this.popupRefSiteVisits && this.popupRefSiteVisits.current) {
      this.popupRefSiteVisits.current.open();
    }
  };

  public handleMakeAnOffer = (): void => {
    const { history } = this.props;
    const { hasCreatedOffer } = this.state;
    if (hasCreatedOffer) {
      NavigationService.navigate(history, {
        path: RouteNames.protectedRoutes.OFFERS,
        params: {
          isReceivedFlow: false,
        },
      });
    } else {
      this.triggerPopUp();
    }
  };

  public triggerPopUp = (): void => {
    if (this.popupRef && this.popupRef.current) {
      this.popupRef.current.open();
    }
  };

  private hasCreatedOffersValue = (): boolean => {
    const { assetDetails } = this.props;
    return Boolean(assetDetails?.leaseNegotiation) || Boolean(assetDetails?.saleNegotiation);
  };

  private getProspectProfile = async (): Promise<void> => {
    try {
      const prospectsData = await OffersRepository.getProspectsInfo();
      if (prospectsData.id) {
        this.setState({ propertyLeaseType: renderPopUpTypes.offer });
      }
    } catch (e) {
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details), statusCode: e.details.statusCode });
    }
  };
}

const propertyCardDetails = withMediaQuery<Props>(PropertyCardDetails);

const mapStateToProps = (state: IState): IStateProps => {
  const { getUserProfile, isLoggedIn } = UserSelector;
  return {
    userProfile: getUserProfile(state),
    filters: SearchSelector.getFilters(state),
    isAuthenticated: isLoggedIn(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { setRedirectionDetails } = CommonActions;
  return bindActionCreators(
    {
      setRedirectionDetails,
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(propertyCardDetails));

interface IPropertyDetailStyles {
  parentContainer: ViewStyle;
  dividerContainer: ViewStyle;
  container: ViewStyle;
  gallery: ViewStyle;
  cardDetails: ViewStyle;
  addressStyle: ViewStyle;
  pricing: ViewStyle;
  amenitiesContainer: ViewStyle;
  amenities: ViewStyle;
  timelineContainer: ViewStyle;
  utilityItem: ViewStyle;
  avatar: ViewStyle;
  footer: ViewStyle;
  enquire: ViewStyle;
  schedule: ViewStyle;
  textStyleEnquire: ViewStyle;
  textStyleSchedule: ViewStyle;
  utilityItemText: ViewStyle;
  utilityItemSubText: ViewStyle;
  placeholder: ViewStyle;
  scheduleContainer: ViewStyle;
  enquireContainer: ViewStyle;
  seeOffers: ViewStyle;
}
const propertyDetailStyle = (
  isMobile?: boolean,
  isTablet?: boolean,
  isIpadPro?: boolean
): StyleSheet.NamedStyles<IPropertyDetailStyles> =>
  StyleSheet.create<IPropertyDetailStyles>({
    parentContainer: {
      flex: 1,
    },
    dividerContainer: {
      marginTop: 24,
      height: 'auto',
    },
    container: {
      backgroundColor: theme.colors.white,
      height: 'fit-content',
      flexDirection: isMobile ? 'column' : 'row',
    },
    gallery: {
      margin: isMobile ? 12 : 20,
      width: !isMobile ? (isTablet ? '40%' : '55%') : '',
      height: isMobile ? 244 : '',
    },
    cardDetails: {
      marginVertical: !isMobile ? 20 : '',
      marginEnd: isMobile ? 12 : 20,
      marginStart: isMobile ? 12 : '',
      width: !isMobile ? (isTablet ? '50%' : '40%') : '',
    },
    addressStyle: {
      width: '100%',
    },
    pricing: {
      marginTop: 20,
    },
    amenitiesContainer: {
      justifyContent: 'flex-start',
      flexWrap: 'wrap',
      marginVertical: 14,
    },
    amenities: {
      marginEnd: 16,
    },
    timelineContainer: {
      paddingVertical: 16,
      flexDirection: 'row',
    },
    utilityItem: {
      marginEnd: '35%',
    },
    avatar: {
      marginVertical: 16,
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: 20,
      width: '100%',
    },
    enquire: {
      height: 44,
      width: !isMobile ? (isTablet || isIpadPro ? '100%' : 216) : '100%',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.darkTint10,
      flexDirection: 'row',
    },
    enquireContainer: {
      width: isMobile ? '47%' : isTablet ? '45%' : '38%',
      marginRight: 18,
    },
    scheduleContainer: {
      width: '60%',
      left: 'auto',
    },
    schedule: {
      width: !isMobile ? (isTablet || isIpadPro ? '85%' : 216) : '82%',
      backgroundColor: theme.colors.primaryColor,
    },

    textStyleEnquire: {
      color: theme.colors.primaryColor,
      marginStart: '5%',
    },
    seeOffers: {
      color: theme.colors.green,
    },
    textStyleSchedule: {
      color: theme.colors.white,
      marginStart: '5%',
    },

    utilityItemText: {
      color: theme.colors.darkTint4,
    },
    utilityItemSubText: {
      color: theme.colors.darkTint2,
    },
    placeholder: {
      backgroundColor: theme.colors.darkTint9,
      height: !isMobile ? 442 : '100%',
    },
  });
