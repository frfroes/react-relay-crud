import { graphql, commitMutation } from 'react-relay';

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
  return commitMutation(
    environment,
    {
      mutation,
      variables: {
        input: {
            create: user,
            update: user
        },
      },
    }
  );
}

export const UpdateOrCreateUserMutation = {
    commit
};