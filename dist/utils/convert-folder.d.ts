type Converter = (input: string, output: string) => Promise<any>;
export declare function convertFolder(inputDir: string, outputDir: string, ext: string, convert: Converter): Promise<void>;
export {};
//# sourceMappingURL=convert-folder.d.ts.map