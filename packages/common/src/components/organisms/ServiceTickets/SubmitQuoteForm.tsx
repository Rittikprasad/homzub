import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import { TabBar, TabView } from "react-native-tab-view";
import { useDispatch, useSelector } from "react-redux";
import { cloneDeep } from "lodash";
import { AlertHelper } from "@homzhub/common/src/utils/AlertHelper";
import { AttachmentService } from "@homzhub/common/src/services/AttachmentService";
import { TicketActions } from "@homzhub/common/src/modules/tickets/actions";
import { TicketSelectors } from "@homzhub/common/src/modules/tickets/selectors";
import { theme } from "@homzhub/common/src/styles/theme";
import { Button } from "@homzhub/common/src/components/atoms/Button";
import { Label, Text } from "@homzhub/common/src/components/atoms/Text";
import { TextArea } from "@homzhub/common/src/components/atoms/TextArea";
import QuoteBox from "@homzhub/common/src/components/molecules/QuoteBox";
import {
  IQuoteData,
  IQuoteGroup,
  IQuoteSubmitPayload,
} from "@homzhub/common/src/domain/repositories/interfaces";
import { AttachmentType } from "@homzhub/common/src/constants/AttachmentTypes";
import {
  IInitialQuote,
  ICollapseSection,
} from "@homzhub/common/src/constants/ServiceTickets";
import { LocaleConstants } from "@homzhub/common/src/services/Localization/constants";

interface IRoute {
  key: string;
  title: string;
}

interface IProps {
  onSuccess: () => void;
  setLoader: (loading: boolean) => void;
  renderCollapsibleSection: (data: ICollapseSection) => React.ReactElement;
  onUploadDoc?: (index: number, tabIndex: number) => void;
  onUploadWeb?: (file: File, index: number, tabIndex: number) => void;
}

