import React, { Component, ReactElement } from 'react';
import { StyleSheet, View } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Formik, FormikHelpers, FormikProps, FormikValues } from 'formik';
import { isEmpty } from 'lodash';
import * as yup from 'yup';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { FormUtils } from '@homzhub/common/src/utils/FormUtils';
import { CommonParamList } from '@homzhub/mobile/src/navigation/Common';
import { CommonRepository } from '@homzhub/common/src/domain/repositories/CommonRepository';
import { AttachmentService } from '@homzhub/common/src/services/AttachmentService';
import { IDocumentSource } from '@homzhub/common/src/services/AttachmentService/interfaces';
import { icons } from '@homzhub/common/src/assets/icon';
import Check from '@homzhub/common/src/assets/images/check.svg';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { Loader } from '@homzhub/common/src/components/atoms/Loader';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import { TextArea } from '@homzhub/common/src/components/atoms/TextArea';
import { SelectionPicker } from '@homzhub/common/src/components/atoms/SelectionPicker';
import { Avatar } from '@homzhub/common/src/components/molecules/Avatar';
import { BottomSheet } from '@homzhub/common/src/components/molecules/BottomSheet';
import { FormButton } from '@homzhub/common/src/components/molecules/FormButton';
import { FormDropdown, IDropdownOption } from '@homzhub/common/src/components/molecules/FormDropdown';
import { FormTextInput } from '@homzhub/common/src/components/molecules/FormTextInput';
import { HeaderCard, UploadBoxComponent } from '@homzhub/mobile/src/components';
import CaseLogs from '@homzhub/mobile/src/components/organisms/CaseLogs';
import { IUploadAttachmentResponse } from '@homzhub/common/src/components/organisms/AddRecordForm';
import { UserScreen } from '@homzhub/mobile/src/components/HOC/UserScreen';
import { CaseLog, Status } from '@homzhub/common/src/domain/models/CaseLog';
import { User } from '@homzhub/common/src/domain/models/User';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { AttachmentType } from '@homzhub/common/src/constants/AttachmentTypes';

enum TabKeys {
  newCase = 'NEW_CASE',
  caseLogs = 'CASE_LOGS',
}
interface IFormData {
  subject: string;
  category: number;
  description: string;
}

interface IScreenState {
  formData: IFormData;
  categories: IDropdownOption[];
  contact: User;
  attachments: IDocumentSource[];
  isFormSubmitted: boolean;
  isLoading: boolean;
  currentTab: TabKeys;
  caseLogs: CaseLog[];
}

type Props = WithTranslation & NavigationScreenProps<CommonParamList, ScreensKeys.SupportScreen>;

export class Support extends Component<Props, IScreenState> {
  private resetForm: ((nextValues?: FormikValues) => void) | undefined;

  public state = {
    formData: {
      subject: '',
      category: 0,
      description: '',
    },
    categories: [],
    contact: {} as User,
    attachments: [],
    isFormSubmitted: false,
    isLoading: false,
    currentTab: TabKeys.newCase,
    caseLogs: [],
  };

  public componentDidMount = async (): Promise<void> => {
    const {
      route: { params },
    } = this.props;
    const { formData } = this.state;
    if (params && params.categoryId) {
      this.setState({
        formData: {
          ...formData,
          category: params.categoryId,
        },
      });
    }
    await this.getCategories();
    await this.getContact();
    await this.getCaseLogs();
  };

  public render(): React.ReactNode {
    const { t, route } = this.props;
    const { isFormSubmitted, isLoading, currentTab } = this.state;
    const title = route?.params?.isFromDashboard ? t('assetDashboard:dashboard') : t('assetMore:more');
    const renderItem = (): React.ReactElement | null => this.renderForm();
    return (
      <>
        <UserScreen title={title}>
          <HeaderCard
            title={t('assetMore:support')}
            titleFontWeight="semiBold"
            subTitle={t('clear')}
            iconBackSize={24}
            titleTextSize="small"
            renderItem={renderItem}
            onIconPress={this.onGoBack}
            onClearPress={currentTab === TabKeys.caseLogs ? undefined : this.clearForm}
          />
        </UserScreen>
        <BottomSheet visible={isFormSubmitted} sheetHeight={400} onCloseSheet={this.onCloseSheet}>
          {this.renderContinueView()}
        </BottomSheet>
        <Loader visible={isLoading} />
      </>
    );
  }

