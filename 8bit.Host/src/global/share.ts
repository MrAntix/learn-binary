import { elementToPngBlob } from './utils';

export const share: (
    text: string,
    element: HTMLElement
) => Promise<void>
    = async (text, element) => {
        if (!(element instanceof HTMLElement))
            throw new Error('element must be an HTMLElement');

        try {

            const blob = await elementToPngBlob(
                element
            );

            const filesArray = [
                new File(
                    [blob],
                    'image.png',
                    {
                        type: 'image/png',
                        lastModified: new Date().getTime()
                    }
                )
            ];

            const shareData = {
                files: filesArray,
                text,
                url: 'https://8bit.antix.co.uk'
            };

            navigator.share(shareData);

        } catch (error) {

            console.error('oops, something went wrong!', error);
        }
    };