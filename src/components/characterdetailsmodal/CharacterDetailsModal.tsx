import {Modal, ModalProps, Row, Col, Space} from "antd";

interface Props extends ModalProps {
  character: ICharacter;
}

const CharacterDetailsModal = (props: Props) => {
  const {character} = props;

  const details = [
    {label: "Name", value: character?.name},
    {label: "EyeColor", value: character?.eyeColor},
    {label: "Gender", value: character?.gender},
    {label: "Height", value: character?.height},
    {label: "Weight", value: character?.mass},
    {label: "HomeWorld", value: character?.homeworld.name},
    {label: "Species", value: character?.species?.name},
    {label: "Movies", value: character?.filmTitle},
  ];

  const sanitizeValue = (value: string | number | null | undefined) => {
    if (
      value === null ||
      value === undefined ||
      ["none", "n/a", "unknown", "undefined"].includes(value as string)
    ) {
      return "-";
    }
    return value;
  };

  return (
    <Modal
      title="Character Details"
      open={props.open}
      onCancel={props.onCancel}
      onOk={props.onCancel}
    >
      <Row>
        <Col span={12}>
          <Space direction="vertical">
            {details.slice(0, Math.floor(details.length / 2)).map((item) => (
              <div key={item.label}>
                {item.label}: {sanitizeValue(item.value)}
              </div>
            ))}
          </Space>
        </Col>
        <Col span={12}>
          <Space direction="vertical">
            {details.slice(Math.floor(details.length / 2)).map((item) => (
              <div key={item.label}>
                {item.label}: {sanitizeValue(item.value)}
              </div>
            ))}
          </Space>
        </Col>
      </Row>
    </Modal>
  );
};

export default CharacterDetailsModal;
