import React from 'react';
import Relay, { graphql } from 'react-relay';
import { Card, Confirm, Button } from 'semantic-ui-react'
import { toast } from 'react-toastify';

import { UserItem } from '../../components/';

import { DeleteUserMutation } from '../../mutations'

import { ITEMS_PER_PAGE } from '../../constants';

import './index.css'

const USER_LIST_FRAG = graphql`
    fragment UserList_userListData on Viewer {
        allUsers(
            first: $count, 
            after: $after,
            orderBy: createdAt_DESC
            filter: $userFilter
        ) @connection(key: "UserList_allUsers"){
            edges {
                cursor
                node {
                    id,
                    ...UserItem_user,
                }
            }
            pageInfo {
                hasNextPage
                endCursor
            }
        }
        id
    }
`
const USER_LIST_FOWARD_QUERY = graphql`
    query UserListForwardQuery(
        $count: Int!,
        $after: String,
        $userFilter: UserFilter
    ) {
        viewer {
            id
            ...UserList_userListData
        }
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

    _loadMore = () => {     
        this.props.relay.loadMore(ITEMS_PER_PAGE)
    }

    render() {
    const { userListData: { allUsers }, relay } = this.props;
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
            <Button
                fluid
                basic
                disabled={!relay.hasMore()}
                loading={relay.isLoading()}
                secondary
                content={relay.hasMore() ? 'Load more' : 'Nothing more to load'}
                onClick={() => {relay.loadMore(ITEMS_PER_PAGE)}} 
            />
        </Card.Group>
        
    );
    }
}

export const UserList = Relay.createPaginationContainer(
    UserListComponent,
    USER_LIST_FRAG,
    {
        direction: 'forward',
        query: USER_LIST_FOWARD_QUERY,
        getConnectionFromProps(props) {
          return props.userListData && props.userListData.allUsers
        },
        getFragmentVariables(previousVariables, totalCount) {
          return {
            ...previousVariables,
            count: totalCount,
          }
        },
        getVariables(props, { count, after }, fragmentVariables) {

          return {
            count,
            after
          }
        },
    }
);