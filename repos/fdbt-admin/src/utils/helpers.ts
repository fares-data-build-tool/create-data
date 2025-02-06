import { ObjectList } from 'aws-sdk/clients/s3';

export interface FareTypeCount {
    single: number;
    return: number;
    flatFare: number;
    period: number;
    multiOperator: number;
}

export interface GraphData {
    title: string;
    value: number;
    color: string;
}

export const mapIntoArrayOfArrays = (input: string[]): string[][] => {
    return input.map((item) => [item]);
};

export const dateIsWithinNumberOfDays = (date: Date, numberOfDays: number): boolean => {
    const today = new Date().getTime();
    const inputtedDate = date.getTime();

    const msBetweenDates = Math.abs(inputtedDate - today);

    // 👇️ convert ms to days                 hour   min  sec   ms
    const daysBetweenDates = msBetweenDates / (24 * 60 * 60 * 1000);

    return daysBetweenDates < numberOfDays;
};

const netexFileMatchesNoc = (fileName: string, noc: string): boolean => {
    const nocPart = fileName.split('/exports/')[0];
    return nocPart === noc;
};

export const netexFilesGenerated = (activeNocs: string[], netexFiles: ObjectList, timeframe: 30 | 365): string[] => {
    const nocsThatHaveGeneratedNetex: string[] = [];
    activeNocs.forEach((noc) => {
        const netexFilesForNoc = netexFiles.find(
            (file) =>
                netexFileMatchesNoc(file.Key as string, noc) &&
                dateIsWithinNumberOfDays(file.LastModified as Date, timeframe),
        );
        if (netexFilesForNoc) {
            nocsThatHaveGeneratedNetex.push(noc);
        }
    });
    return nocsThatHaveGeneratedNetex;
};

const productMatchesNoc = (fileName: string, noc: string): boolean => {
    const nocPart = fileName.split('/')[0];
    return nocPart === noc;
};

export const productsCreated = (activeNocs: string[], products: ObjectList): string[] => {
    const nocsThatHaveCreatedProducts: string[] = [];
    activeNocs.forEach((noc) => {
        const productsForNoc = products.find((file) => productMatchesNoc(file.Key as string, noc));
        if (productsForNoc) {
            nocsThatHaveCreatedProducts.push(noc);
        }
    });
    return nocsThatHaveCreatedProducts;
};

export const typesOfProductsCreated = (products: ObjectList): FareTypeCount => {
    // SYRK is used for testing, so needs to be discounted
    const nocsToIgnore = ['IWBusCo', 'SYRK'];
    const count: FareTypeCount = {
        single: 0,
        return: 0,
        flatFare: 0,
        period: 0,
        multiOperator: 0,
    };

    products.forEach((product) => {
        const productPath = product.Key as string;
        let includesInvalidNoc = false;

        nocsToIgnore.forEach((noc) => {
            if (productPath.includes(noc)) {
                includesInvalidNoc = true;
            }
        });

        if (!includesInvalidNoc) {
            const fareTypePart = productPath.split('/')[1];
            count[fareTypePart as keyof FareTypeCount] += 1;
        }
    });

    return count;
};

export const createGraphData = (fareTypeCount: FareTypeCount): GraphData[] => {
    const fareTypes = ['single', 'return', 'flatFare', 'period', 'multiOperator', 'multiOperatorExt'];
    const colours = ['#196f3d', '#a93226', '#1f618d', '#2e4053', '#d35400'];

    return fareTypes.map((fareType, index) => {
        const count = fareTypeCount[fareType as keyof FareTypeCount];
        return {
            title: fareType,
            value: count,
            color: colours[index],
        };
    });
};

export const getProductCount = (graphData: GraphData[]): number => {
    return Object.values(graphData)
        .map((data) => data.value)
        .reduce((sum, num) => sum + num);
};

export const formatGraphDataForCsv = (graphData: GraphData[]): string[][] => {
    const formattedGraphData = graphData.map((data) => {
        return [data.title, data.value.toString()];
    });
    const headers = ['Faretype', 'Count'];

    return [headers, ...formattedGraphData];
};
