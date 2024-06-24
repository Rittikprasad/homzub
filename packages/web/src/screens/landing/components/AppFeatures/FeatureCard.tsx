import React, { FC, useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { useDown } from '@homzhub/common/src/utils/MediaQueryUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import HoveredTickOwner from '@homzhub/common/src/assets/images/hoveredTickOwner.svg';
import TickOwnwer from '@homzhub/common/src/assets/images/tickOwner.svg';
import HoveredTickTenant from '@homzhub/common/src/assets/images/hoveredTickTenant.svg';
import TickTenant from '@homzhub/common/src/assets/images/tickTenant.svg';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import { Hoverable } from '@homzhub/web/src/components/hoc/Hoverable';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';
import { IFeatureDataProps, OwnerFeatureData, TenantFeatureData } from '@homzhub/common/src/constants/LandingScreen';

interface ICardprops {
  onDataPress: (image: string) => void;
  isOwner: boolean;
}

const FeatureCard: FC<ICardprops> = (props: ICardprops) => {
  const { onDataPress, isOwner } = props;
  const [selected, setSelected] = useState(new Array(4).fill(false));
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  const isTablet = useDown(deviceBreakpoint.TABLET);
  const styles = cardStyles(isMobile, isTablet);
  const data = isOwner ? OwnerFeatureData : TenantFeatureData;

  useEffect(() => {
    setSelected(new Array(4).fill(false));
  }, [data]);
  return (
    <View style={[styles.card, !isOwner && styles.cardTenant]}>
      {data.map((item: IFeatureDataProps) => {
        const onSelect = (): void => {
          onDataPress(item.image);
          setSelected((prevState) => {
            return prevState.map((_, index) => {
              if (item.id === index) {
                return true;
              }
              return false;
            });
          });
        };
        return (
          <View key={item.id}>
            <Hoverable onHoverIn={onSelect}>
              {(isHovered: boolean): React.ReactNode => (
                <TouchableOpacity onPress={onSelect}>
                  <View style={styles.list}>
                    <View style={styles.textContainer}>
                      <Typography size="regular" style={styles.cardTitle} fontWeight="semiBold">
                        {item.title}
                      </Typography>
                      <Typography size="small" style={styles.cardDescription} fontWeight="regular">
                        {item.description}
                      </Typography>
                    </View>
                    <View style={styles.icon}>
                      {isTablet || isMobile ? (
                        selected[item.id] ? (
                          isOwner ? (
                            <HoveredTickOwner />
                          ) : (
                            <HoveredTickTenant />
                          )
                        ) : isOwner ? (
                          <TickOwnwer />
                        ) : (
                          <TickTenant />
                        )
                      ) : (
                        <View>
                          {isHovered && (isOwner ? <HoveredTickOwner /> : <HoveredTickTenant />)}
                          {!isHovered && (isOwner ? <TickOwnwer /> : <TickTenant />)}
                        </View>
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              )}
            </Hoverable>

            {item.id < 3 && <Divider />}
          </View>
        );
      })}
    </View>
  );
};

export default FeatureCard;

interface ICardStyles {
  card: ViewStyle;
  cardTenant: ViewStyle;
  cardTitle: ViewStyle;
  cardDescription: ViewStyle;
  list: ViewStyle;
  textContainer: ViewStyle;
  icon: ViewStyle;
}
const cardStyles = (isMobile: boolean, isTablet: boolean): StyleSheet.NamedStyles<ICardStyles> =>
  StyleSheet.create<ICardStyles>({
    card: {
      backgroundColor: theme.colors.grey5,
      borderRadius: 8,
      width: !isMobile ? (!isTablet ? '43%' : '72%') : '90%',
      borderTopColor: theme.colors.completed,
      borderTopWidth: 4,
      padding: 24,
      shadowColor: theme.colors.cardShadowDark,
      shadowOffset: { width: 0, height: 42 },
      shadowOpacity: 0.2,
      shadowRadius: 120,
    },
    cardTenant: {
      borderTopColor: theme.colors.primaryColor,
    },

    cardTitle: {
      marginTop: 24,
      color: theme.colors.darkTint1,
    },
    cardDescription: {
      marginTop: 8,
      color: theme.colors.darkTint3,
      marginBottom: 24,
    },
    list: {
      flexDirection: 'row',
      alignItems: 'center',
      width: '100%',
    },
    textContainer: {
      width: '90%',
    },
    icon: {
      width: '10%',
      paddingLeft: '5%',
    },
  });
