import React from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import { RouteNames } from '@homzhub/web/src/router/RouteNames';

export type ProtectedRouteProps = {
  isAuthenticated: boolean;
} & RouteProps;

const PrivateRoute: React.FC<ProtectedRouteProps> = ({ isAuthenticated, ...routeProps }: ProtectedRouteProps) => {
  return isAuthenticated ? <Route {...routeProps} /> : <Redirect to={RouteNames.publicRoutes.LOGIN} />;
};
export default PrivateRoute;
