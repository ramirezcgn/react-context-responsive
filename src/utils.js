export const getQueriesObjects = (currentBreakpointName, breakpoints) => {
    const currentBreakpoint = breakpoints.find(
        (breakpoint) => breakpoint.mediaType === currentBreakpointName
    );

    const defaultQueryObject = {
        is: {},
        greaterThan: {},
        lessThan: {},
    };

    if (!currentBreakpoint) {
        return defaultQueryObject;
    }

    return breakpoints.reduce((memo, breakpoint) => {
        const breakpointName = breakpoint.mediaType;
        return {
            is: {
                ...memo.is,
                [breakpointName]:
                    breakpointName === currentBreakpoint.mediaType,
            },
            greaterThan: {
                ...memo.greaterThan,
                [breakpointName]:
                    currentBreakpoint.greaterThan.includes(breakpointName),
            },
            lessThan: {
                ...memo.lessThan,
                [breakpointName]:
                    currentBreakpoint.lessThan.includes(breakpointName),
            },
        };
    }, defaultQueryObject);
};

export const getBreakpoints = (mediaQueries, breakpointNames) =>
    breakpointNames.map((breakpointName, index) => ({
        mediaType: breakpointName,
        mediaQuery: mediaQueries[breakpointName],
        greaterThan: breakpointNames.filter(
            (_gtName, gtIndex) => gtIndex < index
        ),
        lessThan: breakpointNames.filter((_ltName, ltIndex) => ltIndex > index),
    }));

export const getMediaQueries = (breakpoints, breakpointNames) =>
    breakpointNames.reduce((acc, breakpointName, index) => {
        const nextBreakpointName = breakpointNames[index + 1];
        return {
            ...acc,
            [breakpointName]: `(min-width: ${breakpoints[breakpointName]}px)${
                nextBreakpointName
                    ? ` and (max-width: ${
                          breakpoints[nextBreakpointName] - 1
                      }px)`
                    : ''
            }`,
        };
    }, {});
