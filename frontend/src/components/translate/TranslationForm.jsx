/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { connect } from 'react-redux';
import {
  setFileName,
  setTranslateStatusInProgress,
  setTranslateStatusDone,
  setTargetLanguage,
  setJobId,
  setIsSRT,
  setTranslationParagraph,
  setTranslatedParagraph
} from '../../actions';
import translateServer from '../../apis/translateServer';

class TranslationForm extends React.Component {
  constructor() {
    super();
    this.fileInput = React.createRef(null);
  }
  intervalID = 0;

  setJobTimer = () => {
    if (!this.props.translationStatus) {
      this.props.setTranslateStatusInProgress();

      try {
        this.intervalID = setInterval(() => {
          translateServer.get(this.props.jobId).then((res) => {
            console.log('Getting the job id');
            console.log(res);
            if (res.data.status === 'finished') {
              this.props.setTranslateStatusDone();
              if (this.props.activePaneItem !== "file") {
                const translatedParagraph = res.data.result;
                this.props.setTranslatedParagraph(translatedParagraph)
              }
              console.log('Finished translating!');
              clearInterval(this.intervalID);
            }
          });
        }, 1000);
      } catch (e) {
        console.log(e);
      }
    }
  }

  handleParagraphSubmit = (e) => {
    e.preventDefault();

    console.log(this.props.translationParagraph);
    const data = new FormData();
    data.append('translationParagraph', this.props.translationParagraph);
    data.append('targetLanguage', this.props.targetLanguage);
    console.log(`Target language is ${this.props.targetLanguage}`);
    let url = '/translate_paragraph';
    translateServer.post(url, data, {}).then((res) => {
      const jobUrl = res.data['job_url'];
      this.props.setJobId(jobUrl);
      console.log('Posted the file to server, getting job id');
      console.log(res);
    });

    this.setJobTimer();
  }

  handleFileSubmit = (e) => {
    e.preventDefault();
    if (!this.fileInput.current || this.fileInput.current.files.length === 0) {
      console.log('Submitting stopped!');
      return;
    }

    const data = new FormData();
    data.append('file', this.fileInput.current.files[0]);
    data.append('targetLanguage', this.props.targetLanguage);
    data.append('isSRT', this.props.isSRT);
    console.log(`Target language is ${this.props.targetLanguage}`);
    let url = '/translate_srt';
    translateServer.post(url, data, {}).then((res) => {
      const jobUrl = res.data['job_url'];
      this.props.setJobId(jobUrl);
      console.log('Posted the file to server, getting job id');
      console.log(res);
    });

    this.setJobTimer();
  };

  handleSubmit = (e) => {
    this.props.activePaneItem === "file" ? this.handleFileSubmit(e) : this.handleParagraphSubmit(e);
  };

  getFileName = () => {
    if (this.props.fileName) {
      return (
        <div className="field">
          <div className="ui labeled input">
            <div className="ui label">Filename</div>
            <input type="text" readOnly value={this.props.fileName} />
          </div>
        </div>
      );
    }

    return <div className="ui label">No file currently selected</div>;
  };

  componentWillUnmount() {
    while (this.intervalID) {
      clearInterval(this.intervalID);
    }
  }

  render() {
    const translationHtml = this.props.translationStatus ? (
      <div className="ui active inline text loader">Translation in progress...</div>
    ) : (
      <div className="ui label">Awaiting new translation task.</div>
    );

    return (
      <div className="ui container fluid">
        {
          this.props.activePaneItem === "file" ? 
          <>
            <button
              className="ui button"
              onClick={(e) => {
                this.fileInput.current.click();
              }}
            >
              <i className="file icon" />
              Upload file for translation
            </button>
            <input
              type="file"
              ref={this.fileInput}
              hidden
              onChange={(evt) => {
                evt.stopPropagation();
                this.props.setFileName(evt.target.files[0].name);
              }}
            /> 
          </>
          : null
        }
        
        <form id="form_" className="ui form" onSubmit={this.handleSubmit}>
          <br></br>
          {
            this.props.activePaneItem === "file" ? 
            <div className="field">{this.getFileName()}</div>
          : 
            <div className="two fields">
              <div className="field">
                <label>Text to translate</label>
                <textarea 
                  value={this.props.translationParagraph}
                  onChange={(e) => this.props.setTranslationParagraph(e.target.value)}
                  placeholder="Type your text here">
                </textarea>
              </div>
              <div className="field">
                <label>Translated Text</label>
                <textarea
                  value={this.props.translatedParagraph}
                ></textarea>
              </div>
            </div>
          }
          <div className="two fields">
            <div className="field">
              <label>Target Language</label>
              <select
                className="ui fluid dropdown"
                onChange={(e) => {
                  this.props.setTargetLanguage(e.target.value);
                }}
              >
                <option value="Romanian">Romanian</option>
                <option value="German">German</option>
                <option value="Dutch">Dutch</option>
              </select>
            </div>
            {this.props.activePaneItem === "file" ? 
              <div className="field">
                <div className="ui checkbox">
                  <input
                    type="checkbox"
                    name="File Type"
                    value={this.props.isSRT}
                    onChange={(e) => {
                      this.props.setIsSRT(e.target.checked);
                    }}
                  />
                  <label>SRT</label>
                </div>
              </div>
            : 
              null
            }
          </div>
          <div className="field">
            <button type="submit" className="ui button primary">
              Submit
            </button>
            {translationHtml}
          </div>
        </form>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    fileName: state.shownFileName,
    translationStatus: state.translationStatus,
    targetLanguage: state.targetLanguage,
    jobId: state.jobId,
    isSRT: state.isSRT,
    activePaneItem: state.activePaneItem,
    translationParagraph: state.translationParagraph,
    translatedParagraph: state.translatedParagraph
  };
};

export default connect(mapStateToProps, {
  setFileName,
  setTranslateStatusInProgress,
  setTranslateStatusDone,
  setTargetLanguage,
  setJobId,
  setIsSRT,
  setTranslationParagraph,
  setTranslatedParagraph
})(TranslationForm);