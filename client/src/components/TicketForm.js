import { Field, reduxForm } from 'redux-form';
import React from 'react';

/**
 * The login form to be used for authentication.
 * @param {Object} props Properties passed into the form.
 */
let TicketForm = props => {
  const { handleSubmit } = props;
  return (
		<form onSubmit={ handleSubmit }>
      <div>
        <label htmlFor="title">Title</label>
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
 */
TicketForm = reduxForm({
  form: 'ticket'
})(TicketForm)

export default TicketForm;
