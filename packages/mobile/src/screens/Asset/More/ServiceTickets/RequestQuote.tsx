import React from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useNavigation, useRoute } from "@react-navigation/native";
import { TicketSelectors } from "@homzhub/common/src/modules/tickets/selectors";
import { UserScreen } from "@homzhub/mobile/src/components/HOC/UserScreen";
import RequestQuoteForm from "@homzhub/common/src/components/organisms/ServiceTickets/RequestQuoteForm";
import { ScreensKeys } from "@homzhub/mobile/src/navigation/interfaces";
import { LocaleConstants } from "@homzhub/common/src/services/Localization/constants";

const RequestQuote = (): React.ReactElement => {
  const { navigate, goBack } = useNavigation();
  const { params } = useRoute();
  const { t } = useTranslation(LocaleConstants.namespacesKey.serviceTickets);
  const selectedTicket = useSelector(TicketSelectors.getCurrentTicket);
  const { requestQuote } = useSelector(TicketSelectors.getTicketLoaders);

  const onSuccess = (): void => {
    // @ts-ignore
    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@this is params", params);
    if (params && params.isFromForm) {
      navigate(ScreensKeys.ServiceTicketDetail, { isFromScreen: true });
    } else {
      goBack();
    }
  };

  return (
    <UserScreen
      title={selectedTicket?.propertyName ?? ""}
      pageTitle={t("requestQuote")}
      onBackPress={goBack}
      loading={requestQuote}
      keyboardShouldPersistTaps
    >
      <RequestQuoteForm onSuccess={onSuccess} />
    </UserScreen>
  );
};

export default RequestQuote;
