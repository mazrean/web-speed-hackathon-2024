const episodeEditMap = new Map<string, Date>();

export const getEpisodeEditDate = (episodeId: string) => {
  return episodeEditMap.get(episodeId);
};

export const setEpisodeEditDate = (episodeId: string, date: Date) => {
  episodeEditMap.set(episodeId, date);
};
