import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDown } from '@homzhub/common/src/utils/MediaQueryUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import ExpandableCard from '@homzhub/web/src/screens/offers/components/ExpandableCard';
import PreferenceDetails from '@homzhub/web/src/screens/offers/components/PreferenceDetails';
import PropertyOfferDetails from '@homzhub/web/src/screens/offers/components/PropertyOfferDetails';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

interface IProps {
  property: Asset;
  isCardExpanded: boolean;
  onViewOffer: () => void;
}
const PropertyDataCard: FC<IProps> = (props: IProps) => {
  const { property, isCardExpanded, onViewOffer } = props;
  const isTablet = useDown(deviceBreakpoint.TABLET);
  const isMobile = useDown(deviceBreakpoint.MOBILE);

  const { t } = useTranslation();
  return (
    <>
      <View style={[styles.container, isTablet && !isMobile && styles.tabContainer, isMobile && styles.mobContainer]}>
        {!isMobile && (
          <View style={styles.innerContainer}>
            <View style={[!isTablet && styles.rowStyle, styles.marginBottom, isTablet && styles.marginBottomTab]}>
              <PropertyOfferDetails property={property} isExpanded />
              <Divider containerStyles={{ marginBottom: 14 }} />
              <PreferenceDetails property={property} colunm={4} />
            </View>
            <View style={styles.buttonContainer}>
              <Button
                type="primary"
                title={`${t('offers:viewOffers')} (${property.offerCount})`}
                containerStyle={styles.button}
                titleStyle={styles.buttonText}
                onPress={(): void => onViewOffer()}
              />
            </View>
          </View>
        )}
        {isMobile && <ExpandableCard property={property} isCardExpanded={isCardExpanded} onViewOffer={onViewOffer} />}
      </View>
    </>
  );
};

export default PropertyDataCard;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: theme.colors.white,
    marginTop: 16,
  },
  tabContainer: {
    height: 426,
  },
  mobContainer: {
    minHeight: 114,
  },
  marginBottom: {
    marginBottom: 50,
  },
  marginBottomTab: {
    marginBottom: 30,
  },
  button: {
    width: '100%',
    backgroundColor: theme.colors.reminderBackground,
  },
  innerContainer: {
    marginHorizontal: 20,
    marginVertical: 16,
  },
  buttonText: {
    color: theme.colors.active,
  },
  buttonContainer: { bottom: 0, width: '100%', position: 'absolute' },
  rowStyle: {
    flexDirection: 'row',
  },
});
