import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Avatar } from '@homzhub/common/src/components/molecules/Avatar';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { ImagePlaceholder } from '@homzhub/common/src/components/atoms/ImagePlaceholder';
import { PropertyAddressCountry } from '@homzhub/common/src/components/molecules/PropertyAddressCountry';
import { RentAndMaintenance } from '@homzhub/common/src/components/molecules/RentAndMaintenance';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { Transaction } from '@homzhub/common/src/domain/models/LeaseTransaction';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

interface IProps {
  asset: Asset;
  isExpanded: boolean;
  onPressCard: () => void;
  handleArrowPress: (id: number) => void;
}

const PropertyCard = (props: IProps): React.ReactElement => {
  const { t } = useTranslation(LocaleConstants.namespacesKey.property);
  const {
    asset: {
      id,
      attachments,
      projectName,
      formattedAddressWithCity,
      country: { flag },
      currencyData,
      leaseTerm,
      saleTerm,
      ownerInfo,
    },
    isExpanded,
    onPressCard,
    handleArrowPress,
  } = props;

  const renderAttachmentView = (): React.ReactNode => {
    const item = attachments.length > 0 ? attachments[0] : null;

    if (!item) return <ImagePlaceholder containerStyle={styles.placeholderImage} />;

    const {
      mediaAttributes: { thumbnailBest, thumbnailHD, thumbnail },
      link,
      mediaType,
    } = item;

    return (
      <>
        {mediaType === 'IMAGE' && (
          <Image
            source={{
              uri: link,
            }}
            style={styles.image}
          />
        )}
        {mediaType === 'VIDEO' && (
          <>
            <Image
              source={{
                uri: thumbnailBest ?? thumbnailHD ?? thumbnail,
              }}
              style={styles.image}
            />
          </>
        )}
      </>
    );
  };

  return (
    <View style={styles.container}>
      <Icon
        size={20}
        style={styles.icon}
        color={theme.colors.blue}
        onPress={(): void => handleArrowPress(id)}
        name={isExpanded ? icons.upArrow : icons.downArrow}
      />
      <TouchableOpacity onPress={onPressCard}>
        <>
          {renderAttachmentView()}
          <PropertyAddressCountry
            countryFlag={flag}
            primaryAddress={projectName}
            subAddress={formattedAddressWithCity}
            containerStyle={styles.addressStyle}
          />
        </>
      </TouchableOpacity>
      {isExpanded && (
        <>
          {ownerInfo && (
            <>
              <Divider containerStyles={styles.divider} />
              <Avatar fullName={ownerInfo.fullName} image={ownerInfo.profilePicture} designation="Owner" />
            </>
          )}
          <Divider containerStyles={styles.divider} />
          <RentAndMaintenance
            currency={currencyData}
            rentData={
              new Transaction(
                leaseTerm ? t('expectedRent') : t('expectedPrice'),
                leaseTerm ? Number(leaseTerm?.expectedPrice) : saleTerm?.actualPrice ?? 0
              )
            }
            depositData={
              new Transaction(
                leaseTerm ? t('expectedPrice') : t('bookingAmount'),
                leaseTerm ? Number(leaseTerm?.securityDeposit) : saleTerm?.actualBookingAmount ?? 0
              )
            }
          />
        </>
      )}
    </View>
  );
};

export default PropertyCard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
    padding: 16,
    marginBottom: 16,
  },
  icon: {
    alignSelf: 'flex-end',
  },
  addressStyle: {
    marginTop: 14,
  },
  divider: {
    marginVertical: 12,
    borderColor: theme.colors.background,
    borderWidth: 1,
  },
  image: {
    marginTop: 12,
    width: '100%',
    height: 200,
  },
  placeholderImage: {
    marginTop: 12,
  },
});
