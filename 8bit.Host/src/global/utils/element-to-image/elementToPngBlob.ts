import { IElementToPngBlobOptions } from './IElementToPngBlobOptions';
import { dataUrlToImage } from './dataUrlToImage';
import { elementToDataUrl } from './elementToDataUrl';

export const elementToPngBlob
    : (element: HTMLElement, options?: Partial<IElementToPngBlobOptions>) => Promise<Blob>
    = async (element, options) => {

        options = {
            ...options
        };

        let width: number, height: number;
        let dataUrl: string;

        try {

            element.classList.add('sharing');

            width = options.width ?? element.offsetWidth;
            height = options.height ?? element.offsetHeight;

            dataUrl = elementToDataUrl(element, width, outerHeight);
        } finally {
            element.classList.remove('sharing');
        }

        const image = await dataUrlToImage(dataUrl);

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const context = canvas.getContext('2d');
        if (context == null) throw 'cannot get canvas context';

        context.drawImage(image, 0, 0);

        return new Promise(resolve => canvas.toBlob(blob => resolve(blob!)));

    };
