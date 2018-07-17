import React, { Component } from 'react';
import { graphql, QueryRenderer } from 'react-relay';

import { environment } from './enviroment';

import { Dashboard } from './views';
import { UserList, UserForm } from './components';

const APP_QUERY = graphql`
  query appQuery{
    viewer {
      id
      ...UserList_userListData
    }
  }
`
class App extends Component {

  state={
    userOnFocus: null,
    isFormVisible: false
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

  render() {
    const { userOnFocus, isFormVisible } = this.state;
    
    return (
      <QueryRenderer
        environment={environment}
        query={APP_QUERY}
        render={({error, props=null}) => {
          return (
            <Dashboard 
              isFormVisible={isFormVisible}
              onToogleFormVisible={this._toogleFormVisible}
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
