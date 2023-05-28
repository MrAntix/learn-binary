import { BitmapInfo } from './BitmapInfo';
import { BitmapTypes } from './BitmapTypes';

export type BitmapData = {
    [key in BitmapTypes]: BitmapInfo;
};
