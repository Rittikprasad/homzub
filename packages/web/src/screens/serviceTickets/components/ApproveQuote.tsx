import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { NavigationService } from '@homzhub/web/src/services/NavigationService';
import { TicketSelectors } from '@homzhub/common/src/modules/tickets/selectors';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Loader } from '@homzhub/common/src/components/atoms/Loader';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import Accordian from '@homzhub/web/src/components/molecules/Accordian';
import ApproveQuoteForm from '@homzhub/common/src/components/organisms/ServiceTickets/ApproveQuoteForm';
import { ICollapseSection } from '@homzhub/common/src/constants/ServiceTickets';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

interface IProps {
  onSuccess: () => void;
  onRequestMore: (id: number, name: string) => void;
}

const ApproveQuote: React.FC<IProps> = (props: IProps) => {
  const { onSuccess, onRequestMore } = props;
  const { quoteRequests, approveQuote } = useSelector(TicketSelectors.getTicketLoaders);
  const { t } = useTranslation(LocaleConstants.namespacesKey.serviceTickets);
  const selectedTicket = useSelector(TicketSelectors.getCurrentTicket);
  // HANDLERS START

  const onOpenQuote = (url: string): void => {
    const options = {
      path: url,
    };
    NavigationService.openNewTab(options);
  };

  // HANDLERS END

  const renderAccordianHeader = (title: string): React.ReactNode => {
    return (
      <View style={styles.collapseCardContainer}>
        <View style={styles.leftView}>
          <Icon name={icons.watch} size={22} color={theme.colors.darkTint4} />
          <Typography
            variant="text"
            size="small"
            fontWeight="semiBold"
            style={[styles.textColor, styles.upcomingTitle, styles.collapseCardTitle]}
          >
            {title}
          </Typography>
        </View>
      </View>
    );
  };
  const renderAccordianContent = (children: React.ReactElement): React.ReactNode => {
    return <View style={styles.collapseCardContent}>{children}</View>;
  };

  const renderCollapsibleSection = (data: ICollapseSection): React.ReactElement => {
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
      <Loader visible={quoteRequests || approveQuote} />
      <View>
        <Typography variant="text" size="small" fontWeight="semiBold" style={styles.collapseCardTitle}>
          {selectedTicket?.propertyName ?? ''}
        </Typography>
        <ApproveQuoteForm
          renderCollapsibleSection={renderCollapsibleSection}
          onSuccess={onSuccess}
          onOpenQuote={onOpenQuote}
          onRequestMore={onRequestMore}
        />
      </View>
    </View>
  );
};

export default ApproveQuote;

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  buttonContainer: {
    marginTop: 10,
  },
  cardContainer: {
    borderWidth: 0.5,
    borderRadius: 4,
    borderColor: theme.colors.disabled,
    paddingVertical: 12,
  },
  cardTitle: {
    color: theme.colors.darkTint2,
    paddingHorizontal: 16,
  },
  iconStyle: {
    paddingHorizontal: 16,
  },
  commentBox: {
    marginVertical: 10,
  },
  collapseCardContainer: {
    backgroundColor: theme.colors.gray10,
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  collapseCardContent: {
    backgroundColor: theme.colors.gray10,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  collapseCardTitle: {
    color: theme.colors.darkTint4,
  },
  upcomingTitle: {
    marginLeft: 12,
  },
  leftView: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: 250,
  },
  textColor: {
    color: theme.colors.darkTint4,
  },
});
