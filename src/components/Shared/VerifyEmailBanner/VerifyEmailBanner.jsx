import { useState } from 'react';
import useAuth from '../../../hooks/useAuth';
import { showSuccessToast, showErrorToast, showWarningToast } from '../../../utils/toast';

// Shown whenever a logged-in user hasn't verified their email yet. Google
// sign-in accounts already come with emailVerified: true (Google verified it
// for us as part of OAuth), so this only ever appears for email/password
// signups that haven't clicked the link yet.
const VerifyEmailBanner = () => {
    const { user, sendVerificationEmail, refreshUser } = useAuth();
    const [sending, setSending] = useState(false);
    const [checking, setChecking] = useState(false);

    if (!user || user.emailVerified) return null;

    const handleResend = () => {
        setSending(true);
        sendVerificationEmail(user.email)
            .then(() => showSuccessToast('Verification email sent', `Check ${user.email} for the link.`))
            .catch(() => showErrorToast('Could not send verification email', 'Please try again in a moment.'))
            .finally(() => setSending(false));
    };

    const handleCheck = async () => {
        setChecking(true);
        try {
            const refreshed = await refreshUser();
            if (refreshed.emailVerified) {
                showSuccessToast('Email verified!', 'Thanks for confirming your account.');
            } else {
                showWarningToast('Still not verified', 'Click the link in the email first, then try again.');
            }
        } finally {
            setChecking(false);
        }
    };

    // fixed to the bottom of the viewport (not the top) so it can't collide
    // with Header's own fixed positioning + the per-page pt-* values every
    // page already calibrates against Header's height
    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200 text-sm py-2 px-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-center shadow-[0_-2px_8px_rgba(0,0,0,0.08)]">
            <span>⚠️ Please verify your email ({user.email}) to confirm it&apos;s really you.</span>
            <button onClick={handleResend} disabled={sending} className="underline font-semibold whitespace-nowrap disabled:opacity-50">
                {sending ? 'Sending...' : 'Resend email'}
            </button>
            <button onClick={handleCheck} disabled={checking} className="underline font-semibold whitespace-nowrap disabled:opacity-50">
                {checking ? 'Checking...' : "I've verified"}
            </button>
        </div>
    );
};

export default VerifyEmailBanner;
