import { commitMutation, graphql } from 'react-relay';

import { MutationUtil } from './util';
  
import { environment } from '../enviroment';

const mutation = graphql`
  mutation DeleteUserMutation($input: DeleteUserInput!) {
    deleteUser(input: $input) {
      deletedId
      user{
        name
      }
    }
  }
`;

function commit({
  relayEnv=environment,
  id,
  onError,
  onSuccess
}) {
  const variables = {
    input: { id, clientMutationId: ''}
  }
  return commitMutation(
    relayEnv,
    {
      mutation,
      variables: variables,
      onError: () => onError('It seams something went wrong while deleting the user. Please, try angain later.'),
      onCompleted: (response, errors) => {
        const error = errors && errors.find(({path}) => path.includes('deleteUser'));
        if(error) {
          onError(error.message);
        }else{
          onSuccess(response)
        }
      },
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