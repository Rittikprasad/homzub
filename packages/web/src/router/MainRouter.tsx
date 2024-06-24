import React, { lazy, Suspense, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Switch, Redirect } from 'react-router-dom';
import { connect, ConnectedProps, useDispatch, useSelector } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { useUp } from '@homzhub/common/src/utils/MediaQueryUtils';
import PrivateRoute from '@homzhub/web/src/router/PrivateRoute';
import { RouteNames } from '@homzhub/web/src/router/RouteNames';
import { UserActions } from '@homzhub/common/src/modules/user/actions';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import Dashboard from '@homzhub/web/src/screens/dashboard';
import AddPropertyListing from '@homzhub/web/src/screens/addPropertyListing';
import ListedPropertyOffers from '@homzhub/web/src/screens/offers/components/ListedPropertyOffers';
import Profile from '@homzhub/web/src/screens/profile';
import Portfolio from '@homzhub/web/src/screens/portfolio';
import PropertyDetails from '@homzhub/web/src/screens/propertyDetails';
import SearchProperty from '@homzhub/web/src/screens/searchProperty';
import Settings from '@homzhub/web/src/screens/settings';
import ValueAddedServices from '@homzhub/web/src/screens/valueAddedServices';
import SavedProperties from '@homzhub/web/src/screens/savedProperties/index';
import SelectProperty from '@homzhub/web/src/screens/selectProperty';
import SelectServices from '@homzhub/web/src/screens/selectServices';
import PropertyDetailsOwner from '@homzhub/web/src/screens/propertyDetailOwner';
import PropertyVisits from '@homzhub/web/src/screens/siteVisits/PropertyVisits';
import ServiceTickets from '@homzhub/web/src/screens/serviceTickets';
import ServiceTicketDetails from '@homzhub/web/src/screens/serviceTickets/components/ServiceTicketDetails';
import Notifications from '@homzhub/web/src/screens/notifications';
import Offers from '@homzhub/web/src/screens/offers';
import Error404 from '@homzhub/web/src/components/staticPages/Error404';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

// Lazy imports
const Financials = lazy(() => import('@homzhub/web/src/screens/financials'));
const PostProperty = lazy(() => import('@homzhub/web/src/screens/addProperty/index'));
const HelpAndSupport = lazy(() => import('@homzhub/web/src/screens/helpAndSupport'));
const PropertyView = lazy(() => import('@homzhub/web/src/screens/addProperty/index'));

interface IDispatchProps {
  getUserProfile: () => void;
}

