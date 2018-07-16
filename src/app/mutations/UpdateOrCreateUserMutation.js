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
      updater: proxyStore => {
        const createReport = proxyStore.getRootField('updateOrCreateUser');
        const newUser = createReport.getLinkedRecord('user');
        const viewer = proxyStore.getRoot().getLinkedRecord('viewer');

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