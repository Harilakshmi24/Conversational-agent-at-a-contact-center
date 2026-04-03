import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Mic, MicOff, PhoneCall, PhoneOff, Volume2, VolumeX,
  ChevronDown, Loader2, Sparkles,
  Radio, ShoppingBag, Train, Wifi, Landmark, 
  Zap, HeartPulse, LayoutGrid
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/* ─── AI Orbital Visualizer Component ───────────────────────────── */
function AIOrb({ status, color }: { status: CallStatus | 'listening' | 'speaking' | 'thinking', color: string }) {
  return (
    <div className="relative w-48 h-48 flex items-center justify-center">
      {/* Background Glows */}
      <div className={cn(
        "absolute inset-0 rounded-full blur-[60px] opacity-20 transition-all duration-1000",
        status === 'active' || status === 'listening' || status === 'speaking' || status === 'thinking' ? "bg-primary scale-125" : "bg-muted scale-100"
      )} />
      
      {/* Rotating Rings */}
      <div className={cn(
        "absolute inset-0 border border-primary/20 rounded-full animate-[spin_10s_linear_infinite]",
        status === 'idle' && "opacity-20"
      )} />
      <div className={cn(
        "absolute inset-4 border border-primary/10 rounded-full animate-[spin_7s_linear_infinite_reverse]",
        status === 'idle' && "opacity-10"
      )} />
      
      {/* Core Sphere */}
      <div className={cn(
        "relative w-32 h-32 rounded-full flex items-center justify-center z-10 transition-all duration-700 overflow-hidden shadow-2xl",
        status === 'listening' ? "bg-primary/20 scale-110 border-2 border-primary shadow-[0_0_40px_rgba(139,92,246,0.4)]" :
        status === 'speaking' ? "bg-purple-500/20 scale-110 border-2 border-purple-500 shadow-[0_0_40px_rgba(168,85,247,0.4)]" :
        status === 'thinking' ? "bg-amber-500/20 scale-105 border-2 border-amber-500 shadow-[0_0_40px_rgba(245,158,11,0.4)]" :
        status === 'connecting' ? "bg-emerald-500/20 animate-pulse border-2 border-emerald-500" :
        "bg-secondary/30 border border-border"
      )}>
        {/* Inner Pulsing Rings */}
        {(status === 'listening' || status === 'speaking') && (
          <>
            <div className="absolute inset-0 bg-primary/20 animate-[pulse_2s_infinite]" />
            <div className="absolute inset-4 border-2 border-primary/40 rounded-full animate-[ping_3s_infinite]" />
          </>
        )}
        
        <div className={cn("transition-transform duration-500", (status === 'listening' || status === 'speaking') && "scale-125 font-bold")}>
           <div className={cn("w-16 h-16 rounded-full flex items-center justify-center bg-background/40 backdrop-blur-md shadow-inner", color)}>
              <LayoutGrid className="w-8 h-8" />
           </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Types ─────────────────────────────────────────────────────── */
type DomainId = 'shopping' | 'railway' | 'broadband' | 'banking' | 'healthcare' | 'electricity';
type LangCode = 'en' | 'hi' | 'ta' | 'te' | 'bn' | 'kn' | 'ml' | 'mr' | 'gu';
type CallStatus = 'idle' | 'connecting' | 'active' | 'ended';
type TranscriptEntry = { id: number; role: 'user' | 'bot'; text: string; time: string };

/* ─── Domain Config ────────────────────────────────────────────── */
const DOMAINS: Record<DomainId, { label: string; icon: any; color: string; prompt: string }> = {
  banking: {
    label: 'Banking',
    icon: Landmark,
    color: 'text-blue-400',
    prompt: 'You are a professional bank assistant. Help with balance, transfers, card blocks, and loan queries.'
  },
  shopping: {
    label: 'Shopping',
    icon: ShoppingBag,
    color: 'text-rose-400',
    prompt: 'You are a helpful e-commerce agent. Help with orders, delivery status, returns, and payments.'
  },
  railway: {
    label: 'Railway',
    icon: Train,
    color: 'text-orange-400',
    prompt: 'You are a railway enquiry bot. Help with PNR, train status, seat availability, and food orders.'
  },
  broadband: {
    label: 'Broadband',
    icon: Wifi,
    color: 'text-purple-400',
    prompt: 'You are a technical support agent for a broadband company. Help with outages, speed issues, and billing.'
  },
  healthcare: {
    label: 'Healthcare',
    icon: HeartPulse,
    color: 'text-emerald-400',
    prompt: 'You are a medical assistant bot. Help with doctor appointments, reports, and medicine home delivery.'
  },
  electricity: {
    label: 'Electricity',
    icon: Zap,
    color: 'text-yellow-400',
    prompt: 'You are an electricity board assistant. Help with bill payments, power cuts, and meter reading issues.'
  }
};

/* ─── Language Config ────────────────────────────────────────────── */
const LANGS: Record<LangCode, { label: string; flag: string; bcp47: string; voiceLang: string }> = {
  en: { label: 'English',    flag: '🇬🇧', bcp47: 'en-IN',  voiceLang: 'en' },
  hi: { label: 'हिंदी',      flag: '🇮🇳', bcp47: 'hi-IN',  voiceLang: 'hi' },
  ta: { label: 'தமிழ்',      flag: '🇮🇳', bcp47: 'ta-IN',  voiceLang: 'ta' },
  te: { label: 'తెలుగు',     flag: '🇮🇳', bcp47: 'te-IN',  voiceLang: 'te' },
  bn: { label: 'বাংলা',      flag: '🇮🇳', bcp47: 'bn-IN',  voiceLang: 'bn' },
  kn: { label: 'ಕನ್ನಡ',      flag: '🇮🇳', bcp47: 'kn-IN',  voiceLang: 'kn' },
  ml: { label: 'മലയാളം',    flag: '🇮🇳', bcp47: 'ml-IN',  voiceLang: 'ml' },
  mr: { label: 'मराठी',      flag: '🇮🇳', bcp47: 'mr-IN',  voiceLang: 'mr' },
  gu: { label: 'ગુજરાતી',   flag: '🇮🇳', bcp47: 'gu-IN',  voiceLang: 'gu' },
};

/* ─── Dynamic Greetings ──────────────────────────────────────────── */
const GREETINGS: Record<DomainId, Record<LangCode, string>> = {
  shopping: {
    en: "Hello! Welcome to Shopping Support. Interested in tracking an order or starting a return?",
    hi: "नमस्ते! शॉपिंग सपोर्ट में आपका स्वागत है। क्या आप ऑर्डर ट्रैक करना चाहते हैं या रिटर्न शुरू करना चाहते हैं?",
    ta: "வணக்கம்! ஷாப்பிங் ஆதரவிற்கு வரவேற்கிறோம். ஆர்டரைக் கண்காணிக்க வேண்டுமா அல்லது ரிட்டர்ன் தொடங்க வேண்டுமா?",
    te: "నమస్కారం! షాపింగ్ సపోర్ట్‌కి స్వాగతం. మీరు ఆర్డర్‌ను ట్రాక్ చేయాలనుకుంటున్నారా లేదా రిటర్న్ ప్రారంభించాలనుకుంటున్నారా?",
    bn: "নমস্কার! শপিং সাপোর্টে আপনাকে স্বাগতম। আপনি কি কোনো অর্ডার ট্র্যাক করতে চান বা রিটার্ন শুরু করতে চান?",
    kn: "ನಮಸ್ಕಾರ! ಶಾಪಿಂಗ್ ಬೆಂಬಲಕ್ಕೆ ಸ್ವಾಗತ. ನೀವು ಆರ್ಡರ್ ಟ್ರ್ಯಾಕ್ ಮಾಡಲು ಅಥವಾ ರಿಟರ್ನ್ ಪ್ರಾರಂಭಿಸಲು ಬಯಸುವಿರಾ?",
    ml: "നമസ്കാരം! ഷോപ്പിംഗ് സപ്പോർട്ടിലേക്ക് സ്വാഗതം. നിങ്ങൾക്ക് ഒരു ഓർഡർ ട്രാക്ക് ചെയ്യണോ അതോ റിട്ടേൺ തുടങ്ങണോ?",
    mr: "नमस्कार! शॉपिंग सपोर्टमध्ये आपले स्वागत आहे. आपण ऑर्डर ट्रॅक करू इच्छिता की रिटर्न सुरू करू इच्छिता?",
    gu: "નમસ્તે! શોપિંગ સપોર્ટમાં તમારું સ્વાગત છે. શું તમે ઓર્ડર ટેક કરવા માંગો છો કે રિટર્ન શરૂ કરવા માંગો છો?"
  },
  railway: {
    en: "Welcome to Railway Enquiry. Please provide your PNR number or destination.",
    hi: "रेलवे पूछताछ में आपका स्वागत है। कृपया अपना पीएनआर नंबर या गंतव्य बताएं।",
    ta: "இரயில்வே விசாரணைக்கு வரவேற்கிறோம். உங்கள் பிஎன்ஆர் எண் அல்லது சேருமிடத்தை வழங்கவும்.",
    te: "రైల్వే ఎంక్వైరీకి స్వాగతం. దయచేసి మీ PNR నంబర్ లేదా గమ్యస్థానాన్ని తెలియజేయండి.",
    bn: "রেলওয়ে এনকোয়ারিতে স্বাগতম। অনুগ্রহ করে আপনার পিএনআর নম্বর বা গন্তব্য প্রদান করুন।",
    kn: "ರೈಲ್ವೆ ವಿಚಾರಣೆಗೆ ಸ್ವಾಗತ. ದಯವಿಟ್ಟು ನಿಮ್ಮ PNR ಸಂಖ್ಯೆ ಅಥವಾ ತಲುಪಬೇಕಾದ ಸ್ಥಳವನ್ನು ತಿಳಿಸಿ.",
    ml: "റെയിൽവേ എൻക്വയറിയിലേക്ക് സ്വാഗതം. ദയവായി നിങ്ങളുടെ PNR നമ്പറോ എത്തിച്ചേരേണ്ട സ്ഥലമോ നൽകുക.",
    mr: "रेल्वे चौकशीमध्ये आपले स्वागत आहे. कृपया आपला पीएनआर नंबर किंवा गंतव्यस्थान सांगा.",
    gu: "રેલ્વે પૂછપરછમાં તમારું સ્વાગત છે. કૃપા કરીને તમારો PNR નંબર અથવા ગંતવ્ય જણાવો."
  },
  banking: {
    en: "Cognivox Bank at your service. How can I help with your account or cards today?",
    hi: "कॉग्निवॉक्स बैंक आपकी सेवा में। आज मैं आपके खाते या कार्ड के बारे में कैसे मदद कर सकता हूं?",
    ta: "காக்னிவோக்ஸ் வங்கி உங்கள் சேவையில். இன்று உங்கள் கணக்கு அல்லது கார்டுகளுக்கு நான் எப்படி உதவ முடியும்?",
    te: "కాగ్నివోక్స్ బ్యాంక్ మీ సేవలో ఉంది. ఈరోజు మీ ఖాతా లేదా కార్డ్‌లకు సంబంధించి నేను ఎలా సహాయపడగలను?",
    bn: "কগনিভক্স ব্যাঙ্ক আপনার সেবায়। আজ আমি আপনার অ্যাকাউন্ট বা কার্ডের জন্য কীভাবে সাহায্য করতে পারি?",
    kn: "ಕಾಗ್ನಿವೋಕ್ಸ್ ಬ್ಯಾಂಕ್ ನಿಮ್ಮ ಸೇವೆಯಲ್ಲಿದೆ. ಇಂದು ನಿಮ್ಮ ఖಾತೆ ಅಥವಾ ಕಾರ್ಡ್‌ಗಳ ಬಗ್ಗೆ ನಾನು ಹೇಗೆ ಸಹಾಯ ಮಾಡಲಿ?",
    ml: "കോഗ്നിവോക്സ് ബാങ്ക് നിങ്ങളുടെ സേവനത്തിൽ. ഇന്ന് നിങ്ങളുടെ അക്കൗണ്ടിനോ കാർഡിനോ വേണ്ടി ഞാൻ എങ്ങനെ സഹായിക്കണം?",
    mr: "कॉग्निव्हॉक्स बँक आपल्या सेवेत हाजर. आज मी आपल्या खात्यासाठी किंवा कार्डांसाठी कशी मदत करू शकतो?",
    gu: "કોગ્નિવોક્સ બેંક તમારી સેવામાં. આજે હું તમારા ખાતા અથવા કાર્ડ વિશે કેવી રીતે મદદ કરી શકું?"
  },
  broadband: {
    en: "Broadband Support here. Are you facing slow speeds or connection drops?",
    hi: "ब्रॉडबैंड सपोर्ट यहां है। क्या आपको धीमी गति या कनेक्शन टूटने की समस्या हो रही है?",
    ta: "பிராட்பேண்ட் ஆதரவு இங்கே. நீங்கள் மெதுவான வேகம் அல்லது இணைப்பு குறைபாடுகளை எதிர்கொள்கிறீர்களா?",
    te: "బ్రాడ్‌బ్యాండ్ సపోర్ట్ ఇక్కడ ఉంది. మీరు తక్కువ వేగం లేదా కనెక్షన్ డ్రాప్‌లను ఎదుర్కొంటున్నారా?",
    bn: "ব্রডব্যান্ড সাপোর্ট এখানে। আপনি কি ধীর গতি বা সংযোগ বিচ্ছিন্ন হওয়ার সম্মুখীন হচ্ছেন?",
    kn: "ಬ್ರಾಡ್‌ಬ್ಯಾಂಡ್ ಬೆಂಬಲ ಇಲ್ಲಿದೆ. ನೀವು ನಿಧಾನಗತಿಯ ವೇಗ ಅಥವಾ ಸಂಪರ್ಕ ಕಡಿತವನ್ನು ಎದುರಿಸುತ್ತಿದ್ದೀರಾ?",
    ml: "ബറോഡ്ബാൻഡ് സപ്പോർട്ട് ഇവിടെയുണ്ട്. നിങ്ങൾ വേഗത കുറവോ കണക്ഷൻ തകരാറോ നേരിടുന്നുണ്ടോ?",
    mr: "ब्रॉडबँड सपोर्ट येथे आहे. आपल्याला कमी वेग किंवा कनेक्शनमध्ये समस्या येत आहेत का?",
    gu: "બ્રોડબેન્ડ સપોર્ટ અહીં છે. શું તમે ધીમી ગતિ અથવા કનેક્શન તૂટવાની સમસ્યા અનુભવી રહ્યા છો?"
  },
  healthcare: {
    en: "Healthcare Assistant online. Need to book a doctor visit or check test reports?",
    hi: "हेल्थकेयर सहायक ऑनलाइन। डॉक्टर से मिलने का समय लेना है या टेस्ट रिपोर्ट चेक करनी है?",
    ta: "சுகாதார உதவியாளர் ஆன்லைனில். மருத்துவர் வருகையை முன்பதிவு செய்ய வேண்டுமா அல்லது சோதனை அறிக்கைகளை சரிபார்க்க வேண்டுமா?",
    te: "హెల్త్‌కేర్ అసిస్టెంట్ ఆన్‌లైన్‌లో ఉన్నారు. డాక్టర్ విజిట్‌ని బుక్ చేయాలా లేదా టెస్ట్ రిపోర్ట్‌లను చెక్ చేయాలా?",
    bn: "হেলথকেয়ার সহকারী অনলাইন। ডাক্তারের অ্যাপয়েন্টমেন্ট নিতে হবে নাকি পরীক্ষার রিপোর্ট চেক করতে হবে?",
    kn: "ಹೆಲ್ತ್‌ಕೇರ್ ಸಹಾಯಕ ಆನ್‌ಲೈನ್‌ನಲ್ಲಿದ್ದಾರೆ. ವೈದ್ಯರನ್ನು ಭೇಟಿ ಮಾಡಲು ಬುಕ್ ಮಾಡಬೇಕೆ ಅಥವಾ ಪರೀಕ್ಷಾ ವರದಿಗಳನ್ನು ಪರಿಶೀಲಿಸಬೇಕೆ?",
    ml: "ഹെൽത്ത് കെയർ അസിസ്റ്റന്റ് ഓൺലൈനിൽ. ഡോക്ടറെ കാണാൻ ബുക്ക് ചെയ്യണോ അതോ പരിശോധനാ റിപ്പോർട്ടുകൾ നോക്കണോ?",
    mr: "हेल्थकेअर सहाय्यक ऑनलाइन. डॉक्टरांची भेट बुक करायची आहे की चाचणी अहवाल तપાसायचे आहेत?",
    gu: "હેલ્થકેર સહાયક ઓનલાઇન. ડૉક્ટરની મુલાકાત બુક કરવી છે કે ટેસ્ટ રિપોર્ટ ચેક કરવા છે?"
  },
  electricity: {
    en: "Electricity Board helpdesk. You can report power outages or pay your bills here.",
    hi: "बिजली बोर्ड हेल्पलाइन। आप यहां बिजली कटौती की सूचना दे सकते हैं या अपने बिलों का भुगतान कर सकते हैं।",
    ta: "மின்சார வாரிய உதவி மையம். நீங்கள் மின்தடையைப் புகாரளிக்கலாம் அல்லது உங்கள் கட்டணங்களை இங்கே செலுத்தலாம்.",
    te: "విద్యుత్ బోర్డు హెల్ప్‌డెస్క్. మీరు ఇక్కడ విద్యుత్ కోతల గురించి ఫిర్యాదు చేయవచ్చు లేదా మీ బిల్లులను చెల్లించవచ్చు.",
    bn: "বিদ্যুৎ বোর্ড হেল্পডেস্ক। আপনি এখানে বিদ্যুৎ বিভ্রাটের রিপোর্ট করতে পারেন বা আপনার বিল পরিশোধ করতে পারেন।",
    kn: "ವಿದ್ಯುತ್ ಮಂಡಳಿ ಸಹಾಯ ಕೇಂದ್ರ. ನೀವು ಇಲ್ಲಿ ವಿದ್ಯುತ್ ಕಡಿತದ ವರದಿ ನೀಡಬಹುದು ಅಥವಾ ನಿಮ್ಮ ಬಿಲ್‌ಗಳನ್ನು ಪಾವತಿಸಬಹುದು.",
    ml: "വൈദ്യുതി ബോർഡ് ഹെൽപ്പ് ഡെസ്ക്. നിങ്ങൾക്ക് ഇവിടെ പവർ കട്ട് റിപ്പോർട്ട് ചെയ്യാനോ ബില്ലുകൾ അടയ്ക്കാനോ കഴിയും.",
    mr: "वीज मंडळ हेल्पडेस्क. आपण येथे वीज कपातीची तक्रार करू शकता किंवा आपली बिले भरू शकता.",
    gu: "વીજળી બોર્ડ હેલ્પડેસ્ક. તમે અહીં પાવર કટની જાણ કરી શકો છો અથવા તમારા બિલ ભરી શકો છો."
  }
};

/* ─── Gemini API call ────────────────────────────────────────────── */
async function askGemini(question: string, apiKey: string, langLabel: string, history: TranscriptEntry[], domain: DomainId): Promise<string> {
  const domainPrompts = DOMAINS[domain].prompt;
  const systemPrompt = `You are Cognivox, a fast, friendly AI voice assistant for a contact center. 
${domainPrompts}
Reply in ${langLabel} language only. Keep answers SHORT (2-4 sentences max) since this is a voice call — no bullet points, no markdown, no long paragraphs. 
Always reply in the native script of the language. Be warm, professional, and to the point.`;

  const historyText = history.slice(-6).map(h => `${h.role === 'user' ? 'Customer' : 'Cognivox'}: ${h.text}`).join('\n');
  const prompt = `${systemPrompt}\n\nConversation so far:\n${historyText}\n\nCustomer: ${question}\nCognivox:`;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 150, topP: 0.9 },
      }),
    }
  );
  if (!res.ok) throw new Error(`Gemini error: ${res.status}`);
  const data = await res.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || 'Sorry, I could not process that. Please try again.';
}

