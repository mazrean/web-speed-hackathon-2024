const bookEditMap = new Map<string, Date>();

export const getBookEditDate = (bookId: string) => {
  return bookEditMap.get(bookId);
};

export const setBookEditDate = (bookId: string, date: Date) => {
  bookEditMap.set(bookId, date);
};
