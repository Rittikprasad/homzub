import React from 'react';
import { View, StyleSheet, ViewStyle, TouchableOpacity, TextStyle } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { PopupActions } from 'reactjs-popup/dist/types';
import { IWithMediaQuery, withMediaQuery } from '@homzhub/common/src/utils/MediaQueryUtils';
import { PropertyUtils } from '@homzhub/common/src/utils/PropertyUtils';
import {
  ClosureReasonType,
  IClosureReasonPayload,
  IListingParam,
} from '@homzhub/common/src/domain/repositories/interfaces';
import { SearchSelector } from '@homzhub/common/src/modules/search/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Badge } from '@homzhub/common/src/components/atoms/Badge';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { ImagePlaceholder } from '@homzhub/common/src/components/atoms/ImagePlaceholder';
import { Label, Text } from '@homzhub/common/src/components/atoms/Text';
import ProgressBar from '@homzhub/web/src/components/atoms/ProgressBar';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import { AssetDetailsImageCarousel } from '@homzhub/common/src/components/molecules/AssetDetailsImageCarousel';
import { Avatar } from '@homzhub/common/src/components/molecules/Avatar';
import GalleryView from '@homzhub/web/src/components/molecules/GalleryView';
import GetAppPopup from '@homzhub/web/src/components/molecules/GetAppPopup';
import { PropertyAddressCountry } from '@homzhub/common/src/components/molecules/PropertyAddressCountry';
import { PropertyAmenities } from '@homzhub/common/src/components/molecules/PropertyAmenities';
import { RentAndMaintenance } from '@homzhub/common/src/components/molecules/RentAndMaintenance';
import LatestUpdates from '@homzhub/web/src/screens/dashboard/components/VacantProperties/LatestUpdates';
import TabSection from '@homzhub/web/src/screens/propertyDetailOwner/Components/TabSection';
import { ActionType } from '@homzhub/common/src/domain/models/AssetStatusInfo';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { Filters } from '@homzhub/common/src/domain/models/AssetFilter';
import { IFilter, IAmenitiesIcons } from '@homzhub/common/src/domain/models/Search';
import { User } from '@homzhub/common/src/domain/models/User';
import { IState } from '@homzhub/common/src/modules/interfaces';

interface IStateProps {
  filters: IFilter;
}
interface IProp {
  assetDetails: Asset | null;
  propertyTermId: number;
  isFromTenancies?: boolean;
  onCompleteDetails: (id: number) => void;
  onHandleAction?: (payload: IClosureReasonPayload, param?: IListingParam) => void;
}
interface IUserInfo {
  name: string;
  icon?: string;
  image?: string;
  designation: string;
  designationStyle?: TextStyle;
}

type Props = IProp & IStateProps & WithTranslation & IWithMediaQuery;

