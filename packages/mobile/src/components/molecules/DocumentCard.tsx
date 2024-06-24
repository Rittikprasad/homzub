import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { DateFormats, DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { FunctionUtils } from '@homzhub/common/src/utils/FunctionUtils';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import { AssetDocument } from '@homzhub/common/src/domain/models/AssetDocument';

interface IProps {
  testID?: string;
  userEmail: string;
  document: AssetDocument;
  handleShare?: (link: string) => void;
  handleDelete?: (id: number) => void;
  handleDownload?: (refKey: string, fileName: string) => void;
  handleOpenDocument?: () => Promise<void>;
  canDelete?: boolean;
  showIcons?: boolean;
  rightIcon?: string;
  leftIcon?: string;
  onRightIconPress?: () => void;
  rightIconSize?: number;
  leftIconSize?: number;
  renderRightNode?: () => React.ReactElement;
}

export const DocumentCard = ({
  document,
  handleShare = FunctionUtils.noop,
  userEmail,
  handleDelete = FunctionUtils.noop,
  handleDownload = FunctionUtils.noop,
  handleOpenDocument = FunctionUtils.noopAsync,
  canDelete = true,
  showIcons = true,
  rightIcon,
  rightIconSize = 35,
  leftIcon,
  leftIconSize = 35,
  onRightIconPress,
  renderRightNode,
}: IProps): React.ReactElement => {
  const {
    attachment: { fileName, link, presignedReferenceKey },
    user,
    isSystemGenerated,
  } = document;
  const { t } = useTranslation();

  const getUploadedBy = (): string | undefined => {
    if (isSystemGenerated) return t('common:homzhub');
    if (userEmail === user?.email) return t('you');
    return user?.fullName;
  };

  const uploadedBy = getUploadedBy();
  const uploadedOn = DateUtils.getDisplayDate(document.uploadedOn, DateFormats.DD_MM_YYYY);
  const onShare = (): void => handleShare(link);
  const onDelete = (): void => handleDelete(document.id);
  const onDownload = (): void => handleDownload(presignedReferenceKey, fileName);

  const RightView = (): React.ReactElement => {
    if (rightIcon)
      return <Icon name={rightIcon} size={rightIconSize} color={theme.colors.lowPriority} onPress={onRightIconPress} />;
    return <>{renderRightNode && !rightIcon && renderRightNode()}</>;
  };

  const TextualContent = (): React.ReactElement => (
    <TouchableOpacity style={styles.leftView} onPress={handleOpenDocument}>
      <Label type="large" textType="semiBold" style={styles.title} numberOfLines={1}>
        {fileName}
      </Label>
      <Label type="regular" style={styles.description} numberOfLines={1}>
        {t('assetPortfolio:uploadedOn', { uploadedOn, uploadedBy })}
      </Label>
    </TouchableOpacity>
  );

  const LeftView = (): React.ReactElement | null => {
    if (!leftIcon) return null;
    return (
      <TouchableOpacity onPress={handleOpenDocument}>
        <Icon name={leftIcon} size={leftIconSize} color={theme.colors.lowPriority} style={styles.leftIcon} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <LeftView />
        <TextualContent />
        <RightView />
      </View>
      {showIcons && (
        <View style={styles.iconContainer}>
          {canDelete && (
            <Icon name={icons.trash} size={22} color={theme.colors.blue} style={styles.iconStyle} onPress={onDelete} />
          )}
          <Icon
            name={icons.shareFilled}
            size={22}
            color={theme.colors.blue}
            style={styles.iconStyle}
            onPress={onShare}
          />
          <Icon
            name={icons.download}
            size={22}
            color={theme.colors.blue}
            style={styles.iconStyle}
            onPress={onDownload}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 6,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 18,
  },
  leftView: {
    flex: 1,
    marginEnd: 16,
  },
  title: {
    color: theme.colors.darkTint3,
  },
  description: {
    color: theme.colors.darkTint5,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconStyle: {
    marginEnd: 28,
  },
  leftIcon: {
    marginEnd: 15,
  },
});
