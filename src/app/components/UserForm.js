import React from 'react'
import { Button, Checkbox, Form, Header } from 'semantic-ui-react'

export class UserForm extends React.Component {
    render(){
        return(
            <Form>
                <Header as='h2'>Create user</Header>
                <Form.Field>
                    <label>Name</label>
                    <input placeholder='Name' />
                </Form.Field>
                <Form.Field>
                    <label>Email</label>
                    <input placeholder='Email' />
                </Form.Field>
                <Form.Field>
                    <Checkbox toggle label='Is active'/>
                </Form.Field>
                <Button fluid positive type='submit'>Create</Button>
            </Form>
        )
    }
}