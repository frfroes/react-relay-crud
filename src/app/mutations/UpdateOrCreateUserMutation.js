import { graphql, commitMutation } from 'react-relay';
import * as mutationUtil from './util';

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
  environment,
  user,
  onError,
  onSuccess
}) {

  const variables = {
    input: {
        clientMutationId: "",
        create: user,
        update: { ...user, id: user.id || '' }
    },
  }
  
  return commitMutation(
    environment,
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
      updater: proxyStore => {
        const createReport = proxyStore.getRootField('updateOrCreateUser');
        const newUser = createReport && createReport.getLinkedRecord('user');
        const viewer = proxyStore.getRoot().getLinkedRecord('viewer');
        if(newUser)
          mutationUtil.isertEdgeBefore({
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