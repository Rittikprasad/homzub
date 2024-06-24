import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Loader } from '@homzhub/common/src/components/atoms/Loader';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import Accordian from '@homzhub/web/src/components/molecules/Accordian';
import ScheduleVisitForm from '@homzhub/common/src/components/organisms/ScheduleVisitForm';
import { IBookVisitProps } from '@homzhub/common/src/domain/repositories/interfaces';

interface IProps {
  paramsBookVisit: IBookVisitProps;
  isReschedule: boolean;
  onCloseModal: () => void;
}

const BookVisit: React.FC<IProps> = (props: IProps) => {
  const { paramsBookVisit: params, isReschedule, onCloseModal } = props;
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const renderAccordianHeader = (title: string): React.ReactNode => {
    return (
      <View>
        <View style={styles.leftView}>
          <Icon name={icons.watch} size={22} color={theme.colors.darkTint4} />
          <Text type="small" textType="semiBold" style={[styles.textColor, styles.upcomingTitle]}>
            {title}
          </Text>
        </View>
      </View>
    );
  };
  const renderAccordianContent = (children: React.ReactElement): React.ReactNode => {
    return <View>{children}</View>;
  };
  const renderCollapsibleSection = (children: React.ReactElement, title: string): React.ReactElement => {
    return (
      <Accordian
        headerComponent={renderAccordianHeader(title)}
        accordianContent={renderAccordianContent(children)}
        onToggle={onToggle}
      />
    );
  };
  const onToggle = (isActive: boolean): void => {
    setIsCollapsed(isActive);
  };

  const setLoading = (isLoadingParam: boolean): void => {
    setIsLoading(isLoadingParam);
  };

  return (
    <View>
      <Loader visible={isLoading} />
      {/* @ts-ignore */}
      <ScheduleVisitForm
        isCollapsed={!isCollapsed}
        isReschedule={isReschedule}
        renderCollapseSection={renderCollapsibleSection}
        setLoading={setLoading}
        onSubmitSuccess={onCloseModal}
        leaseListingId={params.lease_listing_id}
        saleListingId={params.sale_listing_id}
      />
    </View>
  );
};

export default BookVisit;

const styles = StyleSheet.create({
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
