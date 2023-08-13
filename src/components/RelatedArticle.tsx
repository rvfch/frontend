import React from 'react';
import { Link } from 'react-router-dom';
import { ArticleProps } from './props/ArticleProps';

interface RelatedArticleComponentProps {
  article: ArticleProps;
}

const RelatedArticle: React.FC<RelatedArticleComponentProps> = ({ article }) => {
  return (
    <div className='mb-4 hover:bg-gray-100'>
      <Link className='text-xl font-bold block' to={`/articles/${article.id}`}>
        {article.title}
      </Link>
      <p>{article.perex}...</p>
    </div>
  );
};

export default RelatedArticle;
