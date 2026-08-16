// Shared helpers for client-side image resizing + upload (used by
// AddBooks.jsx, UpdateBook.jsx, AddBanner.jsx). Resizing before upload keeps
// file sizes small so cards/banners load fast instead of shipping whatever
// resolution/format happened to come off the admin's phone or camera.
//
// Previously uploaded to imgbb (this file used to be utils/imgbb.js) -
// switched to Cloudinary because imgbb's free-tier upload API kept hitting
// "Rate limit reached" errors, including on single ad-hoc uploads from the
// dashboard, not just bulk scripts. Cloudinary's free tier (25 flexible
// credits/month, covering storage + bandwidth + transformations) doesn't
// have that same aggressive per-request throttling.
//
// Uses an UNSIGNED upload preset, so - same as imgbb before it - only a
// public identifier (cloud name + preset name) lives in the client, never a
// secret key. Existing imgbb-hosted images are untouched; this only changes
// where *new* uploads go.

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

// Resizes an image file proportionally (no cropping) to at most
// `maxDimension` on its longest side, encoded as JPEG.
// NOTE: don't substitute a host's own auto-generated square-crop thumbnail
// for this - imgbb's `data.thumb.url` was a hard center-crop that chopped
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

// Uploads a File/Blob to Cloudinary via the unsigned preset. Normalizes the
// response into imgbb's old { success, data: { display_url } } shape so
// call sites barely had to change when this switched over from imgbb.
export const uploadToCloudinary = async (fileOrBlob) => {
    const formData = new FormData();
    formData.append('file', fileOrBlob);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    try {
        const res = await fetch(CLOUDINARY_UPLOAD_URL, { method: 'POST', body: formData });
        const json = await res.json();
        if (!res.ok || json.error) {
            return { success: false, error: json.error || { message: `Upload failed (HTTP ${res.status})` } };
        }
        return { success: true, data: { display_url: json.secure_url, url: json.secure_url } };
    } catch (err) {
        return { success: false, error: { message: err.message } };
    }
};
