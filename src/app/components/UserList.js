import React from 'react';
import Relay, { graphql } from 'react-relay';

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
        <ul>
        {allUsers.edges.map( edges => 
            <UserItem 
                key={edges.node.id}
                user={edges.node}/>
        )}
        </ul>
    );
  }
}

export const UserList = Relay.createFragmentContainer(
    UserListComponent,
    USER_LIST_FRAG
);