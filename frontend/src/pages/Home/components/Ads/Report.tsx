import { CreateReportRequest, createReport } from '@/apis/report';
import { useForm } from '@/hooks/useForm';
import { Panel, Position } from '@/types/ads';
import { getMachineId } from '@/utils/device';
import { Button, Drawer, Input, Select, TextInput } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconAlertCircle } from '@tabler/icons-react';
import { useMutation } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useRef, useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import TextEditor from './TextEditor';
import { classNames } from '@/utils/classNames';

type Props = {
  opened: boolean;
  onClose: () => void;
  position?: Position;
  panel?: Panel;
};

const Report = ({ onClose, opened, position, panel }: Props) => {
  const type = position ? 'position' : 'panel';
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [show, setShow] = useState(false);

  const { fields, onError, onChangeField, error, reset } =
    useForm<CreateReportRequest>({
      defaultState: {
        reportForm: '',
        fullName: '',
        email: '',
        phoneNumber: '',
        content: '',
        state: '',
        deviceId: getMachineId(),
        image1: '',
        image2: '',
        solving: '',
        token: '',
      },
      validate: {
        content: ({ value, formValue }) => {
          return !value
            ? 'Nội dụng bắt buộc'
            : !formValue?.image1 && !!formValue?.image2
            ? 'Cần ít nhất một hình ảnh'
            : null;
        },
      },
      config: {
        reportForm: {
          required: true,
        },
        fullName: {
          required: true,
        },
        email: {
          required: true,
        },
        phoneNumber: {
          required: true,
        },
        state: {
          required: true,
        },
        token: {
          required: true,
        },
      },
    });

  const { mutate } = useMutation({
    mutationFn: (data: CreateReportRequest) => createReport(data),
    onSuccess: () => {
      notifications.show({
        message: 'Tạo báo cáo thành công',
      });
    },
    onError: (e) => {
      notifications.show({
        color: 'red',
        title: 'Có lỗi xảy ra vui lòng thử lại',
        message: e.message,
      });
    },
  });

  const handleSubmit = async () => {
    setShow(false);
    const token = recaptchaRef.current?.getValue();
    if (!token) {
      setShow(true);
      return;
    }
    const err = onError();
    if (err) return;

    mutate(fields);
  };

  const handleClose = () => {
    onClose?.();
    reset();
  };

  return (
    <Drawer
      position="right"
      opened={opened}
      onClose={handleClose}
      title="Báo cáo vi phạm"
      size="xl"
      styles={{ body: { padding: 0 } }}
    >
      <div className="relative h-[calc(100vh-125px)] overflow-y-auto px-4 pb-6">
        <div className="p-4 rounded-xl border flex gap-2">
          <div className="w-6">
            <IconAlertCircle size={24} />
          </div>
          <div className="flex flex-col">
            <div className="font-bold">
              Thông tin {type ? 'Điểm quảng cáo' : 'Bảng quảng cáo'}
            </div>
            <div className="font-medium mb-2">
              {position?.adsPosition.name || panel?.ads_type.title}
            </div>
            <div className="text-sm">
              {position?.adsPosition.address || panel?.address}
            </div>
            <div className="text-base">
              Hình thức:{' '}
              <span className="font-medium">
                {position?.adsForm.title || panel?.ads_form.title}
              </span>
            </div>
            <div className="text-base">
              Phân loại:{' '}
              <span className="font-medium">
                {position?.locationType.title || panel?.loaction_type.title}
              </span>
            </div>
            {panel && (
              <>
                <div className="text-base">
                  Kích thước: <span className="font-medium">{panel.size}</span>
                </div>
                <div className="text-base">
                  Số lượng:{' '}
                  <span className="font-medium">{panel.quantity}</span>
                </div>
                <div className="text-base">
                  Ngày hết hạn:{' '}
                  <span className="font-medium">
                    {dayjs(panel.contract_expiration).format(
                      'DD/MM/YYYY - HH:mm',
                    )}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="flex flex-col mt-2 gap-2">
          <Select
            withAsterisk
            label="Hình thức báo cáo"
            placeholder="Hình thức báo cáo"
            value={fields.reportForm}
            onChange={(value) => onChangeField('reportForm', value || '')}
            error={error.reportForm}
          />
          <TextInput
            withAsterisk
            label="Họ và tên"
            placeholder="Họ và tên"
            value={fields.fullName}
            onChange={(e) => onChangeField('fullName', e.target.value)}
            error={error.fullName}
          />

          <TextInput
            withAsterisk
            type="email"
            label="Email"
            placeholder="Email"
            value={fields.email}
            onChange={(e) => onChangeField('email', e.target.value)}
            error={error.email}
          />
          <TextInput
            withAsterisk
            label="Số điện thoại"
            placeholder="Số điện thoại"
            value={fields.phoneNumber}
            onChange={(e) => onChangeField('phoneNumber', e.target.value)}
            error={error.phoneNumber}
          />
          <div>
            <Input.Label required>Nội dụng</Input.Label>
            {error.content && (
              <div className="mb-2">
                <Input.Error>{error.content}</Input.Error>
              </div>
            )}
            <TextEditor
              value={fields.content}
              onChange={(content) => onChangeField('content', content)}
              images={[fields.image1, fields.image2]}
              onChangeImage={(images) => {
                onChangeField('image1', images[0] || '');
                onChangeField('image2', images[1] || '');
              }}
            />
          </div>
        </div>

        <div className="fixed bg-white bottom-0 left-0 right-0 px-4 py-3 border-t flex gap-3">
          <Button
            onClick={handleClose}
            className="flex-1"
            variant="outline"
            size="lg"
          >
            Huỷ báo cáo
          </Button>
          <div className="relative flex-1">
            <ReCAPTCHA
              ref={recaptchaRef}
              className={classNames(
                'absolute -top-1 left-0 -translate-y-full z-10',
                { hidden: !show },
              )}
              sitekey="6LdOsUkpAAAAAPWlSX-ZTkxDEI-09J6nhhBMdeAd"
              onChange={(e) => e && setTimeout(() => setShow(false), 1000)}
            />

            <Button w="100%" onClick={handleSubmit} size="lg">
              Tạo báo cáo
            </Button>
          </div>
        </div>
      </div>
    </Drawer>
  );
};

export default Report;
