/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { connect } from 'react-redux';
import { fetchFileList, fetchFile } from '../../actions'


class FileLister extends React.Component {
    handleGetFileList = (e) => {
        e.preventDefault();
        this.props.fetchFileList();
    }

    downloadFile(fileName, fileContent) {
        this.props.fetchFile(fileName).then(() => {
            // reusing from https://github.com/axetroy/react-download/
            function fake_click(obj) {
                let ev = document.createEvent("MouseEvents");
                ev.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false,
                    false, false, 0, null);
                obj.dispatchEvent(ev);
            }
    
            function export_raw(name, data) {
                let urlObject = window.URL || window.webkitURL || window;
                let export_blob = new Blob([data]);
    
                if ('msSaveBlob' in navigator) {
                    // Prefer msSaveBlob if available - Edge supports a[download] but
                    // ignores the filename provided, using the blob UUID instead.
                    // msSaveBlob will respect the provided filename
                    navigator.msSaveBlob(export_blob, name);
                } else if ('download' in HTMLAnchorElement.prototype) {
                    let save_link = document.createElementNS(
                        "http://www.w3.org/1999/xhtml",
                        "a"
                    );
                    save_link.href = urlObject.createObjectURL(export_blob);
                    save_link.download = name;
                    fake_click(save_link);
                } else {
                    throw new Error("Neither a[download] nor msSaveBlob is available");
                }
            }
            export_raw(fileName, this.props.fileList[fileName]);
        })
    }

    renderFiles = () => {
        if (Object.keys(this.props.fileList).length === 0) {
            return (
                <div className="ui icon message">
                    <i className="x icon"></i>
                    <div className="content">
                        <div className="header">
                            No files loaded from server!
                        </div>
                        <p>Make sure the server is running and press the "Get files" button above to load files!</p>
                    </div>
                </div>
            )
        }
        return (
            <>
                <h5 className="ui horizontal divider header">Files on server</h5>
                <div className="ui relaxed divided list">
                    {Object.keys(this.props.fileList).map((e) => 
                    <div className="item" key={e}>
                        <i className="file icon"></i>
                        <div className="content">
                            <a className="header" onClick={() => this.downloadFile(e)}>{e}</a>
                        </div>
                    </div>)}
                </div>
            </>
        )
    }

    render() {
        return (
            <div className="ui form">
                <br></br>
                <div className="fields">
                    <div className="field">
                        <button 
                            className="ui button primary" 
                            onClick={this.handleGetFileList}>Load Files</button>
                    </div>
                </div>
    
                {this.renderFiles()}
            </div>)
    }
}

const mapStateToProps = (state) => {
    return {fileList: state.files}
}

export default connect(mapStateToProps, { fetchFileList, fetchFile })(FileLister);