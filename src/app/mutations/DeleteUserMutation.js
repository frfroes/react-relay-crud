import { commitMutation, graphql } from 'react-relay';

import { MutationUtil } from './util';
  
import { environment } from '../enviroment';

const mutation = graphql`
  mutation DeleteUserMutation($input: DeleteUserInput!) {
    deleteUser(input: $input) {
      deletedId
    }
  }
`;

// function sharedUpdater(store, user, deletedID) {
//   const userProxy = store.get(user.id);
//   const conn = ConnectionHandler.getConnection(
//     userProxy,
//     'TodoList_todos',
//   );
//   ConnectionHandler.deleteNode(
//     conn,
//     deletedID,
//   );
// }

function commit({
  relayEnv=environment,
  id
}) {
  const variables = {
    input: { id, clientMutationId: ''}
  }
  return commitMutation(
    relayEnv,
    {
      mutation,
      variables: variables,
      updater: (proxyStore) => {
        const deleteUser = proxyStore.getRootField('deleteUser');
        const viewer = proxyStore.getRoot().getLinkedRecord('viewer');
        MutationUtil.deleteEdgeNode({
          deletedId: deleteUser.getValue('deletedId'), 
          connection: {
            record: viewer,
            key: 'UserList_allUsers'
          }
        })
      },
      optimisticUpdater: (proxyStore) => {
        const viewer = proxyStore.getRoot().getLinkedRecord('viewer');
        MutationUtil.deleteEdgeNode({
          deletedId: id, 
          connection: {
            record: viewer,
            key: 'UserList_allUsers'
          }
        })
      },
    }
  );
}

export const DeleteUserMutation = {
    commit
};