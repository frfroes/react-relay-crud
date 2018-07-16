import React from 'react';
import Relay, { graphql } from 'react-relay';
import { Message, Form, Header } from 'semantic-ui-react'

import { UpdateOrCreateUserMutation } from '../mutations'

const USER_DATA_FRAG = graphql`
    fragment UserForm_user on User {
        active
        email
        id
        name
    }
`
const REFETCH_QUERY = graphql`
    query UserFormQuery($itemID: ID!) {
        viewer{
            User(id: $itemID) {
                ...UserForm_user
            }
        }
    }
`

class UserFormComponent extends React.Component {

    state = {
        fields:{
            email:{ value:'', isRequired: true },
            name: { value: '', isRequired: true },
            active:{ value: false }
        },
        formValid: false,
    }

    _handleChange = (e, { name, value }) => {
        const { fields } = this.state;
        const field = fields[name];
        
        this.setState({fields: { 
            ...fields,
            [name]: { ...field, value }
        }}, () => this._validateField(name))
    }

    _handleToggle = (e, { name }) => {
        const { fields } = this.state;
        const field = fields[name];
        this._handleChange(e, { name, value: !field.value })
    }

    _handleBlur = ({target: { name }}) => {
        const { fields } = this.state;
        const field = fields[name];

        if(!field.hasBlurred)
            this.setState({fields: { 
                ...fields,
                [name]: { ...field, hasBlurred: true }
            }}, () => this._validateField(name))
    }

    _handleSubmit = (e, { error }) =>{
        if(error) return;

        const { fields } = this.state;
        const { environment } = this.props.relay;

        const user = Object.keys(fields).reduce((user, key) => {
            user[key] = fields[key].value;
            return user;
        },{})
        
        UpdateOrCreateUserMutation.commit({
            environment,
            user
        })

    }

    _validateField(name) {
        const { fields } = this.state;
        const field = fields[name];
        let error = '';

        switch(name) {
            case 'email':
                const isValidEmail = field.value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
                if(field.value && field.hasBlurred && !isValidEmail){
                    error = 'Email adress is invalid'
                    break
                }
            default:
                if(field.isRequired && field.hasBlurred && !field.value){
                    error = 'This field is required'
                }
            break;
        }
    
        this.setState({
                fields:{
                    ...fields,
                    [name]: {...field, error}
                }
            });
    }

    _getErrorList(){
        const { fields } = this.state;
        return Object.keys(fields).map(key => {
            if(fields[key].error){
               return <Message.Item key={key}><b>{key} :</b> {fields[key].error}</Message.Item>
            }
        })
    }
    
    render(){
        const { email, name, active } = this.state.fields;
        const errorList = this._getErrorList();

        return(
            <Form error={errorList.some(e => e)} onSubmit={this._handleSubmit}> 
                <Header as='h2'>Create user</Header>
                <Form.Input 
                    error={!!name.error}
                    required={name.isRequired}
                    name="name"
                    placeholder="Name"
                    label="Name"
                    value={name.value}
                    onChange={this._handleChange}
                    onBlur={this._handleBlur}
                />
                <Form.Input 
                    error={!!email.error}
                    required={email.isRequired}
                    name="email"
                    placeholder="Email"
                    label="Email"
                    value={email.value}
                    onChange={this._handleChange}
                    onBlur={this._handleBlur}
                />
                <Form.Checkbox 
                    toggle
                    error={!!active.error}
                    required={active.isRequired}
                    name="active"
                    label="active"
                    checked={active.value}
                    onChange={this._handleToggle}
                    onBlur={this._handleBlur}
                />
                <Form.Button fluid positive type='submit' content="Create"/>
                <Message error header='Could you check the fallowing?' list={errorList}/> 
            </Form>
        )
    }
}

export const UserForm = Relay.createRefetchContainer(
    UserFormComponent,
    USER_DATA_FRAG,
    REFETCH_QUERY
)