import React from 'react';
import { BACKEND_ADDRESS } from '../../constants/server_constants';

class Header extends React.Component {
    render() {
        return (
            <div className="ui secondary pointing menu">
                <div className="right menu">
                    <a href={`${BACKEND_ADDRESS}/logout`} className="ui blue google button">
                        <i className="google icon"></i>
                        Sign Out
                    </a>
                </div>
            </div>
        )
    }
};

export default Header;