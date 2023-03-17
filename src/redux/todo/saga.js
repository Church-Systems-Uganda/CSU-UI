import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import { getDateWithFormat } from 'helpers/Utils';

import todoData from 'data/todos.json';
import { TODO_GET_LIST, TODO_ADD_ITEM } from '../actions';

import {
  getTodoListSuccess,
  getTodoListError,
  addTodoItemSuccess,
  addTodoItemError,
} from './actions';

const getTodoListRequest = async () => {
  // eslint-disable-next-line no-return-await
  return await new Promise((success) => {
    setTimeout(() => {
      success(todoData.data);
    }, 1000);
  })
    .then((response) => response)
    .catch((error) => error);
};

function* getTodoListItems() {
  try {
    const response = yield call(getTodoListRequest);
    yield put(getTodoListSuccess(response));
  } catch (error) {
    yield put(getTodoListError(error));
  }
}

const addTodoItemRequest = async (item) => {
  const items = todoData.data;
  // eslint-disable-next-line no-param-reassign
  item.id = items.length + 1;
  // eslint-disable-next-line no-param-reassign
  item.createDate = getDateWithFormat();
  items.splice(0, 0, item);
  // eslint-disable-next-line no-return-await
  return await new Promise((success) => {
    setTimeout(() => {
      success(items);
    }, 1000);
  })
    .then((response) => response)
    .catch((error) => error);
};

function* addTodoItem({ payload }) {
  try {
    const response = yield call(addTodoItemRequest, payload);
    yield put(addTodoItemSuccess(response));
  } catch (error) {
    yield put(addTodoItemError(error));
  }
}

export function* watchGetList() {
  yield takeEvery(TODO_GET_LIST, getTodoListItems);
}

export function* wathcAddItem() {
  yield takeEvery(TODO_ADD_ITEM, addTodoItem);
}

export default function* rootSaga() {
  yield all([fork(watchGetList), fork(wathcAddItem)]);
}
