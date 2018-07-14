import React, { Component } from 'react';
import { graphql, QueryRenderer } from 'react-relay';

import { environment } from './enviroment';

import { Dashboard } from './views';

const APP_QUERY = graphql`
  query appQuery {
    viewer {
      id
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
          return <Dashboard header={{icon: 'user', label: 'User'}}/>
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