  private renderContent = (): React.ReactElement | null => {
    const { t } = this.props;
    const { contact, currentTab, caseLogs } = this.state;
    const count = caseLogs.filter((item: CaseLog) =>
      item.status.toLowerCase().includes(Status.open.toLowerCase())
    ).length;
    if (isEmpty(contact)) {
      return null;
    }
    return (
      <View style={styles.content}>
        <SelectionPicker
          data={[
            { title: t('assetMore:newCase'), value: TabKeys.newCase },
            { title: t('assetMore:caseLogs', { count }), value: TabKeys.caseLogs },
          ]}
          selectedItem={[currentTab]}
          onValueChange={this.onTabChange}
        />
        {currentTab === TabKeys.newCase ? (
          <>
            <View style={styles.contactView}>
              <Text type="small" textType="semiBold" style={styles.title}>
                {t('youContacting')}
              </Text>
              <Avatar
                fullName={contact.fullName}
                designation={t('homzhubTeam')}
                phoneCode={contact.countryCode}
                phoneNumber={contact.phoneNumber}
              />
            </View>
            <Divider />
          </>
        ) : (
          <CaseLogs caseLogs={caseLogs} />
        )}
      </View>
    );
  };

  private renderForm = (): React.ReactElement => {
    const { t } = this.props;
    const { formData, categories, attachments, isLoading } = this.state;
    return (
      <Formik
        onSubmit={this.handleFormSubmit}
        initialValues={{ ...formData }}
        validate={FormUtils.validate(this.formSchema)}
        enableReinitialize
      >
        {(formProps: FormikProps<FormikValues>): React.ReactNode => {
          const handleDescription = (value: string): void => {
            formProps.setFieldValue('description', value);
          };
          this.initializeReset(formProps);

          return (
            <>
              {this.renderContent()}
              <FormTextInput
                formProps={formProps}
                isMandatory
                inputType="default"
                name="subject"
                label={t('subject')}
                placeholder={t('subjectPlaceholder')}
              />
              <FormDropdown
                name="category"
                placeholder={t('categoryExample')}
                label={t('assetFinancial:category')}
                isMandatory
                options={categories}
                formProps={formProps}
                dropdownContainerStyle={styles.dropdownStyle}
              />
              <TextArea
                value={formProps.values.description}
                placeholder={t('typeDescription')}
                label={t('assetDescription:description')}
                containerStyle={styles.textArea}
                onMessageChange={handleDescription}
              />
              <UploadBoxComponent
                attachments={attachments}
                icon={icons.document}
                header={t('uploadDocument')}
                subHeader={t('uploadDocHelperText')}
                onCapture={this.handleUpload}
                onDelete={this.handleDocumentDelete}
                containerStyle={styles.content}
              />
              <FormButton
                // @ts-ignore
                onPress={formProps.handleSubmit}
                formProps={formProps}
                disabled={!formProps.values.subject || !formProps.values.category || isLoading}
                type="primary"
                title={t('submit')}
              />
            </>
          );
        }}
      </Formik>
    );
  };

  private renderContinueView = (): ReactElement => {
    const { t } = this.props;
    return (
      <>
        <View style={styles.sheetContent}>
          <Text type="large" textType="semiBold" style={styles.sheetTitle}>
            {t('common:messageSent')}
          </Text>
          <Text type="small">{t('common:inTouch')}</Text>
          <Check style={styles.content} />
        </View>
        <Button
          type="primary"
          title={t('common:continue')}
          containerStyle={styles.buttonStyle}
          onPress={this.onCloseSheet}
        />
      </>
    );
  };

  private onTabChange = (tabId: TabKeys): void => {
    this.setState({ currentTab: tabId });
    this.clearForm();
  };

