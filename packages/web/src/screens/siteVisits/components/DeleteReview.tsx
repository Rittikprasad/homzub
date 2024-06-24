import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import { SiteVisitAction } from '@homzhub/web/src/screens/siteVisits/components/SiteVisitsActionsPopover';

interface IProps {
  setSiteVisitActionType: React.Dispatch<React.SetStateAction<SiteVisitAction>>;
  onDelete: () => void;
}

const DeleteReview: React.FC<IProps> = (props: IProps) => {
  const { t } = useTranslation();
  const { setSiteVisitActionType, onDelete } = props;
  return (
    <View style={styles.deleteView}>
      <Text type="small">{t('common:deleteReviewText')}</Text>
      <View style={styles.deleteViewText}>
        <Text type="small">{t('common:doYouWantToRemove')}</Text>
      </View>
      <View style={[styles.buttonContainer, styles.buttonContainerStyle]}>
        <Button
          onPress={(): void => setSiteVisitActionType(SiteVisitAction.SUBMIT_REVIEW)}
          type="secondary"
          title={t('common:no')}
          titleStyle={[styles.buttonTitle, styles.buttonStyle]}
        />
        <Button
          onPress={onDelete}
          type="primary"
          title={t('common:yes')}
          containerStyle={[styles.submitButton, styles.buttonStyle]}
        />
      </View>
    </View>
  );
};

export default DeleteReview;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 24,
  },
  buttonContainer: {
    marginTop: 16,
    flexDirection: 'row',
    marginBottom: 12,
  },
  submitButton: {
    marginStart: 16,
  },
  dividerStyle: {
    backgroundColor: theme.colors.background,
    marginTop: 16,
  },
  buttonTitle: {
    marginHorizontal: 0,
  },
  deleteView: {
    margin: 10,
  },
  deleteViewText: {
    marginVertical: 10,
  },
  buttonContainerStyle: {
    justifyContent: 'space-around',
  },
  buttonStyle: {
    minWidth: 120,
  },
});
