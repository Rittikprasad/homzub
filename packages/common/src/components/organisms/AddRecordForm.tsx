import React, { ReactElement } from 'react';
import { StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { Formik, FormikHelpers, FormikProps, FormikValues } from 'formik';
import { withTranslation, WithTranslation } from 'react-i18next';
import * as yup from 'yup';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { DateFormats, DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { FormUtils } from '@homzhub/common/src/utils/FormUtils';
import { LedgerUtils } from '@homzhub/common/src/utils/LedgerUtils';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { LedgerRepository } from '@homzhub/common/src/domain/repositories/LedgerRepository';
import { AttachmentService } from '@homzhub/common/src/services/AttachmentService';
import { IDocumentSource } from '@homzhub/common/src/services/AttachmentService/interfaces';
import { FinancialActions } from '@homzhub/common/src/modules/financials/actions';
import { FinancialSelectors } from '@homzhub/common/src/modules/financials/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { SelectionPicker } from '@homzhub/common/src/components/atoms/SelectionPicker';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import { TextArea } from '@homzhub/common/src/components/atoms/TextArea';
import { FormButton } from '@homzhub/common/src/components/molecules/FormButton';
import { FormCalendar } from '@homzhub/common/src/components/molecules/FormCalendar';
import { FormDropdown, IDropdownOption } from '@homzhub/common/src/components/molecules/FormDropdown';
import { FormTextInput } from '@homzhub/common/src/components/molecules/FormTextInput';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { Attachment, UploadFileType } from '@homzhub/common/src/domain/models/Attachment';
import { Currency } from '@homzhub/common/src/domain/models/Currency';
import { DueItem } from '@homzhub/common/src/domain/models/DueItem';
import { FormType } from '@homzhub/common/src/domain/models/FinancialTransactions';
import { LedgerTypes } from '@homzhub/common/src/domain/models/GeneralLedgers';
import { LedgerCategory } from '@homzhub/common/src/domain/models/LedgerCategory';
import { Unit } from '@homzhub/common/src/domain/models/Unit';
import { AttachmentType } from '@homzhub/common/src/constants/AttachmentTypes';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { IState } from '@homzhub/common/src/modules/interfaces';

interface IFormData {
  property: number;
  label: string;
  tellerName?: string;
  amount: string;
  category: number;
  date: string;
  notes?: string;
  paidTo?: string;
  paymentModeUsed?: string;
  fromBank?: string;
  referenceNum?: string;
}
interface ILocalState {
  ledgerCategories: LedgerCategory[];
  selectedFormType: FormType;
  formValues: IFormData;
  attachments: IDocumentSource[] | File[];
  currencyCode: string;
  currencySymbol: string;
  existingAttachments: IFormattedAttachment[];
  offlinePaymentModes: Unit[];
}

export interface IUploadAttachmentResponse {
  id: number;
  link: string;
}

export interface IUploadCompProps {
  attachments: IDocumentSource[] | File[];
  icon: string;
  header: string;
  subHeader: string;
  onDelete: (uri: string) => void;
  containerStyle: StyleProp<ViewStyle>;
  onCapture?: (attachments: IDocumentSource[]) => void;
  onDropAccepted?: (attachments: File[]) => void;
  multipleUpload?: boolean;
}

interface IStateToProps {
  currentDue: DueItem | null;
}

interface IDispatchProps {
  setCurrentDueId: (dueId: number) => void;
}

interface IOwnProps extends WithTranslation, IStateToProps, IDispatchProps {
  properties: Asset[];
  onSubmitFormSuccess?: () => void;
  clear: number;
  onFormClear: () => void;
  toggleLoading: (isLoading: boolean) => void;
  defaultCurrency: Currency;
  transactionId: number;
  renderUploadBoxComponent: (renderAttachements: () => React.ReactNode, uploadProps: IUploadCompProps) => ReactElement;
  onPressLink: (link: string) => void;
  assetId?: number;
  containerStyles?: StyleProp<ViewStyle>;
  isEditFlow?: boolean;
  isDesktopWeb?: boolean;
  testID?: string;
  isFromDues?: boolean;
}

interface IFormattedAttachment {
  id: number;
  fileName: string;
  link: string;
}

const MAX_WORD_COUNT = 200;

export class AddRecordForm extends React.PureComponent<IOwnProps, ILocalState> {
  public formRef: React.RefObject<any> = React.createRef();

  public constructor(props: IOwnProps) {
    super(props);
    const { isFromDues, currentDue, defaultCurrency } = props;
    const { currencySymbol, currencyCode } = isFromDues && currentDue ? currentDue?.currency : defaultCurrency;
    this.state = {
      selectedFormType: isFromDues ? FormType.Expense : FormType.Income,
      attachments: [],
      currencyCode,
      currencySymbol,
      ledgerCategories: [],
      formValues: this.getInitialValues(),
      existingAttachments: [],
      offlinePaymentModes: [],
    };
  }

  public async componentDidMount(): Promise<void> {
    const { toggleLoading, assetId, isEditFlow, isFromDues } = this.props;
    if (isEditFlow) {
      await this.fetchExistingLedgerDetails();
    }

    if (assetId) {
      this.onChangeProperty(`${assetId}`);
    }
    if (isFromDues) {
      this.fetchOfflinePaymentModes().then();
    }
    toggleLoading(true);
    const categories = await LedgerRepository.getLedgerCategories();

    this.setState({ ledgerCategories: categories });
    toggleLoading(false);
  }

  public componentDidUpdate = (prevProps: IOwnProps): void => {
    const { clear: newVal } = this.props;
    const { clear: oldVal } = prevProps;

    if (newVal !== oldVal) {
      this.resetFormValues();
    }
  };

  public render(): ReactElement {
    const {
      containerStyles,
      t,
      assetId,
      isEditFlow,
      renderUploadBoxComponent,
      isDesktopWeb,
      isFromDues = false,
    } = this.props;
    const { selectedFormType, formValues, currencyCode, currencySymbol, attachments, offlinePaymentModes } = this.state;
    const isWeb = PlatformUtils.isWeb();
    const isDesktop = isDesktopWeb || false;
    const isAbsoluteWeb = isWeb && isDesktop;
    const uploadProps = {
      attachments,
      icon: icons.document,
      header: t('common:uploadDocument'),
      subHeader: t('common:uploadDocHelperText'),
      onCapture: this.handleUpload,
      onDelete: this.handleDocumentDelete,
      containerStyle: styles.uploadBox,
    };
    const calendarPropsWeb = {
      popupProps: { position: 'top center' },
    };
    return (
      <Formik
        innerRef={this.formRef}
        onSubmit={this.handleSubmit}
        initialValues={{ ...formValues }}
        validate={FormUtils.validate(this.formSchema)}
        enableReinitialize
      >
        {(formProps: FormikProps<FormikValues>): React.ReactNode => {
          const handleNotes = (value: string): void => {
            formProps.setFieldValue('notes', value);
          };

          return (
            <View style={[containerStyles]}>
              <SelectionPicker
                data={[
                  { title: t('income'), value: FormType.Income },
                  { title: t('expense'), value: FormType.Expense },
                ]}
                selectedItem={[selectedFormType]}
                onValueChange={this.onFormTypeChange}
                containerStyles={[isAbsoluteWeb && styles.selectionPicker]}
                isDisabled={isFromDues}
              />
              <View style={[isAbsoluteWeb && styles.formContainer]}>
                <View style={[isAbsoluteWeb && styles.formColumn]}>
                  <FormDropdown
                    formProps={formProps}
                    name="property"
                    options={this.loadPropertyNames()}
                    placeholder={t('selectProperty')}
                    onChange={this.onChangeProperty}
                    isMandatory
                    label={t('property')}
                    listHeight={theme.viewport.height * 0.8}
                    isDisabled={!!assetId || isFromDues}
                  />
                  <FormTextInput
                    formProps={formProps}
                    inputType="default"
                    name="label"
                    label={t('details')}
                    placeholder={t('detailsPlaceholder')}
                    isMandatory
                    editable={!isFromDues}
                  />
                  <FormTextInput
                    formProps={formProps}
                    inputType="default"
                    name="tellerName"
                    label={selectedFormType === FormType.Income ? t('receivedFrom') : t('paidTo')}
                    placeholder={t('tellerPlaceholder')}
                  />
                  <FormTextInput
                    formProps={formProps}
                    inputType="number"
                    name="amount"
                    label={t('amount')}
                    placeholder={t('amountPlaceholder')}
                    inputPrefixText={currencySymbol}
                    inputGroupSuffixText={currencyCode}
                    isMandatory
                    editable={!isFromDues}
                  />
                  <FormDropdown
                    formProps={formProps}
                    name="category"
                    label={t('category')}
                    options={this.loadCategories()}
                    placeholder={t('categoryPlaceholder')}
                    isMandatory
                    onChange={this.onChangeCategory}
                  />
                  {!isWeb ? (
                    <FormCalendar
                      allowPastDates
                      formProps={formProps}
                      name="date"
                      textType="label"
                      label={t('addDate')}
                      calendarTitle={t('addDate')}
                      placeHolder={t('addDatePlaceholder')}
                      isMandatory
                      {...(isFromDues && { maxDate: DateUtils.getCurrentDate() })}
                    />
                  ) : (
                    <FormCalendar
                      allowPastDates
                      formProps={formProps}
                      name="date"
                      textType="label"
                      label={t('addDate')}
                      calendarTitle={t('addDate')}
                      placeHolder={t('addDatePlaceholder')}
                      isMandatory
                      {...calendarPropsWeb}
                    />
                  )}
                  {isFromDues && (
                    <>
                      <FormDropdown
                        formProps={formProps}
                        name="paymentModeUsed"
                        options={LedgerUtils.formattedPaymentModes(offlinePaymentModes)}
                        placeholder={t('categoryPlaceholder')}
                        label={t('assetFinancial:modeOfPayment')}
                        isMandatory
                        onChange={this.onChangePaymentMode}
                      />
                      <FormTextInput
                        formProps={formProps}
                        inputType="default"
                        name="fromBank"
                        label={t('assetFinancial:fromBank')}
                      />
                      <FormTextInput
                        formProps={formProps}
                        inputType="default"
                        name="referenceNum"
                        label={t('assetFinancial:referenceNumber')}
                      />
                    </>
                  )}
                </View>
                <View style={[isAbsoluteWeb && styles.formColumn]}>
                  <TextArea
                    value={formProps.values.notes}
                    placeholder={t('notesPlaceholder')}
                    label={t('notes')}
                    wordCountLimit={MAX_WORD_COUNT}
                    containerStyle={[styles.inputStyle, isAbsoluteWeb && styles.inputStyleWeb]}
                    onMessageChange={handleNotes}
                  />
                  {renderUploadBoxComponent(this.renderExistingAttachments, uploadProps)}
                  <FormButton
                    // @ts-ignore
                    onPress={formProps.handleSubmit}
                    formProps={formProps}
                    type="primary"
                    title={t(isEditFlow ? 'submitRecord' : 'addRecord')}
                    disabled={!formProps.isValid || formProps.isSubmitting}
                  />
                </View>
              </View>
            </View>
          );
        }}
      </Formik>
    );
  }

  public renderExistingAttachments = (): React.ReactElement => {
    const { onPressLink } = this.props;
    const { existingAttachments, attachments } = this.state;
    return (
      <>
        {existingAttachments.map((item, index) => {
          const { id, fileName, link } = item;
          const extension = fileName.split('.').reverse()[0];
          const fileType = extension === 'pdf' ? UploadFileType.PDF : UploadFileType.IMAGE;
          const fileIcon = fileType === UploadFileType.PDF ? icons.doc : icons.imageFile;
          const isLastAttachment = index === existingAttachments.length - 1;

          const onPressCross = (): void => {
            this.setState((prevState) => ({
              existingAttachments: prevState.existingAttachments.filter((i) => i.id !== item.id),
            }));
          };

          const onPress = (): void => {
            onPressLink(link);
          };

          return (
            <>
              <TouchableOpacity key={id} style={styles.existingFilesContainer} onPress={onPress}>
                <View style={styles.iconView}>
                  <Icon name={fileIcon} size={40} color={theme.colors.lowPriority} style={styles.fileIcon} />
                </View>
                <View style={styles.fileContainer}>
                  <Text type="small" textType="semiBold" style={styles.existingFileName}>
                    {AttachmentService.getFormattedFileName(fileName, extension)}
                  </Text>
                  <Icon
                    name={icons.close}
                    size={20}
                    color={theme.colors.darkTint3}
                    style={styles.closeIcon}
                    onPress={onPressCross}
                  />
                </View>
              </TouchableOpacity>
              {!isLastAttachment ? (
                <Divider containerStyles={styles.divider} />
              ) : (
                <View style={styles.endingEmptyView} />
              )}
            </>
          );
        })}
        {attachments.length > 0 && existingAttachments.length > 0 && <Divider containerStyles={styles.divider} />}
      </>
    );
  };

  private onFormTypeChange = (selectedType: number): void => {
    this.setState((prevState) => ({
      selectedFormType: selectedType,
      formValues: { ...prevState.formValues, category: 0 },
    }));
  };

  private onChangeProperty = (value: string, formikProps?: FormikProps<FormikValues>): void => {
    const { properties } = this.props;
    properties.forEach((item) => {
      if (item.id === Number(value)) {
        const { currencies } = item.country;
        this.setState({
          currencyCode: currencies[0].currencyCode,
          currencySymbol: currencies[0].currencySymbol,
        });
      }
    });
    if (formikProps) {
      const { setFieldValue } = formikProps;
      setFieldValue('property', value);
    }
  };

  private onChangeCategory = (value: string, formikProps?: FormikProps<FormikValues>): void => {
    if (formikProps) {
      const { setFieldValue } = formikProps;
      setFieldValue('category', value);
    }
  };

  private onChangePaymentMode = (value: string, formikProps?: FormikProps<FormikValues>): void => {
    if (formikProps) {
      const { setFieldValue } = formikProps;
      setFieldValue('paymentModeUsed', value);
    }
  };

  private fetchExistingLedgerDetails = async (): Promise<void> => {
    const { transactionId, toggleLoading } = this.props;
    try {
      toggleLoading(true);
      const transactionData = await LedgerRepository.getLedgerDetails(transactionId);
      const {
        asset,
        label,
        transactionDate,
        attachmentDetails,
        amount,
        notes,
        tellerName,
        categoryId,
        formType,
        currency,
      } = transactionData;
      const existingAttachments = this.formatExistingAttachments(attachmentDetails);
      this.setState({
        selectedFormType: formType,
        existingAttachments,
        currencyCode: currency.currencyCode,
        currencySymbol: currency.currencySymbol,
        formValues: {
          property: asset?.id ?? -1,
          label,
          tellerName,
          amount: String(amount),
          category: categoryId,
          notes,
          date: transactionDate,
        },
      });
      toggleLoading(false);
    }catch (e: any) {      toggleLoading(false);
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
    }
  };

  private loadPropertyNames = (): IDropdownOption[] => {
    const { properties } = this.props;

    return properties.map((property: Asset) => {
      return { value: property.id, label: property.formattedProjectName };
    });
  };

  private loadCategories = (): IDropdownOption[] => {
    const { selectedFormType, ledgerCategories } = this.state;
    const entryType = selectedFormType === FormType.Income ? LedgerTypes.credit : LedgerTypes.debit;

    return LedgerUtils.filterByType<LedgerCategory, LedgerTypes>(entryType, ledgerCategories).map(
      (category: LedgerCategory) => {
        return { value: category.id, label: category.name };
      }
    );
  };

  private fetchOfflinePaymentModes = async (): Promise<void> => {
    try {
      const modes = await LedgerRepository.getOfflinePaymentModes();
      this.setState({ offlinePaymentModes: modes });
    }catch (e: any) {      AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details), statusCode: e.details.statusCode });
    }
  };

  private formSchema = (): yup.ObjectSchema<IFormData> => {
    const { t } = this.props;

    return yup.object().shape({
      property: yup.number().moreThan(-1, t('propertyError')),
      label: yup.string().required(t('detailsError')),
      tellerName: yup.string().optional(),
      amount: yup.string().required(t('amountError')),
      category: yup.number().required(t('categoryError')).moreThan(0, t('categoryError')),
      date: yup.string().required(t('dateError')),
      notes: yup.string().optional(),
      paymentModeUsed: yup.string(),
      fromBank: yup.string().optional(),
      referenceNum: yup.string().optional(),
    });
  };

  private getInitialValues = (): IFormData => {
    const { assetId, isFromDues, currentDue, t } = this.props;

    if (currentDue && isFromDues) {
      const { asset, invoiceTitle, totalPrice, dueDate } = currentDue;
      const getDefaultDate = (): string => {
        const isDueDateSameOrAfterToday = DateUtils.isSameOrAfter(dueDate);
        return isDueDateSameOrAfterToday
          ? DateUtils.getCurrentDate()
          : DateUtils.getUtcDisplayDate(dueDate, DateFormats.YYYYMMDD);
      };

      return {
        property: asset?.id ?? -1,
        label: invoiceTitle,
        tellerName: t('common:homzhub'),
        amount: `${totalPrice}`,
        category: 10,
        date: getDefaultDate(),
        notes: '',
        paymentModeUsed: 'CASH',
      };
    }
    return {
      property: assetId ?? -1,
      label: '',
      tellerName: '',
      amount: '',
      category: 0,
      date: DateUtils.getCurrentDate(),
      notes: '',
    };
  };

  private resetFormValues = (): void => {
    this.setState({
      formValues: this.getInitialValues(),
      attachments: [],
    });
    this.formRef.current.resetForm();
  };

  private handleUpload = (attachments: IDocumentSource[]): void => {
    this.setState((prevState: ILocalState) => {
      return { attachments: [...(prevState.attachments as IDocumentSource[]), ...attachments] };
    });
  };

  private handleDocumentDelete = (uri: string, name?: string): void => {
    const { attachments } = this.state;
    if (PlatformUtils.isWeb() && name) {
      const webAttachments = attachments as File[];
      this.setState(() => {
        return { attachments: webAttachments.filter((file: File) => file.name !== name) };
      });
    } else {
      const mobAttachments = attachments as IDocumentSource[];
      this.setState(() => {
        return { attachments: mobAttachments.filter((file: IDocumentSource) => file.uri !== uri) };
      });
    }
  };

  private formatExistingAttachments = (attachments: Attachment[]): IFormattedAttachment[] => {
    return attachments.map((item) => ({
      id: item.id,
      fileName: item.fileName,
      link: item.link,
    }));
  };

  private handleSubmit = async (values: IFormData, formActions: FormikHelpers<IFormData>): Promise<void> => {
    const { toggleLoading, isEditFlow, transactionId, currentDue, isFromDues } = this.props;
    const { selectedFormType, attachments, currencyCode, existingAttachments, offlinePaymentModes } = this.state;
    const { property, label, tellerName, amount, category, notes, date, fromBank, referenceNum, paymentModeUsed } =
      values;
    const existingAttachmentIds = existingAttachments.map((i) => i.id);
    let uploadedAttachmentIds: Array<number> = [];

    toggleLoading(true);

    try {
      if (attachments.length) {
        /* Make an API call for uploading the document and extract the doc Id */
        const formData = new FormData();
        attachments.forEach((attachment: IDocumentSource | File) => {
          // @ts-ignore
          formData.append('files[]', attachment);
        });
        const response = await AttachmentService.uploadImage(formData, AttachmentType.ASSET_RECORD);
        const { data } = response;
        uploadedAttachmentIds = data.map((i: IUploadAttachmentResponse) => i.id);
      }

      let dueFields = {};

      formActions.setSubmitting(true);

      const tellerInfo =
        selectedFormType === FormType.Income ? { payer_name: tellerName } : { receiver_name: tellerName };

      if (isFromDues) {
        const modeOfPayment = offlinePaymentModes.filter((mode) => mode.code === paymentModeUsed)[0].id;
        dueFields = {
          mode_of_payment: modeOfPayment,
          ...(fromBank && { from_bank: fromBank }),
          ...(referenceNum && { payment_reference_number: referenceNum }),
          ...(currentDue && { invoice: currentDue.id }),
        };
      }

      let payload = {
        asset: Number(property),
        entry_type: selectedFormType === FormType.Income ? LedgerTypes.credit : LedgerTypes.debit,
        label,
        ...(tellerName && tellerInfo),
        amount: Number(amount),
        category: Number(category),
        transaction_date: date,
        ...(notes && { notes }),
        attachments: [...existingAttachmentIds, ...uploadedAttachmentIds],
        currency: currencyCode,
      };

      if (isFromDues) {
        payload = { ...payload, ...dueFields };
      }
      if (isEditFlow && transactionId !== -1) {
        await LedgerRepository.updateGeneralLedgers(payload, transactionId);
      } else {
        await LedgerRepository.postGeneralLedgers(payload);
      }
      toggleLoading(false);
      formActions.setSubmitting(false);

      const { onSubmitFormSuccess } = this.props;
      if (onSubmitFormSuccess) {
        onSubmitFormSuccess();
      }
    }catch (e: any) {      toggleLoading(false);
      formActions.setSubmitting(false);
      formActions.resetForm({});
      AlertHelper.error({ message: e.message });
    }
  };
}

const mapStateToProps = (state: IState): IStateToProps => {
  return {
    currentDue: FinancialSelectors.getCurrentDue(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { setCurrentDueId } = FinancialActions;
  return bindActionCreators(
    {
      setCurrentDueId,
    },
    dispatch
  );
};

const namespace = LocaleConstants.namespacesKey;
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation([namespace.assetFinancial, namespace.common])(AddRecordForm));

const styles = StyleSheet.create({
  selectionPicker: {
    width: '47.5%',
  },
  inputStyle: {
    marginTop: 20,
  },
  inputStyleWeb: {
    marginTop: 8,
  },
  uploadBox: {
    marginVertical: 20,
  },
  divider: {
    borderWidth: 1,
    marginVertical: 5,
    borderColor: theme.colors.divider,
  },
  fileIcon: {
    marginHorizontal: 10,
  },
  endingEmptyView: {
    marginVertical: 5,
  },
  closeIcon: {
    right: 0,
  },
  existingFilesContainer: {
    flex: 1,
    flexDirection: 'row',
    marginVertical: 10,
  },
  iconView: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  fileContainer: {
    flex: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  existingFileName: {
    color: theme.colors.primaryColor,
  },
  formContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  formColumn: {
    width: '47.5%',
  },
});
