import { useId } from 'react';
import { styled } from 'styled-components';

import { BookListItem } from '../../features/book/components/BookListItem';
import { Box } from '../../foundation/components/Box';
import { Flex } from '../../foundation/components/Flex';
import { Image } from '../../foundation/components/Image';
import { Separator } from '../../foundation/components/Separator';
import { Spacer } from '../../foundation/components/Spacer';
import { Text } from '../../foundation/components/Text';
import { Color, Space, Typography } from '../../foundation/styles/variables';
import { getImageUrl } from '../../lib/image/getImageUrl';

const _HeadingWrapper = styled.section`
  display: grid;
  align-items: start;
  grid-template-columns: auto 1fr;
  padding-bottom: ${Space * 2}px;
  gap: ${Space * 2}px;
`;

const _AuthorImageWrapper = styled.div`
  width: 128px;
  height: 128px;
  > img {
    border-radius: 50%;
  }
`;

export type AuthorDetailPageProp = {
  author: {
    books: {
      description: string;
      id: string;
      image: {
        id: string;
      };
      name: string;
    }[];
    description: string;
    id: string;
    image: {
      id: string;
    };
    name: string;
  };
}

const AuthorDetailPage: React.FC<{
  data: AuthorDetailPageProp;
}> = ({data: {
  author,
}}) => {
  const bookListA11yId = useId();

  if (author == null) {
    return null;
  }

  const imageUrl = getImageUrl({
    format: 'webp',
    height: 128,
    imageId: author.image.id,
    width: 128,
  });

  return (
    <Box height="100%" px={Space * 2}>
      <_HeadingWrapper aria-label="作者情報">
        {imageUrl != null && (
          <_AuthorImageWrapper>
            <Image key={author.id} alt={author.name} height={128} loading='eager' objectFit="cover" src={imageUrl} width={128} />
          </_AuthorImageWrapper>
        )}

        <Flex align="flex-start" direction="column" gap={Space * 1} justify="flex-start">
          <Text color={Color.MONO_100} typography={Typography.NORMAL20} weight="bold">
            {author.name}
          </Text>
          <Text as="p" color={Color.MONO_100} typography={Typography.NORMAL14}>
            {author.description}
          </Text>
        </Flex>
      </_HeadingWrapper>

      <Separator />

      <Box aria-labelledby={bookListA11yId} as="section" maxWidth="100%" py={Space * 2} width="100%">
        <Text as="h2" color={Color.MONO_100} id={bookListA11yId} typography={Typography.NORMAL20} weight="bold">
          作品一覧
        </Text>

        <Spacer height={Space * 2} />

        <Flex align="center" as="ul" direction="column" justify="center">
          {author.books.map((book) => (
            <BookListItem key={book.id} book={book} />
          ))}
          {author.books.length === 0 && (
            <>
              <Spacer height={Space * 2} />
              <Text color={Color.MONO_100} typography={Typography.NORMAL14}>
                この作者の作品はありません
              </Text>
            </>
          )}
        </Flex>
      </Box>
    </Box>
  );
};

export { AuthorDetailPage };
