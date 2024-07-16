import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Formik, FormikHelpers, FormikProps } from 'formik';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { StringUtils } from '@homzhub/common/src/utils/StringUtils';
import { AssetRepository } from '@homzhub/common/src/domain/repositories/AssetRepository';
import { OffersRepository } from '@homzhub/common/src/domain/repositories/OffersRepository';
import { OfferSelectors } from '@homzhub/common/src/modules/offers/selectors';
import { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { EmptyState } from '@homzhub/common/src/components/atoms/EmptyState';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import { Loader } from '@homzhub/common/src/components/atoms/Loader';
import { TextArea } from '@homzhub/common/src/components/atoms/TextArea';
import { Avatar } from '@homzhub/common/src/components/molecules/Avatar';
import { FormButton } from '@homzhub/common/src/components/molecules/FormButton';
import { FormDropdown, IDropdownOption } from '@homzhub/common/src/components/molecules/FormDropdown';
import { PropertyAddressCountry } from '@homzhub/common/src/components/molecules/PropertyAddressCountry';
import { Offer } from '@homzhub/common/src/domain/models/Offer';
import {
  INegotiationPayload,
  ListingType,
  NegotiationAction,
  NegotiationType,
  ClosureReasonType,
  IClosureReasonPayload,
} from '@homzhub/common/src/domain/repositories/interfaces';
import { ICurrentOffer } from '@homzhub/common/src/modules/offers/interfaces';

interface IPropsApp {
  goBack: () => void;
  setIsLoading: (value: boolean) => void;
}
interface IPropsWeb {
  onClosePopover: () => void;
}

interface IFormData {
  reason: number;
}

const RejectOfferForm: React.FC<IPropsApp | IPropsWeb> = (props: IPropsApp | IPropsWeb) => {
  const { goBack, setIsLoading } = props as IPropsApp;
  const { onClosePopover } = props as IPropsWeb;
  const [isLoadingWeb, setIsLoadingWeb] = useState(false);
  const [reasons, setReasons] = useState<IDropdownOption[]>([]);
  const listingData = useSelector(OfferSelectors.getListingDetail);
  const offerData: Offer | null = useSelector(OfferSelectors.getCurrentOffer);
  const offerPayload: ICurrentOffer | null = useSelector(OfferSelectors.getOfferPayload);
  const initialData = {
    reason: 0,
  };
  const { LEASE_LISTING } = ListingType;
  const [formData] = useState(initialData);
  const [comment, setComment] = useState('');
  const { t } = useTranslation();
  const {
    user: { name },
    role,
  } = offerData || { user: { name: '' }, role: '' };
  const { LEASE_NEGOTIATIONS, SALE_NEGOTIATIONS } = NegotiationType;
  const { LEASE_NEGOTIATION_REJECTION, SALE_NEGOTIATION_REJECTION } = ClosureReasonType;
  const isWeb = PlatformUtils.isWeb();
  // HOOKS START

  useEffect(() => {
    if (listingData && offerPayload) {
      const {
        assetGroup: { id },
        country,
      } = listingData;
      const payload: IClosureReasonPayload = {
        type: offerPayload.type === LEASE_LISTING ? LEASE_NEGOTIATION_REJECTION : SALE_NEGOTIATION_REJECTION,
        asset_group: id,
        asset_country: country.id,
      };
      if (isWeb) {
        setIsLoadingWeb(true);
      } else if (setIsLoading) {
        setIsLoading(true);
      }
      AssetRepository.getClosureReason(payload)
        .then((res) => {
          const formattedData = res.map((item) => {
            return {
              label: item.title,
              value: item.id,
            };
          });
          setReasons(formattedData);
          if (isWeb) {
            setIsLoadingWeb(false);
          } else if (setIsLoading) {
            setIsLoading(false);
          }
        })
        .catch((e) => {
          if (isWeb) {
            setIsLoadingWeb(false);
          } else if (setIsLoading) {
            setIsLoading(false);
          }
          AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
        });
    }
  }, []);

  // HOOKS END

  const handleSubmit = async (values: IFormData, formActions: FormikHelpers<IFormData>): Promise<void> => {
    if (offerData && offerPayload) {
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
          action: NegotiationAction.REJECT,
          payload: {
            status_change_reason: values.reason,
            status_change_comment: comment,
          },
        },
      };

      try {
        await OffersRepository.updateNegotiation(payload);
        if (!isWeb && goBack) {
          goBack();
        } else if (onClosePopover) {
          onClosePopover();
        }
        AlertHelper.success({ message: t('offers:offerRejectedSuccess') });
      }catch (e: any) {        if (onClosePopover) {
          onClosePopover();
        }
        AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
      }
    }
    formActions.setSubmitting(false);
  };

  if (!offerData || !listingData) return <EmptyState />;
  return (
    <View style={[styles.container]}>
      {isWeb && <Loader visible={isLoadingWeb} />}
      <Avatar fullName={name} designation={StringUtils.toTitleCase(role)} />
      <PropertyAddressCountry
        isIcon
        primaryAddress={listingData.projectName}
        subAddress={listingData.formattedAddressWithCity}
        countryFlag={listingData.country.flag}
        containerStyle={styles.verticalStyle}
      />
      <Divider />
      <Formik initialValues={{ ...formData }} onSubmit={handleSubmit}>
        {(formProps: FormikProps<IFormData>): React.ReactNode => {
          const isDisabled = formProps.values.reason === 0;
          return (
            <>
              <FormDropdown
                name="reason"
                label={t('common:reason')}
                placeholder={t('offers:rejectReason')}
                options={reasons}
                listHeight={500}
                formProps={formProps}
              />
              <TextArea
                value={comment}
                label={t('assetDescription:description')}
                placeholder={t('common:additionalComment')}
                containerStyle={[styles.verticalStyle]}
                onMessageChange={(value): void => setComment(value)}
                helpText={t('common:optional')}
              />
              <Label type="large" style={[styles.helper, isWeb && styles.helperWeb]}>
                {t('common:actionNotDone')}
              </Label>
              <FormButton
                // @ts-ignore
                onPress={formProps.handleSubmit}
                formProps={formProps}
                type="primary"
                title={t('offers:rejectThisOffer')}
                iconSize={20}
                icon={icons.circularCrossFilled}
                iconColor={isDisabled ? theme.colors.white : theme.colors.error}
                titleStyle={isDisabled ? styles.buttonTitleDisabled : styles.buttonTitle}
                containerStyle={[isDisabled ? styles.buttonDisabled : styles.button, isWeb && styles.buttonTitleWeb]}
                disabled={isDisabled}
              />
            </>
          );
        }}
      </Formik>
    </View>
  );
};

export default RejectOfferForm;

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  verticalStyle: {
    marginVertical: 16,
  },
  textAreaWeb: {
    height: '100%',
  },
  helper: {
    marginTop: 80,
    alignSelf: 'center',
    color: theme.colors.darkTint5,
  },
  helperWeb: {
    marginTop: 10,
  },
  button: {
    backgroundColor: theme.colors.redOpacity,
    flexDirection: 'row-reverse',
    marginVertical: 10,
  },
  buttonDisabled: {
    backgroundColor: theme.colors.grey4,
    flexDirection: 'row-reverse',
    marginVertical: 10,
  },
  buttonTitle: {
    color: theme.colors.error,
  },
  buttonTitleDisabled: {
    color: theme.colors.white,
  },
  buttonTitleWeb: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
