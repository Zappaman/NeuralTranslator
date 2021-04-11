import React from 'react'
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { BACKEND_ADDRESS } from '../../constants/server_constants';

class Login extends React.Component {
    render() {
        return (
        <div className="ui stacked segment">
            <div className="ui middle aligned center aligned grid">
                <div className="row">
                    <h2 className="ui blue image header">
                        <div className="content">
                            Welcome to sub.io!
                        </div>
                    </h2>
                </div>
                <div className="ui clearing divider"/>
                <div className="row">
                    <a href={`${BACKEND_ADDRESS}/login`} className="ui large blue submit button">Login</a>
                    <Link to="/signup" className="ui large blue submit button">Sign Up</Link>
                </div>
            </div>
        </div>
        );
    }
}

export default connect(null, {})(Login);