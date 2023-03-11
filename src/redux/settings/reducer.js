import { getCurrentLanguage } from 'helpers/Utils';
import { CHANGE_LOCALE } from '../actions';

const INIT_STATE = {
  locale: getCurrentLanguage(),
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case CHANGE_LOCALE:
      return { ...state, locale: action.payload };

    default:
      return { ...state };
  }
};
