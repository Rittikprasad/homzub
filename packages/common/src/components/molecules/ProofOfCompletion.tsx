import React, { ReactElement, useState } from 'react';
import { FlatList, ImageBackground, StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { TicketActions } from '@homzhub/common/src/modules/tickets/actions';
import { TicketSelectors } from '@homzhub/common/src/modules/tickets/selectors';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import { TextArea } from '@homzhub/common/src/components/atoms/TextArea';
import { UploadBox } from '@homzhub/common/src/components/molecules/UploadBox';
import { IImageSource } from '@homzhub/common/src/services/AttachmentService/interfaces';
import { TOTAL_IMAGES } from '@homzhub/common/src/constants/ServiceTickets';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

interface IProps {
  onUpdateComment: (value: string) => void;
  onUploadImage?: () => void;
  renderUploadBox?: (uploadProps: IUploadPropsWeb) => React.ReactElement;
}

export interface IUploadPropsWeb {
  icon: string;
  header: string;
  subHeader: string;
  containerStyle: StyleProp<ViewStyle>;
}

const ProofOfCompletion = (props: IProps): ReactElement => {
  const { renderUploadBox, onUpdateComment, onUploadImage } = props;
  const { t } = useTranslation(LocaleConstants.namespacesKey.serviceTickets);
  const dispatch = useDispatch();
  const attachments = useSelector(TicketSelectors.getProofAttachment);

  const [comment, setComment] = useState('');

  // HANDLERS
  const onCommentChange = (value: string): void => {
    setComment(value);
    onUpdateComment(value);
  };

  const onAddProof = (images: IImageSource[] | File[]): void => {
    if (images.length === TOTAL_IMAGES) {
      AlertHelper.error({ message: t('common:uploadWarning') });
    } else if (onUploadImage) {
      onUploadImage();
    }
  };

  const onRemoveProof = (key: string): void => {
    dispatch(TicketActions.removeAttachment(key));
  };
  // HANDLERS

  const renderImageView = ({ item }: { item: IImageSource | File }): ReactElement => {
    let imageSrc;
    let imageName: string;
    if (PlatformUtils.isWeb()) {
      item = item as File;
      // @ts-ignore
      imageSrc = item.path;
      imageName = item.name;
    }

    const { path, filename } = item as IImageSource;
    imageSrc = path;
    imageName = filename;
    return (
      <View style={styles.imageContainer}>
        <ImageBackground source={{ uri: imageSrc }} style={styles.image}>
          <TouchableOpacity style={styles.iconContainer} onPress={(): void => onRemoveProof(imageName)}>
            <Icon name={icons.close} color={theme.colors.white} size={18} />
          </TouchableOpacity>
        </ImageBackground>
      </View>
    );
  };

  const uploadBoxProps = {
    icon: icons.gallery,
    header: t('common:addPhoto'),
    subHeader: t('uploadIssuePhotoHelperText'),
    containerStyle: styles.uploadButton,
  };

  return (
    <View style={styles.container}>
      <Text type="small" textType="semiBold">
        {t('uploadProof')}
      </Text>
      <Text type="small" style={styles.subHeading}>
        {t('showcasePhoto')}
      </Text>
      {!PlatformUtils.isWeb() && (
        <UploadBox
          icon={icons.gallery}
          header={t('common:addPhoto')}
          subHeader={t('uploadIssuePhotoHelperText')}
          onPress={onAddProof}
          containerStyle={styles.uploadButton}
        />
      )}
      {PlatformUtils.isWeb() && renderUploadBox && renderUploadBox(uploadBoxProps)}
      {attachments.length > 0 && (
        <>
          <Text type="small">{t('property:uploadedImages')}</Text>
          <FlatList
            // @ts-ignore
            data={attachments}
            renderItem={renderImageView}
            numColumns={2}
            contentContainerStyle={styles.list}
          />
        </>
      )}
      <TextArea
        value={comment}
        label={t('common:comment')}
        helpText={t('common:optional')}
        placeholder={t('common:typeComment')}
        wordCountLimit={450}
        onMessageChange={onCommentChange}
      />
    </View>
  );
};

export default ProofOfCompletion;

const styles = StyleSheet.create({
  container: {
    margin: 16,
  },
  subHeading: {
    marginVertical: 12,
  },
  list: {
    marginVertical: 14,
  },
  uploadButton: {
    marginVertical: 20,
  },
  imageContainer: {
    flex: 1,
    margin: 6,
  },
  image: {
    height: 100,
  },
  iconContainer: {
    height: 22,
    width: 22,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: theme.colors.darkTint4,
  },
});