/* ─── Domain-Specific Smart Fallback ────────────────────────────── */
function smartFallback(q: string, domain: DomainId): string {
  const lower = q.toLowerCase();
  if (domain === 'railway') {
    if (lower.match(/pnr|status|ticket/)) return "Your ticket for PNR 4521879630 is confirmed in Coach S4, Seat 22. The train is currently running on time.";
    if (lower.match(/train|where|platform/)) return "Train 12625 is arriving on Platform Number 4 in approximately 10 minutes.";
    if (lower.match(/food|meal|lunch|dinner/)) return "I can help you order a meal. Would you like a Veg Thali or would you prefer ordering from Dominos via E-Catering?";
  }
  if (domain === 'banking') {
    if (lower.match(/balance|money|account/)) return "Your current savings account balance is ₹48,250.60. Would you like a mini-statement?";
    if (lower.match(/block|lost|card/)) return "I have immediately blocked your Debit Card ending in 4022 for security. A replacement card will be shipped within 3 days.";
    if (lower.match(/loan|interest/)) return "Our current Personal Loan interest rates start at 10.5% per annum. You are pre-approved for a loan of up to ₹5 Lakhs.";
  }
  if (domain === 'broadband') {
    if (lower.match(/slow|speed|internet/)) return "I see your optical fiber signal is weak. Let me send a reset signal to your ONT router. Please check again in 2 minutes.";
    if (lower.match(/bill|pay|recharge/)) return "Your monthly plan of ₹799 is valid until the 15th of next month. You have used 420 GB out of your 3.3 TB FUP limit.";
    if (lower.match(/outage|work|down/)) return "There is a planned maintenance in your area by our local engineering team. Services will be restored by 4 PM today.";
  }
  if (domain === 'healthcare') {
    if (lower.match(/appointment|doctor|visit/)) return "I've scheduled your appointment with Dr. Mehta for tomorrow at 10:30 AM in the Cardiology department. See you then.";
    if (lower.match(/report|test|result/)) return "Your blood test reports are now ready. Everything appears to be within normal range. I'm sending a copy to your WhatsApp.";
  }
  if (domain === 'electricity') {
    if (lower.match(/bill|pay/)) return "Your current electricity bill is ₹1,245. The due date is the 10th of this month. Would you like to pay now using your saved card?";
    if (lower.match(/cut|power|light/)) return "A power outage has been reported in your sector due to a grid failure. Our team is working on it, expected back by 6 PM.";
  }
  if (lower.match(/hello|hi|hey|namaste|vanakkam|namaskar/))
    return "Hello! I'm here to help you with your queries. What can I do for you today?";
  if (lower.match(/help|support|agent|human/))
    return "I'm here to assist! I can help with domain-specific requests. What would you like to know?";
  if (lower.match(/thank|thanks|dhanyavad|shukriya/))
    return "You're very welcome! Is there anything else I can help you with today?";
  if (lower.match(/bye|goodbye|end|close/))
    return "Thank you for contacting us today. Have a wonderful day! Goodbye!";
  return "I understand. Let me look into that for you. Could you please provide more details so I can assist you better?";
}


