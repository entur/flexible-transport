import {
  RECEIVE_ORGANISATIONS,
  ReceiveOrganisations
} from 'actions/organisations';
import { ORGANISATION_TYPE } from 'model/enums';

type ContactInfo = {
  url: string;
  email: string;
  phone: string;
};

export type OrganisationState = {
  id: string;
  name: string;
  legalName: string;
  types: ORGANISATION_TYPE[];
  contact: {
    url: string;
    email: string;
    phone: string;
  };
  customerContact: ContactInfo;
  logo: string;
  references: { [key in string | number]: string };
  version: number;
};

const organisationsReducer = (
  state: OrganisationState | null = null,
  action: ReceiveOrganisations
) => {
  switch (action.type) {
    case RECEIVE_ORGANISATIONS:
      return action.organisations;

    default:
      return state;
  }
};

export default organisationsReducer;