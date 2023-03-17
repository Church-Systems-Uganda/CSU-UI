import { all, call, fork, put, takeEvery } from 'redux-saga/effects';

import surveyDetailData from 'data/survey.detail.json';
import { SURVEY_GET_DETAILS, SURVEY_DELETE_QUESTION } from '../actions';

import {
  getSurveyDetailSuccess,
  getSurveyDetailError,
  saveSurvey,
} from './actions';

const getSurveyDetailRequest = async () => {
  // eslint-disable-next-line no-return-await
  return await new Promise((success) => {
    setTimeout(() => {
      success(surveyDetailData.data);
    }, 1000);
  })
    .then((response) => response)
    .catch((error) => error);
};

const deleteQuestionRequest = async (quesitonId, survey) => {
  // eslint-disable-next-line no-param-reassign
  survey.questions = survey.questions.filter((x) => x.id !== quesitonId);
  // eslint-disable-next-line no-return-await
  return await new Promise((success) => {
    success(survey);
  })
    .then((response) => response)
    .catch((error) => error);
};

function* getSurveyDetailItems() {
  try {
    const response = yield call(getSurveyDetailRequest);
    yield put(getSurveyDetailSuccess(response));
  } catch (error) {
    yield put(getSurveyDetailError(error));
  }
}

function* deleteQuestion({ payload }) {
  try {
    const { questionId, survey } = payload;
    const response = yield call(deleteQuestionRequest, questionId, survey);
    yield put(saveSurvey(response));
  } catch (error) {
    yield put(getSurveyDetailError(error));
  }
}

export function* watchGetDetail() {
  yield takeEvery(SURVEY_GET_DETAILS, getSurveyDetailItems);
}

export function* watchDeleteQuestion() {
  yield takeEvery(SURVEY_DELETE_QUESTION, deleteQuestion);
}

export default function* rootSaga() {
  yield all([fork(watchGetDetail), fork(watchDeleteQuestion)]);
}
