import { Container, Title, Text, Button, Group } from '@mantine/core';
import { Illustration } from './Illustration';
import { useNavigate } from 'react-router-dom';
import classes from './styles.module.css';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Container className={classes.root}>
      <div className={classes.inner}>
        <Illustration className={classes.image} />
        <div className={classes.content}>
          <Title className={classes.title}>Trang không tồn tại</Title>
          <Text
            c="dimmed"
            size="lg"
            ta="center"
            className={classes.description}
          >
            Trang bạn đang cố mở không tồn tại. Có thể bạn đã gõ nhầm địa chỉ
            hoặc trang đã được chuyển sang một URL khác. Nếu bạn nghĩ Đây là lỗi
            liên hệ hỗ trợ.
          </Text>
          <Group justify="center">
            <Button onClick={() => navigate('/')} size="md" className="mt-4">
              Đưa tôi trở lại trang chủ
            </Button>
          </Group>
        </div>
      </div>
    </Container>
  );
};
export default NotFound;
