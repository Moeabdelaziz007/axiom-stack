'use client';

import React from 'react';
import { AGENT_TEMPLATES } from '@/../../core/src/templates';
import {
    Utensils, Calendar, Home, ShoppingBag, Star,
    Plane, BookOpen, Shield, Scale, Briefcase,
    Ruler, Users, Package, FileText, Car
} from 'lucide-react';

interface StepTemplateSelectionProps {
    onNext: () => void;
    setAgentConfig: (config: any) => void;
    isArabic: boolean;
}

// Icon mapping for each agent
const iconMap: Record<string, any> = {
    SOFRA: Utensils,
    MAWID: Calendar,
    AQAR: Home,
    TAJER: ShoppingBag,
    SOM3A: Star,
    RAHHAL: Plane,
    OSTAZ: BookOpen,
    KASHIF: Shield,
    MUHAMI: Scale,
    MANAGER: Briefcase,
    MUQADDAR: Ruler,
    MOUTAZEM: Users,
    JUMRUK_VISION: Package,
    MUNAQASA_BOT: FileText,
    SAYYARA_SCAN: Car
};

// Arabic descriptions for templates
const arabicDescriptions: Record<string, { name: string; desc: string; example: string }> = {
    SOFRA: { name: 'وكيل السفرة', desc: 'يرد على أسئلة الزبائن عن المنيو والأسعار', example: 'للمطاعم والكافيهات' },
    MAWID: { name: 'وكيل موعد', desc: 'جدولة المواعيد للصالونات والعيادات', example: 'للعيادات ومراكز التجميل' },
    AQAR: { name: 'وكيل عقار', desc: 'يجيب عن تفاصيل العقارات ويؤهل العملاء', example: 'للمسوقين العقاريين' },
    TAJER: { name: 'وكيل تاجر', desc: 'ردود سريعة عن الأسعار والمقاسات', example: 'لمتاجر إنستقرام' },
    SOM3A: { name: 'وكيل سمعة', desc: 'إدارة التقييمات ومتابعة رضا العملاء', example: 'لجميع الأعمال' },
    RAHHAL: { name: 'وكيل رحال', desc: 'جداول سياحية حلال ومساعد السفر', example: 'للمسافرين' },
    OSTAZ: { name: 'وكيل أستاذ', desc: 'شرح الكتب والمذاكرة والاختبارات', example: 'للطلاب' },
    KASHIF: { name: 'وكيل كاشف', desc: 'تحليل العملات والمشاريع الرقمية', example: 'لمستثمري الكريبتو' },
    MUHAMI: { name: 'وكيل محامي', desc: 'مراجعة العقود وكشف البنود الخطيرة', example: 'للمستقلين' },
    MANAGER: { name: 'وكيل مدير أعمال', desc: 'إدارة رسائل المؤثرين والتسعير', example: 'للمؤثرين' },
    MUQADDAR: { name: 'المُقدِّر', desc: 'استخراج جداول الكميات من المخططات', example: 'للمقاولين' },
    MOUTAZEM: { name: 'مُلتزم', desc: 'محاكاة نطاقات واستراتيجية التوطين', example: 'لإدارات الموارد البشرية' },
    JUMRUK_VISION: { name: 'جمارك-فيجن', desc: 'تصنيف رموز النظام المنسق بصرياً', example: 'للمخلصين الجمركيين' },
    MUNAQASA_BOT: { name: 'مناقصة-بوت', desc: 'تحليل المناقصات الحكومية', example: 'للمقاولين في اعتماد' },
    SAYYARA_SCAN: { name: 'سيارة-سكان', desc: 'فحص السيارات بالفيديو', example: 'لسوق السيارات المستعملة' }
};

export default function StepTemplateSelection({ onNext, setAgentConfig, isArabic }: StepTemplateSelectionProps) {
    const handleSelectTemplate = (templateId: string) => {
        const template = AGENT_TEMPLATES[templateId as keyof typeof AGENT_TEMPLATES];
        const arabicInfo = arabicDescriptions[templateId];

        setAgentConfig({
            templateId,
            templateName: isArabic ? arabicInfo?.name : template.role,
            genome: template.genome,
            traits: template.traits,
            reasoning Protocol: template.reasoningProtocol,
            tools: template.allowedTools,
            systemPrompt: template.systemPrompt,
            businessId: `biz-${Math.random().toString(36).substring(7)}`
        });

        onNext();
    };

    // Group templates
    const b2cTemplates = ['SOFRA', 'MAWID', 'AQAR', 'TAJER', 'SOM3A', 'RAHHAL', 'OSTAZ', 'KASHIF', 'MUHAMI', 'MANAGER'];
    const b2bTemplates = ['MUQADDAR', 'MOUTAZEM', 'JUMRUK_VISION', 'MUNAQASA_BOT', 'SAYYARA_SCAN'];

    const renderTemplateCard = (templateId: string) => {
        const Icon = iconMap[templateId];
        const arabicInfo = arabicDescriptions[templateId];
        const template = AGENT_TEMPLATES[templateId as keyof typeof AGENT_TEMPLATES];

        return (
            <button
                key={templateId}
                onClick={() => handleSelectTemplate(templateId)}
                className="group glass-card p-6 text-right hover:scale-105 hover:border-cyan-400/50 transition-all duration-300 border-2 border-transparent"
            >
                {/* Icon */}
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-400/20 to-purple-500/20 border border-cyan-400/30 flex items-center justify-center mb-4 group-hover:shadow-lg group-hover:shadow-cyan-400/50 transition-shadow">
                    <Icon className="w-7 h-7 text-cyan-400" />
                </div>

                {/* Title */}
                <h3 className="text-xl font-orbitron text-white mb-2">
                    {isArabic ? arabicInfo?.name : template.role}
                </h3>

                {/* Description */}
                <p className="text-sm text-white/70 mb-3 font-rajdhani">
                    {isArabic ? arabicInfo?.desc : template.description}
                </p>

                {/* Example Use Case */}
                <div className="text-xs text-cyan-400/80 bg-cyan-400/10 px-3 py-1.5 rounded-lg inline-block">
                    {isArabic ? `مناسب لـ: ${arabicInfo?.example}` : arabicInfo?.example}
                </div>

                {/* Genome Badge */}
                <div className="mt-3 text-xs text-white/50 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    {template.genome.split('&')[0].trim()}
                </div>
            </button>
        );
    };

    return (
        <div>
            <h2 className="text-3xl font-orbitron text-white mb-4">
                {isArabic ? '1. اختر نوع وكيلك' : '1. Choose Your Agent Type'}
            </h2>
            <p className="text-white/60 mb-8 font-rajdhani">
                {isArabic
                    ? 'اختر من 15 وكيل متخصص. كل واحد مصمم لحل مشكلة محددة بشكل احترافي.'
                    : 'Choose from 15 specialized agents. Each designed to solve a specific problem professionally.'}
            </p>

            {/* B2C Section */}
            <div className="mb-10">
                <h3 className="text-xl font-orbitron text-cyan-400 mb-4 flex items-center gap-2">
                    {isArabic ? '🚀 سريع الانتشار (B2C)' : '🚀 Fast Growth (B2C)'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {b2cTemplates.map(renderTemplateCard)}
                </div>
            </div>

            {/* B2B Section */}
            <div>
                <h3 className="text-xl font-orbitron text-purple-400 mb-4 flex items-center gap-2">
                    {isArabic ? '💎 قيمة عميقة (B2B)' : '💎 High Value (B2B)'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {b2bTemplates.map(renderTemplateCard)}
                </div>
            </div>
        </div>
    );
}
