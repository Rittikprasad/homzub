import React, { ReactElement } from 'react';
import * as yup from 'yup';
import { WithTranslation, withTranslation } from 'react-i18next';
import { Formik, FormikHelpers, FormikProps, FormikValues } from 'formik';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { View, StyleSheet } from 'react-native';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { FormUtils } from '@homzhub/common/src/utils/FormUtils';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { AnalyticsService } from '@homzhub/common/src/services/Analytics/AnalyticsService';
import { TicketRepository } from '@homzhub/common/src/domain/repositories/TicketRepository';
import { AttachmentService } from '@homzhub/common/src/services/AttachmentService';
import { IDocumentSource } from '@homzhub/common/src/services/AttachmentService/interfaces';
import { AssetActions } from '@homzhub/common/src/modules/asset/actions';
import { TicketActions } from '@homzhub/common/src/modules/tickets/actions';
import { AssetSelectors } from '@homzhub/common/src/modules/asset/selectors';
import { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { EmptyState } from '@homzhub/common/src/components/atoms/EmptyState';
import { TextArea } from '@homzhub/common/src/components/atoms/TextArea';
import { FormTextInput } from '@homzhub/common/src/components/molecules/FormTextInput';
import { FormButton } from '@homzhub/common/src/components/molecules/FormButton';
import { FormDropdown, IDropdownOption } from '@homzhub/common/src/components/molecules/FormDropdown';
import { IUploadAttachmentResponse, IUploadCompProps } from '@homzhub/common/src/components/organisms/AddRecordForm';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { TicketCategory } from '@homzhub/common/src/domain/models/TicketCategory';
import { Unit } from '@homzhub/common/src/domain/models/Unit';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { AttachmentType } from '@homzhub/common/src/constants/AttachmentTypes';
import { EventType } from '@homzhub/common/src/services/Analytics/EventType';
import { IAddServiceEvent } from '@homzhub/common/src/services/Analytics/interfaces';
import { ICurrentTicket } from '@homzhub/common/src/modules/tickets/interface';
import { IAssetState } from '@homzhub/common/src/modules/asset/interfaces';

interface IFormValues {
  property: number;
  title: string;
  category: number;
  subCategory: string;
  issueDescription?: string;
  otherCategory?: string;
}

interface IScreeState {
  serviceForm: IFormValues;
  attachments: IDocumentSource[] | File[];
  selectedCategoryId: number;
  categories: IDropdownOption[];
  subCategories: IDropdownOption[];
  categoryWithSubCategory: TicketCategory[];
}

interface IStateToProps {
  properties: Asset[];
  loaders: IAssetState['loaders'];
}

interface IDispatchToProps {
  getActiveAssets: () => void;
  setCurrentTicket: (payload: ICurrentTicket) => void;
}

interface IOwnProps {
  clearCount: number;
  propertyId?: number;
  renderUploadBoxComponent: (uploadProps: IUploadCompProps) => ReactElement;
  onSubmit?: () => void;
  toggleLoader: (loading: boolean) => void;
  onAddProperty: () => void;
}

type Props = WithTranslation & IStateToProps & IDispatchToProps & IOwnProps;

class AddServiceTicketForm extends React.PureComponent<Props, IScreeState> {
  public formRef: React.RefObject<any> = React.createRef();

  constructor(props: Props) {
    super(props);
    const { propertyId } = this.props;

    this.state = {
      serviceForm: {
        property: propertyId ?? -1,
        title: '',
        category: -1,
        subCategory: '',
        issueDescription: '',
        otherCategory: '',
      },
      attachments: [],
      categories: [],
      subCategories: [],
      categoryWithSubCategory: [],
      selectedCategoryId: -1,
    };
    this.formRef = React.createRef<typeof Formik>();
  }

  public async componentDidMount(): Promise<void> {
    const { getActiveAssets } = this.props;

    getActiveAssets();
    const ticketCategories = await TicketRepository.getTicketCategories();
    const dropDownCategories = ticketCategories.map((category: TicketCategory) => {
      const { name, id } = category;
      return { value: id, label: name };
    });

    this.setState({ categories: dropDownCategories, categoryWithSubCategory: ticketCategories });

    const subCategories = this.getSubCategories();
    if (subCategories) {
      this.setState({ subCategories });
    }
  }

  public componentDidUpdate = (prevProps: Props, prevState: IScreeState): void => {
    const { clearCount: newVal } = this.props;
    const { clearCount: oldVal } = prevProps;
    const { selectedCategoryId: newCategoryId } = this.state;
    const { selectedCategoryId: oldCategoryId } = prevState;

    if (newVal !== oldVal) {
      this.formRef.current.resetForm({});
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ attachments: [], selectedCategoryId: -1 });
    }
    if (newCategoryId !== oldCategoryId) {
      const subCategories = this.getSubCategories();
      if (subCategories) {
        // eslint-disable-next-line react/no-did-update-set-state
        this.setState({ subCategories });
      }
    }
  };

  public render(): React.ReactElement {
    const { t, propertyId, properties, renderUploadBoxComponent } = this.props;
    const { serviceForm, attachments, categories, subCategories, selectedCategoryId } = this.state;

    const isPropertiesPresent = properties && properties.length > 0;

    const uploadPropsWeb: IUploadCompProps = {
      attachments,
      icon: icons.document,
      header: t('common:uploadDocument'),
      subHeader: t('common:uploadDocHelperText'),
      onDelete: this.handleDocumentDelete,
      containerStyle: styles.uploadBox,
      onDropAccepted: this.onUploadAccept,
      multipleUpload: true,
    };

    const uploadPropsApp: IUploadCompProps = {
      attachments,
      icon: icons.document,
      header: t('common:uploadDocument'),
      subHeader: t('common:uploadDocHelperText'),
      onDelete: this.handleDocumentDelete,
      containerStyle: styles.uploadBox,
      onCapture: this.handleUpload,
    };

    const uploadProps = PlatformUtils.isWeb() ? uploadPropsWeb : uploadPropsApp;

    return (
      <>
        {isPropertiesPresent ? (
          <View style={styles.container}>
            <Formik
              onSubmit={this.handleSubmit}
              initialValues={serviceForm}
              validate={FormUtils.validate(this.formSchema)}
              innerRef={this.formRef}
            >
              {(formProps: FormikProps<FormikValues>): React.ReactElement => {
                const { values, setFieldValue } = formProps;

                const onMessageChange = (description: string): void => {
                  setFieldValue('issueDescription', description);
                };
                const isSubmitDisabled = !FormUtils.isValuesTouched(values, ['issueDescription', 'otherCategory']);

                const subCategorySelectedValue = values.subCategory;
                let isOtherSelected = false;

                const selectedSubCategory = subCategories.find(
                  (subCategory: IDropdownOption) => subCategory.value === subCategorySelectedValue
                );

                if (selectedSubCategory) {
                  isOtherSelected = selectedSubCategory.label === 'Others';
                }

                return (
                  <>
                    <FormDropdown
                      textType="label"
                      textSize="regular"
                      fontType="regular"
                      options={this.getProperties()}
                      name="property"
                      formProps={formProps}
                      label={t('assetFinancial:property')}
                      placeholder={t('assetFinancial:selectProperty')}
                      isMandatory
                      isDisabled={propertyId ? propertyId >= 0 : false}
                      onChange={(value: string): void => setFieldValue('property', value)}
                    />
                    <FormTextInput
                      label={t('serviceTickets:title')}
                      formProps={formProps}
                      name="title"
                      placeholder={t('serviceTickets:exampleTitle')}
                      inputType="default"
                      isMandatory
                      maxLength={100}
                    />
                    <FormDropdown
                      textType="label"
                      textSize="regular"
                      fontType="regular"
                      label={t('assetFinancial:category')}
                      options={categories}
                      name="category"
                      formProps={formProps}
                      placeholder={t('serviceTickets:selectCategory')}
                      isMandatory
                      onChange={this.setSelectedCategory}
                    />
                    {selectedCategoryId > 0 && (
                      <FormDropdown
                        textType="label"
                        textSize="regular"
                        fontType="regular"
                        options={subCategories}
                        name="subCategory"
                        label={t('serviceTickets:subCategory')}
                        formProps={formProps}
                        placeholder={t('serviceTickets:selectSubCategory')}
                        isMandatory
                        onChange={(value: string): void => setFieldValue('subCategory', value)}
                      />
                    )}
                    {isOtherSelected && (
                      <FormTextInput
                        label={t('serviceTickets:otherCategory')}
                        formProps={formProps}
                        name="otherCategory"
                        placeholder={t('serviceTickets:enterOtherCategory')}
                        inputType="default"
                      />
                    )}
                    <TextArea
                      label={t('serviceTickets:description')}
                      placeholder={t('serviceTickets:typeIssue')}
                      value={values.issueDescription}
                      onMessageChange={onMessageChange}
                      wordCountLimit={200}
                      helpText={t('common:optional')}
                      containerStyle={styles.description}
                      labelType="regular"
                    />
                    {renderUploadBoxComponent(uploadProps)}
                    <FormButton
                      onPress={(): void => formProps.handleSubmit()}
                      formProps={formProps}
                      type="primary"
                      title={t('common:submit')}
                      disabled={isSubmitDisabled}
                    />
                  </>
                );
              }}
            </Formik>
          </View>
        ) : (
          this.renderEmptyState()
        )}
      </>
    );
  }

  private renderEmptyState = (): React.ReactElement => {
    const { t, onAddProperty } = this.props;

    return (
      <EmptyState
        title={t('serviceTickets:noPropertyAdded')}
        containerStyle={styles.emptyState}
        buttonProps={{
          title: t('property:addProperty'),
          type: 'secondary',
          onPress: onAddProperty,
        }}
      />
    );
  };

  private onUploadAccept = (attachments: File[]): void => {
    this.setState((prevState: IScreeState) => {
      return { attachments: [...(prevState.attachments as File[]), ...attachments] };
    });
  };

  private setSelectedCategory = (value: string, props?: FormikProps<FormikValues>): void => {
    if (props) {
      const { setFieldValue } = props;
      setFieldValue('subCategory', '');
    }
    this.setState({ selectedCategoryId: Number(value) });
  };

  private getSubCategories = (): IDropdownOption[] | null => {
    const { selectedCategoryId, categoryWithSubCategory } = this.state;

    let dropDownSubCategories = null;
    const selectedCategory = categoryWithSubCategory.find(
      (category: TicketCategory) => category.id === selectedCategoryId
    );

    if (selectedCategoryId && selectedCategory) {
      const { subCategories } = selectedCategory;

      dropDownSubCategories = subCategories.map((subCategory: Unit) => {
        const { name, id } = subCategory;
        return { value: id, label: name };
      });
    }

    return dropDownSubCategories;
  };

  private handleUpload = (attachments: IDocumentSource[]): void => {
    this.setState((prevState: IScreeState) => {
      return { attachments: [...(prevState.attachments as IDocumentSource[]), ...attachments] };
    });
  };

  private handleDocumentDelete = (uri: string, name?: string): void => {
    this.setState((prevState: IScreeState) => {
      if (PlatformUtils.isWeb() && name) {
        const webAttachments = prevState.attachments as File[];
        return { attachments: webAttachments.filter((file: File) => file.name !== name) };
      }
      const mobAttachments = prevState.attachments as IDocumentSource[];
      return { attachments: mobAttachments.filter((file: IDocumentSource) => file.uri !== uri) };
    });
  };

  private getProperties = (): IDropdownOption[] => {
    const { properties } = this.props;

    return properties.map((property: Asset) => {
      return { value: property.id, label: property.formattedProjectName };
    });
  };

  private formSchema = (): yup.ObjectSchema<IFormValues> => {
    const { t } = this.props;
    const { subCategories } = this.state;

    return yup.object().shape({
      property: yup.number().moreThan(-1, t('serviceTickets:propertyError')),
      title: yup.string().required(t('serviceTickets:titleError')),
      category: yup.number().required(t('serviceTickets:categoryError')),
      subCategory: yup.string().required(t('serviceTickets:subCategoryError')),
      issueDescription: yup.string().optional(),
      otherCategory: yup.string().when('subCategory', {
        is: (value): boolean => {
          const selectedSubCategory = subCategories.find(
            (subCategory: IDropdownOption) => String(subCategory.value) === value
          );
          if (selectedSubCategory) {
            return selectedSubCategory.label === 'Others';
          }
          return false;
        },
        then: yup.string().required(t('serviceTickets:otherCategoryError')),
        otherwise: yup.string().optional(),
      }),
    });
  };

  private handleSubmit = async (values: IFormValues, formActions: FormikHelpers<IFormValues>): Promise<void> => {
    const { properties, setCurrentTicket, onSubmit, toggleLoader } = this.props;
    const { property, subCategory, title, issueDescription, otherCategory } = values;
    const { attachments } = this.state;

    let attachmentIds: Array<number> = [];

    toggleLoader(true);

    if (attachments.length > 0) {
      /* Make an API call for uploading the document and extract the doc Id */
      const formData = new FormData();
      attachments.forEach((attachment: IDocumentSource | File) => {
        // @ts-ignore
        formData.append('files[]', attachment);
      });
      const response = await AttachmentService.uploadImage(formData, AttachmentType.TICKET_DOCUMENTS);
      const { data } = response;
      if (data.length > 0) {
        attachmentIds = data.map((i: IUploadAttachmentResponse) => i.id);
      }
    }

    try {
      formActions.setSubmitting(true);
      const otherField = otherCategory ? { others_field_description: otherCategory } : {};

      const payload = {
        ticket_category: Number(subCategory),
        asset: Number(property),
        attachments: attachmentIds,
        title,
        description: issueDescription,
        ...otherField,
      };
      const response = await TicketRepository.postTicket(payload);
      setCurrentTicket({
        ticketId: response.id,
        propertyName: this.getProperties().find((item) => Number(item.value) === Number(property))?.label,
      });
      const selectedProperty = properties.find((asset: Asset) => asset.id === property);
      if (selectedProperty) {
        const { city, countryName, assetGroup, assetType, projectName, address } = selectedProperty;

        AnalyticsService.track(EventType.NewServiceTicket, {
          property_location: address,
          project_name: projectName,
          city,
          country: countryName,
          asset_group: assetGroup,
          asset_type: assetType,
        } as IAddServiceEvent);
      }

      formActions.resetForm({});
      toggleLoader(false);
      this.setState({ selectedCategoryId: -1, attachments: [] });

      formActions.setSubmitting(false);
      if (onSubmit) {
        onSubmit();
      }
    } catch (e) {
      toggleLoader(false);
      this.setState({ selectedCategoryId: -1, attachments: [] });
      formActions.setSubmitting(false);
      formActions.resetForm({});
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
    }
  };
}
const mapStateToProps = (state: IState): IStateToProps => {
  return {
    properties: AssetSelectors.getUserActiveAssets(state),
    loaders: AssetSelectors.getAssetLoaders(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch): IDispatchToProps => {
  const { getActiveAssets } = AssetActions;
  const { setCurrentTicket } = TicketActions;
  return bindActionCreators({ getActiveAssets, setCurrentTicket }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(React.memo(AddServiceTicketForm)));

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  clear: {
    color: theme.colors.blue,
  },
  description: {
    marginTop: 16,
  },
  uploadBox: {
    marginVertical: 20,
  },
  emptyState: {
    justifyContent: 'center',
    alignContent: 'center',
    marginTop: theme.viewport.height * 0.2,
    marginHorizontal: 29,
  },
});
