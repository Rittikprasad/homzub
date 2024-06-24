import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDown } from '@homzhub/common/src/utils/MediaQueryUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import ProfileTag from '@homzhub/common/src/assets/images/profileTag.svg';
import Graph from '@homzhub/common/src/assets/images/graph.svg';
import Bell from '@homzhub/common/src/assets/images/bell.svg';
import HomeCare from '@homzhub/common/src/assets/images/homeCare.svg';
import Folder from '@homzhub/common/src/assets/images/folder.svg';
import FindHome from '@homzhub/common/src/assets/images/findHome.svg';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import { Hoverable } from '@homzhub/web/src/components/hoc/Hoverable';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

const LandingFeatures: FC = () => {
  const { t } = useTranslation();
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  const isTablet = useDown(deviceBreakpoint.TABLET);

  const data = [
    { icon: <HomeCare />, text: t('landing:manageProperties') },
    {
      icon: <ProfileTag />,
      text: t('landing:manageTenant'),
    },
    {
      icon: <FindHome />,
      text: t('landing:findHome'),
    },
    {
      icon: <Bell />,
      text: t('landing:investmentDestination'),
    },
    {
      icon: <Graph />,
      text: t('landing:maximizeReturns'),
    },
    {
      icon: <Folder />,
      text: t('landing:maintainRentalHistory'),
    },
  ];
  const Cards = data.map((item) => {
    return (
      <View key={item.text}>
        <Hoverable key={item.text}>
          {(isHovered: boolean): React.ReactNode => (
            <View
              style={[
                styles.card,
                isMobile && styles.cardMobile,
                !isMobile && isTablet && styles.cardTablet,
                isHovered && styles.activeCard,
              ]}
            >
              <View style={[styles.cardContent, isMobile && styles.cardContentMobile]}>
                <View style={[!isMobile && styles.icon, isMobile && styles.iconMobile, isTablet && styles.iconTablet]}>
                  {item.icon}
                </View>
                <View>
                  <Typography variant="text" size="small" fontWeight="semiBold" style={styles.text}>
                    {item.text}
                  </Typography>
                </View>
              </View>
            </View>
          )}
        </Hoverable>
      </View>
    );
  });

  return (
    <View style={styles.containers}>
      <View style={styles.content}>
        <Typography
          variant={!isMobile ? 'text' : 'label'}
          size={!isMobile ? 'small' : 'large'}
          fontWeight="semiBold"
          style={styles.title}
        >
          {t('landing:features')}
        </Typography>
        <Typography
          variant={!isMobile ? 'title' : 'text'}
          size={isTablet ? 'regular' : 'large'}
          fontWeight="semiBold"
          style={!isMobile ? (!isTablet ? styles.subHeading : styles.subHeadingTab) : styles.subHeadingMobile}
        >
          {t('landing:featureDescription')}
        </Typography>
      </View>

      <View style={[styles.grid, isMobile && styles.gridMobile, !isMobile && isTablet && styles.gridTab]}>{Cards}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  containers: {
    backgroundColor: theme.colors.background,
  },
  cardContent: {
    marginVertical: 50,
    marginHorizontal: 36,
  },
  cardContentMobile: {
    marginHorizontal: 16,
  },
  card: {
    width: '350px',
    height: '204px',
    backgroundColor: theme.colors.cardOpacity,
    margin: '15px',
    alignItems: 'center',
  },
  activeCard: {
    shadowColor: theme.colors.grey4,
    shadowOffset: { width: 0, height: 42 },
    shadowOpacity: 0.2,
    shadowRadius: 120,
  },
  cardMobile: {
    marginBottom: '16px',
    width: '290px',
    height: '190px',
    backgroundColor: theme.colors.cardOpacity,
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
  },

  cardTablet: {
    width: '340px',
    height: '190px',
    backgroundColor: theme.colors.cardOpacity,
    justifyContent: 'center',
  },
  icon: {
    paddingBottom: 22,
    alignItems: 'center',
  },
  iconMobile: {
    paddingBottom: 24,
    alignItems: 'center',
  },
  iconTablet: {
    paddingBottom: 24,
    alignItems: 'center',
  },
  grid: {
    flexDirection: 'row',
    marginHorizontal: '70px',
    flexWrap: 'wrap',
    marginBottom: '7%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridMobile: {
    marginHorizontal: '1px',
  },
  gridTab: {
    marginHorizontal: '6px',
    marginBottom: '4%',
  },

  text: {
    position: 'relative',
    textAlign: 'center',
  },
  title: {
    color: theme.colors.lightGreen,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  subHeading: {
    marginTop: 21,
    marginBottom: 20,
    textAlign: 'center',
    color: theme.colors.darkTint2,
  },
  subHeadingTab: {
    marginTop: 21,
    marginBottom: 40,
    marginHorizontal: 30,
    textAlign: 'center',
    color: theme.colors.darkTint2,
  },
  subHeadingMobile: {
    marginTop: 21,
    marginBottom: 40,
    marginHorizontal: 16,
    textAlign: 'center',
    color: theme.colors.darkTint2,
  },
});

export default LandingFeatures;
