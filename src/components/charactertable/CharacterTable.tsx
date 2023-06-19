import {Button, Space, Switch, Table} from "antd";
import {ColumnsType} from "antd/es/table";
import {useEffect, useState} from "react";
import useLocalStorage from "../../hooks/useLocalStorage";
import CharacterDetailsModal from "../characterdetailsmodal/CharacterDetailsModal";

// Function to generate dynamic filter options based on unique values in an array
const generateFilters = <K extends keyof ICharacter>(
  data: ICharacter[],
  dataIndex: K
): {text: string; value: string}[] => {
  let uniqueValues: Array<ICharacter[K]> | string[];

  if (dataIndex === "species") {
    uniqueValues = Array.from(
      new Set(data.map((item) => (item[dataIndex] as ISpecies)?.name))
    );
  } else if (dataIndex === "filmTitle") {
    uniqueValues = Array.from(
      new Set(data.flatMap((item) => item.filmTitle.split(", ")))
    );
  } else {
    uniqueValues = Array.from(new Set(data.map((item) => item[dataIndex])));
  }

  return uniqueValues
    .map((value) => ({
      text: String(value),
      value: String(value),
    }))
    .filter(
      (item) =>
        item.value !== "none" &&
        item.value !== "n/a" &&
        item.value !== "unknown" &&
        item.value !== "undefined"
    );
};

interface Props {
  characters: ICharacter[];
  onFetchMore: () => void;
  onFavoritesModeToggle: (checked: boolean) => void;
  onFavoriteSelected: (keys: React.Key[]) => void;
}

const CharacterTable = (props: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [favoriteCharacters] = useLocalStorage<React.Key[]>(
    "favoriteCharacters",
    []
  );
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<ICharacter | null>(
    null
  );

  useEffect(() => {
    setSelectedRowKeys(favoriteCharacters);
  }, [favoriteCharacters]);

  const handleCharacterDetailsModalOpen = (character: ICharacter) => {
    setSelectedCharacter(character);
    setIsModalOpen(true);
  };

  const handleCharacterDetailsModalClose = () => {
    setIsModalOpen(false);
  };

  const columns: ColumnsType<ICharacter> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Film",
      dataIndex: "filmTitle",
      key: "title",
      filterMultiple: false,
      onFilter: (value: string | number | boolean, record) => {
        return record.filmTitle.includes(value as string);
      },
      filters: generateFilters(props.characters, "filmTitle"),
    },
    {
      title: "Height",
      dataIndex: "height",
      key: "height",
      render: (_, {height}) => <span>{height || "-"}</span>,
    },
    {
      title: "Weight",
      dataIndex: "mass",
      key: "weight",
      render: (_, {mass}) => <span>{mass || "-"}</span>,
    },
    {
      title: "Homeworld",
      dataIndex: "homeworld",
      key: "homeworld",
      render: (_, {homeworld}) => (
        <span>{homeworld.name !== "unknown" ? homeworld.name : "-"}</span>
      ),
    },
    {
      title: "Species",
      dataIndex: "species",
      key: "species",
      render: (_, {species}) => <span>{species?.name || "-"}</span>,
      onFilter: (value: string | number | boolean, record) => {
        return record.species?.name === value;
      },
      filters: generateFilters(props.characters, "species"),
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
      render: (_, {gender}) => (
        <span>
          {gender !== "n/a" && gender !== "unknown" && gender !== "none"
            ? gender
            : "-"}
        </span>
      ),
      filterMultiple: false,
      onFilter: (value: string | number | boolean, record) => {
        return record.gender === value;
      },
      filters: generateFilters(props.characters, "gender"),
    },
    {
      title: "Eyecolor",
      dataIndex: "eyeColor",
      key: "eyeColor",
      render: (_, {eyeColor}) => (
        <span>
          {eyeColor !== "n/a" && eyeColor !== "unknown" ? eyeColor : "-"}
        </span>
      ),
      onFilter: (value: string | number | boolean, record) => {
        return record.eyeColor === value;
      },
      filters: generateFilters(props.characters, "eyeColor"),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <a onClick={() => handleCharacterDetailsModalOpen(record)}>Details</a>
      ),
    },
  ];

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys([...newSelectedRowKeys]);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  return (
    <>
      <div style={{marginBottom: 16}}>
        <Space>
          <Button
            type="primary"
            onClick={() => props.onFavoriteSelected(selectedRowKeys)}
          >
            FavoriteSelected
          </Button>

          <Switch
            checkedChildren="FavoriteModeOn"
            unCheckedChildren="FavoriteModeOff"
            onChange={props.onFavoritesModeToggle}
          />
        </Space>
      </div>
      <Table
        rowSelection={rowSelection}
        dataSource={props.characters}
        columns={columns}
        pagination={{
          pageSize: 10,
          showSizeChanger: false,
        }}
      />
      <CharacterDetailsModal
        open={isModalOpen}
        onCancel={handleCharacterDetailsModalClose}
        character={selectedCharacter as ICharacter}
      />
    </>
  );
};

export default CharacterTable;
