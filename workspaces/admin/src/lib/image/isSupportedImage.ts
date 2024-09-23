import { fileTypeFromBuffer } from 'file-type';

const SUPPORTED_MIME_TYPE_LIST = ['image/bmp', 'image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/jxl'];
const SUPPORTED_EXTENSION_LIST = ['bmp', 'jpeg', 'jpg', 'png', 'webp', 'avif', 'jxl'];

export async function isSupportedImage(image: File): Promise<boolean> {
  // ファイルタイプを取得
  const fileType = await fileTypeFromBuffer(await image.arrayBuffer());

  // MIMEタイプがサポートされているかをチェック
  if (SUPPORTED_MIME_TYPE_LIST.includes(fileType?.mime ?? '')) {
    return true;
  }

  // 拡張子をファイル名から抽出してチェック
  const fileExtension = image.name.split('.').pop()?.toLowerCase();
  if (fileExtension && SUPPORTED_EXTENSION_LIST.includes(fileExtension)) {
    return true;
  }

  return false;
}
