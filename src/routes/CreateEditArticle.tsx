import React, { useEffect, useRef, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useAppDispatch } from '../store';
import { toast } from 'react-toastify';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import FormInput from '../components/core/FormInput';
import { IArticle } from '../api/interface/article.interface';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTenant } from '../hooks/UseTenant.hook';

import { useUploadImage } from '../hooks/UseUploadImage.hook';
import { createArticle, updateArticle } from '../api/article.api';
import { useUser } from '../hooks/UseUser.hook';
import { CreateEditArticleMode } from '../components/core/enums/CreateEditArticleMode.enum';
import { Button } from 'flowbite-react';

interface ArticleFormProps {
  mode: 'create' | 'edit';
  article?: IArticle;
}

const CreateEditArticle: React.FC<ArticleFormProps> = ({ mode }) => {
  const FormSchema = z.object({
    title: z.string().min(5).max(30),
    perex: z.string().min(10).max(255),
    content: z.string().min(20).max(25000),
    imageUrl: z.string().optional(),
  });

  /* Hooks */
  const { state: article } = useLocation();

  const methods = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: article || { status: 'DRAFT' },
  });
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { tenantId } = useTenant();
  const inputFile = useRef<HTMLInputElement | null>(null);
  const { image, handleUpload, clearImage } = useUploadImage();
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const user = useUser();

  useEffect(() => {
    if (mode === CreateEditArticleMode.Edit && article.user?.id !== user?.id) {
      toast.error(`You don't have permission to edit this article.`);
      navigate(`/${tenantId}/`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (mode === CreateEditArticleMode.Edit && article && article.imageUrl) {
      setImageUrl(article.imageUrl);
    }
    if (mode === CreateEditArticleMode.Create) {
      setImageUrl('');
    }
  }, [mode, article]);

  /* Methods */
  const onSubmit = (data: IArticle) => {
    const completeData = { ...article, ...data, imageUrl: image || imageUrl || undefined };
    const action = mode === CreateEditArticleMode.Create ? createArticle : updateArticle;

    dispatch(action(completeData)).then(() => {
      toast.success(
        `Article ${mode === CreateEditArticleMode.Create ? 'created' : 'updated'} successfully!`,
      );
      navigate(`/${tenantId}/myarticles`);
    });
  };

  const handleClearImage = () => {
    setImageUrl('');
    clearImage();
  };

  const handleUploadClick = () => {
    inputFile.current?.click();
  };

  /* Render */
  return (
    <FormProvider {...methods}>
      <div className='container mx-auto p-4'>
        <h1 className='text-4xl font-bold mb-4'>
          {mode === CreateEditArticleMode.Create ? 'Create New Article' : 'Edit Article'}
        </h1>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <FormInput name='title' label='Article Title' type='text' placeholder='Article Title' />
          <FormInput name='perex' label='Article perex' type='text' placeholder='Article perex' />

          <div className='mb-4'>
            <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='image'>
              Featured Image
            </label>
            {image || imageUrl ? (
              <div>
                <img className='mb-4 w-48 h-48' src={image || imageUrl || ''} alt='Featured' />
                <div className='flex gap-x-1'>
                  <Button type='button' onClick={handleClearImage} colorScheme='red'>
                    Delete
                  </Button>
                  <Button type='button' onClick={handleUploadClick} colorScheme='gray'>
                    Upload New
                  </Button>
                </div>
              </div>
            ) : (
              <Button type='button' onClick={handleUploadClick} colorScheme='gray'>
                Upload an Image
              </Button>
            )}
            <input
              type='file'
              id='image'
              onChange={handleUpload}
              className='hidden'
              ref={inputFile}
            />
          </div>

          <FormInput name='content' label='Content' type='textarea' placeholder='Content' />

          <Button type='submit'>
            {mode === CreateEditArticleMode.Create ? 'Create Article' : 'Save Changes'}
          </Button>
        </form>
      </div>
    </FormProvider>
  );
};

export default CreateEditArticle;
