import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WithTranslation, withTranslation } from 'react-i18next';
import { DateFormats, DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { StringUtils } from '@homzhub/common/src/utils/StringUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { EmptyState } from '@homzhub/common/src/components/atoms/EmptyState';
import { Image } from '@homzhub/common/src/components/atoms/Image';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import { PdfView } from '@homzhub/mobile/src/components/atoms/PdfView';
import { SearchBar } from '@homzhub/common/src/components/molecules/SearchBar';
import { MediaType } from '@homzhub/common/src/domain/models/Attachment';
import { CaseLog, Status } from '@homzhub/common/src/domain/models/CaseLog';

enum Key {
  status = 'status',
}

interface IScreenState {
  searchQuery: string;
}

interface ICaseDetails {
  [key: string]: string;
  case_id: string;
  date: string;
  category: string;
  status: string;
}
interface IProps {
  caseLogs: CaseLog[];
}
type Props = WithTranslation & IProps;

export class CaseLogs extends React.PureComponent<Props, IScreenState> {
  public state = {
    searchQuery: '',
  };

  public render = (): React.ReactElement => {
    const { t } = this.props;
    const { searchQuery } = this.state;
    return (
      <>
        <SearchBar
          placeholder={t('assetDashboard:searchByKeyword')}
          value={searchQuery}
          updateValue={this.onUpdateSearchText}
          containerStyle={styles.searchBar}
        />
        {this.renderCaseLogs()}
      </>
    );
  };

  private renderCaseLogs = (): React.ReactNode => {
    const { searchQuery } = this.state;
    const { caseLogs } = this.props;
    const logsToDisplay = searchQuery
      ? caseLogs.filter((item: CaseLog) => item.title.toLowerCase().includes(searchQuery.toLowerCase()))
      : caseLogs;
    if (logsToDisplay.length <= 0) {
      return <EmptyState />;
    }
    return logsToDisplay.map((item: CaseLog, index: number) => {
      const { title, description, attachments } = item;
      return (
        <>
          {!!title && (
            <Label type="large" textType="semiBold" style={styles.title}>
              {title}
            </Label>
          )}
          {this.renderCaseLogDetails(item)}
          {!!description && (
            <Label type="large" textType="regular" style={styles.description}>
              {description}
            </Label>
          )}
          {attachments &&
            attachments.map((attachment) =>
              attachment.mediaType === MediaType.image ? (
                <View style={styles.imageContainer}>
                  <Image
                    source={{
                      uri: attachment.link,
                    }}
                    style={styles.image}
                  />
                </View>
              ) : (
                <View style={styles.pdfContainer}>
                  <PdfView source={{ uri: attachment.link }} fileName={attachment.fileName} />
                </View>
              )
            )}
          {index !== logsToDisplay.length - 1 && <Divider containerStyles={styles.divider} />}
        </>
      );
    });
  };

  private renderCaseLogDetails = (item: CaseLog): React.ReactElement => {
    const { status, ticketNumber, raisedAt, supportCategory } = item;
    const color = status === Status.open ? theme.colors.error : theme.colors.green;
    const caseDetails: ICaseDetails = {
      case_id: ticketNumber,
      date: DateUtils.convertDateFormatted(raisedAt, DateFormats.DD_MMM_YYYY),
      category: supportCategory.label,
      status,
    };

    return (
      <View style={styles.detailsContainer}>
        {Object.keys(caseDetails).map((key, index: number) => (
          <View key={index} style={styles.detailsColumn}>
            <Label type="small" textType="regular" style={styles.details}>
              {StringUtils.toTitleCase(key.replace('_', ' '))}
            </Label>
            <Label type="regular" textType="semiBold" style={[styles.details, key === Key.status && { color }]}>
              {key === 'date' ? caseDetails[key] : StringUtils.toTitleCase(caseDetails[key])}
            </Label>
          </View>
        ))}
      </View>
    );
  };

  private onUpdateSearchText = (searchQuery: string): void => {
    this.setState({ searchQuery });
  };
}

const styles = StyleSheet.create({
  searchBar: {
    marginTop: 24,
  },
  details: {
    color: theme.colors.darkTint3,
    marginBottom: 6,
  },
  description: {
    color: theme.colors.darkTint4,
    marginTop: 20,
  },
  title: {
    color: theme.colors.darkTint3,
    marginTop: 16,
    marginBottom: 12,
  },
  detailsContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
  detailsColumn: {
    flexDirection: 'column',
    width: '50%',
  },
  imageContainer: {
    marginTop: 16,
    width: 350,
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pdfContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 5,
  },
  divider: {
    marginTop: 16,
  },
});

export default withTranslation()(CaseLogs);
