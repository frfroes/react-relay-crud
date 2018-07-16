import { ConnectionHandler } from 'relay-runtime';

export const MutationUtil = {

    isertEdgeBefore({
        store, 
        node,
        edgeType,
        connection: { record, key }
    }){
        const connection = ConnectionHandler.getConnection(
            record,
            key,
        );
        const newEdge = ConnectionHandler.createEdge(
            store,
            connection,
            node,
            edgeType,
        );
        
        ConnectionHandler.insertEdgeBefore(connection, newEdge);
    },

    deleteEdgeNode({deletedId, connection: { record, key }}) {
        const connection = ConnectionHandler.getConnection(
            record,
            key,
        );
        ConnectionHandler.deleteNode(
            connection,
            deletedId,
        );
    }
}