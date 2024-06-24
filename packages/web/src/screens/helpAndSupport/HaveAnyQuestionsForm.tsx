import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Formik, FormikHelpers, FormikProps } from 'formik';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { FormUtils } from '@homzhub/common/src/utils/FormUtils';
import { useDown } from '@homzhub/common/src/utils/MediaQueryUtils';
import { CommonRepository } from '@homzhub/common/src/domain/repositories/CommonRepository';
import { AttachmentService } from '@homzhub/common/src/services/AttachmentService';
import { IDocumentSource } from '@homzhub/common/src/services/AttachmentService/interfaces';
import { theme } from '@homzhub/common/src/styles/theme';
import { icons } from '@homzhub/common/src/assets/icon';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import FileUpload from '@homzhub/common/src/components/atoms/FileUpload';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import { TextArea } from '@homzhub/common/src/components/atoms/TextArea';
import { Avatar } from '@homzhub/common/src/components/molecules/Avatar';
import ConfirmationPopup from '@homzhub/web/src/components/molecules/ConfirmationPopup';
import { FormButton } from '@homzhub/common/src/components/molecules/FormButton';
import { FormDropdown, IDropdownOption } from '@homzhub/common/src/components/molecules/FormDropdown';
import { FormTextInput } from '@homzhub/common/src/components/molecules/FormTextInput';
import { UploadBox } from '@homzhub/common/src/components/molecules/UploadBox';
import { User } from '@homzhub/common/src/domain/models/User';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';
import { AttachmentType } from '@homzhub/common/src/constants/AttachmentTypes';

interface IFormData {
  subject: string;
  description: string;
  category: number;
}
export interface IUploadAttachmentResponse {
  id: string;
  link: string;
}

