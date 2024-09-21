type Params = {
  query: string;
  target: string;
};

const intl = new Intl.Collator('ja', { sensitivity: 'base' });

// ひらがな・カタカナ・半角・全角を区別せずに文字列が含まれているかを調べる
export function isContains({ query, target }: Params): boolean {
  for (let offset = 0; offset <= target.length - query.length; offset++) {
    const substring = target.slice(offset, offset + query.length);
    if (intl.compare(query, substring) === 0) {
      return true;
    }
  }
  return false;
}
