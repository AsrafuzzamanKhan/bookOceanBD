import Swal from 'sweetalert2';

// Single source of truth for every SweetAlert2-based notification in the
// app - both the auto-dismissing toasts below and the confirm-style dialogs
// (delete/cancel/login prompts) further down. Previously every call site
// built its own ad-hoc Swal.fire({...}) config with SweetAlert2's stock
// look (generic blue/red buttons, default modal chrome, no brand styling),
// which read as an out-of-place browser-native popup dropped into an
// otherwise designed page. Centralizing it here means every toast and every
// confirm dialog in the app looks and behaves the same way - see the
// .boc-toast / .boc-confirm rules in index.css for the actual styling.
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

// Confirm-style dialogs: "delete this?", "cancel this order?", "please log
// in first". buttonsStyling: false hands the buttons over entirely to our
// own .boc-btn classes below instead of fighting Swal's inline default
// styles; reverseButtons puts the confirm action on the right and cancel on
// the left, matching how the rest of the app orders primary/secondary
// actions. customClass is set once, here, rather than in this mixin -
// Swal.mixin + .fire() shallow-merge their options, so a customClass passed
// to .fire() would silently replace (not merge with) one set on the mixin.
const confirmMixin = Swal.mixin({
    icon: 'warning',
    showCancelButton: true,
    buttonsStyling: false,
    reverseButtons: true,
});

/**
 * @param {object} opts
 * @param {string} opts.title
 * @param {string} [opts.text]
 * @param {string} [opts.confirmText] - defaults to "Yes"
 * @param {string} [opts.cancelText] - defaults to "Cancel"
 * @param {boolean} [opts.danger] - true for destructive actions (delete,
 *   cancel order) - red confirm button instead of the brand blue used for
 *   everything else (e.g. "please log in first")
 * @returns {Promise<boolean>} whether the user confirmed
 */
export const showConfirm = ({ title, text, confirmText = 'Yes', cancelText = 'Cancel', danger = false }) =>
    confirmMixin.fire({
        title,
        text,
        confirmButtonText: confirmText,
        cancelButtonText: cancelText,
        customClass: {
            popup: 'boc-confirm',
            title: 'boc-confirm-title',
            htmlContainer: 'boc-confirm-text',
            actions: 'boc-confirm-actions',
            confirmButton: `boc-btn ${danger ? 'boc-btn-danger' : 'boc-btn-primary'}`,
            cancelButton: 'boc-btn boc-btn-cancel',
        },
    }).then((result) => result.isConfirmed);

export default toastMixin;
