import React, { ReactElement, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import { cloneDeep } from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { AlertHelper } from "@homzhub/common/src/utils/AlertHelper";
import { TicketActions } from "@homzhub/common/src/modules/tickets/actions";
import Icon, { icons } from "@homzhub/common/src/assets/icon";
import { TicketSelectors } from "@homzhub/common/src/modules/tickets/selectors";
import { theme } from "@homzhub/common/src/styles/theme";
import Accordian from "@homzhub/web/src/components/molecules/Accordian";
import { Loader } from "@homzhub/common/src/components/atoms/Loader";
import { Typography } from "@homzhub/common/src/components/atoms/Typography";
import SubmitQuoteForm from "@homzhub/common/src/components/organisms/ServiceTickets/SubmitQuoteForm";
import { ICollapseSection } from "@homzhub/common/src/constants/ServiceTickets";
import { LocaleConstants } from "@homzhub/common/src/services/Localization/constants";

interface IProps {
  onSuccess: () => void;
}

const SubmitQuote: React.FC<IProps> = (props: IProps) => {
  const { onSuccess } = props;
  const dispatch = useDispatch();
  const attachments = useSelector(TicketSelectors.getQuoteAttachment);
  console.log("attachments", attachments);
  const quotes = useSelector(TicketSelectors.getQuotes);
  console.log("quotes", quotes);
  const { quotesCategory, submitQuote } = useSelector(
    TicketSelectors.getTicketLoaders
  );
  console.log("quotesCategory", quotesCategory);
  console.log("submitQuote", submitQuote);
  const { t } = useTranslation(LocaleConstants.namespacesKey.serviceTickets);
  const [isLoading, setLoading] = useState(false);

  // HANDLERS

  const onUploadDoc = (file: File, index: number, tabIndex: number): void => {
    const prevQuotes = cloneDeep(quotes);
    const prevAttachments = cloneDeep(attachments) as File[];
    try {
      prevQuotes[tabIndex].data[index].document = file;
      dispatch(TicketActions.setQuoteAttachment([...prevAttachments, file]));
      dispatch(TicketActions.setQuotes(prevQuotes));
    } catch (e) {
      AlertHelper.error({ message: e.message });
    }
  };

  const onSuccessCallback = (): void => {
    dispatch(TicketActions.setQuotes([]));
    onSuccess();
  };

  // HANDLERS

  const renderAccordianHeader = (title: string): React.ReactNode => {
    return (
      <View style={styles.cardContainer}>
        <View style={styles.leftView}>
          <Icon name={icons.watch} size={22} color={theme.colors.darkTint4} />
          <Typography
            variant="text"
            size="small"
            fontWeight="semiBold"
            style={[styles.textColor, styles.upcomingTitle, styles.cardTitle]}
          >
            {title}
          </Typography>
        </View>
      </View>
    );
  };
  const renderAccordianContent = (
    children: React.ReactElement
  ): React.ReactNode => {
    return <View style={styles.cardContent}>{children}</View>;
  };

  const renderCollapsibleSection = (data: ICollapseSection): ReactElement => {
    const { title, children } = data;
    return (
      <View>
        <Accordian
          headerComponent={renderAccordianHeader(t(title))}
          accordianContent={renderAccordianContent(children)}
        />
      </View>
    );
  };

  return (
    <View>
      <Loader visible={quotesCategory || isLoading || submitQuote} />
      <SubmitQuoteForm
        renderCollapsibleSection={renderCollapsibleSection}
        onUploadWeb={onUploadDoc}
        onSuccess={onSuccessCallback}
        setLoader={setLoading}
      />
    </View>
  );
};

export default SubmitQuote;

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: theme.colors.gray10,
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  cardContent: {
    backgroundColor: theme.colors.gray10,
    paddingHorizontal: 16,
  },
  cardTitle: {
    color: theme.colors.darkTint1,
  },
  upcomingTitle: {
    marginLeft: 12,
  },
  leftView: {
    flexDirection: "row",
    alignItems: "center",
    maxWidth: 250,
  },
  textColor: {
    color: theme.colors.darkTint4,
  },
});
