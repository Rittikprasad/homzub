import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { bindActionCreators, Dispatch } from 'redux';
import { connect, ConnectedProps } from 'react-redux';
import { useHistory } from 'react-router';
import { useOnly } from '@homzhub/common/src/utils/MediaQueryUtils';
import { AssetActions } from '@homzhub/common/src/modules/asset/actions';
import { AssetSelectors } from '@homzhub/common/src/modules/asset/selectors';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import LandingNavBar from '@homzhub/web/src/screens/landing/components/LandingNavBar';
import PropertyCardDetails, {
  renderPopUpTypes,
} from '@homzhub/web/src/screens/propertyDetails/components/PropertyCardDetails';
import SimilarProperties from '@homzhub/web/src/screens/propertyDetails/components/SimilarProperties';
import { IGetAssetPayload } from '@homzhub/common/src/modules/asset/interfaces';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

export interface IRouteProps {
  listingId: number;
  assetTransactionType: number;
  popupInitType?: renderPopUpTypes;
}

type Props = PropertyDetailsProps;

const PropertyDetails = (props: Props): React.ReactElement => {
  const { assetDetails, getAsset, isAuthenticated } = props;
  const history = useHistory<IRouteProps>();
  const { location } = history;
  const {
    state: { listingId, assetTransactionType },
  } = location;
  const isLease = Number(assetTransactionType) === 0;
  const isMobile = useOnly(deviceBreakpoint.MOBILE);
  const isTablet = useOnly(deviceBreakpoint.TABLET);

  useEffect(() => {
    const payload: IGetAssetPayload = {
      propertyTermId: listingId,
    };
    getAsset(payload);
    scrollToTop();
  }, [listingId]);

  if (isAuthenticated) {
    return (
      <View style={styles.container}>
        <PropertyCardDetails assetDetails={assetDetails} propertyTermId={listingId} history={history} />
        <View style={[styles.detail, isTablet && styles.detailTab, isMobile && styles.detailMobile]}>
          <SimilarProperties isMobile={isMobile} isTablet={isTablet} propertyTermId={listingId} isLease={isLease} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.containerBg}>
      <LandingNavBar />
      <View style={[styles.mainContent, isMobile && styles.mainContentMobile]}>
        <PropertyCardDetails assetDetails={assetDetails} propertyTermId={listingId} history={history} />
        <View style={[styles.detail, isTablet && styles.detailTab, isMobile && styles.detailMobile]}>
          <SimilarProperties isMobile={isMobile} isTablet={isTablet} propertyTermId={listingId} isLease={isLease} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerBg: {
    backgroundColor: theme.colors.background,
  },
  mainContent: {
    minHeight: 'calc(100vh - 150px)',
    width: theme.layout.dashboardWidth,
    flexDirection: 'column',
    alignSelf: 'center',
    paddingVertical: '2%',
  },
  mainContentMobile: {
    width: theme.layout.dashboardMobileWidth,
  },
  detail: {
    width: '90vw',
  },
  detailMobile: {
    width: 350,
  },
  detailTab: {
    width: 700,
  },
});

const scrollToTop = (): void => {
  setTimeout(() => {
    window.scrollTo(0, 0);
  }, 100);
};

const mapStateToProps = (state: IState): any => {
  return {
    assetDetails: AssetSelectors.getAsset(state),
    isAuthenticated: UserSelector.isLoggedIn(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch): any => {
  const { getAsset } = AssetActions;

  return bindActionCreators(
    {
      getAsset,
    },
    dispatch
  );
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropertyDetailsProps = ConnectedProps<typeof connector>;

export default connector(PropertyDetails);
