import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ColorUtils } from '@homzhub/common/src/utils/ColorUtils';
import { DateUtils } from '@homzhub/common/src/utils/DateUtils';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Badge } from '@homzhub/common/src/components/atoms/Badge';
import { Label, Text } from '@homzhub/common/src/components/atoms/Text';
import { SVGUri } from '@homzhub/common/src/components/atoms/Svg';
import Menu, { IMenu } from '@homzhub/common/src/components/molecules/Menu';
import { Attachment, MediaType } from '@homzhub/common/src/domain/models/Attachment';
import { Service } from '@homzhub/common/src/domain/models/Service';

interface IProps {
  service: Service;
  menuOptions: IMenu[];
  onSelectOption: (value: string) => void;
  onAttachmentPress: (attachment: Attachment[]) => void;
}

const ServiceCard = ({ service, menuOptions, onSelectOption, onAttachmentPress }: IProps): React.ReactElement => {
  const { t } = useTranslation();
  const { label, status, attachment, iconAttachment, referenceId, statusUpdatedAt } = service;

  return (
    <View style={styles.container}>
      <View style={styles.topView}>
        <View style={styles.topLeft}>
          <SVGUri uri={iconAttachment.link} height={38} width={42} />
          <View style={styles.heading}>
            <Text type="small" textType="semiBold">
              {label}
            </Text>
            <Badge
              title={status.label.replace('_', ' ')}
              badgeColor={ColorUtils.convertHexToRgb(status.colorCode, 10)}
              badgeStyle={styles.badge}
              titleStyle={[styles.badgeTitle, { color: status.colorCode }]}
            />
          </View>
        </View>
        <Menu data={menuOptions} onSelect={onSelectOption} optionTitle={t('assetMore:attachmentOptions')} />
      </View>
      {attachment.length > 0 && (
        <TouchableOpacity style={styles.attachmentView} onPress={(): void => onAttachmentPress(attachment)}>
          <Icon
            name={attachment[0].mediaType === MediaType.image ? icons.image : icons.pdfFile}
            color={theme.colors.primaryColor}
            size={20}
          />
          <Text type="small" style={styles.attachmentText}>
            {attachment.length > 1
              ? `${attachment.length} ${attachment[0].mediaType === MediaType.image ? t('photos') : t('attachments')}`
              : attachment[0].fileName}
          </Text>
        </TouchableOpacity>
      )}
      <View style={styles.bottomView}>
        <Label type="large" style={styles.text}>
          {`ID: ${referenceId}`}
        </Label>
        <Label type="large" style={styles.text}>
          {DateUtils.getDisplayDate(statusUpdatedAt, 'DD.MM.YYYY')}
        </Label>
      </View>
    </View>
  );
};

export default ServiceCard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.lightGrayishBlue,
    padding: 16,
    marginBottom: 16,
  },
  topView: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  topLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heading: {
    marginHorizontal: 12,
  },
  badge: {
    alignSelf: 'flex-start',
    marginVertical: 8,
  },
  attachmentView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  attachmentText: {
    color: theme.colors.primaryColor,
    marginHorizontal: 6,
  },
  bottomView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  text: {
    color: theme.colors.darkTint3,
  },
  badgeTitle: {
    marginHorizontal: 12,
    marginVertical: 1,
  },
});
