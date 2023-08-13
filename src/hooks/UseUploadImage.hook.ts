import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { upload } from '../api/files.api';
import { FILE_CLEAR } from '../store/features/files.slice';

export const useUploadImage = () => {
  const dispatch = useAppDispatch();
  const { url } = useAppSelector((state) => state.files);
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    if (url) {
      setImage(url);
    }
  }, [url]);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      dispatch(upload(formData));
    }
  };

  const clearImage = () => {
    dispatch(FILE_CLEAR());
    setImage(null);
  };

  return { image, handleUpload, clearImage };
};
