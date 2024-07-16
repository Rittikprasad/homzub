import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { PopupActions } from 'reactjs-popup/dist/types';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { AnalyticsHelper } from '@homzhub/common/src/utils/AnalyticsHelper';
import { useDown } from '@homzhub/common/src/utils/MediaQueryUtils';
import { OffersRepository } from '@homzhub/common/src/domain/repositories/OffersRepository';
import { AnalyticsService } from '@homzhub/common/src/services/Analytics/AnalyticsService';
import { NavigationService } from '@homzhub/web/src/services/NavigationService';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import { icons } from '@homzhub/common/src/assets/icon';
import { RouteNames } from '@homzhub/web/src/router/RouteNames';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import Popover from '@homzhub/web/src/components/atoms/Popover';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import ProspectProfileForm from '@homzhub/web/src/components/molecules/ProspectProfileForm';
import OfferForm from '@homzhub/common/src/components/organisms/OfferForm';
import { renderPopUpTypes } from '@homzhub/web/src/screens/propertyDetails/components/PropertyCardDetails';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { UserProfile as UserProfileModel } from '@homzhub/common/src/domain/models/UserProfile';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';
import { EventType } from '@homzhub/common/src/services/Analytics/EventType';
import { IOfferManagementParam } from '@homzhub/common/src/domain/repositories/interfaces';

interface IProps {
  popupRef: React.RefObject<PopupActions>;
  asset: Asset;
  userData: UserProfileModel;
  propertyLeaseType: string;
  changePopUpStatus: (datum: string) => void;
  onSuccessCallback?: () => void;
}

const TenancyFormPopover: React.FC<IProps> = (props: IProps) => {
  const { asset, userData, popupRef, propertyLeaseType, changePopUpStatus, onSuccessCallback } = props;
  const isAuthenticated = useSelector(UserSelector.isLoggedIn);
  const history = useHistory();
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  const isTablet = useDown(deviceBreakpoint.TABLET);
  const [count, setCount] = useState<number>(0);
  const isRentFlow = asset?.isLeaseListing;
  const isEditData = propertyLeaseType === renderPopUpTypes.editOffer;
  const { t } = useTranslation();
  const onEditProfile = (): void => {
    changePopUpStatus(renderPopUpTypes.editOffer);
  };

  let param: IOfferManagementParam;
  const { isActive } = asset;
  if (asset) {
    param = {
      ...(asset.leaseTerm && { lease_listing_id: asset.leaseTerm.id }),
      ...(asset.saleTerm && { sale_listing_id: asset.saleTerm.id }),
    };
  }
  const getOfferCount = async (): Promise<void> => {
    try {
      const {
        offerLeft: { sale, lease },
      } = await OffersRepository.getOfferData(param);
      setCount(isRentFlow ? lease : sale);
    } catch (err: any) {
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(err.details), statusCode: err.details.statusCode });
    }
  };

  useEffect(() => {
    if (isAuthenticated && isActive) {
      getOfferCount().then();
    }
  }, []);
  const onClosePopover = (): void => {
    if (popupRef && popupRef.current) {
      popupRef.current.close();
    }
  };

  const onSuccess = (): void => {
    if (asset) {
      const trackData = AnalyticsHelper.getPropertyTrackData(asset);
      AnalyticsService.track(EventType.NewOffer, trackData);
      onClosePopover();
      changePopUpStatus('CONFIRM');
      AlertHelper.success({ message: t('offers:offerRequestSuccess') });
      if (onSuccessCallback) {
        onSuccessCallback();
      }
    }
  };

  const navigateToTermsAndConditionScreen = (): void => {
    NavigationService.navigate(history, { path: RouteNames.publicRoutes.TERMS_CONDITION });
  };

  const renderForm = (): React.ReactElement => {
    return (
      <>
        <View style={styles.header}>
          <Typography size="small" fontWeight="regular" style={styles.text}>
            {propertyLeaseType === 'TENANT' || propertyLeaseType === renderPopUpTypes.editOffer
              ? t('offers:prospectProfile')
              : t('offers:submitOffer')}
          </Typography>
          <Button
            icon={icons.close}
            type="text"
            iconSize={20}
            iconColor={theme.colors.darkTint3}
            onPress={onClosePopover}
            containerStyle={styles.closeButton}
          />
        </View>
        <Divider containerStyles={styles.bottomMargin} />
        {propertyLeaseType === renderPopUpTypes.tenancy || propertyLeaseType === renderPopUpTypes.editOffer ? (
          <ProspectProfileForm
            userDetails={userData}
            editData={isEditData}
            isTablet={isTablet}
            isMobile={isMobile}
            onClosePopover={onClosePopover}
            changePopUpStatus={changePopUpStatus}
          />
        ) : (
          <View
            style={[
              styles.popoverContainer,
              isTablet && styles.popoverContainerTablet,
              isMobile && styles.popoverContainer,
            ]}
          >
            <OfferForm
              onPressTerms={navigateToTermsAndConditionScreen}
              onSuccess={onSuccess}
              offersLeft={count}
              isMobileWeb={isMobile}
              onEditProfile={onEditProfile}
            />
          </View>
        )}
      </>
    );
  };

  return (
    <View>
      <Popover
        content={renderForm()}
        popupProps={{
          closeOnDocumentClick: false,
          arrow: false,
          contentStyle: {
            alignItems: 'stretch',
            width: isMobile ? 320 : 400,
            height: 'fit-content',
            padding: 12,
            borderRadius: 8,
          },
          children: undefined,
          modal: true,
          position: 'center center',
          onClose: onClosePopover,
        }}
        forwardedRef={popupRef}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  textContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    top: 42,
  },
  text: {
    paddingTop: 12,
    paddingBottom: 24,
    textAlign: 'center',
  },
  container: {
    backgroundColor: theme.colors.white,
    paddingBottom: 24,
  },
  popoverContainer: {
    height: 500,
  },
  popoverContainerTablet: {
    height: 700,
  },
  header: {
    flexDirection: 'row',
    paddingLeft: 18,
  },
  buttonHeader: {
    flexDirection: 'row-reverse',
    paddingRight: 24,
    paddingTop: 24,
  },
  button: {
    width: '100%',
    height: 44,
    top: 60,
  },
  image: {
    height: 120,
    width: 120,
  },
  passwordConatiner: {
    paddingTop: '15%',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    right: 24,
    top: 12,
    cursor: 'pointer',
  },
  passwordBox: {
    width: '90%',
    margin: 'auto',
    paddingTop: 18,
  },
  bottomMargin: {
    marginBottom: 18,
  },
});

export default TenancyFormPopover;
