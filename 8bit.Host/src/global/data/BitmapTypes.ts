import { data } from './data';

export type BitmapTypes = string & keyof typeof data & 'emptyBitmap';
