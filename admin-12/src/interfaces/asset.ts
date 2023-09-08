
export interface AssetInformation {

    title: string;
    caption: string;
    mediaType: string;
    mediaRelationType: string;
    usage: string;

    searchTerms: string;

    file: FileList;
        
}

export type AssetsInformation = AssetInformation[];