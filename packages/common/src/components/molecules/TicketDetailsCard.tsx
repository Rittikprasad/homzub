import React, { useMemo } from "react";
import {
  FlatList,
  Platform,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { useTranslation } from "react-i18next";
import { DateFormats, DateUtils } from "@homzhub/common/src/utils/DateUtils";
import { StringUtils } from "@homzhub/common/src/utils/StringUtils";
import { theme } from "@homzhub/common/src/styles/theme";
import { Badge } from "@homzhub/common/src/components/atoms/Badge";
import { Label, Text } from "@homzhub/common/src/components/atoms/Text";
import TicketReview from "@homzhub/common/src/components/organisms/ServiceTickets/TicketReview";
import { Ticket, TicketStatus } from "@homzhub/common/src/domain/models/Ticket";
import { priorityColors } from "@homzhub/common/src/constants/ServiceTickets";

interface IProps {
  ticketData: Ticket;
  ticketImages: React.ReactElement;
  renderRatingForm: (
    children: React.ReactElement,
    onClose: () => void,
    isOpen: boolean
  ) => React.ReactElement;
  successCallback: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  onOpenRatingModal?: () => void;
  onCloseRatingModal?: () => void;
  isFFMUser?: boolean;
}

interface ITicketDetails {
  type: string;
  value: string;
}

const TicketDetailsCard = (props: IProps): React.ReactElement => {
  const { t } = useTranslation();
  const {
    ticketData,
    ticketImages,
    renderRatingForm,
    successCallback,
    containerStyle,
    onOpenRatingModal,
    onCloseRatingModal,
    isFFMUser = false,
  } = props;
  const {
    createdAt,
    updatedAt,
    status,
    ticketNumber,
    priority,
    title,
    assignedTo: { fullName },
  } = ticketData;

  const translatedValue = (value: string, root = "serviceTickets"): string =>
    t(`${root}:${value}`);
  const timeElapsed = DateUtils.getTimeElapsedInDays(createdAt);

  const formatDetails = (): ITicketDetails[] => {
    return [
      {
        type: translatedValue("createdOn"),
        value: DateUtils.getDisplayDate(createdAt, DateFormats.DDMM_YYYY_HH_MM),
      },
      {
        type: translatedValue("updatedOn"),
        value: DateUtils.getDisplayDate(updatedAt, DateFormats.DDMM_YYYY_HH_MM),
      },
      {
        type: translatedValue("status", "helpAndSupport"),
        value:
          StringUtils.splitter(status, "_") ===
          translatedValue("open", "common")
            ? translatedValue("ticketRaised")
            : StringUtils.splitter(status, "_"),
      },
      {
        type: translatedValue("assignedTo"),
        value: fullName,
      },
      {
        type: translatedValue("timeElapsed"),
        value: `${timeElapsed} ${translatedValue(
          timeElapsed === 1 ? "day" : "days",
          "common"
        )}`,
      },
      {
        type: translatedValue("ticketNo"),
        value: ticketNumber,
      },
    ];
  };

  const DetailSeparator = (): React.ReactElement => (
    <View style={styles.detailSeparator} />
  );

  const keyExtractor = (item: ITicketDetails, index: number): string =>
    `${item}-${index}`;

  const renderItem = ({
    item,
  }: {
    item: ITicketDetails;
  }): React.ReactElement => {
    const { type, value } = item;
    return (
      <View style={styles.flexOne}>
        <Label textType="regular" type="small" style={styles.label}>
          {type}
        </Label>
        <Label textType="semiBold" type="regular" style={styles.label}>
          {value}
        </Label>
      </View>
    );
  };

  const RenderDetails = useMemo(
    () => (): React.ReactElement => {
      const details = formatDetails();
      return (
        <FlatList
          data={details}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          numColumns={2}
          contentContainerStyle={styles.flatList}
          ItemSeparatorComponent={DetailSeparator}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
        />
      );
    },
    [ticketData]
  );

  return (
    <View style={[containerStyle]}>
      <View style={styles.ticketImage}>{ticketImages}</View>
      <View style={styles.details}>
        <Badge
          title={priority}
          textType="semiBold"
          badgeColor={priorityColors[priority]}
          badgeStyle={styles.badgeStyle}
        />
        <Text textType="semiBold" type="small" style={styles.ticketTitle}>
          {title}
        </Text>
        <RenderDetails />
        {status === TicketStatus.CLOSED && !isFFMUser && (
          <TicketReview
            ticketData={ticketData}
            renderRatingForm={renderRatingForm}
            successCallback={successCallback}
            onOpenRatingModal={onOpenRatingModal}
            onCloseRatingModal={onCloseRatingModal}
          />
        )}
      </View>
    </View>
  );
};

export default React.memo(TicketDetailsCard);

const styles = StyleSheet.create({
  flexOne: {
    flex: 1,
  },
  flatList: {
    marginTop: 10,
  },
  detailSeparator: {
    marginVertical: 7,
  },
  ticketImage: {
    maxWidth: 650,
    height: Platform.OS === "web" ? undefined : 200,
  },
  badgeStyle: {
    minWidth: 75,
    paddingHorizontal: 8,
    paddingVertical: 1,
    alignSelf: "flex-start",
  },
  details: {
    marginHorizontal: 16,
    marginVertical: 13,
  },
  ticketTitle: {
    color: theme.colors.darkTint3,
    marginVertical: 5,
    marginTop: 10,
  },
  label: {
    color: theme.colors.darkTint3,
  },
});
