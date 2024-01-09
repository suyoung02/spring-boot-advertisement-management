import { Title, Text, Button, Container, Group } from '@mantine/core';
import classes from './styles.module.css';

const ServerError = () => {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="bg-blue-500 w-screen h-screen flex items-center justify-center">
      <Container>
        <div className={classes.label}>500</div>
        <div className="text-white flex flex-col gap-8 mt-10">
          <Title className={classes.title}>Có sự cố xảy ra</Title>
          <Text size="lg" ta="center" className={classes.description}>
            Có lỗi xảy ra. Vui lòng thử lại
          </Text>
        </div>
        <Group justify="center">
          <Button
            onClick={handleRefresh}
            variant="white"
            size="md"
            className="mt-4"
          >
            Tải lại trang
          </Button>
        </Group>
      </Container>
    </div>
  );
};

export default ServerError;
