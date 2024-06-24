import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { NavigationService } from '@homzhub/web/src/services/NavigationService';
import { TicketActions } from '@homzhub/common/src/modules/tickets/actions';
import { RouteNames } from '@homzhub/web/src/router/RouteNames';
import { AssetSelectors } from '@homzhub/common/src/modules/asset/selectors';
import { Loader } from '@homzhub/common/src/components/atoms/Loader';
import { UploadBoxComponent } from '@homzhub/web/src/components/molecules/UploadBoxComponent';
import { IUploadCompProps } from '@homzhub/common/src/components/organisms/AddRecordForm';
import AddServiceTicketForm from '@homzhub/common/src/components/organisms/ServiceTickets/AddServiceTicketForm';
import { IState } from '@homzhub/common/src/modules/interfaces';

interface ICustomState {
  clearCount: number;
  isScreenLoading: boolean;
}

interface IProps {
  onCloseModal: () => void;
  propertyId?: number;
}

type Props = IProps;

const AddServiceTicket: React.FC<Props> = (props: Props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const {
    // propertyId, // Portfolio Navigation Flow
    onCloseModal,
  } = props;
  const [customState, setCustomState] = useState({
    clearCount: 0,
    isScreenLoading: false,
  });
  const { isScreenLoading, clearCount } = customState;
  const history = useHistory();
  const loaders = useSelector((state: IState) => AssetSelectors.getAssetLoaders(state));
  const { activeAssets } = loaders;

  const renderUploadBoxComponent = (uploadProps: IUploadCompProps): React.ReactElement => {
    return <UploadBoxComponent {...uploadProps} />;
  };

  const onAddProperty = (): void => {
    NavigationService.navigate(history, { path: RouteNames.protectedRoutes.ADD_PROPERTY });
  };

  const onSubmit = (): void => {
    onCloseModal(); // Close Popover
    AlertHelper.success({ message: t('serviceTickets:ticketRaised') });
    dispatch(TicketActions.getTickets());
  };

  const toggleScreenLoader = (argLoadingState: boolean): void => {
    setCustomState((prevState: ICustomState) => {
      return { ...prevState, argLoadingState };
    });
  };

  return (
    <View>
      <AddServiceTicketForm
        // propertyId={propertyId}  // Portfolio Navigation Flow
        onAddProperty={onAddProperty}
        onSubmit={onSubmit}
        renderUploadBoxComponent={renderUploadBoxComponent}
        toggleLoader={toggleScreenLoader}
        clearCount={clearCount}
      />
      <Loader visible={activeAssets || isScreenLoading} />
    </View>
  );
};

export default AddServiceTicket;