  private onCloseSheet = (): void => {
    this.setState({ isFormSubmitted: false });
    this.clearForm();
  };

  private onGoBack = (): void => {
    const { navigation } = this.props;
    navigation.goBack();
  };

  private initializeReset = (formProps: FormikProps<FormikValues>): void => {
    if (!this.resetForm) {
      this.resetForm = formProps.resetForm;
    }
  };

  private clearForm = (): void => {
    if (this.resetForm) {
      this.resetForm();
      this.setState({
        attachments: [],
      });
    }
  };

  private formSchema = (): yup.ObjectSchema<IFormData> => {
    const { t } = this.props;

    return yup.object().shape({
      subject: yup.string().required(t('moreProfile:fieldRequiredError')),
      category: yup.number().required(t('moreProfile:fieldRequiredError')),
      description: yup.string(),
    });
  };

  private getCategories = async (): Promise<void> => {
    this.setState({ isLoading: true });
    try {
      const response = await CommonRepository.getSupportCategories();
      const formattedData = response.map((item) => {
        return {
          label: item.label,
          value: item.id,
        };
      });
      this.setState({ isLoading: false, categories: formattedData });
    }catch (e: any) {      this.setState({ isLoading: false });
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
    }
  };

  private getContact = async (): Promise<void> => {
    this.setState({ isLoading: true });
    try {
      const response: User = await CommonRepository.getSupportContacts();
      this.setState({ contact: response, isLoading: false });
    }catch (e: any) {      this.setState({ isLoading: false });
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
    }
  };

  private getCaseLogs = async (): Promise<void> => {
    this.setState({ isLoading: true });
    try {
      const response = await CommonRepository.getClientSupport();
      this.setState({ isLoading: false, caseLogs: response });
    }catch (e: any) {      this.setState({ isLoading: false });
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
    }
  };

  private handleUpload = (attachments: IDocumentSource[]): void => {
    this.setState((prevState: IScreenState) => {
      return { attachments: [...prevState.attachments, ...attachments] };
    });
  };

  private handleDocumentDelete = (uri: string): void => {
    this.setState((prevState) => {
      return { attachments: prevState.attachments.filter((file) => file.uri !== uri) };
    });
  };

  private handleFormSubmit = async (values: IFormData, formActions: FormikHelpers<IFormData>): Promise<void> => {
    const { attachments } = this.state;
    const { subject, description, category } = values;
    let attachmentIds: Array<number> = [];

    this.setState({ isLoading: true });
    try {
      // @ts-ignore
      if (attachments.length) {
        /* Make an API call for uploading the document and extract the doc Id */
        const formData = new FormData();
        attachments.forEach((attachment: IDocumentSource) => {
          // @ts-ignore
          formData.append('files[]', attachment);
        });
        const response = await AttachmentService.uploadImage(formData, AttachmentType.ASSET_DOCUMENT);
        const { data } = response;
        attachmentIds = data.map((i: IUploadAttachmentResponse) => i.id);
      }
      formActions.setSubmitting(true);

      const payload = {
        support_category: Number(category),
        title: subject,
        description,
        attachments: attachmentIds,
      };
      await CommonRepository.postClientSupport(payload);
      await this.getCaseLogs();
      this.setState({
        isFormSubmitted: true,
        attachments: [],
        isLoading: false,
      });
      formActions.resetForm({});
    }catch (e: any) {      this.setState({ isLoading: false });
      formActions.setSubmitting(false);
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
    }
  };
}

export default withTranslation()(Support);

const styles = StyleSheet.create({
  sheetContent: {
    alignItems: 'center',
  },
  sheetTitle: {
    marginBottom: 8,
  },
  buttonStyle: {
    flex: 0,
    height: 50,
    marginHorizontal: 16,
  },
  title: {
    marginBottom: 20,
  },
  content: {
    marginVertical: 24,
  },
  contactView: {
    marginBottom: 18,
    marginTop: 24,
  },
  dropdownStyle: {
    paddingVertical: 12,
  },
  textArea: {
    marginTop: 10,
  },
});
