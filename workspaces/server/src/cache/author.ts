const authorEditMap = new Map<string, Date>();

export const getAuthorEditDate = (authorId: string) => {
  return authorEditMap.get(authorId);
};

export const setAuthorEditDate = (authorId: string, date: Date) => {
  authorEditMap.set(authorId, date);
};
