export type ExportLambdaBody = { paths: string[]; noc: string; exportPrefix: string };

export type ZipperLambdaBody = { exportName: string; noc: string };

export type ExportMetadata = { date: string; numberOfExpectedNetexFiles: number };
