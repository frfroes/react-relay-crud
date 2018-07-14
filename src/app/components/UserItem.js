import React from 'react';
import Relay, { graphql } from 'react-relay'

const USER_ITEM_FRAG =  graphql`
    fragment UserItem_user on User {
        active
        email
        id
        name
        updatedAt
    }   
`

class UserItemComponent extends React.Component {
  
    render() {
    const { user } = this.props;

    return (
      <li>{ user.name }</li>
    );
  }
}

export const UserItem = Relay.createFragmentContainer(
    UserItemComponent,
  USER_ITEM_FRAG
)