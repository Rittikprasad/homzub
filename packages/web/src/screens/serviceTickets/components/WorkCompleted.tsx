import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { TicketRepository } from '@homzhub/common/src/domain/repositories/TicketRepository';
import { AnalyticsService } from '@homzhub/common/src/services/Analytics/AnalyticsService';
import { AttachmentService } from '@homzhub/common/src/services/AttachmentService';
import { EventType } from '@homzhub/common/src/services/Analytics/EventType';
import { TicketActions } from '@homzhub/common/src/modules/tickets/actions';
import { TicketSelectors } from '@homzhub/common/src/modules/tickets/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Loader } from '@homzhub/common/src/components/atoms/Loader';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import ProofOfCompletion, { IUploadPropsWeb } from '@homzhub/common/src/components/molecules/ProofOfCompletion';
import { UploadBox } from '@homzhub/common/src/components/molecules/UploadBox';
import { IUploadAttachmentResponse } from '@homzhub/common/src/components/organisms/AddRecordForm';
import { ICompleteTicketPayload, TicketAction } from '@homzhub/common/src/domain/repositories/interfaces';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { AttachmentType, IFile } from '@homzhub/common/src/constants/AttachmentTypes';

interface IProps {
  onSuccess: () => void;
}

const WorkCompleted: React.FC<IProps> = (props: IProps): React.ReactElement => {
  const dispatch = useDispatch();
  const { onSuccess } = props;
  const [comment, setComment] = useState('');
  const [isLoading, setLoader] = useState(false);
  const attachments = useSelector(TicketSelectors.getProofAttachmentWeb);
  const selectedTicket = useSelector(TicketSelectors.getCurrentTicket);
  const { t } = useTranslation(LocaleConstants.namespacesKey.serviceTickets);

  // HANDLERS
  const onUploadAccept = (images: File[]): void => {
    const promise = Promise.resolve();
    const promises = images.map((file: File) =>
      promise.then(() => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (): void => {
            const customFile: IFile = {
              name: file.name,
              path: reader.result as string,
              type: file.type,
              size: file.size,
            };

            resolve({
              file,
              customFile,
            });
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      })
    );

    promise.then(() => {
      Promise.all(promises).then((res) => {
        const files = res.map((item: any) => item.file);
        const customFiles = res.map((item: any) => item.customFile);
        dispatch(TicketActions.setAttachment(customFiles as IFile[]));
        dispatch(TicketActions.setAttachmentWeb(files));
      });
    });
  };

  const renderUploadBox = (uploadProps: IUploadPropsWeb): React.ReactElement => {
    return <UploadBox {...uploadProps} webOnDropAccepted={onUploadAccept} multipleUpload />;
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
      attachments.forEach((image: File) => {
        // @ts-ignore
        formData.append('files[]', image);
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
        onSuccess();
        AlertHelper.success({ message: t('ticketComplete') });
        dispatch(TicketActions.clearState());
        dispatch(TicketActions.getTickets());

        /* Analytics for closed ticket */
        AnalyticsService.track(EventType.ClosedServiceTicket, {
          project_name: selectedTicket.propertyName ?? '',
          ticketId: selectedTicket.ticketId,
        });
      }
    } catch (e: any) {
      setLoader(false);
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
    }
  };

  // HANDLERS

  return (
    <View>
      <Loader visible={isLoading} />
      <Typography variant="text" size="small" fontWeight="semiBold" style={styles.title}>
        {selectedTicket?.propertyName ?? ''}
      </Typography>
      <ProofOfCompletion renderUploadBox={renderUploadBox} onUpdateComment={onCommentChange} />
      <Button type="primary" title={t('common:done')} onPress={onWorkDone} />
    </View>
  );
};

export default WorkCompleted;

const styles = StyleSheet.create({
  title: {
    color: theme.colors.darkTint1,
  },
});
