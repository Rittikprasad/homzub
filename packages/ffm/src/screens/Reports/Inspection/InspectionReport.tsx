import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { StringUtils } from '@homzhub/common/src/utils/StringUtils';
import { FFMRepository } from '@homzhub/common/src/domain/repositories/FFMRepository';
import { FFMSelector } from '@homzhub/common/src/modules/ffm/selectors';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Loader } from '@homzhub/common/src/components/atoms/Loader';
import { SVGUri } from '@homzhub/common/src/components/atoms/Svg';
import { Label, Text } from '@homzhub/common/src/components/atoms/Text';
import { InspectionFinalReport } from '@homzhub/common/src/domain/models/InspectionFinalReport';
import { SpaceDetail } from '@homzhub/common/src/domain/models/SpaceDetail';
import { Condition, SpaceInspection } from '@homzhub/common/src/domain/models/SpaceInspection';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

interface IProps {
  onSubmit: () => void;
  onGoBack: () => void;
  onEdit: (id: number) => void;
  onSetInspection: (inspection: SpaceInspection) => void;
  isCompletedReport?: boolean;
}

const InspectionReport = ({
  onEdit,
  onSetInspection,
  onSubmit,
  onGoBack,
  isCompletedReport = false,
}: IProps): React.ReactElement => {
  const { t } = useTranslation(LocaleConstants.namespacesKey.reports);
  const report = useSelector(FFMSelector.getCurrentReport);
  const [finalReport, setFinalReport] = useState<InspectionFinalReport>();

  useEffect(() => {
    if (report) {
      FFMRepository.getFinalReport(report.id)
        .then((res) => {
          setFinalReport(res);
        })
        .catch((e) => {
          AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
        });
    }
  }, []);

  const getConditionColor = (value: Condition): string => {
    if (value === Condition.OK) return theme.colors.mediumPriority;
    if (value === Condition.GOOD) return theme.colors.green;
    return theme.colors.error;
  };

  const renderCard = (reportItem: SpaceDetail): React.ReactElement => {
    const { reportSpaceUnits, name, iconUrl, id } = reportItem;
    return (
      <View style={styles.cardContainer}>
        <View style={styles.cardHeader}>
          <View style={styles.center}>
            <SVGUri uri={iconUrl} height={25} width={25} />
            <Text type="small" textType="semiBold" style={styles.headerTitle}>
              {name}
            </Text>
          </View>
          <TouchableOpacity disabled={isCompletedReport} onPress={(): void => onEdit(id)}>
            <Icon
              name={icons.noteBook}
              size={18}
              color={isCompletedReport ? theme.colors.disabled : theme.colors.primaryColor}
            />
          </TouchableOpacity>
        </View>
        {reportSpaceUnits.map((item, index) => {
          const { spaceInspection } = item;
          return (
            <View key={index} style={styles.cardItem}>
              <Text type="small" textType="semiBold" style={styles.unitName}>
                {item.name}
              </Text>
              <Label type="large" style={{ color: getConditionColor(spaceInspection?.spaceCondition ?? Condition.OK) }}>
                {StringUtils.toTitleCase(spaceInspection?.spaceCondition ?? '')}
              </Label>
              <TouchableOpacity onPress={(): void => onSetInspection(spaceInspection ?? new SpaceInspection())}>
                <Icon name={icons.docFilled} size={22} color={theme.colors.primaryColor} />
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <View>
      {finalReport ? (
        <>
          {finalReport.inspectionReportSpaces.map((item) => renderCard(item))}
          {isCompletedReport ? (
            <Button
              type="primary"
              title={t('backToReports')}
              onPress={onGoBack}
              containerStyle={styles.buttonContainer}
            />
          ) : (
            <Button
              type="primary"
              title={t('submitInspection')}
              onPress={onSubmit}
              disabled={isCompletedReport}
              containerStyle={styles.buttonContainer}
            />
          )}
        </>
      ) : (
        <Loader visible />
      )}
    </View>
  );
};

export default InspectionReport;

const styles = StyleSheet.create({
  buttonContainer: {
    marginVertical: 16,
  },
  cardContainer: {
    backgroundColor: theme.colors.background,
    marginVertical: 12,
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  center: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    marginHorizontal: 8,
    color: theme.colors.darkTint1,
  },
  cardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 16,
  },
  unitName: {
    color: theme.colors.darkTint1,
  },
});
