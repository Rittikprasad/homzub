import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { TicketActions } from "@homzhub/common/src/modules/tickets/actions";
import { AssetSelectors } from "@homzhub/common/src/modules/asset/selectors";
import { TicketSelectors } from "@homzhub/common/src/modules/tickets/selectors";
import { icons } from "@homzhub/common/src/assets/icon";
import { theme } from "@homzhub/common/src/styles/theme";
import { Button } from "@homzhub/common/src/components/atoms/Button";
import { Dropdown } from "@homzhub/common/src/components/atoms/Dropdown";
import { Text, Label } from "@homzhub/common/src/components/atoms/Text";
import { TextArea } from "@homzhub/common/src/components/atoms/TextArea";
import { IReassignTicketParam } from "@homzhub/common/src/domain/repositories/interfaces";
import { LocaleConstants } from "@homzhub/common/src/services/Localization/constants";

interface IProps {
  onSuccess: () => void;
}

const ReassignTicketForm = ({ onSuccess }: IProps): React.ReactElement => {
  const dispatch = useDispatch();
  const { t } = useTranslation(LocaleConstants.namespacesKey.serviceTickets);
  const assetUsers = useSelector(AssetSelectors.getAssetUser);
  const selectedTicket = useSelector(TicketSelectors.getCurrentTicket);

  const [reassignedTo, setReassignedTo] = useState<number>(-1);
  const [comment, setComment] = useState("");

  // HANDLERS

  const onSubmit = (): void => {
    if (selectedTicket) {
      const payload: IReassignTicketParam = {
        assigned_to: reassignedTo,
        comment: comment.length > 0 ? comment : undefined,
      };
      dispatch(
        TicketActions.reassignTicket({
          ticketId: selectedTicket.ticketId,
          payload,
          onCallback: handleCallback,
        })
      );
    }
  };

  const handleCallback = (status: boolean): void => {
    if (status) {
      onSuccess();
    }
  };
  // HANDLERS
  const dropdownData = [
    ...(assetUsers?.owners ?? []),
    ...(assetUsers?.tenants ?? []),
  ].filter((item) => item.value !== selectedTicket?.assignedUserId);

  return (
    <View style={styles.container}>
      <Text type="small" textType="semiBold">
        {t("assigneeDetails")}
      </Text>
      <Label type="large" style={styles.description}>
        {t("reassignInfoText")}
      </Label>
      <Dropdown
        data={dropdownData}
        icon={icons.downArrowFilled}
        iconColor={theme.colors.darkTint5}
        iconSize={15}
        value={reassignedTo}
        onDonePress={setReassignedTo}
        listHeight={theme.viewport.height / 2}
        placeholder={t("selectAnAssignee")}
        // disable={dropdownData.length < 1}
      />
      <TextArea
        value={comment}
        label={t("common:comment")}
        helpText={t("common:optional")}
        placeholder={t("common:typeComment")}
        wordCountLimit={450}
        onMessageChange={setComment}
        containerStyle={styles.commentBox}
      />
      <Button
        type="primary"
        title={t("reassign")}
        disabled={reassignedTo === -1}
        onPress={onSubmit}
      />
    </View>
  );
};

export default ReassignTicketForm;

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  description: {
    color: theme.colors.darkTint3,
    marginVertical: 12,
  },
  commentBox: {
    marginVertical: 20,
  },
});
