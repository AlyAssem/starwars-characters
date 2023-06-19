import {useQuery} from "@apollo/client";
import {Button} from "antd";
import {useEffect, useState} from "react";
import useLocalStorage from "../../hooks/useLocalStorage";
import {CharacterTable} from "../../components";
import {CharactersQuery, charactersGQL} from "../../services/queries";

const CharacterTableContainer = () => {
  const [favoriteCharactersKeys, setFavoriteCharactersKeys] = useLocalStorage<
    React.Key[]
  >("favoriteCharacters", []);
  const [favoriteMode, setFavoriteMode] = useState(false);
  const [canFetchMore, setCanFetchMore] = useState(true);
  const [characters, setCharacters] = useState<Array<ICharacter>>([]);
  const [fetching, setFetching] = useState(false);

  const limit = 20;
  const cursor = null;

  const {loading, error, data, fetchMore} = useQuery<CharactersQuery>(
    charactersGQL,
    {
      variables: {
        limit,
        cursor,
      },
      fetchPolicy: "cache-first",
    }
  );

  useEffect(() => {
    if (data) {
      const {allPeople} = data;
      const {edges, pageInfo} = allPeople;

      setCanFetchMore(pageInfo.hasNextPage);

      const newCharacters: ICharacter[] = edges.flatMap((item, idx: number) => {
        const {
          name,
          eyeColor,
          gender,
          height,
          mass,
          homeworld,
          species,
          filmConnection,
        } = item.node;

        return {
          key: idx,
          name,
          eyeColor,
          gender,
          height,
          mass,
          homeworld,
          species,
          filmTitle: filmConnection.films
            .map((film: IFilm) => film.title)
            .join(", "),
        };
      });

      setCharacters(newCharacters);
    }
  }, [data]);

  if (!data) {
    // we don't have data yet
    if (loading) {
      // but we're loading some
      return <h2>Loading initial data...</h2>;
    }
    if (error) {
      // and we have an error
      return <h2>Error loading data :(</h2>;
    }
    return <h2>Unknown error :(</h2>;
  }

  const handleFetchMore = async () => {
    if (data?.allPeople.pageInfo.hasNextPage) {
      setFetching(true);
      try {
        await fetchMore({
          variables: {
            cursor: data.allPeople.pageInfo.endCursor,
          },
          updateQuery: (prevResult, {fetchMoreResult}) => {
            if (!fetchMoreResult) {
              return prevResult;
            }

            const newEdges = fetchMoreResult.allPeople.edges;

            return {
              allPeople: {
                ...prevResult.allPeople,
                edges: [...prevResult.allPeople.edges, ...newEdges],
                pageInfo: fetchMoreResult.allPeople.pageInfo,
              },
            };
          },
        });
      } catch (error) {
        console.error(error);
      } finally {
        setFetching(false);
      }
    }
  };

  const handleFavoritesSelected = (favoriteKeys: React.Key[]) => {
    setFavoriteCharactersKeys(favoriteKeys);
  };

  const handleFavoritesModeToggle = (checked: boolean) => {
    setFavoriteMode(checked);
  };

  const filteredCharacters = favoriteMode
    ? characters.filter((c) => {
        return favoriteCharactersKeys.includes(c.key);
      })
    : characters;

  return (
    <>
      <CharacterTable
        characters={filteredCharacters}
        onFetchMore={handleFetchMore}
        onFavoritesModeToggle={handleFavoritesModeToggle}
        onFavoriteSelected={handleFavoritesSelected}
      />
      <div>
        <Button
          style={{
            display: "block",
            marginLeft: "auto",
          }}
          type="primary"
          onClick={handleFetchMore}
          disabled={fetching || !canFetchMore}
        >
          {fetching ? "Loading..." : "More Characters?"}
        </Button>
      </div>
    </>
  );
};

export default CharacterTableContainer;
