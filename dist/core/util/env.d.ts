export declare const hasProto: boolean;
export declare const inBrowser: boolean;
export declare const UA: string | false;
export declare const isIE: boolean | "";
export declare const isIE9: boolean | "";
export declare const isEdge: boolean | "";
export declare const isAndroid: boolean | "";
export declare const isIOS: boolean | "";
export declare const isChrome: boolean | "";
export declare const isPhantomJS: boolean | "";
export declare const isFF: false | "" | RegExpMatchArray | null;
export declare const nativeWatch: any;
export declare let supportsPassive: boolean;
export declare const isServerRendering: () => boolean | undefined;
export declare const devtools: any;
export declare function isNative(Ctor: any): boolean;
export declare const hasSymbol: boolean;
declare let _Set: any;
export interface SimpleSet {
    has(key: string | number): boolean;
    add(key: string | number): any;
    clear(): void;
}
export { _Set };
