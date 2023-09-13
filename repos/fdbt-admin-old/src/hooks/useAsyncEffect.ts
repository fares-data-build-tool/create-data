import { useEffect } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
const useAsyncEffect = (effect: (isCanceled: () => boolean) => Promise<void>, dependencies?: any[]) => {
    return useEffect(() => {
        let canceled = false;
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        effect(() => canceled);
        return () => {
            canceled = true;
        };
    }, dependencies);
};

export default useAsyncEffect;