export class PropertyCardDetails extends React.PureComponent<Props> {
  private popupRefGetApp = React.createRef<PopupActions>();
  public render = (): React.ReactNode => {
    const {
      assetDetails,
      isTablet,
      isMobile,

      propertyTermId,
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
      assetGroup: { code },
      assetStatusInfo,
      notifications,
      serviceTickets,
    } = assetDetails;

    const amenitiesData: IAmenitiesIcons[] = PropertyUtils.getAmenities(
      spaces,
      furnishing,
      code,
      carpetArea,
      carpetAreaUnit?.title ?? '',
      true
    );
    const styles = propertyDetailStyle(isMobile, isTablet);
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
            {isMobile && (
              <AssetDetailsImageCarousel data={assetDetails.attachments} isAssetOwner={assetDetails?.isAssetOwner} />
            )}
          </View>
          <View style={styles.cardDetails}>
            <View style={styles.subContainer}>
              <Badge
                title={assetStatusInfo?.tag.label ?? ''}
                badgeColor={assetStatusInfo?.tag.color ?? ''}
                badgeStyle={styles.badgeStyle}
              />
              <Icon name={icons.roundFilled} color={theme.colors.darkTint7} size={8} style={styles.dotStyle} />
              <TouchableOpacity style={styles.topLeftView}>
                <Icon name={icons.bell} color={theme.colors.blue} size={18} style={styles.iconStyle} />
                <Label type="large" style={styles.count}>
                  {notifications?.count}
                </Label>
              </TouchableOpacity>
              <Icon name={icons.roundFilled} color={theme.colors.darkTint7} size={8} style={styles.dotStyle} />
              <TouchableOpacity style={styles.topLeftView}>
                <Icon name={icons.headPhone} color={theme.colors.blue} size={18} style={styles.iconStyle} />
                <Label type="large" style={styles.count}>
                  {serviceTickets?.count}
                </Label>
              </TouchableOpacity>
            </View>

            <PropertyAddressCountry
              isIcon
              primaryAddress={projectName}
              countryFlag={flag}
              subAddress={address ?? `${unitNumber} ${blockNumber}`}
              containerStyle={styles.addressStyle}
              primaryAddressTextStyles={{ size: 'regular' }}
            />

            <PropertyAmenities
              data={amenitiesData}
              direction="row"
              containerStyle={styles.amenitiesContainer}
              contentContainerStyle={styles.amenities}
            />

            {this.renderExpandedView()}
          </View>
        </View>
        <View style={styles.dividerContainer}>
          <TabSection assetDetails={assetDetails} propertyTermId={propertyTermId} />
        </View>
        <GetAppPopup popupRef={this.popupRefGetApp} onOpenModal={this.onOpenModal} onCloseModal={this.onCloseModal} />
      </>
    );
  };

  private renderExpandedView = (): React.ReactNode => {
    const { assetDetails, t, isTablet, isMobile } = this.props;
    if (!assetDetails || !assetDetails.assetStatusInfo) return null;

    const {
      assetStatusInfo: {
        action,
        tag: { code },
        leaseListingId,
        saleListingId,
        leaseTenantInfo: { user, isInviteAccepted },
        leaseTransaction: { rent, securityDeposit, totalSpendPeriod, leaseEndDate, leaseStartDate, currency },
      },
      lastVisitedStep: { assetCreation },
    } = assetDetails;
    // eslint-disable-next-line
    const userData: User = user;
    const isListed = (leaseListingId || saleListingId) && code !== Filters.OCCUPIED;
    const userInfo = this.getFormattedInfo(userData, isInviteAccepted);
    const isVacant = code === Filters.VACANT || code === Filters.FOR_RENT || code === Filters.FOR_SALE;
    const isTakeActions = code === Filters.VACANT;
    const styles = propertyDetailStyle(isMobile, isTablet);
    const progress = totalSpendPeriod >= 0 ? totalSpendPeriod : assetCreation.percentage / 100;

    return (
      <>
        <View>
          {!isVacant && (
            <>
              <Divider />
              <View style={styles.avatar}>
                <Avatar
                  isRightIcon
                  onPressRightIcon={this.onOpenModal}
                  fullName={userData.name}
                  image={userData.profilePicture}
                  designation={userInfo.designation}
                  customDesignation={userInfo.designationStyle}
                />
              </View>
            </>
          )}
          <Divider />
          <View>
            {rent && securityDeposit && (
              <>
                <View style={styles.rentAndMaintenanceView}>
                  <RentAndMaintenance currency={currency} rentData={rent} depositData={securityDeposit} />
                </View>
                <Divider />
              </>
            )}
            {!isVacant && (
              <View style={[styles.progressBar]}>
                <ProgressBar
                  progress={totalSpendPeriod || assetCreation.percentage / 100}
                  isPropertyVacant={isVacant}
                  fromDate={leaseStartDate}
                  toDate={leaseEndDate}
                />
              </View>
            )}
          </View>
          {isVacant && assetCreation.percentage < 100 && !action && (
            <View style={styles.expandedContainer}>
              <Text type="small" style={styles.title} textType="semiBold">
                {t('assetPortfolio:detailsCompletionText')}
              </Text>
              <ProgressBar progress={progress} isPropertyVacant={isVacant} isTakeActions={isTakeActions} />
              <Label type="small" textType="semiBold" style={styles.labelStyle}>
                {t('assetPortfolio:addPropertyHighlights')}
              </Label>

              <Button
                type="primary"
                textType="label"
                textSize="regular"
                fontType="semiBold"
                containerStyle={styles.completeButton}
                title={t('assetPortfolio:complete')}
                titleStyle={[styles.buttonTitle, { color: theme.colors.blue }]}
                onPress={this.onCompleteDetails}
              />
            </View>
          )}
          {isListed && (
            <View style={styles.latestUpdates}>
              <LatestUpdates
                propertyVisitsData={assetDetails.listingVisits}
                propertyOffersData={assetDetails.listingOffers}
                propertyDetailTab
              />
            </View>
          )}
          {action && code !== Filters.VACANT && (
            <View style={styles.buttonGroup}>
              <Button
                type="primary"
                textType="label"
                textSize="regular"
                fontType="semiBold"
                containerStyle={[
                  styles.buttonStyle,
                  { backgroundColor: action.color },
                  (action.label === ActionType.CANCEL || action.label === ActionType.TERMINATE) && styles.cancelButton,
                ]}
                title={action.label}
                titleStyle={[
                  styles.buttonTitle,
                  (action.label === ActionType.CANCEL || action.label === ActionType.TERMINATE) && styles.cancelTitle,
                ]}
                onPress={this.onPressAction}
              />
            </View>
          )}
          {action && isTakeActions && (
            <View>
              {assetCreation.percentage < 100 && (
                <View>
                  <View>
                    <Text type="small" style={styles.title} textType="semiBold">
                      {t('assetPortfolio:detailsCompletionText')}
                    </Text>
                    <ProgressBar
                      progress={totalSpendPeriod || assetCreation.percentage / 100}
                      isPropertyVacant={isVacant}
                      isTakeActions={isTakeActions}
                    />
                    <Label type="small" textType="semiBold" style={styles.labelStyle}>
                      {t('assetPortfolio:addPropertyHighlights')}
                    </Label>
                    <Button
                      type="primary"
                      textType="label"
                      textSize="regular"
                      fontType="semiBold"
                      containerStyle={styles.completeButton}
                      title={t('assetPortfolio:complete')}
                      titleStyle={[styles.buttonTitle, { color: theme.colors.blue }]}
                      onPress={this.onCompleteDetails}
                    />
                  </View>
                  <View style={styles.sectionSeperator}>
                    <Typography variant="label" size="regular" style={styles.actionHeader}>
                      {t('assetPortfolio:takeActionsHeader')}
                    </Typography>
                    <Button
                      type="primary"
                      textType="label"
                      textSize="regular"
                      fontType="semiBold"
                      containerStyle={styles.buttonContainer}
                      title={action.label}
                      titleStyle={[styles.buttonTitle, { color: action.color }]}
                      onPress={this.onPressAction}
                    />
                  </View>
                </View>
              )}
              {assetCreation.percentage >= 100 && (
                <View>
                  <Text type="small" style={styles.title} textType="semiBold">
                    {t('Take Actions')}
                  </Text>
                  <Typography variant="label" size="regular" style={styles.actionHeader}>
                    {t('assetPortfolio:takeActionsHeader')}
                  </Typography>
                  <Button
                    type="primary"
                    textType="label"
                    textSize="regular"
                    fontType="semiBold"
                    containerStyle={styles.buttonContainer}
                    title={action.label}
                    titleStyle={[styles.buttonTitle, { color: action.color }]}
                    onPress={this.onPressAction}
                  />
                </View>
              )}
            </View>
          )}
        </View>
      </>
    );
  };

  private onOpenModal = (): void => {
    if (this.popupRefGetApp.current && this.popupRefGetApp.current.open) {
      this.popupRefGetApp.current.open();
    }
  };

  private onCloseModal = (): void => {
    if (this.popupRefGetApp.current && this.popupRefGetApp.current.close) {
      this.popupRefGetApp.current.close();
    }
  };

  private onPressAction = (): void => {
    const { onHandleAction, assetDetails } = this.props;
    if (!assetDetails) {
      return;
    }
    const { assetGroup, country, assetStatusInfo } = assetDetails;
    const { LEASE_LISTING_CANCELLATION, SALE_LISTING_CANCELLATION, LEASE_TRANSACTION_TERMINATION } = ClosureReasonType;
    if (assetStatusInfo) {
      const {
        action,
        leaseListingId,
        leaseTransaction: { id, leaseEndDate },
      } = assetStatusInfo;
      const type =
        action?.label === ActionType.CANCEL
          ? leaseListingId
            ? LEASE_LISTING_CANCELLATION
            : SALE_LISTING_CANCELLATION
          : LEASE_TRANSACTION_TERMINATION;
      const payload = {
        type,
        asset_group: assetGroup.id,
        asset_country: country.id,
      };
      if (onHandleAction) {
        onHandleAction(payload, {
          id,
          endDate: leaseEndDate,
          hasTakeAction: action?.label === ActionType.NEXT,
        });
      }
    }
  };

  private onCompleteDetails = (): void => {
    const { onCompleteDetails, propertyTermId } = this.props;
    onCompleteDetails(propertyTermId);
  };

  private getFormattedInfo = (user: User, isInviteAccepted: boolean): IUserInfo => {
    const { t, isFromTenancies = false, isMobile, isTablet } = this.props;
    const styles = propertyDetailStyle(isMobile, isTablet);

    let icon = isInviteAccepted ? undefined : icons.circularCheckFilled;
    let name = isInviteAccepted ? user.name : user.email;
    let image = isInviteAccepted ? user.profilePicture : undefined;
    let designation = t('property:tenant');
    let designationStyle = isInviteAccepted ? undefined : styles.designation;

    if (isFromTenancies) {
      icon = undefined;
      name = user.name;
      image = user.profilePicture;
      designation = t('property:owner');
      designationStyle = undefined;
    }

    return {
      name,
      designation,
      icon,
      image,
      designationStyle,
    };
  };
}

