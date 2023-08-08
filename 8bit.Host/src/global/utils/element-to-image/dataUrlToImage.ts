
export const dataUrlToImage: (dataUrl: string) => Promise<HTMLImageElement> = dataUrl => new Promise(function (resolve, reject) {
    const image = new Image();
    image.onload = function () {
        resolve(image);
    };
    image.onerror = reject;
    image.src = dataUrl;

    return image;
});
