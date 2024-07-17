import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { PopupActions } from 'reactjs-popup/dist/types';
import { useOnly } from '@homzhub/common/src/utils/MediaQueryUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import { icons } from '@homzhub/common/src/assets/icon';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import Popover from '@homzhub/web/src/components/atoms/Popover';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import { AddPropertyStack } from '@homzhub/web/src/screens/addProperty';
import { Unit } from '@homzhub/common/src/domain/models/Unit';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';
import { IProjectDetails } from '@homzhub/common/src/modules/search/interface';

interface IProps {
  popupRef: React.MutableRefObject<PopupActions | null>;
  onCloseModal: () => void;
  projects: Unit[];
  setProjectDetails: React.Dispatch<React.SetStateAction<IProjectDetails>>;
  navigateScreen: (screen: AddPropertyStack) => void;
}

const ProjectSelectionPopover: React.FC<IProps> = (props: IProps): React.ReactElement => {
  const { projects, popupRef, onCloseModal, setProjectDetails, navigateScreen } = props;
  const { t } = useTranslation(LocaleConstants.namespacesKey.property);
  const isMobile = useOnly(deviceBreakpoint.MOBILE);
  const onContinue = (): void => {
    // Close the Popover
    onCloseModal();

    setTimeout(() => {
      navigateScreen(AddPropertyStack.PropertyDetailsMapScreen);
    }, 500);
  };

  const onSelectProject = (projectId: number): void => {
    setProjectDetails((prevState) => {
      return {
        ...prevState,
        projectId,
      };
    });

    onCloseModal();

    setTimeout(() => {
      navigateScreen(AddPropertyStack.PropertyDetailsMapScreen);
    }, 500);
  };

  const renderPopoverContent = (): React.ReactNode => {
    return (
      <View>
        <Button
          icon={icons.close}
          type="text"
          iconSize={20}
          iconColor={theme.colors.darkTint7}
          onPress={onCloseModal}
          containerStyle={styles.closeButton}
        />
        <View style={styles.modalContent}>
          <View>
            <Text type="regular" textType="semiBold" style={styles.heading}>
              {t('belongToProject')}
            </Text>
            <View style={styles.listContainer}>
              {projects &&
                projects.map((item: Unit) => (
                  <TouchableOpacity key={item.id} onPress={(): void => onSelectProject(item.id)} style={styles.card}>
                    <Text type="small" style={styles.label}>
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                ))}
            </View>
            <Button
              type="primary"
              title={t('propertyNotInProject')}
              containerStyle={styles.button}
              onPress={onContinue}
            />
          </View>
        </View>
      </View>
    );
  };

  return (
    <Popover
      content={renderPopoverContent()}
      popupProps={{
        closeOnDocumentClick: false,
        arrow: false,
        contentStyle: {
          maxHeight: '100%',
          alignItems: 'stretch',
          width: isMobile ? 320 : 400,
          borderRadius: 8,
          overflow: 'auto',
        },
        children: undefined,
        modal: true,
        position: 'center center',
        onClose: onCloseModal,
      }}
      forwardedRef={popupRef}
    />
  );
};

export default ProjectSelectionPopover;

const styles = StyleSheet.create({
  container: {
    margin: 16,
  },
  heading: {
    marginVertical: 16,
  },
  card: {
    borderWidth: 1,
    borderColor: theme.colors.darkTint10,
    padding: 14,
    marginTop: 20,
  },
  label: {
    color: theme.colors.primaryColor,
  },
  button: {
    marginVertical: 30,
  },
  modalContent: {
    padding: 24,
  },
  closeButton: {
    zIndex: 1,
    position: 'absolute',
    top: 15,
    right: 15,
    cursor: 'pointer',
    color: theme.colors.darkTint7,
  },
  listContainer: {
    height: 250,
    overflow: 'hidden',
  },
});