const HaveAnyQuestionsForm: React.FC = () => {
  const { t } = useTranslation();
  const isTablet = useDown(deviceBreakpoint.TABLET);
  const styles = askQuesFormStyle(isTablet);
  const [categories, setCategories] = useState<IDropdownOption[]>([]);
  const [contact, setContact] = useState<User>();
  const [attachments, setAttachments] = useState<IDocumentSource[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const complainImage = '';
  const supportFormData = {
    subject: '',
    description: '',
    category: 0,
  };
  useEffect(() => {
    getCategories();
    getContact();
  }, []);

  const popupDetails = {
    title: t('common:confirmation'),
    subTitle: t('helpAndSupport:ticketRaised'),
  };

  const formSchema = (): yup.ObjectSchema<IFormData> => {
    return yup.object().shape({
      subject: yup.string().required(t('moreProfile:fieldRequiredError')),
      category: yup.number().required(t('moreProfile:fieldRequiredError')),
      description: yup.string(),
    });
  };
  const getCategories = async (): Promise<void> => {
    try {
      const response = await CommonRepository.getSupportCategories();
      const formattedData = response.map((item) => {
        return {
          label: item.label,
          value: item.id,
        };
      });
      setCategories(formattedData);
    } catch (e) {
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details), statusCode: e.details.statusCode });
    }
  };

  const getContact = async (): Promise<void> => {
    try {
      const response: User = await CommonRepository.getSupportContacts();
      setContact(response);
    } catch (e) {
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details), statusCode: e.details.statusCode });
    }
  };

  const handleFormSubmit = async (values: IFormData, formActions: FormikHelpers<IFormData>): Promise<void> => {
    const { subject, description, category } = values;
    let attachmentIds: Array<number> = [];
    try {
      if (attachments.length) {
        const formData = new FormData();
        attachments.forEach((attachment: IDocumentSource) => {
          // @ts-ignore
          formData.append('files[]', attachment);
        });
        const response = await AttachmentService.uploadImage(formData, AttachmentType.ASSET_DOCUMENT);
        const { data } = response;
        attachmentIds = data.map((item: IUploadAttachmentResponse) => item.id);
      }
      formActions.setSubmitting(true);

      const payload = {
        support_category: Number(category),
        title: subject,
        description,
        attachments: attachmentIds,
      };
      await CommonRepository.postClientSupport(payload);
      setIsOpen(true);
      formActions.resetForm({});
      setAttachments([]);
    } catch (e) {
      formActions.setSubmitting(false);
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details), statusCode: e.details.statusCode });
    }
  };
  const onDropRejection = (): void => {
    AlertHelper.error({ message: t('unsupportedFormat') });
  };

  const handleOnUpload = (files: File[]): void => {
    const documentSource: IDocumentSource[] = [];
    if (files.length) {
      files.forEach((item) => {
        const uri = URL.createObjectURL(item);

        documentSource.push({ type: item.type, name: item.name, uri, size: item.size, fileCopyUri: uri });
      });
      setAttachments([...attachments, ...documentSource]);
    }
  };

  const handleDelete = (uri: string): void => {
    setAttachments(attachments.filter((item) => item.uri !== uri));
  };

  return (
    <View style={styles.content}>
      <View>
        <View>
          <Text type="regular" textType="semiBold" style={styles.title}>
            {t('haveAnyQuestions')}
          </Text>
          <Text type="small" textType="light" style={styles.subtitle}>
            {t('supportFormSubHeader')}
          </Text>
          <Avatar
            fullName={contact?.fullName}
            designation={t('homzhubTeam')}
            phoneCode={contact?.countryCode}
            phoneNumber={contact?.phoneNumber}
          />
        </View>
        <Divider containerStyles={styles.divider} />
      </View>

      <Formik initialValues={supportFormData} onSubmit={handleFormSubmit} validate={FormUtils.validate(formSchema)}>
        {(formProps: FormikProps<IFormData>): React.ReactElement => {
          const handleDescription = (value: string): void => {
            formProps.setFieldValue('description', value);
          };

          return (
            <View>
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
                placeholder={t('typeDescriptionHere')}
                label={t('assetDescription:description')}
                containerStyle={styles.textArea}
                onMessageChange={handleDescription}
                wordCountLimit={500}
                inputContainerStyle={styles.textAreaStyle}
              />

              <UploadBox
                icon={icons.document}
                header={t('uploadDocument')}
                subHeader={t('uploadDocHelperText')}
                containerStyle={styles.uploadBox}
                webOnDropAccepted={handleOnUpload}
                webOnDropRejected={onDropRejection}
                multipleUpload={false}
                VerificationDocumentType={complainImage}
              />
              <FileUpload attachments={attachments} onDelete={handleDelete} />

              <FormButton
                // @ts-ignore
                onPress={formProps.handleSubmit}
                formProps={formProps}
                disabled={!formProps.dirty || !formProps.values.subject || !formProps.values.category}
                type="primary"
                title={t('submit')}
              />
            </View>
          );
        }}
      </Formik>
      {isOpen && <ConfirmationPopup {...popupDetails} />}
    </View>
  );
};

interface IAskQuesFormStyle {
  buttonStyle: ViewStyle;
  textAreaStyle: ViewStyle;
  textArea: ViewStyle;
  title: ViewStyle;
  divider: ViewStyle;
  subtitle: ViewStyle;
  content: ViewStyle;
  dropdownStyle: ViewStyle;
  uploadBox: ViewStyle;
}

const askQuesFormStyle = (isTablet: boolean): StyleSheet.NamedStyles<IAskQuesFormStyle> =>
  StyleSheet.create<IAskQuesFormStyle>({
    buttonStyle: {
      flex: 0,
      marginHorizontal: 20,
    },
    textAreaStyle: {
      height: 100,
      padding: 12,
    },
    textArea: {
      marginTop: 16,
    },
    title: {
      marginBottom: 20,
    },

    divider: {
      marginTop: 16,
    },
    uploadBox: {
      marginTop: 20,
      marginBottom: 32,
    },

    subtitle: {
      marginTop: 8,
      marginBottom: 16,
    },

    content: {
      backgroundColor: theme.colors.white,
      marginLeft: isTablet ? 0 : 20,
      width: '100%',
      paddingVertical: 24,
      paddingHorizontal: 20,
      marginVertical: isTablet ? 16 : 0,
    },
    dropdownStyle: {
      paddingVertical: 12,
    },
  });
export default HaveAnyQuestionsForm;