/* ─── Main Component ─────────────────────────────────────────────── */
export function VoiceCallBot() {
  const [domainId, setDomainId] = useState<DomainId>('shopping');
  const [langCode, setLangCode] = useState<LangCode>('en');
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [domainMenuOpen, setDomainMenuOpen] = useState(false);
  const [callStatus, setCallStatus] = useState<CallStatus>('idle');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [liveText, setLiveText] = useState('');
  const [muted, setMuted] = useState(false);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('cognivox_gemini_key') || '');
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [showApiPanel, setShowApiPanel] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis>(window.speechSynthesis);
  const transcriptEndRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lang = LANGS[langCode];
  const domain = DOMAINS[domainId];

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes voiceBar { 0% { height: 4px; opacity: 0.4; } 50% { height: 40px; opacity: 1; } 100% { height: 8px; opacity: 0.6; } }
      @keyframes pulseRing { 0% { transform: scale(1); opacity: 0.8; } 100% { transform: scale(1.6); opacity: 0; } }
    `;
    document.head.appendChild(style);
    return () => { if (document.head.contains(style)) document.head.removeChild(style); };
  }, []);

  useEffect(() => { transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [transcript, isThinking]);

  useEffect(() => {
    if (callStatus === 'active') { timerRef.current = setInterval(() => setCallDuration(d => d + 1), 1000); } 
    else { if (timerRef.current) clearInterval(timerRef.current); setCallDuration(0); }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [callStatus]);

  function fmtTime(s: number) { return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`; }

  const speakText = useCallback((text: string) => {
    if (muted) return;
    synthRef.current?.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = lang.bcp47;
    const voices = synthRef.current.getVoices();
    const match = voices.find(v => v.lang.startsWith(lang.voiceLang)) || voices.find(v => v.lang.startsWith('en'));
    if (match) utt.voice = match;
    utt.onstart = () => setIsSpeaking(true);
    utt.onend = () => { setIsSpeaking(false); startListening(); };
    utt.onerror = () => { setIsSpeaking(false); startListening(); };
    synthRef.current?.speak(utt);
  }, [muted, lang]);

  const addMsg = (role: 'user' | 'bot', text: string) => {
    const now = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    setTranscript(prev => [...prev, { id: Date.now(), role, text, time: now }]);
  };

  const getBotReply = useCallback(async (userText: string, history: TranscriptEntry[]) => {
    setIsThinking(true);
    stopListening();
    try {
      let reply: string;
      if (apiKey) { try { reply = await askGemini(userText, apiKey, lang.label, history, domainId); } catch { reply = smartFallback(userText, domainId); } } 
      else { await new Promise(r => setTimeout(r, 800)); reply = smartFallback(userText, domainId); }
      setIsThinking(false);
      addMsg('bot', reply);
      speakText(reply);
    } catch { setIsThinking(false); const fb = "I'm sorry, I encountered an issue. Please try again."; addMsg('bot', fb); speakText(fb); }
  }, [apiKey, lang, domainId, speakText]);

  const stopListening = () => { recognitionRef.current?.stop(); setIsListening(false); setLiveText(''); };

  const startListening = useCallback(() => {
    if (callStatus !== 'active' || isSpeaking) return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) { console.error('Speech recognition not supported in this browser. Use Chrome.'); return; }
    const rec = new SpeechRecognition();
    rec.lang = lang.bcp47;
    rec.interimResults = true;
    rec.maxAlternatives = 1;
    rec.onstart = () => setIsListening(true);
    rec.onend = () => { setIsListening(false); setLiveText(''); };
    rec.onerror = (e: any) => { setIsListening(false); if (e.error !== 'no-speech' && e.error !== 'aborted') console.error(`Mic error: ${e.error}`); };
    rec.onresult = (e: any) => {
      const txt = Array.from(e.results).map((r: any) => r[0].transcript).join('');
      setLiveText(txt);
      if (e.results[e.results.length - 1].isFinal && txt.trim()) {
        setLiveText(''); rec.stop(); addMsg('user', txt.trim());
        setTranscript(prev => {
          const updated = [...prev, { id: Date.now() + 1, role: 'user' as const, text: txt.trim(), time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) }];
          getBotReply(txt.trim(), updated);
          return updated;
        });
      }
    };
    recognitionRef.current = rec;
    try { rec.start(); } catch {}
  }, [callStatus, isSpeaking, lang, getBotReply]);

  const startCall = () => {
    setTranscript([]); setCallStatus('connecting');
    setTimeout(() => {
      setCallStatus('active');
      const greet = GREETINGS[domainId][langCode];
      addMsg('bot', greet); speakText(greet);
    }, 1200);
  };

  const endCall = () => { stopListening(); synthRef.current?.cancel(); setIsSpeaking(false); setIsThinking(false); setCallStatus('ended'); setTimeout(() => setCallStatus('idle'), 2500); };

  useEffect(() => {
    if (callStatus === 'active' && !isSpeaking && !isThinking) { const t = setTimeout(() => startListening(), 400); return () => clearTimeout(t); }
  }, [callStatus, isSpeaking, isThinking, langCode, domainId]);

  const saveKey = () => { localStorage.setItem('cognivox_gemini_key', apiKeyInput); setApiKey(apiKeyInput); setShowApiPanel(false); setApiKeyInput(''); };

  return (
    <div className="h-full flex flex-col xl:flex-row gap-6 animate-in fade-in duration-700">
      {/* Left Column: AI Command Center */}
      <div className="flex-1 flex flex-col gap-6">
        <div className="flex items-center justify-between bg-card/40 backdrop-blur-xl border border-border/40 p-5 rounded-3xl shadow-xl">
          <div className="flex items-center gap-4">
             <div className="p-3 bg-primary/20 rounded-2xl shadow-inner border border-primary/30">
                <Radio className="w-6 h-6 text-primary animate-pulse" />
             </div>
             <div>
                <h2 className="text-xl font-black uppercase tracking-tighter text-foreground flex items-center gap-2">
                  Cognivox <span className="text-primary italic">Live</span> 
                </h2>
                <div className="flex items-center gap-2 mt-0.5">
                   <div className="w-2 h-2 rounded-full bg-emerald-500" />
                   <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{callStatus === 'idle' ? 'System Ready' : 'Line Active'}</p>
                </div>
             </div>
          </div>

          <div className="flex items-center gap-2">
             <button onClick={() => setDomainMenuOpen(o => !o)} className="h-10 px-4 bg-secondary/80 border border-border/60 rounded-xl text-xs font-bold transition-all hover:bg-secondary flex items-center gap-2">
                <domain.icon className={cn("w-4 h-4", domain.color)} />
                <span>{domain.label.toUpperCase()}</span>
                <ChevronDown className={cn("w-3 h-3 transition-transform", domainMenuOpen && "rotate-180")} />
             </button>
             
             <button onClick={() => setLangMenuOpen(o => !o)} className="h-10 px-4 bg-secondary/80 border border-border/60 rounded-xl text-xs font-bold transition-all hover:bg-secondary flex items-center gap-2">
                <span>{lang.flag}</span>
                <span>{lang.label.toUpperCase()}</span>
                <ChevronDown className={cn("w-3 h-3 transition-transform", langMenuOpen && "rotate-180")} />
             </button>
          </div>
        </div>

        {/* Global Selectors Modals */}
        {domainMenuOpen && (
           <div className="absolute top-24 left-1/2 -translate-x-1/2 w-64 bg-card border border-border/80 rounded-3xl shadow-2xl z-[100] p-3 animate-in zoom-in-95 backdrop-blur-2xl">
              {(Object.keys(DOMAINS) as DomainId[]).map(id => {
                const Icon = DOMAINS[id].icon;
                return (
                  <button key={id} onClick={() => { setDomainId(id); setDomainMenuOpen(false); }} className={cn("w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all", domainId === id ? "bg-primary text-white" : "hover:bg-primary/10")}>
                    <Icon className="w-4 h-4" /> {DOMAINS[id].label}
                  </button>
                );
              })}
           </div>
        )}

        {langMenuOpen && (
           <div className="absolute top-24 left-1/2 -translate-x-1/2 w-64 bg-card border border-border/80 rounded-3xl shadow-2xl z-[100] p-3 animate-in zoom-in-95 backdrop-blur-2xl max-h-[60vh] overflow-y-auto">
              {(Object.keys(LANGS) as LangCode[]).map(code => (
                <button key={code} onClick={() => { setLangCode(code); setLangMenuOpen(false); }} className={cn("w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all", langCode === code ? "bg-primary text-white" : "hover:bg-primary/10")}>
                  <span>{LANGS[code].flag}</span> {LANGS[code].label}
                </button>
              ))}
           </div>
        )}

        {/* Command Center Visualization */}
        <div className="flex-1 bg-card/20 backdrop-blur-md border border-border/30 rounded-[40px] flex flex-col relative overflow-hidden shadow-2xl group">
             {/* Background Mesh */}
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.05),transparent_70%)] pointer-events-none" />
             
             <div className="flex-1 flex flex-col items-center justify-center p-10">
                  <AIOrb 
                    status={isThinking ? 'thinking' : isListening ? 'listening' : isSpeaking ? 'speaking' : callStatus} 
                    color={domain.color} 
                  />
                  
                  <div className="mt-8 text-center space-y-2 z-10">
                      <h3 className="text-3xl font-black text-foreground tracking-tighter uppercase italic">
                         {domain.label} OS <span className="text-primary tracking-normal not-italic text-sm align-top">v2.0</span>
                      </h3>
                      <p className="text-[12px] font-mono text-muted-foreground uppercase tracking-[0.3em] font-bold">
                        {callStatus === 'idle' ? 'Identity Verification Pending' : 
                         callStatus === 'connecting' ? 'Establishing Neural Link...' : 
                         isThinking ? 'Processing Neural Patterns...' :
                         'Agent Active - Decrypting Speech'}
                      </p>
                  </div>

                  {callStatus === 'active' && (
                    <div className="mt-6 flex items-center gap-4 bg-background/40 backdrop-blur-xl border border-border/60 px-6 py-2 rounded-2xl shadow-xl">
                         <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-sm font-black font-mono tracking-widest">{fmtTime(callDuration)}</span>
                         </div>
                         <div className="w-px h-4 bg-border/60" />
                         <span className="text-[10px] font-bold uppercase text-primary/80 tracking-widest">Secure Voice Link</span>
                    </div>
                  )}
                  
                  <div className="mt-12 flex items-center gap-4 bg-background/20 p-2 rounded-3xl backdrop-blur-xl border border-white/5">
                      {callStatus === 'idle' || callStatus === 'ended' ? (
                        <button onClick={startCall} className="flex items-center gap-4 px-12 py-5 bg-primary hover:bg-primary/90 text-white font-black rounded-2xl shadow-[0_10px_40px_rgba(139,92,246,0.3)] transition-all hover:scale-105 uppercase tracking-widest text-sm">
                           <PhoneCall className="w-6 h-6" /> Initiate Connection
                        </button>
                      ) : (
                        <div className="flex items-center gap-3">
                           <button onClick={() => setMuted(m => !m)} className={cn("p-5 rounded-2xl border transition-all", muted ? "bg-rose-500/20 border-rose-500/50 text-rose-500" : "bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10")}>
                              {muted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                           </button>
                           <button onClick={endCall} className="px-10 py-5 bg-rose-500 hover:bg-rose-600 text-white font-black rounded-2xl shadow-[0_10px_40px_rgba(244,63,94,0.3)] transition-all hover:scale-105 uppercase tracking-widest text-sm flex items-center gap-3">
                              <PhoneOff className="w-6 h-6" /> Terminate
                           </button>
                           <button onClick={() => isListening ? stopListening() : startListening()} className={cn("p-5 rounded-2xl border transition-all", isListening ? "bg-primary/20 border-primary/50 text-primary shadow-[0_0_20px_rgba(139,92,246,0.3)]" : "bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10")}>
                              {isListening ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
                           </button>
                        </div>
                      )}
                  </div>
             </div>

             {/* Live Subtitles Panel */}
             <div className="h-20 bg-black/20 backdrop-blur-xl border-t border-white/5 px-8 flex items-center justify-center">
                <p className="text-sm font-bold text-primary italic max-w-2xl text-center truncate">
                   {liveText || (isSpeaking ? "Receiving voice data..." : "Awaiting user input...")}
                </p>
             </div>
        </div>
      </div>

      {/* Right Column: Tactical Comms */}
      <div className="w-full xl:w-96 flex flex-col gap-6">
          <div className="bg-card/40 backdrop-blur-xl border border-border/40 rounded-[32px] flex flex-col h-full overflow-hidden shadow-2xl relative">
              <div className="p-6 border-b border-border/30 flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Tactical Transcript</h3>
                  <div className="flex gap-1">
                     <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50" />
                     <div className="w-1.5 h-1.5 rounded-full bg-primary/50 anim-pulse" />
                  </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-none bg-secondary/5">
                {transcript.map(entry => (
                  <div key={entry.id} className={cn("flex flex-col gap-2 animate-in slide-in-from-bottom-2", entry.role === 'user' ? "items-end" : "items-start")}>
                    <div className={cn("px-5 py-3 rounded-2xl text-[13px] font-medium leading-relaxed max-w-[85%] shadow-sm", entry.role === 'user' ? "bg-primary text-white rounded-tr-none" : "bg-card border border-border/60 text-foreground rounded-tl-none")}>
                      {entry.text}
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">{entry.time} — {entry.role === 'user' ? 'USER' : 'COGNIVOX'}</span>
                  </div>
                ))}
                {isThinking && (
                  <div className="flex items-center gap-2 p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl animate-pulse">
                     <Loader2 className="w-4 h-4 text-amber-500 animate-spin" />
                     <span className="text-[10px] font-black uppercase tracking-widest text-amber-500">Decrypting...</span>
                  </div>
                )}
                <div ref={transcriptEndRef} />
              </div>
              
              <div className="p-6 bg-secondary/10 border-t border-border/30">
                  <div className="flex items-center justify-between mb-4">
                     <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Neural Metrics</span>
                     <span className="text-[10px] font-black text-emerald-500">OPTIMIZED</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                      <div className="bg-background/40 p-3 rounded-2xl border border-border/40">
                         <p className="text-[8px] font-bold text-muted-foreground uppercase opacity-60 mb-1">Latency</p>
                         <p className="text-xs font-black font-mono">1.2ms</p>
                      </div>
                      <div className="bg-background/40 p-3 rounded-2xl border border-border/40">
                         <p className="text-[8px] font-bold text-muted-foreground uppercase opacity-60 mb-1">Emotion Score</p>
                         <p className="text-xs font-black font-mono">NEUTRAL</p>
                      </div>
                  </div>
              </div>
          </div>

          {/* Quick Engine Switcher */}
          <div className="bg-gradient-to-br from-primary/20 to-purple-500/20 border border-primary/20 rounded-3xl p-6 relative overflow-hidden group">
              <div className="relative z-10 flex items-center justify-between">
                 <div>
                    <h4 className="text-xs font-black uppercase tracking-widest mb-1">Cloud Engine</h4>
                    <p className="text-[10px] text-muted-foreground font-medium">{apiKey ? 'Gemini 1.5 Flash Active' : 'Switching to Gemini...'}</p>
                 </div>
                 <button onClick={() => setShowApiPanel(!showApiPanel)} className="p-3 bg-primary/20 hover:bg-primary/30 rounded-xl transition-all">
                    <Sparkles className="w-4 h-4 text-primary" />
                 </button>
              </div>
              {showApiPanel && (
                <div className="mt-4 pt-4 border-t border-primary/10 space-y-3 z-10 relative">
                   <input type="password" value={apiKeyInput} onChange={e => setApiKeyInput(e.target.value)} placeholder="API Key..." className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-[10px] font-mono outline-none focus:border-primary/50 transition-all" />
                   <button onClick={saveKey} className="w-full py-2 bg-primary text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl">Inject Engine</button>
                </div>
              )}
          </div>
      </div>
    </div>
  );
}
