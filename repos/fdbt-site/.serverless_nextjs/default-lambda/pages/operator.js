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
    /******/ /******/ return __webpack_require__((__webpack_require__.s = 'D0cN'));
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

        /***/ '05og': /***/ function(module, exports, __webpack_require__) {
            var url = __webpack_require__('bzos');
            var http = __webpack_require__('KEll');
            var https = __webpack_require__('7WL4');
            var assert = __webpack_require__('Qs3B');
            var Writable = __webpack_require__('msIP').Writable;
            var debug = __webpack_require__('QWwp')('follow-redirects');

            // RFC7231§4.2.1: Of the request methods defined by this specification,
            // the GET, HEAD, OPTIONS, and TRACE methods are defined to be safe.
            var SAFE_METHODS = { GET: true, HEAD: true, OPTIONS: true, TRACE: true };

            // Create handlers that pass events from native requests
            var eventHandlers = Object.create(null);
            ['abort', 'aborted', 'error', 'socket', 'timeout'].forEach(function(event) {
                eventHandlers[event] = function(arg) {
                    this._redirectable.emit(event, arg);
                };
            });

            // An HTTP(S) request that can be redirected
            function RedirectableRequest(options, responseCallback) {
                // Initialize the request
                Writable.call(this);
                options.headers = options.headers || {};
                this._options = options;
                this._redirectCount = 0;
                this._redirects = [];
                this._requestBodyLength = 0;
                this._requestBodyBuffers = [];

                // Since http.request treats host as an alias of hostname,
                // but the url module interprets host as hostname plus port,
                // eliminate the host property to avoid confusion.
                if (options.host) {
                    // Use hostname if set, because it has precedence
                    if (!options.hostname) {
                        options.hostname = options.host;
                    }
                    delete options.host;
                }

                // Attach a callback if passed
                if (responseCallback) {
                    this.on('response', responseCallback);
                }

                // React to responses of native requests
                var self = this;
                this._onNativeResponse = function(response) {
                    self._processResponse(response);
                };

                // Complete the URL object when necessary
                if (!options.pathname && options.path) {
                    var searchPos = options.path.indexOf('?');
                    if (searchPos < 0) {
                        options.pathname = options.path;
                    } else {
                        options.pathname = options.path.substring(0, searchPos);
                        options.search = options.path.substring(searchPos);
                    }
                }

                // Perform the first request
                this._performRequest();
            }
            RedirectableRequest.prototype = Object.create(Writable.prototype);

            // Writes buffered data to the current native request
            RedirectableRequest.prototype.write = function(data, encoding, callback) {
                // Validate input and shift parameters if necessary
                if (!(typeof data === 'string' || (typeof data === 'object' && 'length' in data))) {
                    throw new Error('data should be a string, Buffer or Uint8Array');
                }
                if (typeof encoding === 'function') {
                    callback = encoding;
                    encoding = null;
                }

                // Ignore empty buffers, since writing them doesn't invoke the callback
                // https://github.com/nodejs/node/issues/22066
                if (data.length === 0) {
                    if (callback) {
                        callback();
                    }
                    return;
                }
                // Only write when we don't exceed the maximum body length
                if (this._requestBodyLength + data.length <= this._options.maxBodyLength) {
                    this._requestBodyLength += data.length;
                    this._requestBodyBuffers.push({ data: data, encoding: encoding });
                    this._currentRequest.write(data, encoding, callback);
                }
                // Error when we exceed the maximum body length
                else {
                    this.emit('error', new Error('Request body larger than maxBodyLength limit'));
                    this.abort();
                }
            };

            // Ends the current native request
            RedirectableRequest.prototype.end = function(data, encoding, callback) {
                // Shift parameters if necessary
                if (typeof data === 'function') {
                    callback = data;
                    data = encoding = null;
                } else if (typeof encoding === 'function') {
                    callback = encoding;
                    encoding = null;
                }

                // Write data and end
                var currentRequest = this._currentRequest;
                this.write(data || '', encoding, function() {
                    currentRequest.end(null, null, callback);
                });
            };

            // Sets a header value on the current native request
            RedirectableRequest.prototype.setHeader = function(name, value) {
                this._options.headers[name] = value;
                this._currentRequest.setHeader(name, value);
            };

            // Clears a header value on the current native request
            RedirectableRequest.prototype.removeHeader = function(name) {
                delete this._options.headers[name];
                this._currentRequest.removeHeader(name);
            };

            // Proxy all other public ClientRequest methods
            ['abort', 'flushHeaders', 'getHeader', 'setNoDelay', 'setSocketKeepAlive', 'setTimeout'].forEach(function(
                method,
            ) {
                RedirectableRequest.prototype[method] = function(a, b) {
                    return this._currentRequest[method](a, b);
                };
            });

            // Proxy all public ClientRequest properties
            ['aborted', 'connection', 'socket'].forEach(function(property) {
                Object.defineProperty(RedirectableRequest.prototype, property, {
                    get: function() {
                        return this._currentRequest[property];
                    },
                });
            });

            // Executes the next native request (initial or redirect)
            RedirectableRequest.prototype._performRequest = function() {
                // Load the native protocol
                var protocol = this._options.protocol;
                var nativeProtocol = this._options.nativeProtocols[protocol];
                if (!nativeProtocol) {
                    this.emit('error', new Error('Unsupported protocol ' + protocol));
                    return;
                }

                // If specified, use the agent corresponding to the protocol
                // (HTTP and HTTPS use different types of agents)
                if (this._options.agents) {
                    var scheme = protocol.substr(0, protocol.length - 1);
                    this._options.agent = this._options.agents[scheme];
                }

                // Create the native request
                var request = (this._currentRequest = nativeProtocol.request(this._options, this._onNativeResponse));
                this._currentUrl = url.format(this._options);

                // Set up event handlers
                request._redirectable = this;
                for (var event in eventHandlers) {
                    /* istanbul ignore else */
                    if (event) {
                        request.on(event, eventHandlers[event]);
                    }
                }

                // End a redirected request
                // (The first request must be ended explicitly with RedirectableRequest#end)
                if (this._isRedirect) {
                    // Write the request entity and end.
                    var i = 0;
                    var buffers = this._requestBodyBuffers;
                    (function writeNext() {
                        if (i < buffers.length) {
                            var buffer = buffers[i++];
                            request.write(buffer.data, buffer.encoding, writeNext);
                        } else {
                            request.end();
                        }
                    })();
                }
            };

            // Processes a response from the current native request
            RedirectableRequest.prototype._processResponse = function(response) {
                // Store the redirected response
                if (this._options.trackRedirects) {
                    this._redirects.push({
                        url: this._currentUrl,
                        headers: response.headers,
                        statusCode: response.statusCode,
                    });
                }

                // RFC7231§6.4: The 3xx (Redirection) class of status code indicates
                // that further action needs to be taken by the user agent in order to
                // fulfill the request. If a Location header field is provided,
                // the user agent MAY automatically redirect its request to the URI
                // referenced by the Location field value,
                // even if the specific status code is not understood.
                var location = response.headers.location;
                if (
                    location &&
                    this._options.followRedirects !== false &&
                    response.statusCode >= 300 &&
                    response.statusCode < 400
                ) {
                    // RFC7231§6.4: A client SHOULD detect and intervene
                    // in cyclical redirections (i.e., "infinite" redirection loops).
                    if (++this._redirectCount > this._options.maxRedirects) {
                        this.emit('error', new Error('Max redirects exceeded.'));
                        return;
                    }

                    // RFC7231§6.4: Automatic redirection needs to done with
                    // care for methods not known to be safe […],
                    // since the user might not wish to redirect an unsafe request.
                    // RFC7231§6.4.7: The 307 (Temporary Redirect) status code indicates
                    // that the target resource resides temporarily under a different URI
                    // and the user agent MUST NOT change the request method
                    // if it performs an automatic redirection to that URI.
                    var header;
                    var headers = this._options.headers;
                    if (response.statusCode !== 307 && !(this._options.method in SAFE_METHODS)) {
                        this._options.method = 'GET';
                        // Drop a possible entity and headers related to it
                        this._requestBodyBuffers = [];
                        for (header in headers) {
                            if (/^content-/i.test(header)) {
                                delete headers[header];
                            }
                        }
                    }

                    // Drop the Host header, as the redirect might lead to a different host
                    if (!this._isRedirect) {
                        for (header in headers) {
                            if (/^host$/i.test(header)) {
                                delete headers[header];
                            }
                        }
                    }

                    // Perform the redirected request
                    var redirectUrl = url.resolve(this._currentUrl, location);
                    debug('redirecting to', redirectUrl);
                    Object.assign(this._options, url.parse(redirectUrl));
                    this._isRedirect = true;
                    this._performRequest();

                    // Discard the remainder of the response to avoid waiting for data
                    response.destroy();
                } else {
                    // The response is not a redirect; return it as-is
                    response.responseUrl = this._currentUrl;
                    response.redirects = this._redirects;
                    this.emit('response', response);

                    // Clean up
                    this._requestBodyBuffers = [];
                }
            };

            // Wraps the key/value object of protocols with redirect functionality
            function wrap(protocols) {
                // Default settings
                var exports = {
                    maxRedirects: 21,
                    maxBodyLength: 10 * 1024 * 1024,
                };

                // Wrap each protocol
                var nativeProtocols = {};
                Object.keys(protocols).forEach(function(scheme) {
                    var protocol = scheme + ':';
                    var nativeProtocol = (nativeProtocols[protocol] = protocols[scheme]);
                    var wrappedProtocol = (exports[scheme] = Object.create(nativeProtocol));

                    // Executes a request, following redirects
                    wrappedProtocol.request = function(options, callback) {
                        if (typeof options === 'string') {
                            options = url.parse(options);
                            options.maxRedirects = exports.maxRedirects;
                        } else {
                            options = Object.assign(
                                {
                                    protocol: protocol,
                                    maxRedirects: exports.maxRedirects,
                                    maxBodyLength: exports.maxBodyLength,
                                },
                                options,
                            );
                        }
                        options.nativeProtocols = nativeProtocols;
                        assert.equal(options.protocol, protocol, 'protocol mismatch');
                        debug('options', options);
                        return new RedirectableRequest(options, callback);
                    };

                    // Executes a GET request, following redirects
                    wrappedProtocol.get = function(options, callback) {
                        var request = wrappedProtocol.request(options, callback);
                        request.end();
                        return request;
                    };
                });
                return exports;
            }

            // Exports
            module.exports = wrap({ http: http, https: https });
            module.exports.wrap = wrap;

            /***/
        },

        /***/ '0lfv': /***/ function(module, __webpack_exports__, __webpack_require__) {
            'use strict';
            /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, 'a', function() {
                return deleteCookieOnServerSide;
            });
            /* unused harmony export getHost */
            /* unused harmony export isSessionValid */
            /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, 'c', function() {
                return getUuidFromCookies;
            });
            /* unused harmony export getJourneyPatternFromCookies */
            /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, 'b', function() {
                return formatStopName;
            });
            /* harmony import */ var cookies__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__('Q/R2');
            /* harmony import */ var cookies__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/ __webpack_require__.n(
                cookies__WEBPACK_IMPORTED_MODULE_0__,
            );
            /* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__('vDqi');
            /* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/ __webpack_require__.n(
                axios__WEBPACK_IMPORTED_MODULE_1__,
            );
            /* harmony import */ var nookies__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__('NyWP');
            /* harmony import */ var nookies__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/ __webpack_require__.n(
                nookies__WEBPACK_IMPORTED_MODULE_2__,
            );
            /* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__('jxKE');

            const deleteCookieOnServerSide = (ctx, cookieName) => {
                if (ctx.req && ctx.res) {
                    var _ctx$req, _ctx$req$headers;

                    const cookies = new cookies__WEBPACK_IMPORTED_MODULE_0___default.a(ctx.req, ctx.res);
                    const host =
                        ctx === null || ctx === void 0
                            ? void 0
                            : (_ctx$req = ctx.req) === null || _ctx$req === void 0
                            ? void 0
                            : (_ctx$req$headers = _ctx$req.headers) === null || _ctx$req$headers === void 0
                            ? void 0
                            : _ctx$req$headers.origin;
                    const domain = host && host.replace(/(^\w+:|^)\/\//, '');
                    cookies.set(cookieName, '', {
                        overwrite: true,
                        maxAge: 0,
                        domain,
                        path: '/',
                    });
                }
            };
            const getHost = req => {
                var _req$headers;

                if (!req) {
                    return '';
                }

                const origin =
                    req === null || req === void 0
                        ? void 0
                        : (_req$headers = req.headers) === null || _req$headers === void 0
                        ? void 0
                        : _req$headers.origin;

                if (origin) {
                    const host = origin.replace(/(^\w+:|^)\/\//, '');

                    if (host && host.startsWith('localhost')) {
                        return `http://${host}`;
                    }

                    return `https://${host}`;
                }

                return '';
            };
            const isSessionValid = async (url, req) => {
                try {
                    const response = await axios__WEBPACK_IMPORTED_MODULE_1___default.a.get(url, {
                        withCredentials: true,
                        headers: {
                            Cookie: req === null || req === void 0 ? void 0 : req.headers.cookie,
                        },
                    });
                    return response.data.Valid;
                } catch (err) {
                    return false;
                }
            };
            const getUuidFromCookies = ctx => {
                const cookies = Object(nookies__WEBPACK_IMPORTED_MODULE_2__['parseCookies'])(ctx);
                const operatorCookie = cookies[_constants__WEBPACK_IMPORTED_MODULE_3__[/* OPERATOR_COOKIE */ 'h']];

                if (!operatorCookie) {
                    return null;
                }

                const operatorObject = JSON.parse(operatorCookie);
                return operatorObject.uuid;
            };
            const getJourneyPatternFromCookies = ctx => {
                const cookies = Object(nookies__WEBPACK_IMPORTED_MODULE_2__['parseCookies'])(ctx);
                const operatorCookie = cookies[_constants__WEBPACK_IMPORTED_MODULE_3__[/* OPERATOR_COOKIE */ 'h']];

                if (!operatorCookie) {
                    return null;
                }

                const operatorObject = JSON.parse(operatorCookie);
                return operatorObject.journeyPattern;
            };
            const formatStopName = stop => {
                var _stop$indicator, _stop$stopName;

                return `${stop.localityName ? `${stop.localityName}, ` : ''}${
                    (_stop$indicator = stop.indicator) !== null && _stop$indicator !== void 0 ? _stop$indicator : ''
                } ${(_stop$stopName = stop.stopName) !== null && _stop$stopName !== void 0 ? _stop$stopName : ''}${
                    stop.street ? ` (on ${stop.street})` : ''
                }`;
            };

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

        /***/ '2SVd': /***/ function(module, exports, __webpack_require__) {
            'use strict';

            /**
             * Determines whether the specified URL is absolute
             *
             * @param {string} url The URL to test
             * @returns {boolean} True if the specified URL is absolute, otherwise false
             */
            module.exports = function isAbsoluteURL(url) {
                // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
                // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
                // by any combination of letters, digits, plus, period, or hyphen.
                return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
            };

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

        /***/ '5oMp': /***/ function(module, exports, __webpack_require__) {
            'use strict';

            /**
             * Creates a new URL by combining the specified URLs
             *
             * @param {string} baseURL The base URL
             * @param {string} relativeURL The relative URL
             * @returns {string} The combined URL
             */
            module.exports = function combineURLs(baseURL, relativeURL) {
                return relativeURL ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '') : baseURL;
            };

            /***/
        },

        /***/ '67Bq': /***/ function(module) {
            module.exports = JSON.parse('{}');

            /***/
        },

        /***/ '7WL4': /***/ function(module, exports) {
            module.exports = require('https');

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

        /***/ '9rSQ': /***/ function(module, exports, __webpack_require__) {
            'use strict';

            var utils = __webpack_require__('xTJ+');

            function InterceptorManager() {
                this.handlers = [];
            }

            /**
             * Add a new interceptor to the stack
             *
             * @param {Function} fulfilled The function to handle `then` for a `Promise`
             * @param {Function} rejected The function to handle `reject` for a `Promise`
             *
             * @return {Number} An ID used to remove interceptor later
             */
            InterceptorManager.prototype.use = function use(fulfilled, rejected) {
                this.handlers.push({
                    fulfilled: fulfilled,
                    rejected: rejected,
                });
                return this.handlers.length - 1;
            };

            /**
             * Remove an interceptor from the stack
             *
             * @param {Number} id The ID that was returned by `use`
             */
            InterceptorManager.prototype.eject = function eject(id) {
                if (this.handlers[id]) {
                    this.handlers[id] = null;
                }
            };

            /**
             * Iterate over all the registered interceptors
             *
             * This method is particularly useful for skipping over any
             * interceptors that may have become `null` calling `eject`.
             *
             * @param {Function} fn The function to call for each interceptor
             */
            InterceptorManager.prototype.forEach = function forEach(fn) {
                utils.forEach(this.handlers, function forEachHandler(h) {
                    if (h !== null) {
                        fn(h);
                    }
                });
            };

            module.exports = InterceptorManager;

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

        /***/ CgaS: /***/ function(module, exports, __webpack_require__) {
            'use strict';

            var utils = __webpack_require__('xTJ+');
            var buildURL = __webpack_require__('MLWZ');
            var InterceptorManager = __webpack_require__('9rSQ');
            var dispatchRequest = __webpack_require__('UnBK');
            var mergeConfig = __webpack_require__('SntB');

            /**
             * Create a new instance of Axios
             *
             * @param {Object} instanceConfig The default config for the instance
             */
            function Axios(instanceConfig) {
                this.defaults = instanceConfig;
                this.interceptors = {
                    request: new InterceptorManager(),
                    response: new InterceptorManager(),
                };
            }

            /**
             * Dispatch a request
             *
             * @param {Object} config The config specific for this request (merged with this.defaults)
             */
            Axios.prototype.request = function request(config) {
                /*eslint no-param-reassign:0*/
                // Allow for axios('example/url'[, config]) a la fetch API
                if (typeof config === 'string') {
                    config = arguments[1] || {};
                    config.url = arguments[0];
                } else {
                    config = config || {};
                }

                config = mergeConfig(this.defaults, config);

                // Set config.method
                if (config.method) {
                    config.method = config.method.toLowerCase();
                } else if (this.defaults.method) {
                    config.method = this.defaults.method.toLowerCase();
                } else {
                    config.method = 'get';
                }

                // Hook up interceptors middleware
                var chain = [dispatchRequest, undefined];
                var promise = Promise.resolve(config);

                this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
                    chain.unshift(interceptor.fulfilled, interceptor.rejected);
                });

                this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
                    chain.push(interceptor.fulfilled, interceptor.rejected);
                });

                while (chain.length) {
                    promise = promise.then(chain.shift(), chain.shift());
                }

                return promise;
            };

            Axios.prototype.getUri = function getUri(config) {
                config = mergeConfig(this.defaults, config);
                return buildURL(config.url, config.params, config.paramsSerializer).replace(/^\?/, '');
            };

            // Provide aliases for supported request methods
            utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
                /*eslint func-names:0*/
                Axios.prototype[method] = function(url, config) {
                    return this.request(
                        utils.merge(config || {}, {
                            method: method,
                            url: url,
                        }),
                    );
                };
            });

            utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
                /*eslint func-names:0*/
                Axios.prototype[method] = function(url, data, config) {
                    return this.request(
                        utils.merge(config || {}, {
                            method: method,
                            url: url,
                            data: data,
                        }),
                    );
                };
            });

            module.exports = Axios;

            /***/
        },

        /***/ D0cN: /***/ function(module, __webpack_exports__, __webpack_require__) {
            'use strict';
            __webpack_require__.r(__webpack_exports__);
            var operator_namespaceObject = {};
            __webpack_require__.r(operator_namespaceObject);
            __webpack_require__.d(operator_namespaceObject, 'default', function() {
                return operator;
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

            // EXTERNAL MODULE: ./src/constants/index.ts
            var constants = __webpack_require__('jxKE');

            // EXTERNAL MODULE: ./src/utils/index.ts
            var utils = __webpack_require__('0lfv');

            // CONCATENATED MODULE: ./src/pages/operator.tsx
            var __jsx = react_default.a.createElement;

            const title = 'Operator - Fares data build tool';
            const description = 'Operator selection page of the Fares data build tool';
            const hardCodedOperators = [
                {
                    operatorName: 'Blackpool Transport',
                    nocCode: 'BLAC',
                },
                {
                    operatorName: 'Connexions Buses',
                    nocCode: 'HCTY',
                },
                {
                    operatorName: 'Durham County Council',
                    nocCode: 'DCCL',
                },
                {
                    operatorName: 'East Yorkshire Council',
                    nocCode: 'ERDG',
                },
                {
                    operatorName: 'Lancashire County Council',
                    nocCode: 'PBLT',
                },
                {
                    operatorName: 'Manchester Community Transport',
                    nocCode: 'MCTR',
                },
                {
                    operatorName: 'Pilkington Bus',
                    nocCode: 'NWBT',
                },
                {
                    operatorName: 'TLC Travel',
                    nocCode: 'TLCT',
                },
                {
                    operatorName: 'Transport for Greater Manchester',
                    nocCode: 'VISB',
                },
                {
                    operatorName: "Warrington's Own Buses",
                    nocCode: 'WBTR',
                },
            ];

            const Operator = () =>
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
                                action: '/api/operator',
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
                                        'aria-describedby': 'page-heading',
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
                                                id: 'page-heading',
                                            },
                                            'Which operator are you representing?',
                                        ),
                                    ),
                                    __jsx(
                                        'div',
                                        {
                                            className: 'govuk-radios',
                                        },
                                        hardCodedOperators.map((operator, index) =>
                                            __jsx(
                                                'div',
                                                {
                                                    className: 'govuk-radios__item',
                                                    key: operator.operatorName,
                                                },
                                                __jsx('input', {
                                                    className: 'govuk-radios__input',
                                                    id: `operator-name${index}`,
                                                    name: 'operator',
                                                    type: 'radio',
                                                    value: JSON.stringify(operator),
                                                }),
                                                __jsx(
                                                    'label',
                                                    {
                                                        className: 'govuk-label govuk-radios__label',
                                                        htmlFor: `operator-name${index}`,
                                                    },
                                                    `${operator.operatorName}`,
                                                ),
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

            Operator.getInitialProps = ctx => {
                Object(utils['a' /* deleteCookieOnServerSide */])(ctx, constants['h' /* OPERATOR_COOKIE */]);
                return {};
            };

            /* harmony default export */ var operator = Operator;
            // EXTERNAL MODULE: ./.next/routes-manifest.json
            var routes_manifest = __webpack_require__('Skye');

            // EXTERNAL MODULE: ./node_modules/next/dist/next-server/server/lib/path-match.js
            var path_match = __webpack_require__('uDRR');
            var path_match_default = /*#__PURE__*/ __webpack_require__.n(path_match);

            // CONCATENATED MODULE: ./node_modules/next/dist/build/webpack/loaders/next-serverless-loader.js?page=%2Foperator&absolutePagePath=private-next-pages%2Foperator.tsx&absoluteAppPath=private-next-pages%2F_app.tsx&absoluteDocumentPath=private-next-pages%2F_document.tsx&absoluteErrorPath=private-next-pages%2F_error.tsx&distDir=private-dot-next&buildId=DeUQcbc3W9rXgf03yE6k1&assetPrefix=&generateEtags=true&canonicalBase=&basePath=
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
                return next_serverless_loaderpage_2Foperator_absolutePagePath_private_next_pages_2Foperator_tsx_absoluteAppPath_private_next_pages_2F_app_tsx_absoluteDocumentPath_private_next_pages_2F_document_tsx_absoluteErrorPath_private_next_pages_2F_error_tsx_distDir_private_dot_next_buildId_DeUQcbc3W9rXgf03yE6k1_assetPrefix_generateEtags_true_canonicalBase_basePath_app;
            });
            /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, 'renderReqToHTML', function() {
                return renderReqToHTML;
            });
            /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, 'render', function() {
                return next_serverless_loaderpage_2Foperator_absolutePagePath_private_next_pages_2Foperator_tsx_absoluteAppPath_private_next_pages_2F_app_tsx_absoluteDocumentPath_private_next_pages_2F_document_tsx_absoluteErrorPath_private_next_pages_2F_error_tsx_distDir_private_dot_next_buildId_DeUQcbc3W9rXgf03yE6k1_assetPrefix_generateEtags_true_canonicalBase_basePath_render;
            });

            const Component = operator;
            /* harmony default export */ var next_serverless_loaderpage_2Foperator_absolutePagePath_private_next_pages_2Foperator_tsx_absoluteAppPath_private_next_pages_2F_app_tsx_absoluteDocumentPath_private_next_pages_2F_document_tsx_absoluteErrorPath_private_next_pages_2F_error_tsx_distDir_private_dot_next_buildId_DeUQcbc3W9rXgf03yE6k1_assetPrefix_generateEtags_true_canonicalBase_basePath_ = (__webpack_exports__[
                'default'
            ] = Component);
            const unstable_getStaticProps = operator_namespaceObject['unstable_getStaticProp' + 's'];
            const unstable_getStaticParams = operator_namespaceObject['unstable_getStaticParam' + 's'];
            const unstable_getStaticPaths = operator_namespaceObject['unstable_getStaticPath' + 's'];

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

                        if (parsedUrl.pathname === '/operator') {
                            break;
                        }
                    }
                }

                return parsedUrl;
            }

            const config = operator_namespaceObject['confi' + 'g'] || {};
            const next_serverless_loaderpage_2Foperator_absolutePagePath_private_next_pages_2Foperator_tsx_absoluteAppPath_private_next_pages_2F_app_tsx_absoluteDocumentPath_private_next_pages_2F_document_tsx_absoluteErrorPath_private_next_pages_2F_error_tsx_distDir_private_dot_next_buildId_DeUQcbc3W9rXgf03yE6k1_assetPrefix_generateEtags_true_canonicalBase_basePath_app =
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
                        '/operator',
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
            async function next_serverless_loaderpage_2Foperator_absolutePagePath_private_next_pages_2Foperator_tsx_absoluteAppPath_private_next_pages_2F_app_tsx_absoluteDocumentPath_private_next_pages_2F_document_tsx_absoluteErrorPath_private_next_pages_2F_error_tsx_distDir_private_dot_next_buildId_DeUQcbc3W9rXgf03yE6k1_assetPrefix_generateEtags_true_canonicalBase_basePath_render(
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

        /***/ DfZB: /***/ function(module, exports, __webpack_require__) {
            'use strict';

            /**
             * Syntactic sugar for invoking a function and expanding an array for arguments.
             *
             * Common use case would be to use `Function.prototype.apply`.
             *
             *  ```js
             *  function f(x, y, z) {}
             *  var args = [1, 2, 3];
             *  f.apply(null, args);
             *  ```
             *
             * With `spread` this example can be re-written.
             *
             *  ```js
             *  spread(function(x, y, z) {})([1, 2, 3]);
             *  ```
             *
             * @param {Function} callback
             * @returns {Function}
             */
            module.exports = function spread(callback) {
                return function wrap(arr) {
                    return callback.apply(null, arr);
                };
            };

            /***/
        },

        /***/ DizN: /***/ function(module, exports, __webpack_require__) {
            'use strict';

            // Implements Brad Hill's Double HMAC pattern from
            // https://www.nccgroup.trust/us/about-us/newsroom-and-events/blog/2011/february/double-hmac-verification/.
            // The approach is similar to the node's native implementation of timing safe buffer comparison that will be available on v6+.
            // https://github.com/nodejs/node/issues/3043
            // https://github.com/nodejs/node/pull/3073

            var crypto = __webpack_require__('PJMN');

            function bufferEqual(a, b) {
                if (a.length !== b.length) {
                    return false;
                }
                // `crypto.timingSafeEqual` was introduced in Node v6.6.0
                // <https://github.com/jshttp/basic-auth/issues/39>
                if (crypto.timingSafeEqual) {
                    return crypto.timingSafeEqual(a, b);
                }
                for (var i = 0; i < a.length; i++) {
                    if (a[i] !== b[i]) {
                        return false;
                    }
                }
                return true;
            }

            function timeSafeCompare(a, b) {
                var sa = String(a);
                var sb = String(b);
                var key = crypto.pseudoRandomBytes(32);
                var ah = crypto
                    .createHmac('sha256', key)
                    .update(sa)
                    .digest();
                var bh = crypto
                    .createHmac('sha256', key)
                    .update(sb)
                    .digest();

                return bufferEqual(ah, bh) && a === b;
            }

            module.exports = timeSafeCompare;

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

        /***/ FGiv: /***/ function(module, exports) {
            /**
             * Helpers.
             */

            var s = 1000;
            var m = s * 60;
            var h = m * 60;
            var d = h * 24;
            var y = d * 365.25;

            /**
             * Parse or format the given `val`.
             *
             * Options:
             *
             *  - `long` verbose formatting [false]
             *
             * @param {String|Number} val
             * @param {Object} [options]
             * @throws {Error} throw an error if val is not a non-empty string or a number
             * @return {String|Number}
             * @api public
             */

            module.exports = function(val, options) {
                options = options || {};
                var type = typeof val;
                if (type === 'string' && val.length > 0) {
                    return parse(val);
                } else if (type === 'number' && isNaN(val) === false) {
                    return options.long ? fmtLong(val) : fmtShort(val);
                }
                throw new Error('val is not a non-empty string or a valid number. val=' + JSON.stringify(val));
            };

            /**
             * Parse the given `str` and return milliseconds.
             *
             * @param {String} str
             * @return {Number}
             * @api private
             */

            function parse(str) {
                str = String(str);
                if (str.length > 100) {
                    return;
                }
                var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(
                    str,
                );
                if (!match) {
                    return;
                }
                var n = parseFloat(match[1]);
                var type = (match[2] || 'ms').toLowerCase();
                switch (type) {
                    case 'years':
                    case 'year':
                    case 'yrs':
                    case 'yr':
                    case 'y':
                        return n * y;
                    case 'days':
                    case 'day':
                    case 'd':
                        return n * d;
                    case 'hours':
                    case 'hour':
                    case 'hrs':
                    case 'hr':
                    case 'h':
                        return n * h;
                    case 'minutes':
                    case 'minute':
                    case 'mins':
                    case 'min':
                    case 'm':
                        return n * m;
                    case 'seconds':
                    case 'second':
                    case 'secs':
                    case 'sec':
                    case 's':
                        return n * s;
                    case 'milliseconds':
                    case 'millisecond':
                    case 'msecs':
                    case 'msec':
                    case 'ms':
                        return n;
                    default:
                        return undefined;
                }
            }

            /**
             * Short format for `ms`.
             *
             * @param {Number} ms
             * @return {String}
             * @api private
             */

            function fmtShort(ms) {
                if (ms >= d) {
                    return Math.round(ms / d) + 'd';
                }
                if (ms >= h) {
                    return Math.round(ms / h) + 'h';
                }
                if (ms >= m) {
                    return Math.round(ms / m) + 'm';
                }
                if (ms >= s) {
                    return Math.round(ms / s) + 's';
                }
                return ms + 'ms';
            }

            /**
             * Long format for `ms`.
             *
             * @param {Number} ms
             * @return {String}
             * @api private
             */

            function fmtLong(ms) {
                return (
                    plural(ms, d, 'day') ||
                    plural(ms, h, 'hour') ||
                    plural(ms, m, 'minute') ||
                    plural(ms, s, 'second') ||
                    ms + ' ms'
                );
            }

            /**
             * Pluralization helper.
             */

            function plural(ms, n, name) {
                if (ms < n) {
                    return;
                }
                if (ms < n * 1.5) {
                    return Math.floor(ms / n) + ' ' + name;
                }
                return Math.ceil(ms / n) + ' ' + name + 's';
            }

            /***/
        },

        /***/ FMKJ: /***/ function(module, exports) {
            module.exports = require('zlib');

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

        /***/ HSsa: /***/ function(module, exports, __webpack_require__) {
            'use strict';

            module.exports = function bind(fn, thisArg) {
                return function wrap() {
                    var args = new Array(arguments.length);
                    for (var i = 0; i < args.length; i++) {
                        args[i] = arguments[i];
                    }
                    return fn.apply(thisArg, args);
                };
            };

            /***/
        },

        /***/ JEQr: /***/ function(module, exports, __webpack_require__) {
            'use strict';

            var utils = __webpack_require__('xTJ+');
            var normalizeHeaderName = __webpack_require__('yK9s');

            var DEFAULT_CONTENT_TYPE = {
                'Content-Type': 'application/x-www-form-urlencoded',
            };

            function setContentTypeIfUnset(headers, value) {
                if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
                    headers['Content-Type'] = value;
                }
            }

            function getDefaultAdapter() {
                var adapter;
                if (typeof XMLHttpRequest !== 'undefined') {
                    // For browsers use XHR adapter
                    adapter = __webpack_require__('tQ2B');
                } else if (
                    typeof process !== 'undefined' &&
                    Object.prototype.toString.call(process) === '[object process]'
                ) {
                    // For node use HTTP adapter
                    adapter = __webpack_require__('maZv');
                }
                return adapter;
            }

            var defaults = {
                adapter: getDefaultAdapter(),

                transformRequest: [
                    function transformRequest(data, headers) {
                        normalizeHeaderName(headers, 'Accept');
                        normalizeHeaderName(headers, 'Content-Type');
                        if (
                            utils.isFormData(data) ||
                            utils.isArrayBuffer(data) ||
                            utils.isBuffer(data) ||
                            utils.isStream(data) ||
                            utils.isFile(data) ||
                            utils.isBlob(data)
                        ) {
                            return data;
                        }
                        if (utils.isArrayBufferView(data)) {
                            return data.buffer;
                        }
                        if (utils.isURLSearchParams(data)) {
                            setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
                            return data.toString();
                        }
                        if (utils.isObject(data)) {
                            setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
                            return JSON.stringify(data);
                        }
                        return data;
                    },
                ],

                transformResponse: [
                    function transformResponse(data) {
                        /*eslint no-param-reassign:0*/
                        if (typeof data === 'string') {
                            try {
                                data = JSON.parse(data);
                            } catch (e) {
                                /* Ignore */
                            }
                        }
                        return data;
                    },
                ],

                /**
                 * A timeout in milliseconds to abort a request. If set to 0 (default) a
                 * timeout is not created.
                 */
                timeout: 0,

                xsrfCookieName: 'XSRF-TOKEN',
                xsrfHeaderName: 'X-XSRF-TOKEN',

                maxContentLength: -1,

                validateStatus: function validateStatus(status) {
                    return status >= 200 && status < 300;
                },
            };

            defaults.headers = {
                common: {
                    Accept: 'application/json, text/plain, */*',
                },
            };

            utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
                defaults.headers[method] = {};
            });

            utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
                defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
            });

            module.exports = defaults;

            /***/
        },

        /***/ KEll: /***/ function(module, exports) {
            module.exports = require('http');

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

        /***/ LYNF: /***/ function(module, exports, __webpack_require__) {
            'use strict';

            var enhanceError = __webpack_require__('OH9c');

            /**
             * Create an Error with the specified message, config, error code, request and response.
             *
             * @param {string} message The error message.
             * @param {Object} config The config.
             * @param {string} [code] The error code (for example, 'ECONNABORTED').
             * @param {Object} [request] The request.
             * @param {Object} [response] The response.
             * @returns {Error} The created error.
             */
            module.exports = function createError(message, config, code, request, response) {
                var error = new Error(message);
                return enhanceError(error, config, code, request, response);
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

        /***/ Lmem: /***/ function(module, exports, __webpack_require__) {
            'use strict';

            module.exports = function isCancel(value) {
                return !!(value && value.__CANCEL__);
            };

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

        /***/ MLWZ: /***/ function(module, exports, __webpack_require__) {
            'use strict';

            var utils = __webpack_require__('xTJ+');

            function encode(val) {
                return encodeURIComponent(val)
                    .replace(/%40/gi, '@')
                    .replace(/%3A/gi, ':')
                    .replace(/%24/g, '$')
                    .replace(/%2C/gi, ',')
                    .replace(/%20/g, '+')
                    .replace(/%5B/gi, '[')
                    .replace(/%5D/gi, ']');
            }

            /**
             * Build a URL by appending params to the end
             *
             * @param {string} url The base of the url (e.g., http://www.google.com)
             * @param {object} [params] The params to be appended
             * @returns {string} The formatted url
             */
            module.exports = function buildURL(url, params, paramsSerializer) {
                /*eslint no-param-reassign:0*/
                if (!params) {
                    return url;
                }

                var serializedParams;
                if (paramsSerializer) {
                    serializedParams = paramsSerializer(params);
                } else if (utils.isURLSearchParams(params)) {
                    serializedParams = params.toString();
                } else {
                    var parts = [];

                    utils.forEach(params, function serialize(val, key) {
                        if (val === null || typeof val === 'undefined') {
                            return;
                        }

                        if (utils.isArray(val)) {
                            key = key + '[]';
                        } else {
                            val = [val];
                        }

                        utils.forEach(val, function parseValue(v) {
                            if (utils.isDate(v)) {
                                v = v.toISOString();
                            } else if (utils.isObject(v)) {
                                v = JSON.stringify(v);
                            }
                            parts.push(encode(key) + '=' + encode(v));
                        });
                    });

                    serializedParams = parts.join('&');
                }

                if (serializedParams) {
                    var hashmarkIndex = url.indexOf('#');
                    if (hashmarkIndex !== -1) {
                        url = url.slice(0, hashmarkIndex);
                    }

                    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
                }

                return url;
            };

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

        /***/ NOtv: /***/ function(module, exports, __webpack_require__) {
            /**
             * This is the web browser implementation of `debug()`.
             *
             * Expose `debug()` as the module.
             */

            exports = module.exports = __webpack_require__('lv48');
            exports.log = log;
            exports.formatArgs = formatArgs;
            exports.save = save;
            exports.load = load;
            exports.useColors = useColors;
            exports.storage =
                'undefined' != typeof chrome && 'undefined' != typeof chrome.storage
                    ? chrome.storage.local
                    : localstorage();

            /**
             * Colors.
             */

            exports.colors = [
                '#0000CC',
                '#0000FF',
                '#0033CC',
                '#0033FF',
                '#0066CC',
                '#0066FF',
                '#0099CC',
                '#0099FF',
                '#00CC00',
                '#00CC33',
                '#00CC66',
                '#00CC99',
                '#00CCCC',
                '#00CCFF',
                '#3300CC',
                '#3300FF',
                '#3333CC',
                '#3333FF',
                '#3366CC',
                '#3366FF',
                '#3399CC',
                '#3399FF',
                '#33CC00',
                '#33CC33',
                '#33CC66',
                '#33CC99',
                '#33CCCC',
                '#33CCFF',
                '#6600CC',
                '#6600FF',
                '#6633CC',
                '#6633FF',
                '#66CC00',
                '#66CC33',
                '#9900CC',
                '#9900FF',
                '#9933CC',
                '#9933FF',
                '#99CC00',
                '#99CC33',
                '#CC0000',
                '#CC0033',
                '#CC0066',
                '#CC0099',
                '#CC00CC',
                '#CC00FF',
                '#CC3300',
                '#CC3333',
                '#CC3366',
                '#CC3399',
                '#CC33CC',
                '#CC33FF',
                '#CC6600',
                '#CC6633',
                '#CC9900',
                '#CC9933',
                '#CCCC00',
                '#CCCC33',
                '#FF0000',
                '#FF0033',
                '#FF0066',
                '#FF0099',
                '#FF00CC',
                '#FF00FF',
                '#FF3300',
                '#FF3333',
                '#FF3366',
                '#FF3399',
                '#FF33CC',
                '#FF33FF',
                '#FF6600',
                '#FF6633',
                '#FF9900',
                '#FF9933',
                '#FFCC00',
                '#FFCC33',
            ];

            /**
             * Currently only WebKit-based Web Inspectors, Firefox >= v31,
             * and the Firebug extension (any Firefox version) are known
             * to support "%c" CSS customizations.
             *
             * TODO: add a `localStorage` variable to explicitly enable/disable colors
             */

            function useColors() {
                // NB: In an Electron preload script, document will be defined but not fully
                // initialized. Since we know we're in Chrome, we'll just detect this case
                // explicitly
                if (typeof window !== 'undefined' && window.process && window.process.type === 'renderer') {
                    return true;
                }

                // Internet Explorer and Edge do not support colors.
                if (
                    typeof navigator !== 'undefined' &&
                    navigator.userAgent &&
                    navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)
                ) {
                    return false;
                }

                // is webkit? http://stackoverflow.com/a/16459606/376773
                // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
                return (
                    (typeof document !== 'undefined' &&
                        document.documentElement &&
                        document.documentElement.style &&
                        document.documentElement.style.WebkitAppearance) ||
                    // is firebug? http://stackoverflow.com/a/398120/376773
                    (typeof window !== 'undefined' &&
                        window.console &&
                        (window.console.firebug || (window.console.exception && window.console.table))) ||
                    // is firefox >= v31?
                    // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
                    (typeof navigator !== 'undefined' &&
                        navigator.userAgent &&
                        navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) &&
                        parseInt(RegExp.$1, 10) >= 31) ||
                    // double check webkit in userAgent just in case we are in a worker
                    (typeof navigator !== 'undefined' &&
                        navigator.userAgent &&
                        navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/))
                );
            }

            /**
             * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
             */

            exports.formatters.j = function(v) {
                try {
                    return JSON.stringify(v);
                } catch (err) {
                    return '[UnexpectedJSONParseError]: ' + err.message;
                }
            };

            /**
             * Colorize log arguments if enabled.
             *
             * @api public
             */

            function formatArgs(args) {
                var useColors = this.useColors;

                args[0] =
                    (useColors ? '%c' : '') +
                    this.namespace +
                    (useColors ? ' %c' : ' ') +
                    args[0] +
                    (useColors ? '%c ' : ' ') +
                    '+' +
                    exports.humanize(this.diff);

                if (!useColors) return;

                var c = 'color: ' + this.color;
                args.splice(1, 0, c, 'color: inherit');

                // the final "%c" is somewhat tricky, because there could be other
                // arguments passed either before or after the %c, so we need to
                // figure out the correct index to insert the CSS into
                var index = 0;
                var lastC = 0;
                args[0].replace(/%[a-zA-Z%]/g, function(match) {
                    if ('%%' === match) return;
                    index++;
                    if ('%c' === match) {
                        // we only are interested in the *last* %c
                        // (the user may have provided their own)
                        lastC = index;
                    }
                });

                args.splice(lastC, 0, c);
            }

            /**
             * Invokes `console.log()` when available.
             * No-op when `console.log` is not a "function".
             *
             * @api public
             */

            function log() {
                // this hackery is required for IE8/9, where
                // the `console.log` function doesn't have 'apply'
                return (
                    'object' === typeof console &&
                    console.log &&
                    Function.prototype.apply.call(console.log, console, arguments)
                );
            }

            /**
             * Save `namespaces`.
             *
             * @param {String} namespaces
             * @api private
             */

            function save(namespaces) {
                try {
                    if (null == namespaces) {
                        exports.storage.removeItem('debug');
                    } else {
                        exports.storage.debug = namespaces;
                    }
                } catch (e) {}
            }

            /**
             * Load `namespaces`.
             *
             * @return {String} returns the previously persisted debug modes
             * @api private
             */

            function load() {
                var r;
                try {
                    r = exports.storage.debug;
                } catch (e) {}

                // If debug isn't set in LS, and we're in Electron, try to load $DEBUG
                if (!r && typeof process !== 'undefined' && 'env' in process) {
                    r = process.env.DEBUG;
                }

                return r;
            }

            /**
             * Enable namespaces listed in `localStorage.debug` initially.
             */

            exports.enable(load());

            /**
             * Localstorage attempts to return the localstorage.
             *
             * This is necessary because safari throws
             * when a user disables cookies/localstorage
             * and you attempt to access it.
             *
             * @return {LocalStorage}
             * @api private
             */

            function localstorage() {
                try {
                    return window.localStorage;
                } catch (e) {}
            }

            /***/
        },

        /***/ NyWP: /***/ function(module, exports, __webpack_require__) {
            'use strict';

            var __assign =
                (this && this.__assign) ||
                function() {
                    __assign =
                        Object.assign ||
                        function(t) {
                            for (var s, i = 1, n = arguments.length; i < n; i++) {
                                s = arguments[i];
                                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
                            }
                            return t;
                        };
                    return __assign.apply(this, arguments);
                };
            Object.defineProperty(exports, '__esModule', { value: true });
            var cookie = __webpack_require__('iVi/');
            var setCookieParser = __webpack_require__('U0US');
            var isBrowser = function() {
                return typeof window !== 'undefined';
            };
            /**
             * Compare the cookie and return true if the cookies has equivalent
             * options and the cookies would be overwritten in the browser storage.
             *
             * @param a first Cookie for comparision
             * @param b second Cookie for comparision
             */
            function areCookiesEqual(a, b) {
                return (
                    a.name === b.name &&
                    a.domain === b.domain &&
                    a.path === b.path &&
                    a.httpOnly === b.httpOnly &&
                    a.secure === b.secure
                );
            }
            /**
             * Create an instance of the Cookie interface
             *
             * @param name name of the Cookie
             * @param value value of the Cookie
             * @param options Cookie options
             */
            function createCookie(name, value, options) {
                return {
                    name: name,
                    expires: options.expires,
                    maxAge: options.maxAge,
                    secure: options.secure,
                    httpOnly: options.httpOnly,
                    domain: options.domain,
                    value: value,
                    path: options.path,
                };
            }
            /**
             *
             * Parses cookies.
             *
             * @param ctx
             * @param options
             */
            function parseCookies(ctx, options) {
                if (ctx && ctx.req && ctx.req.headers && ctx.req.headers.cookie) {
                    return cookie.parse(ctx.req.headers.cookie, options);
                }
                if (isBrowser()) {
                    return cookie.parse(document.cookie, options);
                }
                return {};
            }
            exports.parseCookies = parseCookies;
            /**
             *
             * Sets a cookie.
             *
             * @param ctx
             * @param name
             * @param value
             * @param options
             */
            function setCookie(ctx, name, value, options) {
                if (ctx && ctx.res && ctx.res.getHeader && ctx.res.setHeader) {
                    var cookies = ctx.res.getHeader('Set-Cookie') || [];
                    if (typeof cookies === 'string') cookies = [cookies];
                    if (typeof cookies === 'number') cookies = [];
                    var parsedCookies = setCookieParser.parse(cookies);
                    var cookiesToSet_1 = [];
                    parsedCookies.forEach(function(parsedCookie) {
                        if (!areCookiesEqual(parsedCookie, createCookie(name, value, options))) {
                            cookiesToSet_1.push(
                                cookie.serialize(parsedCookie.name, parsedCookie.value, {
                                    domain: parsedCookie.domain,
                                    path: parsedCookie.path,
                                    httpOnly: parsedCookie.httpOnly,
                                    secure: parsedCookie.secure,
                                    maxAge: parsedCookie.maxAge,
                                    expires: parsedCookie.expires,
                                }),
                            );
                        }
                    });
                    cookiesToSet_1.push(cookie.serialize(name, value, options));
                    ctx.res.setHeader('Set-Cookie', cookiesToSet_1);
                }
                if (isBrowser()) {
                    document.cookie = cookie.serialize(name, value, options);
                }
                return {};
            }
            exports.setCookie = setCookie;
            /**
             *
             * Destroys a cookie with a particular name.
             *
             * @param ctx
             * @param name
             * @param options
             */
            function destroyCookie(ctx, name, options) {
                var opts = __assign({}, options || {}, { maxAge: -1 });
                if (ctx && ctx.res && ctx.res.setHeader && ctx.res.getHeader) {
                    var cookies = ctx.res.getHeader('Set-Cookie') || [];
                    if (typeof cookies === 'string') cookies = [cookies];
                    if (typeof cookies === 'number') cookies = [];
                    cookies.push(cookie.serialize(name, '', opts));
                    ctx.res.setHeader('Set-Cookie', cookies);
                }
                if (isBrowser()) {
                    document.cookie = cookie.serialize(name, '', opts);
                }
                return {};
            }
            exports.destroyCookie = destroyCookie;
            exports.default = {
                set: setCookie,
                get: parseCookies,
                destroy: destroyCookie,
            };
            //# sourceMappingURL=index.js.map

            /***/
        },

        /***/ OH9c: /***/ function(module, exports, __webpack_require__) {
            'use strict';

            /**
             * Update an Error with the specified config, error code, and response.
             *
             * @param {Error} error The error to update.
             * @param {Object} config The config.
             * @param {string} [code] The error code (for example, 'ECONNABORTED').
             * @param {Object} [request] The request.
             * @param {Object} [response] The response.
             * @returns {Error} The error.
             */
            module.exports = function enhanceError(error, config, code, request, response) {
                error.config = config;
                if (code) {
                    error.code = code;
                }

                error.request = request;
                error.response = response;
                error.isAxiosError = true;

                error.toJSON = function() {
                    return {
                        // Standard
                        message: this.message,
                        name: this.name,
                        // Microsoft
                        description: this.description,
                        number: this.number,
                        // Mozilla
                        fileName: this.fileName,
                        lineNumber: this.lineNumber,
                        columnNumber: this.columnNumber,
                        stack: this.stack,
                        // Axios
                        config: this.config,
                        code: this.code,
                    };
                };
                return error;
            };

            /***/
        },

        /***/ OTTw: /***/ function(module, exports, __webpack_require__) {
            'use strict';

            var utils = __webpack_require__('xTJ+');

            module.exports = utils.isStandardBrowserEnv()
                ? // Standard browser envs have full support of the APIs needed to test
                  // whether the request URL is of the same origin as current location.
                  (function standardBrowserEnv() {
                      var msie = /(msie|trident)/i.test(navigator.userAgent);
                      var urlParsingNode = document.createElement('a');
                      var originURL;

                      /**
                       * Parse a URL to discover it's components
                       *
                       * @param {String} url The URL to be parsed
                       * @returns {Object}
                       */
                      function resolveURL(url) {
                          var href = url;

                          if (msie) {
                              // IE needs attribute set twice to normalize properties
                              urlParsingNode.setAttribute('href', href);
                              href = urlParsingNode.href;
                          }

                          urlParsingNode.setAttribute('href', href);

                          // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
                          return {
                              href: urlParsingNode.href,
                              protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
                              host: urlParsingNode.host,
                              search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
                              hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
                              hostname: urlParsingNode.hostname,
                              port: urlParsingNode.port,
                              pathname:
                                  urlParsingNode.pathname.charAt(0) === '/'
                                      ? urlParsingNode.pathname
                                      : '/' + urlParsingNode.pathname,
                          };
                      }

                      originURL = resolveURL(window.location.href);

                      /**
                       * Determine if a URL shares the same origin as the current location
                       *
                       * @param {String} requestURL The URL to test
                       * @returns {boolean} True if URL shares the same origin, otherwise false
                       */
                      return function isURLSameOrigin(requestURL) {
                          var parsed = utils.isString(requestURL) ? resolveURL(requestURL) : requestURL;
                          return parsed.protocol === originURL.protocol && parsed.host === originURL.host;
                      };
                  })()
                : // Non standard browser envs (web workers, react-native) lack needed support.
                  (function nonStandardBrowserEnv() {
                      return function isURLSameOrigin() {
                          return true;
                      };
                  })();

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

        /***/ 'Q/R2': /***/ function(module, exports, __webpack_require__) {
            'use strict';
            /*!
             * cookies
             * Copyright(c) 2014 Jed Schmidt, http://jed.is/
             * Copyright(c) 2015-2016 Douglas Christopher Wilson
             * MIT Licensed
             */

            var deprecate = __webpack_require__('xYCF')('cookies');
            var Keygrip = __webpack_require__('f06u');
            var http = __webpack_require__('KEll');
            var cache = {};

            /**
             * RegExp to match field-content in RFC 7230 sec 3.2
             *
             * field-content = field-vchar [ 1*( SP / HTAB ) field-vchar ]
             * field-vchar   = VCHAR / obs-text
             * obs-text      = %x80-FF
             */

            var fieldContentRegExp = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;

            /**
             * RegExp to match Same-Site cookie attribute value.
             */

            var SAME_SITE_REGEXP = /^(?:lax|none|strict)$/i;

            function Cookies(request, response, options) {
                if (!(this instanceof Cookies)) return new Cookies(request, response, options);

                this.secure = undefined;
                this.request = request;
                this.response = response;

                if (options) {
                    if (Array.isArray(options)) {
                        // array of key strings
                        deprecate('"keys" argument; provide using options {"keys": [...]}');
                        this.keys = new Keygrip(options);
                    } else if (options.constructor && options.constructor.name === 'Keygrip') {
                        // any keygrip constructor to allow different versions
                        deprecate('"keys" argument; provide using options {"keys": keygrip}');
                        this.keys = options;
                    } else {
                        this.keys = Array.isArray(options.keys) ? new Keygrip(options.keys) : options.keys;
                        this.secure = options.secure;
                    }
                }
            }

            Cookies.prototype.get = function(name, opts) {
                var sigName = name + '.sig',
                    header,
                    match,
                    value,
                    remote,
                    data,
                    index,
                    signed = opts && opts.signed !== undefined ? opts.signed : !!this.keys;

                header = this.request.headers['cookie'];
                if (!header) return;

                match = header.match(getPattern(name));
                if (!match) return;

                value = match[1];
                if (!opts || !signed) return value;

                remote = this.get(sigName);
                if (!remote) return;

                data = name + '=' + value;
                if (!this.keys) throw new Error('.keys required for signed cookies');
                index = this.keys.index(data, remote);

                if (index < 0) {
                    this.set(sigName, null, { path: '/', signed: false });
                } else {
                    index && this.set(sigName, this.keys.sign(data), { signed: false });
                    return value;
                }
            };

            Cookies.prototype.set = function(name, value, opts) {
                var res = this.response,
                    req = this.request,
                    headers = res.getHeader('Set-Cookie') || [],
                    secure =
                        this.secure !== undefined
                            ? !!this.secure
                            : req.protocol === 'https' || req.connection.encrypted,
                    cookie = new Cookie(name, value, opts),
                    signed = opts && opts.signed !== undefined ? opts.signed : !!this.keys;

                if (typeof headers == 'string') headers = [headers];

                if (!secure && opts && opts.secure) {
                    throw new Error('Cannot send secure cookie over unencrypted connection');
                }

                cookie.secure = opts && opts.secure !== undefined ? opts.secure : secure;

                if (opts && 'secureProxy' in opts) {
                    deprecate('"secureProxy" option; use "secure" option, provide "secure" to constructor if needed');
                    cookie.secure = opts.secureProxy;
                }

                pushCookie(headers, cookie);

                if (opts && signed) {
                    if (!this.keys) throw new Error('.keys required for signed cookies');
                    cookie.value = this.keys.sign(cookie.toString());
                    cookie.name += '.sig';
                    pushCookie(headers, cookie);
                }

                var setHeader = res.set ? http.OutgoingMessage.prototype.setHeader : res.setHeader;
                setHeader.call(res, 'Set-Cookie', headers);
                return this;
            };

            function Cookie(name, value, attrs) {
                if (!fieldContentRegExp.test(name)) {
                    throw new TypeError('argument name is invalid');
                }

                if (value && !fieldContentRegExp.test(value)) {
                    throw new TypeError('argument value is invalid');
                }

                this.name = name;
                this.value = value || '';

                for (var name in attrs) {
                    this[name] = attrs[name];
                }

                if (!this.value) {
                    this.expires = new Date(0);
                    this.maxAge = null;
                }

                if (this.path && !fieldContentRegExp.test(this.path)) {
                    throw new TypeError('option path is invalid');
                }

                if (this.domain && !fieldContentRegExp.test(this.domain)) {
                    throw new TypeError('option domain is invalid');
                }

                if (this.sameSite && this.sameSite !== true && !SAME_SITE_REGEXP.test(this.sameSite)) {
                    throw new TypeError('option sameSite is invalid');
                }
            }

            Cookie.prototype.path = '/';
            Cookie.prototype.expires = undefined;
            Cookie.prototype.domain = undefined;
            Cookie.prototype.httpOnly = true;
            Cookie.prototype.sameSite = false;
            Cookie.prototype.secure = false;
            Cookie.prototype.overwrite = false;

            Cookie.prototype.toString = function() {
                return this.name + '=' + this.value;
            };

            Cookie.prototype.toHeader = function() {
                var header = this.toString();

                if (this.maxAge) this.expires = new Date(Date.now() + this.maxAge);

                if (this.path) header += '; path=' + this.path;
                if (this.expires) header += '; expires=' + this.expires.toUTCString();
                if (this.domain) header += '; domain=' + this.domain;
                if (this.sameSite)
                    header += '; samesite=' + (this.sameSite === true ? 'strict' : this.sameSite.toLowerCase());
                if (this.secure) header += '; secure';
                if (this.httpOnly) header += '; httponly';

                return header;
            };

            // back-compat so maxage mirrors maxAge
            Object.defineProperty(Cookie.prototype, 'maxage', {
                configurable: true,
                enumerable: true,
                get: function() {
                    return this.maxAge;
                },
                set: function(val) {
                    return (this.maxAge = val);
                },
            });
            deprecate.property(Cookie.prototype, 'maxage', '"maxage"; use "maxAge" instead');

            function getPattern(name) {
                if (cache[name]) return cache[name];

                return (cache[name] = new RegExp(
                    '(?:^|;) *' + name.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&') + '=([^;]*)',
                ));
            }

            function pushCookie(headers, cookie) {
                if (cookie.overwrite) {
                    for (var i = headers.length - 1; i >= 0; i--) {
                        if (headers[i].indexOf(cookie.name + '=') === 0) {
                            headers.splice(i, 1);
                        }
                    }
                }

                headers.push(cookie.toHeader());
            }

            Cookies.connect = Cookies.express = function(keys) {
                return function(req, res, next) {
                    req.cookies = res.cookies = new Cookies(req, res, {
                        keys: keys,
                    });

                    next();
                };
            };

            Cookies.Cookie = Cookie;

            module.exports = Cookies;

            /***/
        },

        /***/ QWwp: /***/ function(module, exports, __webpack_require__) {
            /**
             * Detect Electron renderer process, which is node, but we should
             * treat as a browser.
             */

            if (typeof process === 'undefined' || process.type === 'renderer') {
                module.exports = __webpack_require__('NOtv');
            } else {
                module.exports = __webpack_require__('YSYp');
            }

            /***/
        },

        /***/ Qs3B: /***/ function(module, exports) {
            module.exports = require('assert');

            /***/
        },

        /***/ 'Rn+g': /***/ function(module, exports, __webpack_require__) {
            'use strict';

            var createError = __webpack_require__('LYNF');

            /**
             * Resolve or reject a Promise based on response status.
             *
             * @param {Function} resolve A function that resolves the promise.
             * @param {Function} reject A function that rejects the promise.
             * @param {object} response The response.
             */
            module.exports = function settle(resolve, reject, response) {
                var validateStatus = response.config.validateStatus;
                if (!validateStatus || validateStatus(response.status)) {
                    resolve(response);
                } else {
                    reject(
                        createError(
                            'Request failed with status code ' + response.status,
                            response.config,
                            null,
                            response.request,
                            response,
                        ),
                    );
                }
            };

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

        /***/ SgzI: /***/ function(module) {
            module.exports = JSON.parse(
                '{"_args":[["axios@0.19.2","/Users/dannydavies/Documents/tfn/fares-data-build-tool/fdbt-site"]],"_from":"axios@0.19.2","_id":"axios@0.19.2","_inBundle":false,"_integrity":"sha512-fjgm5MvRHLhx+osE2xoekY70AhARk3a6hkN+3Io1jc00jtquGvxYlKlsFUhmUET0V5te6CcZI7lcv2Ym61mjHA==","_location":"/axios","_phantomChildren":{},"_requested":{"type":"version","registry":true,"raw":"axios@0.19.2","name":"axios","escapedName":"axios","rawSpec":"0.19.2","saveSpec":null,"fetchSpec":"0.19.2"},"_requiredBy":["/","/@types/axios","/@types/moxios"],"_resolved":"https://registry.npmjs.org/axios/-/axios-0.19.2.tgz","_spec":"0.19.2","_where":"/Users/dannydavies/Documents/tfn/fares-data-build-tool/fdbt-site","author":{"name":"Matt Zabriskie"},"browser":{"./lib/adapters/http.js":"./lib/adapters/xhr.js"},"bugs":{"url":"https://github.com/axios/axios/issues"},"bundlesize":[{"path":"./dist/axios.min.js","threshold":"5kB"}],"dependencies":{"follow-redirects":"1.5.10"},"description":"Promise based HTTP client for the browser and node.js","devDependencies":{"bundlesize":"^0.17.0","coveralls":"^3.0.0","es6-promise":"^4.2.4","grunt":"^1.0.2","grunt-banner":"^0.6.0","grunt-cli":"^1.2.0","grunt-contrib-clean":"^1.1.0","grunt-contrib-watch":"^1.0.0","grunt-eslint":"^20.1.0","grunt-karma":"^2.0.0","grunt-mocha-test":"^0.13.3","grunt-ts":"^6.0.0-beta.19","grunt-webpack":"^1.0.18","istanbul-instrumenter-loader":"^1.0.0","jasmine-core":"^2.4.1","karma":"^1.3.0","karma-chrome-launcher":"^2.2.0","karma-coverage":"^1.1.1","karma-firefox-launcher":"^1.1.0","karma-jasmine":"^1.1.1","karma-jasmine-ajax":"^0.1.13","karma-opera-launcher":"^1.0.0","karma-safari-launcher":"^1.0.0","karma-sauce-launcher":"^1.2.0","karma-sinon":"^1.0.5","karma-sourcemap-loader":"^0.3.7","karma-webpack":"^1.7.0","load-grunt-tasks":"^3.5.2","minimist":"^1.2.0","mocha":"^5.2.0","sinon":"^4.5.0","typescript":"^2.8.1","url-search-params":"^0.10.0","webpack":"^1.13.1","webpack-dev-server":"^1.14.1"},"homepage":"https://github.com/axios/axios","keywords":["xhr","http","ajax","promise","node"],"license":"MIT","main":"index.js","name":"axios","repository":{"type":"git","url":"git+https://github.com/axios/axios.git"},"scripts":{"build":"NODE_ENV=production grunt build","coveralls":"cat coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js","examples":"node ./examples/server.js","fix":"eslint --fix lib/**/*.js","postversion":"git push && git push --tags","preversion":"npm test","start":"node ./sandbox/server.js","test":"grunt test && bundlesize","version":"npm run build && grunt version && git add -A dist && git add CHANGELOG.md bower.json package.json"},"typings":"./index.d.ts","version":"0.19.2"}',
            );

            /***/
        },

        /***/ Skye: /***/ function(module) {
            module.exports = JSON.parse('{"a":[]}');

            /***/
        },

        /***/ SntB: /***/ function(module, exports, __webpack_require__) {
            'use strict';

            var utils = __webpack_require__('xTJ+');

            /**
             * Config-specific merge-function which creates a new config-object
             * by merging two configuration objects together.
             *
             * @param {Object} config1
             * @param {Object} config2
             * @returns {Object} New object resulting from merging config2 to config1
             */
            module.exports = function mergeConfig(config1, config2) {
                // eslint-disable-next-line no-param-reassign
                config2 = config2 || {};
                var config = {};

                var valueFromConfig2Keys = ['url', 'method', 'params', 'data'];
                var mergeDeepPropertiesKeys = ['headers', 'auth', 'proxy'];
                var defaultToConfig2Keys = [
                    'baseURL',
                    'url',
                    'transformRequest',
                    'transformResponse',
                    'paramsSerializer',
                    'timeout',
                    'withCredentials',
                    'adapter',
                    'responseType',
                    'xsrfCookieName',
                    'xsrfHeaderName',
                    'onUploadProgress',
                    'onDownloadProgress',
                    'maxContentLength',
                    'validateStatus',
                    'maxRedirects',
                    'httpAgent',
                    'httpsAgent',
                    'cancelToken',
                    'socketPath',
                ];

                utils.forEach(valueFromConfig2Keys, function valueFromConfig2(prop) {
                    if (typeof config2[prop] !== 'undefined') {
                        config[prop] = config2[prop];
                    }
                });

                utils.forEach(mergeDeepPropertiesKeys, function mergeDeepProperties(prop) {
                    if (utils.isObject(config2[prop])) {
                        config[prop] = utils.deepMerge(config1[prop], config2[prop]);
                    } else if (typeof config2[prop] !== 'undefined') {
                        config[prop] = config2[prop];
                    } else if (utils.isObject(config1[prop])) {
                        config[prop] = utils.deepMerge(config1[prop]);
                    } else if (typeof config1[prop] !== 'undefined') {
                        config[prop] = config1[prop];
                    }
                });

                utils.forEach(defaultToConfig2Keys, function defaultToConfig2(prop) {
                    if (typeof config2[prop] !== 'undefined') {
                        config[prop] = config2[prop];
                    } else if (typeof config1[prop] !== 'undefined') {
                        config[prop] = config1[prop];
                    }
                });

                var axiosKeys = valueFromConfig2Keys.concat(mergeDeepPropertiesKeys).concat(defaultToConfig2Keys);

                var otherKeys = Object.keys(config2).filter(function filterAxiosKeys(key) {
                    return axiosKeys.indexOf(key) === -1;
                });

                utils.forEach(otherKeys, function otherKeysDefaultToConfig2(prop) {
                    if (typeof config2[prop] !== 'undefined') {
                        config[prop] = config2[prop];
                    } else if (typeof config1[prop] !== 'undefined') {
                        config[prop] = config1[prop];
                    }
                });

                return config;
            };

            /***/
        },

        /***/ U0US: /***/ function(module, exports, __webpack_require__) {
            'use strict';

            var defaultParseOptions = {
                decodeValues: true,
                map: false,
            };

            function isNonEmptyString(str) {
                return typeof str === 'string' && !!str.trim();
            }

            function parseString(setCookieValue, options) {
                var parts = setCookieValue.split(';').filter(isNonEmptyString);
                var nameValue = parts.shift().split('=');
                var name = nameValue.shift();
                var value = nameValue.join('='); // everything after the first =, joined by a "=" if there was more than one part

                options = options ? Object.assign({}, defaultParseOptions, options) : defaultParseOptions;

                var cookie = {
                    name: name, // grab everything before the first =
                    value: options.decodeValues ? decodeURIComponent(value) : value, // decode cookie value
                };

                parts.forEach(function(part) {
                    var sides = part.split('=');
                    var key = sides
                        .shift()
                        .trimLeft()
                        .toLowerCase();
                    var value = sides.join('=');
                    if (key === 'expires') {
                        cookie.expires = new Date(value);
                    } else if (key === 'max-age') {
                        cookie.maxAge = parseInt(value, 10);
                    } else if (key === 'secure') {
                        cookie.secure = true;
                    } else if (key === 'httponly') {
                        cookie.httpOnly = true;
                    } else if (key === 'samesite') {
                        cookie.sameSite = value;
                    } else {
                        cookie[key] = value;
                    }
                });

                return cookie;
            }

            function parse(input, options) {
                if (!input) {
                    return [];
                }
                if (input.headers) {
                    input =
                        // fast-path for node.js (which automatically normalizes header names to lower-case
                        input.headers['set-cookie'] ||
                        // slow-path for other environments - see #25
                        input.headers[
                            Object.keys(input.headers).find(function(key) {
                                return key.toLowerCase() === 'set-cookie';
                            })
                        ];
                }
                if (!Array.isArray(input)) {
                    input = [input];
                }

                options = options ? Object.assign({}, defaultParseOptions, options) : defaultParseOptions;

                if (!options.map) {
                    return input.filter(isNonEmptyString).map(function(str) {
                        return parseString(str, options);
                    });
                } else {
                    var cookies = {};
                    return input.filter(isNonEmptyString).reduce(function(cookies, str) {
                        var cookie = parseString(str, options);
                        cookies[cookie.name] = cookie;
                        return cookies;
                    }, cookies);
                }
            }

            /*
  Set-Cookie header field-values are sometimes comma joined in one string. This splits them without choking on commas
  that are within a single set-cookie field-value, such as in the Expires portion.

  This is uncommon, but explicitly allowed - see https://tools.ietf.org/html/rfc2616#section-4.2
  Node.js does this for every header *except* set-cookie - see https://github.com/nodejs/node/blob/d5e363b77ebaf1caf67cd7528224b651c86815c1/lib/_http_incoming.js#L128
  React Native's fetch does this for *every* header, including set-cookie.

  Based on: https://github.com/google/j2objc/commit/16820fdbc8f76ca0c33472810ce0cb03d20efe25
  Credits to: https://github.com/tomball for original and https://github.com/chrusart for JavaScript implementation
*/
            function splitCookiesString(cookiesString) {
                if (Array.isArray(cookiesString)) {
                    return cookiesString;
                }
                if (typeof cookiesString !== 'string') {
                    return [];
                }

                var cookiesStrings = [];
                var pos = 0;
                var start;
                var ch;
                var lastComma;
                var nextStart;
                var cookiesSeparatorFound;

                function skipWhitespace() {
                    while (pos < cookiesString.length && /\s/.test(cookiesString.charAt(pos))) {
                        pos += 1;
                    }
                    return pos < cookiesString.length;
                }

                function notSpecialChar() {
                    ch = cookiesString.charAt(pos);

                    return ch !== '=' && ch !== ';' && ch !== ',';
                }

                while (pos < cookiesString.length) {
                    start = pos;
                    cookiesSeparatorFound = false;

                    while (skipWhitespace()) {
                        ch = cookiesString.charAt(pos);
                        if (ch === ',') {
                            // ',' is a cookie separator if we have later first '=', not ';' or ','
                            lastComma = pos;
                            pos += 1;

                            skipWhitespace();
                            nextStart = pos;

                            while (pos < cookiesString.length && notSpecialChar()) {
                                pos += 1;
                            }

                            // currently special character
                            if (pos < cookiesString.length && cookiesString.charAt(pos) === '=') {
                                // we found cookies separator
                                cookiesSeparatorFound = true;
                                // pos is inside the next cookie, so back up and return it.
                                pos = nextStart;
                                cookiesStrings.push(cookiesString.substring(start, lastComma));
                                start = pos;
                            } else {
                                // in param ',' or param separator ';',
                                // we continue from that comma
                                pos = lastComma + 1;
                            }
                        } else {
                            pos += 1;
                        }
                    }

                    if (!cookiesSeparatorFound || pos >= cookiesString.length) {
                        cookiesStrings.push(cookiesString.substring(start, cookiesString.length));
                    }
                }

                return cookiesStrings;
            }

            module.exports = parse;
            module.exports.parse = parse;
            module.exports.parseString = parseString;
            module.exports.splitCookiesString = splitCookiesString;

            /***/
        },

        /***/ UNVE: /***/ function(module, exports) {
            module.exports = require('tty');

            /***/
        },

        /***/ UnBK: /***/ function(module, exports, __webpack_require__) {
            'use strict';

            var utils = __webpack_require__('xTJ+');
            var transformData = __webpack_require__('xAGQ');
            var isCancel = __webpack_require__('Lmem');
            var defaults = __webpack_require__('JEQr');

            /**
             * Throws a `Cancel` if cancellation has been requested.
             */
            function throwIfCancellationRequested(config) {
                if (config.cancelToken) {
                    config.cancelToken.throwIfRequested();
                }
            }

            /**
             * Dispatch a request to the server using the configured adapter.
             *
             * @param {object} config The config that is to be used for the request
             * @returns {Promise} The Promise to be fulfilled
             */
            module.exports = function dispatchRequest(config) {
                throwIfCancellationRequested(config);

                // Ensure headers exist
                config.headers = config.headers || {};

                // Transform request data
                config.data = transformData(config.data, config.headers, config.transformRequest);

                // Flatten headers
                config.headers = utils.merge(
                    config.headers.common || {},
                    config.headers[config.method] || {},
                    config.headers,
                );

                utils.forEach(['delete', 'get', 'head', 'post', 'put', 'patch', 'common'], function cleanHeaderConfig(
                    method,
                ) {
                    delete config.headers[method];
                });

                var adapter = config.adapter || defaults.adapter;

                return adapter(config).then(
                    function onAdapterResolution(response) {
                        throwIfCancellationRequested(config);

                        // Transform response data
                        response.data = transformData(response.data, response.headers, config.transformResponse);

                        return response;
                    },
                    function onAdapterRejection(reason) {
                        if (!isCancel(reason)) {
                            throwIfCancellationRequested(config);

                            // Transform response data
                            if (reason && reason.response) {
                                reason.response.data = transformData(
                                    reason.response.data,
                                    reason.response.headers,
                                    config.transformResponse,
                                );
                            }
                        }

                        return Promise.reject(reason);
                    },
                );
            };

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

        /***/ X5QW: /***/ function(module, exports, __webpack_require__) {
            'use strict';

            module.exports = (flag, argv) => {
                argv = argv || process.argv;
                const prefix = flag.startsWith('-') ? '' : flag.length === 1 ? '-' : '--';
                const pos = argv.indexOf(prefix + flag);
                const terminatorPos = argv.indexOf('--');
                return pos !== -1 && (terminatorPos === -1 ? true : pos < terminatorPos);
            };

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

        /***/ YSYp: /***/ function(module, exports, __webpack_require__) {
            /**
             * Module dependencies.
             */

            var tty = __webpack_require__('UNVE');
            var util = __webpack_require__('jK02');

            /**
             * This is the Node.js implementation of `debug()`.
             *
             * Expose `debug()` as the module.
             */

            exports = module.exports = __webpack_require__('lv48');
            exports.init = init;
            exports.log = log;
            exports.formatArgs = formatArgs;
            exports.save = save;
            exports.load = load;
            exports.useColors = useColors;

            /**
             * Colors.
             */

            exports.colors = [6, 2, 3, 4, 5, 1];

            try {
                var supportsColor = __webpack_require__('bAum');
                if (supportsColor && supportsColor.level >= 2) {
                    exports.colors = [
                        20,
                        21,
                        26,
                        27,
                        32,
                        33,
                        38,
                        39,
                        40,
                        41,
                        42,
                        43,
                        44,
                        45,
                        56,
                        57,
                        62,
                        63,
                        68,
                        69,
                        74,
                        75,
                        76,
                        77,
                        78,
                        79,
                        80,
                        81,
                        92,
                        93,
                        98,
                        99,
                        112,
                        113,
                        128,
                        129,
                        134,
                        135,
                        148,
                        149,
                        160,
                        161,
                        162,
                        163,
                        164,
                        165,
                        166,
                        167,
                        168,
                        169,
                        170,
                        171,
                        172,
                        173,
                        178,
                        179,
                        184,
                        185,
                        196,
                        197,
                        198,
                        199,
                        200,
                        201,
                        202,
                        203,
                        204,
                        205,
                        206,
                        207,
                        208,
                        209,
                        214,
                        215,
                        220,
                        221,
                    ];
                }
            } catch (err) {
                // swallow - we only care if `supports-color` is available; it doesn't have to be.
            }

            /**
             * Build up the default `inspectOpts` object from the environment variables.
             *
             *   $ DEBUG_COLORS=no DEBUG_DEPTH=10 DEBUG_SHOW_HIDDEN=enabled node script.js
             */

            exports.inspectOpts = Object.keys(process.env)
                .filter(function(key) {
                    return /^debug_/i.test(key);
                })
                .reduce(function(obj, key) {
                    // camel-case
                    var prop = key
                        .substring(6)
                        .toLowerCase()
                        .replace(/_([a-z])/g, function(_, k) {
                            return k.toUpperCase();
                        });

                    // coerce string value into JS value
                    var val = process.env[key];
                    if (/^(yes|on|true|enabled)$/i.test(val)) val = true;
                    else if (/^(no|off|false|disabled)$/i.test(val)) val = false;
                    else if (val === 'null') val = null;
                    else val = Number(val);

                    obj[prop] = val;
                    return obj;
                }, {});

            /**
             * Is stdout a TTY? Colored output is enabled when `true`.
             */

            function useColors() {
                return 'colors' in exports.inspectOpts
                    ? Boolean(exports.inspectOpts.colors)
                    : tty.isatty(process.stderr.fd);
            }

            /**
             * Map %o to `util.inspect()`, all on a single line.
             */

            exports.formatters.o = function(v) {
                this.inspectOpts.colors = this.useColors;
                return util
                    .inspect(v, this.inspectOpts)
                    .split('\n')
                    .map(function(str) {
                        return str.trim();
                    })
                    .join(' ');
            };

            /**
             * Map %o to `util.inspect()`, allowing multiple lines if needed.
             */

            exports.formatters.O = function(v) {
                this.inspectOpts.colors = this.useColors;
                return util.inspect(v, this.inspectOpts);
            };

            /**
             * Adds ANSI color escape codes if enabled.
             *
             * @api public
             */

            function formatArgs(args) {
                var name = this.namespace;
                var useColors = this.useColors;

                if (useColors) {
                    var c = this.color;
                    var colorCode = '\u001b[3' + (c < 8 ? c : '8;5;' + c);
                    var prefix = '  ' + colorCode + ';1m' + name + ' ' + '\u001b[0m';

                    args[0] = prefix + args[0].split('\n').join('\n' + prefix);
                    args.push(colorCode + 'm+' + exports.humanize(this.diff) + '\u001b[0m');
                } else {
                    args[0] = getDate() + name + ' ' + args[0];
                }
            }

            function getDate() {
                if (exports.inspectOpts.hideDate) {
                    return '';
                } else {
                    return new Date().toISOString() + ' ';
                }
            }

            /**
             * Invokes `util.format()` with the specified arguments and writes to stderr.
             */

            function log() {
                return process.stderr.write(util.format.apply(util, arguments) + '\n');
            }

            /**
             * Save `namespaces`.
             *
             * @param {String} namespaces
             * @api private
             */

            function save(namespaces) {
                if (null == namespaces) {
                    // If you set a process.env field to null or undefined, it gets cast to the
                    // string 'null' or 'undefined'. Just delete instead.
                    delete process.env.DEBUG;
                } else {
                    process.env.DEBUG = namespaces;
                }
            }

            /**
             * Load `namespaces`.
             *
             * @return {String} returns the previously persisted debug modes
             * @api private
             */

            function load() {
                return process.env.DEBUG;
            }

            /**
             * Init logic for `debug` instances.
             *
             * Create a new `inspectOpts` object in case `useColors` is set
             * differently for a particular `debug` instance.
             */

            function init(debug) {
                debug.inspectOpts = {};

                var keys = Object.keys(exports.inspectOpts);
                for (var i = 0; i < keys.length; i++) {
                    debug.inspectOpts[keys[i]] = exports.inspectOpts[keys[i]];
                }
            }

            /**
             * Enable namespaces listed in `process.env.DEBUG` initially.
             */

            exports.enable(load());

            /***/
        },

        /***/ bAum: /***/ function(module, exports, __webpack_require__) {
            'use strict';

            const os = __webpack_require__('jle/');
            const hasFlag = __webpack_require__('X5QW');

            const env = process.env;

            let forceColor;
            if (hasFlag('no-color') || hasFlag('no-colors') || hasFlag('color=false')) {
                forceColor = false;
            } else if (hasFlag('color') || hasFlag('colors') || hasFlag('color=true') || hasFlag('color=always')) {
                forceColor = true;
            }
            if ('FORCE_COLOR' in env) {
                forceColor = env.FORCE_COLOR.length === 0 || parseInt(env.FORCE_COLOR, 10) !== 0;
            }

            function translateLevel(level) {
                if (level === 0) {
                    return false;
                }

                return {
                    level,
                    hasBasic: true,
                    has256: level >= 2,
                    has16m: level >= 3,
                };
            }

            function supportsColor(stream) {
                if (forceColor === false) {
                    return 0;
                }

                if (hasFlag('color=16m') || hasFlag('color=full') || hasFlag('color=truecolor')) {
                    return 3;
                }

                if (hasFlag('color=256')) {
                    return 2;
                }

                if (stream && !stream.isTTY && forceColor !== true) {
                    return 0;
                }

                const min = forceColor ? 1 : 0;

                if (process.platform === 'win32') {
                    // Node.js 7.5.0 is the first version of Node.js to include a patch to
                    // libuv that enables 256 color output on Windows. Anything earlier and it
                    // won't work. However, here we target Node.js 8 at minimum as it is an LTS
                    // release, and Node.js 7 is not. Windows 10 build 10586 is the first Windows
                    // release that supports 256 colors. Windows 10 build 14931 is the first release
                    // that supports 16m/TrueColor.
                    const osRelease = os.release().split('.');
                    if (
                        Number(process.versions.node.split('.')[0]) >= 8 &&
                        Number(osRelease[0]) >= 10 &&
                        Number(osRelease[2]) >= 10586
                    ) {
                        return Number(osRelease[2]) >= 14931 ? 3 : 2;
                    }

                    return 1;
                }

                if ('CI' in env) {
                    if (
                        ['TRAVIS', 'CIRCLECI', 'APPVEYOR', 'GITLAB_CI'].some(sign => sign in env) ||
                        env.CI_NAME === 'codeship'
                    ) {
                        return 1;
                    }

                    return min;
                }

                if ('TEAMCITY_VERSION' in env) {
                    return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0;
                }

                if (env.COLORTERM === 'truecolor') {
                    return 3;
                }

                if ('TERM_PROGRAM' in env) {
                    const version = parseInt((env.TERM_PROGRAM_VERSION || '').split('.')[0], 10);

                    switch (env.TERM_PROGRAM) {
                        case 'iTerm.app':
                            return version >= 3 ? 3 : 2;
                        case 'Apple_Terminal':
                            return 2;
                        // No default
                    }
                }

                if (/-256(color)?$/i.test(env.TERM)) {
                    return 2;
                }

                if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(env.TERM)) {
                    return 1;
                }

                if ('COLORTERM' in env) {
                    return 1;
                }

                if (env.TERM === 'dumb') {
                    return min;
                }

                return min;
            }

            function getSupportLevel(stream) {
                const level = supportsColor(stream);
                return translateLevel(level);
            }

            module.exports = {
                supportsColor: getSupportLevel,
                stdout: getSupportLevel(process.stdout),
                stderr: getSupportLevel(process.stderr),
            };

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

        /***/ endd: /***/ function(module, exports, __webpack_require__) {
            'use strict';

            /**
             * A `Cancel` is an object that is thrown when an operation is canceled.
             *
             * @class
             * @param {string=} message The message.
             */
            function Cancel(message) {
                this.message = message;
            }

            Cancel.prototype.toString = function toString() {
                return 'Cancel' + (this.message ? ': ' + this.message : '');
            };

            Cancel.prototype.__CANCEL__ = true;

            module.exports = Cancel;

            /***/
        },

        /***/ eqyj: /***/ function(module, exports, __webpack_require__) {
            'use strict';

            var utils = __webpack_require__('xTJ+');

            module.exports = utils.isStandardBrowserEnv()
                ? // Standard browser envs support document.cookie
                  (function standardBrowserEnv() {
                      return {
                          write: function write(name, value, expires, path, domain, secure) {
                              var cookie = [];
                              cookie.push(name + '=' + encodeURIComponent(value));

                              if (utils.isNumber(expires)) {
                                  cookie.push('expires=' + new Date(expires).toGMTString());
                              }

                              if (utils.isString(path)) {
                                  cookie.push('path=' + path);
                              }

                              if (utils.isString(domain)) {
                                  cookie.push('domain=' + domain);
                              }

                              if (secure === true) {
                                  cookie.push('secure');
                              }

                              document.cookie = cookie.join('; ');
                          },

                          read: function read(name) {
                              var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
                              return match ? decodeURIComponent(match[3]) : null;
                          },

                          remove: function remove(name) {
                              this.write(name, '', Date.now() - 86400000);
                          },
                      };
                  })()
                : // Non standard browser env (web workers, react-native) lack needed support.
                  (function nonStandardBrowserEnv() {
                      return {
                          write: function write() {},
                          read: function read() {
                              return null;
                          },
                          remove: function remove() {},
                      };
                  })();

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

        /***/ f06u: /***/ function(module, exports, __webpack_require__) {
            'use strict';
            /*!
             * keygrip
             * Copyright(c) 2011-2014 Jed Schmidt
             * MIT Licensed
             */

            var compare = __webpack_require__('DizN');
            var crypto = __webpack_require__('PJMN');

            function Keygrip(keys, algorithm, encoding) {
                if (!algorithm) algorithm = 'sha1';
                if (!encoding) encoding = 'base64';
                if (!(this instanceof Keygrip)) return new Keygrip(keys, algorithm, encoding);

                if (!keys || !(0 in keys)) {
                    throw new Error('Keys must be provided.');
                }

                function sign(data, key) {
                    return crypto
                        .createHmac(algorithm, key)
                        .update(data)
                        .digest(encoding)
                        .replace(/\/|\+|=/g, function(x) {
                            return { '/': '_', '+': '-', '=': '' }[x];
                        });
                }

                this.sign = function(data) {
                    return sign(data, keys[0]);
                };

                this.verify = function(data, digest) {
                    return this.index(data, digest) > -1;
                };

                this.index = function(data, digest) {
                    for (var i = 0, l = keys.length; i < l; i++) {
                        if (compare(digest, sign(data, keys[i]))) {
                            return i;
                        }
                    }

                    return -1;
                };
            }

            Keygrip.sign = Keygrip.verify = Keygrip.index = function() {
                throw new Error("Usage: require('keygrip')(<array-of-keys>)");
            };

            module.exports = Keygrip;

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

        /***/ g7np: /***/ function(module, exports, __webpack_require__) {
            'use strict';

            var isAbsoluteURL = __webpack_require__('2SVd');
            var combineURLs = __webpack_require__('5oMp');

            /**
             * Creates a new URL by combining the baseURL with the requestedURL,
             * only when the requestedURL is not already an absolute URL.
             * If the requestURL is absolute, this function returns the requestedURL untouched.
             *
             * @param {string} baseURL The base URL
             * @param {string} requestedURL Absolute or relative URL to combine
             * @returns {string} The combined full path
             */
            module.exports = function buildFullPath(baseURL, requestedURL) {
                if (baseURL && !isAbsoluteURL(requestedURL)) {
                    return combineURLs(baseURL, requestedURL);
                }
                return requestedURL;
            };

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

        /***/ 'iVi/': /***/ function(module, exports, __webpack_require__) {
            'use strict';
            /*!
             * cookie
             * Copyright(c) 2012-2014 Roman Shtylman
             * Copyright(c) 2015 Douglas Christopher Wilson
             * MIT Licensed
             */

            /**
             * Module exports.
             * @public
             */

            exports.parse = parse;
            exports.serialize = serialize;

            /**
             * Module variables.
             * @private
             */

            var decode = decodeURIComponent;
            var encode = encodeURIComponent;
            var pairSplitRegExp = /; */;

            /**
             * RegExp to match field-content in RFC 7230 sec 3.2
             *
             * field-content = field-vchar [ 1*( SP / HTAB ) field-vchar ]
             * field-vchar   = VCHAR / obs-text
             * obs-text      = %x80-FF
             */

            var fieldContentRegExp = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;

            /**
             * Parse a cookie header.
             *
             * Parse the given cookie header string into an object
             * The object has the various cookies as keys(names) => values
             *
             * @param {string} str
             * @param {object} [options]
             * @return {object}
             * @public
             */

            function parse(str, options) {
                if (typeof str !== 'string') {
                    throw new TypeError('argument str must be a string');
                }

                var obj = {};
                var opt = options || {};
                var pairs = str.split(pairSplitRegExp);
                var dec = opt.decode || decode;

                for (var i = 0; i < pairs.length; i++) {
                    var pair = pairs[i];
                    var eq_idx = pair.indexOf('=');

                    // skip things that don't look like key=value
                    if (eq_idx < 0) {
                        continue;
                    }

                    var key = pair.substr(0, eq_idx).trim();
                    var val = pair.substr(++eq_idx, pair.length).trim();

                    // quoted values
                    if ('"' == val[0]) {
                        val = val.slice(1, -1);
                    }

                    // only assign once
                    if (undefined == obj[key]) {
                        obj[key] = tryDecode(val, dec);
                    }
                }

                return obj;
            }

            /**
             * Serialize data into a cookie header.
             *
             * Serialize the a name value pair into a cookie string suitable for
             * http headers. An optional options object specified cookie parameters.
             *
             * serialize('foo', 'bar', { httpOnly: true })
             *   => "foo=bar; httpOnly"
             *
             * @param {string} name
             * @param {string} val
             * @param {object} [options]
             * @return {string}
             * @public
             */

            function serialize(name, val, options) {
                var opt = options || {};
                var enc = opt.encode || encode;

                if (typeof enc !== 'function') {
                    throw new TypeError('option encode is invalid');
                }

                if (!fieldContentRegExp.test(name)) {
                    throw new TypeError('argument name is invalid');
                }

                var value = enc(val);

                if (value && !fieldContentRegExp.test(value)) {
                    throw new TypeError('argument val is invalid');
                }

                var str = name + '=' + value;

                if (null != opt.maxAge) {
                    var maxAge = opt.maxAge - 0;
                    if (isNaN(maxAge)) throw new Error('maxAge should be a Number');
                    str += '; Max-Age=' + Math.floor(maxAge);
                }

                if (opt.domain) {
                    if (!fieldContentRegExp.test(opt.domain)) {
                        throw new TypeError('option domain is invalid');
                    }

                    str += '; Domain=' + opt.domain;
                }

                if (opt.path) {
                    if (!fieldContentRegExp.test(opt.path)) {
                        throw new TypeError('option path is invalid');
                    }

                    str += '; Path=' + opt.path;
                }

                if (opt.expires) {
                    if (typeof opt.expires.toUTCString !== 'function') {
                        throw new TypeError('option expires is invalid');
                    }

                    str += '; Expires=' + opt.expires.toUTCString();
                }

                if (opt.httpOnly) {
                    str += '; HttpOnly';
                }

                if (opt.secure) {
                    str += '; Secure';
                }

                if (opt.sameSite) {
                    var sameSite = typeof opt.sameSite === 'string' ? opt.sameSite.toLowerCase() : opt.sameSite;

                    switch (sameSite) {
                        case true:
                            str += '; SameSite=Strict';
                            break;
                        case 'lax':
                            str += '; SameSite=Lax';
                            break;
                        case 'strict':
                            str += '; SameSite=Strict';
                            break;
                        case 'none':
                            str += '; SameSite=None';
                            break;
                        default:
                            throw new TypeError('option sameSite is invalid');
                    }
                }

                return str;
            }

            /**
             * Try decoding a string using a decoding function.
             *
             * @param {string} str
             * @param {function} decode
             * @private
             */

            function tryDecode(str, decode) {
                try {
                    return decode(str);
                } catch (e) {
                    return str;
                }
            }

            /***/
        },

        /***/ jK02: /***/ function(module, exports) {
            module.exports = require('util');

            /***/
        },

        /***/ 'jfS+': /***/ function(module, exports, __webpack_require__) {
            'use strict';

            var Cancel = __webpack_require__('endd');

            /**
             * A `CancelToken` is an object that can be used to request cancellation of an operation.
             *
             * @class
             * @param {Function} executor The executor function.
             */
            function CancelToken(executor) {
                if (typeof executor !== 'function') {
                    throw new TypeError('executor must be a function.');
                }

                var resolvePromise;
                this.promise = new Promise(function promiseExecutor(resolve) {
                    resolvePromise = resolve;
                });

                var token = this;
                executor(function cancel(message) {
                    if (token.reason) {
                        // Cancellation has already been requested
                        return;
                    }

                    token.reason = new Cancel(message);
                    resolvePromise(token.reason);
                });
            }

            /**
             * Throws a `Cancel` if cancellation has been requested.
             */
            CancelToken.prototype.throwIfRequested = function throwIfRequested() {
                if (this.reason) {
                    throw this.reason;
                }
            };

            /**
             * Returns an object that contains a new `CancelToken` and a function that, when called,
             * cancels the `CancelToken`.
             */
            CancelToken.source = function source() {
                var cancel;
                var token = new CancelToken(function executor(c) {
                    cancel = c;
                });
                return {
                    token: token,
                    cancel: cancel,
                };
            };

            module.exports = CancelToken;

            /***/
        },

        /***/ 'jle/': /***/ function(module, exports) {
            module.exports = require('os');

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

        /***/ lv48: /***/ function(module, exports, __webpack_require__) {
            /**
             * This is the common logic for both the Node.js and web browser
             * implementations of `debug()`.
             *
             * Expose `debug()` as the module.
             */

            exports = module.exports = createDebug.debug = createDebug['default'] = createDebug;
            exports.coerce = coerce;
            exports.disable = disable;
            exports.enable = enable;
            exports.enabled = enabled;
            exports.humanize = __webpack_require__('FGiv');

            /**
             * Active `debug` instances.
             */
            exports.instances = [];

            /**
             * The currently active debug mode names, and names to skip.
             */

            exports.names = [];
            exports.skips = [];

            /**
             * Map of special "%n" handling functions, for the debug "format" argument.
             *
             * Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
             */

            exports.formatters = {};

            /**
             * Select a color.
             * @param {String} namespace
             * @return {Number}
             * @api private
             */

            function selectColor(namespace) {
                var hash = 0,
                    i;

                for (i in namespace) {
                    hash = (hash << 5) - hash + namespace.charCodeAt(i);
                    hash |= 0; // Convert to 32bit integer
                }

                return exports.colors[Math.abs(hash) % exports.colors.length];
            }

            /**
             * Create a debugger with the given `namespace`.
             *
             * @param {String} namespace
             * @return {Function}
             * @api public
             */

            function createDebug(namespace) {
                var prevTime;

                function debug() {
                    // disabled?
                    if (!debug.enabled) return;

                    var self = debug;

                    // set `diff` timestamp
                    var curr = +new Date();
                    var ms = curr - (prevTime || curr);
                    self.diff = ms;
                    self.prev = prevTime;
                    self.curr = curr;
                    prevTime = curr;

                    // turn the `arguments` into a proper Array
                    var args = new Array(arguments.length);
                    for (var i = 0; i < args.length; i++) {
                        args[i] = arguments[i];
                    }

                    args[0] = exports.coerce(args[0]);

                    if ('string' !== typeof args[0]) {
                        // anything else let's inspect with %O
                        args.unshift('%O');
                    }

                    // apply any `formatters` transformations
                    var index = 0;
                    args[0] = args[0].replace(/%([a-zA-Z%])/g, function(match, format) {
                        // if we encounter an escaped % then don't increase the array index
                        if (match === '%%') return match;
                        index++;
                        var formatter = exports.formatters[format];
                        if ('function' === typeof formatter) {
                            var val = args[index];
                            match = formatter.call(self, val);

                            // now we need to remove `args[index]` since it's inlined in the `format`
                            args.splice(index, 1);
                            index--;
                        }
                        return match;
                    });

                    // apply env-specific formatting (colors, etc.)
                    exports.formatArgs.call(self, args);

                    var logFn = debug.log || exports.log || console.log.bind(console);
                    logFn.apply(self, args);
                }

                debug.namespace = namespace;
                debug.enabled = exports.enabled(namespace);
                debug.useColors = exports.useColors();
                debug.color = selectColor(namespace);
                debug.destroy = destroy;

                // env-specific initialization logic for debug instances
                if ('function' === typeof exports.init) {
                    exports.init(debug);
                }

                exports.instances.push(debug);

                return debug;
            }

            function destroy() {
                var index = exports.instances.indexOf(this);
                if (index !== -1) {
                    exports.instances.splice(index, 1);
                    return true;
                } else {
                    return false;
                }
            }

            /**
             * Enables a debug mode by namespaces. This can include modes
             * separated by a colon and wildcards.
             *
             * @param {String} namespaces
             * @api public
             */

            function enable(namespaces) {
                exports.save(namespaces);

                exports.names = [];
                exports.skips = [];

                var i;
                var split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
                var len = split.length;

                for (i = 0; i < len; i++) {
                    if (!split[i]) continue; // ignore empty strings
                    namespaces = split[i].replace(/\*/g, '.*?');
                    if (namespaces[0] === '-') {
                        exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
                    } else {
                        exports.names.push(new RegExp('^' + namespaces + '$'));
                    }
                }

                for (i = 0; i < exports.instances.length; i++) {
                    var instance = exports.instances[i];
                    instance.enabled = exports.enabled(instance.namespace);
                }
            }

            /**
             * Disable debug output.
             *
             * @api public
             */

            function disable() {
                exports.enable('');
            }

            /**
             * Returns true if the given mode name is enabled, false otherwise.
             *
             * @param {String} name
             * @return {Boolean}
             * @api public
             */

            function enabled(name) {
                if (name[name.length - 1] === '*') {
                    return true;
                }
                var i, len;
                for (i = 0, len = exports.skips.length; i < len; i++) {
                    if (exports.skips[i].test(name)) {
                        return false;
                    }
                }
                for (i = 0, len = exports.names.length; i < len; i++) {
                    if (exports.names[i].test(name)) {
                        return true;
                    }
                }
                return false;
            }

            /**
             * Coerce `val`.
             *
             * @param {Mixed} val
             * @return {Mixed}
             * @api private
             */

            function coerce(val) {
                if (val instanceof Error) return val.stack || val.message;
                return val;
            }

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

        /***/ maZv: /***/ function(module, exports, __webpack_require__) {
            'use strict';

            var utils = __webpack_require__('xTJ+');
            var settle = __webpack_require__('Rn+g');
            var buildFullPath = __webpack_require__('g7np');
            var buildURL = __webpack_require__('MLWZ');
            var http = __webpack_require__('KEll');
            var https = __webpack_require__('7WL4');
            var httpFollow = __webpack_require__('05og').http;
            var httpsFollow = __webpack_require__('05og').https;
            var url = __webpack_require__('bzos');
            var zlib = __webpack_require__('FMKJ');
            var pkg = __webpack_require__('SgzI');
            var createError = __webpack_require__('LYNF');
            var enhanceError = __webpack_require__('OH9c');

            var isHttps = /https:?/;

            /*eslint consistent-return:0*/
            module.exports = function httpAdapter(config) {
                return new Promise(function dispatchHttpRequest(resolvePromise, rejectPromise) {
                    var resolve = function resolve(value) {
                        resolvePromise(value);
                    };
                    var reject = function reject(value) {
                        rejectPromise(value);
                    };
                    var data = config.data;
                    var headers = config.headers;

                    // Set User-Agent (required by some servers)
                    // Only set header if it hasn't been set in config
                    // See https://github.com/axios/axios/issues/69
                    if (!headers['User-Agent'] && !headers['user-agent']) {
                        headers['User-Agent'] = 'axios/' + pkg.version;
                    }

                    if (data && !utils.isStream(data)) {
                        if (Buffer.isBuffer(data)) {
                            // Nothing to do...
                        } else if (utils.isArrayBuffer(data)) {
                            data = Buffer.from(new Uint8Array(data));
                        } else if (utils.isString(data)) {
                            data = Buffer.from(data, 'utf-8');
                        } else {
                            return reject(
                                createError(
                                    'Data after transformation must be a string, an ArrayBuffer, a Buffer, or a Stream',
                                    config,
                                ),
                            );
                        }

                        // Add Content-Length header if data exists
                        headers['Content-Length'] = data.length;
                    }

                    // HTTP basic authentication
                    var auth = undefined;
                    if (config.auth) {
                        var username = config.auth.username || '';
                        var password = config.auth.password || '';
                        auth = username + ':' + password;
                    }

                    // Parse url
                    var fullPath = buildFullPath(config.baseURL, config.url);
                    var parsed = url.parse(fullPath);
                    var protocol = parsed.protocol || 'http:';

                    if (!auth && parsed.auth) {
                        var urlAuth = parsed.auth.split(':');
                        var urlUsername = urlAuth[0] || '';
                        var urlPassword = urlAuth[1] || '';
                        auth = urlUsername + ':' + urlPassword;
                    }

                    if (auth) {
                        delete headers.Authorization;
                    }

                    var isHttpsRequest = isHttps.test(protocol);
                    var agent = isHttpsRequest ? config.httpsAgent : config.httpAgent;

                    var options = {
                        path: buildURL(parsed.path, config.params, config.paramsSerializer).replace(/^\?/, ''),
                        method: config.method.toUpperCase(),
                        headers: headers,
                        agent: agent,
                        agents: { http: config.httpAgent, https: config.httpsAgent },
                        auth: auth,
                    };

                    if (config.socketPath) {
                        options.socketPath = config.socketPath;
                    } else {
                        options.hostname = parsed.hostname;
                        options.port = parsed.port;
                    }

                    var proxy = config.proxy;
                    if (!proxy && proxy !== false) {
                        var proxyEnv = protocol.slice(0, -1) + '_proxy';
                        var proxyUrl = process.env[proxyEnv] || process.env[proxyEnv.toUpperCase()];
                        if (proxyUrl) {
                            var parsedProxyUrl = url.parse(proxyUrl);
                            var noProxyEnv = process.env.no_proxy || process.env.NO_PROXY;
                            var shouldProxy = true;

                            if (noProxyEnv) {
                                var noProxy = noProxyEnv.split(',').map(function trim(s) {
                                    return s.trim();
                                });

                                shouldProxy = !noProxy.some(function proxyMatch(proxyElement) {
                                    if (!proxyElement) {
                                        return false;
                                    }
                                    if (proxyElement === '*') {
                                        return true;
                                    }
                                    if (
                                        proxyElement[0] === '.' &&
                                        parsed.hostname.substr(parsed.hostname.length - proxyElement.length) ===
                                            proxyElement
                                    ) {
                                        return true;
                                    }

                                    return parsed.hostname === proxyElement;
                                });
                            }

                            if (shouldProxy) {
                                proxy = {
                                    host: parsedProxyUrl.hostname,
                                    port: parsedProxyUrl.port,
                                };

                                if (parsedProxyUrl.auth) {
                                    var proxyUrlAuth = parsedProxyUrl.auth.split(':');
                                    proxy.auth = {
                                        username: proxyUrlAuth[0],
                                        password: proxyUrlAuth[1],
                                    };
                                }
                            }
                        }
                    }

                    if (proxy) {
                        options.hostname = proxy.host;
                        options.host = proxy.host;
                        options.headers.host = parsed.hostname + (parsed.port ? ':' + parsed.port : '');
                        options.port = proxy.port;
                        options.path =
                            protocol + '//' + parsed.hostname + (parsed.port ? ':' + parsed.port : '') + options.path;

                        // Basic proxy authorization
                        if (proxy.auth) {
                            var base64 = Buffer.from(proxy.auth.username + ':' + proxy.auth.password, 'utf8').toString(
                                'base64',
                            );
                            options.headers['Proxy-Authorization'] = 'Basic ' + base64;
                        }
                    }

                    var transport;
                    var isHttpsProxy = isHttpsRequest && (proxy ? isHttps.test(proxy.protocol) : true);
                    if (config.transport) {
                        transport = config.transport;
                    } else if (config.maxRedirects === 0) {
                        transport = isHttpsProxy ? https : http;
                    } else {
                        if (config.maxRedirects) {
                            options.maxRedirects = config.maxRedirects;
                        }
                        transport = isHttpsProxy ? httpsFollow : httpFollow;
                    }

                    if (config.maxContentLength && config.maxContentLength > -1) {
                        options.maxBodyLength = config.maxContentLength;
                    }

                    // Create the request
                    var req = transport.request(options, function handleResponse(res) {
                        if (req.aborted) return;

                        // uncompress the response body transparently if required
                        var stream = res;
                        switch (res.headers['content-encoding']) {
                            /*eslint default-case:0*/
                            case 'gzip':
                            case 'compress':
                            case 'deflate':
                                // add the unzipper to the body stream processing pipeline
                                stream = res.statusCode === 204 ? stream : stream.pipe(zlib.createUnzip());

                                // remove the content-encoding in order to not confuse downstream operations
                                delete res.headers['content-encoding'];
                                break;
                        }

                        // return the last request in case of redirects
                        var lastRequest = res.req || req;

                        var response = {
                            status: res.statusCode,
                            statusText: res.statusMessage,
                            headers: res.headers,
                            config: config,
                            request: lastRequest,
                        };

                        if (config.responseType === 'stream') {
                            response.data = stream;
                            settle(resolve, reject, response);
                        } else {
                            var responseBuffer = [];
                            stream.on('data', function handleStreamData(chunk) {
                                responseBuffer.push(chunk);

                                // make sure the content length is not over the maxContentLength if specified
                                if (
                                    config.maxContentLength > -1 &&
                                    Buffer.concat(responseBuffer).length > config.maxContentLength
                                ) {
                                    stream.destroy();
                                    reject(
                                        createError(
                                            'maxContentLength size of ' + config.maxContentLength + ' exceeded',
                                            config,
                                            null,
                                            lastRequest,
                                        ),
                                    );
                                }
                            });

                            stream.on('error', function handleStreamError(err) {
                                if (req.aborted) return;
                                reject(enhanceError(err, config, null, lastRequest));
                            });

                            stream.on('end', function handleStreamEnd() {
                                var responseData = Buffer.concat(responseBuffer);
                                if (config.responseType !== 'arraybuffer') {
                                    responseData = responseData.toString(config.responseEncoding);
                                }

                                response.data = responseData;
                                settle(resolve, reject, response);
                            });
                        }
                    });

                    // Handle errors
                    req.on('error', function handleRequestError(err) {
                        if (req.aborted) return;
                        reject(enhanceError(err, config, null, req));
                    });

                    // Handle request timeout
                    if (config.timeout) {
                        // Sometime, the response will be very slow, and does not respond, the connect event will be block by event loop system.
                        // And timer callback will be fired, and abort() will be invoked before connection, then get "socket hang up" and code ECONNRESET.
                        // At this time, if we have a large number of request, nodejs will hang up some socket on background. and the number will up and up.
                        // And then these socket which be hang up will devoring CPU little by little.
                        // ClientRequest.setTimeout will be fired on the specify milliseconds, and can make sure that abort() will be fired after connect.
                        req.setTimeout(config.timeout, function handleRequestTimeout() {
                            req.abort();
                            reject(
                                createError(
                                    'timeout of ' + config.timeout + 'ms exceeded',
                                    config,
                                    'ECONNABORTED',
                                    req,
                                ),
                            );
                        });
                    }

                    if (config.cancelToken) {
                        // Handle cancellation
                        config.cancelToken.promise.then(function onCanceled(cancel) {
                            if (req.aborted) return;

                            req.abort();
                            reject(cancel);
                        });
                    }

                    // Send the request
                    if (utils.isStream(data)) {
                        data.on('error', function handleStreamError(err) {
                            reject(enhanceError(err, config, null, req));
                        }).pipe(req);
                    } else {
                        req.end(data);
                    }
                });
            };

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

        /***/ tQ2B: /***/ function(module, exports, __webpack_require__) {
            'use strict';

            var utils = __webpack_require__('xTJ+');
            var settle = __webpack_require__('Rn+g');
            var buildURL = __webpack_require__('MLWZ');
            var buildFullPath = __webpack_require__('g7np');
            var parseHeaders = __webpack_require__('w0Vi');
            var isURLSameOrigin = __webpack_require__('OTTw');
            var createError = __webpack_require__('LYNF');

            module.exports = function xhrAdapter(config) {
                return new Promise(function dispatchXhrRequest(resolve, reject) {
                    var requestData = config.data;
                    var requestHeaders = config.headers;

                    if (utils.isFormData(requestData)) {
                        delete requestHeaders['Content-Type']; // Let the browser set it
                    }

                    var request = new XMLHttpRequest();

                    // HTTP basic authentication
                    if (config.auth) {
                        var username = config.auth.username || '';
                        var password = config.auth.password || '';
                        requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
                    }

                    var fullPath = buildFullPath(config.baseURL, config.url);
                    request.open(
                        config.method.toUpperCase(),
                        buildURL(fullPath, config.params, config.paramsSerializer),
                        true,
                    );

                    // Set the request timeout in MS
                    request.timeout = config.timeout;

                    // Listen for ready state
                    request.onreadystatechange = function handleLoad() {
                        if (!request || request.readyState !== 4) {
                            return;
                        }

                        // The request errored out and we didn't get a response, this will be
                        // handled by onerror instead
                        // With one exception: request that using file: protocol, most browsers
                        // will return status as 0 even though it's a successful request
                        if (
                            request.status === 0 &&
                            !(request.responseURL && request.responseURL.indexOf('file:') === 0)
                        ) {
                            return;
                        }

                        // Prepare the response
                        var responseHeaders =
                            'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
                        var responseData =
                            !config.responseType || config.responseType === 'text'
                                ? request.responseText
                                : request.response;
                        var response = {
                            data: responseData,
                            status: request.status,
                            statusText: request.statusText,
                            headers: responseHeaders,
                            config: config,
                            request: request,
                        };

                        settle(resolve, reject, response);

                        // Clean up request
                        request = null;
                    };

                    // Handle browser request cancellation (as opposed to a manual cancellation)
                    request.onabort = function handleAbort() {
                        if (!request) {
                            return;
                        }

                        reject(createError('Request aborted', config, 'ECONNABORTED', request));

                        // Clean up request
                        request = null;
                    };

                    // Handle low level network errors
                    request.onerror = function handleError() {
                        // Real errors are hidden from us by the browser
                        // onerror should only fire if it's a network error
                        reject(createError('Network Error', config, null, request));

                        // Clean up request
                        request = null;
                    };

                    // Handle timeout
                    request.ontimeout = function handleTimeout() {
                        var timeoutErrorMessage = 'timeout of ' + config.timeout + 'ms exceeded';
                        if (config.timeoutErrorMessage) {
                            timeoutErrorMessage = config.timeoutErrorMessage;
                        }
                        reject(createError(timeoutErrorMessage, config, 'ECONNABORTED', request));

                        // Clean up request
                        request = null;
                    };

                    // Add xsrf header
                    // This is only done if running in a standard browser environment.
                    // Specifically not if we're in a web worker, or react-native.
                    if (utils.isStandardBrowserEnv()) {
                        var cookies = __webpack_require__('eqyj');

                        // Add xsrf header
                        var xsrfValue =
                            (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName
                                ? cookies.read(config.xsrfCookieName)
                                : undefined;

                        if (xsrfValue) {
                            requestHeaders[config.xsrfHeaderName] = xsrfValue;
                        }
                    }

                    // Add headers to the request
                    if ('setRequestHeader' in request) {
                        utils.forEach(requestHeaders, function setRequestHeader(val, key) {
                            if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
                                // Remove Content-Type if data is undefined
                                delete requestHeaders[key];
                            } else {
                                // Otherwise add header to the request
                                request.setRequestHeader(key, val);
                            }
                        });
                    }

                    // Add withCredentials to request if needed
                    if (!utils.isUndefined(config.withCredentials)) {
                        request.withCredentials = !!config.withCredentials;
                    }

                    // Add responseType to request if needed
                    if (config.responseType) {
                        try {
                            request.responseType = config.responseType;
                        } catch (e) {
                            // Expected DOMException thrown by browsers not compatible XMLHttpRequest Level 2.
                            // But, this can be suppressed for 'json' type as it can be parsed by default 'transformResponse' function.
                            if (config.responseType !== 'json') {
                                throw e;
                            }
                        }
                    }

                    // Handle progress if needed
                    if (typeof config.onDownloadProgress === 'function') {
                        request.addEventListener('progress', config.onDownloadProgress);
                    }

                    // Not all browsers support upload events
                    if (typeof config.onUploadProgress === 'function' && request.upload) {
                        request.upload.addEventListener('progress', config.onUploadProgress);
                    }

                    if (config.cancelToken) {
                        // Handle cancellation
                        config.cancelToken.promise.then(function onCanceled(cancel) {
                            if (!request) {
                                return;
                            }

                            request.abort();
                            reject(cancel);
                            // Clean up request
                            request = null;
                        });
                    }

                    if (requestData === undefined) {
                        requestData = null;
                    }

                    // Send the request
                    request.send(requestData);
                });
            };

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

        /***/ vDqi: /***/ function(module, exports, __webpack_require__) {
            module.exports = __webpack_require__('zuR4');

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

        /***/ w0Vi: /***/ function(module, exports, __webpack_require__) {
            'use strict';

            var utils = __webpack_require__('xTJ+');

            // Headers whose duplicates are ignored by node
            // c.f. https://nodejs.org/api/http.html#http_message_headers
            var ignoreDuplicateOf = [
                'age',
                'authorization',
                'content-length',
                'content-type',
                'etag',
                'expires',
                'from',
                'host',
                'if-modified-since',
                'if-unmodified-since',
                'last-modified',
                'location',
                'max-forwards',
                'proxy-authorization',
                'referer',
                'retry-after',
                'user-agent',
            ];

            /**
             * Parse headers into an object
             *
             * ```
             * Date: Wed, 27 Aug 2014 08:58:49 GMT
             * Content-Type: application/json
             * Connection: keep-alive
             * Transfer-Encoding: chunked
             * ```
             *
             * @param {String} headers Headers needing to be parsed
             * @returns {Object} Headers parsed into an object
             */
            module.exports = function parseHeaders(headers) {
                var parsed = {};
                var key;
                var val;
                var i;

                if (!headers) {
                    return parsed;
                }

                utils.forEach(headers.split('\n'), function parser(line) {
                    i = line.indexOf(':');
                    key = utils.trim(line.substr(0, i)).toLowerCase();
                    val = utils.trim(line.substr(i + 1));

                    if (key) {
                        if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
                            return;
                        }
                        if (key === 'set-cookie') {
                            parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
                        } else {
                            parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
                        }
                    }
                });

                return parsed;
            };

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

        /***/ xAGQ: /***/ function(module, exports, __webpack_require__) {
            'use strict';

            var utils = __webpack_require__('xTJ+');

            /**
             * Transform the data for a request or a response
             *
             * @param {Object|String} data The data to be transformed
             * @param {Array} headers The headers for the request or response
             * @param {Array|Function} fns A single function or Array of functions
             * @returns {*} The resulting transformed data
             */
            module.exports = function transformData(data, headers, fns) {
                /*eslint no-param-reassign:0*/
                utils.forEach(fns, function transform(fn) {
                    data = fn(data, headers);
                });

                return data;
            };

            /***/
        },

        /***/ 'xTJ+': /***/ function(module, exports, __webpack_require__) {
            'use strict';

            var bind = __webpack_require__('HSsa');

            /*global toString:true*/

            // utils is a library of generic helper functions non-specific to axios

            var toString = Object.prototype.toString;

            /**
             * Determine if a value is an Array
             *
             * @param {Object} val The value to test
             * @returns {boolean} True if value is an Array, otherwise false
             */
            function isArray(val) {
                return toString.call(val) === '[object Array]';
            }

            /**
             * Determine if a value is undefined
             *
             * @param {Object} val The value to test
             * @returns {boolean} True if the value is undefined, otherwise false
             */
            function isUndefined(val) {
                return typeof val === 'undefined';
            }

            /**
             * Determine if a value is a Buffer
             *
             * @param {Object} val The value to test
             * @returns {boolean} True if value is a Buffer, otherwise false
             */
            function isBuffer(val) {
                return (
                    val !== null &&
                    !isUndefined(val) &&
                    val.constructor !== null &&
                    !isUndefined(val.constructor) &&
                    typeof val.constructor.isBuffer === 'function' &&
                    val.constructor.isBuffer(val)
                );
            }

            /**
             * Determine if a value is an ArrayBuffer
             *
             * @param {Object} val The value to test
             * @returns {boolean} True if value is an ArrayBuffer, otherwise false
             */
            function isArrayBuffer(val) {
                return toString.call(val) === '[object ArrayBuffer]';
            }

            /**
             * Determine if a value is a FormData
             *
             * @param {Object} val The value to test
             * @returns {boolean} True if value is an FormData, otherwise false
             */
            function isFormData(val) {
                return typeof FormData !== 'undefined' && val instanceof FormData;
            }

            /**
             * Determine if a value is a view on an ArrayBuffer
             *
             * @param {Object} val The value to test
             * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
             */
            function isArrayBufferView(val) {
                var result;
                if (typeof ArrayBuffer !== 'undefined' && ArrayBuffer.isView) {
                    result = ArrayBuffer.isView(val);
                } else {
                    result = val && val.buffer && val.buffer instanceof ArrayBuffer;
                }
                return result;
            }

            /**
             * Determine if a value is a String
             *
             * @param {Object} val The value to test
             * @returns {boolean} True if value is a String, otherwise false
             */
            function isString(val) {
                return typeof val === 'string';
            }

            /**
             * Determine if a value is a Number
             *
             * @param {Object} val The value to test
             * @returns {boolean} True if value is a Number, otherwise false
             */
            function isNumber(val) {
                return typeof val === 'number';
            }

            /**
             * Determine if a value is an Object
             *
             * @param {Object} val The value to test
             * @returns {boolean} True if value is an Object, otherwise false
             */
            function isObject(val) {
                return val !== null && typeof val === 'object';
            }

            /**
             * Determine if a value is a Date
             *
             * @param {Object} val The value to test
             * @returns {boolean} True if value is a Date, otherwise false
             */
            function isDate(val) {
                return toString.call(val) === '[object Date]';
            }

            /**
             * Determine if a value is a File
             *
             * @param {Object} val The value to test
             * @returns {boolean} True if value is a File, otherwise false
             */
            function isFile(val) {
                return toString.call(val) === '[object File]';
            }

            /**
             * Determine if a value is a Blob
             *
             * @param {Object} val The value to test
             * @returns {boolean} True if value is a Blob, otherwise false
             */
            function isBlob(val) {
                return toString.call(val) === '[object Blob]';
            }

            /**
             * Determine if a value is a Function
             *
             * @param {Object} val The value to test
             * @returns {boolean} True if value is a Function, otherwise false
             */
            function isFunction(val) {
                return toString.call(val) === '[object Function]';
            }

            /**
             * Determine if a value is a Stream
             *
             * @param {Object} val The value to test
             * @returns {boolean} True if value is a Stream, otherwise false
             */
            function isStream(val) {
                return isObject(val) && isFunction(val.pipe);
            }

            /**
             * Determine if a value is a URLSearchParams object
             *
             * @param {Object} val The value to test
             * @returns {boolean} True if value is a URLSearchParams object, otherwise false
             */
            function isURLSearchParams(val) {
                return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
            }

            /**
             * Trim excess whitespace off the beginning and end of a string
             *
             * @param {String} str The String to trim
             * @returns {String} The String freed of excess whitespace
             */
            function trim(str) {
                return str.replace(/^\s*/, '').replace(/\s*$/, '');
            }

            /**
             * Determine if we're running in a standard browser environment
             *
             * This allows axios to run in a web worker, and react-native.
             * Both environments support XMLHttpRequest, but not fully standard globals.
             *
             * web workers:
             *  typeof window -> undefined
             *  typeof document -> undefined
             *
             * react-native:
             *  navigator.product -> 'ReactNative'
             * nativescript
             *  navigator.product -> 'NativeScript' or 'NS'
             */
            function isStandardBrowserEnv() {
                if (
                    typeof navigator !== 'undefined' &&
                    (navigator.product === 'ReactNative' ||
                        navigator.product === 'NativeScript' ||
                        navigator.product === 'NS')
                ) {
                    return false;
                }
                return typeof window !== 'undefined' && typeof document !== 'undefined';
            }

            /**
             * Iterate over an Array or an Object invoking a function for each item.
             *
             * If `obj` is an Array callback will be called passing
             * the value, index, and complete array for each item.
             *
             * If 'obj' is an Object callback will be called passing
             * the value, key, and complete object for each property.
             *
             * @param {Object|Array} obj The object to iterate
             * @param {Function} fn The callback to invoke for each item
             */
            function forEach(obj, fn) {
                // Don't bother if no value provided
                if (obj === null || typeof obj === 'undefined') {
                    return;
                }

                // Force an array if not already something iterable
                if (typeof obj !== 'object') {
                    /*eslint no-param-reassign:0*/
                    obj = [obj];
                }

                if (isArray(obj)) {
                    // Iterate over array values
                    for (var i = 0, l = obj.length; i < l; i++) {
                        fn.call(null, obj[i], i, obj);
                    }
                } else {
                    // Iterate over object keys
                    for (var key in obj) {
                        if (Object.prototype.hasOwnProperty.call(obj, key)) {
                            fn.call(null, obj[key], key, obj);
                        }
                    }
                }
            }

            /**
             * Accepts varargs expecting each argument to be an object, then
             * immutably merges the properties of each object and returns result.
             *
             * When multiple objects contain the same key the later object in
             * the arguments list will take precedence.
             *
             * Example:
             *
             * ```js
             * var result = merge({foo: 123}, {foo: 456});
             * console.log(result.foo); // outputs 456
             * ```
             *
             * @param {Object} obj1 Object to merge
             * @returns {Object} Result of all merge properties
             */
            function merge(/* obj1, obj2, obj3, ... */) {
                var result = {};
                function assignValue(val, key) {
                    if (typeof result[key] === 'object' && typeof val === 'object') {
                        result[key] = merge(result[key], val);
                    } else {
                        result[key] = val;
                    }
                }

                for (var i = 0, l = arguments.length; i < l; i++) {
                    forEach(arguments[i], assignValue);
                }
                return result;
            }

            /**
             * Function equal to merge with the difference being that no reference
             * to original objects is kept.
             *
             * @see merge
             * @param {Object} obj1 Object to merge
             * @returns {Object} Result of all merge properties
             */
            function deepMerge(/* obj1, obj2, obj3, ... */) {
                var result = {};
                function assignValue(val, key) {
                    if (typeof result[key] === 'object' && typeof val === 'object') {
                        result[key] = deepMerge(result[key], val);
                    } else if (typeof val === 'object') {
                        result[key] = deepMerge({}, val);
                    } else {
                        result[key] = val;
                    }
                }

                for (var i = 0, l = arguments.length; i < l; i++) {
                    forEach(arguments[i], assignValue);
                }
                return result;
            }

            /**
             * Extends object a by mutably adding to it the properties of object b.
             *
             * @param {Object} a The object to be extended
             * @param {Object} b The object to copy properties from
             * @param {Object} thisArg The object to bind function to
             * @return {Object} The resulting value of object a
             */
            function extend(a, b, thisArg) {
                forEach(b, function assignValue(val, key) {
                    if (thisArg && typeof val === 'function') {
                        a[key] = bind(val, thisArg);
                    } else {
                        a[key] = val;
                    }
                });
                return a;
            }

            module.exports = {
                isArray: isArray,
                isArrayBuffer: isArrayBuffer,
                isBuffer: isBuffer,
                isFormData: isFormData,
                isArrayBufferView: isArrayBufferView,
                isString: isString,
                isNumber: isNumber,
                isObject: isObject,
                isUndefined: isUndefined,
                isDate: isDate,
                isFile: isFile,
                isBlob: isBlob,
                isFunction: isFunction,
                isStream: isStream,
                isURLSearchParams: isURLSearchParams,
                isStandardBrowserEnv: isStandardBrowserEnv,
                forEach: forEach,
                merge: merge,
                deepMerge: deepMerge,
                extend: extend,
                trim: trim,
            };

            /***/
        },

        /***/ xYCF: /***/ function(module, exports, __webpack_require__) {
            /*!
             * depd
             * Copyright(c) 2014-2018 Douglas Christopher Wilson
             * MIT Licensed
             */

            /**
             * Module dependencies.
             */

            var relative = __webpack_require__('oyvS').relative;

            /**
             * Module exports.
             */

            module.exports = depd;

            /**
             * Get the path to base files on.
             */

            var basePath = process.cwd();

            /**
             * Determine if namespace is contained in the string.
             */

            function containsNamespace(str, namespace) {
                var vals = str.split(/[ ,]+/);
                var ns = String(namespace).toLowerCase();

                for (var i = 0; i < vals.length; i++) {
                    var val = vals[i];

                    // namespace contained
                    if (val && (val === '*' || val.toLowerCase() === ns)) {
                        return true;
                    }
                }

                return false;
            }

            /**
             * Convert a data descriptor to accessor descriptor.
             */

            function convertDataDescriptorToAccessor(obj, prop, message) {
                var descriptor = Object.getOwnPropertyDescriptor(obj, prop);
                var value = descriptor.value;

                descriptor.get = function getter() {
                    return value;
                };

                if (descriptor.writable) {
                    descriptor.set = function setter(val) {
                        return (value = val);
                    };
                }

                delete descriptor.value;
                delete descriptor.writable;

                Object.defineProperty(obj, prop, descriptor);

                return descriptor;
            }

            /**
             * Create arguments string to keep arity.
             */

            function createArgumentsString(arity) {
                var str = '';

                for (var i = 0; i < arity; i++) {
                    str += ', arg' + i;
                }

                return str.substr(2);
            }

            /**
             * Create stack string from stack.
             */

            function createStackString(stack) {
                var str = this.name + ': ' + this.namespace;

                if (this.message) {
                    str += ' deprecated ' + this.message;
                }

                for (var i = 0; i < stack.length; i++) {
                    str += '\n    at ' + stack[i].toString();
                }

                return str;
            }

            /**
             * Create deprecate for namespace in caller.
             */

            function depd(namespace) {
                if (!namespace) {
                    throw new TypeError('argument namespace is required');
                }

                var stack = getStack();
                var site = callSiteLocation(stack[1]);
                var file = site[0];

                function deprecate(message) {
                    // call to self as log
                    log.call(deprecate, message);
                }

                deprecate._file = file;
                deprecate._ignored = isignored(namespace);
                deprecate._namespace = namespace;
                deprecate._traced = istraced(namespace);
                deprecate._warned = Object.create(null);

                deprecate.function = wrapfunction;
                deprecate.property = wrapproperty;

                return deprecate;
            }

            /**
             * Determine if event emitter has listeners of a given type.
             *
             * The way to do this check is done three different ways in Node.js >= 0.8
             * so this consolidates them into a minimal set using instance methods.
             *
             * @param {EventEmitter} emitter
             * @param {string} type
             * @returns {boolean}
             * @private
             */

            function eehaslisteners(emitter, type) {
                var count =
                    typeof emitter.listenerCount !== 'function'
                        ? emitter.listeners(type).length
                        : emitter.listenerCount(type);

                return count > 0;
            }

            /**
             * Determine if namespace is ignored.
             */

            function isignored(namespace) {
                if (process.noDeprecation) {
                    // --no-deprecation support
                    return true;
                }

                var str = process.env.NO_DEPRECATION || '';

                // namespace ignored
                return containsNamespace(str, namespace);
            }

            /**
             * Determine if namespace is traced.
             */

            function istraced(namespace) {
                if (process.traceDeprecation) {
                    // --trace-deprecation support
                    return true;
                }

                var str = process.env.TRACE_DEPRECATION || '';

                // namespace traced
                return containsNamespace(str, namespace);
            }

            /**
             * Display deprecation message.
             */

            function log(message, site) {
                var haslisteners = eehaslisteners(process, 'deprecation');

                // abort early if no destination
                if (!haslisteners && this._ignored) {
                    return;
                }

                var caller;
                var callFile;
                var callSite;
                var depSite;
                var i = 0;
                var seen = false;
                var stack = getStack();
                var file = this._file;

                if (site) {
                    // provided site
                    depSite = site;
                    callSite = callSiteLocation(stack[1]);
                    callSite.name = depSite.name;
                    file = callSite[0];
                } else {
                    // get call site
                    i = 2;
                    depSite = callSiteLocation(stack[i]);
                    callSite = depSite;
                }

                // get caller of deprecated thing in relation to file
                for (; i < stack.length; i++) {
                    caller = callSiteLocation(stack[i]);
                    callFile = caller[0];

                    if (callFile === file) {
                        seen = true;
                    } else if (callFile === this._file) {
                        file = this._file;
                    } else if (seen) {
                        break;
                    }
                }

                var key = caller ? depSite.join(':') + '__' + caller.join(':') : undefined;

                if (key !== undefined && key in this._warned) {
                    // already warned
                    return;
                }

                this._warned[key] = true;

                // generate automatic message from call site
                var msg = message;
                if (!msg) {
                    msg = callSite === depSite || !callSite.name ? defaultMessage(depSite) : defaultMessage(callSite);
                }

                // emit deprecation if listeners exist
                if (haslisteners) {
                    var err = DeprecationError(this._namespace, msg, stack.slice(i));
                    process.emit('deprecation', err);
                    return;
                }

                // format and write message
                var format = process.stderr.isTTY ? formatColor : formatPlain;
                var output = format.call(this, msg, caller, stack.slice(i));
                process.stderr.write(output + '\n', 'utf8');
            }

            /**
             * Get call site location as array.
             */

            function callSiteLocation(callSite) {
                var file = callSite.getFileName() || '<anonymous>';
                var line = callSite.getLineNumber();
                var colm = callSite.getColumnNumber();

                if (callSite.isEval()) {
                    file = callSite.getEvalOrigin() + ', ' + file;
                }

                var site = [file, line, colm];

                site.callSite = callSite;
                site.name = callSite.getFunctionName();

                return site;
            }

            /**
             * Generate a default message from the site.
             */

            function defaultMessage(site) {
                var callSite = site.callSite;
                var funcName = site.name;

                // make useful anonymous name
                if (!funcName) {
                    funcName = '<anonymous@' + formatLocation(site) + '>';
                }

                var context = callSite.getThis();
                var typeName = context && callSite.getTypeName();

                // ignore useless type name
                if (typeName === 'Object') {
                    typeName = undefined;
                }

                // make useful type name
                if (typeName === 'Function') {
                    typeName = context.name || typeName;
                }

                return typeName && callSite.getMethodName() ? typeName + '.' + funcName : funcName;
            }

            /**
             * Format deprecation message without color.
             */

            function formatPlain(msg, caller, stack) {
                var timestamp = new Date().toUTCString();

                var formatted = timestamp + ' ' + this._namespace + ' deprecated ' + msg;

                // add stack trace
                if (this._traced) {
                    for (var i = 0; i < stack.length; i++) {
                        formatted += '\n    at ' + stack[i].toString();
                    }

                    return formatted;
                }

                if (caller) {
                    formatted += ' at ' + formatLocation(caller);
                }

                return formatted;
            }

            /**
             * Format deprecation message with color.
             */

            function formatColor(msg, caller, stack) {
                var formatted =
                    '\x1b[36;1m' +
                    this._namespace +
                    '\x1b[22;39m' + // bold cyan
                    ' \x1b[33;1mdeprecated\x1b[22;39m' + // bold yellow
                    ' \x1b[0m' +
                    msg +
                    '\x1b[39m'; // reset

                // add stack trace
                if (this._traced) {
                    for (var i = 0; i < stack.length; i++) {
                        formatted += '\n    \x1b[36mat ' + stack[i].toString() + '\x1b[39m'; // cyan
                    }

                    return formatted;
                }

                if (caller) {
                    formatted += ' \x1b[36m' + formatLocation(caller) + '\x1b[39m'; // cyan
                }

                return formatted;
            }

            /**
             * Format call site location.
             */

            function formatLocation(callSite) {
                return relative(basePath, callSite[0]) + ':' + callSite[1] + ':' + callSite[2];
            }

            /**
             * Get the stack as array of call sites.
             */

            function getStack() {
                var limit = Error.stackTraceLimit;
                var obj = {};
                var prep = Error.prepareStackTrace;

                Error.prepareStackTrace = prepareObjectStackTrace;
                Error.stackTraceLimit = Math.max(10, limit);

                // capture the stack
                Error.captureStackTrace(obj);

                // slice this function off the top
                var stack = obj.stack.slice(1);

                Error.prepareStackTrace = prep;
                Error.stackTraceLimit = limit;

                return stack;
            }

            /**
             * Capture call site stack from v8.
             */

            function prepareObjectStackTrace(obj, stack) {
                return stack;
            }

            /**
             * Return a wrapped function in a deprecation message.
             */

            function wrapfunction(fn, message) {
                if (typeof fn !== 'function') {
                    throw new TypeError('argument fn must be a function');
                }

                var args = createArgumentsString(fn.length);
                var stack = getStack();
                var site = callSiteLocation(stack[1]);

                site.name = fn.name;

                // eslint-disable-next-line no-new-func
                var deprecatedfn = new Function(
                    'fn',
                    'log',
                    'deprecate',
                    'message',
                    'site',
                    '"use strict"\n' +
                        'return function (' +
                        args +
                        ') {' +
                        'log.call(deprecate, message, site)\n' +
                        'return fn.apply(this, arguments)\n' +
                        '}',
                )(fn, log, this, message, site);

                return deprecatedfn;
            }

            /**
             * Wrap property in a deprecation message.
             */

            function wrapproperty(obj, prop, message) {
                if (!obj || (typeof obj !== 'object' && typeof obj !== 'function')) {
                    throw new TypeError('argument obj must be object');
                }

                var descriptor = Object.getOwnPropertyDescriptor(obj, prop);

                if (!descriptor) {
                    throw new TypeError('must call property on owner object');
                }

                if (!descriptor.configurable) {
                    throw new TypeError('property must be configurable');
                }

                var deprecate = this;
                var stack = getStack();
                var site = callSiteLocation(stack[1]);

                // set site name
                site.name = prop;

                // convert data descriptor
                if ('value' in descriptor) {
                    descriptor = convertDataDescriptorToAccessor(obj, prop, message);
                }

                var get = descriptor.get;
                var set = descriptor.set;

                // wrap getter
                if (typeof get === 'function') {
                    descriptor.get = function getter() {
                        log.call(deprecate, message, site);
                        return get.apply(this, arguments);
                    };
                }

                // wrap setter
                if (typeof set === 'function') {
                    descriptor.set = function setter() {
                        log.call(deprecate, message, site);
                        return set.apply(this, arguments);
                    };
                }

                Object.defineProperty(obj, prop, descriptor);
            }

            /**
             * Create DeprecationError for deprecation
             */

            function DeprecationError(namespace, message, stack) {
                var error = new Error();
                var stackString;

                Object.defineProperty(error, 'constructor', {
                    value: DeprecationError,
                });

                Object.defineProperty(error, 'message', {
                    configurable: true,
                    enumerable: false,
                    value: message,
                    writable: true,
                });

                Object.defineProperty(error, 'name', {
                    enumerable: false,
                    configurable: true,
                    value: 'DeprecationError',
                    writable: true,
                });

                Object.defineProperty(error, 'namespace', {
                    configurable: true,
                    enumerable: false,
                    value: namespace,
                    writable: true,
                });

                Object.defineProperty(error, 'stack', {
                    configurable: true,
                    enumerable: false,
                    get: function() {
                        if (stackString !== undefined) {
                            return stackString;
                        }

                        // prepare stack trace
                        return (stackString = createStackString.call(this, stack));
                    },
                    set: function setter(val) {
                        stackString = val;
                    },
                });

                return error;
            }

            /***/
        },

        /***/ yK9s: /***/ function(module, exports, __webpack_require__) {
            'use strict';

            var utils = __webpack_require__('xTJ+');

            module.exports = function normalizeHeaderName(headers, normalizedName) {
                utils.forEach(headers, function processHeader(value, name) {
                    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
                        headers[normalizedName] = value;
                        delete headers[name];
                    }
                });
            };

            /***/
        },

        /***/ zuR4: /***/ function(module, exports, __webpack_require__) {
            'use strict';

            var utils = __webpack_require__('xTJ+');
            var bind = __webpack_require__('HSsa');
            var Axios = __webpack_require__('CgaS');
            var mergeConfig = __webpack_require__('SntB');
            var defaults = __webpack_require__('JEQr');

            /**
             * Create an instance of Axios
             *
             * @param {Object} defaultConfig The default config for the instance
             * @return {Axios} A new instance of Axios
             */
            function createInstance(defaultConfig) {
                var context = new Axios(defaultConfig);
                var instance = bind(Axios.prototype.request, context);

                // Copy axios.prototype to instance
                utils.extend(instance, Axios.prototype, context);

                // Copy context to instance
                utils.extend(instance, context);

                return instance;
            }

            // Create the default instance to be exported
            var axios = createInstance(defaults);

            // Expose Axios class to allow class inheritance
            axios.Axios = Axios;

            // Factory for creating new instances
            axios.create = function create(instanceConfig) {
                return createInstance(mergeConfig(axios.defaults, instanceConfig));
            };

            // Expose Cancel & CancelToken
            axios.Cancel = __webpack_require__('endd');
            axios.CancelToken = __webpack_require__('jfS+');
            axios.isCancel = __webpack_require__('Lmem');

            // Expose all/spread
            axios.all = function all(promises) {
                return Promise.all(promises);
            };
            axios.spread = __webpack_require__('DfZB');

            module.exports = axios;

            // Allow use of default import syntax in TypeScript
            module.exports.default = axios;

            /***/
        },

        /******/
    },
);
