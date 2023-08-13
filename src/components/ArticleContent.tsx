import React from 'react';
import { IArticle } from '../api/interface/article.interface';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const ArticleContent: React.FC<IArticle> = ({ title, user, createdAt, content, imageUrl }) => {
  return (
    <>
      <h1 className='text-4xl font-bold mb-4'>{title}</h1>
      <p className='text-gray-500 mb-4'>
        {user?.name} - {createdAt}
      </p>
      <img className='w-full h-auto mb-4' src={imageUrl || '/images/noimage.png'} alt={title} />
      <article className='mb-4 prose prose-slate'>
        <ReactMarkdown children={content || ''} remarkPlugins={[remarkGfm]}></ReactMarkdown>
      </article>
    </>
  );
};

export default ArticleContent;
