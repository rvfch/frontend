import TLink from './core/TenantLink';
import { IArticle } from '../api/interface/article.interface';

export const Article: React.FC<IArticle> = (article: IArticle) => {
  // const dispatch = useAppDispatch();

  // const handleArticleDetail = (): void => {
  //   dispatch(SELECT_ARTICLE(article));
  // };

  return (
    <div className='flex mb-5'>
      <img
        className='w-48 mr-5'
        src={article.imageUrl || '/images/noimage.png'}
        alt={article.title}
      />
      <div>
        <h2 className='font-bold'>{article.title}</h2>
        <p className='text-gray-500 text-sm'>
          {article.user?.name} - {article.createdAt}
        </p>
        <p className='text-black text-sm'>{article.perex}</p>
        <TLink state={article} className='text-blue-500 text-sm' to={`articles/${article.id}`}>
          Read more
        </TLink>
        <p className='text-gray-500 text-sm'>{article.commentsCount} comments</p>
      </div>
    </div>
  );
};

export default Article;
