import React, { Suspense, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Route, Switch, withRouter } from 'react-router-dom';
import { connect, useDispatch, ConnectedProps } from 'react-redux';
import * as QueryString from 'query-string';
import { CommonActions } from '@homzhub/common/src/modules/common/actions';
import PrivateRoute from '@homzhub/web/src/router/PrivateRoute';
import { RouteNames } from '@homzhub/web/src/router/RouteNames';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import AppLayout from '@homzhub/web/src/screens/appLayout';
import Login from '@homzhub/web/src/screens/login';
import SignUp from '@homzhub/web/src/screens/signUp';
import Landing from '@homzhub/web/src/screens/landing';
import MembershipPlans from '@homzhub/web/src/screens/membershipPlans';
import MicroSite from '@homzhub/web/src/screens/microSite';
import OtpVerification from '@homzhub/web/src/components/organisms/OtpVerification';
import PropertyDetails from '@homzhub/web/src/screens/propertyDetails';
import TermsAndCondition from '@homzhub/web/src/components/staticPages/TermsAndCondition';
import TermsServicesPayment from '@homzhub/web/src/components/staticPages/TermsServicesPayment';
import TermsPropertyManagement from '@homzhub/web/src/components/staticPages/TermsPropertyManagement';
import PrivacyPolicy from '@homzhub/web/src/components/staticPages/PrivacyPolicy';
import MobileVerification from '@homzhub/web/src/components/organisms/MobileVerification';
import ServicePlanDetails from '@homzhub/web/src/screens/landing/components/PlanDetails/ServicePlanDetails';
import Error from '@homzhub/web/src/components/staticPages/ErrorGeneric';
import Error404 from '@homzhub/web/src/components/staticPages/Error404';
import Error504 from '@homzhub/web/src/components/staticPages/Error504';
import FAQ from '@homzhub/web/src/screens/faq';

const AppRouter = (props: AppRouterProps): React.ReactElement => {
  const { isAuthenticated, location } = props;
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(CommonActions.getCountries());
    dispatch(CommonActions.setDeviceCountry('IN'));
  }, []);
  const {
    APP_BASE,
    TERMS_CONDITION,
    TERMS_SERVICES_PAYMENTS,
    TERMS_PROPERTY_MANAGEMENT,
    PRIVACY_POLICY,
    LOGIN,
    SIGNUP,
    OTP_VERIFICATION,
    MOBILE_VERIFICATION,
    MAHARASHTRA_CONNECT,
    SERVICE_PLANS_DETAIL,
    FAQS,
    MEMBERSHIP_PLANS,
    PROPERTY_DETAIL,
    ERROR,
    ERROR504,
    ERROR404,
  } = RouteNames.publicRoutes;
  const { DASHBOARD } = RouteNames.protectedRoutes;
  const { t } = useTranslation();

  const params = QueryString.parse(location.search);
  const { type, routeType, ...rest } = params;
  const dynamicLinkParams = { type, routeType, params: rest };

  return (
    <Suspense fallback={<div style={{ height: '100vh' }}>{t('webLoader:loadingText')}</div>}>
      <Switch>
        <PrivateRoute path={DASHBOARD} component={AppLayout} isAuthenticated={isAuthenticated} />
        <Route
          exact
          path={APP_BASE}
          render={(renderProps): any =>
            Object.keys(dynamicLinkParams).length ? (
              <Landing isAuthenticated={isAuthenticated} dynamicLinkParams={dynamicLinkParams} {...renderProps} />
            ) : (
              <Landing isAuthenticated={isAuthenticated} {...renderProps} />
              // eslint-disable-next-line prettier/prettier
            )
          }
        />
        <Route
          exact
          path={MOBILE_VERIFICATION}
          render={(renderProps): any => <MobileVerification isAuthenticated={isAuthenticated} {...renderProps} />}
        />
        <Route
          exact
          path={OTP_VERIFICATION}
          render={(renderProps): any => <OtpVerification isAuthenticated={isAuthenticated} {...renderProps} />}
        />
        <Route
          exact
          path={SIGNUP}
          render={(renderProps): any => <SignUp isAuthenticated={isAuthenticated} {...renderProps} />}
        />
        <Route
          exact
          path={LOGIN}
          render={(renderProps): any => <Login isAuthenticated={isAuthenticated} {...renderProps} />}
        />
        <Route exact path={MAHARASHTRA_CONNECT} component={MicroSite} />
        <Route exact path={SERVICE_PLANS_DETAIL} component={ServicePlanDetails} />
        <Route exact path={TERMS_CONDITION} component={TermsAndCondition} />
        <Route exact path={PRIVACY_POLICY} component={PrivacyPolicy} />
        <Route exact path={TERMS_SERVICES_PAYMENTS} component={TermsServicesPayment} />
        <Route exact path={TERMS_PROPERTY_MANAGEMENT} component={TermsPropertyManagement} />
        <Route exact path={FAQS} component={FAQ} />
        <Route exact path={MEMBERSHIP_PLANS} component={MembershipPlans} />
        {!isAuthenticated && <Route exact path={PROPERTY_DETAIL} component={PropertyDetails} />}
        <Route exact path={ERROR} component={Error} />
        <Route exact path={ERROR504} component={Error504} />
        <Route exact path={ERROR404} component={Error404} />
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

const connector = connect(mapStateToProps, null);

type AppRouterProps = ConnectedProps<typeof connector>;

export default connector(withRouter(AppRouter));
