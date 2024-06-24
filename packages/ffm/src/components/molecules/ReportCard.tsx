import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { ReportService } from '@homzhub/ffm/src/services/ReportService';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Label, Text } from '@homzhub/common/src/components/atoms/Text';
import { BottomSheet } from '@homzhub/common/src/components/molecules/BottomSheet';
import UserWithAddressCard from '@homzhub/ffm/src/components/molecules/UserWithAddressCard';
import VisitContact from '@homzhub/ffm/src/components/molecules/VisitContact';
import { Report, ReportStatus } from '@homzhub/common/src/domain/models/Report';
import { User } from '@homzhub/common/src/domain/models/User';
import { IUpdateReport } from '@homzhub/common/src/domain/repositories/interfaces';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

interface IProps {
  data: Report;
  handleAction: (payload: IUpdateReport) => void;
}

const ReportCard = (props: IProps): React.ReactElement => {
  const {
    data: { id, asset, users, updatedAt, createdAt, dueDate, status, completedPercentage, completedAt, inspectionType },
    data,
    handleAction,
  } = props;
  const { t } = useTranslation(LocaleConstants.namespacesKey.reports);
  const [selectedUser, setUser] = useState<User | null>(null);
  const [isContactVisible, setIsContactVisible] = useState(false);

  const handleContactDetails = (isVisible: boolean, user: User | null): void => {
    setUser(user);
    setIsContactVisible(isVisible);
  };

  const getCancelVisibility = (): boolean => {
    const { ACCEPTED, NEW } = ReportStatus;
    return (
      (status === ACCEPTED && !DateUtils.isPastDate(dueDate)) ||
      (status === ACCEPTED && DateUtils.isPastDate(dueDate) && completedPercentage > 0) ||
      (status === NEW && !DateUtils.isPastDate(dueDate))
    );
  };

  const getDateTitle = (): string => {
    if (completedAt) {
      return 'Completed On';
    }
    return DateUtils.isPastDate(dueDate) ? t('overdueSince') : t('assetFinancial:dueBy');
  };

  const renderActions = (): React.ReactElement => {
    const actionsData = ReportService.getActions(data).filter((item) => item.title);

    return (
      <View style={styles.actionContainer}>
        {actionsData.map((item, index) => {
          const isSingleAction = index === 0 && actionsData.length === 1;
          return (
            <Button
              key={index}
              type="secondary"
              title={item.title}
              icon={item.icon}
              iconSize={16}
              onPress={(): void => handleAction({ reportId: id, status: item.title })}
              iconColor={item.iconColor}
              titleStyle={[styles.titleStyle, { color: item.color }]}
              containerStyle={[
                styles.buttonContainer,
                isSingleAction && styles.singleAction,
                item.isReverse && styles.buttonDirection,
              ]}
            />
          );
        })}
      </View>
    );
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.container}>
        {inspectionType && (
          <Text type="small" textType="semiBold" style={styles.reportTitle}>
            {inspectionType.label}
          </Text>
        )}
        <UserWithAddressCard
          users={users}
          asset={asset}
          isFromDetail={false}
          date={updatedAt ?? createdAt}
          handleContactDetails={handleContactDetails}
        />
        <View style={styles.row}>
          <View>
            <Label style={styles.detailTitle}>{getDateTitle()}</Label>
            <Label textType="semiBold" style={styles.detailTitle}>
              {DateUtils.getDisplayDate(completedAt || dueDate, 'DD MMM YYYY')}
            </Label>
          </View>
          {getCancelVisibility() && (
            <Button
              type="secondary"
              containerStyle={styles.cancelButton}
              onPress={(): void => handleAction({ reportId: id, status: 'Cancel' })}
              title={t('common:cancel')}
            />
          )}
        </View>
      </View>
      {renderActions()}
      {selectedUser && isContactVisible && (
        <BottomSheet
          visible={isContactVisible}
          isShadowView
          sheetHeight={300}
          headerTitle={t('contactUser', { name: selectedUser?.role.replace(/_/g, ' ').toLocaleLowerCase() })}
          onCloseSheet={(): void => handleContactDetails(false, null)}
        >
          <VisitContact user={selectedUser} imageSize={80} containerStyle={styles.contactCard} />
        </BottomSheet>
      )}
    </View>
  );
};

export default ReportCard;

const styles = StyleSheet.create({
  mainContainer: {
    borderWidth: 1,
    borderColor: theme.colors.darkTint10,
    marginBottom: 20,
  },
  container: {
    padding: 16,
  },
  contactCard: {
    marginHorizontal: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailTitle: {
    color: theme.colors.darkTint3,
  },
  actionContainer: {
    borderTopWidth: 1,
    flexDirection: 'row',
    borderColor: theme.colors.darkTint10,
  },
  singleAction: {
    flex: 0,
    marginHorizontal: 16,
  },
  buttonContainer: {
    borderWidth: 0,
    flexDirection: 'row',
  },
  buttonDirection: {
    flexDirection: 'row-reverse',
  },
  titleStyle: {
    marginHorizontal: 4,
  },
  cancelButton: {
    borderWidth: 0,
    flex: 0,
  },
  reportTitle: {
    color: theme.colors.primaryColor,
    marginBottom: 12,
  },
});
