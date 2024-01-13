import { getImageUrl, storageRef, uploadFile } from '@/configs/firebase';
import { ActionIcon, Button } from '@mantine/core';
import { Link, RichTextEditor } from '@mantine/tiptap';
import { IconUpload, IconX } from '@tabler/icons-react';
import Highlight from '@tiptap/extension-highlight';
import SubScript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { ChangeEvent, useRef, useState } from 'react';
import Placeholder from '@tiptap/extension-placeholder';
import { classNames } from '@/utils/classNames';

type Props = {
  value?: string;
  placeholder?: string;
  onChange?: (content: string) => void;
  images?: string[];
  onChangeImage?: (images: string[]) => void;
  limitImages?: number;
};

const TextEditor = ({
  value,
  onChange,
  images: valueImages = [],
  onChangeImage,
  limitImages = 2,
}: Props) => {
  const ref = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Superscript,
      SubScript,
      Highlight,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({ placeholder: 'This is placeholder' }),
    ],
    content: value || '',
    onUpdate({ editor }) {
      onChange?.(editor.getHTML());
    },
  });

  const [images, setImages] = useState<string[]>(valueImages);

  const onUploadFile = async (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const file = e.target.files?.[0];
    if (!file) return;

    const ref = storageRef(`files/${file.name}`);
    const res = await uploadFile(file, ref);
    if (!res) return;
    const url = await getImageUrl(res.ref);
    const newImages = [...images, url];
    setImages(newImages);
    onChangeImage?.(newImages);
  };

  return (
    <div>
      <RichTextEditor editor={editor}>
        <RichTextEditor.Toolbar
          sticky
          stickyOffset={60}
          className="items-center"
        >
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Bold />
            <RichTextEditor.Italic />
            <RichTextEditor.Underline />
            <RichTextEditor.Strikethrough />
            <RichTextEditor.ClearFormatting />
            <RichTextEditor.Highlight />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.H1 />
            <RichTextEditor.H2 />
            <RichTextEditor.H3 />
            <RichTextEditor.H4 />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Blockquote />
            <RichTextEditor.Hr />
            <RichTextEditor.BulletList />
            <RichTextEditor.OrderedList />
            <RichTextEditor.Subscript />
            <RichTextEditor.Superscript />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Link />
            <RichTextEditor.Unlink />
          </RichTextEditor.ControlsGroup>

          <Button
            disabled={images.length >= limitImages}
            onClick={() => ref.current?.click()}
            leftSection={<IconUpload size={16} />}
            size="xs"
          >
            Upload hình
          </Button>
          <input
            ref={ref}
            onChange={onUploadFile}
            type="file"
            className="hidden"
            accept="image/png, image/jpeg, image/jpg"
          />

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.AlignLeft />
            <RichTextEditor.AlignCenter />
            <RichTextEditor.AlignJustify />
            <RichTextEditor.AlignRight />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Undo />
            <RichTextEditor.Redo />
          </RichTextEditor.ControlsGroup>
        </RichTextEditor.Toolbar>

        <RichTextEditor.Content />
      </RichTextEditor>
      {!!images.length && (
        <div className="flex gap-3 my-2">
          {images.map((image, index) => (
            <div
              key={index}
              className={classNames('relative py-2 px-1 border rounded-xl', {
                hidden: !image,
              })}
            >
              <div className="absolute top-2 right-2">
                <ActionIcon
                  onClick={() =>
                    setImages((prev) => prev.filter((i) => i !== image))
                  }
                  color="gray"
                  radius="xl"
                  variant="filled"
                >
                  <IconX />
                </ActionIcon>
              </div>
              <img alt="photo" src={image} className="w-auto h-full" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TextEditor;
