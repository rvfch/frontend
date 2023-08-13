import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';
import FormInput from './core/FormInput';
import { gql, useMutation } from '@apollo/client';
import { IArticle } from '../api/interface/article.interface';
import { useUser } from '../hooks/UseUser.hook';
import { toast } from 'react-toastify';
import { Button } from 'flowbite-react';

const FormSchema = z
  .object({
    text: z.string().min(1),
  })
  .required();

type FormInputType = z.infer<typeof FormSchema>;

const SEND_COMMENT = gql`
  mutation ($dto: CreateCommentDto!) {
    createComment(dto: $dto) {
      id
      articleId
      text
      ratingScore
      parentId
    }
  }
`;

interface SendCommentProps extends IArticle {
  parentId?: string;
  replyUsername?: string;
  onSuccess?: () => void;
}

const SendComment: React.FC<SendCommentProps> = ({
  id,
  parentId,
  onSuccess,
  replyUsername = null,
}) => {
  const methods = useForm<FormInputType>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      text: replyUsername ? `@${replyUsername} ` : '',
    },
  });

  const [sendComment] = useMutation(SEND_COMMENT);
  const user = useUser();

  const onSubmit = (formData: { text: string }) => {
    // send comment
    sendComment({
      variables: {
        dto: {
          text: formData.text,
          articleId: id,
          userId: user?.id,
          parentId,
        },
      },
    })
      .then(() => {
        if (onSuccess) {
          onSuccess();
        }
        methods.reset();
        toast.success('Comment sent successfully');
      })
      .catch((error) => {
        toast.error(error as string);
      });
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className='flex items-center gap-3 w-full'>
        <img
          className='w-8 h-8 mr-2 rounded-full'
          src='https://via.placeholder.com/150'
          alt='Avatar'
        />
        <FormInput
          className='flex-1'
          type='text'
          placeholder='Join the discussion'
          name={'text'}
          label={''}
        />
        <Button
          type='submit'
          className='bg-blue-500 text-white hover:bg-blue-700 transition-colors duration-300 rounded-md h-10'
        >
          Send
        </Button>
      </form>
    </FormProvider>
  );
};

export default SendComment;
