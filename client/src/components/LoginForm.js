import { Field, reduxForm } from 'redux-form';
import React from 'react';

/**
 * The login form to be used for authentication.
 * @param {Object} props Properties passed into the form.
 */
let LoginForm = props => {
  const { handleSubmit } = props;
  return (
		<form onSubmit={ handleSubmit }>
      <div>
        <label htmlFor="username">Username</label>
        <Field name="username" component="input" type="text" />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <Field name="password" component="input" type="text" />
      </div>
      <button type="submit">Submit</button>
    </form>
  )
}

/**
 * Redux form connection.
 * @type {[type]}
 */
LoginForm = reduxForm({
  form: 'login'
})(LoginForm)

export default LoginForm;
