import { classNames } from '@/utils/classNames';
import { FileInput, FileInputProps } from '@mantine/core';
import { IconMoodSmileFilled } from '@tabler/icons-react';
import { useEffect, useState } from 'react';

const convertImageToString = (file: unknown) =>
  typeof file === 'string'
    ? file
    : file
    ? URL.createObjectURL(file as File)
    : '';

type Props = FileInputProps & {
  wrapperClass?: string;
};

const IconInput = ({ wrapperClass, ...props }: Props) => {
  const [imagePreview, setImagePreview] = useState(
    convertImageToString(props.value),
  );

  useEffect(() => {
    setImagePreview(convertImageToString(props.value));
  }, [props.value]);

  const onUploadFile = async (event: File | null) => {
    if (event) {
      setImagePreview(convertImageToString(event));
    } else {
      setImagePreview('');
    }
    props.onChange?.(event);
  };

  return (
    <div className={classNames('flex gap-2 items-center', wrapperClass)}>
      {imagePreview && (
        <div className="w-8 h-8">
          <img
            alt="icon"
            src={imagePreview}
            className="object-cover w-full h-full object-center"
          />
        </div>
      )}
      <FileInput
        {...props}
        accept="image/png, image/jpeg, image/jpg"
        leftSection={<IconMoodSmileFilled />}
        placeholder={props.placeholder || 'Chọn icon'}
        onChange={onUploadFile}
      />
    </div>
  );
};

export default IconInput;
