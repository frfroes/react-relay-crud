import React from 'react';
import Relay, { graphql } from 'react-relay';

import { Card, List, Button } from 'semantic-ui-react'

const USER_ITEM_FRAG =  graphql`
    fragment UserItem_user on User {
        active
        email
        id
        name
        createdAt
        updatedAt
    }   
`

class UserItemComponent extends React.Component {
  
    render() {
    const { user } = this.props;

    return (
        <Card>
            <Card.Content>
                <Card.Header>{user.name}</Card.Header>
                <Card.Meta>{user.createdAt}</Card.Meta>
                <List>
                    <List.Item>
                        <List.Icon name='mail' />
                        <List.Content>{user.email}</List.Content>
                    </List.Item>
                    {user.active ?( 
                        <List.Item>
                            <List.Icon name='check' />
                            <List.Content>Active</List.Content>
                        </List.Item>
                    ):(
                        <List.Item>
                            <List.Icon name='close' />
                            <List.Content>Unactive</List.Content>
                        </List.Item>
                    )}
                </List>
            </Card.Content>
            <Card.Content extra>
                <div className='ui two buttons'>
                    <Button 
                        basic 
                        color='blue' 
                        icon='pencil' 
                        content='Edit'
                    />
                    <Button 
                        basic 
                        color='red' 
                        icon='trash' 
                        content='Delete'
                    />
                </div>
            </Card.Content>
        </Card>
    );
  }
}

export const UserItem = Relay.createFragmentContainer(
    UserItemComponent,
  USER_ITEM_FRAG
)