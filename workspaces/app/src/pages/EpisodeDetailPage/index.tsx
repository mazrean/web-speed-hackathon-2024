import { EpisodeListItem } from '../../features/episode/components/EpisodeListItem';
import { Box } from '../../foundation/components/Box';
import { Flex } from '../../foundation/components/Flex';
import { Separator } from '../../foundation/components/Separator';
import { Space } from '../../foundation/styles/variables';

import { ComicViewer } from './internal/ComicViewer';

export type EpisodeDetailPageProp = {
  bookId: string;
  episode: {
    id: string;
  };
  episodes: {
    chapter: number;
    description: string;
    id: string;
    image: {
      id: string;
    };
    name: string;
  }[];
};

const EpisodeDetailPage: React.FC<EpisodeDetailPageProp> = ({bookId, episode, episodes}) => {
  return (
    <Box>
      <section aria-label="漫画ビューアー">
        <ComicViewer episodeId={episode.id} />
      </section>

      <Separator />

      <Box aria-label="エピソード一覧" as="section" px={Space * 2}>
        <Flex align="center" as="ul" direction="column" justify="center">
          {episodes.map((episode) => (
            <EpisodeListItem key={episode.id} bookId={bookId} episode={episode} />
          ))}
        </Flex>
      </Box>
    </Box>
  );
};

export { EpisodeDetailPage };
