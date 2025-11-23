'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Loader } from 'lucide-react';

interface StepKnowledgeUploadProps {
    onNext: () => void;
    onBack: () => void;
    agentConfig: any;
    setAgentConfig: (config: any) => void;
    isArabic: boolean;
}

export default function StepKnowledgeUpload({
    onNext,
    onBack,
    agentConfig,
    setAgentConfig,
    isArabic
}: StepKnowledgeUploadProps) {
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState<string>('');
    const [uploadComplete, setUploadComplete] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [pdfjsLib, setPdfjsLib] = useState<any>(null);

    // Dynamically import PDF.js only on client-side
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
            setStatus(isArabic ? 'مكتبة PDF لم تحمل بعد، حاول مرة أخرى.' : 'PDF library not loaded, try again.');
            return;
        }

        if (file.type !== 'application/pdf') {
            setStatus(isArabic ? 'يرجى رفع ملف PDF فقط.' : 'Please upload PDF files only.');
            return;
        }

        setIsProcessing(true);
        setStatus(isArabic ? 'جاري قراءة الملف...' : 'Reading file...');
        setProgress(10);

        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

            setStatus(isArabic ? `جاري معالجة ${pdf.numPages} صفحة...` : `Processing ${pdf.numPages} pages...`);
            let fullText = '';

            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const pageText = textContent.items.map((item: any) => item.str).join(' ');
                fullText += pageText + '\n\n';
                setProgress(10 + Math.round((i / pdf.numPages) * 40));
            }

            setStatus(isArabic ? 'جاري تجزئة النص...' : 'Chunking text...');
            const chunks = chunkText(fullText, 1000);
            setProgress(60);

            setStatus(isArabic ? `جاري رفع ${chunks.length} قطعة إلى قاعدة المعرفة...` : `Uploading ${chunks.length} chunks...`);

            const response = await fetch('https://tools.axiomid.app/rag-ingest', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chunks,
                    metadata: {
                        businessId: agentConfig.businessId,
                        filename: file.name,
                        uploadTimestamp: Date.now(),
                        templateId: agentConfig.templateId
                    }
                })
            });

            if (!response.ok) throw new Error('Failed to upload');

            const result = await response.json();

            setAgentConfig({
                ...agentConfig,
                knowledgeBase: {
                    filename: file.name,
                    chunksProcessed: chunks.length,
                    uploadTimestamp: Date.now()
                }
            });

            setProgress(100);
            setStatus(isArabic ? '✅ تم! قاعدة المعرفة جاهزة.' : '✅ Success! Knowledge base ready.');
            setUploadComplete(true);

        } catch (error: any) {
            setStatus(isArabic ? `❌ خطأ: ${error.message}` : `❌ Error: ${error.message}`);
            setIsProcessing(false);
        }
    };

    const chunkText = (text: string, chunkSize: number): string[] => {
        const chunks: string[] = [];
        let currentChunk = '';
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
        <div>
            <h2 className="text-3xl font-orbitron text-white mb-4">
                {isArabic ? '2. درّب وكيلك' : '2. Train Your Agent'}
            </h2>
            <p className="text-white/60 mb-8 font-rajdhani">
                {isArabic
                    ? 'ارفع ملف PDF واحد يحتوي على المعلومات التي تريد أن يتعلمها وكيلك.'
                    : 'Upload a PDF file containing the knowledge you want your agent to learn.'}
            </p>

            {/* Selected Agent Info */}
            <div className="glass-card p-4 mb-6 border border-cyan-400/30">
                <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <div>
                        <p className="text-sm text-white/70">{isArabic ? 'الوكيل المختار:' : 'Selected Agent:'}</p>
                        <p className="text-lg font-orbitron text-cyan-400">{agentConfig.templateName}</p>
                    </div>
                </div>
            </div>

            {/* Upload Instructions */}
            <div className="mb-6 p-4 bg-blue-500/10 border border-blue-400/30 rounded-lg">
                <p className="text-sm text-blue-300 mb-2 font-rajdhani">
                    {isArabic ? '📄 أمثلة على الملفات المناسبة:' : '📄 Example files to upload:'}
                </p>
                <ul className="text-xs text-blue-200/80 space-y-1 mr-4">
                    {isArabic ? (
                        <>
                            <li>• المنيو (للمطاعم)</li>
                            <li>• دليل المنتجات (للمتاجر)</li>
                            <li>• كتاب دراسي (للطلاب)</li>
                            <li>• كراسة مواصفات (للمقاولين)</li>
                        </>
                    ) : (
                        <>
                            <li>• Restaurant menu</li>
                            <li>• Product catalog</li>
                            <li>• Textbook chapter</li>
                            <li>• Project specifications</li>
                        </>
                    )}
                </ul>
            </div>

            {/* Upload Zone */}
            {!isProcessing && !uploadComplete ? (
                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                    <h3 className="text-lg font-orbitron text-white mb-4 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-cyan-400" />
                        {isArabic ? 'المستندات الحكومية (اختياري)' : 'Government Documents (Optional)'}
                    </h3>
                    <p className="text-sm text-gray-400 mb-4">
                        {isArabic
                            ? 'ارفع السجل التجاري أو شهادة قوى لتدريب الوكيل على بيانات منشأتك الرسمية.'
                            : 'Upload Commercial Registration (CR) or Qiwa Certificate to train the agent on your official business data.'}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="border border-dashed border-white/20 rounded-lg p-4 text-center hover:bg-white/5 transition-colors cursor-pointer">
                            <Upload className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
                            <span className="text-xs text-white/60 block">{isArabic ? 'السجل التجاري (CR)' : 'Commercial Registration'}</span>
                        </div>
                        <div className="border border-dashed border-white/20 rounded-lg p-4 text-center hover:bg-white/5 transition-colors cursor-pointer">
                            <Upload className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                            <span className="text-xs text-white/60 block">{isArabic ? 'شهادة قوى (Qiwa)' : 'Qiwa Certificate'}</span>
                        </div>
                    </div>

                    {/* This part assumes react-dropzone or similar is integrated. For a direct file input, it would be different. */}
                    {/* For now, we'll use the existing file input logic for the main knowledge upload. */}
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all border-white/10 hover:border-white/30`}
                    >
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept=".pdf"
                            className="hidden"
                        />
                        <Upload className={`w-12 h-12 mx-auto mb-4 text-gray-500`} />
                        <div>
                            <p className="text-white font-medium mb-2">
                                {isArabic ? 'اسحب وأفلت ملفات المعرفة هنا' : 'Drag & drop knowledge files here'}
                            </p>
                            <p className="text-xs text-gray-500">
                                PDF, TXT, MD (Max 10MB)
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    {/* Progress Bar */}
                    <div className="h-3 bg-black/50 rounded-full overflow-hidden border border-white/10">
                        <div
                            className="h-full bg-gradient-to-r from-green-400 to-cyan-400 transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>

                    {/* Status Text */}
                    <div className="flex items-center justify-center gap-3">
                        {progress < 100 ? (
                            <Loader className="w-5 h-5 text-cyan-400 animate-spin" />
                        ) : (
                            <CheckCircle className="w-5 h-5 text-green-400" />
                        )}
                        <p className="text-cyan-400 font-mono text-sm">{status}</p>
                    </div>

                    {/* Uploaded File Info */}
                    {uploadComplete && agentConfig.knowledgeBase && (
                        <div className="glass-card p-4 border border-green-400/30">
                            <div className="flex items-start gap-3">
                                <FileText className="w-5 h-5 text-green-400 mt-1" />
                                <div className="flex-1">
                                    <p className="text-white font-rajdhani">{agentConfig.knowledgeBase.filename}</p>
                                    <p className="text-sm text-white/60">
                                        {isArabic
                                            ? `${agentConfig.knowledgeBase.chunksProcessed} قطعة تم معالجتها`
                                            : `${agentConfig.knowledgeBase.chunksProcessed} chunks processed`}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
                <button
                    onClick={onBack}
                    className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg transition-all"
                >
                    {isArabic ? 'رجوع' : 'Back'}
                </button>
                <button
                    onClick={onNext}
                    disabled={!uploadComplete}
                    className={`px-8 py-3 rounded-lg font-orbitron transition-all ${uploadComplete
                        ? 'bg-gradient-to-r from-green-400 to-cyan-400 text-black hover:shadow-lg hover:shadow-cyan-400/50'
                        : 'bg-white/10 text-white/30 cursor-not-allowed'
                        }`}
                >
                    {isArabic ? 'التالي: معاينة' : 'Next: Preview'} →
                </button>
            </div>
        </div>
    );
}
