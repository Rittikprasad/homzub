import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Formik, FormikHelpers, FormikProps } from 'formik';
import { useSelector } from 'react-redux';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { StringUtils } from '@homzhub/common/src/utils/StringUtils';
import { AssetRepository } from '@homzhub/common/src/domain/repositories/AssetRepository';
import { OffersRepository } from '@homzhub/common/src/domain/repositories/OffersRepository';
import { OfferSelectors } from '@homzhub/common/src/modules/offers/selectors';
import { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { EmptyState } from '@homzhub/common/src/components/atoms/EmptyState';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import { TextArea } from '@homzhub/common/src/components/atoms/TextArea';
import { Avatar } from '@homzhub/common/src/components/molecules/Avatar';
import { FormButton } from '@homzhub/common/src/components/molecules/FormButton';
import { FormDropdown, IDropdownOption } from '@homzhub/common/src/components/molecules/FormDropdown';
import { PropertyAddressCountry } from '@homzhub/common/src/components/molecules/PropertyAddressCountry';
import { Offer } from '@homzhub/common/src/domain/models/Offer';
import {
  ClosureReasonType,
  IClosureReasonPayload,
  INegotiationPayload,
  ListingType,
  NegotiationAction,
  NegotiationType,
} from '@homzhub/common/src/domain/repositories/interfaces';

interface IFormData {
  reason: number;
}
interface IPropsWeb {
  onClosePopover: () => void;
}

const initialData = {
  reason: 0,
};

const { LEASE_NEGOTIATION_CANCELLATION, SALE_NEGOTIATION_CANCELLATION } = ClosureReasonType;
const { LEASE_NEGOTIATIONS, SALE_NEGOTIATIONS } = NegotiationType;
const { LEASE_LISTING } = ListingType;

const WithdrawOffer = (props: IPropsWeb): React.ReactElement => {
  const [formData] = useState(initialData);
  const [comment, setComment] = useState<string>('');
  const [reasons, setReasons] = useState<IDropdownOption[]>([]);
  const { onClosePopover } = props;

  // HOOKS START
  const { t } = useTranslation();
  const listingData = useSelector(OfferSelectors.getListingDetail);
  const offerData: Offer | null = useSelector(OfferSelectors.getCurrentOffer);

  const rentPayload = {
    type: ListingType.LEASE_LISTING,
    listingId: listingData?.leaseTerm?.id,
  };
  const salePayload = {
    type: ListingType.SALE_LISTING,
    listingId: listingData?.saleTerm?.id,
  };

  const offerPayload = listingData?.leaseTerm ? rentPayload : salePayload;

  useEffect(() => {
    if (listingData && offerPayload?.listingId) {
      const {
        assetGroup: { id },
        country,
      } = listingData;
      const payload: IClosureReasonPayload = {
        type: offerPayload.type === LEASE_LISTING ? LEASE_NEGOTIATION_CANCELLATION : SALE_NEGOTIATION_CANCELLATION,
        asset_group: id,
        asset_country: country.id,
      };
      AssetRepository.getClosureReason(payload)
        .then((res) => {
          const formattedData = res.map((item) => {
            return {
              label: item.title,
              value: item.id,
            };
          });
          setReasons(formattedData);
        })
        .catch((e) => AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) }));
    }
  }, []);

  // HOOKS END

  if (!offerData || !listingData) return <EmptyState />;

  const {
    user: { name },
    role,
  } = offerData;

  // HANDLERS START

  const onMessageChange = (value: string): void => setComment(value);

  const onSubmit = async (values: IFormData, formActions: FormikHelpers<IFormData>): Promise<void> => {
    if (offerData && offerPayload?.listingId) {
      formActions.setSubmitting(true);
      const { type, listingId } = offerPayload;
      const payload: INegotiationPayload = {
        param: {
          listingType: type,
          listingId,
          negotiationType: type === LEASE_LISTING ? LEASE_NEGOTIATIONS : SALE_NEGOTIATIONS,
          negotiationId: offerData.id,
        },
        data: {
          action: NegotiationAction.CANCEL,
          payload: {
            status_change_reason: values.reason,
            status_change_comment: comment,
          },
        },
      };

      try {
        await OffersRepository.updateNegotiation(payload);
        onClosePopover();
        AlertHelper.success({ message: t('offers:offerCancellationSucess') });
      } catch (e: any) {
        onClosePopover();
        AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
      }
    }
    formActions.setSubmitting(false);
  };

  // HANDLERS END

  return (
    <View>
      <View style={styles.container}>
        <Avatar fullName={name} designation={StringUtils.toTitleCase(role)} />
        <PropertyAddressCountry
          isIcon
          primaryAddress={listingData.projectName}
          subAddress={listingData.address}
          countryFlag={listingData.country.flag}
          containerStyle={styles.verticalStyle}
        />
        <Divider />
        <Formik initialValues={{ ...formData }} onSubmit={onSubmit}>
          {(formProps: FormikProps<IFormData>): React.ReactNode => {
            const isDisabled = formProps.values.reason === 0;
            return (
              <>
                <FormDropdown
                  name="reason"
                  label={t('common:reason')}
                  placeholder={t('offers:cancellationReason')}
                  options={reasons}
                  listHeight={500}
                  formProps={formProps}
                />
                <TextArea
                  value={comment}
                  label={t('offers:additionalComment')}
                  placeholder={t('common:additionalComment')}
                  containerStyle={styles.verticalStyle}
                  onMessageChange={onMessageChange}
                  helpText={t('common:optional')}
                />
                <Label type="large" style={styles.helper}>
                  {t('common:actionNotDone')}
                </Label>
                <FormButton
                  // @ts-ignore
                  onPress={formProps.handleSubmit}
                  formProps={formProps}
                  type="primary"
                  title={t('offers:withdrawOffer')}
                  iconSize={20}
                  icon={icons.circularCrossFilled}
                  iconColor={isDisabled ? theme.colors.white : theme.colors.error}
                  titleStyle={isDisabled ? styles.buttonTitleDisabled : styles.buttonTitle}
                  containerStyle={isDisabled ? styles.buttonDisabled : styles.button}
                  disabled={isDisabled}
                />
              </>
            );
          }}
        </Formik>
      </View>
    </View>
  );
};

export default React.memo(WithdrawOffer);

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  verticalStyle: {
    marginVertical: 16,
  },
  helper: {
    marginTop: 80,
    alignSelf: 'center',
    color: theme.colors.darkTint5,
  },
  button: {
    backgroundColor: theme.colors.redOpacity,
    flexDirection: 'row-reverse',
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonTitle: {
    color: theme.colors.error,
  },
  buttonTitleDisabled: {
    color: theme.colors.white,
  },
  buttonDisabled: {
    backgroundColor: theme.colors.grey4,
    flexDirection: 'row-reverse',
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
