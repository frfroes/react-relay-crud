import React, { Component } from 'react';
import { graphql, QueryRenderer } from 'react-relay';

import { environment } from './enviroment';

import { Dashboard } from './views';
import { UserList } from './components';

const APP_QUERY = graphql`
  query appQuery {
    viewer {
      id
      ...UserList_userListData
    }  
}
`
class App extends Component {

  render() {
    return (
      <QueryRenderer
        environment={environment}
        query={APP_QUERY}
        variables={{}}
        render={({error, props}) => {
          return (
            <Dashboard 
              header={{icon: 'user', label: 'User'}}
              data={{
                isReady: props !== null,
                component: <UserList userListData={props && props.viewer}/>
              }}
              form={{
                component: null
              }}
            />
          )
        }}
      />
    );
  }
}

export default App;

// if (error) {
//   return <div>Error!</div>;
// }
// if (!props) {
//   return <div>Loading...</div>;
// }
// return <div>User ID: {props.viewer.id}</div>;
