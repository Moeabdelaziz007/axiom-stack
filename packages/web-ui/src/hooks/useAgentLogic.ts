import { useState, useCallback } from 'react';

export const useAgentLogic = () => {
    const [isThinking, setIsThinking] = useState(false);
    const [lastResponse, setLastResponse] = useState<string | null>(null);

    const sendMessage = useCallback(async (text: string) => {
        setIsThinking(true);
        setLastResponse(null);

        try {
            // Simulate network delay / AI processing
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Mock response logic (In production, this calls the Agent Factory)
            // We'll give a context-aware response based on the input
            let response = "أهلاً بك. كيف يمكنني مساعدتك اليوم؟";

            if (text.includes("موعد") || text.includes("حجز")) {
                response = "حسناً، يمكنني مساعدتك في حجز موعد. هل تفضل الفترة الصباحية أم المسائية؟";
            } else if (text.includes("صباح") || text.includes("مساء")) {
                response = "ممتاز. لقد قمت بتسجيل طلبك. سأرسل لك التأكيد قريباً.";
            } else if (text.includes("شكرا")) {
                response = "على الرحب والسعة. أتمنى لك يوماً سعيداً.";
            }

            setLastResponse(response);
        } catch (error) {
            console.error("Error sending message:", error);
            setLastResponse("عذراً، حدث خطأ ما. الرجاء المحاولة مرة أخرى.");
        } finally {
            setIsThinking(false);
        }
    }, []);

    return {
        sendMessage,
        lastResponse,
        isThinking
    };
};
