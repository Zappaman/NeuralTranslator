import React from 'react';
import { connect } from 'react-redux';
import history from '../history'
import { fetchUser } from '../actions'
import _ from 'lodash';

class Home extends React.Component {
    componentDidMount() {
        if (_.isEmpty(this.props.userState.user)) {
            this.props.fetchUser().then(() => {
                if (_.isEmpty(this.props.userState.user)) {
                    history.push('/login') // user is not logged in
                } else {
                    history.push('/translate/subtitles')
                }
            })
        }
    }

    render() {
        return <div>Home</div>; // dummy, should not be rendered atm
    }
};

const mapStateToProps = (state) => {
    return {userState: state.user}
}

export default connect(mapStateToProps, { fetchUser })(Home);