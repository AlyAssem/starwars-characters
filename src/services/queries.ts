import { gql } from '@apollo/client';

export const charactersGQL = gql`
query CharactersQuery($cursor: String, $limit: Int) {
  allPeople(first:$limit, after: $cursor)  {
    edges {
      node {
        name
        homeworld {
          name
        }
        eyeColor
        gender
        height
        mass
        species {
          name
        }
        filmConnection {
          films {
            title
          }
        }
      }
    }
      pageInfo {
        endCursor
        hasNextPage
      }
  }
}`;


export type CharactersQuery = {
  allPeople: {
    edges: ICharacterApi[];
    pageInfo: {
      endCursor: string;
      hasNextPage: boolean;
    }
  };
};
