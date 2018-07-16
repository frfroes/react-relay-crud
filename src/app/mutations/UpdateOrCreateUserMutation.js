import { graphql, commitMutation } from 'react-relay';

import { MutationUtil } from './util';

import { environment } from '../enviroment';

const mutation = graphql`
  mutation UpdateOrCreateUserMutation($input: UpdateOrCreateUserInput!) {
    updateOrCreateUser(input: $input) {
      user {
        id
        name
        email
        active
      }
    }
  }
`;

function commit({
  relayEnv=environment,
  user,
  userId,
  onError,
  onSuccess
}) {

  const variables = {
    input: {
        clientMutationId: "",
        create: user,
        update: { ...user, id: userId || '' }
    },
  }
    return commitMutation(
    relayEnv,
    {
      mutation,
      variables,
      onError: error => onError('It seams something went wrong. Please, try angain later.'),
      onCompleted: (response, errors) => {
        const error = errors && errors.find(({path}) => path.includes('updateOrCreateUser'));
        if(error) {
          onError(error.message);
        }else{
          onSuccess(response)
        }
      },
      optimisticUpdater: proxxyStore => {
        const prevUser = proxxyStore.get(userId)
        prevUser.setValue(user.name, 'name')
        prevUser.setValue(user.email, 'email')
        prevUser.setValue(user.active, 'active')
      },
      updater: proxyStore => {
        if(userId) return;

        const createReport = proxyStore.getRootField('updateOrCreateUser');
        const newUser = createReport && createReport.getLinkedRecord('user');
        const viewer = proxyStore.getRoot().getLinkedRecord('viewer');
        if(newUser)
          MutationUtil.isertEdgeBefore({
            store: proxyStore,
            node: newUser,
            edgeType: 'UserEdge',
            connection: {
              record: viewer,
              key: 'UserList_allUsers'
            }
          });
      }
    }
  );
}

export const UpdateOrCreateUserMutation = {
    commit
};