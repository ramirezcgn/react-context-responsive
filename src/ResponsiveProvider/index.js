import { getBreakpoints, getMediaQueries, getQueriesObjects } from '../utils';
import PropTypes from 'prop-types';
import React, { useMemo, useRef } from 'react';
import ResponsiveContext from '../ResponsiveContext';
import useDebugResponsive from './useDebugResponsive';
import useMediaType from './useMediaType';
import useOrientation from './useOrientation';

const ResponsiveProvider = ({
    initialMediaType,
    defaultOrientation,
    children,
    breakpoints,
    mediaQueries,
    mobileBreakpoint,
}) => {
    let breakpointNames;

    if (!mediaQueries) {
        breakpointNames = Object.entries(breakpoints)
            .sort((a, b) => a[1] - b[1])
            .map((x) => x[0]);
        mediaQueries = getMediaQueries(breakpoints, breakpointNames);
    } else {
        breakpointNames = Object.keys(mediaQueries);
    }

    const breakpointsRef = useRef(
        getBreakpoints(mediaQueries, breakpointNames)
    );

    const { currentMediaType, isCalculated } = useMediaType(
        breakpointsRef,
        initialMediaType
    );

    const queriesObjects = useMemo(
        () => getQueriesObjects(currentMediaType, breakpointsRef.current),
        [currentMediaType, breakpointsRef]
    );

    const currentOrientation = useOrientation(defaultOrientation);

    const contextObject = useMemo(
        () => ({
            mediaType: currentMediaType,
            orientation: currentOrientation,
            isCalculated,
            mobileBreakpoint,
            ...queriesObjects,
        }),
        [
            currentMediaType,
            currentOrientation,
            isCalculated,
            mobileBreakpoint,
            queriesObjects,
        ]
    );

    useDebugResponsive(contextObject, currentMediaType);

    return (
        <ResponsiveContext.Provider value={contextObject}>
            {children}
        </ResponsiveContext.Provider>
    );
};

ResponsiveProvider.defaultProps = {
    initialMediaType: 'xs',
    defaultOrientation: null,
    mobileBreakpoint: 'md',
    breakpoints: {
        xs: 0,
        sm: 576,
        md: 768,
        lg: 992,
        xl: 1200,
        xxl: 1400,
    },
};

ResponsiveProvider.propTypes = {
    initialMediaType: PropTypes.string,
    defaultOrientation: PropTypes.oneOf(['landscape', 'portrait']),
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
    ]).isRequired,
    breakpoints: PropTypes.objectOf(PropTypes.number),
    mediaQueries: PropTypes.objectOf(PropTypes.string),
    mobileBreakpoint: PropTypes.string,
};

export default ResponsiveProvider;