const MainRouter = (props: MainRouterProps): React.ReactElement => {
  const { isAuthenticated, getUserProfile } = props;
  const {
    DASHBOARD,
    ADD_PROPERTY,
    PORTFOLIO_ADD_PROPERTY,
    FINANCIALS,
    HELP_SUPPORT,
    ADD_LISTING,
    PORTFOLIO,
    SEARCH_PROPERTY,
    PROPERTY_VIEW,
    PROPERTY_SELECTED,
    VALUE_ADDED_SERVICES,
    SELECT_PROPERTY,
    SELECT_SERVICES,
    SAVED_PROPERTIES,
    PROPERTY_VISITS,
    NOTIFICATIONS,
    SETTINGS,
    PROFILE,
    PROTECTEDERROR404,
    OFFERS,
    OFFERS_LISTED_PROPERTY,
    SERVICE_TICKETS,
    SERVICE_TICKET_DETAILS,
  } = RouteNames.protectedRoutes;
  const { APP_BASE, PROPERTY_DETAIL } = RouteNames.publicRoutes;
  const { t } = useTranslation();
  const isDeskTop = useUp(deviceBreakpoint.DESKTOP);
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(UserSelector.isLoggedIn);

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(UserActions.getUserProfile());
      dispatch(UserActions.getUserPreferences());
    }
  }, [isLoggedIn]);

  return (
    <Suspense fallback={<div>{t('webLoader:loadingText')}</div>}>
      <Switch>
        <PrivateRoute exact path={DASHBOARD} component={Dashboard} isAuthenticated={isAuthenticated} />
        <PrivateRoute exact path={FINANCIALS} component={Financials} isAuthenticated={isAuthenticated} />
        <PrivateRoute exact path={ADD_PROPERTY} component={PostProperty} isAuthenticated={isAuthenticated} />
        <PrivateRoute exact path={HELP_SUPPORT} component={HelpAndSupport} isAuthenticated={isAuthenticated} />
        <PrivateRoute exact path={ADD_LISTING} component={AddPropertyListing} isAuthenticated={isAuthenticated} />
        <PrivateRoute exact path={PORTFOLIO} component={Portfolio} isAuthenticated={isAuthenticated} />
        <PrivateRoute exact path={PORTFOLIO_ADD_PROPERTY} component={PostProperty} isAuthenticated={isAuthenticated} />
        <PrivateRoute exact path={PROPERTY_DETAIL} component={PropertyDetails} isAuthenticated={isAuthenticated} />
        <PrivateRoute exact path={SEARCH_PROPERTY} component={SearchProperty} isAuthenticated={isAuthenticated} />
        <PrivateRoute exact path={PROPERTY_VIEW} component={PropertyView} isAuthenticated={isAuthenticated} />
        <PrivateRoute exact path={SELECT_PROPERTY} component={SelectProperty} isAuthenticated={isAuthenticated} />
        <PrivateRoute exact path={SELECT_SERVICES} component={SelectServices} isAuthenticated={isAuthenticated} />
        <PrivateRoute exact path={SAVED_PROPERTIES} component={SavedProperties} isAuthenticated={isAuthenticated} />
        <PrivateRoute exact path={OFFERS} component={Offers} isAuthenticated={isAuthenticated} />
        <PrivateRoute exact path={PROPERTY_VISITS} component={PropertyVisits} isAuthenticated={isAuthenticated} />
        <PrivateRoute exact path={SERVICE_TICKETS} component={ServiceTickets} isAuthenticated={isAuthenticated} />
        <PrivateRoute
          exact
          path={SERVICE_TICKET_DETAILS}
          component={ServiceTicketDetails}
          isAuthenticated={isAuthenticated}
        />
        <PrivateRoute exact path={NOTIFICATIONS} component={Notifications} isAuthenticated={isAuthenticated} />
        <PrivateRoute
          exact
          path={OFFERS_LISTED_PROPERTY}
          component={ListedPropertyOffers}
          isAuthenticated={isAuthenticated}
        />
        <PrivateRoute
          exact
          path={VALUE_ADDED_SERVICES}
          component={ValueAddedServices}
          isAuthenticated={isAuthenticated}
        />
        <PrivateRoute
          exact
          path={PROPERTY_SELECTED}
          component={PropertyDetailsOwner}
          isAuthenticated={isAuthenticated}
        />
        {!isDeskTop && <PrivateRoute exact path={SETTINGS} component={Settings} isAuthenticated={isAuthenticated} />}
        <PrivateRoute
          exact
          path={PROFILE}
          isAuthenticated={isAuthenticated}
          render={(renderProps): any => <Profile getUserProfile={getUserProfile} {...renderProps} />}
        />
        <PrivateRoute exact path={PROTECTEDERROR404} component={Error404} isAuthenticated={isAuthenticated} />
        <Redirect exact path={APP_BASE} to={DASHBOARD} />
      </Switch>
    </Suspense>
  );
};

const mapStateToProps = (state: any): any => {
  const { isLoggedIn } = UserSelector;
  return {
    isAuthenticated: isLoggedIn(state),
  };
};

export const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { getUserProfile } = UserActions;
  return bindActionCreators({ getUserProfile }, dispatch);
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type MainRouterProps = ConnectedProps<typeof connector>;

export default connector(MainRouter);
