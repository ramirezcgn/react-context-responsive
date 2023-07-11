import { useEffect, useState } from 'react';

const useMediaType = (breakpointsRef, initialMediaType) => {
    const [isCalculated, setIsCalculated] = useState(false);
    const [currentMediaType, setCurrentMediaType] = useState(initialMediaType);

    useEffect(() => {
        const breakpoints = breakpointsRef.current;
        const localMediaQueries = breakpoints.map(
            (breakpoint) => breakpoint.mediaQuery
        );
        const mediaQueryListsAndListeners = localMediaQueries.map(
            (mediaQuery, index) => {
                const mediaQueryList = window.matchMedia(mediaQuery);

                if (mediaQueryList.matches) {
                    setCurrentMediaType(breakpoints[index].mediaType);
                    setIsCalculated(true);
                }

                const listener = (event) => {
                    event.matches &&
                        setCurrentMediaType(breakpoints[index].mediaType);
                };

                try {
                    mediaQueryList.addEventListener('change', listener);
                } catch (_) {
                    mediaQueryList.addListener(listener);
                }

                return [mediaQueryList, listener];
            }
        );

        return () => {
            mediaQueryListsAndListeners.forEach(
                ([mediaQueryList, listener]) => {
                    try {
                        mediaQueryList.removeEventListener('change', listener);
                    } catch (_) {
                        mediaQueryList.removeListener(listener);
                    }
                }
            );
        };
    }, [breakpointsRef]);

    return { isCalculated, currentMediaType };
};

export default useMediaType;
