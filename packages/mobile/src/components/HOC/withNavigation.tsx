import React from 'react';
import { NavigationProp, useNavigation } from '@react-navigation/native';

export interface IWithNavigationProps {
  // Todo (Praharsh) : handle any and optional prop here
  navigation?: NavigationProp<any>;
}

const withNavigation = <T extends {}>(Component: React.ComponentType<T>): React.ComponentType<T> => {
  const WithNavigationComponent = (props: T): React.ReactElement<any> => {
    const navigation = useNavigation();
    return <Component {...props} navigation={navigation} />;
  };
  return WithNavigationComponent;
};

export default withNavigation;
