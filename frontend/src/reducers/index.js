import { combineReducers } from 'redux';
import filesReducer from './filesReducer';
import fileNameReducer from './shownFileNameReducer';
import translationStatusReducer from './translationStatusReducer';
import userReducer from './userReducer';
import signUpStatusReducer from './signUpStatusReducer';
import { reducer as formReducer } from 'redux-form';
import targetLanguageReducer from './targetLanguageReducer';
import jobIdReducer from './jobIdReducer';
import isSRTReducer from './isSRTReducer';
import activePaneItemReducer from './activePaneItemReducer';
import translationParagraphReducer from './translationParagraphReducer';
import translatedParagraphReducer from './translatedParagrapReducer';

export default combineReducers({
  form: formReducer,
  files: filesReducer,
  shownFileName: fileNameReducer,
  translationStatus: translationStatusReducer,
  targetLanguage: targetLanguageReducer,
  user: userReducer,
  signUpStatus: signUpStatusReducer,
  jobId: jobIdReducer,
  isSRT: isSRTReducer,
  activePaneItem: activePaneItemReducer,
  translationParagraph: translationParagraphReducer,
  translatedParagraph: translatedParagraphReducer,
});
