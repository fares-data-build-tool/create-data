/* eslint-disable camelcase,max-classes-per-file */
// / <reference types="next" />
// / <reference types="next/types/global" />
// / <reference types="next-images" />

declare module 'set-cookie';

declare module 'mock-req' {
    import { IncomingMessage } from 'http';

    export default class MockReq extends IncomingMessage {
        constructor(config: object);
    }
}

declare module 'mock-res' {
    import { ServerResponse } from 'http';

    export default class MockRes extends ServerResponse {
        constructor();
    }
}

declare module 'clamscan' {
    export default class NodeClam {
        constructor();

        init: (config: object) => Promise<{ is_infected: (path: string) => { is_infected: boolean } }>;
    }
}

declare module '*.jpeg' {
    const value: string;
    export = value;
}

declare module '*.jpg' {
    const value: string;
    export = value;
}

declare module '*.png' {
    const value: string;
    export = value;
}

declare module '*.svg' {
    const value: string;
    export = value;
}

declare module '*.ico' {
    const value: string;
    export = value;
}

declare module '*.pdf' {
    const value: string;
    export = value;
}

declare module '*.csv' {
    const value: string;
    export = value;
}
