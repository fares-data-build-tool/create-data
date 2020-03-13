module.exports = /******/ (function(modules) {
    // webpackBootstrap
    /******/ // The module cache
    /******/ var installedModules = {}; // The require function
    /******/
    /******/ /******/ function __webpack_require__(moduleId) {
        /******/
        /******/ // Check if module is in cache
        /******/ if (installedModules[moduleId]) {
            /******/ return installedModules[moduleId].exports;
            /******/
        } // Create a new module (and put it into the cache)
        /******/ /******/ var module = (installedModules[moduleId] = {
            /******/ i: moduleId,
            /******/ l: false,
            /******/ exports: {},
            /******/
        }); // Execute the module function
        /******/
        /******/ /******/ var threw = true;
        /******/ try {
            /******/ modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
            /******/ threw = false;
            /******/
        } finally {
            /******/ if (threw) delete installedModules[moduleId];
            /******/
        } // Flag the module as loaded
        /******/
        /******/ /******/ module.l = true; // Return the exports of the module
        /******/
        /******/ /******/ return module.exports;
        /******/
    } // expose the modules object (__webpack_modules__)
    /******/
    /******/
    /******/ /******/ __webpack_require__.m = modules; // expose the module cache
    /******/
    /******/ /******/ __webpack_require__.c = installedModules; // define getter function for harmony exports
    /******/
    /******/ /******/ __webpack_require__.d = function(exports, name, getter) {
        /******/ if (!__webpack_require__.o(exports, name)) {
            /******/ Object.defineProperty(exports, name, { enumerable: true, get: getter });
            /******/
        }
        /******/
    }; // define __esModule on exports
    /******/
    /******/ /******/ __webpack_require__.r = function(exports) {
        /******/ if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
            /******/ Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
            /******/
        }
        /******/ Object.defineProperty(exports, '__esModule', { value: true });
        /******/
    }; // create a fake namespace object // mode & 1: value is a module id, require it // mode & 2: merge all properties of value into the ns // mode & 4: return value when already ns object // mode & 8|1: behave like require
    /******/
    /******/ /******/ /******/ /******/ /******/ /******/ __webpack_require__.t = function(value, mode) {
        /******/ if (mode & 1) value = __webpack_require__(value);
        /******/ if (mode & 8) return value;
        /******/ if (mode & 4 && typeof value === 'object' && value && value.__esModule) return value;
        /******/ var ns = Object.create(null);
        /******/ __webpack_require__.r(ns);
        /******/ Object.defineProperty(ns, 'default', { enumerable: true, value: value });
        /******/ if (mode & 2 && typeof value != 'string')
            for (var key in value)
                __webpack_require__.d(
                    ns,
                    key,
                    function(key) {
                        return value[key];
                    }.bind(null, key),
                );
        /******/ return ns;
        /******/
    }; // getDefaultExport function for compatibility with non-harmony modules
    /******/
    /******/ /******/ __webpack_require__.n = function(module) {
        /******/ var getter =
            module && module.__esModule
                ? /******/ function getDefault() {
                      return module['default'];
                  }
                : /******/ function getModuleExports() {
                      return module;
                  };
        /******/ __webpack_require__.d(getter, 'a', getter);
        /******/ return getter;
        /******/
    }; // Object.prototype.hasOwnProperty.call
    /******/
    /******/ /******/ __webpack_require__.o = function(object, property) {
        return Object.prototype.hasOwnProperty.call(object, property);
    }; // __webpack_public_path__
    /******/
    /******/ /******/ __webpack_require__.p = ''; // Load entry module and return exports
    /******/
    /******/
    /******/ /******/ return __webpack_require__((__webpack_require__.s = 'SUjs'));
    /******/
})(
    /************************************************************************/
    /******/ {
        /***/ '/0+H': /***/ function(module, exports, __webpack_require__) {
            'use strict';

            var __importDefault =
                (this && this.__importDefault) ||
                function(mod) {
                    return mod && mod.__esModule
                        ? mod
                        : {
                              default: mod,
                          };
                };

            Object.defineProperty(exports, '__esModule', {
                value: true,
            });

            const react_1 = __importDefault(__webpack_require__('q1tI'));

            const amp_context_1 = __webpack_require__('lwAK');

            function isInAmpMode({ ampFirst = false, hybrid = false, hasQuery = false } = {}) {
                return ampFirst || (hybrid && hasQuery);
            }

            exports.isInAmpMode = isInAmpMode;

            function useAmp() {
                // Don't assign the context value to a variable to save bytes
                return isInAmpMode(react_1.default.useContext(amp_context_1.AmpStateContext));
            }

            exports.useAmp = useAmp;

            /***/
        },

        /***/ '/bjS': /***/ function(module, exports, __webpack_require__) {
            'use strict';

            var __importDefault =
                (this && this.__importDefault) ||
                function(mod) {
                    return mod && mod.__esModule ? mod : { default: mod };
                };
            var __importStar =
                (this && this.__importStar) ||
                function(mod) {
                    if (mod && mod.__esModule) return mod;
                    var result = {};
                    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
                    result['default'] = mod;
                    return result;
                };
            Object.defineProperty(exports, '__esModule', { value: true });
            const react_1 = __importDefault(__webpack_require__('q1tI'));
            const server_1 = __webpack_require__('Fw1r');
            const mitt_1 = __importDefault(__webpack_require__('dZ6Y'));
            const utils_1 = __webpack_require__('g/15');
            const head_1 = __importStar(__webpack_require__('8Kt/'));
            // @ts-ignore types will be added later as it's an internal module
            const loadable_1 = __importDefault(__webpack_require__('2qu3'));
            const loadable_context_1 = __webpack_require__('jwwS');
            const router_context_1 = __webpack_require__('qOIg');
            const get_page_files_1 = __webpack_require__('teXF');
            const amp_context_1 = __webpack_require__('lwAK');
            const optimize_amp_1 = __importDefault(__webpack_require__('OaTm'));
            const amp_1 = __webpack_require__('/0+H');
            const is_dynamic_1 = __webpack_require__('/jkW');
            const constants_1 = __webpack_require__('dmkc');
            const constants_2 = __webpack_require__('w7wo');
            function noRouter() {
                const message =
                    'No router instance found. you should only use "next/router" inside the client side of your app. https://err.sh/zeit/next.js/no-router-instance';
                throw new Error(message);
            }
            class ServerRouter {
                constructor(pathname, query, as) {
                    this.route = pathname.replace(/\/$/, '') || '/';
                    this.pathname = pathname;
                    this.query = query;
                    this.asPath = as;
                }
                push() {
                    noRouter();
                }
                replace() {
                    noRouter();
                }
                reload() {
                    noRouter();
                }
                back() {
                    noRouter();
                }
                prefetch() {
                    noRouter();
                }
                beforePopState() {
                    noRouter();
                }
            }
            // TODO: Remove in the next major version, as this would mean the user is adding event listeners in server-side `render` method
            ServerRouter.events = mitt_1.default();
            function enhanceComponents(options, App, Component) {
                // For backwards compatibility
                if (typeof options === 'function') {
                    return {
                        App,
                        Component: options(Component),
                    };
                }
                return {
                    App: options.enhanceApp ? options.enhanceApp(App) : App,
                    Component: options.enhanceComponent ? options.enhanceComponent(Component) : Component,
                };
            }
            function render(renderElementToString, element, ampMode) {
                let html;
                let head;
                try {
                    html = renderElementToString(element);
                } finally {
                    head = head_1.default.rewind() || head_1.defaultHead(amp_1.isInAmpMode(ampMode));
                }
                return { html, head };
            }
            function renderDocument(
                Document,
                {
                    props,
                    docProps,
                    pathname,
                    query,
                    buildId,
                    canonicalBase,
                    assetPrefix,
                    runtimeConfig,
                    nextExport,
                    autoExport,
                    dynamicImportsIds,
                    dangerousAsPath,
                    hasCssMode,
                    err,
                    dev,
                    ampPath,
                    ampState,
                    inAmpMode,
                    hybridAmp,
                    staticMarkup,
                    devFiles,
                    files,
                    polyfillFiles,
                    dynamicImports,
                    htmlProps,
                    bodyTags,
                    headTags,
                },
            ) {
                return (
                    '<!DOCTYPE html>' +
                    server_1.renderToStaticMarkup(
                        react_1.default.createElement(
                            amp_context_1.AmpStateContext.Provider,
                            { value: ampState },
                            Document.renderDocument(
                                Document,
                                Object.assign(
                                    {
                                        __NEXT_DATA__: {
                                            props,
                                            page: pathname,
                                            query,
                                            buildId,
                                            assetPrefix: assetPrefix === '' ? undefined : assetPrefix,
                                            runtimeConfig,
                                            nextExport,
                                            autoExport,
                                            dynamicIds: dynamicImportsIds.length === 0 ? undefined : dynamicImportsIds,
                                            err: err ? serializeError(dev, err) : undefined,
                                        },
                                        dangerousAsPath,
                                        canonicalBase,
                                        ampPath,
                                        inAmpMode,
                                        isDevelopment: !!dev,
                                        hasCssMode,
                                        hybridAmp,
                                        staticMarkup,
                                        devFiles,
                                        files,
                                        polyfillFiles,
                                        dynamicImports,
                                        assetPrefix,
                                        htmlProps,
                                        bodyTags,
                                        headTags,
                                    },
                                    docProps,
                                ),
                            ),
                        ),
                    )
                );
            }
            async function renderToHTML(req, res, pathname, query, renderOpts) {
                pathname = pathname === '/index' ? '/' : pathname;
                const {
                    err,
                    dev = false,
                    documentMiddlewareEnabled = false,
                    staticMarkup = false,
                    ampPath = '',
                    App,
                    Document,
                    pageConfig = {},
                    DocumentMiddleware,
                    Component,
                    buildManifest,
                    reactLoadableManifest,
                    ErrorDebug,
                    unstable_getStaticProps,
                    unstable_getStaticPaths,
                } = renderOpts;
                const callMiddleware = async (method, args, props = false) => {
                    let results = props ? {} : [];
                    if (Document[`${method}Middleware`]) {
                        let middlewareFunc = await Document[`${method}Middleware`];
                        middlewareFunc = middlewareFunc.default || middlewareFunc;
                        const curResults = await middlewareFunc(...args);
                        if (props) {
                            for (const result of curResults) {
                                results = Object.assign(Object.assign({}, results), result);
                            }
                        } else {
                            results = curResults;
                        }
                    }
                    return results;
                };
                const headTags = (...args) => callMiddleware('headTags', args);
                const bodyTags = (...args) => callMiddleware('bodyTags', args);
                const htmlProps = (...args) => callMiddleware('htmlProps', args, true);
                const isSpr = !!unstable_getStaticProps;
                const defaultAppGetInitialProps = App.getInitialProps === App.origGetInitialProps;
                const hasPageGetInitialProps = !!Component.getInitialProps;
                const isAutoExport = !hasPageGetInitialProps && defaultAppGetInitialProps && !isSpr;
                if (false) {
                }
                if (hasPageGetInitialProps && isSpr) {
                    throw new Error(constants_1.SSG_GET_INITIAL_PROPS_CONFLICT + ` ${pathname}`);
                }
                if (!!unstable_getStaticPaths && !isSpr) {
                    throw new Error(
                        `unstable_getStaticPaths was added without a unstable_getStaticProps in ${pathname}. Without unstable_getStaticProps, unstable_getStaticPaths does nothing`,
                    );
                }
                if (dev) {
                    const { isValidElementType } = __webpack_require__(
                        !(function webpackMissingModule() {
                            var e = new Error("Cannot find module 'react-is'");
                            e.code = 'MODULE_NOT_FOUND';
                            throw e;
                        })(),
                    );
                    if (!isValidElementType(Component)) {
                        throw new Error(`The default export is not a React Component in page: "${pathname}"`);
                    }
                    if (!isValidElementType(App)) {
                        throw new Error(`The default export is not a React Component in page: "/_app"`);
                    }
                    if (!isValidElementType(Document)) {
                        throw new Error(`The default export is not a React Component in page: "/_document"`);
                    }
                    if (isAutoExport) {
                        // remove query values except ones that will be set during export
                        query = {
                            amp: query.amp,
                        };
                        req.url = pathname;
                        renderOpts.nextExport = true;
                    }
                }
                if (isAutoExport) renderOpts.autoExport = true;
                if (isSpr) renderOpts.nextExport = false;
                await loadable_1.default.preloadAll(); // Make sure all dynamic imports are loaded
                // @ts-ignore url will always be set
                const asPath = req.url;
                const router = new ServerRouter(pathname, query, asPath);
                const ctx = {
                    err,
                    req: isAutoExport ? undefined : req,
                    res: isAutoExport ? undefined : res,
                    pathname,
                    query,
                    asPath,
                    AppTree: props => {
                        return react_1.default.createElement(
                            AppContainer,
                            null,
                            react_1.default.createElement(
                                App,
                                Object.assign({}, props, { Component: Component, router: router }),
                            ),
                        );
                    },
                };
                let props;
                if (documentMiddlewareEnabled && typeof DocumentMiddleware === 'function') {
                    await DocumentMiddleware(ctx);
                }
                const ampState = {
                    ampFirst: pageConfig.amp === true,
                    hasQuery: Boolean(query.amp),
                    hybrid: pageConfig.amp === 'hybrid',
                };
                const reactLoadableModules = [];
                const AppContainer = ({ children }) =>
                    react_1.default.createElement(
                        router_context_1.RouterContext.Provider,
                        { value: router },
                        react_1.default.createElement(
                            amp_context_1.AmpStateContext.Provider,
                            { value: ampState },
                            react_1.default.createElement(
                                loadable_context_1.LoadableContext.Provider,
                                { value: moduleName => reactLoadableModules.push(moduleName) },
                                children,
                            ),
                        ),
                    );
                try {
                    props = await utils_1.loadGetInitialProps(App, {
                        AppTree: ctx.AppTree,
                        Component,
                        router,
                        ctx,
                    });
                    if (isSpr) {
                        const data = await unstable_getStaticProps({
                            params: is_dynamic_1.isDynamicRoute(pathname) ? query : undefined,
                        });
                        const invalidKeys = Object.keys(data).filter(key => key !== 'revalidate' && key !== 'props');
                        if (invalidKeys.length) {
                            throw new Error(
                                `Additional keys were returned from \`getStaticProps\`. Properties intended for your component must be nested under the \`props\` key, e.g.:` +
                                    `\n\n\treturn { props: { title: 'My Title', content: '...' } }` +
                                    `\n\nKeys that need to be moved: ${invalidKeys.join(', ')}.`,
                            );
                        }
                        if (typeof data.revalidate === 'number') {
                            if (!Number.isInteger(data.revalidate)) {
                                throw new Error(
                                    `A page's revalidate option must be seconds expressed as a natural number. Mixed numbers, such as '${data.revalidate}', cannot be used.` +
                                        `\nTry changing the value to '${Math.ceil(
                                            data.revalidate,
                                        )}' or using \`Math.ceil()\` if you're computing the value.`,
                                );
                            } else if (data.revalidate <= 0) {
                                throw new Error(
                                    `A page's revalidate option can not be less than or equal to zero. A revalidate option of zero means to revalidate after _every_ request, and implies stale data cannot be tolerated.` +
                                        `\n\nTo never revalidate, you can set revalidate to \`false\` (only ran once at build-time).` +
                                        `\nTo revalidate as soon as possible, you can set the value to \`1\`.`,
                                );
                            } else if (data.revalidate > 31536000) {
                                // if it's greater than a year for some reason error
                                console.warn(
                                    `Warning: A page's revalidate option was set to more than a year. This may have been done in error.` +
                                        `\nTo only run getStaticProps at build-time and not revalidate at runtime, you can set \`revalidate\` to \`false\`!`,
                                );
                            }
                        } else if (data.revalidate === true) {
                            // When enabled, revalidate after 1 second. This value is optimal for
                            // the most up-to-date page possible, but without a 1-to-1
                            // request-refresh ratio.
                            data.revalidate = 1;
                        } else {
                            // By default, we never revalidate.
                            data.revalidate = false;
                        }
                        props.pageProps = data.props;
                        renderOpts.revalidate = data.revalidate;
                        renderOpts.pageData = props;
                    }
                } catch (err) {
                    if (!dev || !err) throw err;
                    ctx.err = err;
                    renderOpts.err = err;
                }
                // the response might be finished on the getInitialProps call
                if (utils_1.isResSent(res) && !isSpr) return null;
                const devFiles = buildManifest.devFiles;
                const files = [
                    ...new Set([
                        ...get_page_files_1.getPageFiles(buildManifest, '/_app'),
                        ...get_page_files_1.getPageFiles(buildManifest, pathname),
                    ]),
                ];
                const polyfillFiles = get_page_files_1.getPageFiles(buildManifest, '/_polyfills');
                const renderElementToString = staticMarkup ? server_1.renderToStaticMarkup : server_1.renderToString;
                const renderPageError = () => {
                    if (ctx.err && ErrorDebug) {
                        return render(
                            renderElementToString,
                            react_1.default.createElement(ErrorDebug, { error: ctx.err }),
                            ampState,
                        );
                    }
                    if (dev && (props.router || props.Component)) {
                        throw new Error(
                            `'router' and 'Component' can not be returned in getInitialProps from _app.js https://err.sh/zeit/next.js/cant-override-next-props`,
                        );
                    }
                };
                let renderPage = (options = {}) => {
                    const renderError = renderPageError();
                    if (renderError) return renderError;
                    const { App: EnhancedApp, Component: EnhancedComponent } = enhanceComponents(
                        options,
                        App,
                        Component,
                    );
                    return render(
                        renderElementToString,
                        react_1.default.createElement(
                            AppContainer,
                            null,
                            react_1.default.createElement(
                                EnhancedApp,
                                Object.assign({ Component: EnhancedComponent, router: router }, props),
                            ),
                        ),
                        ampState,
                    );
                };
                const documentCtx = Object.assign(Object.assign({}, ctx), { renderPage });
                const docProps = await utils_1.loadGetInitialProps(Document, documentCtx);
                // the response might be finished on the getInitialProps call
                if (utils_1.isResSent(res) && !isSpr) return null;
                if (!docProps || typeof docProps.html !== 'string') {
                    const message = `"${utils_1.getDisplayName(
                        Document,
                    )}.getInitialProps()" should resolve to an object with a "html" prop set with a valid html string`;
                    throw new Error(message);
                }
                const dynamicImportIdsSet = new Set();
                const dynamicImports = [];
                for (const mod of reactLoadableModules) {
                    const manifestItem = reactLoadableManifest[mod];
                    if (manifestItem) {
                        manifestItem.forEach(item => {
                            dynamicImports.push(item);
                            dynamicImportIdsSet.add(item.id);
                        });
                    }
                }
                const dynamicImportsIds = [...dynamicImportIdsSet];
                const inAmpMode = amp_1.isInAmpMode(ampState);
                const hybridAmp = ampState.hybrid;
                // update renderOpts so export knows current state
                renderOpts.inAmpMode = inAmpMode;
                renderOpts.hybridAmp = hybridAmp;
                let html = renderDocument(
                    Document,
                    Object.assign(Object.assign({}, renderOpts), {
                        dangerousAsPath: router.asPath,
                        ampState,
                        props,
                        headTags: await headTags(documentCtx),
                        bodyTags: await bodyTags(documentCtx),
                        htmlProps: await htmlProps(documentCtx),
                        docProps,
                        pathname,
                        ampPath,
                        query,
                        inAmpMode,
                        hybridAmp,
                        dynamicImportsIds,
                        dynamicImports,
                        files,
                        devFiles,
                        polyfillFiles,
                    }),
                );
                if (inAmpMode && html) {
                    // inject HTML to AMP_RENDER_TARGET to allow rendering
                    // directly to body in AMP mode
                    const ampRenderIndex = html.indexOf(constants_2.AMP_RENDER_TARGET);
                    html =
                        html.substring(0, ampRenderIndex) +
                        `<!-- __NEXT_DATA__ -->${docProps.html}` +
                        html.substring(ampRenderIndex + constants_2.AMP_RENDER_TARGET.length);
                    html = await optimize_amp_1.default(html);
                    if (renderOpts.ampValidator) {
                        await renderOpts.ampValidator(html, pathname);
                    }
                }
                if (inAmpMode || hybridAmp) {
                    // fix &amp being escaped for amphtml rel link
                    html = html.replace(/&amp;amp=1/g, '&amp=1');
                }
                return html;
            }
            exports.renderToHTML = renderToHTML;
            function errorToJSON(err) {
                const { name, message, stack } = err;
                return { name, message, stack };
            }
            function serializeError(dev, err) {
                if (dev) {
                    return errorToJSON(err);
                }
                return {
                    name: 'Internal Server Error.',
                    message: '500 - Internal Server Error.',
                    statusCode: 500,
                };
            }

            /***/
        },

        /***/ '/jkW': /***/ function(module, exports, __webpack_require__) {
            'use strict';

            Object.defineProperty(exports, '__esModule', {
                value: true,
            }); // Identify /[param]/ in route string

            const TEST_ROUTE = /\/\[[^/]+?\](?=\/|$)/;

            function isDynamicRoute(route) {
                return TEST_ROUTE.test(route);
            }

            exports.isDynamicRoute = isDynamicRoute;

            /***/
        },

        /***/ '16Al': /***/ function(module, exports, __webpack_require__) {
            'use strict';
            /**
             * Copyright (c) 2013-present, Facebook, Inc.
             *
             * This source code is licensed under the MIT license found in the
             * LICENSE file in the root directory of this source tree.
             */

            var ReactPropTypesSecret = __webpack_require__('WbBG');

            function emptyFunction() {}
            function emptyFunctionWithReset() {}
            emptyFunctionWithReset.resetWarningCache = emptyFunction;

            module.exports = function() {
                function shim(props, propName, componentName, location, propFullName, secret) {
                    if (secret === ReactPropTypesSecret) {
                        // It is still safe when called from React.
                        return;
                    }
                    var err = new Error(
                        'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
                            'Use PropTypes.checkPropTypes() to call them. ' +
                            'Read more at http://fb.me/use-check-prop-types',
                    );
                    err.name = 'Invariant Violation';
                    throw err;
                }
                shim.isRequired = shim;
                function getShim() {
                    return shim;
                }
                // Important!
                // Keep this list in sync with production version in `./factoryWithTypeCheckers.js`.
                var ReactPropTypes = {
                    array: shim,
                    bool: shim,
                    func: shim,
                    number: shim,
                    object: shim,
                    string: shim,
                    symbol: shim,

                    any: shim,
                    arrayOf: getShim,
                    element: shim,
                    elementType: shim,
                    instanceOf: getShim,
                    node: shim,
                    objectOf: getShim,
                    oneOf: getShim,
                    oneOfType: getShim,
                    shape: getShim,
                    exact: getShim,

                    checkPropTypes: emptyFunctionWithReset,
                    resetWarningCache: emptyFunction,
                };

                ReactPropTypes.PropTypes = ReactPropTypes;

                return ReactPropTypes;
            };

            /***/
        },

        /***/ '17x9': /***/ function(module, exports, __webpack_require__) {
            /**
             * Copyright (c) 2013-present, Facebook, Inc.
             *
             * This source code is licensed under the MIT license found in the
             * LICENSE file in the root directory of this source tree.
             */

            if (false) {
                var throwOnDirectAccess, ReactIs;
            } else {
                // By explicitly using `prop-types` you are opting into new production behavior.
                // http://fb.me/prop-types-in-prod
                module.exports = __webpack_require__('16Al')();
            }

            /***/
        },

        /***/ '2qu3': /***/ function(module, exports, __webpack_require__) {
            'use strict';

            /**
@copyright (c) 2017-present James Kyle <me@thejameskyle.com>
 MIT License
 Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:
 The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE
*/
            // https://github.com/jamiebuilds/react-loadable/blob/v5.5.0/src/index.js
            // Modified to be compatible with webpack 4 / Next.js

            var __importDefault =
                (this && this.__importDefault) ||
                function(mod) {
                    return mod && mod.__esModule
                        ? mod
                        : {
                              default: mod,
                          };
                };

            Object.defineProperty(exports, '__esModule', {
                value: true,
            });

            const react_1 = __importDefault(__webpack_require__('q1tI'));

            const use_subscription_1 = __webpack_require__('8L3h');

            const loadable_context_1 = __webpack_require__('jwwS');

            const ALL_INITIALIZERS = [];
            const READY_INITIALIZERS = [];
            let initialized = false;

            function load(loader) {
                let promise = loader();
                let state = {
                    loading: true,
                    loaded: null,
                    error: null,
                };
                state.promise = promise
                    .then(loaded => {
                        state.loading = false;
                        state.loaded = loaded;
                        return loaded;
                    })
                    .catch(err => {
                        state.loading = false;
                        state.error = err;
                        throw err;
                    });
                return state;
            }

            function loadMap(obj) {
                let state = {
                    loading: false,
                    loaded: {},
                    error: null,
                };
                let promises = [];

                try {
                    Object.keys(obj).forEach(key => {
                        let result = load(obj[key]);

                        if (!result.loading) {
                            state.loaded[key] = result.loaded;
                            state.error = result.error;
                        } else {
                            state.loading = true;
                        }

                        promises.push(result.promise);
                        result.promise
                            .then(res => {
                                state.loaded[key] = res;
                            })
                            .catch(err => {
                                state.error = err;
                            });
                    });
                } catch (err) {
                    state.error = err;
                }

                state.promise = Promise.all(promises)
                    .then(res => {
                        state.loading = false;
                        return res;
                    })
                    .catch(err => {
                        state.loading = false;
                        throw err;
                    });
                return state;
            }

            function resolve(obj) {
                return obj && obj.__esModule ? obj.default : obj;
            }

            function render(loaded, props) {
                return react_1.default.createElement(resolve(loaded), props);
            }

            function createLoadableComponent(loadFn, options) {
                let opts = Object.assign(
                    {
                        loader: null,
                        loading: null,
                        delay: 200,
                        timeout: null,
                        render: render,
                        webpack: null,
                        modules: null,
                    },
                    options,
                );
                let subscription = null;

                function init() {
                    if (!subscription) {
                        const sub = new LoadableSubscription(loadFn, opts);
                        subscription = {
                            getCurrentValue: sub.getCurrentValue.bind(sub),
                            subscribe: sub.subscribe.bind(sub),
                            retry: sub.retry.bind(sub),
                            promise: sub.promise.bind(sub),
                        };
                    }

                    return subscription.promise();
                } // Server only

                if (true) {
                    ALL_INITIALIZERS.push(init);
                } // Client only

                if (!initialized && false && typeof opts.webpack === 'function') {
                    const moduleIds = opts.webpack();
                    READY_INITIALIZERS.push(ids => {
                        for (const moduleId of moduleIds) {
                            if (ids.indexOf(moduleId) !== -1) {
                                return init();
                            }
                        }
                    });
                }

                const LoadableComponent = (props, ref) => {
                    init();
                    const context = react_1.default.useContext(loadable_context_1.LoadableContext);
                    const state = use_subscription_1.useSubscription(subscription);
                    react_1.default.useImperativeHandle(ref, () => ({
                        retry: subscription.retry,
                    }));

                    if (context && Array.isArray(opts.modules)) {
                        opts.modules.forEach(moduleName => {
                            context(moduleName);
                        });
                    }

                    if (state.loading || state.error) {
                        return react_1.default.createElement(opts.loading, {
                            isLoading: state.loading,
                            pastDelay: state.pastDelay,
                            timedOut: state.timedOut,
                            error: state.error,
                            retry: subscription.retry,
                        });
                    } else if (state.loaded) {
                        return opts.render(state.loaded, props);
                    } else {
                        return null;
                    }
                };

                LoadableComponent.preload = () => init();

                LoadableComponent.displayName = 'LoadableComponent';
                return react_1.default.forwardRef(LoadableComponent);
            }

            class LoadableSubscription {
                constructor(loadFn, opts) {
                    this._loadFn = loadFn;
                    this._opts = opts;
                    this._callbacks = new Set();
                    this._delay = null;
                    this._timeout = null;
                    this.retry();
                }

                promise() {
                    return this._res.promise;
                }

                retry() {
                    this._clearTimeouts();

                    this._res = this._loadFn(this._opts.loader);
                    this._state = {
                        pastDelay: false,
                        timedOut: false,
                    };
                    const { _res: res, _opts: opts } = this;

                    if (res.loading) {
                        if (typeof opts.delay === 'number') {
                            if (opts.delay === 0) {
                                this._state.pastDelay = true;
                            } else {
                                this._delay = setTimeout(() => {
                                    this._update({
                                        pastDelay: true,
                                    });
                                }, opts.delay);
                            }
                        }

                        if (typeof opts.timeout === 'number') {
                            this._timeout = setTimeout(() => {
                                this._update({
                                    timedOut: true,
                                });
                            }, opts.timeout);
                        }
                    }

                    this._res.promise
                        .then(() => {
                            this._update();

                            this._clearTimeouts();
                        }) // eslint-disable-next-line handle-callback-err
                        .catch(err => {
                            this._update();

                            this._clearTimeouts();
                        });

                    this._update({});
                }

                _update(partial) {
                    this._state = Object.assign(Object.assign({}, this._state), partial);

                    this._callbacks.forEach(callback => callback());
                }

                _clearTimeouts() {
                    clearTimeout(this._delay);
                    clearTimeout(this._timeout);
                }

                getCurrentValue() {
                    return Object.assign(Object.assign({}, this._state), {
                        error: this._res.error,
                        loaded: this._res.loaded,
                        loading: this._res.loading,
                    });
                }

                subscribe(callback) {
                    this._callbacks.add(callback);

                    return () => {
                        this._callbacks.delete(callback);
                    };
                }
            }

            function Loadable(opts) {
                return createLoadableComponent(load, opts);
            }

            function LoadableMap(opts) {
                if (typeof opts.render !== 'function') {
                    throw new Error('LoadableMap requires a `render(loaded, props)` function');
                }

                return createLoadableComponent(loadMap, opts);
            }

            Loadable.Map = LoadableMap;

            function flushInitializers(initializers, ids) {
                let promises = [];

                while (initializers.length) {
                    let init = initializers.pop();
                    promises.push(init(ids));
                }

                return Promise.all(promises).then(() => {
                    if (initializers.length) {
                        return flushInitializers(initializers, ids);
                    }
                });
            }

            Loadable.preloadAll = () => {
                return new Promise((resolve, reject) => {
                    flushInitializers(ALL_INITIALIZERS).then(resolve, reject);
                });
            };

            Loadable.preloadReady = (ids = []) => {
                return new Promise(resolve => {
                    const res = () => {
                        initialized = true;
                        return resolve();
                    }; // We always will resolve, errors should be handled within loading UIs.

                    flushInitializers(READY_INITIALIZERS, ids).then(res, res);
                });
            };

            if (false) {
            }

            exports.default = Loadable;

            /***/
        },

        /***/ '3niX': /***/ function(module, exports, __webpack_require__) {
            'use strict';

            exports.__esModule = true;
            exports.flush = flush;
            exports['default'] = void 0;

            var _react = __webpack_require__('q1tI');

            var _stylesheetRegistry = _interopRequireDefault(__webpack_require__('SevZ'));

            function _interopRequireDefault(obj) {
                return obj && obj.__esModule ? obj : { default: obj };
            }

            function _inheritsLoose(subClass, superClass) {
                subClass.prototype = Object.create(superClass.prototype);
                subClass.prototype.constructor = subClass;
                subClass.__proto__ = superClass;
            }

            var styleSheetRegistry = new _stylesheetRegistry['default']();

            var JSXStyle =
                /*#__PURE__*/
                (function(_Component) {
                    _inheritsLoose(JSXStyle, _Component);

                    function JSXStyle(props) {
                        var _this;

                        _this = _Component.call(this, props) || this;
                        _this.prevProps = {};
                        return _this;
                    }

                    JSXStyle.dynamic = function dynamic(info) {
                        return info
                            .map(function(tagInfo) {
                                var baseId = tagInfo[0];
                                var props = tagInfo[1];
                                return styleSheetRegistry.computeId(baseId, props);
                            })
                            .join(' ');
                    }; // probably faster than PureComponent (shallowEqual)

                    var _proto = JSXStyle.prototype;

                    _proto.shouldComponentUpdate = function shouldComponentUpdate(otherProps) {
                        return (
                            this.props.id !== otherProps.id || // We do this check because `dynamic` is an array of strings or undefined.
                            // These are the computed values for dynamic styles.
                            String(this.props.dynamic) !== String(otherProps.dynamic)
                        );
                    };

                    _proto.componentWillUnmount = function componentWillUnmount() {
                        styleSheetRegistry.remove(this.props);
                    };

                    _proto.render = function render() {
                        // This is a workaround to make the side effect async safe in the "render" phase.
                        // See https://github.com/zeit/styled-jsx/pull/484
                        if (this.shouldComponentUpdate(this.prevProps)) {
                            // Updates
                            if (this.prevProps.id) {
                                styleSheetRegistry.remove(this.prevProps);
                            }

                            styleSheetRegistry.add(this.props);
                            this.prevProps = this.props;
                        }

                        return null;
                    };

                    return JSXStyle;
                })(_react.Component);

            exports['default'] = JSXStyle;

            function flush() {
                var cssRules = styleSheetRegistry.cssRules();
                styleSheetRegistry.flush();
                return cssRules;
            }

            /***/
        },

        /***/ '67Bq': /***/ function(module) {
            module.exports = JSON.parse('{}');

            /***/
        },

        /***/ '8Bbg': /***/ function(module, exports, __webpack_require__) {
            module.exports = __webpack_require__('B5Ud');

            /***/
        },

        /***/ '8C61': /***/ function(module, exports) {
            module.exports = require('@ampproject/toolbox-optimizer');

            /***/
        },

        /***/ '8Kt/': /***/ function(module, exports, __webpack_require__) {
            'use strict';

            var __importDefault =
                (this && this.__importDefault) ||
                function(mod) {
                    return mod && mod.__esModule
                        ? mod
                        : {
                              default: mod,
                          };
                };

            Object.defineProperty(exports, '__esModule', {
                value: true,
            });

            const react_1 = __importDefault(__webpack_require__('q1tI'));

            const side_effect_1 = __importDefault(__webpack_require__('Xuae'));

            const amp_context_1 = __webpack_require__('lwAK');

            const head_manager_context_1 = __webpack_require__('FYa8');

            const amp_1 = __webpack_require__('/0+H');

            function defaultHead(inAmpMode = false) {
                const head = [
                    react_1.default.createElement('meta', {
                        charSet: 'utf-8',
                    }),
                ];

                if (!inAmpMode) {
                    head.push(
                        react_1.default.createElement('meta', {
                            name: 'viewport',
                            content: 'width=device-width,minimum-scale=1,initial-scale=1',
                        }),
                    );
                }

                return head;
            }

            exports.defaultHead = defaultHead;

            function onlyReactElement(list, child) {
                // React children can be "string" or "number" in this case we ignore them for backwards compat
                if (typeof child === 'string' || typeof child === 'number') {
                    return list;
                } // Adds support for React.Fragment

                if (child.type === react_1.default.Fragment) {
                    return list.concat(
                        react_1.default.Children.toArray(child.props.children).reduce((fragmentList, fragmentChild) => {
                            if (typeof fragmentChild === 'string' || typeof fragmentChild === 'number') {
                                return fragmentList;
                            }

                            return fragmentList.concat(fragmentChild);
                        }, []),
                    );
                }

                return list.concat(child);
            }

            const METATYPES = ['name', 'httpEquiv', 'charSet', 'itemProp'];
            /*
 returns a function for filtering head child elements
 which shouldn't be duplicated, like <title/>
 Also adds support for deduplicated `key` properties
*/

            function unique() {
                const keys = new Set();
                const tags = new Set();
                const metaTypes = new Set();
                const metaCategories = {};
                return h => {
                    let unique = true;

                    if (h.key && typeof h.key !== 'number' && h.key.indexOf('$') > 0) {
                        const key = h.key.slice(h.key.indexOf('$') + 1);

                        if (keys.has(key)) {
                            unique = false;
                        } else {
                            keys.add(key);
                        }
                    } // eslint-disable-next-line default-case

                    switch (h.type) {
                        case 'title':
                        case 'base':
                            if (tags.has(h.type)) {
                                unique = false;
                            } else {
                                tags.add(h.type);
                            }

                            break;

                        case 'meta':
                            for (let i = 0, len = METATYPES.length; i < len; i++) {
                                const metatype = METATYPES[i];
                                if (!h.props.hasOwnProperty(metatype)) continue;

                                if (metatype === 'charSet') {
                                    if (metaTypes.has(metatype)) {
                                        unique = false;
                                    } else {
                                        metaTypes.add(metatype);
                                    }
                                } else {
                                    const category = h.props[metatype];
                                    const categories = metaCategories[metatype] || new Set();

                                    if (categories.has(category)) {
                                        unique = false;
                                    } else {
                                        categories.add(category);
                                        metaCategories[metatype] = categories;
                                    }
                                }
                            }

                            break;
                    }

                    return unique;
                };
            }
            /**
             *
             * @param headElement List of multiple <Head> instances
             */

            function reduceComponents(headElements, props) {
                return headElements
                    .reduce((list, headElement) => {
                        const headElementChildren = react_1.default.Children.toArray(headElement.props.children);
                        return list.concat(headElementChildren);
                    }, [])
                    .reduce(onlyReactElement, [])
                    .reverse()
                    .concat(defaultHead(props.inAmpMode))
                    .filter(unique())
                    .reverse()
                    .map((c, i) => {
                        const key = c.key || i;
                        return react_1.default.cloneElement(c, {
                            key,
                        });
                    });
            }

            const Effect = side_effect_1.default();
            /**
             * This component injects elements to `<head>` of your page.
             * To avoid duplicated `tags` in `<head>` you can use the `key` property, which will make sure every tag is only rendered once.
             */

            function Head({ children }) {
                return react_1.default.createElement(amp_context_1.AmpStateContext.Consumer, null, ampState =>
                    react_1.default.createElement(
                        head_manager_context_1.HeadManagerContext.Consumer,
                        null,
                        updateHead =>
                            react_1.default.createElement(
                                Effect,
                                {
                                    reduceComponentsToState: reduceComponents,
                                    handleStateChange: updateHead,
                                    inAmpMode: amp_1.isInAmpMode(ampState),
                                },
                                children,
                            ),
                    ),
                );
            }

            Head.rewind = Effect.rewind;
            exports.default = Head;

            /***/
        },

        /***/ '8L3h': /***/ function(module, exports, __webpack_require__) {
            'use strict';

            if (true) {
                module.exports = __webpack_require__('f/k9');
            } else {
            }

            /***/
        },

        /***/ '8cZr': /***/ function(module, exports, __webpack_require__) {
            module.exports = __webpack_require__('VDXt');

            /***/
        },

        /***/ '8xkj': /***/ function(module, exports) {
            module.exports = require('querystring');

            /***/
        },

        /***/ '9kyW': /***/ function(module, exports, __webpack_require__) {
            'use strict';

            function hash(str) {
                var hash = 5381,
                    i = str.length;

                while (i) {
                    hash = (hash * 33) ^ str.charCodeAt(--i);
                }

                /* JavaScript does bitwise operations (like XOR, above) on 32-bit signed
                 * integers. Since we want the results to be always positive, convert the
                 * signed int to an unsigned by doing an unsigned bitshift. */
                return hash >>> 0;
            }

            module.exports = hash;

            /***/
        },

        /***/ '9sSY': /***/ function(module, __webpack_exports__, __webpack_require__) {
            'use strict';

            // EXTERNAL MODULE: ./src/design/Layout.scss
            var Layout = __webpack_require__('pjpT');

            // EXTERNAL MODULE: ./node_modules/react/index.js
            var react = __webpack_require__('q1tI');
            var react_default = /*#__PURE__*/ __webpack_require__.n(react);

            // EXTERNAL MODULE: ./node_modules/next/dist/next-server/lib/head.js
            var head = __webpack_require__('8Kt/');
            var head_default = /*#__PURE__*/ __webpack_require__.n(head);

            // CONCATENATED MODULE: ./src/layout/Header.tsx
            var __jsx = react_default.a.createElement;

            const Header = () =>
                __jsx(
                    'header',
                    {
                        className: 'govuk-header ',
                        role: 'banner',
                        'data-module': 'govuk-header',
                    },
                    __jsx(
                        'div',
                        {
                            className: 'govuk-header__container govuk-width-container',
                        },
                        __jsx(
                            'div',
                            {
                                className: 'govuk-header__logo',
                            },
                            __jsx(
                                'a',
                                {
                                    href: 'https://www.gov.uk/',
                                    className: 'govuk-header__link govuk-header__link--homepage',
                                },
                                __jsx(
                                    'span',
                                    {
                                        className: 'govuk-header__logotype',
                                    },
                                    __jsx(
                                        'svg',
                                        {
                                            role: 'presentation',
                                            focusable: 'false',
                                            className: 'govuk-header__logotype-crown',
                                            xmlns: 'http://www.w3.org/2000/svg',
                                            viewBox: '0 0 132 97',
                                            height: '30',
                                            width: '36',
                                        },
                                        __jsx('path', {
                                            fill: 'currentColor',
                                            fillRule: 'evenodd',
                                            d:
                                                'M25 30.2c3.5 1.5 7.7-.2 9.1-3.7 1.5-3.6-.2-7.8-3.9-9.2-3.6-1.4-7.6.3-9.1 3.9-1.4 3.5.3 7.5 3.9 9zM9 39.5c3.6 1.5 7.8-.2 9.2-3.7 1.5-3.6-.2-7.8-3.9-9.1-3.6-1.5-7.6.2-9.1 3.8-1.4 3.5.3 7.5 3.8 9zM4.4 57.2c3.5 1.5 7.7-.2 9.1-3.8 1.5-3.6-.2-7.7-3.9-9.1-3.5-1.5-7.6.3-9.1 3.8-1.4 3.5.3 7.6 3.9 9.1zm38.3-21.4c3.5 1.5 7.7-.2 9.1-3.8 1.5-3.6-.2-7.7-3.9-9.1-3.6-1.5-7.6.3-9.1 3.8-1.3 3.6.4 7.7 3.9 9.1zm64.4-5.6c-3.6 1.5-7.8-.2-9.1-3.7-1.5-3.6.2-7.8 3.8-9.2 3.6-1.4 7.7.3 9.2 3.9 1.3 3.5-.4 7.5-3.9 9zm15.9 9.3c-3.6 1.5-7.7-.2-9.1-3.7-1.5-3.6.2-7.8 3.7-9.1 3.6-1.5 7.7.2 9.2 3.8 1.5 3.5-.3 7.5-3.8 9zm4.7 17.7c-3.6 1.5-7.8-.2-9.2-3.8-1.5-3.6.2-7.7 3.9-9.1 3.6-1.5 7.7.3 9.2 3.8 1.3 3.5-.4 7.6-3.9 9.1zM89.3 35.8c-3.6 1.5-7.8-.2-9.2-3.8-1.4-3.6.2-7.7 3.9-9.1 3.6-1.5 7.7.3 9.2 3.8 1.4 3.6-.3 7.7-3.9 9.1zM69.7 17.7l8.9 4.7V9.3l-8.9 2.8c-.2-.3-.5-.6-.9-.9L72.4 0H59.6l3.5 11.2c-.3.3-.6.5-.9.9l-8.8-2.8v13.1l8.8-4.7c.3.3.6.7.9.9l-5 15.4v.1c-.2.8-.4 1.6-.4 2.4 0 4.1 3.1 7.5 7 8.1h.2c.3 0 .7.1 1 .1.4 0 .7 0 1-.1h.2c4-.6 7.1-4.1 7.1-8.1 0-.8-.1-1.7-.4-2.4V34l-5.1-15.4c.4-.2.7-.6 1-.9zM66 92.8c16.9 0 32.8 1.1 47.1 3.2 4-16.9 8.9-26.7 14-33.5l-9.6-3.4c1 4.9 1.1 7.2 0 10.2-1.5-1.4-3-4.3-4.2-8.7L108.6 76c2.8-2 5-3.2 7.5-3.3-4.4 9.4-10 11.9-13.6 11.2-4.3-.8-6.3-4.6-5.6-7.9 1-4.7 5.7-5.9 8-.5 4.3-8.7-3-11.4-7.6-8.8 7.1-7.2 7.9-13.5 2.1-21.1-8 6.1-8.1 12.3-4.5 20.8-4.7-5.4-12.1-2.5-9.5 6.2 3.4-5.2 7.9-2 7.2 3.1-.6 4.3-6.4 7.8-13.5 7.2-10.3-.9-10.9-8-11.2-13.8 2.5-.5 7.1 1.8 11 7.3L80.2 60c-4.1 4.4-8 5.3-12.3 5.4 1.4-4.4 8-11.6 8-11.6H55.5s6.4 7.2 7.9 11.6c-4.2-.1-8-1-12.3-5.4l1.4 16.4c3.9-5.5 8.5-7.7 10.9-7.3-.3 5.8-.9 12.8-11.1 13.8-7.2.6-12.9-2.9-13.5-7.2-.7-5 3.8-8.3 7.1-3.1 2.7-8.7-4.6-11.6-9.4-6.2 3.7-8.5 3.6-14.7-4.6-20.8-5.8 7.6-5 13.9 2.2 21.1-4.7-2.6-11.9.1-7.7 8.8 2.3-5.5 7.1-4.2 8.1.5.7 3.3-1.3 7.1-5.7 7.9-3.5.7-9-1.8-13.5-11.2 2.5.1 4.7 1.3 7.5 3.3l-4.7-15.4c-1.2 4.4-2.7 7.2-4.3 8.7-1.1-3-.9-5.3 0-10.2l-9.5 3.4c5 6.9 9.9 16.7 14 33.5 14.8-2.1 30.8-3.2 47.7-3.2z',
                                        }),
                                    ),
                                    __jsx(
                                        'span',
                                        {
                                            className: 'govuk-header__logotype-text crownPadding',
                                        },
                                        'GOV.UK',
                                    ),
                                ),
                            ),
                        ),
                        __jsx(
                            'div',
                            {
                                className: 'govuk-header__content',
                            },
                            __jsx(
                                'a',
                                {
                                    href: '/',
                                    id: 'title_link',
                                    className: 'govuk-header__link govuk-header__link--service-name',
                                },
                                'Fares Data Build Tool',
                            ),
                        ),
                    ),
                );

            /* harmony default export */ var layout_Header = Header;
            // EXTERNAL MODULE: ./src/constants/index.ts
            var constants = __webpack_require__('jxKE');

            // CONCATENATED MODULE: ./src/layout/AlphaBanner.tsx
            var AlphaBanner_jsx = react_default.a.createElement;

            const AlphaBanner = () =>
                AlphaBanner_jsx(
                    'div',
                    {
                        className: 'govuk-phase-banner',
                    },
                    AlphaBanner_jsx(
                        'p',
                        {
                            className: 'govuk-phase-banner__content',
                        },
                        AlphaBanner_jsx(
                            'strong',
                            {
                                className: 'govuk-tag govuk-phase-banner__content__tag',
                            },
                            'alpha',
                        ),
                        AlphaBanner_jsx(
                            'span',
                            {
                                className: 'govuk-phase-banner__text',
                            },
                            'This is a new service \u2013 your',
                            ' ',
                            AlphaBanner_jsx(
                                'a',
                                {
                                    className: 'govuk-link',
                                    id: 'feedback_link',
                                    href: constants['e' /* FEEDBACK_LINK */],
                                },
                                'feedback',
                            ),
                            ' ',
                            'will help us to improve it.',
                        ),
                    ),
                );

            /* harmony default export */ var layout_AlphaBanner = AlphaBanner;
            // CONCATENATED MODULE: ./src/layout/Footer.tsx
            var Footer_jsx = react_default.a.createElement;

            const Footer = () =>
                Footer_jsx(
                    'footer',
                    {
                        className: 'govuk-footer ',
                        role: 'contentinfo',
                    },
                    Footer_jsx(
                        'div',
                        {
                            className: 'govuk-width-container ',
                        },
                        Footer_jsx(
                            'div',
                            {
                                className: 'govuk-footer__meta',
                            },
                            Footer_jsx(
                                'div',
                                {
                                    className: 'govuk-footer__meta-item govuk-footer__meta-item--grow',
                                },
                                Footer_jsx(
                                    'h2',
                                    {
                                        className: 'govuk-visually-hidden',
                                    },
                                    'Support links',
                                ),
                                Footer_jsx(
                                    'ul',
                                    {
                                        className: 'govuk-footer__inline-list',
                                    },
                                    Footer_jsx(
                                        'li',
                                        {
                                            className: 'govuk-footer__inline-list-item',
                                        },
                                        Footer_jsx(
                                            'a',
                                            {
                                                className: 'govuk-footer__link',
                                                href: 'https://www.gov.uk/help',
                                            },
                                            'Help',
                                        ),
                                    ),
                                    Footer_jsx(
                                        'li',
                                        {
                                            className: 'govuk-footer__inline-list-item',
                                        },
                                        Footer_jsx(
                                            'a',
                                            {
                                                className: 'govuk-footer__link',
                                                href: 'https://www.gov.uk/help/cookies',
                                            },
                                            'Cookies',
                                        ),
                                    ),
                                    Footer_jsx(
                                        'li',
                                        {
                                            className: 'govuk-footer__inline-list-item',
                                        },
                                        Footer_jsx(
                                            'a',
                                            {
                                                className: 'govuk-footer__link',
                                                href: 'https://www.gov.uk/contact',
                                            },
                                            'Contact',
                                        ),
                                    ),
                                    Footer_jsx(
                                        'li',
                                        {
                                            className: 'govuk-footer__inline-list-item',
                                        },
                                        Footer_jsx(
                                            'a',
                                            {
                                                className: 'govuk-footer__link',
                                                href: 'https://www.gov.uk/help/terms-conditions',
                                            },
                                            'Terms and conditions',
                                        ),
                                    ),
                                ),
                                Footer_jsx(
                                    'svg',
                                    {
                                        role: 'presentation',
                                        focusable: 'false',
                                        className: 'govuk-footer__licence-logo',
                                        xmlns: 'http://www.w3.org/2000/svg',
                                        viewBox: '0 0 483.2 195.7',
                                        height: '17',
                                        width: '41',
                                    },
                                    Footer_jsx('path', {
                                        fill: 'currentColor',
                                        d:
                                            'M421.5 142.8V.1l-50.7 32.3v161.1h112.4v-50.7zm-122.3-9.6A47.12 47.12 0 0 1 221 97.8c0-26 21.1-47.1 47.1-47.1 16.7 0 31.4 8.7 39.7 21.8l42.7-27.2A97.63 97.63 0 0 0 268.1 0c-36.5 0-68.3 20.1-85.1 49.7A98 98 0 0 0 97.8 0C43.9 0 0 43.9 0 97.8s43.9 97.8 97.8 97.8c36.5 0 68.3-20.1 85.1-49.7a97.76 97.76 0 0 0 149.6 25.4l19.4 22.2h3v-87.8h-80l24.3 27.5zM97.8 145c-26 0-47.1-21.1-47.1-47.1s21.1-47.1 47.1-47.1 47.2 21 47.2 47S123.8 145 97.8 145',
                                    }),
                                ),
                                Footer_jsx(
                                    'span',
                                    {
                                        className: 'govuk-footer__licence-description',
                                    },
                                    'All content is available under the\xA0',
                                    Footer_jsx(
                                        'a',
                                        {
                                            className: 'govuk-footer__link',
                                            id: 'govuk_link',
                                            href: constants['f' /* GOVUK_LINK */],
                                            rel: 'license',
                                        },
                                        'Open Government Licence v3.0',
                                    ),
                                    ', except where otherwise stated',
                                ),
                            ),
                            Footer_jsx(
                                'div',
                                {
                                    className: 'govuk-footer__meta-item',
                                },
                                Footer_jsx(
                                    'a',
                                    {
                                        className: 'govuk-footer__link govuk-footer__copyright-logo',
                                        href:
                                            'https://www.nationalarchives.gov.uk/information-management/re-using-public-sector-information/uk-government-licensing-framework/crown-copyright/',
                                    },
                                    Footer_jsx('div', null, '\xA9 Crown copyright'),
                                ),
                            ),
                        ),
                    ),
                );

            /* harmony default export */ var layout_Footer = Footer;
            // CONCATENATED MODULE: ./src/layout/LogoBanner.tsx
            var LogoBanner_jsx = react_default.a.createElement;

            const LogoBanner = () =>
                LogoBanner_jsx(
                    'div',
                    {
                        className: 'logo-banner',
                    },
                    LogoBanner_jsx(
                        'div',
                        null,
                        LogoBanner_jsx(
                            'div',
                            {
                                className: 'gem-c-organisation-logo brand--department-for-transport',
                            },
                            LogoBanner_jsx(
                                'div',
                                {
                                    className:
                                        'gem-c-organisation-logo__container gem-c-organisation-logo__crest gem-c-organisation-logo__crest--single-identity brand__border-color',
                                },
                                LogoBanner_jsx(
                                    'span',
                                    {
                                        className: 'gem-c-organisation-logo__name',
                                    },
                                    'Department',
                                    LogoBanner_jsx('br', null),
                                    'for Transport',
                                ),
                            ),
                        ),
                    ),
                    LogoBanner_jsx(
                        'div',
                        {
                            className: 'logo',
                        },
                        LogoBanner_jsx(
                            'svg',
                            {
                                xmlns: 'http://www.w3.org/2000/svg',
                                viewBox: '0 0 198.91 46.49',
                            },
                            LogoBanner_jsx('defs', null),
                            LogoBanner_jsx('title', null, 'Logo'),
                            LogoBanner_jsx(
                                'g',
                                {
                                    id: 'Layer_2',
                                    'data-name': 'Layer 2',
                                },
                                LogoBanner_jsx(
                                    'g',
                                    {
                                        id: 'Layer_1-2',
                                        'data-name': 'Layer 1',
                                    },
                                    LogoBanner_jsx('polygon', {
                                        className: 'cls-1',
                                        points:
                                            '58.13 2.02 55.42 2.02 55.42 0.21 62.79 0.21 62.79 2.02 60.08 2.02 60.08 9.1 58.13 9.1 58.13 2.02',
                                    }),
                                    LogoBanner_jsx('path', {
                                        className: 'cls-1',
                                        d:
                                            'M64.29.22h4.06a3.51,3.51,0,0,1,2.59.9,2.79,2.79,0,0,1,.76,2v0a2.76,2.76,0,0,1-1.9,2.76L72,9.1H69.68l-1.9-2.84H66.24V9.1H64.29Zm3.93,4.31c1,0,1.5-.51,1.5-1.25v0c0-.84-.58-1.27-1.54-1.27H66.24V4.53Z',
                                    }),
                                    LogoBanner_jsx('path', {
                                        className: 'cls-1',
                                        d:
                                            'M76.51.15h1.81l3.81,9h-2l-.81-2H75.51l-.81,2h-2Zm2.06,5.23L77.39,2.5,76.21,5.38Z',
                                    }),
                                    LogoBanner_jsx('polygon', {
                                        className: 'cls-1',
                                        points:
                                            '83.5 0.21 85.3 0.21 89.47 5.69 89.47 0.21 91.4 0.21 91.4 9.1 89.73 9.1 85.43 3.45 85.43 9.1 83.5 9.1 83.5 0.21',
                                    }),
                                    LogoBanner_jsx('path', {
                                        className: 'cls-1',
                                        d:
                                            'M92.92,7.81l1.16-1.39A4,4,0,0,0,96.73,7.5c.8,0,1.28-.31,1.28-.83v0c0-.49-.3-.75-1.79-1.13-1.79-.46-2.94-1-2.94-2.72v0c0-1.61,1.29-2.68,3.11-2.68a5.17,5.17,0,0,1,3.3,1.13l-1,1.47a4.18,4.18,0,0,0-2.31-.87c-.75,0-1.14.34-1.14.77v0c0,.58.38.77,1.92,1.16,1.8.47,2.81,1.12,2.81,2.67v0c0,1.76-1.34,2.75-3.26,2.75a5.68,5.68,0,0,1-3.77-1.42',
                                    }),
                                    LogoBanner_jsx('path', {
                                        className: 'cls-1',
                                        d:
                                            'M101.66.22h3.63c2.12,0,3.4,1.25,3.4,3.07v0c0,2.06-1.6,3.13-3.59,3.13h-1.49V9.1h-2Zm3.5,4.48a1.38,1.38,0,0,0,1.55-1.35v0c0-.88-.61-1.35-1.59-1.35h-1.51V4.7Z',
                                    }),
                                    LogoBanner_jsx('path', {
                                        className: 'cls-1',
                                        d:
                                            'M109.75,4.69v0a4.72,4.72,0,0,1,9.44,0v0a4.72,4.72,0,0,1-9.44,0m7.4,0v0a2.7,2.7,0,0,0-2.69-2.79,2.65,2.65,0,0,0-2.67,2.76v0a2.7,2.7,0,0,0,2.69,2.79,2.65,2.65,0,0,0,2.67-2.76',
                                    }),
                                    LogoBanner_jsx('path', {
                                        className: 'cls-1',
                                        d:
                                            'M120.93.22H125a3.53,3.53,0,0,1,2.59.9,2.79,2.79,0,0,1,.76,2v0a2.76,2.76,0,0,1-1.91,2.76l2.18,3.17h-2.29l-1.9-2.84h-1.54V9.1h-2Zm3.94,4.31c.95,0,1.5-.51,1.5-1.25v0c0-.84-.59-1.27-1.54-1.27h-1.94V4.53Z',
                                    }),
                                    LogoBanner_jsx('polygon', {
                                        className: 'cls-1',
                                        points:
                                            '132.19 2.02 129.48 2.02 129.48 0.21 136.84 0.21 136.84 2.02 134.14 2.02 134.14 9.1 132.19 9.1 132.19 2.02',
                                    }),
                                    LogoBanner_jsx('polygon', {
                                        className: 'cls-1',
                                        points:
                                            '142.15 0.21 148.92 0.21 148.92 1.99 144.11 1.99 144.11 3.88 148.35 3.88 148.35 5.66 144.11 5.66 144.11 9.1 142.15 9.1 142.15 0.21',
                                    }),
                                    LogoBanner_jsx('path', {
                                        className: 'cls-1',
                                        d:
                                            'M150.09,4.69v0a4.73,4.73,0,0,1,9.45,0v0a4.73,4.73,0,0,1-9.45,0m7.4,0v0a2.69,2.69,0,0,0-2.69-2.79,2.66,2.66,0,0,0-2.67,2.76v0a2.7,2.7,0,0,0,2.7,2.79,2.65,2.65,0,0,0,2.66-2.76',
                                    }),
                                    LogoBanner_jsx('path', {
                                        className: 'cls-1',
                                        d:
                                            'M161.28.22h4.06a3.51,3.51,0,0,1,2.59.9,2.75,2.75,0,0,1,.76,2v0a2.76,2.76,0,0,1-1.9,2.76L169,9.1h-2.29l-1.9-2.84h-1.54V9.1h-1.95Zm3.93,4.31c1,0,1.5-.51,1.5-1.25v0c0-.84-.58-1.27-1.54-1.27h-1.94V4.53Z',
                                    }),
                                    LogoBanner_jsx('polygon', {
                                        className: 'cls-1',
                                        points:
                                            '176.34 2.02 173.63 2.02 173.63 0.21 181 0.21 181 2.02 178.29 2.02 178.29 9.1 176.34 9.1 176.34 2.02',
                                    }),
                                    LogoBanner_jsx('polygon', {
                                        className: 'cls-1',
                                        points:
                                            '182.5 0.21 184.45 0.21 184.45 3.73 188.06 3.73 188.06 0.21 190.01 0.21 190.01 9.1 188.06 9.1 188.06 5.54 184.45 5.54 184.45 9.1 182.5 9.1 182.5 0.21',
                                    }),
                                    LogoBanner_jsx('polygon', {
                                        className: 'cls-1',
                                        points:
                                            '192.15 0.21 198.85 0.21 198.85 1.95 194.09 1.95 194.09 3.76 198.28 3.76 198.28 5.5 194.09 5.5 194.09 7.36 198.91 7.36 198.91 9.1 192.15 9.1 192.15 0.21',
                                    }),
                                    LogoBanner_jsx('polygon', {
                                        className: 'cls-1',
                                        points:
                                            '81.78 45.3 78.14 45.3 59.99 22.25 59.99 45.3 55.42 45.3 55.42 14.37 59.52 14.37 77.21 36.87 77.21 14.37 81.78 14.37 81.78 45.3',
                                    }),
                                    LogoBanner_jsx('path', {
                                        className: 'cls-1',
                                        d:
                                            'M147,45.3h-5.75l-8.59-11.51h-7.48V45.3h-4.65V14.37h13.39c3.7,0,6.85,1.12,8.89,3.16a8.76,8.76,0,0,1,2.47,6.3v.08c0,4.52-2.8,7.84-7.55,9.06ZM125.17,29.48h8.45c4.23,0,7-2.14,7-5.44V24c0-3.29-2.52-5.18-6.92-5.18h-8.49Z',
                                    }),
                                    LogoBanner_jsx('polygon', {
                                        className: 'cls-1',
                                        points:
                                            '161.04 45.3 156.34 45.3 156.34 18.77 146.4 18.77 146.4 14.37 170.98 14.37 170.98 18.77 161.04 18.77 161.04 45.3',
                                    }),
                                    LogoBanner_jsx('polygon', {
                                        className: 'cls-1',
                                        points:
                                            '198.88 45.3 194.22 45.3 194.22 31.97 178.44 31.97 178.44 45.3 173.78 45.3 173.78 14.37 178.44 14.37 178.44 27.53 194.22 27.53 194.22 14.37 198.88 14.37 198.88 45.3',
                                    }),
                                    LogoBanner_jsx('path', {
                                        className: 'cls-1',
                                        d:
                                            'M101.11,46.49a16.11,16.11,0,0,1-11.87-5,16.78,16.78,0,0,1-4.52-11.61v-.08a16.87,16.87,0,0,1,4.56-11.66,16.7,16.7,0,0,1,23.79,0,16.79,16.79,0,0,1,4.51,11.61v.09A16.86,16.86,0,0,1,113,41.49a16.23,16.23,0,0,1-11.91,5m0-29.13c-6.73,0-11.81,5.33-11.81,12.39v.09c0,7.11,5.12,12.47,11.9,12.47S113,37,113,29.92v-.08c0-7.12-5.11-12.48-11.89-12.48',
                                    }),
                                    LogoBanner_jsx('path', {
                                        className: 'cls-1',
                                        d:
                                            'M26.65,45.46A2.06,2.06,0,0,1,25.33,45a2.1,2.1,0,0,1-.75-1.59V10.17a2.07,2.07,0,0,1,3.64-1.34L37,19.09a2.07,2.07,0,1,1-3.14,2.69l-5.13-6V40.73A18.95,18.95,0,0,0,26.28,4.1,2.07,2.07,0,1,1,27,0a23.08,23.08,0,0,1,0,45.39,2.45,2.45,0,0,1-.38,0',
                                    }),
                                    LogoBanner_jsx('path', {
                                        className: 'cls-2',
                                        d:
                                            'M19.25,45.46A2.06,2.06,0,0,0,20.57,45a2.1,2.1,0,0,0,.75-1.59V10.17a2.07,2.07,0,0,0-3.64-1.34L8.91,19.09a2.07,2.07,0,0,0,3.15,2.69l5.12-6V40.73A18.95,18.95,0,0,1,19.63,4.1,2.07,2.07,0,0,0,18.88,0a23.08,23.08,0,0,0,0,45.39,2.33,2.33,0,0,0,.37,0',
                                    }),
                                ),
                            ),
                        ),
                    ),
                );

            /* harmony default export */ var layout_LogoBanner = LogoBanner;
            // CONCATENATED MODULE: ./src/layout/Layout.tsx
            var Layout_jsx = react_default.a.createElement;

            const Layout_Layout = ({ title, description, children }) =>
                Layout_jsx(
                    'div',
                    null,
                    Layout_jsx(
                        head_default.a,
                        null,
                        Layout_jsx('link', {
                            rel: 'shortcut icon',
                            href: '/assets/images/favicon.ico',
                        }),
                        Layout_jsx('title', null, title || 'Fares Data Build Tool'),
                        Layout_jsx('meta', {
                            name: 'description',
                            content: description || 'Fares Data Build Tool',
                        }),
                        Layout_jsx('meta', {
                            name: 'viewport',
                            content: 'width=device-width, initial-scale=1',
                        }),
                        Layout_jsx('meta', {
                            charSet: 'utf-8',
                        }),
                    ),
                    Layout_jsx(layout_Header, null),
                    Layout_jsx(
                        'div',
                        {
                            className: 'govuk-width-container app-width-container--wide',
                        },
                        Layout_jsx(layout_AlphaBanner, null),
                        Layout_jsx('div', {
                            className: 'dftlogo',
                        }),
                        Layout_jsx(layout_LogoBanner, null),
                        children,
                    ),
                    Layout_jsx(layout_Footer, null),
                );

            /* harmony default export */ var layout_Layout = (__webpack_exports__['a'] = Layout_Layout);

            /***/
        },

        /***/ AXZJ: /***/ function(module, exports, __webpack_require__) {
            'use strict';
            exports.__esModule = true;
            exports.htmlEscapeJsonString = htmlEscapeJsonString; // This utility is based on https://github.com/zertosh/htmlescape
            // License: https://github.com/zertosh/htmlescape/blob/0527ca7156a524d256101bb310a9f970f63078ad/LICENSE
            const ESCAPE_LOOKUP = {
                '&': '\\u0026',
                '>': '\\u003e',
                '<': '\\u003c',
                '\u2028': '\\u2028',
                '\u2029': '\\u2029',
            };
            const ESCAPE_REGEX = /[&><\u2028\u2029]/g;
            function htmlEscapeJsonString(str) {
                return str.replace(ESCAPE_REGEX, match => ESCAPE_LOOKUP[match]);
            }

            /***/
        },

        /***/ B5Ud: /***/ function(module, exports, __webpack_require__) {
            'use strict';

            var _interopRequireDefault = __webpack_require__('KI45');

            exports.__esModule = true;
            exports.Container = Container;
            exports.createUrl = createUrl;
            exports.default = void 0;

            var _react = _interopRequireDefault(__webpack_require__('q1tI'));

            var _utils = __webpack_require__('g/15');

            exports.AppInitialProps = _utils.AppInitialProps;
            /**
             * `App` component is used for initialize of pages. It allows for overwriting and full control of the `page` initialization.
             * This allows for keeping state between navigation, custom error handling, injecting additional data.
             */

            async function appGetInitialProps(_ref) {
                var { Component, ctx } = _ref;
                var pageProps = await (0, _utils.loadGetInitialProps)(Component, ctx);
                return {
                    pageProps,
                };
            }

            class App extends _react.default.Component {
                // Kept here for backwards compatibility.
                // When someone ended App they could call `super.componentDidCatch`.
                // @deprecated This method is no longer needed. Errors are caught at the top level
                componentDidCatch(error, _errorInfo) {
                    throw error;
                }

                render() {
                    var { router, Component, pageProps } = this.props;
                    var url = createUrl(router);
                    return _react.default.createElement(
                        Component,
                        Object.assign({}, pageProps, {
                            url: url,
                        }),
                    );
                }
            }

            exports.default = App;
            App.origGetInitialProps = appGetInitialProps;
            App.getInitialProps = appGetInitialProps;
            var warnContainer;
            var warnUrl;

            if (false) {
            } // @deprecated noop for now until removal

            function Container(p) {
                if (false) {
                }
                return p.children;
            }

            function createUrl(router) {
                // This is to make sure we don't references the router object at call time
                var { pathname, asPath, query } = router;
                return {
                    get query() {
                        if (false) {
                        }
                        return query;
                    },

                    get pathname() {
                        if (false) {
                        }
                        return pathname;
                    },

                    get asPath() {
                        if (false) {
                        }
                        return asPath;
                    },

                    back: () => {
                        if (false) {
                        }
                        router.back();
                    },
                    push: (url, as) => {
                        if (false) {
                        }
                        return router.push(url, as);
                    },
                    pushTo: (href, as) => {
                        if (false) {
                        }
                        var pushRoute = as ? href : '';
                        var pushUrl = as || href;
                        return router.push(pushRoute, pushUrl);
                    },
                    replace: (url, as) => {
                        if (false) {
                        }
                        return router.replace(url, as);
                    },
                    replaceTo: (href, as) => {
                        if (false) {
                        }
                        var replaceRoute = as ? href : '';
                        var replaceUrl = as || href;
                        return router.replace(replaceRoute, replaceUrl);
                    },
                };
            }

            /***/
        },

        /***/ BMJj: /***/ function(module, exports, __webpack_require__) {
            'use strict';
            /*!
             * fresh
             * Copyright(c) 2012 TJ Holowaychuk
             * Copyright(c) 2016-2017 Douglas Christopher Wilson
             * MIT Licensed
             */

            /**
             * RegExp to check for no-cache token in Cache-Control.
             * @private
             */

            var CACHE_CONTROL_NO_CACHE_REGEXP = /(?:^|,)\s*?no-cache\s*?(?:,|$)/;

            /**
             * Module exports.
             * @public
             */

            module.exports = fresh;

            /**
             * Check freshness of the response using request and response headers.
             *
             * @param {Object} reqHeaders
             * @param {Object} resHeaders
             * @return {Boolean}
             * @public
             */

            function fresh(reqHeaders, resHeaders) {
                // fields
                var modifiedSince = reqHeaders['if-modified-since'];
                var noneMatch = reqHeaders['if-none-match'];

                // unconditional request
                if (!modifiedSince && !noneMatch) {
                    return false;
                }

                // Always return stale when Cache-Control: no-cache
                // to support end-to-end reload requests
                // https://tools.ietf.org/html/rfc2616#section-14.9.4
                var cacheControl = reqHeaders['cache-control'];
                if (cacheControl && CACHE_CONTROL_NO_CACHE_REGEXP.test(cacheControl)) {
                    return false;
                }

                // if-none-match
                if (noneMatch && noneMatch !== '*') {
                    var etag = resHeaders['etag'];

                    if (!etag) {
                        return false;
                    }

                    var etagStale = true;
                    var matches = parseTokenList(noneMatch);
                    for (var i = 0; i < matches.length; i++) {
                        var match = matches[i];
                        if (match === etag || match === 'W/' + etag || 'W/' + match === etag) {
                            etagStale = false;
                            break;
                        }
                    }

                    if (etagStale) {
                        return false;
                    }
                }

                // if-modified-since
                if (modifiedSince) {
                    var lastModified = resHeaders['last-modified'];
                    var modifiedStale = !lastModified || !(parseHttpDate(lastModified) <= parseHttpDate(modifiedSince));

                    if (modifiedStale) {
                        return false;
                    }
                }

                return true;
            }

            /**
             * Parse an HTTP Date into a number.
             *
             * @param {string} date
             * @private
             */

            function parseHttpDate(date) {
                var timestamp = date && Date.parse(date);

                // istanbul ignore next: guard against date.js Date.parse patching
                return typeof timestamp === 'number' ? timestamp : NaN;
            }

            /**
             * Parse a HTTP token list.
             *
             * @param {string} str
             * @private
             */

            function parseTokenList(str) {
                var end = 0;
                var list = [];
                var start = 0;

                // gather tokens
                for (var i = 0, len = str.length; i < len; i++) {
                    switch (str.charCodeAt(i)) {
                        case 0x20 /*   */:
                            if (start === end) {
                                start = end = i + 1;
                            }
                            break;
                        case 0x2c /* , */:
                            list.push(str.substring(start, end));
                            start = end = i + 1;
                            break;
                        default:
                            end = i + 1;
                            break;
                    }
                }

                // final token
                list.push(str.substring(start, end));

                return list;
            }

            /***/
        },

        /***/ 'D9K+': /***/ function(module, exports, __webpack_require__) {
            'use strict';

            Object.defineProperty(exports, '__esModule', { value: true });
            /**
             * Tokenize input string.
             */
            function lexer(str) {
                var tokens = [];
                var i = 0;
                while (i < str.length) {
                    var char = str[i];
                    if (char === '*' || char === '+' || char === '?') {
                        tokens.push({ type: 'MODIFIER', index: i, value: str[i++] });
                        continue;
                    }
                    if (char === '\\') {
                        tokens.push({ type: 'ESCAPED_CHAR', index: i++, value: str[i++] });
                        continue;
                    }
                    if (char === '{') {
                        tokens.push({ type: 'OPEN', index: i, value: str[i++] });
                        continue;
                    }
                    if (char === '}') {
                        tokens.push({ type: 'CLOSE', index: i, value: str[i++] });
                        continue;
                    }
                    if (char === ':') {
                        var name = '';
                        var j = i + 1;
                        while (j < str.length) {
                            var code = str.charCodeAt(j);
                            if (
                                // `0-9`
                                (code >= 48 && code <= 57) ||
                                // `A-Z`
                                (code >= 65 && code <= 90) ||
                                // `a-z`
                                (code >= 97 && code <= 122) ||
                                // `_`
                                code === 95
                            ) {
                                name += str[j++];
                                continue;
                            }
                            break;
                        }
                        if (!name) throw new TypeError('Missing parameter name at ' + i);
                        tokens.push({ type: 'NAME', index: i, value: name });
                        i = j;
                        continue;
                    }
                    if (char === '(') {
                        var count = 1;
                        var pattern = '';
                        var j = i + 1;
                        if (str[j] === '?') {
                            throw new TypeError('Pattern cannot start with "?" at ' + j);
                        }
                        while (j < str.length) {
                            if (str[j] === '\\') {
                                pattern += str[j++] + str[j++];
                                continue;
                            }
                            if (str[j] === ')') {
                                count--;
                                if (count === 0) {
                                    j++;
                                    break;
                                }
                            } else if (str[j] === '(') {
                                count++;
                                if (str[j + 1] !== '?') {
                                    throw new TypeError('Capturing groups are not allowed at ' + j);
                                }
                            }
                            pattern += str[j++];
                        }
                        if (count) throw new TypeError('Unbalanced pattern at ' + i);
                        if (!pattern) throw new TypeError('Missing pattern at ' + i);
                        tokens.push({ type: 'PATTERN', index: i, value: pattern });
                        i = j;
                        continue;
                    }
                    tokens.push({ type: 'CHAR', index: i, value: str[i++] });
                }
                tokens.push({ type: 'END', index: i, value: '' });
                return tokens;
            }
            /**
             * Parse a string for the raw tokens.
             */
            function parse(str, options) {
                if (options === void 0) {
                    options = {};
                }
                var tokens = lexer(str);
                var _a = options.prefixes,
                    prefixes = _a === void 0 ? './' : _a;
                var defaultPattern = '[^' + escapeString(options.delimiter || '/#?') + ']+?';
                var result = [];
                var key = 0;
                var i = 0;
                var path = '';
                var tryConsume = function(type) {
                    if (i < tokens.length && tokens[i].type === type) return tokens[i++].value;
                };
                var mustConsume = function(type) {
                    var value = tryConsume(type);
                    if (value !== undefined) return value;
                    var _a = tokens[i],
                        nextType = _a.type,
                        index = _a.index;
                    throw new TypeError('Unexpected ' + nextType + ' at ' + index + ', expected ' + type);
                };
                var consumeText = function() {
                    var result = '';
                    var value;
                    // tslint:disable-next-line
                    while ((value = tryConsume('CHAR') || tryConsume('ESCAPED_CHAR'))) {
                        result += value;
                    }
                    return result;
                };
                while (i < tokens.length) {
                    var char = tryConsume('CHAR');
                    var name = tryConsume('NAME');
                    var pattern = tryConsume('PATTERN');
                    if (name || pattern) {
                        var prefix = char || '';
                        if (prefixes.indexOf(prefix) === -1) {
                            path += prefix;
                            prefix = '';
                        }
                        if (path) {
                            result.push(path);
                            path = '';
                        }
                        result.push({
                            name: name || key++,
                            prefix: prefix,
                            suffix: '',
                            pattern: pattern || defaultPattern,
                            modifier: tryConsume('MODIFIER') || '',
                        });
                        continue;
                    }
                    var value = char || tryConsume('ESCAPED_CHAR');
                    if (value) {
                        path += value;
                        continue;
                    }
                    if (path) {
                        result.push(path);
                        path = '';
                    }
                    var open = tryConsume('OPEN');
                    if (open) {
                        var prefix = consumeText();
                        var name_1 = tryConsume('NAME') || '';
                        var pattern_1 = tryConsume('PATTERN') || '';
                        var suffix = consumeText();
                        mustConsume('CLOSE');
                        result.push({
                            name: name_1 || (pattern_1 ? key++ : ''),
                            pattern: name_1 && !pattern_1 ? defaultPattern : pattern_1,
                            prefix: prefix,
                            suffix: suffix,
                            modifier: tryConsume('MODIFIER') || '',
                        });
                        continue;
                    }
                    mustConsume('END');
                }
                return result;
            }
            exports.parse = parse;
            /**
             * Compile a string to a template function for the path.
             */
            function compile(str, options) {
                return tokensToFunction(parse(str, options), options);
            }
            exports.compile = compile;
            /**
             * Expose a method for transforming tokens into the path function.
             */
            function tokensToFunction(tokens, options) {
                if (options === void 0) {
                    options = {};
                }
                var reFlags = flags(options);
                var _a = options.encode,
                    encode =
                        _a === void 0
                            ? function(x) {
                                  return x;
                              }
                            : _a,
                    _b = options.validate,
                    validate = _b === void 0 ? true : _b;
                // Compile all the tokens into regexps.
                var matches = tokens.map(function(token) {
                    if (typeof token === 'object') {
                        return new RegExp('^(?:' + token.pattern + ')$', reFlags);
                    }
                });
                return function(data) {
                    var path = '';
                    for (var i = 0; i < tokens.length; i++) {
                        var token = tokens[i];
                        if (typeof token === 'string') {
                            path += token;
                            continue;
                        }
                        var value = data ? data[token.name] : undefined;
                        var optional = token.modifier === '?' || token.modifier === '*';
                        var repeat = token.modifier === '*' || token.modifier === '+';
                        if (Array.isArray(value)) {
                            if (!repeat) {
                                throw new TypeError('Expected "' + token.name + '" to not repeat, but got an array');
                            }
                            if (value.length === 0) {
                                if (optional) continue;
                                throw new TypeError('Expected "' + token.name + '" to not be empty');
                            }
                            for (var j = 0; j < value.length; j++) {
                                var segment = encode(value[j], token);
                                if (validate && !matches[i].test(segment)) {
                                    throw new TypeError(
                                        'Expected all "' +
                                            token.name +
                                            '" to match "' +
                                            token.pattern +
                                            '", but got "' +
                                            segment +
                                            '"',
                                    );
                                }
                                path += token.prefix + segment + token.suffix;
                            }
                            continue;
                        }
                        if (typeof value === 'string' || typeof value === 'number') {
                            var segment = encode(String(value), token);
                            if (validate && !matches[i].test(segment)) {
                                throw new TypeError(
                                    'Expected "' +
                                        token.name +
                                        '" to match "' +
                                        token.pattern +
                                        '", but got "' +
                                        segment +
                                        '"',
                                );
                            }
                            path += token.prefix + segment + token.suffix;
                            continue;
                        }
                        if (optional) continue;
                        var typeOfMessage = repeat ? 'an array' : 'a string';
                        throw new TypeError('Expected "' + token.name + '" to be ' + typeOfMessage);
                    }
                    return path;
                };
            }
            exports.tokensToFunction = tokensToFunction;
            /**
             * Create path match function from `path-to-regexp` spec.
             */
            function match(str, options) {
                var keys = [];
                var re = pathToRegexp(str, keys, options);
                return regexpToFunction(re, keys, options);
            }
            exports.match = match;
            /**
             * Create a path match function from `path-to-regexp` output.
             */
            function regexpToFunction(re, keys, options) {
                if (options === void 0) {
                    options = {};
                }
                var _a = options.decode,
                    decode =
                        _a === void 0
                            ? function(x) {
                                  return x;
                              }
                            : _a;
                return function(pathname) {
                    var m = re.exec(pathname);
                    if (!m) return false;
                    var path = m[0],
                        index = m.index;
                    var params = Object.create(null);
                    var _loop_1 = function(i) {
                        // tslint:disable-next-line
                        if (m[i] === undefined) return 'continue';
                        var key = keys[i - 1];
                        if (key.modifier === '*' || key.modifier === '+') {
                            params[key.name] = m[i].split(key.prefix + key.suffix).map(function(value) {
                                return decode(value, key);
                            });
                        } else {
                            params[key.name] = decode(m[i], key);
                        }
                    };
                    for (var i = 1; i < m.length; i++) {
                        _loop_1(i);
                    }
                    return { path: path, index: index, params: params };
                };
            }
            exports.regexpToFunction = regexpToFunction;
            /**
             * Escape a regular expression string.
             */
            function escapeString(str) {
                return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, '\\$1');
            }
            /**
             * Get the flags for a regexp from the options.
             */
            function flags(options) {
                return options && options.sensitive ? '' : 'i';
            }
            /**
             * Pull out keys from a regexp.
             */
            function regexpToRegexp(path, keys) {
                if (!keys) return path;
                // Use a negative lookahead to match only capturing groups.
                var groups = path.source.match(/\((?!\?)/g);
                if (groups) {
                    for (var i = 0; i < groups.length; i++) {
                        keys.push({
                            name: i,
                            prefix: '',
                            suffix: '',
                            modifier: '',
                            pattern: '',
                        });
                    }
                }
                return path;
            }
            /**
             * Transform an array into a regexp.
             */
            function arrayToRegexp(paths, keys, options) {
                var parts = paths.map(function(path) {
                    return pathToRegexp(path, keys, options).source;
                });
                return new RegExp('(?:' + parts.join('|') + ')', flags(options));
            }
            /**
             * Create a path regexp from string input.
             */
            function stringToRegexp(path, keys, options) {
                return tokensToRegexp(parse(path, options), keys, options);
            }
            /**
             * Expose a function for taking tokens and returning a RegExp.
             */
            function tokensToRegexp(tokens, keys, options) {
                if (options === void 0) {
                    options = {};
                }
                var _a = options.strict,
                    strict = _a === void 0 ? false : _a,
                    _b = options.start,
                    start = _b === void 0 ? true : _b,
                    _c = options.end,
                    end = _c === void 0 ? true : _c,
                    _d = options.encode,
                    encode =
                        _d === void 0
                            ? function(x) {
                                  return x;
                              }
                            : _d;
                var endsWith = '[' + escapeString(options.endsWith || '') + ']|$';
                var delimiter = '[' + escapeString(options.delimiter || '/#?') + ']';
                var route = start ? '^' : '';
                // Iterate over the tokens and create our regexp string.
                for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
                    var token = tokens_1[_i];
                    if (typeof token === 'string') {
                        route += escapeString(encode(token));
                    } else {
                        var prefix = escapeString(encode(token.prefix));
                        var suffix = escapeString(encode(token.suffix));
                        if (token.pattern) {
                            if (keys) keys.push(token);
                            if (prefix || suffix) {
                                if (token.modifier === '+' || token.modifier === '*') {
                                    var mod = token.modifier === '*' ? '?' : '';
                                    route +=
                                        '(?:' +
                                        prefix +
                                        '((?:' +
                                        token.pattern +
                                        ')(?:' +
                                        suffix +
                                        prefix +
                                        '(?:' +
                                        token.pattern +
                                        '))*)' +
                                        suffix +
                                        ')' +
                                        mod;
                                } else {
                                    route += '(?:' + prefix + '(' + token.pattern + ')' + suffix + ')' + token.modifier;
                                }
                            } else {
                                route += '(' + token.pattern + ')' + token.modifier;
                            }
                        } else {
                            route += '(?:' + prefix + suffix + ')' + token.modifier;
                        }
                    }
                }
                if (end) {
                    if (!strict) route += delimiter + '?';
                    route += !options.endsWith ? '$' : '(?=' + endsWith + ')';
                } else {
                    var endToken = tokens[tokens.length - 1];
                    var isEndDelimited =
                        typeof endToken === 'string'
                            ? delimiter.indexOf(endToken[endToken.length - 1]) > -1
                            : // tslint:disable-next-line
                              endToken === undefined;
                    if (!strict) {
                        route += '(?:' + delimiter + '(?=' + endsWith + '))?';
                    }
                    if (!isEndDelimited) {
                        route += '(?=' + delimiter + '|' + endsWith + ')';
                    }
                }
                return new RegExp(route, flags(options));
            }
            exports.tokensToRegexp = tokensToRegexp;
            /**
             * Normalize the given path string, returning a regular expression.
             *
             * An empty array can be passed in for the keys, which will hold the
             * placeholder key descriptions. For example, using `/user/:id`, `keys` will
             * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
             */
            function pathToRegexp(path, keys, options) {
                if (path instanceof RegExp) return regexpToRegexp(path, keys);
                if (Array.isArray(path)) return arrayToRegexp(path, keys, options);
                return stringToRegexp(path, keys, options);
            }
            exports.pathToRegexp = pathToRegexp;
            //# sourceMappingURL=index.js.map

            /***/
        },

        /***/ DTay: /***/ function(module, exports, __webpack_require__) {
            module.exports = __webpack_require__('nWF0');

            /***/
        },

        /***/ FDah: /***/ function(module, exports, __webpack_require__) {
            'use strict';
            /** @license React v16.12.0
             * react-dom-server.node.production.min.js
             *
             * Copyright (c) Facebook, Inc. and its affiliates.
             *
             * This source code is licensed under the MIT license found in the
             * LICENSE file in the root directory of this source tree.
             */

            var k = __webpack_require__('MgzW'),
                m = __webpack_require__('q1tI'),
                aa = __webpack_require__('msIP');
            function r(a) {
                for (
                    var b = 'https://reactjs.org/docs/error-decoder.html?invariant=' + a, c = 1;
                    c < arguments.length;
                    c++
                )
                    b += '&args[]=' + encodeURIComponent(arguments[c]);
                return (
                    'Minified React error #' +
                    a +
                    '; visit ' +
                    b +
                    ' for the full message or use the non-minified dev environment for full errors and additional helpful warnings.'
                );
            }
            var u = 'function' === typeof Symbol && Symbol.for,
                ba = u ? Symbol.for('react.portal') : 60106,
                v = u ? Symbol.for('react.fragment') : 60107,
                ca = u ? Symbol.for('react.strict_mode') : 60108,
                da = u ? Symbol.for('react.profiler') : 60114,
                x = u ? Symbol.for('react.provider') : 60109,
                ea = u ? Symbol.for('react.context') : 60110,
                fa = u ? Symbol.for('react.concurrent_mode') : 60111,
                ha = u ? Symbol.for('react.forward_ref') : 60112,
                B = u ? Symbol.for('react.suspense') : 60113,
                ia = u ? Symbol.for('react.suspense_list') : 60120,
                ja = u ? Symbol.for('react.memo') : 60115,
                ka = u ? Symbol.for('react.lazy') : 60116,
                la = u ? Symbol.for('react.fundamental') : 60117,
                ma = u ? Symbol.for('react.scope') : 60119,
                C = m.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
            C.hasOwnProperty('ReactCurrentDispatcher') || (C.ReactCurrentDispatcher = { current: null });
            C.hasOwnProperty('ReactCurrentBatchConfig') || (C.ReactCurrentBatchConfig = { suspense: null });
            function na(a) {
                if (-1 === a._status) {
                    a._status = 0;
                    var b = a._ctor;
                    b = b();
                    a._result = b;
                    b.then(
                        function(c) {
                            0 === a._status && ((c = c.default), (a._status = 1), (a._result = c));
                        },
                        function(c) {
                            0 === a._status && ((a._status = 2), (a._result = c));
                        },
                    );
                }
            }
            function D(a) {
                if (null == a) return null;
                if ('function' === typeof a) return a.displayName || a.name || null;
                if ('string' === typeof a) return a;
                switch (a) {
                    case v:
                        return 'Fragment';
                    case ba:
                        return 'Portal';
                    case da:
                        return 'Profiler';
                    case ca:
                        return 'StrictMode';
                    case B:
                        return 'Suspense';
                    case ia:
                        return 'SuspenseList';
                }
                if ('object' === typeof a)
                    switch (a.$$typeof) {
                        case ea:
                            return 'Context.Consumer';
                        case x:
                            return 'Context.Provider';
                        case ha:
                            var b = a.render;
                            b = b.displayName || b.name || '';
                            return a.displayName || ('' !== b ? 'ForwardRef(' + b + ')' : 'ForwardRef');
                        case ja:
                            return D(a.type);
                        case ka:
                            if ((a = 1 === a._status ? a._result : null)) return D(a);
                    }
                return null;
            }
            var oa = {};
            function E(a, b) {
                for (var c = a._threadCount | 0; c <= b; c++) (a[c] = a._currentValue2), (a._threadCount = c + 1);
            }
            function pa(a, b, c, d) {
                if (d && ((d = a.contextType), 'object' === typeof d && null !== d)) return E(d, c), d[c];
                if ((a = a.contextTypes)) {
                    c = {};
                    for (var f in a) c[f] = b[f];
                    b = c;
                } else b = oa;
                return b;
            }
            for (var F = new Uint16Array(16), H = 0; 15 > H; H++) F[H] = H + 1;
            F[15] = 0;
            var qa = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,
                ra = Object.prototype.hasOwnProperty,
                sa = {},
                ta = {};
            function ua(a) {
                if (ra.call(ta, a)) return !0;
                if (ra.call(sa, a)) return !1;
                if (qa.test(a)) return (ta[a] = !0);
                sa[a] = !0;
                return !1;
            }
            function va(a, b, c, d) {
                if (null !== c && 0 === c.type) return !1;
                switch (typeof b) {
                    case 'function':
                    case 'symbol':
                        return !0;
                    case 'boolean':
                        if (d) return !1;
                        if (null !== c) return !c.acceptsBooleans;
                        a = a.toLowerCase().slice(0, 5);
                        return 'data-' !== a && 'aria-' !== a;
                    default:
                        return !1;
                }
            }
            function wa(a, b, c, d) {
                if (null === b || 'undefined' === typeof b || va(a, b, c, d)) return !0;
                if (d) return !1;
                if (null !== c)
                    switch (c.type) {
                        case 3:
                            return !b;
                        case 4:
                            return !1 === b;
                        case 5:
                            return isNaN(b);
                        case 6:
                            return isNaN(b) || 1 > b;
                    }
                return !1;
            }
            function J(a, b, c, d, f, h) {
                this.acceptsBooleans = 2 === b || 3 === b || 4 === b;
                this.attributeName = d;
                this.attributeNamespace = f;
                this.mustUseProperty = c;
                this.propertyName = a;
                this.type = b;
                this.sanitizeURL = h;
            }
            var K = {};
            'children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style'
                .split(' ')
                .forEach(function(a) {
                    K[a] = new J(a, 0, !1, a, null, !1);
                });
            [
                ['acceptCharset', 'accept-charset'],
                ['className', 'class'],
                ['htmlFor', 'for'],
                ['httpEquiv', 'http-equiv'],
            ].forEach(function(a) {
                var b = a[0];
                K[b] = new J(b, 1, !1, a[1], null, !1);
            });
            ['contentEditable', 'draggable', 'spellCheck', 'value'].forEach(function(a) {
                K[a] = new J(a, 2, !1, a.toLowerCase(), null, !1);
            });
            ['autoReverse', 'externalResourcesRequired', 'focusable', 'preserveAlpha'].forEach(function(a) {
                K[a] = new J(a, 2, !1, a, null, !1);
            });
            'allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope'
                .split(' ')
                .forEach(function(a) {
                    K[a] = new J(a, 3, !1, a.toLowerCase(), null, !1);
                });
            ['checked', 'multiple', 'muted', 'selected'].forEach(function(a) {
                K[a] = new J(a, 3, !0, a, null, !1);
            });
            ['capture', 'download'].forEach(function(a) {
                K[a] = new J(a, 4, !1, a, null, !1);
            });
            ['cols', 'rows', 'size', 'span'].forEach(function(a) {
                K[a] = new J(a, 6, !1, a, null, !1);
            });
            ['rowSpan', 'start'].forEach(function(a) {
                K[a] = new J(a, 5, !1, a.toLowerCase(), null, !1);
            });
            var L = /[\-:]([a-z])/g;
            function M(a) {
                return a[1].toUpperCase();
            }
            'accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height'
                .split(' ')
                .forEach(function(a) {
                    var b = a.replace(L, M);
                    K[b] = new J(b, 1, !1, a, null, !1);
                });
            'xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type'.split(' ').forEach(function(a) {
                var b = a.replace(L, M);
                K[b] = new J(b, 1, !1, a, 'http://www.w3.org/1999/xlink', !1);
            });
            ['xml:base', 'xml:lang', 'xml:space'].forEach(function(a) {
                var b = a.replace(L, M);
                K[b] = new J(b, 1, !1, a, 'http://www.w3.org/XML/1998/namespace', !1);
            });
            ['tabIndex', 'crossOrigin'].forEach(function(a) {
                K[a] = new J(a, 1, !1, a.toLowerCase(), null, !1);
            });
            K.xlinkHref = new J('xlinkHref', 1, !1, 'xlink:href', 'http://www.w3.org/1999/xlink', !0);
            ['src', 'href', 'action', 'formAction'].forEach(function(a) {
                K[a] = new J(a, 1, !1, a.toLowerCase(), null, !0);
            });
            var xa = /["'&<>]/;
            function N(a) {
                if ('boolean' === typeof a || 'number' === typeof a) return '' + a;
                a = '' + a;
                var b = xa.exec(a);
                if (b) {
                    var c = '',
                        d,
                        f = 0;
                    for (d = b.index; d < a.length; d++) {
                        switch (a.charCodeAt(d)) {
                            case 34:
                                b = '&quot;';
                                break;
                            case 38:
                                b = '&amp;';
                                break;
                            case 39:
                                b = '&#x27;';
                                break;
                            case 60:
                                b = '&lt;';
                                break;
                            case 62:
                                b = '&gt;';
                                break;
                            default:
                                continue;
                        }
                        f !== d && (c += a.substring(f, d));
                        f = d + 1;
                        c += b;
                    }
                    a = f !== d ? c + a.substring(f, d) : c;
                }
                return a;
            }
            function ya(a, b) {
                var c = K.hasOwnProperty(a) ? K[a] : null;
                var d;
                if ((d = 'style' !== a))
                    d =
                        null !== c
                            ? 0 === c.type
                            : !(2 < a.length) || ('o' !== a[0] && 'O' !== a[0]) || ('n' !== a[1] && 'N' !== a[1])
                            ? !1
                            : !0;
                if (d || wa(a, b, c, !1)) return '';
                if (null !== c) {
                    a = c.attributeName;
                    d = c.type;
                    if (3 === d || (4 === d && !0 === b)) return a + '=""';
                    c.sanitizeURL && (b = '' + b);
                    return a + '=' + ('"' + N(b) + '"');
                }
                return ua(a) ? a + '=' + ('"' + N(b) + '"') : '';
            }
            function za(a, b) {
                return (a === b && (0 !== a || 1 / a === 1 / b)) || (a !== a && b !== b);
            }
            var Aa = 'function' === typeof Object.is ? Object.is : za,
                O = null,
                P = null,
                Q = null,
                R = !1,
                S = !1,
                U = null,
                V = 0;
            function W() {
                if (null === O) throw Error(r(321));
                return O;
            }
            function Ba() {
                if (0 < V) throw Error(r(312));
                return { memoizedState: null, queue: null, next: null };
            }
            function Ca() {
                null === Q
                    ? null === P
                        ? ((R = !1), (P = Q = Ba()))
                        : ((R = !0), (Q = P))
                    : null === Q.next
                    ? ((R = !1), (Q = Q.next = Ba()))
                    : ((R = !0), (Q = Q.next));
                return Q;
            }
            function Da(a, b, c, d) {
                for (; S; ) (S = !1), (V += 1), (Q = null), (c = a(b, d));
                P = O = null;
                V = 0;
                Q = U = null;
                return c;
            }
            function Ea(a, b) {
                return 'function' === typeof b ? b(a) : b;
            }
            function Fa(a, b, c) {
                O = W();
                Q = Ca();
                if (R) {
                    var d = Q.queue;
                    b = d.dispatch;
                    if (null !== U && ((c = U.get(d)), void 0 !== c)) {
                        U.delete(d);
                        d = Q.memoizedState;
                        do (d = a(d, c.action)), (c = c.next);
                        while (null !== c);
                        Q.memoizedState = d;
                        return [d, b];
                    }
                    return [Q.memoizedState, b];
                }
                a = a === Ea ? ('function' === typeof b ? b() : b) : void 0 !== c ? c(b) : b;
                Q.memoizedState = a;
                a = Q.queue = { last: null, dispatch: null };
                a = a.dispatch = Ga.bind(null, O, a);
                return [Q.memoizedState, a];
            }
            function Ga(a, b, c) {
                if (!(25 > V)) throw Error(r(301));
                if (a === O)
                    if (
                        ((S = !0),
                        (a = { action: c, next: null }),
                        null === U && (U = new Map()),
                        (c = U.get(b)),
                        void 0 === c)
                    )
                        U.set(b, a);
                    else {
                        for (b = c; null !== b.next; ) b = b.next;
                        b.next = a;
                    }
            }
            function Ha() {}
            var X = 0,
                Ia = {
                    readContext: function(a) {
                        var b = X;
                        E(a, b);
                        return a[b];
                    },
                    useContext: function(a) {
                        W();
                        var b = X;
                        E(a, b);
                        return a[b];
                    },
                    useMemo: function(a, b) {
                        O = W();
                        Q = Ca();
                        b = void 0 === b ? null : b;
                        if (null !== Q) {
                            var c = Q.memoizedState;
                            if (null !== c && null !== b) {
                                a: {
                                    var d = c[1];
                                    if (null === d) d = !1;
                                    else {
                                        for (var f = 0; f < d.length && f < b.length; f++)
                                            if (!Aa(b[f], d[f])) {
                                                d = !1;
                                                break a;
                                            }
                                        d = !0;
                                    }
                                }
                                if (d) return c[0];
                            }
                        }
                        a = a();
                        Q.memoizedState = [a, b];
                        return a;
                    },
                    useReducer: Fa,
                    useRef: function(a) {
                        O = W();
                        Q = Ca();
                        var b = Q.memoizedState;
                        return null === b ? ((a = { current: a }), (Q.memoizedState = a)) : b;
                    },
                    useState: function(a) {
                        return Fa(Ea, a);
                    },
                    useLayoutEffect: function() {},
                    useCallback: function(a) {
                        return a;
                    },
                    useImperativeHandle: Ha,
                    useEffect: Ha,
                    useDebugValue: Ha,
                    useResponder: function(a, b) {
                        return { props: b, responder: a };
                    },
                    useDeferredValue: function(a) {
                        W();
                        return a;
                    },
                    useTransition: function() {
                        W();
                        return [
                            function(a) {
                                a();
                            },
                            !1,
                        ];
                    },
                },
                Ja = {
                    html: 'http://www.w3.org/1999/xhtml',
                    mathml: 'http://www.w3.org/1998/Math/MathML',
                    svg: 'http://www.w3.org/2000/svg',
                };
            function Ka(a) {
                switch (a) {
                    case 'svg':
                        return 'http://www.w3.org/2000/svg';
                    case 'math':
                        return 'http://www.w3.org/1998/Math/MathML';
                    default:
                        return 'http://www.w3.org/1999/xhtml';
                }
            }
            var La = {
                    area: !0,
                    base: !0,
                    br: !0,
                    col: !0,
                    embed: !0,
                    hr: !0,
                    img: !0,
                    input: !0,
                    keygen: !0,
                    link: !0,
                    meta: !0,
                    param: !0,
                    source: !0,
                    track: !0,
                    wbr: !0,
                },
                Ma = k({ menuitem: !0 }, La),
                Y = {
                    animationIterationCount: !0,
                    borderImageOutset: !0,
                    borderImageSlice: !0,
                    borderImageWidth: !0,
                    boxFlex: !0,
                    boxFlexGroup: !0,
                    boxOrdinalGroup: !0,
                    columnCount: !0,
                    columns: !0,
                    flex: !0,
                    flexGrow: !0,
                    flexPositive: !0,
                    flexShrink: !0,
                    flexNegative: !0,
                    flexOrder: !0,
                    gridArea: !0,
                    gridRow: !0,
                    gridRowEnd: !0,
                    gridRowSpan: !0,
                    gridRowStart: !0,
                    gridColumn: !0,
                    gridColumnEnd: !0,
                    gridColumnSpan: !0,
                    gridColumnStart: !0,
                    fontWeight: !0,
                    lineClamp: !0,
                    lineHeight: !0,
                    opacity: !0,
                    order: !0,
                    orphans: !0,
                    tabSize: !0,
                    widows: !0,
                    zIndex: !0,
                    zoom: !0,
                    fillOpacity: !0,
                    floodOpacity: !0,
                    stopOpacity: !0,
                    strokeDasharray: !0,
                    strokeDashoffset: !0,
                    strokeMiterlimit: !0,
                    strokeOpacity: !0,
                    strokeWidth: !0,
                },
                Na = ['Webkit', 'ms', 'Moz', 'O'];
            Object.keys(Y).forEach(function(a) {
                Na.forEach(function(b) {
                    b = b + a.charAt(0).toUpperCase() + a.substring(1);
                    Y[b] = Y[a];
                });
            });
            var Oa = /([A-Z])/g,
                Pa = /^ms-/,
                Z = m.Children.toArray,
                Qa = C.ReactCurrentDispatcher,
                Ra = { listing: !0, pre: !0, textarea: !0 },
                Sa = /^[a-zA-Z][a-zA-Z:_\.\-\d]*$/,
                Ta = {},
                Ua = {};
            function Va(a) {
                if (void 0 === a || null === a) return a;
                var b = '';
                m.Children.forEach(a, function(a) {
                    null != a && (b += a);
                });
                return b;
            }
            var Wa = Object.prototype.hasOwnProperty,
                Xa = {
                    children: null,
                    dangerouslySetInnerHTML: null,
                    suppressContentEditableWarning: null,
                    suppressHydrationWarning: null,
                };
            function Ya(a, b) {
                if (void 0 === a) throw Error(r(152, D(b) || 'Component'));
            }
            function Za(a, b, c) {
                function d(d, h) {
                    var e = h.prototype && h.prototype.isReactComponent,
                        f = pa(h, b, c, e),
                        p = [],
                        g = !1,
                        l = {
                            isMounted: function() {
                                return !1;
                            },
                            enqueueForceUpdate: function() {
                                if (null === p) return null;
                            },
                            enqueueReplaceState: function(a, c) {
                                g = !0;
                                p = [c];
                            },
                            enqueueSetState: function(a, c) {
                                if (null === p) return null;
                                p.push(c);
                            },
                        };
                    if (e) {
                        if (((e = new h(d.props, f, l)), 'function' === typeof h.getDerivedStateFromProps)) {
                            var w = h.getDerivedStateFromProps.call(null, d.props, e.state);
                            null != w && (e.state = k({}, e.state, w));
                        }
                    } else if (
                        ((O = {}), (e = h(d.props, f, l)), (e = Da(h, d.props, e, f)), null == e || null == e.render)
                    ) {
                        a = e;
                        Ya(a, h);
                        return;
                    }
                    e.props = d.props;
                    e.context = f;
                    e.updater = l;
                    l = e.state;
                    void 0 === l && (e.state = l = null);
                    if ('function' === typeof e.UNSAFE_componentWillMount || 'function' === typeof e.componentWillMount)
                        if (
                            ('function' === typeof e.componentWillMount &&
                                'function' !== typeof h.getDerivedStateFromProps &&
                                e.componentWillMount(),
                            'function' === typeof e.UNSAFE_componentWillMount &&
                                'function' !== typeof h.getDerivedStateFromProps &&
                                e.UNSAFE_componentWillMount(),
                            p.length)
                        ) {
                            l = p;
                            var t = g;
                            p = null;
                            g = !1;
                            if (t && 1 === l.length) e.state = l[0];
                            else {
                                w = t ? l[0] : e.state;
                                var y = !0;
                                for (t = t ? 1 : 0; t < l.length; t++) {
                                    var q = l[t];
                                    q = 'function' === typeof q ? q.call(e, w, d.props, f) : q;
                                    null != q && (y ? ((y = !1), (w = k({}, w, q))) : k(w, q));
                                }
                                e.state = w;
                            }
                        } else p = null;
                    a = e.render();
                    Ya(a, h);
                    if ('function' === typeof e.getChildContext && ((d = h.childContextTypes), 'object' === typeof d)) {
                        var A = e.getChildContext();
                        for (var T in A) if (!(T in d)) throw Error(r(108, D(h) || 'Unknown', T));
                    }
                    A && (b = k({}, b, A));
                }
                for (; m.isValidElement(a); ) {
                    var f = a,
                        h = f.type;
                    if ('function' !== typeof h) break;
                    d(f, h);
                }
                return { child: a, context: b };
            }
            var $a = (function() {
                function a(a, b) {
                    m.isValidElement(a)
                        ? a.type !== v
                            ? (a = [a])
                            : ((a = a.props.children), (a = m.isValidElement(a) ? [a] : Z(a)))
                        : (a = Z(a));
                    a = { type: null, domNamespace: Ja.html, children: a, childIndex: 0, context: oa, footer: '' };
                    var c = F[0];
                    if (0 === c) {
                        var d = F;
                        c = d.length;
                        var p = 2 * c;
                        if (!(65536 >= p)) throw Error(r(304));
                        var g = new Uint16Array(p);
                        g.set(d);
                        F = g;
                        F[0] = c + 1;
                        for (d = c; d < p - 1; d++) F[d] = d + 1;
                        F[p - 1] = 0;
                    } else F[0] = F[c];
                    this.threadID = c;
                    this.stack = [a];
                    this.exhausted = !1;
                    this.currentSelectValue = null;
                    this.previousWasTextNode = !1;
                    this.makeStaticMarkup = b;
                    this.suspenseDepth = 0;
                    this.contextIndex = -1;
                    this.contextStack = [];
                    this.contextValueStack = [];
                }
                var b = a.prototype;
                b.destroy = function() {
                    if (!this.exhausted) {
                        this.exhausted = !0;
                        this.clearProviders();
                        var a = this.threadID;
                        F[a] = F[0];
                        F[0] = a;
                    }
                };
                b.pushProvider = function(a) {
                    var b = ++this.contextIndex,
                        c = a.type._context,
                        h = this.threadID;
                    E(c, h);
                    var p = c[h];
                    this.contextStack[b] = c;
                    this.contextValueStack[b] = p;
                    c[h] = a.props.value;
                };
                b.popProvider = function() {
                    var a = this.contextIndex,
                        b = this.contextStack[a],
                        f = this.contextValueStack[a];
                    this.contextStack[a] = null;
                    this.contextValueStack[a] = null;
                    this.contextIndex--;
                    b[this.threadID] = f;
                };
                b.clearProviders = function() {
                    for (var a = this.contextIndex; 0 <= a; a--)
                        this.contextStack[a][this.threadID] = this.contextValueStack[a];
                };
                b.read = function(a) {
                    if (this.exhausted) return null;
                    var b = X;
                    X = this.threadID;
                    var c = Qa.current;
                    Qa.current = Ia;
                    try {
                        for (var h = [''], p = !1; h[0].length < a; ) {
                            if (0 === this.stack.length) {
                                this.exhausted = !0;
                                var g = this.threadID;
                                F[g] = F[0];
                                F[0] = g;
                                break;
                            }
                            var e = this.stack[this.stack.length - 1];
                            if (p || e.childIndex >= e.children.length) {
                                var I = e.footer;
                                '' !== I && (this.previousWasTextNode = !1);
                                this.stack.pop();
                                if ('select' === e.type) this.currentSelectValue = null;
                                else if (null != e.type && null != e.type.type && e.type.type.$$typeof === x)
                                    this.popProvider(e.type);
                                else if (e.type === B) {
                                    this.suspenseDepth--;
                                    var G = h.pop();
                                    if (p) {
                                        p = !1;
                                        var n = e.fallbackFrame;
                                        if (!n) throw Error(r(303));
                                        this.stack.push(n);
                                        h[this.suspenseDepth] += '\x3c!--$!--\x3e';
                                        continue;
                                    } else h[this.suspenseDepth] += G;
                                }
                                h[this.suspenseDepth] += I;
                            } else {
                                var l = e.children[e.childIndex++],
                                    w = '';
                                try {
                                    w += this.render(l, e.context, e.domNamespace);
                                } catch (t) {
                                    if (null != t && 'function' === typeof t.then) throw Error(r(294));
                                    throw t;
                                } finally {
                                }
                                h.length <= this.suspenseDepth && h.push('');
                                h[this.suspenseDepth] += w;
                            }
                        }
                        return h[0];
                    } finally {
                        (Qa.current = c), (X = b);
                    }
                };
                b.render = function(a, b, f) {
                    if ('string' === typeof a || 'number' === typeof a) {
                        f = '' + a;
                        if ('' === f) return '';
                        if (this.makeStaticMarkup) return N(f);
                        if (this.previousWasTextNode) return '\x3c!-- --\x3e' + N(f);
                        this.previousWasTextNode = !0;
                        return N(f);
                    }
                    b = Za(a, b, this.threadID);
                    a = b.child;
                    b = b.context;
                    if (null === a || !1 === a) return '';
                    if (!m.isValidElement(a)) {
                        if (null != a && null != a.$$typeof) {
                            f = a.$$typeof;
                            if (f === ba) throw Error(r(257));
                            throw Error(r(258, f.toString()));
                        }
                        a = Z(a);
                        this.stack.push({
                            type: null,
                            domNamespace: f,
                            children: a,
                            childIndex: 0,
                            context: b,
                            footer: '',
                        });
                        return '';
                    }
                    var c = a.type;
                    if ('string' === typeof c) return this.renderDOM(a, b, f);
                    switch (c) {
                        case ca:
                        case fa:
                        case da:
                        case ia:
                        case v:
                            return (
                                (a = Z(a.props.children)),
                                this.stack.push({
                                    type: null,
                                    domNamespace: f,
                                    children: a,
                                    childIndex: 0,
                                    context: b,
                                    footer: '',
                                }),
                                ''
                            );
                        case B:
                            throw Error(r(294));
                    }
                    if ('object' === typeof c && null !== c)
                        switch (c.$$typeof) {
                            case ha:
                                O = {};
                                var d = c.render(a.props, a.ref);
                                d = Da(c.render, a.props, d, a.ref);
                                d = Z(d);
                                this.stack.push({
                                    type: null,
                                    domNamespace: f,
                                    children: d,
                                    childIndex: 0,
                                    context: b,
                                    footer: '',
                                });
                                return '';
                            case ja:
                                return (
                                    (a = [m.createElement(c.type, k({ ref: a.ref }, a.props))]),
                                    this.stack.push({
                                        type: null,
                                        domNamespace: f,
                                        children: a,
                                        childIndex: 0,
                                        context: b,
                                        footer: '',
                                    }),
                                    ''
                                );
                            case x:
                                return (
                                    (c = Z(a.props.children)),
                                    (f = {
                                        type: a,
                                        domNamespace: f,
                                        children: c,
                                        childIndex: 0,
                                        context: b,
                                        footer: '',
                                    }),
                                    this.pushProvider(a),
                                    this.stack.push(f),
                                    ''
                                );
                            case ea:
                                c = a.type;
                                d = a.props;
                                var g = this.threadID;
                                E(c, g);
                                c = Z(d.children(c[g]));
                                this.stack.push({
                                    type: a,
                                    domNamespace: f,
                                    children: c,
                                    childIndex: 0,
                                    context: b,
                                    footer: '',
                                });
                                return '';
                            case la:
                                throw Error(r(338));
                            case ka:
                                switch (((c = a.type), na(c), c._status)) {
                                    case 1:
                                        return (
                                            (a = [m.createElement(c._result, k({ ref: a.ref }, a.props))]),
                                            this.stack.push({
                                                type: null,
                                                domNamespace: f,
                                                children: a,
                                                childIndex: 0,
                                                context: b,
                                                footer: '',
                                            }),
                                            ''
                                        );
                                    case 2:
                                        throw c._result;
                                    default:
                                        throw Error(r(295));
                                }
                            case ma:
                                throw Error(r(343));
                        }
                    throw Error(r(130, null == c ? c : typeof c, ''));
                };
                b.renderDOM = function(a, b, f) {
                    var c = a.type.toLowerCase();
                    f === Ja.html && Ka(c);
                    if (!Ta.hasOwnProperty(c)) {
                        if (!Sa.test(c)) throw Error(r(65, c));
                        Ta[c] = !0;
                    }
                    var d = a.props;
                    if ('input' === c)
                        d = k({ type: void 0 }, d, {
                            defaultChecked: void 0,
                            defaultValue: void 0,
                            value: null != d.value ? d.value : d.defaultValue,
                            checked: null != d.checked ? d.checked : d.defaultChecked,
                        });
                    else if ('textarea' === c) {
                        var g = d.value;
                        if (null == g) {
                            g = d.defaultValue;
                            var e = d.children;
                            if (null != e) {
                                if (null != g) throw Error(r(92));
                                if (Array.isArray(e)) {
                                    if (!(1 >= e.length)) throw Error(r(93));
                                    e = e[0];
                                }
                                g = '' + e;
                            }
                            null == g && (g = '');
                        }
                        d = k({}, d, { value: void 0, children: '' + g });
                    } else if ('select' === c)
                        (this.currentSelectValue = null != d.value ? d.value : d.defaultValue),
                            (d = k({}, d, { value: void 0 }));
                    else if ('option' === c) {
                        e = this.currentSelectValue;
                        var I = Va(d.children);
                        if (null != e) {
                            var G = null != d.value ? d.value + '' : I;
                            g = !1;
                            if (Array.isArray(e))
                                for (var n = 0; n < e.length; n++) {
                                    if ('' + e[n] === G) {
                                        g = !0;
                                        break;
                                    }
                                }
                            else g = '' + e === G;
                            d = k({ selected: void 0, children: void 0 }, d, { selected: g, children: I });
                        }
                    }
                    if ((g = d)) {
                        if (Ma[c] && (null != g.children || null != g.dangerouslySetInnerHTML))
                            throw Error(r(137, c, ''));
                        if (null != g.dangerouslySetInnerHTML) {
                            if (null != g.children) throw Error(r(60));
                            if (
                                !(
                                    'object' === typeof g.dangerouslySetInnerHTML &&
                                    '__html' in g.dangerouslySetInnerHTML
                                )
                            )
                                throw Error(r(61));
                        }
                        if (null != g.style && 'object' !== typeof g.style) throw Error(r(62, ''));
                    }
                    g = d;
                    e = this.makeStaticMarkup;
                    I = 1 === this.stack.length;
                    G = '<' + a.type;
                    for (z in g)
                        if (Wa.call(g, z)) {
                            var l = g[z];
                            if (null != l) {
                                if ('style' === z) {
                                    n = void 0;
                                    var w = '',
                                        t = '';
                                    for (n in l)
                                        if (l.hasOwnProperty(n)) {
                                            var y = 0 === n.indexOf('--'),
                                                q = l[n];
                                            if (null != q) {
                                                if (y) var A = n;
                                                else if (((A = n), Ua.hasOwnProperty(A))) A = Ua[A];
                                                else {
                                                    var T = A.replace(Oa, '-$1')
                                                        .toLowerCase()
                                                        .replace(Pa, '-ms-');
                                                    A = Ua[A] = T;
                                                }
                                                w += t + A + ':';
                                                t = n;
                                                y =
                                                    null == q || 'boolean' === typeof q || '' === q
                                                        ? ''
                                                        : y ||
                                                          'number' !== typeof q ||
                                                          0 === q ||
                                                          (Y.hasOwnProperty(t) && Y[t])
                                                        ? ('' + q).trim()
                                                        : q + 'px';
                                                w += y;
                                                t = ';';
                                            }
                                        }
                                    l = w || null;
                                }
                                n = null;
                                b: if (((y = c), (q = g), -1 === y.indexOf('-'))) y = 'string' === typeof q.is;
                                else
                                    switch (y) {
                                        case 'annotation-xml':
                                        case 'color-profile':
                                        case 'font-face':
                                        case 'font-face-src':
                                        case 'font-face-uri':
                                        case 'font-face-format':
                                        case 'font-face-name':
                                        case 'missing-glyph':
                                            y = !1;
                                            break b;
                                        default:
                                            y = !0;
                                    }
                                y
                                    ? Xa.hasOwnProperty(z) ||
                                      ((n = z), (n = ua(n) && null != l ? n + '=' + ('"' + N(l) + '"') : ''))
                                    : (n = ya(z, l));
                                n && (G += ' ' + n);
                            }
                        }
                    e || (I && (G += ' data-reactroot=""'));
                    var z = G;
                    g = '';
                    La.hasOwnProperty(c) ? (z += '/>') : ((z += '>'), (g = '</' + a.type + '>'));
                    a: {
                        e = d.dangerouslySetInnerHTML;
                        if (null != e) {
                            if (null != e.__html) {
                                e = e.__html;
                                break a;
                            }
                        } else if (((e = d.children), 'string' === typeof e || 'number' === typeof e)) {
                            e = N(e);
                            break a;
                        }
                        e = null;
                    }
                    null != e
                        ? ((d = []), Ra[c] && '\n' === e.charAt(0) && (z += '\n'), (z += e))
                        : (d = Z(d.children));
                    a = a.type;
                    f =
                        null == f || 'http://www.w3.org/1999/xhtml' === f
                            ? Ka(a)
                            : 'http://www.w3.org/2000/svg' === f && 'foreignObject' === a
                            ? 'http://www.w3.org/1999/xhtml'
                            : f;
                    this.stack.push({ domNamespace: f, type: c, children: d, childIndex: 0, context: b, footer: g });
                    this.previousWasTextNode = !1;
                    return z;
                };
                return a;
            })();
            function ab(a, b) {
                a.prototype = Object.create(b.prototype);
                a.prototype.constructor = a;
                a.__proto__ = b;
            }
            var bb = (function(a) {
                    function b(b, c) {
                        var d = a.call(this, {}) || this;
                        d.partialRenderer = new $a(b, c);
                        return d;
                    }
                    ab(b, a);
                    var c = b.prototype;
                    c._destroy = function(a, b) {
                        this.partialRenderer.destroy();
                        b(a);
                    };
                    c._read = function(a) {
                        try {
                            this.push(this.partialRenderer.read(a));
                        } catch (f) {
                            this.destroy(f);
                        }
                    };
                    return b;
                })(aa.Readable),
                cb = {
                    renderToString: function(a) {
                        a = new $a(a, !1);
                        try {
                            return a.read(Infinity);
                        } finally {
                            a.destroy();
                        }
                    },
                    renderToStaticMarkup: function(a) {
                        a = new $a(a, !0);
                        try {
                            return a.read(Infinity);
                        } finally {
                            a.destroy();
                        }
                    },
                    renderToNodeStream: function(a) {
                        return new bb(a, !1);
                    },
                    renderToStaticNodeStream: function(a) {
                        return new bb(a, !0);
                    },
                    version: '16.12.0',
                },
                db = { default: cb },
                eb = (db && cb) || db;
            module.exports = eb.default || eb;

            /***/
        },

        /***/ FYa8: /***/ function(module, exports, __webpack_require__) {
            'use strict';

            var __importStar =
                (this && this.__importStar) ||
                function(mod) {
                    if (mod && mod.__esModule) return mod;
                    var result = {};
                    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
                    result['default'] = mod;
                    return result;
                };

            Object.defineProperty(exports, '__esModule', {
                value: true,
            });

            const React = __importStar(__webpack_require__('q1tI'));

            exports.HeadManagerContext = React.createContext(null);

            /***/
        },

        /***/ Fw1r: /***/ function(module, exports, __webpack_require__) {
            'use strict';

            module.exports = __webpack_require__('pV7Z');

            /***/
        },

        /***/ GX0O: /***/ function(module, __webpack_exports__, __webpack_require__) {
            'use strict';
            __webpack_require__.r(__webpack_exports__);

            /* harmony default export */ __webpack_exports__['default'] = function(ctx) {
                return Promise.all([]);
            };

            /***/
        },

        /***/ KI45: /***/ function(module, exports) {
            function _interopRequireDefault(obj) {
                return obj && obj.__esModule
                    ? obj
                    : {
                          default: obj,
                      };
            }

            module.exports = _interopRequireDefault;

            /***/
        },

        /***/ KqAr: /***/ function(module, __webpack_exports__, __webpack_require__) {
            'use strict';
            __webpack_require__.r(__webpack_exports__);

            /* harmony default export */ __webpack_exports__['default'] = function(ctx) {
                return Promise.all([]);
            };

            /***/
        },

        /***/ LZ9C: /***/ function(module) {
            module.exports = JSON.parse(
                '{"devFiles":[],"pages":{"/":["static/runtime/webpack-9369c5c69dbf6d4912cb.js","static/chunks/framework.94bc9fd9a7de53a90996.js","static/chunks/commons.ca14bda25aad26696615.js","static/css/97ff154d217d22de5b7d528850537fb96dc6f3be.93d0acfd.chunk.css","static/chunks/97ff154d217d22de5b7d528850537fb96dc6f3be.4e045efec8988c40c640.js","static/runtime/main-e67261247883d110a684.js"],"/_app":["static/runtime/webpack-9369c5c69dbf6d4912cb.js","static/chunks/framework.94bc9fd9a7de53a90996.js","static/chunks/commons.ca14bda25aad26696615.js","static/chunks/994fac5bfe9433cec2528ad3160483ccaaa64bd7.a2455930f9145e977f8c.js","static/chunks/ecc41f676ec0c0ec6dcd8949a2db6ac7f1e4d120.595c3c7ac204b8e16ea5.js","static/chunks/09feadc9ab28c675f4802f82a230ee944694dd76.bb0c36c586a03bfdd89b.js","static/runtime/main-e67261247883d110a684.js","static/DeUQcbc3W9rXgf03yE6k1/_buildManifest.js"],"/_error":["static/runtime/webpack-9369c5c69dbf6d4912cb.js","static/chunks/framework.94bc9fd9a7de53a90996.js","static/chunks/commons.ca14bda25aad26696615.js","static/css/97ff154d217d22de5b7d528850537fb96dc6f3be.93d0acfd.chunk.css","static/chunks/97ff154d217d22de5b7d528850537fb96dc6f3be.4e045efec8988c40c640.js","static/runtime/main-e67261247883d110a684.js"],"/_polyfills":["static/runtime/polyfills-14ea7b95b3867c77bd4e.js"],"/chooseStages":["static/runtime/webpack-9369c5c69dbf6d4912cb.js","static/chunks/framework.94bc9fd9a7de53a90996.js","static/chunks/commons.ca14bda25aad26696615.js","static/css/97ff154d217d22de5b7d528850537fb96dc6f3be.93d0acfd.chunk.css","static/chunks/97ff154d217d22de5b7d528850537fb96dc6f3be.4e045efec8988c40c640.js","static/runtime/main-e67261247883d110a684.js"],"/csvUpload":["static/runtime/webpack-9369c5c69dbf6d4912cb.js","static/chunks/framework.94bc9fd9a7de53a90996.js","static/chunks/commons.ca14bda25aad26696615.js","static/css/97ff154d217d22de5b7d528850537fb96dc6f3be.93d0acfd.chunk.css","static/chunks/97ff154d217d22de5b7d528850537fb96dc6f3be.4e045efec8988c40c640.js","static/css/2fb44df9bf59908f3fac6e9e11a16bb014c5884d.1e557fc8.chunk.css","static/chunks/2fb44df9bf59908f3fac6e9e11a16bb014c5884d.579c4ba591f9f174fb7b.js","static/runtime/main-e67261247883d110a684.js"],"/csvZoneUpload":["static/runtime/webpack-9369c5c69dbf6d4912cb.js","static/chunks/framework.94bc9fd9a7de53a90996.js","static/chunks/commons.ca14bda25aad26696615.js","static/css/97ff154d217d22de5b7d528850537fb96dc6f3be.93d0acfd.chunk.css","static/chunks/97ff154d217d22de5b7d528850537fb96dc6f3be.4e045efec8988c40c640.js","static/css/2fb44df9bf59908f3fac6e9e11a16bb014c5884d.1e557fc8.chunk.css","static/chunks/2fb44df9bf59908f3fac6e9e11a16bb014c5884d.579c4ba591f9f174fb7b.js","static/runtime/main-e67261247883d110a684.js"],"/direction":["static/runtime/webpack-9369c5c69dbf6d4912cb.js","static/chunks/framework.94bc9fd9a7de53a90996.js","static/chunks/4072747d.91a21d86e6ad6230eff0.js","static/chunks/1a0f24eb.4ead4a61767b899a47d8.js","static/chunks/commons.ca14bda25aad26696615.js","static/css/97ff154d217d22de5b7d528850537fb96dc6f3be.93d0acfd.chunk.css","static/chunks/97ff154d217d22de5b7d528850537fb96dc6f3be.4e045efec8988c40c640.js","static/chunks/994fac5bfe9433cec2528ad3160483ccaaa64bd7.a2455930f9145e977f8c.js","static/chunks/c38ee5b41ecbad1d47f5df0e0fb7589f975bd6a7.6b783e31a54a2716850e.js","static/chunks/ecc41f676ec0c0ec6dcd8949a2db6ac7f1e4d120.595c3c7ac204b8e16ea5.js","static/chunks/8128052f3c4b5b80eb7094104e59ac0166b76207.ddd223edc0b6c9a8ca0d.js","static/runtime/main-e67261247883d110a684.js"],"/error":["static/runtime/webpack-9369c5c69dbf6d4912cb.js","static/chunks/framework.94bc9fd9a7de53a90996.js","static/chunks/commons.ca14bda25aad26696615.js","static/css/97ff154d217d22de5b7d528850537fb96dc6f3be.93d0acfd.chunk.css","static/chunks/97ff154d217d22de5b7d528850537fb96dc6f3be.4e045efec8988c40c640.js","static/runtime/main-e67261247883d110a684.js"],"/faretype":["static/runtime/webpack-9369c5c69dbf6d4912cb.js","static/chunks/framework.94bc9fd9a7de53a90996.js","static/chunks/commons.ca14bda25aad26696615.js","static/css/97ff154d217d22de5b7d528850537fb96dc6f3be.93d0acfd.chunk.css","static/chunks/97ff154d217d22de5b7d528850537fb96dc6f3be.4e045efec8988c40c640.js","static/chunks/994fac5bfe9433cec2528ad3160483ccaaa64bd7.a2455930f9145e977f8c.js","static/chunks/c38ee5b41ecbad1d47f5df0e0fb7589f975bd6a7.6b783e31a54a2716850e.js","static/runtime/main-e67261247883d110a684.js"],"/help/Cookies":["static/runtime/webpack-9369c5c69dbf6d4912cb.js","static/chunks/framework.94bc9fd9a7de53a90996.js","static/chunks/commons.ca14bda25aad26696615.js","static/css/97ff154d217d22de5b7d528850537fb96dc6f3be.93d0acfd.chunk.css","static/chunks/97ff154d217d22de5b7d528850537fb96dc6f3be.4e045efec8988c40c640.js","static/runtime/main-e67261247883d110a684.js"],"/howManyStages":["static/runtime/webpack-9369c5c69dbf6d4912cb.js","static/chunks/framework.94bc9fd9a7de53a90996.js","static/chunks/commons.ca14bda25aad26696615.js","static/css/97ff154d217d22de5b7d528850537fb96dc6f3be.93d0acfd.chunk.css","static/chunks/97ff154d217d22de5b7d528850537fb96dc6f3be.4e045efec8988c40c640.js","static/runtime/main-e67261247883d110a684.js"],"/index":["static/runtime/webpack-9369c5c69dbf6d4912cb.js","static/chunks/framework.94bc9fd9a7de53a90996.js","static/chunks/commons.ca14bda25aad26696615.js","static/css/97ff154d217d22de5b7d528850537fb96dc6f3be.93d0acfd.chunk.css","static/chunks/97ff154d217d22de5b7d528850537fb96dc6f3be.4e045efec8988c40c640.js","static/runtime/main-e67261247883d110a684.js"],"/inputMethod":["static/runtime/webpack-9369c5c69dbf6d4912cb.js","static/chunks/framework.94bc9fd9a7de53a90996.js","static/chunks/commons.ca14bda25aad26696615.js","static/css/97ff154d217d22de5b7d528850537fb96dc6f3be.93d0acfd.chunk.css","static/chunks/97ff154d217d22de5b7d528850537fb96dc6f3be.4e045efec8988c40c640.js","static/runtime/main-e67261247883d110a684.js"],"/matching":["static/runtime/webpack-9369c5c69dbf6d4912cb.js","static/chunks/framework.94bc9fd9a7de53a90996.js","static/chunks/4072747d.91a21d86e6ad6230eff0.js","static/chunks/1a0f24eb.4ead4a61767b899a47d8.js","static/chunks/commons.ca14bda25aad26696615.js","static/css/97ff154d217d22de5b7d528850537fb96dc6f3be.93d0acfd.chunk.css","static/chunks/97ff154d217d22de5b7d528850537fb96dc6f3be.4e045efec8988c40c640.js","static/chunks/994fac5bfe9433cec2528ad3160483ccaaa64bd7.a2455930f9145e977f8c.js","static/chunks/c38ee5b41ecbad1d47f5df0e0fb7589f975bd6a7.6b783e31a54a2716850e.js","static/chunks/ecc41f676ec0c0ec6dcd8949a2db6ac7f1e4d120.595c3c7ac204b8e16ea5.js","static/chunks/8128052f3c4b5b80eb7094104e59ac0166b76207.ddd223edc0b6c9a8ca0d.js","static/runtime/main-e67261247883d110a684.js"],"/operator":["static/runtime/webpack-9369c5c69dbf6d4912cb.js","static/chunks/framework.94bc9fd9a7de53a90996.js","static/chunks/commons.ca14bda25aad26696615.js","static/css/97ff154d217d22de5b7d528850537fb96dc6f3be.93d0acfd.chunk.css","static/chunks/97ff154d217d22de5b7d528850537fb96dc6f3be.4e045efec8988c40c640.js","static/chunks/994fac5bfe9433cec2528ad3160483ccaaa64bd7.a2455930f9145e977f8c.js","static/chunks/c38ee5b41ecbad1d47f5df0e0fb7589f975bd6a7.6b783e31a54a2716850e.js","static/runtime/main-e67261247883d110a684.js"],"/periodType":["static/runtime/webpack-9369c5c69dbf6d4912cb.js","static/chunks/framework.94bc9fd9a7de53a90996.js","static/chunks/commons.ca14bda25aad26696615.js","static/css/97ff154d217d22de5b7d528850537fb96dc6f3be.93d0acfd.chunk.css","static/chunks/97ff154d217d22de5b7d528850537fb96dc6f3be.4e045efec8988c40c640.js","static/runtime/main-e67261247883d110a684.js"],"/priceEntry":["static/runtime/webpack-9369c5c69dbf6d4912cb.js","static/chunks/framework.94bc9fd9a7de53a90996.js","static/chunks/commons.ca14bda25aad26696615.js","static/css/97ff154d217d22de5b7d528850537fb96dc6f3be.93d0acfd.chunk.css","static/chunks/97ff154d217d22de5b7d528850537fb96dc6f3be.4e045efec8988c40c640.js","static/runtime/main-e67261247883d110a684.js"],"/service":["static/runtime/webpack-9369c5c69dbf6d4912cb.js","static/chunks/framework.94bc9fd9a7de53a90996.js","static/chunks/4072747d.91a21d86e6ad6230eff0.js","static/chunks/1a0f24eb.4ead4a61767b899a47d8.js","static/chunks/commons.ca14bda25aad26696615.js","static/css/97ff154d217d22de5b7d528850537fb96dc6f3be.93d0acfd.chunk.css","static/chunks/97ff154d217d22de5b7d528850537fb96dc6f3be.4e045efec8988c40c640.js","static/chunks/994fac5bfe9433cec2528ad3160483ccaaa64bd7.a2455930f9145e977f8c.js","static/chunks/c38ee5b41ecbad1d47f5df0e0fb7589f975bd6a7.6b783e31a54a2716850e.js","static/chunks/ecc41f676ec0c0ec6dcd8949a2db6ac7f1e4d120.595c3c7ac204b8e16ea5.js","static/chunks/8128052f3c4b5b80eb7094104e59ac0166b76207.ddd223edc0b6c9a8ca0d.js","static/runtime/main-e67261247883d110a684.js"],"/stageNames":["static/runtime/webpack-9369c5c69dbf6d4912cb.js","static/chunks/framework.94bc9fd9a7de53a90996.js","static/chunks/commons.ca14bda25aad26696615.js","static/css/97ff154d217d22de5b7d528850537fb96dc6f3be.93d0acfd.chunk.css","static/chunks/97ff154d217d22de5b7d528850537fb96dc6f3be.4e045efec8988c40c640.js","static/chunks/994fac5bfe9433cec2528ad3160483ccaaa64bd7.a2455930f9145e977f8c.js","static/chunks/c38ee5b41ecbad1d47f5df0e0fb7589f975bd6a7.6b783e31a54a2716850e.js","static/runtime/main-e67261247883d110a684.js"],"/thankyou":["static/runtime/webpack-9369c5c69dbf6d4912cb.js","static/chunks/framework.94bc9fd9a7de53a90996.js","static/chunks/commons.ca14bda25aad26696615.js","static/css/97ff154d217d22de5b7d528850537fb96dc6f3be.93d0acfd.chunk.css","static/chunks/97ff154d217d22de5b7d528850537fb96dc6f3be.4e045efec8988c40c640.js","static/chunks/994fac5bfe9433cec2528ad3160483ccaaa64bd7.a2455930f9145e977f8c.js","static/chunks/c38ee5b41ecbad1d47f5df0e0fb7589f975bd6a7.6b783e31a54a2716850e.js","static/runtime/main-e67261247883d110a684.js"]}}',
            );

            /***/
        },

        /***/ LixI: /***/ function(module, __webpack_exports__, __webpack_require__) {
            'use strict';
            __webpack_require__.r(__webpack_exports__);
            /* harmony import */ var _design_Pages_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__('svJj');
            /* harmony import */ var _design_Pages_scss__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/ __webpack_require__.n(
                _design_Pages_scss__WEBPACK_IMPORTED_MODULE_0__,
            );
            /* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__('q1tI');
            /* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/ __webpack_require__.n(
                react__WEBPACK_IMPORTED_MODULE_1__,
            );
            /* harmony import */ var _layout_Layout__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__('9sSY');
            var __jsx = react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement;

            const title = 'Error - Fares data build tool';
            const description = 'Error page of the Fares data build tool';

            const Error = ({ statusCode }) =>
                __jsx(
                    _layout_Layout__WEBPACK_IMPORTED_MODULE_2__[/* default */ 'a'],
                    {
                        title: title,
                        description: description,
                    },
                    __jsx(
                        'main',
                        {
                            className: 'govuk-main-wrapper app-main-class',
                            id: 'main-content',
                            role: 'main',
                        },
                        __jsx(
                            'div',
                            {
                                className: 'govuk-grid-row',
                            },
                            !statusCode || statusCode !== 404
                                ? __jsx(
                                      'div',
                                      null,
                                      __jsx(
                                          'h1',
                                          {
                                              className: 'govuk-heading-xl',
                                          },
                                          'Sorry, there is a problem with the service.',
                                      ),
                                      __jsx(
                                          'p',
                                          {
                                              className: 'govuk-body',
                                          },
                                          'Try again later.',
                                      ),
                                      __jsx(
                                          'p',
                                          {
                                              className: 'govuk-body',
                                          },
                                          'Your answers have not been saved, click continue to start again.',
                                      ),
                                      __jsx(
                                          'p',
                                          {
                                              className: 'govuk-body',
                                          },
                                          'Contact us with the feedback button at the top of this page for assistance.',
                                      ),
                                  )
                                : __jsx(
                                      'div',
                                      null,
                                      __jsx(
                                          'h1',
                                          {
                                              className: 'govuk-heading-xl',
                                          },
                                          'Page not found',
                                      ),
                                      __jsx(
                                          'p',
                                          {
                                              className: 'govuk-body',
                                          },
                                          'If you entered a web address please check it was correct.',
                                      ),
                                      __jsx(
                                          'p',
                                          {
                                              className: 'govuk-body',
                                          },
                                          'Click continue to start again.',
                                      ),
                                  ),
                            __jsx('br', null),
                            __jsx(
                                'a',
                                {
                                    href: 'operator',
                                    role: 'button',
                                    draggable: 'false',
                                    className: 'govuk-button govuk-button--start',
                                    'data-module': 'govuk-button',
                                },
                                'Continue',
                            ),
                        ),
                    ),
                );

            Error.getInitialProps = ctx => {
                var _ctx$res;

                return {
                    statusCode:
                        ctx === null || ctx === void 0
                            ? void 0
                            : (_ctx$res = ctx.res) === null || _ctx$res === void 0
                            ? void 0
                            : _ctx$res.statusCode,
                };
            };

            /* harmony default export */ __webpack_exports__['default'] = Error;

            /***/
        },

        /***/ LuNM: /***/ function(module, exports, __webpack_require__) {
            'use strict';

            var __importDefault =
                (this && this.__importDefault) ||
                function(mod) {
                    return mod && mod.__esModule ? mod : { default: mod };
                };
            Object.defineProperty(exports, '__esModule', { value: true });
            const etag_1 = __importDefault(__webpack_require__('Y4gF'));
            const fresh_1 = __importDefault(__webpack_require__('BMJj'));
            const utils_1 = __webpack_require__('g/15');
            function sendHTML(req, res, html, { generateEtags, poweredByHeader }) {
                if (utils_1.isResSent(res)) return;
                const etag = generateEtags ? etag_1.default(html) : undefined;
                if (poweredByHeader) {
                    res.setHeader('X-Powered-By', 'Next.js');
                }
                if (fresh_1.default(req.headers, { etag })) {
                    res.statusCode = 304;
                    res.end();
                    return;
                }
                if (etag) {
                    res.setHeader('ETag', etag);
                }
                if (!res.getHeader('Content-Type')) {
                    res.setHeader('Content-Type', 'text/html; charset=utf-8');
                }
                res.setHeader('Content-Length', Buffer.byteLength(html));
                res.end(req.method === 'HEAD' ? null : html);
            }
            exports.sendHTML = sendHTML;

            /***/
        },

        /***/ MgzW: /***/ function(module, exports, __webpack_require__) {
            'use strict';
            /*
object-assign
(c) Sindre Sorhus
@license MIT
*/

            /* eslint-disable no-unused-vars */
            var getOwnPropertySymbols = Object.getOwnPropertySymbols;
            var hasOwnProperty = Object.prototype.hasOwnProperty;
            var propIsEnumerable = Object.prototype.propertyIsEnumerable;

            function toObject(val) {
                if (val === null || val === undefined) {
                    throw new TypeError('Object.assign cannot be called with null or undefined');
                }

                return Object(val);
            }

            function shouldUseNative() {
                try {
                    if (!Object.assign) {
                        return false;
                    }

                    // Detect buggy property enumeration order in older V8 versions.

                    // https://bugs.chromium.org/p/v8/issues/detail?id=4118
                    var test1 = new String('abc'); // eslint-disable-line no-new-wrappers
                    test1[5] = 'de';
                    if (Object.getOwnPropertyNames(test1)[0] === '5') {
                        return false;
                    }

                    // https://bugs.chromium.org/p/v8/issues/detail?id=3056
                    var test2 = {};
                    for (var i = 0; i < 10; i++) {
                        test2['_' + String.fromCharCode(i)] = i;
                    }
                    var order2 = Object.getOwnPropertyNames(test2).map(function(n) {
                        return test2[n];
                    });
                    if (order2.join('') !== '0123456789') {
                        return false;
                    }

                    // https://bugs.chromium.org/p/v8/issues/detail?id=3056
                    var test3 = {};
                    'abcdefghijklmnopqrst'.split('').forEach(function(letter) {
                        test3[letter] = letter;
                    });
                    if (Object.keys(Object.assign({}, test3)).join('') !== 'abcdefghijklmnopqrst') {
                        return false;
                    }

                    return true;
                } catch (err) {
                    // We don't expect any of the above to throw, but better to be safe.
                    return false;
                }
            }

            module.exports = shouldUseNative()
                ? Object.assign
                : function(target, source) {
                      var from;
                      var to = toObject(target);
                      var symbols;

                      for (var s = 1; s < arguments.length; s++) {
                          from = Object(arguments[s]);

                          for (var key in from) {
                              if (hasOwnProperty.call(from, key)) {
                                  to[key] = from[key];
                              }
                          }

                          if (getOwnPropertySymbols) {
                              symbols = getOwnPropertySymbols(from);
                              for (var i = 0; i < symbols.length; i++) {
                                  if (propIsEnumerable.call(from, symbols[i])) {
                                      to[symbols[i]] = from[symbols[i]];
                                  }
                              }
                          }
                      }

                      return to;
                  };

            /***/
        },

        /***/ OaTm: /***/ function(module, exports, __webpack_require__) {
            'use strict';

            Object.defineProperty(exports, '__esModule', { value: true });
            async function optimize(html) {
                let AmpOptimizer;
                try {
                    AmpOptimizer = __webpack_require__('8C61');
                } catch (_) {
                    return html;
                }
                const optimizer = AmpOptimizer.create();
                return optimizer.transformHtml(html);
            }
            exports.default = optimize;

            /***/
        },

        /***/ PJMN: /***/ function(module, exports) {
            module.exports = require('crypto');

            /***/
        },

        /***/ PRL6: /***/ function(module, exports, __webpack_require__) {
            'use strict';

            Object.defineProperty(exports, '__esModule', { value: true });
            const constants_1 = __webpack_require__('w7wo');
            function isBlockedPage(pathname) {
                return constants_1.BLOCKED_PAGES.indexOf(pathname) !== -1;
            }
            exports.isBlockedPage = isBlockedPage;
            function cleanAmpPath(pathname) {
                if (pathname.match(/\?amp=(y|yes|true|1)/)) {
                    pathname = pathname.replace(/\?amp=(y|yes|true|1)&?/, '?');
                }
                if (pathname.match(/&amp=(y|yes|true|1)/)) {
                    pathname = pathname.replace(/&amp=(y|yes|true|1)/, '');
                }
                pathname = pathname.replace(/\?$/, '');
                return pathname;
            }
            exports.cleanAmpPath = cleanAmpPath;

            /***/
        },

        /***/ SUjs: /***/ function(module, __webpack_exports__, __webpack_require__) {
            'use strict';
            __webpack_require__.r(__webpack_exports__);
            var howManyStages_namespaceObject = {};
            __webpack_require__.r(howManyStages_namespaceObject);
            __webpack_require__.d(howManyStages_namespaceObject, 'default', function() {
                return howManyStages;
            });

            // EXTERNAL MODULE: external "url"
            var external_url_ = __webpack_require__('bzos');

            // EXTERNAL MODULE: external "querystring"
            var external_querystring_ = __webpack_require__('8xkj');

            // EXTERNAL MODULE: ./node_modules/next/dist/next-server/server/render.js
            var render = __webpack_require__('/bjS');

            // EXTERNAL MODULE: ./node_modules/next/dist/next-server/server/send-html.js
            var send_html = __webpack_require__('LuNM');

            // EXTERNAL MODULE: ./node_modules/next/dist/build/webpack/loaders/next-plugin-loader.js?middleware=on-init-server
            var next_plugin_loadermiddleware_on_init_server = __webpack_require__('GX0O');

            // EXTERNAL MODULE: ./node_modules/next/dist/build/webpack/loaders/next-plugin-loader.js?middleware=on-error-server
            var next_plugin_loadermiddleware_on_error_server = __webpack_require__('KqAr');

            // EXTERNAL MODULE: ./.next/build-manifest.json
            var build_manifest = __webpack_require__('LZ9C');

            // EXTERNAL MODULE: ./.next/react-loadable-manifest.json
            var react_loadable_manifest = __webpack_require__('67Bq');

            // EXTERNAL MODULE: ./src/pages/_document.tsx
            var _document = __webpack_require__('mT+M');

            // EXTERNAL MODULE: ./src/pages/_error.tsx
            var _error = __webpack_require__('LixI');

            // EXTERNAL MODULE: ./src/pages/_app.tsx
            var _app = __webpack_require__('hUgY');

            // EXTERNAL MODULE: ./src/design/Pages.scss
            var Pages = __webpack_require__('svJj');

            // EXTERNAL MODULE: ./node_modules/react/index.js
            var react = __webpack_require__('q1tI');
            var react_default = /*#__PURE__*/ __webpack_require__.n(react);

            // EXTERNAL MODULE: ./src/layout/Layout.tsx + 4 modules
            var Layout = __webpack_require__('9sSY');

            // CONCATENATED MODULE: ./src/pages/howManyStages.tsx
            var __jsx = react_default.a.createElement;

            const title = 'How Many Fare Stages - Fares data build tool';
            const description = 'How many fares stages page of the Fares data build tool';

            const HowManyStages = () =>
                __jsx(
                    Layout['a' /* default */],
                    {
                        title: title,
                        description: description,
                    },
                    __jsx(
                        'main',
                        {
                            className: 'govuk-main-wrapper app-main-class',
                            id: 'main-content',
                            role: 'main',
                        },
                        __jsx(
                            'form',
                            {
                                action: '/api/howManyStages',
                                method: 'post',
                            },
                            __jsx(
                                'div',
                                {
                                    className: 'govuk-form-group',
                                },
                                __jsx(
                                    'fieldset',
                                    {
                                        className: 'govuk-fieldset',
                                        'aria-describedby': 'selection-hint',
                                    },
                                    __jsx(
                                        'legend',
                                        {
                                            className: 'govuk-fieldset__legend govuk-fieldset__legend--xl',
                                        },
                                        __jsx(
                                            'h1',
                                            {
                                                className: 'govuk-fieldset__heading',
                                            },
                                            'What is the size of your fares triangle?',
                                        ),
                                    ),
                                    __jsx(
                                        'span',
                                        {
                                            className: 'govuk-hint',
                                            id: 'selection-hint',
                                        },
                                        "You'll need to upload a CSV if your fares triangle has more than 20 fares stages.",
                                    ),
                                    __jsx(
                                        'div',
                                        {
                                            className: 'govuk-radios',
                                        },
                                        __jsx(
                                            'div',
                                            {
                                                className: 'govuk-radios__item',
                                            },
                                            __jsx('input', {
                                                className: 'govuk-radios__input',
                                                id: 'lessThan20FareStages',
                                                name: 'howManyStages',
                                                type: 'radio',
                                                value: 'lessThan20',
                                            }),
                                            __jsx(
                                                'label',
                                                {
                                                    className: 'govuk-label govuk-radios__label govuk-label--s',
                                                    htmlFor: 'selection',
                                                },
                                                '20 fare stages or less',
                                            ),
                                            __jsx(
                                                'span',
                                                {
                                                    id: 'selection-item-hint',
                                                    className: 'govuk-hint govuk-radios__hint',
                                                },
                                                "You'll need to add the fare stages, prices and match the stops on your route to your fare stages.",
                                            ),
                                        ),
                                        __jsx(
                                            'div',
                                            {
                                                className: 'govuk-radios__item',
                                            },
                                            __jsx('input', {
                                                className: 'govuk-radios__input',
                                                id: 'moreThan20FareStages',
                                                name: 'howManyStages',
                                                type: 'radio',
                                                value: 'moreThan20',
                                            }),
                                            __jsx(
                                                'label',
                                                {
                                                    className: 'govuk-label govuk-radios__label govuk-label--s',
                                                    htmlFor: 'selection-2',
                                                },
                                                'More than 20 fare stages',
                                            ),
                                            __jsx(
                                                'span',
                                                {
                                                    id: 'selection-2-item-hint',
                                                    className: 'govuk-hint govuk-radios__hint',
                                                },
                                                "You'll need to upload a CSV fares triangle. A template will be provided for you to complete.",
                                            ),
                                        ),
                                    ),
                                ),
                            ),
                            __jsx('input', {
                                type: 'submit',
                                value: 'Continue',
                                id: 'continue-button',
                                className: 'govuk-button govuk-button--start',
                            }),
                        ),
                    ),
                );

            /* harmony default export */ var howManyStages = HowManyStages;
            // EXTERNAL MODULE: ./.next/routes-manifest.json
            var routes_manifest = __webpack_require__('Skye');

            // EXTERNAL MODULE: ./node_modules/next/dist/next-server/server/lib/path-match.js
            var path_match = __webpack_require__('uDRR');
            var path_match_default = /*#__PURE__*/ __webpack_require__.n(path_match);

            // CONCATENATED MODULE: ./node_modules/next/dist/build/webpack/loaders/next-serverless-loader.js?page=%2FhowManyStages&absolutePagePath=private-next-pages%2FhowManyStages.tsx&absoluteAppPath=private-next-pages%2F_app.tsx&absoluteDocumentPath=private-next-pages%2F_document.tsx&absoluteErrorPath=private-next-pages%2F_error.tsx&distDir=private-dot-next&buildId=DeUQcbc3W9rXgf03yE6k1&assetPrefix=&generateEtags=true&canonicalBase=&basePath=
            /* harmony export (binding) */ __webpack_require__.d(
                __webpack_exports__,
                'unstable_getStaticProps',
                function() {
                    return unstable_getStaticProps;
                },
            );
            /* harmony export (binding) */ __webpack_require__.d(
                __webpack_exports__,
                'unstable_getStaticParams',
                function() {
                    return unstable_getStaticParams;
                },
            );
            /* harmony export (binding) */ __webpack_require__.d(
                __webpack_exports__,
                'unstable_getStaticPaths',
                function() {
                    return unstable_getStaticPaths;
                },
            );
            /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, 'config', function() {
                return config;
            });
            /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, '_app', function() {
                return next_serverless_loaderpage_2FhowManyStages_absolutePagePath_private_next_pages_2FhowManyStages_tsx_absoluteAppPath_private_next_pages_2F_app_tsx_absoluteDocumentPath_private_next_pages_2F_document_tsx_absoluteErrorPath_private_next_pages_2F_error_tsx_distDir_private_dot_next_buildId_DeUQcbc3W9rXgf03yE6k1_assetPrefix_generateEtags_true_canonicalBase_basePath_app;
            });
            /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, 'renderReqToHTML', function() {
                return renderReqToHTML;
            });
            /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, 'render', function() {
                return next_serverless_loaderpage_2FhowManyStages_absolutePagePath_private_next_pages_2FhowManyStages_tsx_absoluteAppPath_private_next_pages_2F_app_tsx_absoluteDocumentPath_private_next_pages_2F_document_tsx_absoluteErrorPath_private_next_pages_2F_error_tsx_distDir_private_dot_next_buildId_DeUQcbc3W9rXgf03yE6k1_assetPrefix_generateEtags_true_canonicalBase_basePath_render;
            });

            const Component = howManyStages;
            /* harmony default export */ var next_serverless_loaderpage_2FhowManyStages_absolutePagePath_private_next_pages_2FhowManyStages_tsx_absoluteAppPath_private_next_pages_2F_app_tsx_absoluteDocumentPath_private_next_pages_2F_document_tsx_absoluteErrorPath_private_next_pages_2F_error_tsx_distDir_private_dot_next_buildId_DeUQcbc3W9rXgf03yE6k1_assetPrefix_generateEtags_true_canonicalBase_basePath_ = (__webpack_exports__[
                'default'
            ] = Component);
            const unstable_getStaticProps = howManyStages_namespaceObject['unstable_getStaticProp' + 's'];
            const unstable_getStaticParams = howManyStages_namespaceObject['unstable_getStaticParam' + 's'];
            const unstable_getStaticPaths = howManyStages_namespaceObject['unstable_getStaticPath' + 's'];

            const getCustomRouteMatcher = path_match_default()(true);

            function handleRewrites(parsedUrl) {
                for (const rewrite of routes_manifest['a' /* rewrites */]) {
                    const matcher = getCustomRouteMatcher(rewrite.source);
                    const params = matcher(parsedUrl.pathname);

                    if (params) {
                        parsedUrl.query = {
                            ...parsedUrl.query,
                            ...params,
                        };
                        const parsedDest = Object(external_url_['parse'])(rewrite.destination);
                        const destCompiler = path_match['pathToRegexp'].compile(
                            `${parsedDest.pathname}${parsedDest.hash || ''}`,
                        );
                        const newUrl = destCompiler(params);
                        const parsedNewUrl = Object(external_url_['parse'])(newUrl);

                        parsedUrl.pathname = parsedNewUrl.pathname;
                        parsedUrl.hash = parsedNewUrl.hash;

                        if (parsedUrl.pathname === '/howManyStages') {
                            break;
                        }
                    }
                }

                return parsedUrl;
            }

            const config = howManyStages_namespaceObject['confi' + 'g'] || {};
            const next_serverless_loaderpage_2FhowManyStages_absolutePagePath_private_next_pages_2FhowManyStages_tsx_absoluteAppPath_private_next_pages_2F_app_tsx_absoluteDocumentPath_private_next_pages_2F_document_tsx_absoluteErrorPath_private_next_pages_2F_error_tsx_distDir_private_dot_next_buildId_DeUQcbc3W9rXgf03yE6k1_assetPrefix_generateEtags_true_canonicalBase_basePath_app =
                _app['a' /* default */];
            async function renderReqToHTML(req, res, fromExport, _renderOpts, _params) {
                const options = {
                    App: _app['a' /* default */],
                    Document: _document['a' /* default */],
                    buildManifest: build_manifest,
                    unstable_getStaticProps,
                    unstable_getStaticPaths,
                    reactLoadableManifest: react_loadable_manifest,
                    canonicalBase: '',
                    buildId: 'DeUQcbc3W9rXgf03yE6k1',
                    assetPrefix: '',
                    ..._renderOpts,
                };
                let _nextData = false;

                if (req.url.match(/_next\/data/)) {
                    _nextData = true;
                    req.url = req.url
                        .replace(new RegExp('/_next/data/DeUQcbc3W9rXgf03yE6k1/'), '/')
                        .replace(/\.json$/, '');
                }
                const parsedUrl = handleRewrites(Object(external_url_['parse'])(req.url, true));

                const renderOpts = Object.assign(
                    {
                        Component,
                        pageConfig: config,
                        nextExport: fromExport,
                    },
                    options,
                );
                try {
                    const params = {};
                    const nowParams = null;
                    let result = await Object(render['renderToHTML'])(
                        req,
                        res,
                        '/howManyStages',
                        Object.assign(
                            {},
                            unstable_getStaticProps ? {} : parsedUrl.query,
                            nowParams ? nowParams : params,
                            _params,
                        ),
                        renderOpts,
                    );

                    if (_nextData && !fromExport) {
                        const payload = JSON.stringify(renderOpts.pageData);
                        res.setHeader('Content-Type', 'application/json');
                        res.setHeader('Content-Length', Buffer.byteLength(payload));
                        res.setHeader('Cache-Control', `s-maxage=${renderOpts.revalidate}, stale-while-revalidate`);
                        res.end(payload);
                        return null;
                    }

                    if (fromExport) return { html: result, renderOpts };
                    return result;
                } catch (err) {
                    if (err.code === 'ENOENT') {
                        res.statusCode = 404;
                        const result = await Object(render['renderToHTML'])(
                            req,
                            res,
                            '/_error',
                            parsedUrl.query,
                            Object.assign({}, options, {
                                unstable_getStaticProps: undefined,
                                unstable_getStaticPaths: undefined,
                                Component: _error['default'],
                            }),
                        );
                        return result;
                    } else {
                        console.error(err);
                        res.statusCode = 500;
                        const result = await Object(render['renderToHTML'])(
                            req,
                            res,
                            '/_error',
                            parsedUrl.query,
                            Object.assign({}, options, {
                                unstable_getStaticProps: undefined,
                                unstable_getStaticPaths: undefined,
                                Component: _error['default'],
                                err,
                            }),
                        );
                        return result;
                    }
                }
            }
            async function next_serverless_loaderpage_2FhowManyStages_absolutePagePath_private_next_pages_2FhowManyStages_tsx_absoluteAppPath_private_next_pages_2F_app_tsx_absoluteDocumentPath_private_next_pages_2F_document_tsx_absoluteErrorPath_private_next_pages_2F_error_tsx_distDir_private_dot_next_buildId_DeUQcbc3W9rXgf03yE6k1_assetPrefix_generateEtags_true_canonicalBase_basePath_render(
                req,
                res,
            ) {
                try {
                    await Object(next_plugin_loadermiddleware_on_init_server['default'])();
                    const html = await renderReqToHTML(req, res);
                    if (html) {
                        Object(send_html['sendHTML'])(req, res, html, { generateEtags: true });
                    }
                } catch (err) {
                    await Object(next_plugin_loadermiddleware_on_error_server['default'])(err);
                    console.error(err);
                    res.statusCode = 500;
                    res.end('Internal Server Error');
                }
            }

            /***/
        },

        /***/ SevZ: /***/ function(module, exports, __webpack_require__) {
            'use strict';

            exports.__esModule = true;
            exports['default'] = void 0;

            var _stringHash = _interopRequireDefault(__webpack_require__('9kyW'));

            var _stylesheet = _interopRequireDefault(__webpack_require__('bVZc'));

            function _interopRequireDefault(obj) {
                return obj && obj.__esModule ? obj : { default: obj };
            }

            var sanitize = function sanitize(rule) {
                return rule.replace(/\/style/gi, '\\/style');
            };

            var StyleSheetRegistry =
                /*#__PURE__*/
                (function() {
                    function StyleSheetRegistry(_temp) {
                        var _ref = _temp === void 0 ? {} : _temp,
                            _ref$styleSheet = _ref.styleSheet,
                            styleSheet = _ref$styleSheet === void 0 ? null : _ref$styleSheet,
                            _ref$optimizeForSpeed = _ref.optimizeForSpeed,
                            optimizeForSpeed = _ref$optimizeForSpeed === void 0 ? false : _ref$optimizeForSpeed,
                            _ref$isBrowser = _ref.isBrowser,
                            isBrowser = _ref$isBrowser === void 0 ? typeof window !== 'undefined' : _ref$isBrowser;

                        this._sheet =
                            styleSheet ||
                            new _stylesheet['default']({
                                name: 'styled-jsx',
                                optimizeForSpeed: optimizeForSpeed,
                            });

                        this._sheet.inject();

                        if (styleSheet && typeof optimizeForSpeed === 'boolean') {
                            this._sheet.setOptimizeForSpeed(optimizeForSpeed);

                            this._optimizeForSpeed = this._sheet.isOptimizeForSpeed();
                        }

                        this._isBrowser = isBrowser;
                        this._fromServer = undefined;
                        this._indices = {};
                        this._instancesCounts = {};
                        this.computeId = this.createComputeId();
                        this.computeSelector = this.createComputeSelector();
                    }

                    var _proto = StyleSheetRegistry.prototype;

                    _proto.add = function add(props) {
                        var _this = this;

                        if (undefined === this._optimizeForSpeed) {
                            this._optimizeForSpeed = Array.isArray(props.children);

                            this._sheet.setOptimizeForSpeed(this._optimizeForSpeed);

                            this._optimizeForSpeed = this._sheet.isOptimizeForSpeed();
                        }

                        if (this._isBrowser && !this._fromServer) {
                            this._fromServer = this.selectFromServer();
                            this._instancesCounts = Object.keys(this._fromServer).reduce(function(acc, tagName) {
                                acc[tagName] = 0;
                                return acc;
                            }, {});
                        }

                        var _this$getIdAndRules = this.getIdAndRules(props),
                            styleId = _this$getIdAndRules.styleId,
                            rules = _this$getIdAndRules.rules; // Deduping: just increase the instances count.

                        if (styleId in this._instancesCounts) {
                            this._instancesCounts[styleId] += 1;
                            return;
                        }

                        var indices = rules
                            .map(function(rule) {
                                return _this._sheet.insertRule(rule);
                            }) // Filter out invalid rules
                            .filter(function(index) {
                                return index !== -1;
                            });
                        this._indices[styleId] = indices;
                        this._instancesCounts[styleId] = 1;
                    };

                    _proto.remove = function remove(props) {
                        var _this2 = this;

                        var _this$getIdAndRules2 = this.getIdAndRules(props),
                            styleId = _this$getIdAndRules2.styleId;

                        invariant(styleId in this._instancesCounts, 'styleId: `' + styleId + '` not found');
                        this._instancesCounts[styleId] -= 1;

                        if (this._instancesCounts[styleId] < 1) {
                            var tagFromServer = this._fromServer && this._fromServer[styleId];

                            if (tagFromServer) {
                                tagFromServer.parentNode.removeChild(tagFromServer);
                                delete this._fromServer[styleId];
                            } else {
                                this._indices[styleId].forEach(function(index) {
                                    return _this2._sheet.deleteRule(index);
                                });

                                delete this._indices[styleId];
                            }

                            delete this._instancesCounts[styleId];
                        }
                    };

                    _proto.update = function update(props, nextProps) {
                        this.add(nextProps);
                        this.remove(props);
                    };

                    _proto.flush = function flush() {
                        this._sheet.flush();

                        this._sheet.inject();

                        this._fromServer = undefined;
                        this._indices = {};
                        this._instancesCounts = {};
                        this.computeId = this.createComputeId();
                        this.computeSelector = this.createComputeSelector();
                    };

                    _proto.cssRules = function cssRules() {
                        var _this3 = this;

                        var fromServer = this._fromServer
                            ? Object.keys(this._fromServer).map(function(styleId) {
                                  return [styleId, _this3._fromServer[styleId]];
                              })
                            : [];

                        var cssRules = this._sheet.cssRules();

                        return fromServer.concat(
                            Object.keys(this._indices)
                                .map(function(styleId) {
                                    return [
                                        styleId,
                                        _this3._indices[styleId]
                                            .map(function(index) {
                                                return cssRules[index].cssText;
                                            })
                                            .join(_this3._optimizeForSpeed ? '' : '\n'),
                                    ];
                                }) // filter out empty rules
                                .filter(function(rule) {
                                    return Boolean(rule[1]);
                                }),
                        );
                    };
                    /**
                     * createComputeId
                     *
                     * Creates a function to compute and memoize a jsx id from a basedId and optionally props.
                     */

                    _proto.createComputeId = function createComputeId() {
                        var cache = {};
                        return function(baseId, props) {
                            if (!props) {
                                return 'jsx-' + baseId;
                            }

                            var propsToString = String(props);
                            var key = baseId + propsToString; // return `jsx-${hashString(`${baseId}-${propsToString}`)}`

                            if (!cache[key]) {
                                cache[key] = 'jsx-' + (0, _stringHash['default'])(baseId + '-' + propsToString);
                            }

                            return cache[key];
                        };
                    };
                    /**
                     * createComputeSelector
                     *
                     * Creates a function to compute and memoize dynamic selectors.
                     */

                    _proto.createComputeSelector = function createComputeSelector(selectoPlaceholderRegexp) {
                        if (selectoPlaceholderRegexp === void 0) {
                            selectoPlaceholderRegexp = /__jsx-style-dynamic-selector/g;
                        }

                        var cache = {};
                        return function(id, css) {
                            // Sanitize SSR-ed CSS.
                            // Client side code doesn't need to be sanitized since we use
                            // document.createTextNode (dev) and the CSSOM api sheet.insertRule (prod).
                            if (!this._isBrowser) {
                                css = sanitize(css);
                            }

                            var idcss = id + css;

                            if (!cache[idcss]) {
                                cache[idcss] = css.replace(selectoPlaceholderRegexp, id);
                            }

                            return cache[idcss];
                        };
                    };

                    _proto.getIdAndRules = function getIdAndRules(props) {
                        var _this4 = this;

                        var css = props.children,
                            dynamic = props.dynamic,
                            id = props.id;

                        if (dynamic) {
                            var styleId = this.computeId(id, dynamic);
                            return {
                                styleId: styleId,
                                rules: Array.isArray(css)
                                    ? css.map(function(rule) {
                                          return _this4.computeSelector(styleId, rule);
                                      })
                                    : [this.computeSelector(styleId, css)],
                            };
                        }

                        return {
                            styleId: this.computeId(id),
                            rules: Array.isArray(css) ? css : [css],
                        };
                    };
                    /**
                     * selectFromServer
                     *
                     * Collects style tags from the document with id __jsx-XXX
                     */

                    _proto.selectFromServer = function selectFromServer() {
                        var elements = Array.prototype.slice.call(document.querySelectorAll('[id^="__jsx-"]'));
                        return elements.reduce(function(acc, element) {
                            var id = element.id.slice(2);
                            acc[id] = element;
                            return acc;
                        }, {});
                    };

                    return StyleSheetRegistry;
                })();

            exports['default'] = StyleSheetRegistry;

            function invariant(condition, message) {
                if (!condition) {
                    throw new Error('StyleSheetRegistry: ' + message + '.');
                }
            }

            /***/
        },

        /***/ Skye: /***/ function(module) {
            module.exports = JSON.parse('{"a":[]}');

            /***/
        },

        /***/ VDXt: /***/ function(module, exports, __webpack_require__) {
            'use strict';

            exports.__esModule = true;
            exports.middleware = middleware;
            exports.NextScript = exports.Main = exports.Head = exports.Html = exports.default = void 0;

            var _propTypes = _interopRequireDefault(__webpack_require__('17x9'));

            var _react = _interopRequireWildcard(__webpack_require__('q1tI'));

            var _server = _interopRequireDefault(__webpack_require__('DTay'));

            var _constants = __webpack_require__('w7wo');

            var _documentContext = __webpack_require__('nRxi');

            var _utils = __webpack_require__('g/15');

            exports.DocumentContext = _utils.DocumentContext;
            exports.DocumentInitialProps = _utils.DocumentInitialProps;
            exports.DocumentProps = _utils.DocumentProps;

            var _utils2 = __webpack_require__('PRL6');

            var _htmlescape = __webpack_require__('AXZJ');

            function _interopRequireDefault(obj) {
                return obj && obj.__esModule
                    ? obj
                    : {
                          default: obj,
                      };
            }

            function _getRequireWildcardCache() {
                if (typeof WeakMap !== 'function') return null;
                var cache = new WeakMap();

                _getRequireWildcardCache = function() {
                    return cache;
                };

                return cache;
            }

            function _interopRequireWildcard(obj) {
                if (obj && obj.__esModule) {
                    return obj;
                }

                if (obj === null || (typeof obj !== 'object' && typeof obj !== 'function')) {
                    return {
                        default: obj,
                    };
                }

                var cache = _getRequireWildcardCache();

                if (cache && cache.has(obj)) {
                    return cache.get(obj);
                }

                var newObj = {};
                var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;

                for (var key in obj) {
                    if (Object.prototype.hasOwnProperty.call(obj, key)) {
                        var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;

                        if (desc && (desc.get || desc.set)) {
                            Object.defineProperty(newObj, key, desc);
                        } else {
                            newObj[key] = obj[key];
                        }
                    }
                }

                newObj.default = obj;

                if (cache) {
                    cache.set(obj, newObj);
                }

                return newObj;
            }

            async function middleware({ req, res }) {}

            function dedupe(bundles) {
                const files = new Set();
                const kept = [];

                for (const bundle of bundles) {
                    if (files.has(bundle.file)) continue;
                    files.add(bundle.file);
                    kept.push(bundle);
                }

                return kept;
            }

            function getOptionalModernScriptVariant(path) {
                if (false) {
                }

                return path;
            }

            function isLowPriority(file) {
                return file.includes('_buildManifest');
            }
            /**
             * `Document` component handles the initial `document` markup and renders only on the server side.
             * Commonly used for implementing server side rendering for `css-in-js` libraries.
             */

            class Document extends _react.Component {
                /**
                 * `getInitialProps` hook returns the context object with the addition of `renderPage`.
                 * `renderPage` callback executes `React` rendering logic synchronously to support server-rendering wrappers
                 */
                static async getInitialProps(ctx) {
                    const enhancers = false ? undefined : [];

                    const enhanceApp = App => {
                        for (const enhancer of enhancers) {
                            App = enhancer(App);
                        }

                        return props => _react.default.createElement(App, props);
                    };

                    const { html, head } = await ctx.renderPage({
                        enhanceApp,
                    });
                    const styles = [...(0, _server.default)(), ...(false ? undefined : [])];
                    return {
                        html,
                        head,
                        styles,
                    };
                }

                static renderDocument(Document, props) {
                    return _react.default.createElement(
                        _documentContext.DocumentContext.Provider,
                        {
                            value: {
                                _documentProps: props,
                                // In dev we invalidate the cache by appending a timestamp to the resource URL.
                                // This is a workaround to fix https://github.com/zeit/next.js/issues/5860
                                // TODO: remove this workaround when https://bugs.webkit.org/show_bug.cgi?id=187726 is fixed.
                                _devOnlyInvalidateCacheQueryString: false ? undefined : '',
                            },
                        },
                        _react.default.createElement(Document, props),
                    );
                }

                render() {
                    return _react.default.createElement(
                        Html,
                        null,
                        _react.default.createElement(Head, null),
                        _react.default.createElement(
                            'body',
                            null,
                            _react.default.createElement(Main, null),
                            _react.default.createElement(NextScript, null),
                        ),
                    );
                }
            }

            exports.default = Document;
            Document.headTagsMiddleware = false ? undefined : () => [];
            Document.bodyTagsMiddleware = false ? undefined : () => [];
            Document.htmlPropsMiddleware = false ? undefined : () => [];

            class Html extends _react.Component {
                constructor(...args) {
                    super(...args);
                    this.context = void 0;
                }

                render() {
                    const { inAmpMode, htmlProps } = this.context._documentProps;
                    return _react.default.createElement(
                        'html',
                        Object.assign({}, htmlProps, this.props, {
                            amp: inAmpMode ? '' : undefined,
                            'data-ampdevmode': inAmpMode && false ? '' : undefined,
                        }),
                    );
                }
            }

            exports.Html = Html;
            Html.contextType = _documentContext.DocumentContext;
            Html.propTypes = {
                children: _propTypes.default.node.isRequired,
            };

            class Head extends _react.Component {
                constructor(...args) {
                    super(...args);
                    this.context = void 0;
                }

                getCssLinks() {
                    const { assetPrefix, files } = this.context._documentProps;
                    const cssFiles = files && files.length ? files.filter(f => /\.css$/.test(f)) : [];
                    const cssLinkElements = [];
                    cssFiles.forEach(file => {
                        cssLinkElements.push(
                            _react.default.createElement('link', {
                                key: `${file}-preload`,
                                nonce: this.props.nonce,
                                rel: 'preload',
                                href: `${assetPrefix}/_next/${encodeURI(file)}`,
                                as: 'style',
                                crossOrigin: this.props.crossOrigin || undefined,
                            }),
                            _react.default.createElement('link', {
                                key: file,
                                nonce: this.props.nonce,
                                rel: 'stylesheet',
                                href: `${assetPrefix}/_next/${encodeURI(file)}`,
                                crossOrigin: this.props.crossOrigin || undefined,
                            }),
                        );
                    });
                    return cssLinkElements.length === 0 ? null : cssLinkElements;
                }

                getPreloadDynamicChunks() {
                    const { dynamicImports, assetPrefix } = this.context._documentProps;
                    const { _devOnlyInvalidateCacheQueryString } = this.context;
                    return dedupe(dynamicImports)
                        .map(bundle => {
                            // `dynamicImports` will contain both `.js` and `.module.js` when the
                            // feature is enabled. This clause will filter down to the modern
                            // variants only.
                            if (!bundle.file.endsWith(getOptionalModernScriptVariant('.js'))) {
                                return null;
                            }

                            return _react.default.createElement('link', {
                                rel: 'preload',
                                key: bundle.file,
                                href: `${assetPrefix}/_next/${encodeURI(
                                    bundle.file,
                                )}${_devOnlyInvalidateCacheQueryString}`,
                                as: 'script',
                                nonce: this.props.nonce,
                                crossOrigin: this.props.crossOrigin || undefined,
                            });
                        }) // Filter out nulled scripts
                        .filter(Boolean);
                }

                getPreloadMainLinks() {
                    const { assetPrefix, files } = this.context._documentProps;
                    const { _devOnlyInvalidateCacheQueryString } = this.context;
                    const preloadFiles =
                        files && files.length
                            ? files.filter(file => {
                                  // `dynamicImports` will contain both `.js` and `.module.js` when
                                  // the feature is enabled. This clause will filter down to the
                                  // modern variants only.
                                  //
                                  // Also filter out low priority files because they should not be
                                  // preloaded for performance reasons.
                                  return file.endsWith(getOptionalModernScriptVariant('.js')) && !isLowPriority(file);
                              })
                            : [];
                    return preloadFiles.length === 0
                        ? null
                        : preloadFiles.map(file => {
                              return _react.default.createElement('link', {
                                  key: file,
                                  nonce: this.props.nonce,
                                  rel: 'preload',
                                  href: `${assetPrefix}/_next/${encodeURI(file)}${_devOnlyInvalidateCacheQueryString}`,
                                  as: 'script',
                                  crossOrigin: this.props.crossOrigin || undefined,
                              });
                          });
                }

                render() {
                    const {
                        styles,
                        ampPath,
                        inAmpMode,
                        assetPrefix,
                        hybridAmp,
                        canonicalBase,
                        __NEXT_DATA__,
                        dangerousAsPath,
                        headTags,
                    } = this.context._documentProps;
                    const { _devOnlyInvalidateCacheQueryString } = this.context;
                    const { page, buildId } = __NEXT_DATA__;
                    let { head } = this.context._documentProps;
                    let children = this.props.children; // show a warning if Head contains <title> (only in development)

                    if (false) {
                    }

                    let hasAmphtmlRel = false;
                    let hasCanonicalRel = false; // show warning and remove conflicting amp head tags

                    head = _react.default.Children.map(head || [], child => {
                        if (!child) return child;
                        const { type, props } = child;

                        if (inAmpMode) {
                            let badProp = '';

                            if (type === 'meta' && props.name === 'viewport') {
                                badProp = 'name="viewport"';
                            } else if (type === 'link' && props.rel === 'canonical') {
                                hasCanonicalRel = true;
                            } else if (type === 'script') {
                                // only block if
                                // 1. it has a src and isn't pointing to ampproject's CDN
                                // 2. it is using dangerouslySetInnerHTML without a type or
                                // a type of text/javascript
                                if (
                                    (props.src && props.src.indexOf('ampproject') < -1) ||
                                    (props.dangerouslySetInnerHTML && (!props.type || props.type === 'text/javascript'))
                                ) {
                                    badProp = '<script';
                                    Object.keys(props).forEach(prop => {
                                        badProp += ` ${prop}="${props[prop]}"`;
                                    });
                                    badProp += '/>';
                                }
                            }

                            if (badProp) {
                                console.warn(
                                    `Found conflicting amp tag "${child.type}" with conflicting prop ${badProp} in ${__NEXT_DATA__.page}. https://err.sh/next.js/conflicting-amp-tag`,
                                );
                                return null;
                            }
                        } else {
                            // non-amp mode
                            if (type === 'link' && props.rel === 'amphtml') {
                                hasAmphtmlRel = true;
                            }
                        }

                        return child;
                    }); // try to parse styles from fragment for backwards compat

                    const curStyles = Array.isArray(styles) ? styles : [];

                    if (
                        inAmpMode &&
                        styles && // @ts-ignore Property 'props' does not exist on type ReactElement
                        styles.props && // @ts-ignore Property 'props' does not exist on type ReactElement
                        Array.isArray(styles.props.children)
                    ) {
                        const hasStyles = el =>
                            el &&
                            el.props &&
                            el.props.dangerouslySetInnerHTML &&
                            el.props.dangerouslySetInnerHTML.__html; // @ts-ignore Property 'props' does not exist on type ReactElement

                        styles.props.children.forEach(child => {
                            if (Array.isArray(child)) {
                                child.map(el => hasStyles(el) && curStyles.push(el));
                            } else if (hasStyles(child)) {
                                curStyles.push(child);
                            }
                        });
                    }

                    return _react.default.createElement(
                        'head',
                        this.props,
                        this.context._documentProps.isDevelopment &&
                            this.context._documentProps.hasCssMode &&
                            _react.default.createElement(
                                _react.default.Fragment,
                                null,
                                _react.default.createElement('style', {
                                    'data-next-hide-fouc': true,
                                    'data-ampdevmode': inAmpMode ? 'true' : undefined,
                                    dangerouslySetInnerHTML: {
                                        __html: `body{display:none}`,
                                    },
                                }),
                                _react.default.createElement(
                                    'noscript',
                                    {
                                        'data-next-hide-fouc': true,
                                        'data-ampdevmode': inAmpMode ? 'true' : undefined,
                                    },
                                    _react.default.createElement('style', {
                                        dangerouslySetInnerHTML: {
                                            __html: `body{display:block}`,
                                        },
                                    }),
                                ),
                            ),
                        children,
                        head,
                        _react.default.createElement('meta', {
                            name: 'next-head-count',
                            content: _react.default.Children.count(head || []).toString(),
                        }),
                        inAmpMode &&
                            _react.default.createElement(
                                _react.default.Fragment,
                                null,
                                _react.default.createElement('meta', {
                                    name: 'viewport',
                                    content: 'width=device-width,minimum-scale=1,initial-scale=1',
                                }),
                                !hasCanonicalRel &&
                                    _react.default.createElement('link', {
                                        rel: 'canonical',
                                        href: canonicalBase + (0, _utils2.cleanAmpPath)(dangerousAsPath),
                                    }),
                                _react.default.createElement('link', {
                                    rel: 'preload',
                                    as: 'script',
                                    href: 'https://cdn.ampproject.org/v0.js',
                                }),
                                styles &&
                                    _react.default.createElement('style', {
                                        'amp-custom': '',
                                        dangerouslySetInnerHTML: {
                                            __html: curStyles
                                                .map(style => style.props.dangerouslySetInnerHTML.__html)
                                                .join('')
                                                .replace(/\/\*# sourceMappingURL=.*\*\//g, '')
                                                .replace(/\/\*@ sourceURL=.*?\*\//g, ''),
                                        },
                                    }),
                                _react.default.createElement('style', {
                                    'amp-boilerplate': '',
                                    dangerouslySetInnerHTML: {
                                        __html: `body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}`,
                                    },
                                }),
                                _react.default.createElement(
                                    'noscript',
                                    null,
                                    _react.default.createElement('style', {
                                        'amp-boilerplate': '',
                                        dangerouslySetInnerHTML: {
                                            __html: `body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}`,
                                        },
                                    }),
                                ),
                                _react.default.createElement('script', {
                                    async: true,
                                    src: 'https://cdn.ampproject.org/v0.js',
                                }),
                            ),
                        !inAmpMode &&
                            _react.default.createElement(
                                _react.default.Fragment,
                                null,
                                !hasAmphtmlRel &&
                                    hybridAmp &&
                                    _react.default.createElement('link', {
                                        rel: 'amphtml',
                                        href: canonicalBase + getAmpPath(ampPath, dangerousAsPath),
                                    }),
                                this.getCssLinks(),
                                page !== '/_error' &&
                                    _react.default.createElement('link', {
                                        rel: 'preload',
                                        href:
                                            assetPrefix +
                                            getOptionalModernScriptVariant(
                                                encodeURI(`/_next/static/${buildId}/pages${getPageFile(page)}`),
                                            ) +
                                            _devOnlyInvalidateCacheQueryString,
                                        as: 'script',
                                        nonce: this.props.nonce,
                                        crossOrigin: this.props.crossOrigin || undefined,
                                    }),
                                _react.default.createElement('link', {
                                    rel: 'preload',
                                    href:
                                        assetPrefix +
                                        getOptionalModernScriptVariant(
                                            encodeURI(`/_next/static/${buildId}/pages/_app.js`),
                                        ) +
                                        _devOnlyInvalidateCacheQueryString,
                                    as: 'script',
                                    nonce: this.props.nonce,
                                    crossOrigin: this.props.crossOrigin || undefined,
                                }),
                                this.getPreloadDynamicChunks(),
                                this.getPreloadMainLinks(),
                                this.context._documentProps.isDevelopment &&
                                this.context._documentProps.hasCssMode && // this element is used to mount development styles so the
                                    // ordering matches production
                                    // (by default, style-loader injects at the bottom of <head />)
                                    _react.default.createElement('noscript', {
                                        id: '__next_css__DO_NOT_USE__',
                                    }),
                                styles || null,
                            ),
                        _react.default.createElement(_react.default.Fragment, {}, ...(headTags || [])),
                    );
                }
            }

            exports.Head = Head;
            Head.contextType = _documentContext.DocumentContext;
            Head.propTypes = {
                nonce: _propTypes.default.string,
                crossOrigin: _propTypes.default.string,
            };

            class Main extends _react.Component {
                constructor(...args) {
                    super(...args);
                    this.context = void 0;
                }

                render() {
                    const { inAmpMode, html } = this.context._documentProps;
                    if (inAmpMode) return _constants.AMP_RENDER_TARGET;
                    return _react.default.createElement('div', {
                        id: '__next',
                        dangerouslySetInnerHTML: {
                            __html: html,
                        },
                    });
                }
            }

            exports.Main = Main;
            Main.contextType = _documentContext.DocumentContext;

            class NextScript extends _react.Component {
                constructor(...args) {
                    super(...args);
                    this.context = void 0;
                }

                getDynamicChunks() {
                    const { dynamicImports, assetPrefix, files } = this.context._documentProps;
                    const { _devOnlyInvalidateCacheQueryString } = this.context;
                    return dedupe(dynamicImports).map(bundle => {
                        let modernProps = {};

                        if (false) {
                        }

                        if (!/\.js$/.test(bundle.file) || files.includes(bundle.file)) return null;
                        return _react.default.createElement(
                            'script',
                            Object.assign(
                                {
                                    async: true,
                                    key: bundle.file,
                                    src: `${assetPrefix}/_next/${encodeURI(
                                        bundle.file,
                                    )}${_devOnlyInvalidateCacheQueryString}`,
                                    nonce: this.props.nonce,
                                    crossOrigin: this.props.crossOrigin || undefined,
                                },
                                modernProps,
                            ),
                        );
                    });
                }

                getScripts() {
                    const { assetPrefix, files } = this.context._documentProps;

                    if (!files || files.length === 0) {
                        return null;
                    }

                    const { _devOnlyInvalidateCacheQueryString } = this.context;
                    const normalScripts = files.filter(file => file.endsWith('.js') && !isLowPriority(file));
                    const lowPriorityScripts = files.filter(file => file.endsWith('.js') && isLowPriority(file));
                    return [...normalScripts, ...lowPriorityScripts].map(file => {
                        let modernProps = {};

                        if (false) {
                        }

                        return _react.default.createElement(
                            'script',
                            Object.assign(
                                {
                                    key: file,
                                    src: `${assetPrefix}/_next/${encodeURI(file)}${_devOnlyInvalidateCacheQueryString}`,
                                    nonce: this.props.nonce,
                                    async: true,
                                    crossOrigin: this.props.crossOrigin || undefined,
                                },
                                modernProps,
                            ),
                        );
                    });
                }

                getPolyfillScripts() {
                    // polyfills.js has to be rendered as nomodule without async
                    // It also has to be the first script to load
                    const { assetPrefix, polyfillFiles } = this.context._documentProps;
                    const { _devOnlyInvalidateCacheQueryString } = this.context;
                    return polyfillFiles
                        .filter(polyfill => polyfill.endsWith('.js') && !/\.module\.js$/.test(polyfill))
                        .map(polyfill =>
                            _react.default.createElement('script', {
                                key: polyfill,
                                nonce: this.props.nonce,
                                crossOrigin: this.props.crossOrigin || undefined,
                                noModule: true,
                                src: `${assetPrefix}/_next/${polyfill}${_devOnlyInvalidateCacheQueryString}`,
                            }),
                        );
                }

                static getInlineScriptSource(documentProps) {
                    const { __NEXT_DATA__ } = documentProps;

                    try {
                        const data = JSON.stringify(__NEXT_DATA__);
                        return (0, _htmlescape.htmlEscapeJsonString)(data);
                    } catch (err) {
                        if (err.message.indexOf('circular structure')) {
                            throw new Error(
                                `Circular structure in "getInitialProps" result of page "${__NEXT_DATA__.page}". https://err.sh/zeit/next.js/circular-structure`,
                            );
                        }

                        throw err;
                    }
                }

                render() {
                    const {
                        staticMarkup,
                        assetPrefix,
                        inAmpMode,
                        devFiles,
                        __NEXT_DATA__,
                        bodyTags,
                    } = this.context._documentProps;
                    const { _devOnlyInvalidateCacheQueryString } = this.context;

                    if (inAmpMode) {
                        if (true) {
                            return null;
                        }

                        const devFiles = [
                            _constants.CLIENT_STATIC_FILES_RUNTIME_AMP,
                            _constants.CLIENT_STATIC_FILES_RUNTIME_WEBPACK,
                        ];
                        return _react.default.createElement(
                            _react.default.Fragment,
                            null,
                            staticMarkup
                                ? null
                                : _react.default.createElement('script', {
                                      id: '__NEXT_DATA__',
                                      type: 'application/json',
                                      nonce: this.props.nonce,
                                      crossOrigin: this.props.crossOrigin || undefined,
                                      dangerouslySetInnerHTML: {
                                          __html: NextScript.getInlineScriptSource(this.context._documentProps),
                                      },
                                      'data-ampdevmode': true,
                                  }),
                            devFiles
                                ? devFiles.map(file =>
                                      _react.default.createElement('script', {
                                          key: file,
                                          src: `${assetPrefix}/_next/${file}${_devOnlyInvalidateCacheQueryString}`,
                                          nonce: this.props.nonce,
                                          crossOrigin: this.props.crossOrigin || undefined,
                                          'data-ampdevmode': true,
                                      }),
                                  )
                                : null,
                            _react.default.createElement(_react.default.Fragment, {}, ...(bodyTags || [])),
                        );
                    }

                    const { page, buildId } = __NEXT_DATA__;

                    if (false) {
                    }

                    const pageScript = [
                        _react.default.createElement(
                            'script',
                            Object.assign(
                                {
                                    async: true,
                                    'data-next-page': page,
                                    key: page,
                                    src:
                                        assetPrefix +
                                        encodeURI(`/_next/static/${buildId}/pages${getPageFile(page)}`) +
                                        _devOnlyInvalidateCacheQueryString,
                                    nonce: this.props.nonce,
                                    crossOrigin: this.props.crossOrigin || undefined,
                                },
                                false ? undefined : {},
                            ),
                        ),
                        false && false,
                    ];
                    const appScript = [
                        _react.default.createElement(
                            'script',
                            Object.assign(
                                {
                                    async: true,
                                    'data-next-page': '/_app',
                                    src:
                                        assetPrefix +
                                        `/_next/static/${buildId}/pages/_app.js` +
                                        _devOnlyInvalidateCacheQueryString,
                                    key: '_app',
                                    nonce: this.props.nonce,
                                    crossOrigin: this.props.crossOrigin || undefined,
                                },
                                false ? undefined : {},
                            ),
                        ),
                        false && false,
                    ];
                    return _react.default.createElement(
                        _react.default.Fragment,
                        null,
                        devFiles
                            ? devFiles.map(
                                  file =>
                                      !file.match(/\.js\.map/) &&
                                      _react.default.createElement('script', {
                                          key: file,
                                          src: `${assetPrefix}/_next/${encodeURI(
                                              file,
                                          )}${_devOnlyInvalidateCacheQueryString}`,
                                          nonce: this.props.nonce,
                                          crossOrigin: this.props.crossOrigin || undefined,
                                      }),
                              )
                            : null,
                        staticMarkup
                            ? null
                            : _react.default.createElement('script', {
                                  id: '__NEXT_DATA__',
                                  type: 'application/json',
                                  nonce: this.props.nonce,
                                  crossOrigin: this.props.crossOrigin || undefined,
                                  dangerouslySetInnerHTML: {
                                      __html: NextScript.getInlineScriptSource(this.context._documentProps),
                                  },
                              }),
                        false ? undefined : null,
                        this.getPolyfillScripts(),
                        page !== '/_error' && pageScript,
                        appScript,
                        staticMarkup ? null : this.getDynamicChunks(),
                        staticMarkup ? null : this.getScripts(),
                        _react.default.createElement(_react.default.Fragment, {}, ...(bodyTags || [])),
                    );
                }
            }

            exports.NextScript = NextScript;
            NextScript.contextType = _documentContext.DocumentContext;
            NextScript.propTypes = {
                nonce: _propTypes.default.string,
                crossOrigin: _propTypes.default.string,
            };
            NextScript.safariNomoduleFix =
                '!function(){var e=document,t=e.createElement("script");if(!("noModule"in t)&&"onbeforeload"in t){var n=!1;e.addEventListener("beforeload",function(e){if(e.target===t)n=!0;else if(!e.target.hasAttribute("nomodule")||!n)return;e.preventDefault()},!0),t.type="module",t.src=".",e.head.appendChild(t),t.remove()}}();';

            function getAmpPath(ampPath, asPath) {
                return ampPath ? ampPath : `${asPath}${asPath.includes('?') ? '&' : '?'}amp=1`;
            }

            function getPageFile(page, buildId) {
                if (page === '/') {
                    return buildId ? `/index.${buildId}.js` : '/index.js';
                }

                return buildId ? `${page}.${buildId}.js` : `${page}.js`;
            }

            /***/
        },

        /***/ WbBG: /***/ function(module, exports, __webpack_require__) {
            'use strict';
            /**
             * Copyright (c) 2013-present, Facebook, Inc.
             *
             * This source code is licensed under the MIT license found in the
             * LICENSE file in the root directory of this source tree.
             */

            var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

            module.exports = ReactPropTypesSecret;

            /***/
        },

        /***/ Xuae: /***/ function(module, exports, __webpack_require__) {
            'use strict';

            Object.defineProperty(exports, '__esModule', {
                value: true,
            });

            const react_1 = __webpack_require__('q1tI');

            const isServer = true;

            exports.default = () => {
                const mountedInstances = new Set();
                let state;

                function emitChange(component) {
                    state = component.props.reduceComponentsToState([...mountedInstances], component.props);

                    if (component.props.handleStateChange) {
                        component.props.handleStateChange(state);
                    }
                }

                return class extends react_1.Component {
                    // Used when server rendering
                    static rewind() {
                        const recordedState = state;
                        state = undefined;
                        mountedInstances.clear();
                        return recordedState;
                    }

                    constructor(props) {
                        super(props);

                        if (isServer) {
                            mountedInstances.add(this);
                            emitChange(this);
                        }
                    }

                    componentDidMount() {
                        mountedInstances.add(this);
                        emitChange(this);
                    }

                    componentDidUpdate() {
                        emitChange(this);
                    }

                    componentWillUnmount() {
                        mountedInstances.delete(this);
                        emitChange(this);
                    }

                    render() {
                        return null;
                    }
                };
            };

            /***/
        },

        /***/ Y4gF: /***/ function(module, exports, __webpack_require__) {
            'use strict';
            /*!
             * etag
             * Copyright(c) 2014-2016 Douglas Christopher Wilson
             * MIT Licensed
             */

            /**
             * Module exports.
             * @public
             */

            module.exports = etag;

            /**
             * Module dependencies.
             * @private
             */

            var crypto = __webpack_require__('PJMN');
            var Stats = __webpack_require__('mw/K').Stats;

            /**
             * Module variables.
             * @private
             */

            var toString = Object.prototype.toString;

            /**
             * Generate an entity tag.
             *
             * @param {Buffer|string} entity
             * @return {string}
             * @private
             */

            function entitytag(entity) {
                if (entity.length === 0) {
                    // fast-path empty
                    return '"0-2jmj7l5rSw0yVb/vlWAYkK/YBwk"';
                }

                // compute hash of entity
                var hash = crypto
                    .createHash('sha1')
                    .update(entity, 'utf8')
                    .digest('base64')
                    .substring(0, 27);

                // compute length of entity
                var len = typeof entity === 'string' ? Buffer.byteLength(entity, 'utf8') : entity.length;

                return '"' + len.toString(16) + '-' + hash + '"';
            }

            /**
             * Create a simple ETag.
             *
             * @param {string|Buffer|Stats} entity
             * @param {object} [options]
             * @param {boolean} [options.weak]
             * @return {String}
             * @public
             */

            function etag(entity, options) {
                if (entity == null) {
                    throw new TypeError('argument entity is required');
                }

                // support fs.Stats object
                var isStats = isstats(entity);
                var weak = options && typeof options.weak === 'boolean' ? options.weak : isStats;

                // validate argument
                if (!isStats && typeof entity !== 'string' && !Buffer.isBuffer(entity)) {
                    throw new TypeError('argument entity must be string, Buffer, or fs.Stats');
                }

                // generate entity tag
                var tag = isStats ? stattag(entity) : entitytag(entity);

                return weak ? 'W/' + tag : tag;
            }

            /**
             * Determine if object is a Stats object.
             *
             * @param {object} obj
             * @return {boolean}
             * @api private
             */

            function isstats(obj) {
                // genuine fs.Stats
                if (typeof Stats === 'function' && obj instanceof Stats) {
                    return true;
                }

                // quack quack
                return (
                    obj &&
                    typeof obj === 'object' &&
                    'ctime' in obj &&
                    toString.call(obj.ctime) === '[object Date]' &&
                    'mtime' in obj &&
                    toString.call(obj.mtime) === '[object Date]' &&
                    'ino' in obj &&
                    typeof obj.ino === 'number' &&
                    'size' in obj &&
                    typeof obj.size === 'number'
                );
            }

            /**
             * Generate a tag for a stat.
             *
             * @param {object} stat
             * @return {string}
             * @private
             */

            function stattag(stat) {
                var mtime = stat.mtime.getTime().toString(16);
                var size = stat.size.toString(16);

                return '"' + size + '-' + mtime + '"';
            }

            /***/
        },

        /***/ bVZc: /***/ function(module, exports, __webpack_require__) {
            'use strict';

            exports.__esModule = true;
            exports['default'] = void 0;

            function _defineProperties(target, props) {
                for (var i = 0; i < props.length; i++) {
                    var descriptor = props[i];
                    descriptor.enumerable = descriptor.enumerable || false;
                    descriptor.configurable = true;
                    if ('value' in descriptor) descriptor.writable = true;
                    Object.defineProperty(target, descriptor.key, descriptor);
                }
            }

            function _createClass(Constructor, protoProps, staticProps) {
                if (protoProps) _defineProperties(Constructor.prototype, protoProps);
                if (staticProps) _defineProperties(Constructor, staticProps);
                return Constructor;
            }

            /*
Based on Glamor's sheet
https://github.com/threepointone/glamor/blob/667b480d31b3721a905021b26e1290ce92ca2879/src/sheet.js
*/
            var isProd = typeof process !== 'undefined' && process.env && 'production' === 'production';

            var isString = function isString(o) {
                return Object.prototype.toString.call(o) === '[object String]';
            };

            var StyleSheet =
                /*#__PURE__*/
                (function() {
                    function StyleSheet(_temp) {
                        var _ref = _temp === void 0 ? {} : _temp,
                            _ref$name = _ref.name,
                            name = _ref$name === void 0 ? 'stylesheet' : _ref$name,
                            _ref$optimizeForSpeed = _ref.optimizeForSpeed,
                            optimizeForSpeed = _ref$optimizeForSpeed === void 0 ? isProd : _ref$optimizeForSpeed,
                            _ref$isBrowser = _ref.isBrowser,
                            isBrowser = _ref$isBrowser === void 0 ? typeof window !== 'undefined' : _ref$isBrowser;

                        invariant(isString(name), '`name` must be a string');
                        this._name = name;
                        this._deletedRulePlaceholder = '#' + name + '-deleted-rule____{}';
                        invariant(typeof optimizeForSpeed === 'boolean', '`optimizeForSpeed` must be a boolean');
                        this._optimizeForSpeed = optimizeForSpeed;
                        this._isBrowser = isBrowser;
                        this._serverSheet = undefined;
                        this._tags = [];
                        this._injected = false;
                        this._rulesCount = 0;
                        var node = this._isBrowser && document.querySelector('meta[property="csp-nonce"]');
                        this._nonce = node ? node.getAttribute('content') : null;
                    }

                    var _proto = StyleSheet.prototype;

                    _proto.setOptimizeForSpeed = function setOptimizeForSpeed(bool) {
                        invariant(typeof bool === 'boolean', '`setOptimizeForSpeed` accepts a boolean');
                        invariant(
                            this._rulesCount === 0,
                            'optimizeForSpeed cannot be when rules have already been inserted',
                        );
                        this.flush();
                        this._optimizeForSpeed = bool;
                        this.inject();
                    };

                    _proto.isOptimizeForSpeed = function isOptimizeForSpeed() {
                        return this._optimizeForSpeed;
                    };

                    _proto.inject = function inject() {
                        var _this = this;

                        invariant(!this._injected, 'sheet already injected');
                        this._injected = true;

                        if (this._isBrowser && this._optimizeForSpeed) {
                            this._tags[0] = this.makeStyleTag(this._name);
                            this._optimizeForSpeed = 'insertRule' in this.getSheet();

                            if (!this._optimizeForSpeed) {
                                if (!isProd) {
                                    console.warn(
                                        'StyleSheet: optimizeForSpeed mode not supported falling back to standard mode.',
                                    );
                                }

                                this.flush();
                                this._injected = true;
                            }

                            return;
                        }

                        this._serverSheet = {
                            cssRules: [],
                            insertRule: function insertRule(rule, index) {
                                if (typeof index === 'number') {
                                    _this._serverSheet.cssRules[index] = {
                                        cssText: rule,
                                    };
                                } else {
                                    _this._serverSheet.cssRules.push({
                                        cssText: rule,
                                    });
                                }

                                return index;
                            },
                            deleteRule: function deleteRule(index) {
                                _this._serverSheet.cssRules[index] = null;
                            },
                        };
                    };

                    _proto.getSheetForTag = function getSheetForTag(tag) {
                        if (tag.sheet) {
                            return tag.sheet;
                        } // this weirdness brought to you by firefox

                        for (var i = 0; i < document.styleSheets.length; i++) {
                            if (document.styleSheets[i].ownerNode === tag) {
                                return document.styleSheets[i];
                            }
                        }
                    };

                    _proto.getSheet = function getSheet() {
                        return this.getSheetForTag(this._tags[this._tags.length - 1]);
                    };

                    _proto.insertRule = function insertRule(rule, index) {
                        invariant(isString(rule), '`insertRule` accepts only strings');

                        if (!this._isBrowser) {
                            if (typeof index !== 'number') {
                                index = this._serverSheet.cssRules.length;
                            }

                            this._serverSheet.insertRule(rule, index);

                            return this._rulesCount++;
                        }

                        if (this._optimizeForSpeed) {
                            var sheet = this.getSheet();

                            if (typeof index !== 'number') {
                                index = sheet.cssRules.length;
                            } // this weirdness for perf, and chrome's weird bug
                            // https://stackoverflow.com/questions/20007992/chrome-suddenly-stopped-accepting-insertrule

                            try {
                                sheet.insertRule(rule, index);
                            } catch (error) {
                                if (!isProd) {
                                    console.warn(
                                        'StyleSheet: illegal rule: \n\n' +
                                            rule +
                                            '\n\nSee https://stackoverflow.com/q/20007992 for more info',
                                    );
                                }

                                return -1;
                            }
                        } else {
                            var insertionPoint = this._tags[index];

                            this._tags.push(this.makeStyleTag(this._name, rule, insertionPoint));
                        }

                        return this._rulesCount++;
                    };

                    _proto.replaceRule = function replaceRule(index, rule) {
                        if (this._optimizeForSpeed || !this._isBrowser) {
                            var sheet = this._isBrowser ? this.getSheet() : this._serverSheet;

                            if (!rule.trim()) {
                                rule = this._deletedRulePlaceholder;
                            }

                            if (!sheet.cssRules[index]) {
                                // @TBD Should we throw an error?
                                return index;
                            }

                            sheet.deleteRule(index);

                            try {
                                sheet.insertRule(rule, index);
                            } catch (error) {
                                if (!isProd) {
                                    console.warn(
                                        'StyleSheet: illegal rule: \n\n' +
                                            rule +
                                            '\n\nSee https://stackoverflow.com/q/20007992 for more info',
                                    );
                                } // In order to preserve the indices we insert a deleteRulePlaceholder

                                sheet.insertRule(this._deletedRulePlaceholder, index);
                            }
                        } else {
                            var tag = this._tags[index];
                            invariant(tag, 'old rule at index `' + index + '` not found');
                            tag.textContent = rule;
                        }

                        return index;
                    };

                    _proto.deleteRule = function deleteRule(index) {
                        if (!this._isBrowser) {
                            this._serverSheet.deleteRule(index);

                            return;
                        }

                        if (this._optimizeForSpeed) {
                            this.replaceRule(index, '');
                        } else {
                            var tag = this._tags[index];
                            invariant(tag, 'rule at index `' + index + '` not found');
                            tag.parentNode.removeChild(tag);
                            this._tags[index] = null;
                        }
                    };

                    _proto.flush = function flush() {
                        this._injected = false;
                        this._rulesCount = 0;

                        if (this._isBrowser) {
                            this._tags.forEach(function(tag) {
                                return tag && tag.parentNode.removeChild(tag);
                            });

                            this._tags = [];
                        } else {
                            // simpler on server
                            this._serverSheet.cssRules = [];
                        }
                    };

                    _proto.cssRules = function cssRules() {
                        var _this2 = this;

                        if (!this._isBrowser) {
                            return this._serverSheet.cssRules;
                        }

                        return this._tags.reduce(function(rules, tag) {
                            if (tag) {
                                rules = rules.concat(
                                    Array.prototype.map.call(_this2.getSheetForTag(tag).cssRules, function(rule) {
                                        return rule.cssText === _this2._deletedRulePlaceholder ? null : rule;
                                    }),
                                );
                            } else {
                                rules.push(null);
                            }

                            return rules;
                        }, []);
                    };

                    _proto.makeStyleTag = function makeStyleTag(name, cssString, relativeToTag) {
                        if (cssString) {
                            invariant(isString(cssString), 'makeStyleTag acceps only strings as second parameter');
                        }

                        var tag = document.createElement('style');
                        if (this._nonce) tag.setAttribute('nonce', this._nonce);
                        tag.type = 'text/css';
                        tag.setAttribute('data-' + name, '');

                        if (cssString) {
                            tag.appendChild(document.createTextNode(cssString));
                        }

                        var head = document.head || document.getElementsByTagName('head')[0];

                        if (relativeToTag) {
                            head.insertBefore(tag, relativeToTag);
                        } else {
                            head.appendChild(tag);
                        }

                        return tag;
                    };

                    _createClass(StyleSheet, [
                        {
                            key: 'length',
                            get: function get() {
                                return this._rulesCount;
                            },
                        },
                    ]);

                    return StyleSheet;
                })();

            exports['default'] = StyleSheet;

            function invariant(condition, message) {
                if (!condition) {
                    throw new Error('StyleSheet: ' + message + '.');
                }
            }

            /***/
        },

        /***/ bzos: /***/ function(module, exports) {
            module.exports = require('url');

            /***/
        },

        /***/ dZ6Y: /***/ function(module, exports, __webpack_require__) {
            'use strict';

            /*
MIT License

Copyright (c) Jason Miller (https://jasonformat.com/)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

            Object.defineProperty(exports, '__esModule', {
                value: true,
            });

            function mitt() {
                const all = Object.create(null);
                return {
                    on(type, handler) {
                        (all[type] || (all[type] = [])).push(handler);
                    },

                    off(type, handler) {
                        if (all[type]) {
                            // tslint:disable-next-line:no-bitwise
                            all[type].splice(all[type].indexOf(handler) >>> 0, 1);
                        }
                    },

                    emit(type, ...evts) {
                        // eslint-disable-next-line array-callback-return
                        (all[type] || []).slice().map(handler => {
                            handler(...evts);
                        });
                    },
                };
            }

            exports.default = mitt;

            /***/
        },

        /***/ dmkc: /***/ function(module, exports, __webpack_require__) {
            'use strict';
            /* WEBPACK VAR INJECTION */ (function(__dirname) {
                exports.__esModule = true;
                exports.SSG_GET_INITIAL_PROPS_CONFLICT = exports.PUBLIC_DIR_MIDDLEWARE_CONFLICT = exports.DOT_NEXT_ALIAS = exports.PAGES_DIR_ALIAS = exports.API_ROUTE = exports.NEXT_PROJECT_ROOT_DIST_SERVER = exports.NEXT_PROJECT_ROOT_DIST_CLIENT = exports.NEXT_PROJECT_ROOT_NODE_MODULES = exports.NEXT_PROJECT_ROOT_DIST = exports.NEXT_PROJECT_ROOT = void 0;
                var _path = __webpack_require__('oyvS');
                const NEXT_PROJECT_ROOT = (0, _path.join)(__dirname, '..', '..');
                exports.NEXT_PROJECT_ROOT = NEXT_PROJECT_ROOT;
                const NEXT_PROJECT_ROOT_DIST = (0, _path.join)(NEXT_PROJECT_ROOT, 'dist');
                exports.NEXT_PROJECT_ROOT_DIST = NEXT_PROJECT_ROOT_DIST;
                const NEXT_PROJECT_ROOT_NODE_MODULES = (0, _path.join)(NEXT_PROJECT_ROOT, 'node_modules');
                exports.NEXT_PROJECT_ROOT_NODE_MODULES = NEXT_PROJECT_ROOT_NODE_MODULES;
                const NEXT_PROJECT_ROOT_DIST_CLIENT = (0, _path.join)(NEXT_PROJECT_ROOT_DIST, 'client');
                exports.NEXT_PROJECT_ROOT_DIST_CLIENT = NEXT_PROJECT_ROOT_DIST_CLIENT;
                const NEXT_PROJECT_ROOT_DIST_SERVER = (0, _path.join)(NEXT_PROJECT_ROOT_DIST, 'server'); // Regex for API routes
                exports.NEXT_PROJECT_ROOT_DIST_SERVER = NEXT_PROJECT_ROOT_DIST_SERVER;
                const API_ROUTE = /^\/api(?:\/|$)/; // Because on Windows absolute paths in the generated code can break because of numbers, eg 1 in the path,
                // we have to use a private alias
                exports.API_ROUTE = API_ROUTE;
                const PAGES_DIR_ALIAS = 'private-next-pages';
                exports.PAGES_DIR_ALIAS = PAGES_DIR_ALIAS;
                const DOT_NEXT_ALIAS = 'private-dot-next';
                exports.DOT_NEXT_ALIAS = DOT_NEXT_ALIAS;
                const PUBLIC_DIR_MIDDLEWARE_CONFLICT = `You can not have a '_next' folder inside of your public folder. This conflicts with the internal '/_next' route. https://err.sh/zeit/next.js/public-next-folder-conflict`;
                exports.PUBLIC_DIR_MIDDLEWARE_CONFLICT = PUBLIC_DIR_MIDDLEWARE_CONFLICT;
                const SSG_GET_INITIAL_PROPS_CONFLICT = `You can not use getInitialProps with unstable_getStaticProps. To use SSG, please remove your getInitialProps`;
                exports.SSG_GET_INITIAL_PROPS_CONFLICT = SSG_GET_INITIAL_PROPS_CONFLICT;
                /* WEBPACK VAR INJECTION */
            }.call(this, '/'));

            /***/
        },

        /***/ 'f/k9': /***/ function(module, exports, __webpack_require__) {
            'use strict';
            /** @license React v1.1.1
             * use-subscription.production.min.js
             *
             * Copyright (c) Facebook, Inc. and its affiliates.
             *
             * This source code is licensed under the MIT license found in the
             * LICENSE file in the root directory of this source tree.
             */

            Object.defineProperty(exports, '__esModule', { value: !0 });
            var h = __webpack_require__('q1tI'),
                l = Object.getOwnPropertySymbols,
                m = Object.prototype.hasOwnProperty,
                n = Object.prototype.propertyIsEnumerable,
                p = (function() {
                    try {
                        if (!Object.assign) return !1;
                        var a = new String('abc');
                        a[5] = 'de';
                        if ('5' === Object.getOwnPropertyNames(a)[0]) return !1;
                        var c = {};
                        for (a = 0; 10 > a; a++) c['_' + String.fromCharCode(a)] = a;
                        if (
                            '0123456789' !==
                            Object.getOwnPropertyNames(c)
                                .map(function(b) {
                                    return c[b];
                                })
                                .join('')
                        )
                            return !1;
                        var d = {};
                        'abcdefghijklmnopqrst'.split('').forEach(function(b) {
                            d[b] = b;
                        });
                        return 'abcdefghijklmnopqrst' !== Object.keys(Object.assign({}, d)).join('') ? !1 : !0;
                    } catch (b) {
                        return !1;
                    }
                })()
                    ? Object.assign
                    : function(a, c) {
                          if (null === a || void 0 === a)
                              throw new TypeError('Object.assign cannot be called with null or undefined');
                          var d = Object(a);
                          for (var b, f = 1; f < arguments.length; f++) {
                              var g = Object(arguments[f]);
                              for (var k in g) m.call(g, k) && (d[k] = g[k]);
                              if (l) {
                                  b = l(g);
                                  for (var e = 0; e < b.length; e++) n.call(g, b[e]) && (d[b[e]] = g[b[e]]);
                              }
                          }
                          return d;
                      };
            exports.useSubscription = function(a) {
                var c = a.getCurrentValue,
                    d = a.subscribe,
                    b = h.useState(function() {
                        return { getCurrentValue: c, subscribe: d, value: c() };
                    });
                a = b[0];
                var f = b[1];
                b = a.value;
                if (a.getCurrentValue !== c || a.subscribe !== d)
                    (b = c()), f({ getCurrentValue: c, subscribe: d, value: b });
                h.useDebugValue(b);
                h.useEffect(
                    function() {
                        function b() {
                            if (!a) {
                                var b = c();
                                f(function(a) {
                                    return a.getCurrentValue !== c || a.subscribe !== d || a.value === b
                                        ? a
                                        : p({}, a, { value: b });
                                });
                            }
                        }
                        var a = !1,
                            e = d(b);
                        b();
                        return function() {
                            a = !0;
                            e();
                        };
                    },
                    [c, d],
                );
                return b;
            };

            /***/
        },

        /***/ 'g/15': /***/ function(module, exports, __webpack_require__) {
            'use strict';

            Object.defineProperty(exports, '__esModule', {
                value: true,
            });

            const url_1 = __webpack_require__('bzos');
            /**
             * Utils
             */

            function execOnce(fn) {
                let used = false;
                let result = null;
                return (...args) => {
                    if (!used) {
                        used = true;
                        result = fn.apply(this, args);
                    }

                    return result;
                };
            }

            exports.execOnce = execOnce;

            function getLocationOrigin() {
                const { protocol, hostname, port } = window.location;
                return `${protocol}//${hostname}${port ? ':' + port : ''}`;
            }

            exports.getLocationOrigin = getLocationOrigin;

            function getURL() {
                const { href } = window.location;
                const origin = getLocationOrigin();
                return href.substring(origin.length);
            }

            exports.getURL = getURL;

            function getDisplayName(Component) {
                return typeof Component === 'string' ? Component : Component.displayName || Component.name || 'Unknown';
            }

            exports.getDisplayName = getDisplayName;

            function isResSent(res) {
                return res.finished || res.headersSent;
            }

            exports.isResSent = isResSent;

            async function loadGetInitialProps(App, ctx) {
                var _a;

                if (false) {
                } // when called from _app `ctx` is nested in `ctx`

                const res = ctx.res || (ctx.ctx && ctx.ctx.res);

                if (!App.getInitialProps) {
                    if (ctx.ctx && ctx.Component) {
                        // @ts-ignore pageProps default
                        return {
                            pageProps: await loadGetInitialProps(ctx.Component, ctx.ctx),
                        };
                    }

                    return {};
                }

                const props = await App.getInitialProps(ctx);

                if (res && isResSent(res)) {
                    return props;
                }

                if (!props) {
                    const message = `"${getDisplayName(
                        App,
                    )}.getInitialProps()" should resolve to an object. But found "${props}" instead.`;
                    throw new Error(message);
                }

                if (false) {
                }

                return props;
            }

            exports.loadGetInitialProps = loadGetInitialProps;
            exports.urlObjectKeys = [
                'auth',
                'hash',
                'host',
                'hostname',
                'href',
                'path',
                'pathname',
                'port',
                'protocol',
                'query',
                'search',
                'slashes',
            ];

            function formatWithValidation(url, options) {
                if (false) {
                }

                return url_1.format(url, options);
            }

            exports.formatWithValidation = formatWithValidation;
            exports.SP = typeof performance !== 'undefined';
            exports.ST =
                exports.SP && typeof performance.mark === 'function' && typeof performance.measure === 'function';

            /***/
        },

        /***/ hUgY: /***/ function(module, __webpack_exports__, __webpack_require__) {
            'use strict';
            /* harmony import */ var next_app__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__('8Bbg');
            /* harmony import */ var next_app__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/ __webpack_require__.n(
                next_app__WEBPACK_IMPORTED_MODULE_0__,
            );
            /* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__('q1tI');
            /* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/ __webpack_require__.n(
                react__WEBPACK_IMPORTED_MODULE_1__,
            );
            var __jsx = react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement;

            function ownKeys(object, enumerableOnly) {
                var keys = Object.keys(object);
                if (Object.getOwnPropertySymbols) {
                    var symbols = Object.getOwnPropertySymbols(object);
                    if (enumerableOnly)
                        symbols = symbols.filter(function(sym) {
                            return Object.getOwnPropertyDescriptor(object, sym).enumerable;
                        });
                    keys.push.apply(keys, symbols);
                }
                return keys;
            }

            function _objectSpread(target) {
                for (var i = 1; i < arguments.length; i++) {
                    var source = arguments[i] != null ? arguments[i] : {};
                    if (i % 2) {
                        ownKeys(Object(source), true).forEach(function(key) {
                            _defineProperty(target, key, source[key]);
                        });
                    } else if (Object.getOwnPropertyDescriptors) {
                        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
                    } else {
                        ownKeys(Object(source)).forEach(function(key) {
                            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
                        });
                    }
                }
                return target;
            }

            function _defineProperty(obj, key, value) {
                if (key in obj) {
                    Object.defineProperty(obj, key, {
                        value: value,
                        enumerable: true,
                        configurable: true,
                        writable: true,
                    });
                } else {
                    obj[key] = value;
                }
                return obj;
            }

            const MyApp = (
                { Component, pageProps }, // Prop spreading is the recommended way to implement this, from Next.js docs
            ) =>
                // eslint-disable-next-line react/jsx-props-no-spreading
                __jsx(Component, pageProps); // Force every page to server side render so that we get a chance to set security-related cookies
            // This will have a slight performance impact, but it should be negligable
            // A better approach long term would be to submit a contribution to the Next.js serverless component
            // to provide the option to set these headers as properties on the statically rendered pages as
            // they are uploaded to S3
            //
            // (implementation below from https://nextjs.org/docs/advanced-features/custom-app and
            // https://nextjs.org/docs/basic-features/typescript)
            //

            MyApp.getInitialProps = async appContext => {
                // calls page's `getInitialProps` and fills `appProps.pageProps`
                let appProps;

                try {
                    appProps = await next_app__WEBPACK_IMPORTED_MODULE_0___default.a.getInitialProps(appContext);
                } catch (error) {
                    console.error(`Unhandled exception: ${error.stack}`);
                    throw error;
                } // Prop spreading is the recommended way to implement this, from Next.js docs
                // eslint-disable-next-line react/jsx-props-no-spreading

                return _objectSpread({}, appProps);
            };

            /* harmony default export */ __webpack_exports__['a'] = MyApp;

            /***/
        },

        /***/ jwwS: /***/ function(module, exports, __webpack_require__) {
            'use strict';

            var __importStar =
                (this && this.__importStar) ||
                function(mod) {
                    if (mod && mod.__esModule) return mod;
                    var result = {};
                    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
                    result['default'] = mod;
                    return result;
                };

            Object.defineProperty(exports, '__esModule', {
                value: true,
            });

            const React = __importStar(__webpack_require__('q1tI')); // @ts-ignore for some reason the React types don't like this, but it's correct.

            exports.LoadableContext = React.createContext(null);

            /***/
        },

        /***/ jxKE: /***/ function(module, __webpack_exports__, __webpack_require__) {
            'use strict';
            /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, 'h', function() {
                return OPERATOR_COOKIE;
            });
            /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, 'c', function() {
                return FARETYPE_COOKIE;
            });
            /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, 'i', function() {
                return SERVICE_COOKIE;
            });
            /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, 'g', function() {
                return JOURNEY_COOKIE;
            });
            /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, 'd', function() {
                return FARE_STAGES_COOKIE;
            });
            /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, 'k', function() {
                return STAGE_NAME_VALIDATION_COOKIE;
            });
            /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, 'e', function() {
                return FEEDBACK_LINK;
            });
            /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, 'f', function() {
                return GOVUK_LINK;
            });
            /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, 'j', function() {
                return STAGE_NAMES_COOKIE;
            });
            /* unused harmony export PRICEENTRY_COOKIE */
            /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, 'b', function() {
                return CSV_ZONE_UPLOAD_COOKIE;
            });
            /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, 'a', function() {
                return ALLOWED_CSV_FILE_TYPES;
            });
            const OPERATOR_COOKIE = 'fdbt-operator';
            const FARETYPE_COOKIE = 'fdbt-faretype';
            const SERVICE_COOKIE = 'fdbt-service';
            const JOURNEY_COOKIE = 'fdbt-journey';
            const FARE_STAGES_COOKIE = 'fdbt-fare-stages';
            const STAGE_NAME_VALIDATION_COOKIE = 'fdbt-stage-names-validation';
            const FEEDBACK_LINK = 'mailto:fdbt@transportforthenorth.com';
            const GOVUK_LINK = 'https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/';
            const STAGE_NAMES_COOKIE = 'fdbt-stage-names';
            const PRICEENTRY_COOKIE = 'fdbt-price-entry';
            const CSV_ZONE_UPLOAD_COOKIE = 'fdbt-csv-zone-upload';
            const ALLOWED_CSV_FILE_TYPES = [
                'text/plain',
                'text/x-csv',
                'application/vnd.ms-excel',
                'application/csv',
                'application/x-csv',
                'text/csv',
                'text/comma-separated-values',
                'text/x-comma-separated-values',
                'text/tab-separated-values',
            ];

            /***/
        },

        /***/ lwAK: /***/ function(module, exports, __webpack_require__) {
            'use strict';

            var __importStar =
                (this && this.__importStar) ||
                function(mod) {
                    if (mod && mod.__esModule) return mod;
                    var result = {};
                    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
                    result['default'] = mod;
                    return result;
                };

            Object.defineProperty(exports, '__esModule', {
                value: true,
            });

            const React = __importStar(__webpack_require__('q1tI'));

            exports.AmpStateContext = React.createContext({});

            /***/
        },

        /***/ 'mT+M': /***/ function(module, __webpack_exports__, __webpack_require__) {
            'use strict';
            /* harmony import */ var next_document__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__('8cZr');
            /* harmony import */ var next_document__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/ __webpack_require__.n(
                next_document__WEBPACK_IMPORTED_MODULE_0__,
            );
            /* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__('q1tI');
            /* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/ __webpack_require__.n(
                react__WEBPACK_IMPORTED_MODULE_1__,
            );
            /* harmony import */ var _design_Pages_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__('svJj');
            /* harmony import */ var _design_Pages_scss__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/ __webpack_require__.n(
                _design_Pages_scss__WEBPACK_IMPORTED_MODULE_2__,
            );
            var __jsx = react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement;

            function ownKeys(object, enumerableOnly) {
                var keys = Object.keys(object);
                if (Object.getOwnPropertySymbols) {
                    var symbols = Object.getOwnPropertySymbols(object);
                    if (enumerableOnly)
                        symbols = symbols.filter(function(sym) {
                            return Object.getOwnPropertyDescriptor(object, sym).enumerable;
                        });
                    keys.push.apply(keys, symbols);
                }
                return keys;
            }

            function _objectSpread(target) {
                for (var i = 1; i < arguments.length; i++) {
                    var source = arguments[i] != null ? arguments[i] : {};
                    if (i % 2) {
                        ownKeys(Object(source), true).forEach(function(key) {
                            _defineProperty(target, key, source[key]);
                        });
                    } else if (Object.getOwnPropertyDescriptors) {
                        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
                    } else {
                        ownKeys(Object(source)).forEach(function(key) {
                            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
                        });
                    }
                }
                return target;
            }

            function _defineProperty(obj, key, value) {
                if (key in obj) {
                    Object.defineProperty(obj, key, {
                        value: value,
                        enumerable: true,
                        configurable: true,
                        writable: true,
                    });
                } else {
                    obj[key] = value;
                }
                return obj;
            }

            class MyDocument extends next_document__WEBPACK_IMPORTED_MODULE_0___default.a {
                static async getInitialProps(ctx) {
                    var _ctx$res, _ctx$res2;

                    const initialProps = await next_document__WEBPACK_IMPORTED_MODULE_0___default.a.getInitialProps(
                        ctx,
                    );
                    (_ctx$res = ctx.res) === null || _ctx$res === void 0
                        ? void 0
                        : _ctx$res.setHeader('X-Content-Type-Options', 'nosniff');
                    (_ctx$res2 = ctx.res) === null || _ctx$res2 === void 0
                        ? void 0
                        : _ctx$res2.setHeader('X-Frame-Options', 'DENY');
                    return _objectSpread({}, initialProps);
                }

                render() {
                    return __jsx(
                        next_document__WEBPACK_IMPORTED_MODULE_0__['Html'],
                        {
                            lang: 'en',
                            className: 'govuk-template app-html-class flexbox no-flexboxtweener',
                        },
                        __jsx(next_document__WEBPACK_IMPORTED_MODULE_0__['Head'], null),
                        __jsx(
                            'body',
                            {
                                className: 'govuk-template__body app-body-class',
                            },
                            __jsx(next_document__WEBPACK_IMPORTED_MODULE_0__['Main'], null),
                            __jsx(next_document__WEBPACK_IMPORTED_MODULE_0__['NextScript'], null),
                        ),
                    );
                }
            }

            /* harmony default export */ __webpack_exports__['a'] = MyDocument;

            /***/
        },

        /***/ msIP: /***/ function(module, exports) {
            module.exports = require('stream');

            /***/
        },

        /***/ 'mw/K': /***/ function(module, exports) {
            module.exports = require('fs');

            /***/
        },

        /***/ nRxi: /***/ function(module, exports, __webpack_require__) {
            'use strict';

            var __importStar =
                (this && this.__importStar) ||
                function(mod) {
                    if (mod && mod.__esModule) return mod;
                    var result = {};
                    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
                    result['default'] = mod;
                    return result;
                };

            Object.defineProperty(exports, '__esModule', {
                value: true,
            });

            const React = __importStar(__webpack_require__('q1tI'));

            exports.DocumentContext = React.createContext(null);

            /***/
        },

        /***/ nWF0: /***/ function(module, exports, __webpack_require__) {
            'use strict';

            exports.__esModule = true;
            exports['default'] = flushToReact;
            exports.flushToHTML = flushToHTML;

            var _react = _interopRequireDefault(__webpack_require__('q1tI'));

            var _style = __webpack_require__('3niX');

            function _interopRequireDefault(obj) {
                return obj && obj.__esModule ? obj : { default: obj };
            }

            function flushToReact(options) {
                if (options === void 0) {
                    options = {};
                }

                return (0, _style.flush)().map(function(args) {
                    var id = args[0];
                    var css = args[1];
                    return _react['default'].createElement('style', {
                        id: '__' + id,
                        // Avoid warnings upon render with a key
                        key: '__' + id,
                        nonce: options.nonce ? options.nonce : undefined,
                        dangerouslySetInnerHTML: {
                            __html: css,
                        },
                    });
                });
            }

            function flushToHTML(options) {
                if (options === void 0) {
                    options = {};
                }

                return (0, _style.flush)().reduce(function(html, args) {
                    var id = args[0];
                    var css = args[1];
                    html +=
                        '<style id="__' +
                        id +
                        '"' +
                        (options.nonce ? ' nonce="' + options.nonce + '"' : '') +
                        '>' +
                        css +
                        '</style>';
                    return html;
                }, '');
            }

            /***/
        },

        /***/ oyvS: /***/ function(module, exports) {
            module.exports = require('path');

            /***/
        },

        /***/ pV7Z: /***/ function(module, exports, __webpack_require__) {
            'use strict';

            if (true) {
                module.exports = __webpack_require__('FDah');
            } else {
            }

            /***/
        },

        /***/ pjpT: /***/ function(module, exports) {
            /***/
        },

        /***/ q1tI: /***/ function(module, exports, __webpack_require__) {
            'use strict';

            if (true) {
                module.exports = __webpack_require__('viRO');
            } else {
            }

            /***/
        },

        /***/ qOIg: /***/ function(module, exports, __webpack_require__) {
            'use strict';

            var __importStar =
                (this && this.__importStar) ||
                function(mod) {
                    if (mod && mod.__esModule) return mod;
                    var result = {};
                    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
                    result['default'] = mod;
                    return result;
                };

            Object.defineProperty(exports, '__esModule', {
                value: true,
            });

            const React = __importStar(__webpack_require__('q1tI'));

            exports.RouterContext = React.createContext(null);

            /***/
        },

        /***/ svJj: /***/ function(module, exports) {
            /***/
        },

        /***/ teXF: /***/ function(module, exports, __webpack_require__) {
            'use strict';

            Object.defineProperty(exports, '__esModule', { value: true });
            const normalize_page_path_1 = __webpack_require__('w0zM');
            function getPageFiles(buildManifest, page) {
                const normalizedPage = normalize_page_path_1.normalizePagePath(page);
                let files = buildManifest.pages[normalizedPage];
                if (!files) {
                    files = buildManifest.pages[normalizedPage.replace(/\/index$/, '') || '/'];
                }
                if (!files) {
                    // tslint:disable-next-line
                    console.warn(`Could not find files for ${normalizedPage} in .next/build-manifest.json`);
                    return [];
                }
                return files;
            }
            exports.getPageFiles = getPageFiles;

            /***/
        },

        /***/ uDRR: /***/ function(module, exports, __webpack_require__) {
            'use strict';

            var __importStar =
                (this && this.__importStar) ||
                function(mod) {
                    if (mod && mod.__esModule) return mod;
                    var result = {};
                    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
                    result['default'] = mod;
                    return result;
                };
            Object.defineProperty(exports, '__esModule', { value: true });
            const pathToRegexp = __importStar(__webpack_require__('D9K+'));
            exports.pathToRegexp = pathToRegexp;
            exports.default = (customRoute = false) => {
                return path => {
                    const keys = [];
                    const matcherOptions = Object.assign(
                        Object.assign({ sensitive: false, delimiter: '/' }, customRoute ? { strict: true } : undefined),
                        { decode: decodeParam },
                    );
                    const matcherRegex = pathToRegexp.pathToRegexp(path, keys, matcherOptions);
                    const matcher = pathToRegexp.regexpToFunction(matcherRegex, keys, matcherOptions);
                    return (pathname, params) => {
                        const res = pathname == null ? false : matcher(pathname);
                        if (!res) {
                            return false;
                        }
                        if (customRoute) {
                            const newParams = {};
                            for (const key of keys) {
                                // unnamed matches should always be a number while named
                                // should be a string
                                if (typeof key.name === 'number') {
                                    newParams[key.name + 1 + ''] = res.params[key.name + ''];
                                    delete res.params[key.name + ''];
                                }
                            }
                            res.params = Object.assign(Object.assign({}, res.params), newParams);
                        }
                        return Object.assign(Object.assign({}, params), res.params);
                    };
                };
            };
            function decodeParam(param) {
                try {
                    return decodeURIComponent(param);
                } catch (_) {
                    const err = new Error('failed to decode param');
                    // @ts-ignore DECODE_FAILED is handled
                    err.code = 'DECODE_FAILED';
                    throw err;
                }
            }

            /***/
        },

        /***/ viRO: /***/ function(module, exports, __webpack_require__) {
            'use strict';
            /** @license React v16.12.0
             * react.production.min.js
             *
             * Copyright (c) Facebook, Inc. and its affiliates.
             *
             * This source code is licensed under the MIT license found in the
             * LICENSE file in the root directory of this source tree.
             */

            var h = __webpack_require__('MgzW'),
                n = 'function' === typeof Symbol && Symbol.for,
                p = n ? Symbol.for('react.element') : 60103,
                q = n ? Symbol.for('react.portal') : 60106,
                r = n ? Symbol.for('react.fragment') : 60107,
                t = n ? Symbol.for('react.strict_mode') : 60108,
                u = n ? Symbol.for('react.profiler') : 60114,
                v = n ? Symbol.for('react.provider') : 60109,
                w = n ? Symbol.for('react.context') : 60110,
                x = n ? Symbol.for('react.forward_ref') : 60112,
                y = n ? Symbol.for('react.suspense') : 60113;
            n && Symbol.for('react.suspense_list');
            var z = n ? Symbol.for('react.memo') : 60115,
                aa = n ? Symbol.for('react.lazy') : 60116;
            n && Symbol.for('react.fundamental');
            n && Symbol.for('react.responder');
            n && Symbol.for('react.scope');
            var A = 'function' === typeof Symbol && Symbol.iterator;
            function B(a) {
                for (
                    var b = 'https://reactjs.org/docs/error-decoder.html?invariant=' + a, c = 1;
                    c < arguments.length;
                    c++
                )
                    b += '&args[]=' + encodeURIComponent(arguments[c]);
                return (
                    'Minified React error #' +
                    a +
                    '; visit ' +
                    b +
                    ' for the full message or use the non-minified dev environment for full errors and additional helpful warnings.'
                );
            }
            var C = {
                    isMounted: function() {
                        return !1;
                    },
                    enqueueForceUpdate: function() {},
                    enqueueReplaceState: function() {},
                    enqueueSetState: function() {},
                },
                D = {};
            function E(a, b, c) {
                this.props = a;
                this.context = b;
                this.refs = D;
                this.updater = c || C;
            }
            E.prototype.isReactComponent = {};
            E.prototype.setState = function(a, b) {
                if ('object' !== typeof a && 'function' !== typeof a && null != a) throw Error(B(85));
                this.updater.enqueueSetState(this, a, b, 'setState');
            };
            E.prototype.forceUpdate = function(a) {
                this.updater.enqueueForceUpdate(this, a, 'forceUpdate');
            };
            function F() {}
            F.prototype = E.prototype;
            function G(a, b, c) {
                this.props = a;
                this.context = b;
                this.refs = D;
                this.updater = c || C;
            }
            var H = (G.prototype = new F());
            H.constructor = G;
            h(H, E.prototype);
            H.isPureReactComponent = !0;
            var I = { current: null },
                J = { current: null },
                K = Object.prototype.hasOwnProperty,
                L = { key: !0, ref: !0, __self: !0, __source: !0 };
            function M(a, b, c) {
                var e,
                    d = {},
                    g = null,
                    l = null;
                if (null != b)
                    for (e in (void 0 !== b.ref && (l = b.ref), void 0 !== b.key && (g = '' + b.key), b))
                        K.call(b, e) && !L.hasOwnProperty(e) && (d[e] = b[e]);
                var f = arguments.length - 2;
                if (1 === f) d.children = c;
                else if (1 < f) {
                    for (var k = Array(f), m = 0; m < f; m++) k[m] = arguments[m + 2];
                    d.children = k;
                }
                if (a && a.defaultProps) for (e in ((f = a.defaultProps), f)) void 0 === d[e] && (d[e] = f[e]);
                return { $$typeof: p, type: a, key: g, ref: l, props: d, _owner: J.current };
            }
            function ba(a, b) {
                return { $$typeof: p, type: a.type, key: b, ref: a.ref, props: a.props, _owner: a._owner };
            }
            function N(a) {
                return 'object' === typeof a && null !== a && a.$$typeof === p;
            }
            function escape(a) {
                var b = { '=': '=0', ':': '=2' };
                return (
                    '$' +
                    ('' + a).replace(/[=:]/g, function(a) {
                        return b[a];
                    })
                );
            }
            var O = /\/+/g,
                P = [];
            function Q(a, b, c, e) {
                if (P.length) {
                    var d = P.pop();
                    d.result = a;
                    d.keyPrefix = b;
                    d.func = c;
                    d.context = e;
                    d.count = 0;
                    return d;
                }
                return { result: a, keyPrefix: b, func: c, context: e, count: 0 };
            }
            function R(a) {
                a.result = null;
                a.keyPrefix = null;
                a.func = null;
                a.context = null;
                a.count = 0;
                10 > P.length && P.push(a);
            }
            function S(a, b, c, e) {
                var d = typeof a;
                if ('undefined' === d || 'boolean' === d) a = null;
                var g = !1;
                if (null === a) g = !0;
                else
                    switch (d) {
                        case 'string':
                        case 'number':
                            g = !0;
                            break;
                        case 'object':
                            switch (a.$$typeof) {
                                case p:
                                case q:
                                    g = !0;
                            }
                    }
                if (g) return c(e, a, '' === b ? '.' + T(a, 0) : b), 1;
                g = 0;
                b = '' === b ? '.' : b + ':';
                if (Array.isArray(a))
                    for (var l = 0; l < a.length; l++) {
                        d = a[l];
                        var f = b + T(d, l);
                        g += S(d, f, c, e);
                    }
                else if (
                    (null === a || 'object' !== typeof a
                        ? (f = null)
                        : ((f = (A && a[A]) || a['@@iterator']), (f = 'function' === typeof f ? f : null)),
                    'function' === typeof f)
                )
                    for (a = f.call(a), l = 0; !(d = a.next()).done; )
                        (d = d.value), (f = b + T(d, l++)), (g += S(d, f, c, e));
                else if ('object' === d)
                    throw ((c = '' + a),
                    Error(
                        B(31, '[object Object]' === c ? 'object with keys {' + Object.keys(a).join(', ') + '}' : c, ''),
                    ));
                return g;
            }
            function U(a, b, c) {
                return null == a ? 0 : S(a, '', b, c);
            }
            function T(a, b) {
                return 'object' === typeof a && null !== a && null != a.key ? escape(a.key) : b.toString(36);
            }
            function ca(a, b) {
                a.func.call(a.context, b, a.count++);
            }
            function da(a, b, c) {
                var e = a.result,
                    d = a.keyPrefix;
                a = a.func.call(a.context, b, a.count++);
                Array.isArray(a)
                    ? V(a, e, c, function(a) {
                          return a;
                      })
                    : null != a &&
                      (N(a) &&
                          (a = ba(
                              a,
                              d + (!a.key || (b && b.key === a.key) ? '' : ('' + a.key).replace(O, '$&/') + '/') + c,
                          )),
                      e.push(a));
            }
            function V(a, b, c, e, d) {
                var g = '';
                null != c && (g = ('' + c).replace(O, '$&/') + '/');
                b = Q(b, g, e, d);
                U(a, da, b);
                R(b);
            }
            function W() {
                var a = I.current;
                if (null === a) throw Error(B(321));
                return a;
            }
            var X = {
                    Children: {
                        map: function(a, b, c) {
                            if (null == a) return a;
                            var e = [];
                            V(a, e, null, b, c);
                            return e;
                        },
                        forEach: function(a, b, c) {
                            if (null == a) return a;
                            b = Q(null, null, b, c);
                            U(a, ca, b);
                            R(b);
                        },
                        count: function(a) {
                            return U(
                                a,
                                function() {
                                    return null;
                                },
                                null,
                            );
                        },
                        toArray: function(a) {
                            var b = [];
                            V(a, b, null, function(a) {
                                return a;
                            });
                            return b;
                        },
                        only: function(a) {
                            if (!N(a)) throw Error(B(143));
                            return a;
                        },
                    },
                    createRef: function() {
                        return { current: null };
                    },
                    Component: E,
                    PureComponent: G,
                    createContext: function(a, b) {
                        void 0 === b && (b = null);
                        a = {
                            $$typeof: w,
                            _calculateChangedBits: b,
                            _currentValue: a,
                            _currentValue2: a,
                            _threadCount: 0,
                            Provider: null,
                            Consumer: null,
                        };
                        a.Provider = { $$typeof: v, _context: a };
                        return (a.Consumer = a);
                    },
                    forwardRef: function(a) {
                        return { $$typeof: x, render: a };
                    },
                    lazy: function(a) {
                        return { $$typeof: aa, _ctor: a, _status: -1, _result: null };
                    },
                    memo: function(a, b) {
                        return { $$typeof: z, type: a, compare: void 0 === b ? null : b };
                    },
                    useCallback: function(a, b) {
                        return W().useCallback(a, b);
                    },
                    useContext: function(a, b) {
                        return W().useContext(a, b);
                    },
                    useEffect: function(a, b) {
                        return W().useEffect(a, b);
                    },
                    useImperativeHandle: function(a, b, c) {
                        return W().useImperativeHandle(a, b, c);
                    },
                    useDebugValue: function() {},
                    useLayoutEffect: function(a, b) {
                        return W().useLayoutEffect(a, b);
                    },
                    useMemo: function(a, b) {
                        return W().useMemo(a, b);
                    },
                    useReducer: function(a, b, c) {
                        return W().useReducer(a, b, c);
                    },
                    useRef: function(a) {
                        return W().useRef(a);
                    },
                    useState: function(a) {
                        return W().useState(a);
                    },
                    Fragment: r,
                    Profiler: u,
                    StrictMode: t,
                    Suspense: y,
                    createElement: M,
                    cloneElement: function(a, b, c) {
                        if (null === a || void 0 === a) throw Error(B(267, a));
                        var e = h({}, a.props),
                            d = a.key,
                            g = a.ref,
                            l = a._owner;
                        if (null != b) {
                            void 0 !== b.ref && ((g = b.ref), (l = J.current));
                            void 0 !== b.key && (d = '' + b.key);
                            if (a.type && a.type.defaultProps) var f = a.type.defaultProps;
                            for (k in b)
                                K.call(b, k) &&
                                    !L.hasOwnProperty(k) &&
                                    (e[k] = void 0 === b[k] && void 0 !== f ? f[k] : b[k]);
                        }
                        var k = arguments.length - 2;
                        if (1 === k) e.children = c;
                        else if (1 < k) {
                            f = Array(k);
                            for (var m = 0; m < k; m++) f[m] = arguments[m + 2];
                            e.children = f;
                        }
                        return { $$typeof: p, type: a.type, key: d, ref: g, props: e, _owner: l };
                    },
                    createFactory: function(a) {
                        var b = M.bind(null, a);
                        b.type = a;
                        return b;
                    },
                    isValidElement: N,
                    version: '16.12.0',
                    __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: {
                        ReactCurrentDispatcher: I,
                        ReactCurrentBatchConfig: { suspense: null },
                        ReactCurrentOwner: J,
                        IsSomeRendererActing: { current: !1 },
                        assign: h,
                    },
                },
                Y = { default: X },
                Z = (Y && X) || Y;
            module.exports = Z.default || Z;

            /***/
        },

        /***/ w0zM: /***/ function(module, exports, __webpack_require__) {
            'use strict';

            Object.defineProperty(exports, '__esModule', { value: true });
            const path_1 = __webpack_require__('oyvS');
            function normalizePagePath(page) {
                // If the page is `/` we need to append `/index`, otherwise the returned directory root will be bundles instead of pages
                if (page === '/') {
                    page = '/index';
                }
                // Resolve on anything that doesn't start with `/`
                if (page[0] !== '/') {
                    page = `/${page}`;
                }
                // Throw when using ../ etc in the pathname
                const resolvedPage = path_1.posix.normalize(page);
                if (page !== resolvedPage) {
                    throw new Error('Requested and resolved page mismatch');
                }
                return page;
            }
            exports.normalizePagePath = normalizePagePath;

            /***/
        },

        /***/ w7wo: /***/ function(module, exports, __webpack_require__) {
            'use strict';

            Object.defineProperty(exports, '__esModule', {
                value: true,
            });
            exports.PHASE_EXPORT = 'phase-export';
            exports.PHASE_PRODUCTION_BUILD = 'phase-production-build';
            exports.PHASE_PRODUCTION_SERVER = 'phase-production-server';
            exports.PHASE_DEVELOPMENT_SERVER = 'phase-development-server';
            exports.PAGES_MANIFEST = 'pages-manifest.json';
            exports.BUILD_MANIFEST = 'build-manifest.json';
            exports.EXPORT_MARKER = 'export-marker.json';
            exports.EXPORT_DETAIL = 'export-detail.json';
            exports.PRERENDER_MANIFEST = 'prerender-manifest.json';
            exports.ROUTES_MANIFEST = 'routes-manifest.json';
            exports.REACT_LOADABLE_MANIFEST = 'react-loadable-manifest.json';
            exports.SERVER_DIRECTORY = 'server';
            exports.SERVERLESS_DIRECTORY = 'serverless';
            exports.CONFIG_FILE = 'next.config.js';
            exports.BUILD_ID_FILE = 'BUILD_ID';
            exports.BLOCKED_PAGES = ['/_document', '/_app'];
            exports.CLIENT_PUBLIC_FILES_PATH = 'public';
            exports.CLIENT_STATIC_FILES_PATH = 'static';
            exports.CLIENT_STATIC_FILES_RUNTIME = 'runtime';
            exports.AMP_RENDER_TARGET = '__NEXT_AMP_RENDER_TARGET__';
            exports.CLIENT_STATIC_FILES_RUNTIME_PATH = `${exports.CLIENT_STATIC_FILES_PATH}/${exports.CLIENT_STATIC_FILES_RUNTIME}`; // static/runtime/main.js

            exports.CLIENT_STATIC_FILES_RUNTIME_MAIN = `${exports.CLIENT_STATIC_FILES_RUNTIME_PATH}/main.js`; // static/runtime/amp.js

            exports.CLIENT_STATIC_FILES_RUNTIME_AMP = `${exports.CLIENT_STATIC_FILES_RUNTIME_PATH}/amp.js`; // static/runtime/webpack.js

            exports.CLIENT_STATIC_FILES_RUNTIME_WEBPACK = `${exports.CLIENT_STATIC_FILES_RUNTIME_PATH}/webpack.js`; // static/runtime/polyfills.js

            exports.CLIENT_STATIC_FILES_RUNTIME_POLYFILLS = `${exports.CLIENT_STATIC_FILES_RUNTIME_PATH}/polyfills.js`; // matches static/<buildid>/pages/<page>.js

            exports.IS_BUNDLED_PAGE_REGEX = /^static[/\\][^/\\]+[/\\]pages.*\.js$/; // matches static/<buildid>/pages/:page*.js

            exports.ROUTE_NAME_REGEX = /^static[/\\][^/\\]+[/\\]pages[/\\](.*)\.js$/;
            exports.SERVERLESS_ROUTE_NAME_REGEX = /^pages[/\\](.*)\.js$/;
            exports.TEMPORARY_REDIRECT_STATUS = 307;
            exports.PERMANENT_REDIRECT_STATUS = 308;

            /***/
        },

        /******/
    },
);
