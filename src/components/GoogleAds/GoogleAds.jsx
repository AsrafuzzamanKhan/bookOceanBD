import { useEffect } from 'react';

const GoogleAds = ({ dataAdSlot }) => {

    useEffect(() => {
        try {
            if (window) (window.adsbygoogle = window.adsbygoogle || []).push({});
            setTimeout(function () {
                console.log("This message appears after 2 seconds.");
            }, 2000);
        }
        catch (err) {
            console.log('ads error:', err);
        }

    }, []);


    return (
        <div style={{ overflow: 'hodden', }}>
            <ins className="adsbygoogle"
                style={{ display: 'block', width: '100%', height: "100%" }}
                data-ad-client="ca-pub-6281834095701895"
                data-ad-slot={dataAdSlot}
                data-ad-format="auto"
                data-full-width-responsive="true"
            >
            </ins>
        </div>

    );
};

export default GoogleAds;