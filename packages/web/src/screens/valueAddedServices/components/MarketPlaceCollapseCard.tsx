import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Badge } from '@homzhub/common/src/components/atoms/Badge';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import Accordian from '@homzhub/web/src/components/molecules/Accordian';
import PropertyCard from '@homzhub/common/src/components/molecules/PropertyCard';
import ServiceCard from '@homzhub/web/src/screens/valueAddedServices/components/ServicesCard';
import { Asset, ServiceGroup } from '@homzhub/common/src/domain/models/Asset';
import { Attachment } from '@homzhub/common/src/domain/models/Attachment';

const AccordianHeader: React.FC<IAccordionProps> = (props: IAccordionProps) => {
  const { serviceData, isOpen } = props;
  const {
    valueAddedServices,
    assetStatusInfo,
    groupedBy,
    name,
    country: { flag },
  } = serviceData;
  const isGroupedByAsset = groupedBy === ServiceGroup.ASSET;
  return (
    <View style={[styles.header, !isGroupedByAsset && styles.groupStyle]}>
      <View style={styles.headerLeft}>
        {!isGroupedByAsset && (
          <>
            <View style={styles.flagContainer}>{flag}</View>

            <Typography size="regular" variant="text" fontWeight="semiBold">
              {name}
            </Typography>
          </>
        )}
        <View style={styles.servicesInfoContainer}>
          <Icon
            style={styles.icon}
            name={!isOpen ? icons.upArrow : icons.downArrow}
            size={20}
            color={theme.colors.primaryColor}
          />
          {assetStatusInfo && (
            <View style={styles.badge}>
              <Badge title={assetStatusInfo.tag.label} badgeColor={assetStatusInfo.tag.color} />
            </View>
          )}
          <View style={styles.servicesInfo}>
            <Icon name={icons.service} size={16} color={theme.colors.primaryColor} />
            <Typography size="large" variant="label" style={styles.count}>
              {valueAddedServices.length}
            </Typography>
          </View>
        </View>
      </View>
      {isGroupedByAsset && (
        <PropertyCard
          asset={serviceData}
          isExpanded
          isPriceVisible={false}
          isShieldVisible={false}
          isIcon={false}
          containerStyle={styles.propertyCard}
        />
      )}
    </View>
  );
};

const AccordianContent: React.FC<IAccordionProps> = (props: IAccordionProps) => {
  const { serviceData } = props;
  const { valueAddedServices } = serviceData;
  const handleSelection = (value: string, attachmentsSelect: Attachment[], invoiceAttachment: Attachment): void => {}; // TODO: To Acess Multiple Attachments
  const onAttachmentPress = (attachementsArray: Attachment[]): void => {}; // TODO: TO access single attachment.
  return (
    <View>
      <Typography size="small" variant="text" fontWeight="semiBold" style={styles.serviceHeading}>
        {`Services (${valueAddedServices.length})`}
      </Typography>
      {valueAddedServices.map((item, index) => {
        return (
          <ServiceCard
            key={index}
            service={item}
            onSelectOption={(value): void => handleSelection(value, item.attachment, item.invoice.attachment)}
            onAttachmentPress={(attachmentsArgs): void => onAttachmentPress(attachmentsArgs)}
          />
        );
      })}
    </View>
  );
};

interface IProps {
  serviceData: Asset;
}

interface IAccordionProps extends IProps {
  isOpen: boolean;
}

const MarketPlaceCollapseCard: React.FC<IProps> = (props: IProps) => {
  const { serviceData } = props;
  const [isOpen, setIsOpen] = useState(false);
  const toggleAccordion = (): void => {
    setIsOpen(!isOpen);
  };
  return (
    <View style={styles.cardContainer}>
      <Accordian
        headerComponent={<AccordianHeader serviceData={serviceData} isOpen={isOpen} />}
        accordianContent={<AccordianContent serviceData={serviceData} isOpen={isOpen} />}
        onToggle={toggleAccordion}
      />
    </View>
  );
};

export default MarketPlaceCollapseCard;

const styles = StyleSheet.create({
  cardContainer: {
    marginVertical: 28,
  },
  header: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    marginHorizontal: 16,
  },
  propertyCard: {
    margin: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  serviceHeading: {
    color: theme.colors.darkTint3,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'column',
    marginTop: 16,
  },
  count: {
    color: theme.colors.primaryColor,
    marginHorizontal: 4,
  },
  groupStyle: {
    marginBottom: 20,
  },
  flagContainer: {
    marginRight: 14,
  },
  icon: {
    marginLeft: 10,
  },
  servicesInfo: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginTop: 25,
  },
  badge: {
    marginTop: 25,
  },
  servicesInfoContainer: {
    alignItems: 'center',
  },
});
