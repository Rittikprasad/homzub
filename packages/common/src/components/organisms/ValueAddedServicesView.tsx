import React, { ReactElement } from 'react';
import { View, StyleSheet, ViewStyle, StyleProp, ScrollView } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { withMediaQuery, IWithMediaQuery } from '@homzhub/common/src/utils/MediaQueryUtils';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { AssetRepository } from '@homzhub/common/src/domain/repositories/AssetRepository';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import { SearchBar } from '@homzhub/common/src/components/molecules/SearchBar';
import ServiceView from '@homzhub/common/src/components/molecules/ServiceView';
import { TypeOfPlan } from '@homzhub/common/src/domain/models/AssetPlan';
import { ILastVisitedStep } from '@homzhub/common/src/domain/models/LastVisitedStep';
import { IUpdateAssetParams } from '@homzhub/common/src/domain/repositories/interfaces';
import { ISelectedValueServices, ValueAddedService } from '@homzhub/common/src/domain/models/ValueAddedService';

interface IOwnProps extends WithTranslation {
  valueAddedServices: ValueAddedService[];
  handleNextStep: () => void;
  propertyId: number;
  setValueAddedServices: (payload: ISelectedValueServices) => void;
  typeOfPlan?: TypeOfPlan;
  lastVisitedStep?: ILastVisitedStep;
  containerStyle?: StyleProp<ViewStyle>;
  buttonStyle?: StyleProp<ViewStyle>;
  searchStyle?: StyleProp<ViewStyle>;
  isDesktop?: boolean;
  isMobile?: boolean;
  isTablet?: boolean;
}

interface IOwnState {
  searchString: string;
}

type IProps = IOwnProps & IWithMediaQuery;
class ValueAddedServicesView extends React.PureComponent<IProps, IOwnState> {
  public state = {
    searchString: '',
  };

  public render = (): ReactElement => {
    const {
      setValueAddedServices,
      valueAddedServices,
      containerStyle,
      buttonStyle,
      searchStyle,
      t,
      isDesktop,
      isMobile,
      isTablet,
    } = this.props;
    const { searchString } = this.state;
    if (valueAddedServices && valueAddedServices.length <= 0) {
      return (
        <View style={styles.background}>
          <Text style={styles.noResults} type="regular">
            {t('common:noServicesFound')}
          </Text>
        </View>
      );
    }
    return (
      <>
        <View style={[styles.container, containerStyle]}>
          <SearchBar
            placeholder={t('assetDashboard:searchByKeyword')}
            value={searchString}
            updateValue={this.updateSearchString}
            containerStyle={[styles.searchStyle, searchStyle]}
          />
          <ScrollView>
            <ServiceView
              services={this.dynamicSearch()}
              setValueAddedServices={setValueAddedServices}
              isMobile={isMobile}
            />
          </ScrollView>
        </View>
        {!isDesktop && (
          <Button
            disabled={valueAddedServices.filter((service) => service.value).length === 0}
            type="primary"
            title={t('common:continue')}
            containerStyle={[styles.buttonStyle, buttonStyle, !isMobile && isTablet && styles.buttonTabStyle]}
            onPress={this.handleContinue}
          />
        )}
      </>
    );
  };

  private dynamicSearch = (): ValueAddedService[] => {
    const { valueAddedServices } = this.props;
    const { searchString } = this.state;

    return valueAddedServices.filter((item: ValueAddedService) => {
      return item.valueBundle.label.toLowerCase().includes(searchString.toLowerCase());
    });
  };

  private updateSearchString = (text: string): void => {
    this.setState({ searchString: text });
  };

  private handleContinue = async (): Promise<void> => {
    const { handleNextStep, lastVisitedStep, typeOfPlan, propertyId } = this.props;
    let updateAssetPayload: IUpdateAssetParams;

    try {
      if (lastVisitedStep && typeOfPlan) {
        updateAssetPayload = {
          last_visited_step: {
            ...lastVisitedStep,
            listing: {
              ...lastVisitedStep.listing,
              type: typeOfPlan,
              is_services_done: true,
            },
          },
        };
        await AssetRepository.updateAsset(propertyId, updateAssetPayload);
      }
      handleNextStep();
    }catch (e: any) {      AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details), statusCode: e.details.statusCode });
    }
  };
}

const HOC = withTranslation()(ValueAddedServicesView);
const valueAddedServicesView = withMediaQuery<any>(HOC);
export { valueAddedServicesView as ValueAddedServicesView };

const styles = StyleSheet.create({
  container: {
    flex: PlatformUtils.isWeb() ? 1 : 0,
    padding: theme.layout.screenPadding,
    backgroundColor: theme.colors.white,
    height: PlatformUtils.isWeb() ? 'auto' : 'auto',
  },
  noResults: {
    marginTop: 16,
    textAlign: 'center',
  },
  buttonStyle: {
    flex: 0,
    marginVertical: 20,
  },
  searchStyle: {
    marginBottom: 24,
  },
  buttonTabStyle: {
    left: '60%',
    width: 256,
  },
  background: {
    backgroundColor: theme.colors.white,
    height: 240,
    justifyContent: 'center',
  },
});
