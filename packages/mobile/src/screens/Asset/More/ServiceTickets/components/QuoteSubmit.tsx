import React, { ReactElement } from "react";
import { StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { cloneDeep } from "lodash";
import { useDispatch, useSelector } from "react-redux";
import DocumentPicker from "react-native-document-picker";
import { AlertHelper } from "@homzhub/common/src/utils/AlertHelper";
import { TicketActions } from "@homzhub/common/src/modules/tickets/actions";
import { TicketSelectors } from "@homzhub/common/src/modules/tickets/selectors";
import { theme } from "@homzhub/common/src/styles/theme";
import { CollapsibleSection } from "@homzhub/mobile/src/components/molecules/CollapsibleSection";
import SubmitQuoteForm from "@homzhub/common/src/components/organisms/ServiceTickets/SubmitQuoteForm";
import { ICollapseSection } from "@homzhub/common/src/constants/ServiceTickets";
import { LocaleConstants } from "@homzhub/common/src/services/Localization/constants";

interface IProps {
  renderScreen: (children: React.ReactElement) => React.ReactElement;
  handleGoBack: () => void;
  setLoading: (isLoading: boolean) => void;
}

const QuoteSubmit = (props: IProps): ReactElement => {
  const { renderScreen, handleGoBack, setLoading } = props;
  const dispatch = useDispatch();
  const attachments = useSelector(TicketSelectors.getQuoteAttachment);
  const quotes = useSelector(TicketSelectors.getQuotes);
  const { t } = useTranslation(LocaleConstants.namespacesKey.serviceTickets);

  // HANDLERS

  const onUploadDoc = (index: number, tabIndex: number): void => {
    console.log("qotesssssssssssssssssssssss", index);
    console.log("qotesssssssssssssssssssssss", tabIndex);
    console.log("qotesssssssssssssssssssssss", quotes);
    const prevQuotes = cloneDeep(quotes);
    console.log("prev quotesfsdfsdfsd", prevQuotes);
    console.log("prev ujfosidfjsdfjsdklflksjd777777777777", prevQuotes);
    const prevAttachments = cloneDeep(attachments);
    DocumentPicker.pick({
      allowMultiSelection: false,
      type: [DocumentPicker.types.pdf, DocumentPicker.types.images],
    })
      .then((doc) => {
        // @ts-ignore
        prevQuotes[tabIndex].data[index].document = doc[0];
        // @ts-ignore
        dispatch(
          TicketActions.setQuoteAttachment([...prevAttachments, doc[0]])
        );
        dispatch(TicketActions.setQuotes(prevQuotes));
      })
      .catch((e) => {
        console.log(
          "7777777777777777777777777777777777777777777777777777777777 hsdkfhsdkfhj",
          e
        );
        if (!DocumentPicker.isCancel(e)) {
          AlertHelper.error({ message: e.message });
        }
      });
  };

  // HANDLERS

  const renderSection = (data: ICollapseSection): ReactElement => {
    return (
      <CollapsibleSection
        title={t(data.title)}
        containerStyle={styles.cardContainer}
        titleStyle={styles.cardTitle}
      >
        {data.children}
      </CollapsibleSection>
    );
  };

  const renderScreenData = (): React.ReactElement => {
    return (
      <SubmitQuoteForm
        renderCollapsibleSection={renderSection}
        onUploadDoc={onUploadDoc}
        onSuccess={handleGoBack}
        setLoader={setLoading}
      />
    );
  };

  return renderScreen(renderScreenData());
};

export default QuoteSubmit;

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: theme.colors.gray10,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  cardTitle: {
    color: theme.colors.darkTint1,
  },
});
