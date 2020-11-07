import React, { useContext, useState } from 'react'
import { Form, Button } from 'semantic-ui-react'
import gql from 'graphql-tag'
import { useMutation } from '@apollo/react-hooks'

import { AuthContext } from '../context/auth'

function Login(props) {
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
    
    const [loginUser, { loading }] = useMutation(LOGIN_USER, {
        update(_, {data: { login: userData }}) {
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
        loginUser()
    }
    
    return (
        <div>
            <Form onSubmit={onSubmit} noValidate className={loading ? 'loading' : ''}>
                <h1>Log In</h1>
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
                  label="Password"
                  placeholder="Password"
                  type="password"
                  name="password"
                  value={values.password}
                  error={errors.password ? true : false}
                  onChange={onChange}
                  />
                  
                  <Button type="submit" primary>
                      Login
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

const LOGIN_USER = gql`
  mutation login(
      $username: String!
      $password: String!
      
  ) {
      login(username: $username password: $password) {
          id
          email 
          createdAt 
          token
          username
      }
  }
`;

export default Login;
