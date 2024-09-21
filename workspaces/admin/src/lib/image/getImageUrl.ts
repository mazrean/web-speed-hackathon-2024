type Params = {
  format: 'avif' | 'webp' | 'png' | 'jpg';
  height?: number;
  imageId: string;
  width?: number;
};

export function getImageUrl({ format, height, imageId, width }: Params): string {
  const searchParams = new URLSearchParams();

  searchParams.set('format', format);
  if (width != null) {
    searchParams.set('width', `${width}`);
  }
  if (height != null) {
    searchParams.set('height', `${height}`);
  }

  return `/images/${imageId}?${searchParams.toString()}`;
}
