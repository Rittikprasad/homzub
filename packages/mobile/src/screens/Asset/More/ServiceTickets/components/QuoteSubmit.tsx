import React, { ReactElement } from 'react';
import { StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { cloneDeep } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import DocumentPicker from 'react-native-document-picker';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { TicketActions } from '@homzhub/common/src/modules/tickets/actions';
import { TicketSelectors } from '@homzhub/common/src/modules/tickets/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import { CollapsibleSection } from '@homzhub/mobile/src/components/molecules/CollapsibleSection';
import SubmitQuoteForm from '@homzhub/common/src/components/organisms/ServiceTickets/SubmitQuoteForm';
import { ICollapseSection } from '@homzhub/common/src/constants/ServiceTickets';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

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
    const prevQuotes = cloneDeep(quotes);
    const prevAttachments = cloneDeep(attachments);
    DocumentPicker.pick({
      type: [DocumentPicker.types.pdf, DocumentPicker.types.images],
    })
      .then((doc) => {
        prevQuotes[tabIndex].data[index].document = doc;
        // @ts-ignore
        dispatch(TicketActions.setQuoteAttachment([...prevAttachments, doc]));
        dispatch(TicketActions.setQuotes(prevQuotes));
      })
      .catch((e) => {
        if (!DocumentPicker.isCancel(e)) {
          AlertHelper.error({ message: e.message });
        }
      });
  };

  // HANDLERS

  const renderSection = (data: ICollapseSection): ReactElement => {
    return (
      <CollapsibleSection title={t(data.title)} containerStyle={styles.cardContainer} titleStyle={styles.cardTitle}>
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
