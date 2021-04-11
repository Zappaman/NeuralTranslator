import React from 'react';
import translateServer from '../../apis/translateServer';
import history from '../../history';
import SignUpForm from './SignUpForm';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { setSignUpStatus } from '../../actions';
import Modal from '../Modal';


class SignUp extends React.Component {
    onSubmit = (formValues) => {
        translateServer.post("/register", formValues)
        .then((res) => {
            console.log(res);
            this.props.setSignUpStatus(true, res);
        })
        .catch((error) => {
            console.log(error);
            this.props.setSignUpStatus(false, error);
        })
    }

    createModal() {
        const actions = null;
        const title = this.props.signUpStatus.is_ok ? "Signup successful!" : "Signup failed!";
        const content = this.props.signUpStatus.is_ok ? (
            <div>Your signup was successful! Dismiss this modal to be redirected to the login page!</div>
        ) : (<div>
                Your signup failed with the following error: {this.props.signUpStatus.message.response.request.responseText}. Please check your form and submit again!
            </div>);
        const onDismissFunc = this.props.signUpStatus.is_ok ? () => {
            this.props.setSignUpStatus(null, null);
            history.push('/login')
        } : () => {
            this.props.setSignUpStatus(null, null);
        }; 
        return (
            <Modal
                title={title}
                content={content}
                action={actions}
                onDismiss={onDismissFunc}/>
        );
    
    }


    render() {
        return this.props.signUpStatus.is_ok !== null ? 
            this.createModal() :
            (
                <div className="ui middle aligned center aligned grid">
                    <div className="column">
                        <h2 className="ui blue image header">
                            <div className="content">
                                Sign up for a new account
                            </div>
                        </h2>
                        <SignUpForm initialValues={{"username": "user", "email": "email@gmail.com", "password": "", "password_check": ""}} onSubmit={this.onSubmit}></SignUpForm>
                    </div>
                </div>
            );
    }
}

const mapStateToProps = (state) => {
    return {signUpStatus : state.signUpStatus}
}

export default connect(mapStateToProps, {setSignUpStatus})(SignUp);