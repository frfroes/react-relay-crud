// import {
//     commitMutation,
//     graphql,
// } from 'react-relay';
// import {ConnectionHandler} from 'relay-runtime';
  
// const mutation = graphql`
//   mutation DeleteUserMutation($input: DeleteUserInput!) {
//     deleteUser(input: $input) {
//       deletedId
//     }
//   }
// `;

// // function sharedUpdater(store, user, deletedID) {
// //   const userProxy = store.get(user.id);
// //   const conn = ConnectionHandler.getConnection(
// //     userProxy,
// //     'TodoList_todos',
// //   );
// //   ConnectionHandler.deleteNode(
// //     conn,
// //     deletedID,
// //   );
// // }

// function commit(
//   environment,
//   id
// ) {
//   const variables = {
//     input: { id, clientMutationId: ''}
//   }
//   return commitMutation(
//     environment,
//     {
//       mutation,
//       variables: variables
//     }
//   );
// }

// export const DeleteUserMutation = {
//     commit
// };