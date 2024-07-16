import React, { useEffect, useState } from 'react';
import * as yup from 'yup';
import { Formik, FormikProps, FormikValues } from 'formik';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { FormUtils } from '@homzhub/common/src/utils/FormUtils';
import { FunctionUtils } from '@homzhub/common/src/utils/FunctionUtils';
import { AssetRepository } from '@homzhub/common/src/domain/repositories/AssetRepository';
import { LedgerRepository } from '@homzhub/common/src/domain/repositories/LedgerRepository';
import { AssetActions } from '@homzhub/common/src/modules/asset/actions';
import { FinancialActions } from '@homzhub/common/src/modules/financials/actions';
import { PropertyPaymentActions } from '@homzhub/common/src/modules/propertyPayment/actions';
import { UserActions } from '@homzhub/common/src/modules/user/actions';
import { AssetSelectors } from '@homzhub/common/src/modules/asset/selectors';
import { FinancialSelectors } from '@homzhub/common/src/modules/financials/selectors';
import { PropertyPaymentSelector } from '@homzhub/common/src/modules/propertyPayment/selectors';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import { TextArea } from '@homzhub/common/src/components/atoms/TextArea';
import { FormButton } from '@homzhub/common/src/components/molecules/FormButton';
import { FormCalendar } from '@homzhub/common/src/components/molecules/FormCalendar';
import { FormDropdown, IDropdownOption } from '@homzhub/common/src/components/molecules/FormDropdown';
import { TransactionField } from '@homzhub/common/src/components/molecules/TransactionField';
import { FormTextInput } from '@homzhub/common/src/components/molecules/FormTextInput';
import ChipField from '@homzhub/common/src/components/molecules/ChipField';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { OnGoingTransaction } from '@homzhub/common/src/domain/models/OnGoingTransaction';
import { IReminderPayload } from '@homzhub/common/src/domain/repositories/interfaces';
import {
  IAddReminderPayload,
  IReminderFormData,
  IUpdateReminderPayload,
} from '@homzhub/common/src/modules/financials/interfaces';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

interface IOwnProp {
  onSubmit: (isEdit: boolean) => void;
  onAddSociety: () => void;
  onAddAccount?: (id?: number) => void;
  isEdit?: boolean;
  isFromDues?: boolean;
  setLoading?: (isLoading: boolean) => void;
  setShowDeleteIcon?: (showDeleteIcon: boolean) => void;
  isConfirmed?: boolean;
  handleConfirmation?: () => void;
  onError?: (isConfirm: boolean) => void;
}

