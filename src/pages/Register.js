import React, { useContext, useState } from 'react'
import { Form, Button } from 'semantic-ui-react'
import gql from 'graphql-tag'
import { useMutation } from '@apollo/react-hooks'

import { AuthContext } from '../context/auth'

function Register(props) {
    const context = useContext(AuthContext)
    const [errors, setErrors] = useState({})
    const [values, setValues] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        email: '',
    })

    const onChange = (event) => {
        setValues({...values, [event.target.name]: event.target.value});
    }
    const [addUser, { loading }] = useMutation(REGISTER_USER, {
        update(_, { data: { register: userData }}) {
            context.login(userData)           
            props.history.push('/')
        },
        onError(err) {
            setErrors(err.graphQLErrors[0].extensions.errors);
        },
        variables: values
        
    })
    const onSubmit = (event) => {
        event.preventDefault();
        addUser()
    }
    
    return (
        <div>
            <Form onSubmit={onSubmit} noValidate className={loading ? 'loading' : ''}>
                <h1>Register</h1>
                <Form.Input
                  label="Username"
                  placeholder="Username"
                  type="text"
                  name="username"
                  value={values.username}
                  error={errors.username ? true : false}
                  onChange={onChange}
                  />
                  <Form.Input
                  label="Email"
                  placeholder="Email"
                  type="email"
                  name="email"
                  value={values.email}
                  error={errors.email ? true : false}
                  onChange={onChange}
                  />
                   <Form.Input
                  label="Password"
                  placeholder="Password"
                  type="password"
                  name="password"
                  value={values.password}
                  error={errors.password ? true : false}
                  onChange={onChange}
                  />
                  <Form.Input
                  label="Password Confirm"
                  placeholder="Password Confirm"
                  type="password"
                  name="confirmPassword"
                  value={values.confirmPassword}
                  error={errors.confirmPassword ? true : false}
                  onChange={onChange}
                  />
                  <Button type="submit" primary>
                      Register
                  </Button>
            </Form>
            {Object.keys(errors).length > 0 && (
                <div className="ui error message">
                <ul className="list">
                 {Object.values(errors).map(value => (
                   <li key={value}>{value}</li>
                 ))}
               </ul>
              </div>
            )}
        </div>
    )
}

const REGISTER_USER = gql`
  mutation register(
      $username: String!
      $email: String!
      $password: String!
      $confirmPassword: String!
  ) {
      register(
          registerInput: {
              username: $username
              email: $email
              password: $password
              confirmPassword: $confirmPassword
          }
      ) {
          id email createdAt token
      }
  }
`;

export default Register;
