import {
  FETCH_FILE_LIST,
  FETCH_FILE,
  SET_FILENAME,
  SET_TRANSLATE_STATUS_DONE,
  SET_TRANSLATE_STATUS_IN_PROGRESS,
  FETCH_USER,
  SET_SIGNUP_STATUS,
  SET_TARGET_LANGUAGE,
  SET_JOB_ID,
  SET_IS_SRT,
  SET_ACTIVE_PANE_ITEM,
  SET_TRANSLATION_PARAGRAPH,
  SET_TRANSLATED_PARAGRAPH,
} from './types';
import translateServer from '../apis/translateServer';

export const fetchFileList = () => async (dispatch) => {
  const response = await translateServer.get('/list_translations');

  dispatch({ type: FETCH_FILE_LIST, payload: response.data });
};

export const fetchFile = (filename) => async (dispatch) => {
  const response = await translateServer.get(`/get_translation/${filename}`);

  dispatch({ type: FETCH_FILE, payload: { filename: filename, content: response.data } });
  return Promise.resolve();
};

export const fetchUser = () => async (dispatch) => {
  const response = await translateServer.get('/user');

  dispatch({ type: FETCH_USER, payload: response.data });
  return Promise.resolve();
};

export const setFileName = (filename) => async (dispatch) => {
  dispatch({ type: SET_FILENAME, payload: filename });
};

export const setTranslateStatusDone = () => async (dispatch) => {
  dispatch({ type: SET_TRANSLATE_STATUS_DONE });
};

export const setTranslateStatusInProgress = () => async (dispatch) => {
  dispatch({ type: SET_TRANSLATE_STATUS_IN_PROGRESS });
};

export const setSignUpStatus = (is_ok, msg) => async (dispatch) => {
  dispatch({ type: SET_SIGNUP_STATUS, payload: { message: msg, is_ok: is_ok } });
};

export const setTargetLanguage = (lan) => async (dispatch) => {
  dispatch({ type: SET_TARGET_LANGUAGE, payload: { language: lan } });
};

export const setJobId = (id) => async (dispatch) => {
  dispatch({ type: SET_JOB_ID, payload: { jobId: id } });
};

export const setIsSRT = (isSRT) => async (dispatch) => {
  dispatch({ type: SET_IS_SRT, payload: isSRT });
};

export const setActivePaneItem = (item) => async (dispatch) => {
  dispatch({ type: SET_ACTIVE_PANE_ITEM, payload: item });
};

export const setTranslationParagraph = (text) => async (dispatch) => {
  dispatch({ type: SET_TRANSLATION_PARAGRAPH, payload: text });
};

export const setTranslatedParagraph = (text) => async (dispatch) => {
  dispatch({ type: SET_TRANSLATED_PARAGRAPH, payload: text });
};
