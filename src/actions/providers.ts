import { UttuQuery } from 'graphql';
import { getProvidersQuery } from 'graphql/uttu/queries';
import Provider from 'model/Provider';
import { Dispatch } from 'redux';
import { GlobalState } from 'reducers';

export const RECEIVE_PROVIDERS = 'RECEIVE_PROVIDERS';
export const FAILED_RECEIVING_PROVIDERS = 'FAILED_RECEIVING_PROVIDERS';

export const SET_ACTIVE_PROVIDER = 'SET_ACTIVE_PROVIDER';

const receiveProviders = (providers: Provider[]) => ({
  type: RECEIVE_PROVIDERS,
  providers
});
const failedReceivingProviders = { type: FAILED_RECEIVING_PROVIDERS };

export const setActiveProvider = (provider: Provider) => ({
  type: SET_ACTIVE_PROVIDER,
  provider
});

export const getProviders = () => (dispatch: Dispatch<GlobalState>) => {
  return UttuQuery('providers', getProvidersQuery, {})
    .then(data => {
      const providers = data.providers.map((p: Provider) => new Provider(p));
      dispatch(receiveProviders(providers));
      return Promise.resolve();
    })
    .catch(e => {
      console.log(e);
      dispatch(failedReceivingProviders);
      return Promise.reject();
    });
};