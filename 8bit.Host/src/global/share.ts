import { toBlob } from 'html-to-image';

export const share: (
    text: string,
    element: HTMLElement
) => Promise<void>
    = async (text, element) => {

        element.classList.add('sharing');

        try {

            await toBlob(element);
            await toBlob(element);
            await toBlob(element);

            const blob = await toBlob(element, {
                backgroundColor: 'var(--background-color)',
                type: 'image/png'
            });

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

        } finally {

            element.classList.remove('sharing');
        }
    };