import React from 'react'
import { Button, Checkbox, Form, Header } from 'semantic-ui-react'

export class UserForm extends React.Component {

    state = {
        fields:{
            email:{ value:'', isRequired: true },
            name: { value: '', isRequired: true },
            isActive:{ value: false }
        },
        formValid: false,
    }

    _handleChange = (e, { name, value }) => {
        const { fields } = this.state;
        const field = fields[name];
        this.setState({fields: { 
            ...fields,
            [name]: { ...field, value}
        }}, () => this._validateField(name))
    }

    _handleBlur = ({target: { name }}) => {
        const { fields } = this.state;
        const field = fields[name];

        if(!field.hasBlurred)
            this.setState({fields: { 
                ...fields,
                [name]: { ...field, hasBlurred: true}
            }}, () => this._validateField(name))
    }

    _validateField(name) {
        const { fields } = this.state;
        const field = fields[name];
        let error = '';

        switch(name) {
            case 'email':
                const isValidEmail = field.value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
                if(field.hasBlurred && !isValidEmail){
                    error = 'Email adress is invalid'
                }
            break;
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
    
    render(){
        const { email, name, isActive } = this.state.fields;
        
        return(
            <Form>
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
                    error={!!isActive.error}
                    required={isActive.isRequired}
                    name="isActive"
                    label="isActive"
                    checked={isActive.value}
                    onChange={this._handleChange}
                    onBlur={this._handleBlur}
                />
                <Form.Button fluid positive type='submit' content="Create"/>
            </Form>
        )
    }
}