import React, { Component } from 'react';
import { graphql, QueryRenderer } from 'react-relay';

import { environment } from './enviroment';

import { Dashboard } from './views';
import { UserList, UserForm } from './components';

import { ITEMS_PER_PAGE } from './constants';

const APP_QUERY = graphql`
  query appQuery(
    $userFilter: UserFilter,
    $count: Int!,
    $cursor: String
  ){
    viewer {
      id
      ...UserList_userListData
    }
  }
`
class App extends Component {

  state={
    userOnFocus: null,
    isFormVisibleMobile: false,
    userFilter: {}
  }

  _toggleFormVisibleMobile = () => {
    this.setState({
      isFormVisibleMobile: !this.state.isFormVisibleMobile
    })
  }

  _handleUserFocus = (userOnFocus) => {
    this.setState({
      userOnFocus,
      isFormVisibleMobile: true
    })
  }

  _handleClearUserFocus = () => {
    this.setState({
      userOnFocus: null
    })
  }

  _handleChangeUserFilter = (criterias) => {
    const { userFilter } = this.state;
    this.setState({
      userFilter:{
        ...userFilter,
        ...criterias
      }
    })
  }

  render() {
    const { userOnFocus, isFormVisibleMobile, userFilter } = this.state;
    
    return (
      <QueryRenderer
        environment={environment}
        query={APP_QUERY}
        variables={{
          userFilter,
          count: ITEMS_PER_PAGE,
        }}
        render={({error, props}) => {
          return (
            <Dashboard
              onChangeFilter={this._handleChangeUserFilter}
              filter={userFilter}
              header={{icon: 'user', label: 'User'}}
              data={{
                isReady: props !== null,
                component: (
                  <UserList 
                    onUserFocus={this._handleUserFocus}
                    onClearUserFocus={this._handleClearUserFocus}
                    userListData={props && props.viewer}/>
                )
              }}
              form={{
                isVisibleMobile: isFormVisibleMobile,
                onToogleVisibleMobile: this._toggleFormVisibleMobile,
                action: userOnFocus ? 'Update' : 'Create',
                component: (
                  <UserForm 
                    userToUpdate={userOnFocus} 
                    onUserFocus={this._handleUserFocus}
                    onClearUserFocus={this._handleClearUserFocus}
                  />
                )
              }}
            />
          )
        }}
      />
    );
  }
}

export default App;
