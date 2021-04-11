import React from 'react';
import { Field, reduxForm } from 'redux-form';

class SignUpForm extends React.Component {
    onSubmit = (formValues) => {
        this.props.onSubmit(formValues);
    }

    renderError = ({error, touched}) => {
        if (touched && error) {
            return (
                <div className="ui error message">
                    <div className="header">{error}</div>
                </div>
            );
        }
    } 

    renderInput = ({input, label, meta}) => {
        const className = meta.error && meta.touched ? "field error" : "field";
        return (
            <div className={className}>
                <label>{label}</label>
                <input {...input} autoComplete="off"/>
                {this.renderError(meta)}
            </div>
        )
    }

    render() {
        return ( 
                <form onSubmit={this.props.handleSubmit(this.onSubmit)} className="ui form error">
                    <Field name="username" component={this.renderInput} label="Username"/>
                    <Field name="email" component={this.renderInput} label="Email"/>
                    <Field name="password" component={this.renderInput} label="Password"/>
                    <Field name="password_check" component={this.renderInput} label="Type Password Again"/>
                    <button type="submit" className="ui button primary">Submit</button>
                </form>)
    }
}

const validate = (formValues) => {
    const errors = {};
    
    if (!formValues.username) {
        errors.username = "You must enter a username";
    }
    if (!formValues.email) {
        errors.username = "You must enter an email";
    }
    if (!formValues.password) {
        errors.password = "You must enter a password";
    }
    if (!formValues.password_check || (formValues.password !== formValues.password_check)) {
        errors.password_check = "Typed passwords differ";
    }

    return errors;
}

export default reduxForm({
    form: 'signUpForm',
    validate
})(SignUpForm);