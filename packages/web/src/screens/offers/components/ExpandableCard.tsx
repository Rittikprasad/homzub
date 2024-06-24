import React, { FC, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import PreferenceDetails from '@homzhub/web/src/screens/offers/components/PreferenceDetails';
import PropertyOfferDetails from '@homzhub/web/src/screens/offers/components/PropertyOfferDetails';
import { Asset } from '@homzhub/common/src/domain/models/Asset';

interface IProps {
  property: Asset;
  isCardExpanded: boolean;
  isDetailView?: boolean;
  onViewOffer: () => void;
}
const ExpandableCard: FC<IProps> = (props: IProps) => {
  const {
    property: { offerCount },
    isCardExpanded,
    isDetailView = false,
    property,
    onViewOffer,
  } = props;
  const [isExpanded, setIsExpanded] = useState(isCardExpanded || false);
  const { t } = useTranslation();
  const offerCountHeading = `${offerCount} ${t('common:offers')}`;

  return (
    <>
      <View style={[styles.container]}>
        <View>
          <TouchableOpacity style={[styles.containerHeader]} activeOpacity={!isDetailView ? 0.7 : 1}>
            {!isDetailView && (
              <View style={[styles.justifyContent, isExpanded && styles.countWithIcon]}>
                {!!offerCount && (
                  <View style={styles.offerCount}>
                    <Icon name={icons.offers} color={theme.colors.blue} />
                    <Label textType="semiBold" type="large" style={styles.offerText}>
                      {offerCountHeading}
                    </Label>
                  </View>
                )}
                <>
                  {isExpanded ? (
                    <Icon
                      name={icons.upArrow}
                      size={15}
                      color={theme.colors.blue}
                      onPress={(): void => setIsExpanded(false)}
                    />
                  ) : (
                    <Icon
                      name={icons.downArrow}
                      size={15}
                      color={theme.colors.blue}
                      onPress={(): void => setIsExpanded(true)}
                    />
                  )}
                </>
              </View>
            )}
            <PropertyOfferDetails property={property} isExpanded={isExpanded} />
            {isExpanded && (
              <View>
                <Divider />
                <PreferenceDetails property={property} />
              </View>
            )}
          </TouchableOpacity>
          {isExpanded && (
            <View style={styles.buttonContainer}>
              <Button
                type="primary"
                title={t('offers:viewOffers')}
                containerStyle={styles.button}
                onPress={(): void => onViewOffer()}
              />
            </View>
          )}
        </View>
      </View>
    </>
  );
};

export default ExpandableCard;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: theme.colors.white,
    marginTop: 16,
  },

  button: {
    width: '100%',
    backgroundColor: theme.colors.primaryColor,
    marginHorizontal: 16,
  },

  buttonText: {
    color: theme.colors.active,
  },
  buttonContainer: { marginBottom: 16, width: '90%' },
  containerHeader: {
    padding: 16,
    backgroundColor: theme.colors.white,
    borderRadius: 4,
  },
  justifyContent: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
  },
  offerCount: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    marginVertical: 16,
    borderColor: theme.colors.darkTint10,
  },
  expectationHeading: {
    marginBottom: 20,
  },
  offerText: {
    color: theme.colors.blue,
    marginLeft: 6,
  },
  tintColor: {
    color: theme.colors.darkTint3,
  },
  preferenceContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  separator: {
    width: 60,
    height: 24,
  },
  viewOfferButton: {
    marginTop: 24,
  },
  expectedItem: {
    flex: 2,
  },
  countWithIcon: {
    marginBottom: 15,
  },
  preferenceView: {
    flexDirection: 'row',
    marginVertical: 4,
    flexWrap: 'wrap',
  },
  preferenceContent: {
    flexDirection: 'row-reverse',
    marginLeft: 4,
  },
});
