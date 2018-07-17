import React from 'react';
import Relay, { graphql } from 'react-relay';
import { Card, Confirm } from 'semantic-ui-react'
import { toast } from 'react-toastify';

import { UserItem } from '../components/';

import { DeleteUserMutation } from '../mutations'

const USER_LIST_FRAG = graphql`
    fragment UserList_userListData on Viewer {
        allUsers(
            first: 30, 
            orderBy: createdAt_DESC
        ) @connection(key: "UserList_allUsers", filters:[]){
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

    state = {
        userToDelete: null
    }

    _handleConfirmDelete = (user) => {
        this.setState({ userToDelete: user })
    }

    _handleItemDelete = () => {
        const { relay } = this.props;
        const { userToDelete } = this.state;
        DeleteUserMutation.commit({
            relayEnv: relay.enviroment,
            id: userToDelete.id,
            onError: (error) => {
                toast.error(error);
            },
            onSuccess: ({deleteUser: { user }}) => {
                this.setState({
                    userToDelete: null
                }, () => toast.info(<div>User <b>{user.name}</b> was deleted succefully</div>))
            }
        })
    }

    _handleCancelDelete = () => {
        this.setState({ userToDelete: null })
    }

    render() {
    const { userListData: { allUsers } } = this.props;
    const { userToDelete } = this.state;

    return (
        <Card.Group itemsPerRow={2} stackable>
            {allUsers.edges.map( edge => 
                <UserItem
                    onDelete={this._handleConfirmDelete}
                    onUpdate={this.props.onUserFocus}
                    key={edge.node.id}
                    user={edge.node}/>
            )}
            <Confirm 
                size="tiny"
                content={(
                    <div className="content">
                        Are you sure you want to delete user <b>{userToDelete && userToDelete.name}</b>?
                    </div>
                )}
                open={!!userToDelete} 
                onCancel={this._handleCancelDelete} 
                onConfirm={this._handleItemDelete} 
            />
        </Card.Group>
        
    );
    }
}

export const UserList = Relay.createFragmentContainer(
    UserListComponent,
    USER_LIST_FRAG
);