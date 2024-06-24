import React from 'react';
import { StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import CardWithCheckbox from '@homzhub/common/src/components/molecules/CardWithCheckbox';
import { ISelectedValueServices, ValueAddedService } from '@homzhub/common/src/domain/models/ValueAddedService';

interface IProps {
  services: ValueAddedService[];
  setValueAddedServices: (payload: ISelectedValueServices) => void;
  isMobile?: boolean;
}

const ServiceView = (props: IProps): React.ReactElement => {
  const { services, setValueAddedServices, isMobile } = props;
  // console.log("🚀 ~ file: ServiceView.tsx ~ line 16 ~ services", JSON.stringify(services))
  const { t } = useTranslation();
  return (
    <>
      {services.length > 0 ? (
        services.map((item: ValueAddedService) => {
          const {
            id,
            priceLabel,
            valueBundle: {
              valueBundleItems,
              label,
              attachment: { link },
            },
            bundlePrice,
            discountedPrice,
          } = item;

          const handleToggle = (value: boolean): void => {
            setValueAddedServices({ id, value });
          };

          return (
            <CardWithCheckbox
              key={id}
              heading={label}
              selected={item.value}
              image={link}
              price={bundlePrice}
              priceLabel={priceLabel}
              discountedPrice={discountedPrice}
              bundleItems={valueBundleItems}
              currency={item.currency}
              containerStyle={styles.cardContainer}
              onToggle={handleToggle}
              isMobile={isMobile}
            />
          );
        })
      ) : (
        <Text style={styles.noResults} type="regular">
          {t('common:noResultsFound')}
        </Text>
      )}
    </>
  );
};

export default ServiceView;

const styles = StyleSheet.create({
  cardContainer: {
    marginBottom: 16,
  },
  noResults: {
    marginTop: 16,
    textAlign: 'center',
  },
});
