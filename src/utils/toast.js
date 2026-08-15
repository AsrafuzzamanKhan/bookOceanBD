import Swal from 'sweetalert2';

// Single source of truth for every "toast" style notification in the app
// (auto-dismissing, top-right, no confirm button needed).
//
// Previously every call site built its own ad-hoc Swal.fire({...}) config,
// none of them set `toast: true` (so each one rendered as a full modal with
// a page-dimming backdrop, just positioned in a corner), and several were
// missing `position` entirely and popped up dead-center instead. This mixin
// fixes that and gives every toast in the app the same look.
const toastMixin = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 2500,
    timerProgressBar: true,
    customClass: {
        popup: 'boc-toast',
    },
    didOpen: (el) => {
        el.addEventListener('mouseenter', Swal.stopTimer);
        el.addEventListener('mouseleave', Swal.resumeTimer);
    },
});

/**
 * @param {'success'|'error'|'warning'|'info'} icon
 * @param {string} title
 * @param {string} [text]
 */
export const showToast = (icon, title, text) => toastMixin.fire({ icon, title, text });

export const showSuccessToast = (title, text) => showToast('success', title, text);
export const showErrorToast = (title, text) => showToast('error', title, text);
export const showWarningToast = (title, text) => showToast('warning', title, text);
export const showInfoToast = (title, text) => showToast('info', title, text);

export default toastMixin;
