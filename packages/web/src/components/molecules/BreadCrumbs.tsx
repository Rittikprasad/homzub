import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Link } from 'react-router-dom';
import withBreadcrumbs from 'react-router-breadcrumbs-hoc';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import { Hoverable } from '@homzhub/web/src/components/hoc/Hoverable';
import { routesConfig } from '@homzhub/web/src/components/molecules/NavigationInfo/constants';

// TODO : (bishal) add types here
// @ts-ignore
// eslint-disable-next-line react/prop-types,@typescript-eslint/explicit-function-return-type
const Breadcrumbs = ({ breadcrumbs }) => {
  const linkStyle = { textDecoration: 'none' };
  const breakWords = (data: any): string => {
    const {
      props: { children },
    } = data;
    const res = children.split('&').join(' & ');
    return res;
  };
  const { location } = breadcrumbs[0];
  const { params } = { ...location.state, params: location.state?.params || null };

  if (params) {
    breadcrumbs.splice(-1);
  }

  return (
    <View style={styles.breadCrumbsContainer}>
      {breadcrumbs.map(({ breadcrumb, match }: any, index: number) => (
        <View key={match.url} style={index === 0 ? styles.firstBreadCrumb : styles.breadCrumbs}>
          <Hoverable>
            {(isHovered: boolean): React.ReactNode => (
              <Link to={match.url || ''} style={linkStyle}>
                <Typography variant="label" size="regular" style={[styles.link, isHovered && styles.activeLink]}>
                  {breakWords(breadcrumb)}
                </Typography>
              </Link>
            )}
          </Hoverable>
          {
            // eslint-disable-next-line react/prop-types
            index < breadcrumbs.length - 1 && (
              <Icon name={icons.rightArrow} color={theme.colors.white} style={styles.dividerIcon} />
            )
          }
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  link: {
    color: theme.colors.white,
    textDecorationLine: 'none',
    textTransform: 'capitalize',
  },
  activeLink: {
    textDecorationLine: 'underline',
    textDecorationColor: theme.colors.white,
  },
  dividerIcon: {
    marginHorizontal: 8,
  },
  breadCrumbsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  firstBreadCrumb: {
    display: 'none',
  },
  breadCrumbs: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default withBreadcrumbs(routesConfig)(Breadcrumbs);
