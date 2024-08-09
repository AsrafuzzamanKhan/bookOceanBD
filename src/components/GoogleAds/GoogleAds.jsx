import { useEffect } from 'react';

const GoogleAds = (props) => {
    const { dataAdSlot } = props;

    useEffect(() => {
        try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        }
        catch (err) {
            console.log(err);
        }

    }, []);


    return (
        <>
            <ins className="adsbygoogle"
                style={{ display: 'block', width: '100%', height: '100%' }}
                data-ad-client="ca-pub-6281834095701895"
                data-ad-slot={dataAdSlot}
                data-ad-format="auto"
                data-full-width-responsive="true"></ins>
        </>
    );
};

export default GoogleAds;