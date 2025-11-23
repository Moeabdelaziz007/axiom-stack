'use client';

import React, { useState, useRef, useEffect } from 'react';

interface PDFUploaderProps {
    businessId: string;
    onUploadComplete: () => void;
}

export const PDFUploader: React.FC<PDFUploaderProps> = ({ businessId, onUploadComplete }) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [pdfjsLib, setPdfjsLib] = useState<any>(null);

    // Dynamically import PDF.js only on client-side to avoid SSR issues
    useEffect(() => {
        import('pdfjs-dist').then((pdfjs) => {
            pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
            setPdfjsLib(pdfjs);
        });
    }, []);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!pdfjsLib) {
            setStatus('PDF library not loaded yet, please try again.');
            return;
        }

        if (file.type !== 'application/pdf') {
            setStatus('Please upload a valid PDF file.');
            return;
        }

        setIsProcessing(true);
        setStatus('Reading PDF...');
        setProgress(10);

        try {
            // 1. Read PDF file
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

            setStatus(`Parsing ${pdf.numPages} pages...`);
            let fullText = '';

            // 2. Extract text from each page
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const pageText = textContent.items.map((item: any) => item.str).join(' ');
                fullText += pageText + '\n\n';
                setProgress(10 + Math.round((i / pdf.numPages) * 40)); // Up to 50%
            }

            // 3. Chunk text (Simple character splitter for now, can be improved for Arabic)
            setStatus('Chunking text...');
            const chunks = chunkText(fullText, 1000); // ~1000 chars per chunk
            setProgress(60);

            // 4. Upload chunks to RAG Ingest Endpoint
            setStatus(`Uploading ${chunks.length} chunks to knowledge base...`);

            const response = await fetch('https://tools.axiomid.app/rag-ingest', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chunks,
                    metadata: {
                        businessId,
                        filename: file.name,
                        uploadTimestamp: Date.now()
                    }
                })
            });

            if (!response.ok) {
                throw new Error('Failed to upload chunks to RAG engine');
            }

            const result = await response.json();
            console.log('Ingest result:', result);

            setProgress(100);
            setStatus('Success! Knowledge base updated.');
            setTimeout(() => {
                setIsProcessing(false);
                setStatus('');
                setProgress(0);
                onUploadComplete();
            }, 2000);

        } catch (error: any) {
            console.error('PDF Processing Error:', error);
            setStatus(`Error: ${error.message}`);
            setIsProcessing(false);
        }
    };

    // Simple chunking helper
    const chunkText = (text: string, chunkSize: number): string[] => {
        const chunks: string[] = [];
        let currentChunk = '';

        // Split by regex that respects Arabic sentence endings if possible
        // Using a simple split by space/newline for now to be safe with mixed content
        const words = text.split(/(\s+)/);

        for (const word of words) {
            if ((currentChunk + word).length > chunkSize) {
                chunks.push(currentChunk.trim());
                currentChunk = word;
            } else {
                currentChunk += word;
            }
        }
        if (currentChunk.trim().length > 0) {
            chunks.push(currentChunk.trim());
        }
        return chunks;
    };

    return (
        <div className="p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <h3 className="text-lg font-orbitron text-white mb-4">Knowledge Base Uploader</h3>

            {!isProcessing ? (
                <div
                    className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center hover:border-cyber-cyan/50 transition-colors cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                >
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept=".pdf"
                        className="hidden"
                    />
                    <div className="text-4xl mb-2">📄</div>
                    <p className="text-gray-300 font-rajdhani">Click to upload PDF (Menu, Price List, Profile)</p>
                    <p className="text-xs text-gray-500 mt-2">Max 5MB. Arabic text supported.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="h-2 bg-black/50 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-cyber-cyan transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <p className="text-center text-cyber-cyan font-mono text-sm animate-pulse">{status}</p>
                </div>
            )}
        </div>
    );
};
