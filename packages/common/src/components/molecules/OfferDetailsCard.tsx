import React from 'react';
import { View, FlatList, StyleSheet, ImageStyle, ViewStyle, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { OfferUtils } from '@homzhub/common/src/utils/OfferUtils';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import { OfferSelectors } from '@homzhub/common/src/modules/offers/selectors';
import { RNCheckbox } from '@homzhub/common/src/components/atoms/Checkbox';
import { ImagePlaceholder } from '@homzhub/common/src/components/atoms/ImagePlaceholder';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import { PropertyAddressCountry } from '@homzhub/common/src/components/molecules/PropertyAddressCountry';
import { IFormattedDetails } from '@homzhub/common/src/modules/offers/interfaces';

interface IProps {
  onClickCheckBox: () => void;
  checkBox: boolean;
  isRentFlow?: boolean;
}

const OfferDetails = React.memo((props: IProps): React.ReactElement => {
  const { onClickCheckBox, checkBox, isRentFlow = true } = props;
  const { t } = useTranslation();
  const previousOfferDetailsRent = useSelector(OfferSelectors.getPastProposalsRent);
  const previousOfferDetailsSale = useSelector(OfferSelectors.getPastProposalsSale);
  const isCounterFlow = Boolean(useSelector(OfferSelectors.getCurrentOffer));
  const listing = useSelector(OfferSelectors.getListingDetail);

  const styles = getStyles();

  const formattedDetails = OfferUtils.getFormattedOfferDetails(
    Boolean(isRentFlow),
    isCounterFlow,
    listing,
    previousOfferDetailsRent,
    previousOfferDetailsSale
  );

  const onToggleCheckBox = (): void => onClickCheckBox();

  const renderItem = ({ item, index }: { item: IFormattedDetails; index: number }): React.ReactElement => {
    const style = getStyles(index);
    return (
      <View style={style.detailItem}>
        <Label textType="light" type="large">
          {item.type}
        </Label>
        <Label textType="semiBold" type="large">
          {item.value}
        </Label>
      </View>
    );
  };

  const keyExtractor = (item: IFormattedDetails, index: number): string => `${item} [${index}]`;
  return (
    <View style={PlatformUtils.isWeb() && styles.flatListWeb}>
      <FlatList
        data={formattedDetails}
        renderItem={renderItem}
        numColumns={3}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.flatList}
      />
      {formattedDetails.length > 0 && !isCounterFlow && (
        <RNCheckbox
          selected={checkBox}
          label={t('offers:agreeToOwnerOffers')}
          onToggle={onToggleCheckBox}
          containerStyle={styles.checkBox}
        />
      )}
    </View>
  );
});

const OfferDetailsCard = (props: IProps): React.ReactElement | null => {
  const { onClickCheckBox, checkBox } = props;
  const listing = useSelector(OfferSelectors.getListingDetail);

  if (!listing) return null;

  const {
    id,
    projectName,
    attachments,
    formattedAddressWithCity,
    country: { flag },
  } = listing;

  const styles = getStyles();
  const image = (): React.ReactElement => {
    if (attachments.length)
      return (
        <Image
          source={{ uri: attachments[0].link }}
          width={60}
          height={60}
          style={styles.assetImage}
          borderRadius={4}
        />
      );
    return <ImagePlaceholder width={60} height={60} containerStyle={styles.placeholder} />;
  };
  return (
    <>
      <View key={id} style={[styles.OfferDetailsCard, PlatformUtils.isWeb() && styles.OfferDetailsCardWeb]}>
        <View style={[styles.ownerOfferHeader, PlatformUtils.isWeb() && styles.ownerOfferHeaderWeb]}>
          <View style={styles.flexOne}>{image()}</View>
          <View style={styles.assetAddress}>
            <PropertyAddressCountry
              primaryAddress={projectName}
              countryFlag={flag}
              subAddress={formattedAddressWithCity}
              isIcon
              primaryAddressTextStyles={{
                size: 'small',
              }}
              subAddressTextStyles={{
                variant: 'label',
                size: 'large',
              }}
            />
          </View>
        </View>
        <OfferDetails isRentFlow={listing.isLeaseListing} checkBox={checkBox} onClickCheckBox={onClickCheckBox} />
      </View>
    </>
  );
};

export default React.memo(OfferDetailsCard);

interface IStyles {
  OfferDetailsCard: ViewStyle;
  OfferDetailsCardWeb: ViewStyle;
  ownerOfferHeader: ViewStyle;
  ownerOfferHeaderWeb: ViewStyle;
  assetImage: ImageStyle;
  assetAddress: ViewStyle;
  detailItem: ViewStyle;
  flatList: ViewStyle;
  flatListWeb: ViewStyle;
  placeholder: ViewStyle;
  flexOne: ViewStyle;
  checkBox: ViewStyle;
}

const getStyles = (index = 0): IStyles =>
  StyleSheet.create({
    flexOne: {
      flex: 1,
    },
    OfferDetailsCard: {
      flex: 1,
      backgroundColor: theme.colors.background,
      padding: 16,
    },
    OfferDetailsCardWeb: {
      maxHeight: 320, // FOR WEB
    },
    ownerOfferHeader: {
      flex: 1,
      flexDirection: 'row',
    },
    ownerOfferHeaderWeb: {
      maxHeight: 80, // FOR WEB
    },
    assetImage: {
      flex: 1,
      marginEnd: 12,
    },
    placeholder: {
      flex: 4,
      paddingRight: 3,
      alignSelf: 'center',
      backgroundColor: theme.colors.white,
      marginRight: 5,
    },
    assetAddress: {
      flex: 4,
      paddingRight: 3,
    },
    detailItem: {
      flex: 1,
      marginVertical: 10,
      marginLeft: (index + 1) % 3 ? 0 : 24,
    },
    flatList: {
      marginTop: 10,
    },
    flatListWeb: {
      maxHeight: 200,
    },
    checkBox: {
      marginTop: 10,
    },
  });
