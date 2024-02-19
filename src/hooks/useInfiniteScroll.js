import { useEffect, useRef } from 'react';

const useInfiniteScroll = ({ loading, hasNextPage, onLoadMore, threshold = 100 }) => {
  const containerRef = useRef();

  useEffect(() => {
    const handleScroll = () => {
      if (!loading && hasNextPage) {
        const { scrollHeight, scrollTop, clientHeight } = document.documentElement;

        if (scrollHeight - scrollTop <= clientHeight + threshold) {
          onLoadMore();
        }
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [loading, onLoadMore]);

  return containerRef;
};

export default useInfiniteScroll;