const propertyCardDetails = withMediaQuery<Props>(PropertyCardDetails);

const mapStateToProps = (state: IState): IStateProps => {
  return {
    filters: SearchSelector.getFilters(state),
  };
};

export default connect(mapStateToProps)(withTranslation()(propertyCardDetails));

interface IPropertyDetailStyles {
  dividerContainer: ViewStyle;
  container: ViewStyle;
  gallery: ViewStyle;
  cardDetails: ViewStyle;
  addressStyle: ViewStyle;
  amenitiesContainer: ViewStyle;
  amenities: ViewStyle;
  avatar: ViewStyle;
  placeholder: ViewStyle;
  badgeStyle: ViewStyle;
  dotStyle: ViewStyle;
  topLeftView: ViewStyle;
  subContainer: ViewStyle;
  count: ViewStyle;
  iconStyle: ViewStyle;
  designation: ViewStyle;
  progressBar: ViewStyle;
  expandedContainer: ViewStyle;
  rentAndMaintenanceView: ViewStyle;
  completeButton: ViewStyle;
  buttonTitle: ViewStyle;
  latestUpdates: ViewStyle;
  buttonGroup: ViewStyle;
  buttonStyle: ViewStyle;
  cancelButton: ViewStyle;
  cancelTitle: ViewStyle;
  sectionSeperator: ViewStyle;
  buttonContainer: ViewStyle;
  actionHeader: ViewStyle;
  title: ViewStyle;
  labelStyle: ViewStyle;
}
const propertyDetailStyle = (isMobile?: boolean, isTablet?: boolean): StyleSheet.NamedStyles<IPropertyDetailStyles> =>
  StyleSheet.create<IPropertyDetailStyles>({
    dividerContainer: {
      marginTop: 24,
      height: 'auto',
    },
    container: {
      backgroundColor: theme.colors.white,
      height: !isMobile ? 482 : 'fit-content',
      flexDirection: isMobile ? 'column' : 'row',
    },
    gallery: {
      margin: isMobile ? 12 : 20,
      width: !isMobile ? (isTablet ? '47%' : '55%') : '',
      height: isMobile ? 244 : '',
    },
    cardDetails: {
      marginVertical: !isMobile ? 20 : '',
      marginEnd: isMobile ? 12 : 20,
      marginStart: isMobile ? 12 : '',
      width: !isMobile ? (isTablet ? '45%' : '40%') : '',
    },
    addressStyle: {
      width: '100%',
    },

    amenitiesContainer: {
      justifyContent: 'flex-start',
      flexWrap: 'wrap',
      marginVertical: 14,
    },
    amenities: {
      marginEnd: 16,
    },

    avatar: {
      marginVertical: 16,
    },

    placeholder: {
      backgroundColor: theme.colors.darkTint9,
      height: !isMobile ? 442 : '100%',
    },
    badgeStyle: {
      minWidth: 75,
      paddingHorizontal: 8,
      paddingVertical: 1,
      alignSelf: 'flex-start',
      letterSpacing: 2,
    },
    dotStyle: {
      marginTop: 8,
      marginHorizontal: 12,
    },
    topLeftView: {
      flexDirection: 'row',
      marginLeft: '10px',
      width: 'fit-content',
      maxWidth: '100%',
    },
    subContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12 },
    count: {
      color: theme.colors.primaryColor,
      marginLeft: 6,
    },
    iconStyle: {
      marginTop: 2,
    },
    designation: {
      color: theme.colors.green,
    },

    progressBar: {
      marginTop: 14,
    },
    rentAndMaintenanceView: {
      marginVertical: 14,
    },
    expandedContainer: {
      top: 12,
    },
    completeButton: {
      flex: 1,
      width: '100%',
      borderRadius: 2,
      marginTop: 24,
      backgroundColor: theme.colors.greenLightOpacity,
      marginBottom: 12,
      padding: 6,
    },
    buttonTitle: {
      marginVertical: 1,
      marginHorizontal: 18,
    },
    latestUpdates: {
      flex: 1,
      marginTop: 16,
    },
    buttonGroup: {
      flexDirection: 'row',
      width: 147,
      height: 33,
      marginTop: 14,
      marginLeft: 'auto',
    },
    buttonStyle: {
      flex: 1,
      width: 310,
      borderRadius: 2,
      marginTop: 24,
      backgroundColor: theme.colors.greenLightOpacity,
      marginBottom: 12,
    },
    cancelButton: {
      flex: 1,
      backgroundColor: theme.colors.ratingLow,
      alignSelf: 'flex-end',
    },
    cancelTitle: {
      marginVertical: 10,
      color: theme.colors.error,
    },
    sectionSeperator: {
      borderColor: theme.colors.background,
      borderTopWidth: 2,
    },
    buttonContainer: {
      width: '100%',
      padding: 6,
      textAlign: 'center',
      backgroundColor: theme.colors.greenLightOpacity,
      marginBottom: 12,
    },
    actionHeader: {
      color: theme.colors.darkTint6,
      marginBottom: 12,
    },
    title: {
      color: theme.colors.darkTint4,
      marginBottom: 12,
    },
    labelStyle: {
      marginLeft: 24,
      color: theme.colors.darkTint6,
    },
  });
