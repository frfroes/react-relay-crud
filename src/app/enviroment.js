import {
    Environment,
    Network,
    RecordSource,
    Store,
} from 'relay-runtime';
  
import { GRAPHQL_ENDPOINT } from './constants';

function fetchQuery(
    operation,
    variables,
) {   
return fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
    query: operation.text,
    variables,
    }),
}).then(response => {
    return response.json();
});
}

export const environment = new Environment({
    network: Network.create(fetchQuery),
    store: new Store(new RecordSource()),  
});
