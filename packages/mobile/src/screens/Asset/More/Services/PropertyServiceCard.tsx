import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ServiceHelper } from '@homzhub/mobile/src/utils/ServiceHelper';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Badge } from '@homzhub/common/src/components/atoms/Badge';
import { Text, Label } from '@homzhub/common/src/components/atoms/Text';
import { IMenu } from '@homzhub/common/src/components/molecules/Menu';
import PropertyCard, { IShieldProps } from '@homzhub/common/src/components/molecules/PropertyCard';
import ServiceCard from '@homzhub/mobile/src/components/molecules/ServiceCard';
import { ShieldGroup } from '@homzhub/mobile/src/components/molecules/ShieldGroup';
import { Asset, ServiceGroup } from '@homzhub/common/src/domain/models/Asset';
import { Attachment } from '@homzhub/common/src/domain/models/Attachment';
import { ServiceOption } from '@homzhub/common/src/constants/Services';

interface IProps {
  data: Asset;
  onAttachmentPress: (attachment: Attachment[]) => void;
}

const PropertyServiceCard = ({ data, onAttachmentPress }: IProps): React.ReactElement => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const {
    valueAddedServices,
    assetStatusInfo,
    groupedBy,
    name,
    country: { flag },
  } = data;
  const isGroupedByAsset = groupedBy === ServiceGroup.ASSET;

  const getMenuOptions = (attachmentLength: number, isUploadAllowed: boolean): IMenu[] => {
    const options = [{ label: t('property:downloadInvoice'), value: ServiceOption.DOWNLOAD_INVOICE }];

    if (attachmentLength > 0) {
      options.unshift({ label: t('property:downloadToDevice'), value: ServiceOption.DOWNLOAD_TO_DEVICE });

      if (isUploadAllowed) {
        options.unshift({ label: t('property:addImageToProperty'), value: ServiceOption.ADD_IMAGE });
      }
    }

    return options;
  };

  const handleSelection = (value: string, attachment: Attachment[], invoice: Attachment): void => {
    ServiceHelper.handleServiceActions(value, data.id, attachment, invoice);
  };

  const renderShieldGroup = (compProps: IShieldProps): React.ReactElement => {
    return <ShieldGroup {...compProps} />;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity disabled={isExpanded} onPress={(): void => setIsExpanded(!isExpanded)}>
        <>
          <TouchableOpacity
            onPress={(): void => setIsExpanded(!isExpanded)}
            style={[styles.header, !isGroupedByAsset && styles.groupStyle]}
          >
            <View style={styles.headerLeft}>
              {!isGroupedByAsset && (
                <>
                  <View style={styles.flagContainer}>{flag}</View>

                  <Text type="regular" textType="semiBold">
                    {name}
                  </Text>
                </>
              )}
              {assetStatusInfo && <Badge title={assetStatusInfo.tag.label} badgeColor={assetStatusInfo.tag.color} />}
              <Icon name={icons.roundFilled} color={theme.colors.darkTint7} size={10} style={styles.separatorIcon} />
              <Icon name={icons.service} size={16} color={theme.colors.primaryColor} />
              <Label type="large" style={styles.count}>
                {valueAddedServices.length}
              </Label>
            </View>
            <Icon name={isExpanded ? icons.upArrow : icons.downArrow} size={16} color={theme.colors.primaryColor} />
          </TouchableOpacity>
          {isGroupedByAsset && (
            <PropertyCard
              asset={data}
              isExpanded={isExpanded}
              isPriceVisible={false}
              isShieldVisible={false}
              isIcon={false}
              containerStyle={styles.propertyCard}
              renderShieldGroup={renderShieldGroup}
            />
          )}
          {isExpanded && (
            <>
              <Text type="small" textType="semiBold" style={styles.serviceHeading}>
                {`Services (${valueAddedServices.length})`}
              </Text>
              {valueAddedServices.map((item, index) => {
                const menuData = getMenuOptions(item.attachment.length, item.isUploadAllowed);
                return (
                  <ServiceCard
                    key={index}
                    service={item}
                    menuOptions={menuData}
                    onSelectOption={(value): void => handleSelection(value, item.attachment, item.invoice.attachment)}
                    onAttachmentPress={(attachments): void => onAttachmentPress(attachments)}
                  />
                );
              })}
            </>
          )}
        </>
      </TouchableOpacity>
    </View>
  );
};

export default PropertyServiceCard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
    paddingTop: 16,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
  },
  propertyCard: {
    margin: 16,
  },
  serviceHeading: {
    color: theme.colors.darkTint3,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  separatorIcon: {
    marginHorizontal: 10,
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
});
