import React from 'react';
import RelatedArticle from './RelatedArticle';
import { ArticleProps } from './props/ArticleProps';

interface RelatedArticlesProps {
  articles: ArticleProps[];
}

const RelatedArticles: React.FC<RelatedArticlesProps> = ({ articles }) => {
  return (
    <>
      <h2 className='text-2xl font-bold mb-4'>Related Articles</h2>
      {articles.map((article) => (
        <RelatedArticle key={article.id} article={article} />
      ))}
    </>
  );
};

export default RelatedArticles;