const SubmitQuoteForm = (props: IProps): React.ReactElement => {
  const {
    renderCollapsibleSection,
    onUploadDoc,
    setLoader,
    onSuccess,
    onUploadWeb,
  } = props;
  const { t } = useTranslation(LocaleConstants.namespacesKey.serviceTickets);
  const dispatch = useDispatch();
  const selectedTicket = useSelector(TicketSelectors.getCurrentTicket);
  const attachments = useSelector(TicketSelectors.getQuoteAttachment);
  const quoteCategories = useSelector(TicketSelectors.getQuotesCategory);
  const quotes = useSelector(TicketSelectors.getQuotes);
  const [tabIndex, setTabIndex] = useState(0);
  const [comment, setComment] = useState("");

  console.log("this is in Submit Quote Form", attachments);
  console.log("this is in Submit Quote Form", quotes.length > 0);
  console.log("this is in Submit Quote Form", quoteCategories);
  console.log("this is in Submit Quote Form", selectedTicket);

  useEffect(() => {
    if (selectedTicket) {
      dispatch(
        TicketActions.getQuoteCategory({
          ticketId: selectedTicket.ticketId,
          quoteRequestId: selectedTicket.quoteRequestId,
        })
      );
    }
  }, []);

  const onCommentChange = (value: string): void => {
    console.log("comment");
    setComment(value);
  };

  const onNext = (): void => {
    if (quoteCategories && tabIndex + 1 < quoteCategories.length) {
      setTabIndex(tabIndex + 1);
    }
  };

  const onRemovedDoc = (index: number): void => {
    const prevQuotes = cloneDeep(quotes);
    const prevAttachment = cloneDeep(attachments);
    prevQuotes[tabIndex].data[index].document = null;
    prevAttachment.splice(index, 1);
    dispatch(TicketActions.setQuotes(prevQuotes));
    dispatch(TicketActions.setQuoteAttachment(prevAttachment));
  };

  const updatePrice = (price: string, index: number): void => {
    console.log("this is price");
    const prevQuotes = [...quotes];
    prevQuotes[tabIndex].data[index].price = price;
    dispatch(TicketActions.setQuotes(prevQuotes));
  };

  const handleCallback = (status: boolean): void => {
    if (status) {
      onSuccess();
    }
  };

  const generatePayload = async (
    callback: (payload: IQuoteGroup[]) => void
  ): Promise<void> => {
    console.log("step7");
    if (selectedTicket && quotes.length > 0) {
      console.log("step8");
      setLoader(true);
      const errorData: boolean[] = [];
      const quoteGroupData = quotes.map(async (item) => {
        console.log("step9");
        const updatedData: IQuoteData[] = [];
        const formData = new FormData();
        const quote: IInitialQuote[] = item.data;
        const quoteData = quote.map(async (quoteItem) => {
          console.log(quoteItem.document, "step10");
          if (quoteItem.document) {
            // @ts-ignore
            formData.append("files[]", quoteItem.document);
            console.log(formData, "formdata");
            // Upload Attachment to S3 and get attachment id
            const response = await AttachmentService.uploadImage(
              formData,
              AttachmentType.TICKET_DOCUMENTS
            );
            console.log("tttt*9*9*9*9**********", response);
            const { data, error } = response.data;
            if (data && data.length) {
              updatedData.push({
                quote_number: quoteItem.quoteNumber,
                price: Number(quoteItem.price),
                currency:
                  selectedTicket && selectedTicket.currency
                    ? selectedTicket.currency.currencyCode
                    : "INR",
                attachment: data[0].id,
              });
            }

            if (error) {
              console.log("ERRRRRRR", error);
              setLoader(false);
              AlertHelper.error({ message: t("common:fileCorrupt") });
              errorData.push(true);
            }
          }
        });

        await Promise.all(quoteData);
        return {
          quote_request_category: item.groupId,
          quotes: updatedData,
        };
      });

      await Promise.all(quoteGroupData).then((res) => {
        const isError = errorData.filter((item) => item).length > 0;
        if (!isError) {
          callback(res);
        } else {
          setLoader(false);
        }
      });
      console.log("step12");
    }
  };

  const onSubmit = async (): Promise<void> => {
    if (selectedTicket && quotes.length > 0) {
      setLoader(true);
      console.log("step1");
      await generatePayload((data) => {
        console.log("step2");
        /* Creating Final payload for submit quote */
        const submitPayload: IQuoteSubmitPayload = {
          param: {
            ticketId: selectedTicket.ticketId,
            quoteRequestId: selectedTicket.quoteRequestId,
          },
          data: {
            quote_group: data,
            ...(!!comment && { comment }),
          },
        };
        console.log("step3");

        setLoader(false);
        dispatch(
          TicketActions.submitQuote({
            data: submitPayload,
            onCallback: handleCallback,
          })
        );
        console.log("step4");
      });
      console.log("step5");
    }
  };

  const renderQuoteBox = (
    item: IInitialQuote,
    index: number
  ): React.ReactElement => {
    if (onUploadDoc) {
      console.log("this is item", item);
      return (
        <QuoteBox
          document={item.document?.name ?? ""}
          onSetPrice={(price): void => updatePrice(price, index)}
          onUploadAttachment={(): void => onUploadDoc(index, tabIndex)}
          onRemoveAttachment={(): void => onRemovedDoc(index)}
        />
      );
    }
    if (onUploadWeb) {
      return (
        <QuoteBox
          document={item.document?.name ?? ""}
          onSetPrice={(price): void => updatePrice(price, index)}
          onUploadAttachmentWeb={(file: File): void =>
            onUploadWeb(file, index, tabIndex)
          }
          onRemoveAttachment={(): void => onRemovedDoc(index)}
        />
      );
    }
    return <View />;
  };

  const renderScene = ({
    route,
  }: {
    route: IRoute;
  }): React.ReactElement | null => {
    const quotesData = quotes.filter((item) => item.groupName === route.key)[0];
    console.log("this is render scene", quotesData);
    if (!quotesData) return null;

    return (
      <>
        {quotesData.data.map((item, index) => {
          return renderCollapsibleSection({
            children: renderQuoteBox(item, index),
            title: t(item.title),
          });
        })}
        <TextArea
          value={comment}
          label={t("common:comment")}
          helpText={t("common:optional")}
          placeholder={t("common:typeComment")}
          wordCountLimit={450}
          onMessageChange={onCommentChange}
          containerStyle={styles.commentBox}
        />
      </>
    );
  };

  const isSubmit = quoteCategories && tabIndex + 1 === quoteCategories?.length;
  const filterData = quotes[tabIndex]?.data.filter(
    (item) => !item.price || !item.document
  );
  const haveQuotesWithoutDoc = quotes[tabIndex]?.data.find(
    (item) => item.price && !item.document
  );
  const haveQuotesWithoutAmount = quotes[tabIndex]?.data.find(
    (item) => item.document && !item.price
  );
  const isDisabled =
    Boolean(haveQuotesWithoutDoc) ||
    filterData?.length === quotes[tabIndex]?.data?.length;

  const onIndexChange = (value: number): void => {
    if (!haveQuotesWithoutDoc && !haveQuotesWithoutAmount) {
      setTabIndex(value);
    } else {
      AlertHelper.error({ message: t("common:pleaseFillDetails") });
    }
  };

  return (
    <View style={styles.container}>
      <Text type="small" textType="semiBold">
        {t("submitYourQuotes")}
      </Text>
      <Label type="large" style={styles.description}>
        {t("submitQuoteDescription")}
      </Label>
      <TabView
        renderScene={renderScene}
        onIndexChange={onIndexChange}
        renderTabBar={(tabProps): React.ReactElement => {
          return (
            <TabBar
              {...tabProps}
              style={styles.tabBar}
              indicatorStyle={styles.indicatorStyle}
              renderLabel={({ route }): React.ReactElement => {
                return (
                  <Text type="small" style={styles.tabLabel} numberOfLines={1}>
                    {route.title}
                  </Text>
                );
              }}
            />
          );
        }}
        navigationState={{
          index: tabIndex,
          routes: quoteCategories.map((item) => ({
            key: item.name,
            title: item.name,
          })),
        }}
      />
      <Button
        disabled={isDisabled}
        type="primary"
        title={!isSubmit ? t("common:next") : t("common:submit")}
        onPress={isSubmit ? onSubmit : onNext}
      />
    </View>
  );
};

export default SubmitQuoteForm;

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  description: {
    color: theme.colors.darkTint3,
    marginTop: 12,
  },
  cardContainer: {
    backgroundColor: theme.colors.gray10,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  cardTitle: {
    color: theme.colors.darkTint1,
  },
  commentBox: {
    marginVertical: 20,
  },
  tabLabel: {
    color: theme.colors.darkTint3,
  },
  tabBar: {
    backgroundColor: theme.colors.white,
    marginTop: 10,
  },
  indicatorStyle: {
    backgroundColor: theme.colors.primaryColor,
  },
});
