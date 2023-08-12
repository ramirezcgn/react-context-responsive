Fork of [react-context-responsive](https://github.com/Farfetch/react-context-responsive) with no restrictions of breakpoint names and other changes.

[![license](https://img.shields.io/github/license/ramirezcgn/react-context-responsive)](LICENSE)
![publish](https://github.com/ramirezgn/React-Context-Responsive/workflows/Publish%20react-context-responsive/badge.svg)

# react-context-responsive

A package that provides a responsive context to your application, using React Context API.

It has the same API of [`redux-responsive`](https://github.com/AlecAivazis/redux-responsive) and they are easily interchangeable.

## Installation

```bash
$ yarn add @ramirezcgn/react-context-responsive
$ npm i @ramirezcgn/react-context-responsive
```

...and include it in your project

```js
import { ResponsiveProvider, useResponsive } from '@ramirezcgn/react-context-responsive';
```

## Guidelines

### Provider use

The app, ideally, should have only one `<ResponsiveProvider>`, usually at `app.js`, wrapping all the components.

You can have as many consumers (`useResponsive`, `useIsMobile`, `Responsive`, `withResponsive` and `withIsMobile`) as you need. When the Provider value changes, all the consumers will update.

### Preferred consumers

The hooks (`useResponsive` and `useIsMobile`) are the preferred method of using the context, when possible. 

### Mobile device detection

When possible, use the `withIsMobile` and `useIsMobile` for mobile device's detection. In the future we might use it to automatically splitting of mobile-only code.

## ResponsiveProvider Props
| Prop               | Type | Required | Default | Description |
| ------------------ | ------- | ---------|---------|-------------------------------------------------------------------------------|
| initialMediaType   | string (should match breakpoints or mediaQueries key) | no | 'xs' | Initial media type before the calculation of the real measures |
| defaultOrientation | 'landscape' <br>&#124;&nbsp; 'portrait' | no | null | Initial orientation before the calculation of the real measures |
| children           | node | yes | - | React component |
| breakpoints        | {[key: string]: number } | no | { <br>&nbsp;&nbsp;xs: 0,<br>&nbsp;&nbsp;sm: 576,<br>&nbsp;&nbsp;md: 768,<br>&nbsp;&nbsp;lg: 992,<br>&nbsp;&nbsp;xl: 1200,<br>&nbsp;&nbsp;xxl: 1400<br> } | breakpoints |
| mediaQueries       | {[key: string]: string } | no | - | Represents the screen media queries `(If this is passed, breakpoints and breakpointsMax props are obsolete)` |
| mobileBreakpoint   | string (should match breakpoints or mediaQueries key) | no | 'md' | It's considered mobile until this breakpoint |

## Object returned by the useResponsive / withResponsive / Responsive:

| Key                    | Type | Description |
|------------------------|---------|----------------------------------------------------------------------------------------------|
| mediaType              | string | Current breakpoint name|
| orientation            | string | Current browser orientation |
| isCalculated           | boolean | False on first render. Once true, it means all breakpoints values are based on the window. |
| is                     | {[key: string]: boolean } | Object key breakpoint name and value boolean that shows if width is at a certain breakpoint |
| lessThan               | {[key: string]: boolean } | Object key breakpoint name and value boolean that shows if width is less than a certain breakpoint |
| greaterThan               | {[key: string]: boolean } | Object key breakpoint name and value boolean that shows if width is greater than a certain breakpoint |

## Object returned by the useIsMobile / withIsMobile:

| Key | Type | Description |
|--------------|---------|----------------------------------------------------------------------------------------------|
| isMobile | boolean | If it's below the mobile breakpoint defined by mobileBreakpoint |
| isCalculated | boolean | False on first render. Once true, it means all breakpoints values are based on the window. |
   
## Usage and examples

To use the package, you must embrace your code with the `ResponsiveProvider`, following the guidelines.

The component has five different exported consumption APIs:

- `useResponsive`: A hook which returns the responsive object
- `useIsMobile`: A hook which returns an object with `isMobile` and `isCalculated`
- `Responsive`: A render prop component
- `withResponsive`: A HoC which passes the responsive data to the `responsive` prop
- `withIsMobile`: A HoC which passes `isMobile` and `isCalculated` props only

### How to set up

There are two possible options to configure your responsive provider with `breakpoints` or with `mediaQueries`

Using `breakpoints` and `breakpointsMax`
```js
const breakpoints = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1400,
};

/*
// can be defined also as:
const breakpoints = {
  small: 0,
  middle: 800,
  large: 1200,
};
*/

const App = () => {
    return (
        <ResponsiveProvider breakpoints={breakpoints}>
            <Content />
        </ResponsiveProvider>
    );
};

export default App;
```

Using `mediaQueries`
```js
const mediaQueries = {
  xs: "(min-width: 0) and (max-width: 575px)",
  sm: "(min-width: 576px) and (max-width: 767px)",
  md: "(min-width: 768px) and (max-width: 991px)",
  lg: "(min-width: 992px) and (max-width: 1199px)",
  xl: "(min-width: 1200px) and (max-width: 1399px)",
  xxl: "(min-width: 1400px)"
};

const App = () => {
    return (
        <ResponsiveProvider mediaQueries={mediaQueries}>
            <Content />
        </ResponsiveProvider>
    );
};

export default App;
```

### How to consume the package

#### Rendering components with `useResponsive` hook. (Preferred method)

```js
const Greetings = () => {
    const { lessThan } = useResponsive();
    
    if (lessThan.sm) {
        return (<p>Hello small screen!</p>);
    }
    
    return (<p>Hello medium/big screen!</p>);
};

export default Greetings;
```

#### Rendering components with `useIsMobile` hook. (Preferred method)

```js
const Greetings = () => {
    const { isMobile } = useIsMobile();
    
    if (isMobile) {
        return (<p>Hello mobile!</p>);
    }
    
    return (<p>Hello desktop!</p>);
};

export default Greetings;
```

#### Rendering components with `Responsive` render prop component

```js

class Greetings extends Component {
    render() {
        return (
            <ResponsiveProvider>
                <Content>
                    <Responsive>
                        { (responsive) => ( <Component1 currentBreakpoint={ responsive.mediaType } /> ) }
                    </Responsive>
                    <Responsive>
                        { (responsive) => ( <Component2 orientation={ responsive.orientation } /> ) }
                    </Responsive>
                </Content>
            </ResponsiveProvider>
        )
    }
}

export default Greetings;
```

#### Rendering components with `withResponsive` High-Order component

```js
class Greetings extends Component {
    render() {
        return this.props.responsive.lessThan.sm ? <p>Hello small screen!</p> : <p>Hello big/small screen!</p>
    }
}

export default withResponsive(Greetings);
```

#### Rendering components with `withIsMobile` High-Order component

```js
class Greetings extends Component {
    render() {
        return this.props.isMobile ? <p>Hello mobile!</p> : <p>Hello desktop!</p>
    }
}

export default withIsMobile(Greetings);
```

## React compatibility

React >= `16.8.0` is required to use this package as the `ResponsiveProvider` is hook-based. 

The non-hook APIs just expose the `useResponsive` hook with different APIs, for compatibility with class components.

## Contributing

Read the [Contributing guidelines](./docs/CONTRIBUTING.md)

### Disclaimer

By sending us your contributions, you agree that your contribution is made subject to the terms of our [Contributor Ownership Statement](https://github.com/ramirezcgn/.github/blob/master/COS.md)

## Maintainers

* [dinospereira](https://github.com/dinospereira)
* [SoaresMG](https://github.com/SoaresMG)
* [sofiacteixeira](https://github.com/sofiacteixeira)
* [themariamarques](https://github.com/themariamarques)

## License

[MIT](./LICENSE) 