const ReminderForm = (props: IOwnProp): React.ReactElement => {
  const {
    onSubmit,
    isEdit = false,
    setLoading,
    isFromDues = false,
    onAddAccount,
    setShowDeleteIcon,
    onAddSociety,
    isConfirmed = false,
    handleConfirmation,
    onError,
  } = props;
  const dispatch = useDispatch();
  const { t } = useTranslation(LocaleConstants.namespacesKey.assetFinancial);
  const assets = useSelector(FinancialSelectors.getReminderAssets);
  const categories = useSelector(FinancialSelectors.getCategoriesDropdown);
  const frequencies = useSelector(FinancialSelectors.getFrequenciesDropdown);
  const selectedReminderId = useSelector(FinancialSelectors.getCurrentReminderId);
  const societyCharges = useSelector(PropertyPaymentSelector.getSocietyCharges);
  const reminderFormData = useSelector(FinancialSelectors.getReminderFormData);
  const userData = useSelector(UserSelector.getUserProfile);
  const selectedDue = useSelector(FinancialSelectors.getCurrentDue);
  const assetUsers = useSelector(AssetSelectors.getAssetUser);
  const emails = useSelector(AssetSelectors.getAssetUserEmails);
  const bankInfo = useSelector(UserSelector.getBankInfo);

  const [unitList, setUnitList] = useState<OnGoingTransaction[]>([]);
  const [userEmails, setUserEmails] = useState<string[]>([]);
  const [notes, setNotes] = useState<string>('');
  const [emailError, setEmailErrorText] = useState<string>('');
  const [isEmailError, setEmailError] = useState(false);
  const [canEdit, setCanEdit] = useState(true);
  const [currency, setCurrency] = useState('');
  const [formDetail, setFormDetail] = useState<IReminderPayload>();

  useEffect(() => {
    dispatch(FinancialActions.getReminderCategories());
    dispatch(FinancialActions.getReminderFrequencies());
    dispatch(FinancialActions.getReminderAssets());
    if (isEdit && selectedReminderId > 0) {
      getInitialState();
    }
    if (isFromDues) {
      getDueState();
    }
  }, []);

  useEffect(() => {
    if (reminderFormData.property && reminderFormData.property > 0) {
      onChangeProperty(reminderFormData.property.toString(), reminderFormData.category).then();
    }
  }, [reminderFormData.property]);

  useEffect(() => {
    if (userEmails.length > 0) {
      userEmails.forEach((item) => {
        if (!emails.includes(item.toLowerCase())) {
          setEmailErrorText('property:userNotAssociated');
          setEmailError(true);
        }
      });
    }
  }, [assetUsers]);

  useEffect(() => {
    if (isConfirmed) {
      finalSubmission(true);
    }
  }, [isConfirmed]);

  const onChangeOwner = (id: string): void => {
    dispatch(UserActions.getBankInfo(Number(id)));
  };

  const getDueState = (): void => {
    if (selectedDue) {
      const date =
        DateUtils.getDateDifference(selectedDue.dueDate, 'days') > 0
          ? DateUtils.getNextDate(1)
          : DateUtils.getDisplayDate(selectedDue.dueDate, 'YYYY-MM-DD');

      dispatch(
        FinancialActions.setReminderFormData({
          ...reminderFormData,
          title: selectedDue.invoiceTitle,
          category: selectedDue.paymentTransaction.paymentType.code === 'RENT' ? 1 : 2,
          date,
          ...(selectedDue.asset && { property: selectedDue.asset.id }),
        })
      );
    }
  };

  const getInitialState = (): void => {
    if (setLoading) {
      setLoading(true);
    }
    LedgerRepository.getReminderById(selectedReminderId)
      .then((res) => {
        if (setLoading) {
          setLoading(false);
        }
        if (res) {
          const payload = {
            title: res.title,
            category: res.reminderCategory.id,
            frequency: res.reminderFrequency.id,
            date: DateUtils.getDisplayDate(res.startDate, 'YYYY-MM-DD'),
            ...(res.asset && { property: res.asset.id }),
            ...(res.leaseTransaction && { leaseUnit: res.leaseTransaction.id }),
            ...(res.amount && { rent: res.amount.toString() }),
            ...(res.receiverUser && { owner: res.receiverUser.id }),
            ...(res.payerUser && { tenant: res.payerUser.id }),
            ...(res.userBankInfo && { bankAccount: res.userBankInfo.id }),
            ...(res.amount && { maintenanceAmount: res.amount.toString() }),
            ...(res.payerUser && { paidBy: res.payerUser.id }),
          };

          dispatch(FinancialActions.setReminderFormData(payload));

          setUserEmails(res.emails);
          setNotes(res.description);
          setCanEdit(res.canEdit);
          if (setShowDeleteIcon) {
            setShowDeleteIcon(res.canDelete);
          }
        }
      })
      .catch((e) => {
        if (setLoading) {
          setLoading(false);
        }
        AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details), statusCode: e.details.statusCode });
      });
  };

  // DROPDOWN LIST FORMATION START
  const getPropertyList = (isRented: boolean): IDropdownOption[] => {
    if (assets.length > 0) {
      const data = isRented ? assets.filter((item) => item.isRented) : assets;

      if (isRented && data.length < 1) {
        AlertHelper.error({ message: t('property:noOccupiedProperty') });
        return [];
      }
      return data.map((property: Asset) => {
        return { value: property.id, label: property.formattedProjectName };
      });
    }
    return [];
  };

  const getUnitList = (): IDropdownOption[] => {
    if (unitList.length > 0) {
      return unitList.map((item) => {
        return {
          label: item.name,
          value: item.leaseTransaction.id,
        };
      });
    }

    return [];
  };

  // DROPDOWN LIST FORMATION END

  const onChangeProperty = async (
    value: string,
    category: number,
    formProp?: FormikProps<FormikValues>
  ): Promise<void> => {
    if (category === 3) {
      dispatch(PropertyPaymentActions.setAssetId(Number(value)));
      dispatch(
        PropertyPaymentActions.getSocietyCharges({
          id: Number(value),
          onCallback: (status, data): void => onCallback(status, data, formProp),
        })
      );
      if (formProp) {
        formProp.setFieldValue('paidBy', -1);
      }
      return;
    }
    try {
      const list = await AssetRepository.getOnGoingTransaction(Number(value));
      setUnitList(list);
      if (formProp) {
        formProp.setFieldValue('owner', -1);
        formProp.setFieldValue('tenant', -1);
      }
      dispatch(AssetActions.getAssetUsers({ assetId: Number(value) }));
    }catch (e: any) {      AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details), statusCode: e.details.statusCode });
    }
  };

  const onChangeUnit = (value: string, formProps?: FormikProps<FormikValues>): void => {
    if (formProps) {
      const { values, setFieldValue } = formProps;
      const lease = unitList.filter((item) => item.leaseTransaction.id === Number(value))[0].leaseTransaction;
      setFieldValue('rent', lease.rent.toString());
      setCurrency(lease.currency.currencyCode);
      dispatch(
        AssetActions.getAssetUsers({
          assetId: values.property,
          lease_transaction_id: Number(value),
          onCallback: handleUnitCallback,
        })
      );
    }
  };

  const onChangeCategory = (value: string, formProps?: FormikProps<FormikValues>): void => {
    if (formProps) {
      formProps.setFieldValue('leaseUnit', -1);
      setUserEmails([]);
      if (Number(value) === 1) {
        formProps.setFieldValue('frequency', 1);
      }
    }

    if (Number(value) === 3) {
      dispatch(AssetActions.getActiveAssets());
    }
  };

  const onCallback = (status: boolean, data?: number, formProps?: FormikProps<FormikValues>): void => {
    if (status && formProps && data !== undefined) {
      formProps.setFieldValue('maintenanceAmount', data.toString());
    }
  };

  const onSetEmails = (value: string[]): void => {
    if (emails.length > 0) {
      value.forEach((item) => {
        if (emails.includes(item.toLowerCase()) && !userEmails.includes(item)) {
          setUserEmails([...userEmails, item]);
        } else {
          setEmailErrorText('property:userNotAssociated');
          setEmailError(true);
        }
      });
    } else {
      setUserEmails(value);
    }
  };

  const onSetEmailError = (value: boolean): void => {
    if (!value && !!emailError) {
      setEmailErrorText('');
    }
    setEmailError(value);
  };

  const formSchema = (): yup.ObjectSchema<IReminderFormData> => {
    return yup.object().shape({
      title: yup.string().required(),
      category: yup.number().required(),
      frequency: yup.number().required(),
      date: yup.string().required(),
      property: yup.number().when('category', {
        is: 1,
        then: yup.number().required(),
      }),
      leaseUnit: yup.number().when('category', {
        is: 1,
        then: yup.number().required(),
      }),
      tenant: yup.number().when('category', {
        is: 1,
        then: yup.number().required(),
      }),
      owner: yup.number().when('category', {
        is: 1,
        then: yup.number().required(),
      }),
      bankAccount: yup.number().when('category', {
        is: 1,
        then: yup.number().required(),
      }),
      rent: yup.string().when('category', {
        is: 1,
        then: yup.string().required(),
      }),
    });
  };

  const getButtonVisibility = (formProps: FormikProps<any>): boolean => {
    const {
      values: { category, title, frequency, bankAccount, owner, tenant, maintenanceAmount, property, paidBy },
    } = formProps;
    const check = !!title && Number(category) > 0 && Number(frequency) > 0 && !emailError && !isEmailError;
    const selectedAsset = assets.filter((item) => item.id === Number(property))[0];
    const user = societyCharges?.users.find((item) => item.id === userData.id && !item.isAssetOwner);

    if (category === 1) {
      return check && bankAccount > 0 && owner > 0 && tenant > 0 && canEdit;
    }

    if (category === 3) {
      return check && Number(maintenanceAmount) > 0 && !!selectedAsset?.society && (!!user?.id || Number(paidBy) > 0);
    }

    return check;
  };

  const handleUnitCallback = (status: boolean): void => {
    if (status && assetUsers && assetUsers.tenants.length < 1) {
      AlertHelper.error({ message: t('property:yetToAcceptInvite') });
    }
  };

  const handleSubmit = (values: IReminderFormData): void => {
    const {
      title,
      category,
      date,
      frequency,
      property,
      leaseUnit,
      owner,
      tenant,
      rent,
      bankAccount,
      maintenanceAmount,
      paidBy,
    } = values;
    const isRent = category === 1;
    const isMaintenance = category === 3;
    const selectedAsset = assets.find((item) => item.id === Number(property));
    const user = societyCharges?.users.find((item) => item.id === userData.id && !item.isAssetOwner);
    const reminderPayload: IReminderPayload = {
      title,
      reminder_category: category,
      reminder_frequency: frequency,
      start_date: new Date(date).toISOString(),
      emails: userEmails,
      ...(property && property > 0 && { asset: property }),
      ...(isRent && leaseUnit && leaseUnit > 0 && { lease_transaction: leaseUnit }),
      ...(!!notes && { description: notes }),
      ...(isRent && { payer_user: tenant }),
      ...(isRent && { receiver_user: owner }),
      ...(isRent && { user_bank_info: bankAccount }),
      ...(isRent && { amount: Number(rent) }),
      ...(isRent && { currency }),
      ...(isMaintenance && selectedAsset && { society: selectedAsset.society?.id }),
      ...(isMaintenance && { amount: Number(maintenanceAmount) }),
      ...(isMaintenance && { payer_user: user?.id ?? paidBy }),
      ...(isMaintenance && societyCharges && { currency: societyCharges.maintenance.currency.currencyCode }),
      is_confirmed: true,
    };

    setFormDetail(reminderPayload);
    if ((isRent || isMaintenance) && handleConfirmation) {
      handleConfirmation();
    } else {
      finalSubmission(false);
    }
  };

  const finalSubmission = (isRentMaintenace: boolean): void => {
    if (formDetail) {
      const finalPayload = {
        ...(isEdit && { id: selectedReminderId }),
        data: {
          ...formDetail,
          is_confirmed: isRentMaintenace ? isConfirmed : true,
        },
        onCallback: handleReminderCallback,
      };
      if (isEdit) {
        dispatch(FinancialActions.updateReminder(finalPayload as IUpdateReminderPayload));
      } else {
        dispatch(FinancialActions.addReminder(finalPayload as IAddReminderPayload));
      }
    }
  };

  const handleReminderCallback = (status: boolean): void => {
    if (status) {
      AlertHelper.success({ message: t(isEdit ? 'reminderUpdateMsg' : 'reminderSuccessMsg') });
      onSubmit(isEdit);
    } else if (onError) {
      onError(false);
    }
  };

  const renderRightNode = (ownerId?: number): React.ReactElement => {
    return (
      <TouchableOpacity
        style={styles.rightNode}
        disabled={!onAddAccount}
        onPress={onAddAccount ? (): void => onAddAccount(ownerId) : FunctionUtils.noop}
      >
        <Icon name={icons.plus} color={theme.colors.primaryColor} size={20} />
        <Label textType="semiBold" style={styles.rightText}>
          {t('addNew')}
        </Label>
      </TouchableOpacity>
    );
  };

  const renderRentFields = (formProps: FormikProps<FormikValues>): React.ReactElement => {
    return (
      <>
        <FormDropdown
          name="leaseUnit"
          label={t('leaseUnit')}
          placeholder={t('selectLeaseUnit')}
          options={getUnitList()}
          formProps={formProps}
          onChange={onChangeUnit}
          isDisabled={getUnitList().length < 1 || !canEdit}
          dropdownContainerStyle={styles.field}
        />
        <FormDropdown
          name="owner"
          label={t('property:owner')}
          placeholder={t('property:selectOwner')}
          options={assetUsers?.owners ?? []}
          formProps={formProps}
          isDisabled={Number(formProps.values.leaseUnit) < 1 || !canEdit}
          dropdownContainerStyle={styles.field}
          listHeight={300}
          onChange={onChangeOwner}
        />
        <FormDropdown
          name="tenant"
          label={t('property:tenant')}
          placeholder={t('property:selectTenant')}
          options={assetUsers?.tenants ?? []}
          formProps={formProps}
          isDisabled={Number(formProps.values.leaseUnit) < 1 || !canEdit || !assetUsers?.tenants.length}
          dropdownContainerStyle={styles.field}
          listHeight={300}
        />
        <FormTextInput
          name="rent"
          inputType="decimal"
          label={t('property:rent')}
          formProps={formProps}
          placeholder={t('property:enterRentAmount')}
          editable={canEdit}
        />
        <TransactionField
          name="bankAccount"
          label={t('bankAccount')}
          placeholder={t('selectAccount')}
          rightNode={renderRightNode(formProps.values.owner)}
          formProps={formProps}
          isDisabled={!canEdit || bankInfo.length < 1}
          options={bankInfo.filter((item) => item.isActive).map((item) => item.bankDetail)}
        />
      </>
    );
  };

  const renderMaintenanceFields = (formProps: FormikProps<FormikValues>): React.ReactElement => {
    const selectedAsset = assets.find((item) => item.id === Number(formProps.values.property));
    const isAddNew = !selectedAsset?.society && Number(formProps.values.property) > 0;
    const user = societyCharges?.users.find((item) => item.id === userData.id && !item.isAssetOwner);
    return (
      <>
        <FormTextInput
          formProps={formProps}
          label={t('propertyPayment:society')}
          inputType="default"
          name="society"
          placeholder={t('propertyPayment:addSocietyLabel')}
          value={selectedAsset?.society?.name}
          editable={false}
          optionalText={isAddNew ? t('common:addNew') : undefined}
          onPressOptional={onAddSociety}
          optionalStyle={styles.rightText}
        />
        <FormTextInput
          formProps={formProps}
          label={t('property:maintenanceAmount')}
          placeholder={t('property:maintenanceAmount')}
          inputType="number"
          name="maintenanceAmount"
          editable={canEdit}
        />
        <FormDropdown
          name="paidBy"
          label={t('propertyPayment:paidBy')}
          placeholder={t('property:selectPayee')}
          options={societyCharges?.userDropdownData ?? []}
          formProps={formProps}
          dropdownContainerStyle={styles.field}
          listHeight={300}
          selectedValue={user?.id}
          isDisabled={!canEdit || !!user}
        />
      </>
    );
  };

  return (
    <Formik
      initialValues={{ ...reminderFormData }}
      onSubmit={handleSubmit}
      validate={FormUtils.validate(formSchema)}
      enableReinitialize
    >
      {(formProps: FormikProps<FormikValues>): React.ReactNode => {
        const { category } = formProps.values;
        const isRented = Number(formProps.values.category) === 1;
        return (
          <>
            <FormTextInput
              formProps={formProps}
              inputType="default"
              name="title"
              label={t('serviceTickets:title')}
              placeholder={t('reminderTitle')}
              editable={canEdit}
            />
            <FormDropdown
              name="category"
              label={t('category')}
              placeholder={t('common:selectYourCountry')}
              options={categories}
              onChange={onChangeCategory}
              formProps={formProps}
              listHeight={350}
              isDisabled={isEdit || !canEdit}
              dropdownContainerStyle={styles.field}
            />
            <FormDropdown
              name="property"
              label={t('property')}
              placeholder={t('offers:selectProperty')}
              options={getPropertyList(isRented)}
              formProps={formProps}
              onChange={(value, formProp): Promise<void> => onChangeProperty(value, category, formProp)}
              isDisabled={getPropertyList(isRented).length < 1 || isEdit || !canEdit}
              dropdownContainerStyle={styles.field}
            />
            {Number(formProps.values.category) === 1 && renderRentFields(formProps)}
            {Number(formProps.values.category) === 3 && renderMaintenanceFields(formProps)}
            <FormCalendar
              formProps={formProps}
              name="date"
              textType="label"
              minDate={formProps.values.date}
              label={t('reminderDate')}
              isCurrentDateEnable={false}
              isDisabled={!canEdit}
            />
            <FormDropdown
              name="frequency"
              label={t('frequency')}
              listHeight={400}
              options={frequencies}
              formProps={formProps}
              dropdownContainerStyle={styles.field}
              isDisabled={!canEdit}
            />
            <ChipField
              data={userEmails}
              onSetValue={onSetEmails}
              setValueError={onSetEmailError}
              isDisabled={!canEdit}
              errorText={emailError}
              isEmailField
            />
            <TextArea
              value={notes}
              placeholder={t('notesPlaceholder')}
              label={t('notes')}
              helpText={t('common:optional')}
              onMessageChange={setNotes}
              isDisabled={!canEdit}
            />
            <Divider containerStyles={styles.divider} />
            <FormButton
              // @ts-ignore
              onPress={formProps.handleSubmit}
              formProps={formProps}
              type="primary"
              disabled={!getButtonVisibility(formProps) || (isEdit && !canEdit)}
              title={isEdit ? t('common:updateNow') : t('common:addNow')}
              containerStyle={styles.button}
            />
          </>
        );
      }}
    </Formik>
  );
};

export default React.memo(ReminderForm);

const styles = StyleSheet.create({
  field: {
    paddingVertical: 12,
  },
  divider: {
    marginVertical: 20,
    borderColor: theme.colors.darkTint10,
  },
  button: {
    marginBottom: 16,
  },
  rightNode: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightText: {
    color: theme.colors.primaryColor,
  },
});
