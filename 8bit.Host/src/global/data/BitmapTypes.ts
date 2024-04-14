import { data } from './data';

export const bitmapTypesNames = ['emptyBitmap', ...Object.keys(data)] as const;
export type BitmapTypes = typeof bitmapTypesNames[number];