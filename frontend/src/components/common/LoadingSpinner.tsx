import { Flex, Spin } from 'antd';

export default function LoadingSpinner() {
  return (
    <Flex justify="center" align="center" style={{ padding: 48 }}>
      <Spin size="large" />
    </Flex>
  );
}
