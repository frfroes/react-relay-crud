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
        updatedAt
      }
    }
  }
`;

let tempID = 0;

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
      optimisticUpdater: proxyStore => {
        const now = new Date().toISOString();

        if(userId){
          const prevUser = proxyStore.get(userId)
          MutationUtil.mapObjectToRecordProxy({
            object: { 
              ...user, updatedAt: now
            },
            record: prevUser
          })
        }else{
          const id = 'client:newUser:' + tempID++;
          let newUser = proxyStore.create(id, 'User');
          const viewer = proxyStore.getRoot().getLinkedRecord('viewer');
          newUser = MutationUtil.mapObjectToRecordProxy({
            object: { 
              ...user, createdAt: now, updatedAt: now
            },
            record: newUser
          })
          const newEdge = proxyStore.create(
            'client:newEdge:' + tempID++,
            'UserEdge',
          );
          newEdge.setLinkedRecord(newUser, 'user')
          MutationUtil.insertEdgeBefore({
            store: proxyStore,
            node: newUser,
            edgeType: 'UserEdge',
            connection: {
              record: viewer,
              key: 'UserList_allUsers'
            }
          });
        }
      },
      updater: proxyStore => {
        if(userId) return; // Relay handles update existing edge by itself

        const createReport = proxyStore.getRootField('updateOrCreateUser');
        const newUser = createReport && createReport.getLinkedRecord('user');
        const viewer = proxyStore.getRoot().getLinkedRecord('viewer');
        if(newUser)
          MutationUtil.insertEdgeBefore({
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