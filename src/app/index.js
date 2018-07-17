import React, { Component } from 'react';
import { graphql, QueryRenderer } from 'react-relay';

import { environment } from './enviroment';

import { Dashboard } from './views';
import { UserList, UserForm } from './components';

import { ITENS_PER_PAGE } from './constants';

const APP_QUERY = graphql`
  query appQuery(
    $userFilter: UserFilter,
    $count: Int!,
    $after: String
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
    isFormVisible: false,
    userFilter: {}
  }

  _toogleFormVisible = () => {
    this.setState({
      isFormVisible: !this.state.isFormVisible
    })
  }

  _handleUserFocus = (userOnFocus) => {
    this.setState({
      userOnFocus,
      isFormVisible: true
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
    const { userOnFocus, isFormVisible, userFilter } = this.state;
    
    return (
      <QueryRenderer
        environment={environment}
        query={APP_QUERY}
        variables={{
          userFilter,
          count: ITENS_PER_PAGE
        }}
        render={({error, props}) => {
          return (
            <Dashboard 
              isFormVisible={isFormVisible}
              onToogleFormVisible={this._toogleFormVisible}
              onChangeFilter={this._handleChangeUserFilter}
              filter={userFilter}
              header={{icon: 'user', label: 'User'}}
              data={{
                isReady: props !== null,
                component: (
                  <UserList 
                    onUserFocus={this._handleUserFocus}
                    userListData={props && props.viewer}/>
                )
              }}
              form={{
                component: (
                  <UserForm 
                    userToUpdate={userOnFocus} 
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
