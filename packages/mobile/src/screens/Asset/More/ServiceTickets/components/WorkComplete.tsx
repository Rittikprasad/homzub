import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import ImagePicker, { Image as ImagePickerResponse } from 'react-native-image-crop-picker';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { TicketRepository } from '@homzhub/common/src/domain/repositories/TicketRepository';
import { AnalyticsService } from '@homzhub/common/src/services/Analytics/AnalyticsService';
import { AttachmentService } from '@homzhub/common/src/services/AttachmentService';
import { TicketActions } from '@homzhub/common/src/modules/tickets/actions';
import { TicketSelectors } from '@homzhub/common/src/modules/tickets/selectors';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import ProofOfCompletion from '@homzhub/common/src/components/molecules/ProofOfCompletion';
import { IUploadAttachmentResponse } from '@homzhub/common/src/components/organisms/AddRecordForm';
import { ICompleteTicketPayload, TicketAction } from '@homzhub/common/src/domain/repositories/interfaces';
import { EventType } from '@homzhub/common/src/services/Analytics/EventType';
import { IImageSource } from '@homzhub/common/src/services/AttachmentService/interfaces';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { AttachmentType } from '@homzhub/common/src/constants/AttachmentTypes';
import { TOTAL_IMAGES } from '@homzhub/common/src/constants/ServiceTickets';

interface IProps {
  renderScreen: (children: React.ReactElement) => React.ReactElement;
  setLoader: (isLoading: boolean) => void;
  onSuccess: () => void;
}

const WorkComplete = (props: IProps): React.ReactElement => {
  const { renderScreen, setLoader, onSuccess } = props;
  const dispatch = useDispatch();

  const [comment, setComment] = useState('');
  const attachments = useSelector(TicketSelectors.getProofAttachment);
  const selectedTicket = useSelector(TicketSelectors.getCurrentTicket);
  const { t } = useTranslation(LocaleConstants.namespacesKey.serviceTickets);

  // HANDLERS
  const handleImageUpload = async (): Promise<void> => {
    try {
      const response: ImagePickerResponse | ImagePickerResponse[] = await ImagePicker.openPicker({
        compressImageMaxWidth: 400,
        compressImageMaxHeight: 400,
        compressImageQuality: PlatformUtils.isAndroid() ? 1 : 0.8,
        includeBase64: true,
        maxFiles: !attachments.length ? TOTAL_IMAGES : attachments.length - TOTAL_IMAGES,
        multiple: true,
        mediaType: 'photo',
      });

      const images = response as ImagePickerResponse[];
      let attachment: IImageSource[] = [];
      images.forEach((item) => {
        attachment = [
          ...attachment,
          {
            filename: item.filename,
            path: item.path,
            mime: item.mime,
          },
        ];
      });
      dispatch(TicketActions.setAttachment(attachment));
    }catch (e: any) {      if (e.code !== 'E_PICKER_CANCELLED') {
        AlertHelper.error({ message: e.message });
      }
    }
  };

  const onCommentChange = (value: string): void => {
    setComment(value);
  };

  const onWorkDone = async (): Promise<void> => {
    const formData = new FormData();
    let attachmentIds: number[] = [];

    if (attachments.length > 10) {
      AlertHelper.error({ message: t('maxProof') });
      return;
    }

    setLoader(true);
    if (attachments.length > 0) {
      attachments.forEach((image: any) => {
        // @ts-ignore
        formData.append('files[]', {
          // @ts-ignore
          name: PlatformUtils.isIOS() ? image.filename : image.path.substring(image.path.lastIndexOf('/') + 1),
          uri: image.path,
          type: image.mime,
        });
      });

      /* API call for attachment upload on s3 */
      const response = await AttachmentService.uploadImage(formData, AttachmentType.TICKET_DOCUMENTS);
      const { data, error } = response;
      if (data && data.length > 0) {
        attachmentIds = data.map((i: IUploadAttachmentResponse) => i.id);
      }

      if (error) {
        AlertHelper.error({ message: t('common:fileCorrupt') });
      }
    }
    try {
      if (selectedTicket) {
        const payload: ICompleteTicketPayload = {
          param: { ticketId: selectedTicket.ticketId },
          data: {
            action: TicketAction.COMPLETE_TICKET,
            payload: {
              ...(!!comment && { comment }),
              attachments: attachmentIds,
            },
          },
        };

        await TicketRepository.completeTicket(payload);
        setLoader(false);
        AlertHelper.success({ message: t('ticketComplete') });
        onSuccess();
        dispatch(TicketActions.clearState());
        dispatch(TicketActions.getTickets());

        /* Analytics for closed ticket */
        AnalyticsService.track(EventType.ClosedServiceTicket, {
          project_name: selectedTicket.propertyName ?? '',
          ticketId: selectedTicket.ticketId,
        });
      }
    }catch (e: any) {      setLoader(false);
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
    }
  };

  // HANDLERS

  const renderScreenData = (): React.ReactElement => {
    return (
      <>
        <ProofOfCompletion onUploadImage={handleImageUpload} onUpdateComment={onCommentChange} />
        <Button type="primary" title={t('common:done')} onPress={onWorkDone} />
      </>
    );
  };

  return renderScreen(renderScreenData());
};

export default WorkComplete;
