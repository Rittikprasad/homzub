import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { StringUtils } from '@homzhub/common/src/utils/StringUtils';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import { Avatar } from '@homzhub/common/src/components/molecules/Avatar';
import { Offer, Status } from '@homzhub/common/src/domain/models/Offer';

interface IProps {
  offer?: Offer;
}

const OfferReasonView: React.FC<IProps> = (props: IProps) => {
  const { t } = useTranslation();
  const { offer } = props;
  if (!offer) {
    return null;
  }
  const { statusUpdatedAt, statusUpdatedBy, statusChangeComment, statusChangeReason, status, statusUpdatedByRole } =
    offer;
  const isCancelled = status === Status.CANCELLED;
  return (
    <View style={styles.cardContainer}>
      <Label type="large">{t(isCancelled ? 'offers:offerCancelledOn' : 'offers:offerRejectOn')}</Label>
      {!!statusUpdatedAt && (
        <Label type="large" textType="semiBold" style={styles.textStyle}>
          {DateUtils.getDisplayDate(statusUpdatedAt, 'MMM DD, YYYY')}
        </Label>
      )}
      <Divider containerStyles={styles.verticalStyle} />
      <Avatar fullName={statusUpdatedBy?.name} designation={StringUtils.toTitleCase(statusUpdatedByRole || '')} />
      {statusChangeReason && (
        <View style={styles.valuesView}>
          <Label type="large" textType="semiBold">
            {t(isCancelled ? 'offers:cancelReasonLabel' : 'offers:rejectReasonLabel')}
          </Label>
          <Label type="large" style={styles.textStyle}>
            {statusChangeReason.title}
          </Label>
        </View>
      )}
      {!!statusChangeComment && (
        <View style={styles.verticalStyle}>
          <Label type="large" textType="semiBold">
            {t('offers:additionalComment')}
          </Label>
          <Label type="large" style={styles.textStyle}>
            {statusChangeComment}
          </Label>
        </View>
      )}
    </View>
  );
};

export default OfferReasonView;

const styles = StyleSheet.create({
  cardContainer: {
    padding: 16,
  },
  textStyle: {
    marginTop: 4,
  },
  verticalStyle: {
    marginVertical: 16,
  },
  valuesView: {
    marginTop: 16,
  },
});
