// packages/web-ui/src/lib/ipfs.ts

export interface IPFSUploadResult {
    cid: string;
    url: string;
}

export const uploadToIPFS = async (data: any): Promise<IPFSUploadResult> => {
    console.log('Uploading to IPFS (Mock)...', data);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // In a real implementation, this would use Pinata or similar
    // const formData = new FormData();
    // formData.append('file', new Blob([JSON.stringify(data)], { type: 'application/json' }));
    // const res = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', ...);

    // Return mock CID
    const mockCID = 'QmXyZ' + Math.random().toString(36).substring(7);

    return {
        cid: mockCID,
        url: `https://ipfs.io/ipfs/${mockCID}`
    };
};

export const uploadImageToIPFS = async (file: File): Promise<IPFSUploadResult> => {
    console.log('Uploading image to IPFS (Mock)...', file.name);
    await new Promise(resolve => setTimeout(resolve, 2000));

    const mockCID = 'QmImg' + Math.random().toString(36).substring(7);
    return {
        cid: mockCID,
        url: `https://ipfs.io/ipfs/${mockCID}`
    };
};
