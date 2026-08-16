// Shared helpers for uploading images to imgbb (used by AddBooks.jsx and
// AddBanner.jsx). Resizing client-side before upload keeps file sizes small
// so cards/banners load fast instead of shipping whatever resolution/format
// happened to come off the admin's phone or camera.

const IMG_HOSTING_TOKEN = import.meta.env.VITE_image_Upload_token;
const IMG_HOSTING_URL = `https://api.imgbb.com/1/upload?key=${IMG_HOSTING_TOKEN}`;

// Resizes an image file proportionally (no cropping) to at most
// `maxDimension` on its longest side, encoded as JPEG.
// NOTE: don't substitute imgbb's own `data.thumb.url` from the upload
// response for this - that variant is a hard square center-crop that chops
// off the top/bottom of covers/banners (learned this the hard way once
// already on book cover thumbnails).
export const resizeImageFile = (file, maxDimension = 400) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = reject;
        reader.onload = (event) => {
            const img = new Image();
            img.onerror = reject;
            img.onload = () => {
                let { width, height } = img;
                if (width > height && width > maxDimension) {
                    height = Math.round(height * (maxDimension / width));
                    width = maxDimension;
                } else if (height > maxDimension) {
                    width = Math.round(width * (maxDimension / height));
                    height = maxDimension;
                }
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                canvas.getContext('2d').drawImage(img, 0, 0, width, height);
                canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.85);
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    });

export const uploadToImgbb = (fileOrBlob) => {
    const formData = new FormData();
    formData.append('image', fileOrBlob);
    return fetch(IMG_HOSTING_URL, { method: 'POST', body: formData }).then((res) => res.json());
};
