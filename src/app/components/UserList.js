import React from 'react';
import Relay, { graphql } from 'react-relay';

import { Card } from 'semantic-ui-react'

import { UserItem } from '../components/';

const USER_LIST_FRAG = graphql`
    fragment UserList_userListData on Viewer {
        allUsers{
            edges {
                node {
                    id,
                    ...UserItem_user,
                }
            }
        }
        id
    }
`

class UserListComponent extends React.Component<Props> {
  render() {
    const { userListData: { allUsers } } = this.props;
    
    return (
        <Card.Group itemsPerRow={2} stackable>
            {allUsers.edges.map( edges => 
                <UserItem 
                    key={edges.node.id}
                    user={edges.node}/>
            )}
        </Card.Group>
        
    );
  }
}

export const UserList = Relay.createFragmentContainer(
    UserListComponent,
    USER_LIST_FRAG
);