import { ApolloClient, InMemoryCache } from '@apollo/client';
import { relayStylePagination } from '@apollo/client/utilities';
import { persistCache } from 'apollo3-cache-persist';

const cache = new InMemoryCache({
    typePolicies: {
        Query: {
            fields: {
                allPeople: relayStylePagination()
            },
        },
    },
});

const persistCacheToStorage = async () => {
    try {
        await persistCache({
            cache,
            storage: window.localStorage,
        });
        console.log('Cache persisted successfully');
    } catch (error) {
        console.error('Error persisting cache:', error);
    }
};

persistCacheToStorage();

const client = new ApolloClient({
    uri: 'https://swapi-graphql.netlify.app/.netlify/functions/index',
    cache,
});

export default client;
