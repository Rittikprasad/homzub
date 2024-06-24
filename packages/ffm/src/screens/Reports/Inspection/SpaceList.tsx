import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, StyleProp, StyleSheet, TextInput, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { FFMRepository } from '@homzhub/common/src/domain/repositories/FFMRepository';
import { FFMActions } from '@homzhub/common/src/modules/ffm/actions';
import { FFMSelector } from '@homzhub/common/src/modules/ffm/selectors';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { SVGUri } from '@homzhub/common/src/components/atoms/Svg';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import { BottomSheet } from '@homzhub/common/src/components/molecules/BottomSheet';
import InspectionReport from '@homzhub/ffm/src/screens/Reports/Inspection/InspectionReport';
import { ReportSpace } from '@homzhub/common/src/domain/models/ReportSpace';
import { SpaceInspection } from '@homzhub/common/src/domain/models/SpaceInspection';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

interface IProps {
  onSelectSpace: (space: ReportSpace, fromPreview?: boolean) => void;
  onSetInspection: (inspection: SpaceInspection) => void;
  onSubmit: () => void;
  onGoBack: () => void;
  isPreview?: boolean;
  isCompletedReport?: boolean;
}

const SpaceList = ({
  onSelectSpace,
  onSetInspection,
  onSubmit,
  onGoBack,
  isPreview = false,
  isCompletedReport = false,
}: IProps): React.ReactElement => {
  const dispatch = useDispatch();
  const { t } = useTranslation(LocaleConstants.namespacesKey.reports);
  const spaces = useSelector(FFMSelector.getReportSpaces);
  const report = useSelector(FFMSelector.getCurrentReport);
  const [canCreateSpace, setSpaceCreation] = useState(false);
  const [spacesText, setSpaces] = useState(['']);
  const [isFinal, setFinalReport] = useState(false);

  const isAllDone = spaces.filter((item) => item.isCompleted).length === spaces.length;

  const onChangeText = (text: string, index: number): void => {
    const spaceData = [...spacesText];
    spaceData[index] = text;
    setSpaces(spaceData);
  };

  const onPressPlus = (): void => {
    const newSpaces = [...spacesText];
    newSpaces.push('');
    setSpaces(newSpaces);
  };

  const onCloseSheet = (): void => {
    setSpaceCreation(false);
    setSpaces(['']);
  };

  const onPreview = (): void => {
    setFinalReport(true);
  };

  const onEditSpace = (id: number): void => {
    const selectedSpace = spaces.filter((item) => item.id === id)[0];
    onSelectSpace(selectedSpace, true);
  };

  const onSave = (): void => {
    if (report) {
      FFMRepository.createReportSpaces({ reportId: report.id, body: spacesText.filter((item) => item) })
        .then(() => {
          dispatch(FFMActions.getReportSpace(report.id));
          setSpaceCreation(false);
        })
        .catch((e) => {
          AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
        });
    }
  };

  const renderSpace = ({ item }: { item: ReportSpace }): React.ReactElement => {
    const { name, iconUrl, isCompleted } = item;
    return (
      <>
        <TouchableOpacity
          activeOpacity={0.5}
          style={customStyles.spaceCard(isCompleted)}
          onPress={(): void => onSelectSpace(item)}
        >
          {isCompleted && (
            <View style={styles.checkIcon}>
              <Icon name={icons.checkFilled} color={theme.colors.green} />
            </View>
          )}
          <View style={styles.spaceContent}>
            <SVGUri
              uri={iconUrl}
              height={30}
              width={30}
              stroke={isCompleted ? theme.colors.white : theme.colors.primaryColor}
              strokeWidth={isCompleted ? undefined : 0.5}
            />
            <Label style={customStyles.spaceLabel(isCompleted)}>{name}</Label>
          </View>
        </TouchableOpacity>
      </>
    );
  };

  if (isFinal || isPreview || isCompletedReport) {
    return (
      <InspectionReport
        onEdit={onEditSpace}
        onSubmit={onSubmit}
        onGoBack={onGoBack}
        onSetInspection={onSetInspection}
        isCompletedReport={isCompletedReport}
      />
    );
  }

  return (
    <View>
      <Label type="large" style={styles.header}>
        {t('inspectionMessage')}
      </Label>
      <FlatList scrollEnabled={false} numColumns={2} data={spaces} renderItem={renderSpace} style={styles.list} />
      <TouchableOpacity style={styles.addSpace} onPress={(): void => setSpaceCreation(true)}>
        <Icon name={icons.circularPlus} color={theme.colors.primaryColor} size={25} />
      </TouchableOpacity>
      {isAllDone && (
        <Button
          type="primary"
          title={t('common:preview')}
          onPress={onPreview}
          containerStyle={styles.buttonContainer}
        />
      )}
      <BottomSheet
        visible={canCreateSpace}
        headerTitle={t('addNewSpace')}
        sheetHeight={500}
        onCloseSheet={onCloseSheet}
      >
        <View style={styles.sheetContent}>
          <Label type="large" style={styles.label}>
            {t('enterAreaName')}
          </Label>
          {spacesText.map((item, index) => {
            return (
              <TextInput
                key={index}
                value={item}
                style={styles.input}
                onChangeText={(text): void => onChangeText(text, index)}
                placeholder={t('area', { count: index + 1 })}
              />
            );
          })}
          {spacesText.length < 5 && (
            <TouchableOpacity onPress={onPressPlus} style={styles.plus}>
              <Icon name={icons.plus} size={20} color={theme.colors.active} />
            </TouchableOpacity>
          )}
          <Button
            type="primary"
            title={t('common:save')}
            onPress={onSave}
            containerStyle={[styles.buttonContainer, styles.saveButton]}
          />
        </View>
      </BottomSheet>
    </View>
  );
};

export default SpaceList;

const styles = StyleSheet.create({
  header: {
    textAlign: 'center',
    color: theme.colors.darkTint2,
  },
  list: {
    marginVertical: 16,
  },
  checkIcon: {
    borderRadius: 10,
    height: 20,
    width: 20,
    alignSelf: 'flex-end',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.white,
    margin: 10,
  },
  spaceContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 0,
    borderWidth: 1,
    borderColor: theme.colors.disabled,
    color: theme.colors.darkTint2,
    height: 36,
    marginVertical: 12,
    borderRadius: 4,
    padding: 10,
  },
  addSpace: {
    alignSelf: 'flex-end',
  },
  buttonContainer: {
    flex: 0,
    marginVertical: 16,
  },
  saveButton: {
    height: 42,
  },
  plus: {
    backgroundColor: theme.colors.blueOpacity,
    alignSelf: 'flex-end',
    padding: 8,
    borderRadius: 2,
  },
  sheetContent: {
    marginVertical: 16,
    marginHorizontal: 30,
    flex: 1,
  },
  label: {
    color: theme.colors.darkTint3,
  },
});

const customStyles = {
  spaceCard: (isCompleted: boolean): StyleProp<ViewStyle> => ({
    borderRadius: 10,
    backgroundColor: isCompleted ? theme.colors.green : theme.colors.background,
    height: 130,
    width: 130,
    marginHorizontal: 16,
    marginBottom: 16,
    ...(!isCompleted && { justifyContent: 'center' }),
  }),
  spaceLabel: (isCompleted: boolean): StyleProp<TextStyle> => ({
    marginVertical: 6,
    color: isCompleted ? theme.colors.white : theme.colors.active,
  }),
};
