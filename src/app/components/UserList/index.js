import React from 'react';
import Relay, { graphql } from 'react-relay';
import { Card, Confirm, Button, Header } from 'semantic-ui-react'
import { toast } from 'react-toastify';

import { UserItem } from '../../components/';

import { DeleteUserMutation } from '../../mutations'

import { ITEMS_PER_PAGE } from '../../constants';

import './index.css'

const USER_LIST_FRAG = graphql`
    fragment UserList_userListData on Viewer {
        allUsers(
            first: $count, 
            after: $cursor,
            orderBy: createdAt_DESC
            filter: $userFilter
        ) @connection(key: "UserList_allUsers",  filters:[]){
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
        $cursor: String,
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
        userToDelete: null,
        isLoading: false // Workaround for this issue: https://github.com/facebook/relay/issues/1973
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

    _handleLoadMore = () => {
        const { relay } = this.props;
        this.setState({ isLoadingMore: true }); 
        relay.loadMore(ITEMS_PER_PAGE, () => this.setState({ isLoadingMore: false }))
    }

    render() {
    const { userListData: { allUsers }, relay } = this.props;
    const { userToDelete, isLoadingMore } = this.state;

    return (
        <Card.Group itemsPerRow={2} stackable>
            {allUsers.edges.length?(
                allUsers.edges.map( edge => 
                    <UserItem
                        onDelete={this._handleConfirmDelete}
                        onUpdate={this.props.onUserFocus}
                        key={edge.node.id}
                        user={edge.node}/>
            )):(
                <Header  content="It seams you don't have created any users yet." />
               )
            }
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
                loading={isLoadingMore}
                secondary
                content={relay.hasMore() ? 'Load more' : 'Nothing more to load'}
                onClick={this._handleLoadMore} 
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
        getVariables(props, { count, cursor }, fragmentVariables) {
            const { userFilter } = fragmentVariables
          return {
            count,
            cursor,
            userFilter
          }
        },
    }
);