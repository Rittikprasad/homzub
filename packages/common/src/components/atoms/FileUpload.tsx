import React, { Fragment } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import ProgressBar from 'react-native-progress/Bar';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import { AttachmentService } from '@homzhub/common/src/services/AttachmentService';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import { UploadFileType } from '@homzhub/common/src/domain/models/Attachment';
import { IDocumentSource } from '@homzhub/common/src/services/AttachmentService/interfaces';

interface IFileUploadProps {
  attachments: IDocumentSource[] | File[];
  onDelete: (uri: string, name?: string) => void;
}

const FileUpload = (props: IFileUploadProps): React.ReactElement | null => {
  const { attachments = [], onDelete } = props;
  const { t } = useTranslation();
  const fileSize = (bytes: number): string => {
    const integral = parseFloat((bytes / (1024 * 1024)).toFixed(1));
    return integral ? `${integral} mb` : `${(bytes / 1024).toFixed(1)} kb`;
  };
  if (attachments.length) {
    return (
      <>
        {attachments.map((attachment: IDocumentSource | File, index: number) => {
          const customAttachement = PlatformUtils.isWeb() ? (attachment as File) : (attachment as IDocumentSource);
          const customAttachements = PlatformUtils.isWeb()
            ? (attachments as File[])
            : (attachments as IDocumentSource[]);
          const { name, size } = attachment;
          const { uri } = attachment as IDocumentSource;
          const extension = name.split('.').reverse()[0];
          const fileType = extension === 'pdf' ? UploadFileType.PDF : UploadFileType.IMAGE;
          const isLastAttachment = customAttachements.indexOf(customAttachement) === attachments.length - 1;
          const fileIcon = fileType === UploadFileType.PDF ? icons.doc : icons.imageFile;

          const RenderDivider = (): React.ReactElement =>
            !isLastAttachment ? <Divider containerStyles={styles.divider} /> : <View style={styles.endingEmptyView} />;

          const onPress = (): void => onDelete(uri, name);

          return (
            <Fragment key={index.toString()}>
              <View style={styles.fullContainer}>
                <View style={styles.fileIconView}>
                  <Icon name={fileIcon} size={40} color={theme.colors.lowPriority} style={styles.fileIcon} />
                </View>

                <View style={styles.topView}>
                  <View style={styles.titleView}>
                    <Text
                      type="small"
                      textType="semiBold"
                      style={styles.fileName}
                      ellipsizeMode="tail"
                      numberOfLines={1}
                    >
                      {AttachmentService.getFormattedFileName(name, extension)}
                    </Text>
                    <Icon
                      name={icons.close}
                      size={20}
                      color={theme.colors.darkTint3}
                      style={styles.closeIcon}
                      onPress={onPress}
                    />
                  </View>

                  <ProgressBar
                    color="green"
                    progress={1}
                    borderRadius={4}
                    width={null}
                    height={5}
                    unfilledColor={theme.colors.background}
                    style={styles.progressBar}
                  />

                  <View style={styles.bottomView}>
                    <Text type="small" textType="semiBold" style={styles.fileInfo}>
                      {t('common:completed')}
                    </Text>
                    <Text type="small" textType="semiBold" style={styles.fileInfo}>
                      {fileSize(size)}
                    </Text>
                  </View>
                </View>
              </View>
              <RenderDivider />
            </Fragment>
          );
        })}
      </>
    );
  }
  return null;
};

export default React.memo(FileUpload);

const styles = StyleSheet.create({
  fullContainer: {
    flex: 1,
    flexDirection: 'row',
    height: 85,
    marginTop: 10,
  },
  fileIconView: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  topView: { flex: 4 },
  titleView: {
    flex: 0.7,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  fileName: {
    color: theme.colors.darkTint3,
    height: 20,
  },
  closeIcon: {
    right: 0,
  },
  progressBar: {
    borderColor: theme.colors.disabled,
    marginTop: 10,
  },
  bottomView: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginTop: 8,
  },
  fileInfo: {
    color: theme.colors.darkTint6,
    fontSize: 14,
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
});
