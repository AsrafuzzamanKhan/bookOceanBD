import { useEffect } from "react"

const usePageSEO = ({
    title,
    description,
    keywords = [],
    ogTitle,
    ogDescription,
    ogImage,
    ogUrl

}) => {
    useEffect(() => {
        document.title = title
        setMetatag('name', 'description', description)
        setMetatag('name', 'keywords', keywords)
        setMetatag('property', 'og:title', ogTitle || title)
        setMetatag('property', 'og:description', ogDescription || description)
        setMetatag('property', 'og:image', ogImage)
        setMetatag('property', 'og:url', ogUrl || window.location.href)
        return () => {
            // do any kind of clean up 
        }
    }, [title,
        description,
        keywords,
        ogTitle,
        ogDescription,
        ogImage,
        ogUrl])

    const setMetatag = (attr, key, content) => {
        if (content) {
            let element = document.querySelector(`meta[${attr}="${key}"]`)
            if (!element) {
                element = document.createElement('meta')
                element.setAttribute(attr, key)
                document.head.appendChild(element)
            }
            element.setAttribute('conten', content)
        }
    }


}

export default usePageSEO