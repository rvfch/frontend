import { FC } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { TextInput, Label } from 'flowbite-react';
import MDEditor from '@uiw/react-md-editor';
import rehypeSanitize from 'rehype-sanitize';

type FormInputProps = {
  name: string;
  label?: string;
  type: 'text' | 'textarea' | 'email' | 'password';
  placeholder: string;
  className?: string;
};

const FormInput: FC<FormInputProps> = ({
  name,
  label = '',
  type,
  placeholder,
  className = 'mb-4',
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const errorMessage = errors[name]?.message;

  return (
    <div className={className}>
      <Label className='text-gray-600 text-sm font-semibold mb-2' htmlFor={name}>
        {label}
      </Label>
      <Controller
        name={name}
        control={control}
        defaultValue=''
        render={({ field }) =>
          type === 'textarea' ? (
            <MDEditor
              {...field}
              autoFocus
              id={name}
              value={field.value}
              previewOptions={{
                rehypePlugins: [[rehypeSanitize]],
              }}
              onChange={(editorValue) => field.onChange(editorValue || '')}
              onBlur={field.onBlur}
              placeholder={placeholder}
              className='mt-2 mb-2 h-60 bg-white focus:border-blue-500 transition-colors duration-300 ease-in-out w-full outline-none text-gray-800'
            />
          ) : (
            <TextInput
              {...field}
              id={name}
              type={type}
              placeholder={placeholder}
              className='mt-2 mb-2 bg-white focus:border-blue-500 transition-colors duration-300 ease-in-out w-full outline-none text-gray-800'
            />
          )
        }
      />
      {errorMessage && <p className='text-red-500 text-xs italic'>{errorMessage as string}</p>}
    </div>
  );
};

export default FormInput;
