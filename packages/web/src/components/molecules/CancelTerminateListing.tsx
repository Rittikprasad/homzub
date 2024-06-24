import React, { FC, useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { AssetRepository } from '@homzhub/common/src/domain/repositories/AssetRepository';
import { theme } from '@homzhub/common/src/styles/theme';
import { icons } from '@homzhub/common/src/assets/icon';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import CancelTerminateListingForm, {
  ICancelListingFormData,
} from '@homzhub/web/src/components/molecules/CancelTerminateListingForm';
import { IDropdownOption } from '@homzhub/common/src/components/molecules/FormDropdown';
import { PropertyAddressCountry } from '@homzhub/common/src/components/molecules/PropertyAddressCountry';
import { UpdatePropertyFormTypes } from '@homzhub/web/src/screens/portfolio';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import {
  ICancelListingPayload,
  ListingType,
  IClosureReasonPayload,
  IListingParam,
} from '@homzhub/common/src/domain/repositories/interfaces';

interface IProps {
  assetDetails: Asset | null;
  formType: string;
  param: IListingParam | null;
  payload: IClosureReasonPayload | null;
  closeModal: () => void;
  submit: () => void;
}
const CancelTerminateListing: FC<IProps> = (props: IProps) => {
  const { t } = useTranslation();
  const { assetDetails, payload, closeModal, submit, formType } = props;
  const [reasons, setReasons] = useState<IDropdownOption[]>();
  useEffect(() => {
    if (payload !== null) {
      AssetRepository.getClosureReason(payload)
        .then((res) => {
          const formattedData: IDropdownOption[] = [];
          res.forEach((item) => {
            formattedData.push({
              value: item.id,
              label: item.title,
            });
          });
          setReasons(formattedData);
        })
        .catch((err) => {
          AlertHelper.error({ message: ErrorUtils.getErrorMessage(err.details), statusCode: err.details.statusCode });
        });
    }
  }, []);

  // TODO: handle terminatte listing case :Shagun
  const handleSubmit = (formData: ICancelListingFormData): void => {
    if (!assetDetails) return;
    const { reasonId, description } = formData;

    const payloads: ICancelListingPayload = {
      param: {
        listingType:
          assetDetails.assetStatusInfo?.leaseListingId && assetDetails.assetStatusInfo?.leaseListingId > 0
            ? ListingType.LEASE_LISTING
            : ListingType.SALE_LISTING,
        listingId:
          assetDetails.assetStatusInfo?.leaseListingId && assetDetails.assetStatusInfo?.leaseListingId > 0
            ? assetDetails.assetStatusInfo?.leaseListingId
            : assetDetails.assetStatusInfo?.saleListingId ?? 0,
        assetId: assetDetails.id,
      },
      data: {
        cancel_reason: reasonId,
        ...(description && { cancel_description: description }),
      },
    };

    AssetRepository.cancelAssetListing(payloads)
      .then(() => {
        submit();
        updateAsset().then();
      })
      .catch((err) => {
        AlertHelper.error({ message: ErrorUtils.getErrorMessage(err.detail), statusCode: err.details.statusCode });
      });
  };

  const updateAsset = async (): Promise<void> => {
    if (!assetDetails) return;
    const last_visited_step = {
      ...assetDetails.lastVisitedStepSerialized,
      listing: {
        ...assetDetails.lastVisitedStepSerialized.listing,
        type: '',
        is_listing_created: false,
        is_verification_done: false,
        is_services_done: false,
        is_payment_done: false,
      },
    };
    const reqBody = { last_visited_step };
    await AssetRepository.updateAsset(assetDetails.id, reqBody);
  };

  const renderFormOnType = (): React.ReactNode | null => {
    switch (formType) {
      case UpdatePropertyFormTypes.CancelListing:
        return (
          <View style={styles.content}>
            <Text type="small" textType="regular" style={styles.text}>
              {t('property:confirmCancellation')}
            </Text>
            <CancelTerminateListingForm reasonData={reasons} closeModal={closeModal} onSubmit={handleSubmit} />
          </View>
        );
      case UpdatePropertyFormTypes.TerminateListing:
        return null; // TODO:  Terminate listing flow :Shagun
      default:
        return null;
    }
  };

  return (
    <View>
      <View style={styles.headerTitle}>
        <Text type="small" textType="semiBold">
          {t('property:cancelListing')}
        </Text>
        <Button type="text" icon={icons.close} iconSize={16} onPress={closeModal} />
      </View>
      <Divider />
      {assetDetails && (
        <PropertyAddressCountry
          primaryAddress={assetDetails.projectName}
          subAddress={assetDetails.address}
          countryFlag={assetDetails.country.flag}
          containerStyle={styles.address}
        />
      )}
      <Divider containerStyles={styles.address} />
      <View>{renderFormOnType()}</View>
    </View>
  );
};

export default CancelTerminateListing;

const styles = StyleSheet.create({
  headerTitle: {
    marginHorizontal: 24,
    marginVertical: 20,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  address: {
    marginTop: 12,
    marginHorizontal: 24,
  },
  text: {
    color: theme.colors.darkTint3,
    marginHorizontal: 24,
  },
  content: {
    marginTop: 12,
  },
});
