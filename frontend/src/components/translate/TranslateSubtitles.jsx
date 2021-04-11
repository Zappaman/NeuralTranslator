/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import TranslationForm from './TranslationForm';
import FileLister from './FileLister';
import Header from '../auth/Header';
import { connect } from 'react-redux';
import {
    setActivePaneItem,
  } from '../../actions';

  import { Menu } from 'semantic-ui-react'

class TranslateSubtitles extends React.Component {
    handleItemClick = (e, { name }) => this.props.setActivePaneItem(name);
    
    render() {
        return (
            <>
                <Header/>
                <Menu>
                    <Menu.Item
                    name='file'
                    active={this.props.activePaneItem === 'file'}
                    onClick={this.handleItemClick}
                    >
                    File
                    </Menu.Item>

                    <Menu.Item
                    name='paragraph'
                    active={this.props.activePaneItem === 'paragraph'}
                    onClick={this.handleItemClick}
                    >
                    Paragraph
                    </Menu.Item>
                </Menu>
                <div className="ui left aligned container">
                    <br></br>
                    <h3 className="ui horizontal divider header">Translation Task</h3>
                    <TranslationForm/>
                    <h4 className="ui horizontal divider header">Translations</h4>
                    <FileLister/>
                </div>
            </>
        );
    }
}

const mapStateToProps = (state) => {
    return {
      activePaneItem: state.activePaneItem,
    };
  };

export default connect(mapStateToProps, {setActivePaneItem})(TranslateSubtitles);

