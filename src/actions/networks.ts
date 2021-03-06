import { UttuQuery } from 'api';
import { deleteNetwork, networkMutation } from 'api/uttu/mutations';
import { getNetworkByIdQuery, getNetworksQuery } from 'api/uttu/queries';
import {
  showErrorNotification,
  showSuccessNotification,
} from 'actions/notification';
import { getStyledUttuError } from 'helpers/uttu';
import { Network } from 'model/Network';
import { Dispatch } from 'redux';
import { GlobalState } from 'reducers';
import { sentryCaptureException } from 'store';

export const REQUEST_NETWORKS = 'REQUEST_NETWORKS';
export const RECEIVE_NETWORKS = 'RECEIVE_NETWORKS';

export const REQUEST_NETWORK = 'REQUEST_NETWORK';
export const RECEIVE_NETWORK = 'RECEIVE_NETWORK';

export const SAVE_NETWORK = 'SAVE_NETWORK';
export const SAVED_NETWORK = 'SAVED_NETWORK';

export const DELETE_NETWORK = 'DELETE_NETWORK';
export const DELETED_NETWORK = 'DELETED_NETWORK';

const receiveNetworksActionCreator = (networks: Network[]) => ({
  type: RECEIVE_NETWORKS,
  networks,
});

const receiveNetworkActionCreator = (network: Network) => ({
  type: RECEIVE_NETWORK,
  network,
});

export const loadNetworks = () => async (
  dispatch: Dispatch<GlobalState>,
  getState: () => GlobalState
) => {
  try {
    const data = await UttuQuery(
      getState().providers.active?.code ?? '',
      getNetworksQuery,
      {},
      await getState().auth.getAccessToken()
    );
    dispatch(receiveNetworksActionCreator(data.networks));
    return data.networks;
  } catch (e) {
    dispatch(
      showErrorNotification(
        'Laste nettverk',
        getStyledUttuError(
          e,
          'En feil oppstod under lastingen av nettverkene',
          'Prøv igjen senere.'
        )
      )
    );
    sentryCaptureException(e);
  }
};

export const loadNetworkById = (id: string) => async (
  dispatch: Dispatch<GlobalState>,
  getState: () => GlobalState
) => {
  try {
    const data = await UttuQuery(
      getState().providers.active?.code ?? '',
      getNetworkByIdQuery,
      { id },
      await getState().auth.getAccessToken()
    );
    dispatch(receiveNetworkActionCreator(data.network));
  } catch (e) {
    dispatch(
      showErrorNotification(
        'Laste nettverk',
        getStyledUttuError(
          e,
          'En feil oppstod under lastingen av nettverket',
          'Prøv igjen senere.'
        )
      )
    );
    sentryCaptureException(e);
  }
};

export const saveNetwork = (network: Network, showConfirm = true) => async (
  dispatch: Dispatch<GlobalState>,
  getState: () => GlobalState
) => {
  try {
    await UttuQuery(
      getState().providers.active?.code ?? '',
      networkMutation,
      {
        input: network,
      },
      await getState().auth.getAccessToken()
    );
    if (showConfirm) {
      dispatch(
        showSuccessNotification('Lagre nettverk', 'Nettverket ble lagret.')
      );
    }
  } catch (e) {
    dispatch(
      showErrorNotification(
        'Lagre nettverk',
        getStyledUttuError(
          e,
          'En feil oppstod under lagringen av nettverket',
          'Prøv igjen senere.'
        )
      )
    );
    sentryCaptureException(e);
  }
};

export const deleteNetworkById = (id: string | undefined) => async (
  dispatch: Dispatch<GlobalState>,
  getState: () => GlobalState
) => {
  if (!id) return;

  try {
    await UttuQuery(
      getState().providers.active?.code ?? '',
      deleteNetwork,
      {
        id,
      },
      await getState().auth.getAccessToken()
    );
    dispatch(
      showSuccessNotification('Slette nettverk', 'Nettverket ble slettet.')
    );
  } catch (e) {
    dispatch(
      showErrorNotification(
        'Slette nettverk',
        getStyledUttuError(e, 'En feil oppstod under slettingen av nettverket')
      )
    );
    sentryCaptureException(e);
  }
};
