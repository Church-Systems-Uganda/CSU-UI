import { setCurrentLanguage } from 'helpers/Utils';
// eslint-disable-next-line import/no-cycle
import { CHANGE_LOCALE } from '../actions';

// eslint-disable-next-line import/prefer-default-export
export const changeLocale = (locale) => {
  setCurrentLanguage(locale);
  return {
    type: CHANGE_LOCALE,
    payload: locale,
  };
};
