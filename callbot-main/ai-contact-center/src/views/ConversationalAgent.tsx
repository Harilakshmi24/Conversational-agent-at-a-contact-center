import { useState, useEffect, useRef } from 'react';
import { 
  Send, ChevronDown, Landmark, ShoppingBag, Train, Wifi, 
  HeartPulse, Zap, LayoutGrid, User, Key,
  BrainCircuit
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/* ─── Types ─────────────────────────────────────────────────────── */
type DomainId = 'shopping' | 'railway' | 'broadband' | 'banking' | 'healthcare' | 'electricity';
type LangCode = 'en' | 'hi' | 'ta' | 'te' | 'bn' | 'kn' | 'ml' | 'mr' | 'gu';
type Message = { id: number; role: 'user' | 'ai'; content: string; options?: string[]; icon?: any };

/* ─── Domain Config ────────────────────────────────────────────── */
const DOMAINS: Record<DomainId, { label: string; icon: any; color: string; theme: string; prompt: string }> = {
  banking: { 
    label: 'Banking', icon: Landmark, color: 'text-blue-400', theme: 'border-blue-500/30 bg-blue-500/5',
    prompt: 'You are a professional bank assistant. Help with balance, transfers, card blocks, and loan queries.'
  },
  shopping: { 
    label: 'Shopping', icon: ShoppingBag, color: 'text-rose-400', theme: 'border-rose-500/30 bg-rose-500/5',
    prompt: 'You are a helpful e-commerce agent. Help with orders, delivery status, returns, and payments.'
  },
  railway: { 
    label: 'Railway', icon: Train, color: 'text-orange-400', theme: 'border-orange-500/30 bg-orange-500/5',
    prompt: 'You are a railway enquiry bot. Help with PNR, train status, seat availability, and food orders.'
  },
  broadband: { 
    label: 'Broadband', icon: Wifi, color: 'text-purple-400', theme: 'border-purple-500/30 bg-purple-500/5',
    prompt: 'You are a technical support agent for a broadband company. Help with outages, speed issues, and billing.'
  },
  healthcare: { 
    label: 'Healthcare', icon: HeartPulse, color: 'text-emerald-400', theme: 'border-emerald-500/30 bg-emerald-500/5',
    prompt: 'You are a medical assistant bot. Help with doctor appointments, reports, and medicine home delivery.'
  },
  electricity: { 
    label: 'Electricity', icon: Zap, color: 'text-yellow-400', theme: 'border-yellow-500/30 bg-yellow-500/5',
    prompt: 'You are an electricity board assistant. Help with bill payments, power cuts, and meter reading issues.'
  }
};

/* ─── Domain-Aware Language Data ───────────────────────────────── */
const DOMAIN_DATA: Record<DomainId, Record<LangCode, { greeting: string; options: string[]; placeholder: string }>> = {
  shopping: {
    en: { greeting: "Hello! I'm your Cognivox Shopping Assistant. I can help track your order, process returns, or fix payment issues.", options: ["Where's my package?", "Refund status", "Update payment"], placeholder: "Ask about your order..." },
    hi: { greeting: "नमस्ते! मैं आपका कॉग्निवॉक्स शॉपिंग सहायक हूं। मैं आपके ऑर्डर ट्रैक करने, रिटर्न प्रोसेस करने या भुगतान समस्याओं को ठीक करने में मदद कर सकता हूं।", options: ["मेरा पैकेज कहाँ है?", "रिफंड की स्थिति", "भुगतान अपडेट करें"], placeholder: "अपने ऑर्डर के बारे में पूछें..." },
    ta: { greeting: "வணக்கம்! நான் உங்கள் காக்னிவோக்ஸ் ஷாப்பிங் உதவியாளர். உங்கள் ஆர்டரைக் கண்காணிக்கவோ, ரிட்டர்ன்களைச் செயல்படுத்தவோ அல்லது கட்டணச் சிக்கல்களைச் சரிசெய்யவோ என்னால் உதவ முடியும்.", options: ["என் பொதி எங்கே?", "திரும்பப் பெறுதல் நிலை", "கட்டணத்தை புதுப்பிக்க"], placeholder: "உங்கள் ஆர்டரைப் பற்றி கேளுங்கள்..." },
    te: { greeting: "నమస్కారం! నేను మీ కాగ్నివోక్స్ షాపింగ్ అసిస్టెంట్‌ని. మీ ఆర్డర్ని ట్రాక్ చేయడంలో, రిటర్న్లను ప్రాసెస్ చేయడంలో లేదా పేమెంట్ సమస్యలను పరిష్కరించడంలో నేను సహాయపడగలను.", options: ["నా ప్యాకేజీ ఎక్కడ?", "రీఫండ్ స్థితి", "చెల్లింపు అప్‌డేట్"], placeholder: "మీ ఆర్డర్ గురించి అడగండి..." },
    bn: { greeting: "নমস্কার! আমি আপনার কগনিভক্স শপিং অ্যাসিস্ট্যান্ট। আমি আপনার অর্ডার ট্র্যাক করতে, রিটার্ন প্রসেস করতে বা পেমেন্ট সমস্যা সমাধান করতে সাহায্য করতে পারি।", options: ["আমার প্যাকেজ কোথায়?", "রিফান্ডের অবস্থা", "পেমেন্ট আপডেট করুন"], placeholder: "আপনার অর্ডার সম্পর্কে জিজ্ঞাসা করুন..." },
    kn: { greeting: "ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ ಕಾಗ್ನಿವೋಕ್ಸ್ ಶಾಪಿಂಗ್ ಸಹಾಯಕ. ನಿಮ್ಮ ಆರ್ಡರ್ ಟ್ರ್ಯಾಕ್ ಮಾಡಲು, ರಿಟರ್ನ್‌ಗಳನ್ನು ಪ್ರಕ್ರಿಯೆಗೊಳಿಸಲು ಅಥವಾ ಪಾವತಿ ಸಮಸ್ಯೆಗಳನ್ನು ಸರಿಪಡಿಸಲು ನಾನು ಸಹಾಯ ಮಾಡಬಲ್ಲೆ.", options: ["ನನ್ನ ಪ್ಯಾಕೇಜ್ ಎಲ್ಲಿದೆ?", "ರಿಫಂಡ್ ಸ್ಥಿತಿ", "ಪಾವತಿ ನವೀಕರಿಸಿ"], placeholder: "ನಿಮ್ಮ ಆರ್ಡರ್ ಬಗ್ಗೆ ಕೇಳಿ..." },
    ml: { greeting: "നമസ്കാരം! ഞാൻ നിങ്ങളുടെ കോഗ്നിവോക്സ് ഷോപ്പിംഗ് അസിസ്റ്റന്റ് ആണ്. നിങ്ങളുടെ ഓർഡർ ട്രാക്ക് ചെയ്യാനും റിട്ടേണുകൾ പ്രോസസ്സ് ചെയ്യാനും പേയ്മെന്റ് പ്രശ്നങ്ങൾ പരിഹരിക്കാനും എനിക്ക് സഹായിക്കാനാകും.", options: ["എന്റെ പാക്കേജ് എവിടെ?", "റീഫണ്ട് സ്റ്റാറ്റസ്", "പേയ്‌മെന്റ് അപ്‌ഡേറ്റ്"], placeholder: "നിങ്ങളുടെ ഓർഡറിനെക്കുറിച്ച് ചോദിക്കൂ..." },
    mr: { greeting: "नमस्कार! मी तुमचा कॉग्निव्हॉक्स शॉपिंग सहाय्यक आहे. मी तुमची ऑर्डर ट्रॅक करण्यात, रिटर्न प्रोसेस करण्यात किंवा पेमेंटच्या समस्या सोडवण्यात मदत करू शकतो.", options: ["माझे पॅकेज कुठे आहे?", "परतावा स्थिती", "पेमेंट अपडेट करा"], placeholder: "तुमच्या ऑर्डरबद्दल विचारा..." },
    gu: { greeting: "નમસ્તે! હું તમારો કોગ્નિવોક્સ શોપિંગ આસિસ્ટન્ટ છું. હું તમારા ઓર્ડરને ટ્રૅક કરવામાં, રિટર્ન પ્રોસેસ કરવામાં અથવા પેમેન્ટની સમસ્યાઓ ઉકેલવામાં મદદ કરી શકું છું.", options: ["મારું પેકેજ ક્યાં છે?", "રિફંડ સ્ટેટસ", "પેમેન્ટ અપડેટ કરો"], placeholder: "તમારા ઓર્ડર વિશે પૂછો..." },
  },
  railway: {
    en: { greeting: "Railway Enquiry here. I can help with PNR status, live train tracking, and seat availability.", options: ["Check PNR Status", "Live Train Status", "Book Meal"], placeholder: "Enter PNR or train name..." },
    hi: { greeting: "रेलवे पूछताछ यहां है। मैं पीएनआर स्थिति, लाइव ट्रेन ट्रैकिंग और सीट उपलब्धता में मदद कर सकता हूं।", options: ["पीएनआर स्थिति जांचें", "लाइव ट्रेन स्थिति", "भोजन बुक करें"], placeholder: "पीएनआर या ट्रेन का नाम दर्ज करें..." },
    ta: { greeting: "இரயில்வே விசாரணை இங்கே. பிஎன்ஆர் நிலை, நேரடி இரயில் கண்காணிப்பு மற்றும் இருக்கை வசதி ஆகியவற்றிற்கு நான் உதவ முடியும்.", options: ["பிஎன்ஆர் நிலை சரிபார்க்க", "நேரடி இரயில் நிலை", "உணவு முன்பதிவு"], placeholder: "பிஎன்ஆர் அல்லது இரயில் பெயரை உள்ளிடவும்..." },
    te: { greeting: "రైల్వే ఎంక్వైరీ ఇక్కడ ఉంది. నేను PNR స్థితి, లైవ్ ట్రైన్ ట్రాకింగ్ మరియు సీట్ల లభ్యత విషయంలో సహాయం చేయగలను.", options: ["PNR స్థితిని తనిఖీ చేయండి", "లైవ్ ట్రైన్ స్థితి", "భోజనం బుక్ చేయండి"], placeholder: "PNR లేదా రైలు పేరును నమోదు చేయండి..." },
    bn: { greeting: "রেলওয়ে এনকোয়ারি এখানে। আমি পিএনআর স্ট্যাটাস, লাইভ ট্রেন ট্র্যাকিং এবং আসন প্রাপ্যতা সম্পর্কে সাহায্য করতে পারি।", options: ["পিএনআর স্ট্যাটাস চেক", "লাইভ ট্রেন স্ট্যাটাস", "খাবার বুক করুন"], placeholder: "পিএনআর বা ট্রেনের নাম লিখুন..." },
    kn: { greeting: "ರೈಲ್ವೆ ವಿಚಾರಣೆ ಇಲ್ಲಿದೆ. ನಾನು PNR ಸ್ಥಿತಿ, ಲೈವ್ ರೈಲು ಟ್ರ್ಯಾಕಿಂಗ್ ಮತ್ತು ಸೀಟು ಲಭ್ಯತೆಗೆ ಸಹಾಯ ಮಾಡಬಲ್ಲೆ.", options: ["PNR ಸ್ಥಿತಿ ಪರಿಶೀಲಿಸಿ", "ಲೈವ್ ರೈಲು ಸ್ಥಿತಿ", "ಊಟ ಬುಕ್ ಮಾಡಿ"], placeholder: "PNR ಅಥವಾ ರೈಲು ಹೆಸರು ನಮೂದಿಸಿ..." },
    ml: { greeting: "റെയിൽവേ എൻക്വയറി ഇവിടെയുണ്ട്. PNR സ്റ്റാറ്റസ്, ലൈവ് ട്രെയിൻ ട്രാക്കിംഗ്, സീറ്റ് ലഭ്യത എന്നിവയിൽ എനിക്ക് സഹായിക്കാനാകും.", options: ["PNR സ്റ്റാറ്റസ് నోക്കൂ", "లైవ్ ട്രെയിൻ സ്റ്റാറ്റസ്", "ഭക്ഷണം ബുക്ക് ചെയ്യൂ"], placeholder: "PNR അല്ലെങ്കിൽ ട്രെയിൻ പേര് നൽകുക..." },
    mr: { greeting: "रेल्वे चौकशी येथे उपलब्ध. मी पीएनआर स्थिती, लाइव्ह ट्रेन ट्रॅकिंग आणि सीट उपलब्धतेसाठी मदत करू शकतो.", options: ["पीएनआर स्थिती तपासा", "लाइव्ह ट्रेन स्थिती", "जेवण बुक करा"], placeholder: "पीएनआर किंवा ट्रेनचे नाव टाका..." },
    gu: { greeting: "રેલ્વે પૂછપરછ અહીં ઉપલબ્ધ છે. હું PNR સ્ટેટસ, લાઇવ ટ્રેન ટેકિંગ અને સીટની ઉપલબ્ધતામાં મદદ કરી શકું છું.", options: ["PNR સ્ટેટસ ચેક કરો", "લાઇવ ટ્રેન સ્ટેટસ", "ભોજન બુક કરો"], placeholder: "PNR અથવા ટ્રેનનું નામ દાખલ કરો..." },
  },
  banking: {
    en: { greeting: "Cognivox Bank Support. Need help with account balance, card blocking, or loan applications?", options: ["Check Balance", "Block Card", "Loan Interest Rate"], placeholder: "Ask about your account..." },
    hi: { greeting: "कॉग्निवॉक्स बैंक सहायता। खाता शेष राशि, कार्ड ब्लॉक करने या ऋण आवेदनों के लिए सहायता चाहिए?", options: ["बैलेंस चेक करें", "कार्ड ब्लॉक करें", "ऋण ब्याज दर"], placeholder: "अपने खाते के बारे में पूछें..." },
    ta: { greeting: "காக்னிவோக்ஸ் வங்கி ஆதரவு. கணக்கு இருப்பு, கார்டு பிளாக்கிங் அல்லது கடன் விண்ணப்பங்களுக்கு உதவி தேவையா?", options: ["இருப்பு சோதிக்க", "கார்டை பிளாக் செய்ய", "கடன் வட்டி விகிதம்"], placeholder: "உங்கள் கணக்கு பற்றி கேளுங்கள்..." },
    te: { greeting: "కాగ్నివోక్స్ బ్యాంక్ సపోర్ట్. అకౌంట్ బ్యాలెన్స్, కార్డ్ బ్లాకింగ్ లేదా లోన్ అపాయింట్‌మెంట్ అభ్యర్థించాలా?", options: ["బ్యాలెన్స్ తనిఖీ చేయండి", "కార్డ్‌ని బ్లాక్ చేయి", "లోన్ వడ్డీ రేటు"], placeholder: "ఆకౌంట్ గురించి అడగండి..." },
    bn: { greeting: "কগনিভক্স ব্যাঙ্ক সাপোর্ট। অ্যাকাউন্ট ব্যালেন্স, কার্ড ব্লকিং বা লোন অ্যাপ্লিকেশনের জন্য সাহায্য প্রয়োজন?", options: ["ব্যালেন্স চেক করুন", "কার্ড ব্লক করুন", "লোন সুদের হার"], placeholder: "আপনার অ্যাকাউন্ট সম্পর্কে জিজ্ঞাসা করুন..." },
    kn: { greeting: "ಕಾಗ್ನಿವೋಕ್ಸ್ ಬ್ಯಾಂಕ್ ಬೆಂಬಲ. ಖಾತೆಯ ಬ್ಯಾಲೆನ್ಸ್, ಕಾರ್ಡ್ ಬ್ಲಾಕಿಂಗ್ ಅಥವಾ ಸಾಲದ ಅರ್ಜಿಗಳ ಬಗ್ಗೆ ಸಹಾಯ ಬೇಕೆ?", options: ["ಬ್ಯಾಲೆన్స్ ಪರಿಶೀಲಿಸಿ", "ಕಾರ್ಡ್ ಬ್ಲಾಕ್ ಮಾಡಿ", "ಸಾಲದ ಬಡ್ಡಿ ದರ"], placeholder: "ನಿಮ್ಮ ಖಾತೆಯ ಬಗ್ಗೆ ಕೇಳಿ..." },
    ml: { greeting: "കോഗ്നിവോക്സ് ബാങ്ക് സപ്പോർട്ട്. അക്കൗണ്ട് ബാലൻസ്, കാർഡ് ബ്ലോക്കിംഗ് അല്ലെങ്കിൽ ലോൺ അപേക്ഷകൾ എന്നിവയിൽ സഹായം വേണോ?", options: ["ബാലൻസ് പരിശോധിക്കൂ", "കാർഡ് ബ്ലോക്ക് ചെയ്യൂ", "ലോൺ പലിശ നിരക്ക്"], placeholder: "നിങ്ങളുടെ അക്കൗണ്ടിനെക്കുറിച്ച് ചോദിക്കൂ..." },
    mr: { greeting: "कॉग्निव्हॉक्स बँक सपोर्ट. खाते शिल्लक, कार्ड ब्लॉक करणे किंवा कर्ज अर्जांसाठी मदत हवी आहे का?", options: ["शिल्लक तपासा", "कार्ड ब्लॉक करा", "कर्ज व्याज दर"], placeholder: "तुमच्या खात्याबद्दल विचారా..." },
    gu: { greeting: "કોગ્નિવોક્સ બેંક સપોર્ટ. ખાતાના બેલેન્સ, કાર્ડ બ્લોકિંગ અથવા લોન અરજીઓ માટે મદદ જોઈએ છે?", options: ["બેલેન્સ ચેક કરો", "કાર્ડ બ્લોક કરો", "લોન વ્યાજ દર"], placeholder: "તમારા ખાતા વિશે પૂછો..." },
  },
  broadband: { 
    en: { greeting: "Broadband Support here. Facing slow speeds or connection issues?", options: ["Internet slow", "Connection down", "Bill details"], placeholder: "Ask about your internet..." },
    hi: { greeting: "ब्रॉडबैंड सपोर्ट यहां है। धीमी गति या कनेक्शन की समस्याओं का सामना कर रहे हैं?", options: ["इंटरनेट धीमा", "कनेक्शन डाउन", "बिल विवरण"], placeholder: "अपने इंटरनेट के बारे में पूछें..." },
    ta: { greeting: "பிராட்பேண்ட் ஆதரவு இங்கே. மெதுவான வேகம் அல்லது இணைப்பு சிக்கல்களை எதிர்கொள்கிறீர்களா?", options: ["இணையம் மெதுவானது", "இணைப்பு துண்டிக்கப்பட்டது", "கட்டண விவரங்கள்"], placeholder: "உங்கள் இணையத்தைப் பற்றி கேளுங்கள்..." },
    te: { greeting: "బ్రాడ్‌బ్యాండ్ సపోర్ట్ ఇక్కడ ఉంది. తక్కువ వేగం లేదా కనెక్షన్ సమస్యలను ఎదుర్కొంటున్నారా?", options: ["ఇంటర్నెట్ స్లో", "కనెక్షన్ డౌన్", "బిల్లు వివరాలు"], placeholder: "మీ ఇంటర్నెట్ గురించి అడగండి..." },
    bn: { greeting: "ব্রডব্যান্ড সাপোর্ট এখানে। ধীর গতি বা সংযোগ সমস্যা সম্মুখীন?", options: ["ইন্টারনেট ধীর", "সংযোগ বন্ধ", "বিল বিবরণ"], placeholder: "আপনার ইন্টারনেট সম্পর্কে জিজ্ঞাসা করুন..." },
    kn: { greeting: "ಬ್ರಾಡ್‌ಬ್ಯಾಂಡ್ ಬೆಂಬಲ ಇಲ್ಲಿದೆ. ನಿಧಾನಗತಿಯ ವೇಗ ಅಥವಾ ಸಂಪರ್ಕ ಸಮಸ್ಯೆಗಳನ್ನು ಎದುರಿಸುತ್ತಿದ್ದೀರಾ?", options: ["ಇಂಟರ್ನೆಟ್ ನಿಧಾನ", "ಸಂಪರ್ಕ ಕಡಿತ", "ಬಿಲ್ ವಿವರಗಳು"], placeholder: "ನಿಮ್ಮ ಇಂಟರ್ನೆಟ್ ಬಗ್ಗೆ ಕೇಳಿ..." },
    ml: { greeting: "ബ്രോഡ്‌ബാൻഡ് സപ്പോർട്ട് ഇവിടെയുണ്ട്. വേഗത കുറവോ കണക്ഷൻ പ്രശ്നങ്ങളോ നേരിടുന്നുണ്ടോ?", options: ["ഇന്റർനെറ്റ് വേഗത കുറവ്", "കണക്ഷൻ ഇല്ല", "ബിൽ വിവരങ്ങൾ"], placeholder: "നിങ്ങളുടെ ഇന്റർനെറ്റിനെക്കുറിച്ച് ചോദിക്കൂ..." },
    mr: { greeting: "ब्रॉडबँड सपोर्ट येथे आहे. कमी वेग किंवा कनेक्शनच्या समस्या येत आहेत का?", options: ["इंटरनेट स्लो", "कनेक्शन डाउन", "बिल तपशील"], placeholder: "तुमच्या इंटरनेटबद्दल विचारा..." },
    gu: { greeting: "બ્રોડબેન્ડ સપોર્ટ અહીં છે. બ્રોડબેન્ડ ફુલ ધીમી ગતિ અથવા કનેક્શન સમસ્યાઓ છે?", options: ["ઇન્ટરનેટ ધીમું", "કનેક્શન ડાઉન", "બિલ વિગતો"], placeholder: "તમારા ઇન્ટરનેટ વિશે પૂછો..." },
  },
  healthcare: {
    en: { greeting: "Healthcare Assistant online. Need to book a doctor appointment or check reports?", options: ["Book Appointment", "Lab Reports", "Home Delivery"], placeholder: "Ask about health services..." },
    hi: { greeting: "हेल्थकेयर सहायक ऑनलाइन। डॉक्टर की नियुक्ति बुक करनी है या रिपोर्ट देखनी है?", options: ["अपॉइंटमेंट बुक करें", "लैब रिपोर्ट", "होम डिलीवरी"], placeholder: "स्वास्थ्य सेवाओं के बारे में पूछें..." },
    ta: { greeting: "சுகாதார உதவியாளர் ஆன்லைனில். மருத்துவர் சந்திப்பை முன்பதிவு செய்ய வேண்டுமா அல்லது அறிக்கைகளைச் சரிபார்க்க வேண்டுமா?", options: ["சந்திப்பை முன்பதிவு", "ஆய்வக அறிக்கைகள்", "வீட்டு விநியோகம்"], placeholder: "சுகாதார சேவைகள் பற்றி கேளுங்கள்..." },
    te: { greeting: "హెల్త్‌కేర్ అసిస్టెంట్ ఆన్‌లైన్‌లో ఉన్నారు. డాక్టర్ అపాయింట్‌మెంట్ బుక్ చేయాలా లేదా రిపోర్ట్‌లను చెక్ చేయాలా?", options: ["అపాయింట్‌మెంట్ బుక్", "ల్యాబ్ రిపోర్ట్స్", "హోమ్ డెలివరీ"], placeholder: "ఆరోగ్య సేవల గురించి అడగండి..." },
    bn: { greeting: "হেলথকেয়ার সহকারী অনলাইন। ডাক্তারের অ্যাপয়েন্টমেন্ট বুক করতে বা রিপোর্ট চেক করতে চান?", options: ["অ্যাপয়েন্টমেন্ট বুক", "ল্যাব রিপোর্ট", "হোম ডেলিভারি"], placeholder: "স্বাস্থ্য পরিষেবা সম্পর্কে জিজ্ঞাসা করুন..." },
    kn: { greeting: "ಹೆಲ್ತ್‌ಕೇರ್ ಸಹಾಯಕ ಆನ್‌ಲೈನ್‌ನಲ್ಲಿದ್ದಾರೆ. ವೈದ್ಯರ ಭೇಟಿ ಬುಕ್ ಮಾಡಬೇಕೆ ಅಥವಾ ವರದಿಗಳನ್ನು ಪರಿಶೀಲಿಸಬೇಕೆ?", options: ["ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ಬುಕ್", "ಲ್ಯಾಬ್ ವರದಿಗಳು", "ಮನೆ ಬಾಗಿಲಿಗೆ ವಿತರಣೆ"], placeholder: "ಆರೋಗ್ಯ ಸೇವೆಗಳ ಬಗ್ಗೆ ಕೇಳಿ..." },
    ml: { greeting: "ഹെൽത്ത് കെയർ അസിസ്റ്റന്റ് ഓൺലൈനിൽ. ഡോക്ടറുടെ അപ്പോയിന്റ്മെന്റ് ബുക്ക് ചെയ്യണോ അതോ റിപ്പോർട്ടുകൾ പരിശോധിക്കണോ?", options: ["അപ്പോയിന്റ്മെന്റ് ബുക്ക്", "ലാബ് റിപ്പോർട്ടുകൾ", "ഹോം ഡെലിവറി"], placeholder: "ആരോഗ്യ സേവനങ്ങളെക്കുറിച്ച് ചോദിക്കൂ..." },
    mr: { greeting: "हेल्थकेअर सहाय्यक ऑनलाइन. डॉक्टरांची भेट बुक करायची आहे की रिपोर्ट तपासायचे आहेत?", options: ["अपॉइंटमेंट बुक करा", "लॅब रिपोर्ट", "होम डिलिव्हरी"], placeholder: "आरोग્ય सेवांबद्दल विचारा..." },
    gu: { greeting: "હેલ્થકેર સહાયક ઓનલાઇન. ડૉક્ટરની એપોઇન્ટમેન્ટ બુક કરવી છે કે રિપોર્ટ ચેક કરવા છે?", options: ["એપોઇન્ટમેન્ટ બુક કરો", "લેબ રિપોર્ટ્સ", "હોમ ડિલિવરી"], placeholder: "આરોગ્ય સેવાઓ વિશે પૂછો..." },
  },
  electricity: {
    en: { greeting: "Electricity Board Helpdesk. Report power cuts or check your current bill.", options: ["Power outage", "Check Bill", "New Connection"], placeholder: "Ask about electricity..." },
    hi: { greeting: "बिजली बोर्ड हेल्पडेस्क। बिजली कटौती की रिपोर्ट करें या अपना वर्तमान बिल जांचें।", options: ["बिजली कटौती", "बिल जांचें", "नया कनेक्शन"], placeholder: "बिजली के बारे में पूछें..." },
    ta: { greeting: "மின்சார வாரிய உதவி மையம். மின்தடையைப் புகாரளிக்கவும் அல்லது உங்கள் தற்போதைய கட்டணத்தைச் சரிபார்க்கவும்.", options: ["மின் தடை", "கட்டணத்தை சரிபார்க்க", "புதிய இணைப்பு"], placeholder: "மின்சாரம் பற்றி கேளுங்கள்..." },
    te: { greeting: "విద్యుత్ బోర్డు హెల్ప్‌డెస్క్. విద్యుత్ కోతల గురించి ఫిర్యాదు చేయండి లేదా మీ బిల్లును తనిఖీ చేయండి.", options: ["విద్యుత్ కోత", "బిల్లు తనిఖీ", "కొత్త కనెక్షన్"], placeholder: "విద్యుత్ గురించి అడగండి..." },
    bn: { greeting: "বিদ্যুৎ বোর্ড হেল্পডেস্ক। বিদ্যুৎ বিভ্রাটের রিপোর্ট করুন বা আপনার বর্তমান বিল পরীক্ষা করুন।", options: ["বিদ্যুৎ বিভ্রাট", "বিল পরীক্ষা করুন", "নতুন সংযোগ"], placeholder: "বিদ্যুৎ সম্পর্কে জিজ্ঞাসা করুন..." },
    kn: { greeting: "ವಿದ್ಯುತ್ ಮಂಡಳಿ ಸಹಾಯ ಕೇಂದ್ರ. ವಿದ್ಯುತ್ ಕಡಿತ ವರదు ಬಳಸಿ ಅಥವಾ ನಿಮ್ಮ ಪ್ರಸ್ತುತ ಬಿಲ್ ಪರಿಶೀಲಿಸಿ.", options: ["ವಿದ್ಯುತ್ ಕಡಿತ", "ಬಿಲ್ ಪರಿಶೀಲಿಸಿ", "ಹೊಸ ಸಂಪರ್ಕ"], placeholder: "ವಿದ್ಯುತ್ ಬಗ್ಗೆ ಕೇಳಿ..." },
    ml: { greeting: "വൈദ്യുതി ബോർഡ് ഹെൽപ്പ് ഡെസ്ക്. പവർ കട്ട് റിപ്പോർട്ട് ചെയ്യുക അല്ലെങ്കിൽ നിങ്ങളുടെ നിലവിലെ ബില്ല് പരിശോധിക്കുക.", options: ["പവർ കട്ട്", "ബില്ല് പരിശോധിക്കൂ", "പുതിയ കണക്ഷൻ"], placeholder: "വൈദ്യുതിയെക്കുറിച്ച് ചോദിക്കൂ..." },
    mr: { greeting: "वीज मंडळ हेल्पडेस्क. वीज कपातीची तक्रार करा किंवा तुमचे चालू बिल तपासा.", options: ["वीज कपात", "बिल तपासा", "नवीन कनेक्शन"], placeholder: "वीज संबंधित विचारा..." },
    gu: { greeting: "વીજળી બોર્ડ હેલ્પડેસ્ક. પાવર કટની જાણ કરો અથવા તમારું વર્તમાન બિલ ચેક કરો.", options: ["પાવર આઉટેજ", "બિલ ચેક કરો", "નવું કનેક્શન"], placeholder: "વીજળી વિશે પૂછો..." },
  }
};

const LANGUAGES: Record<LangCode, { label: string; flag: string }> = {
  en: { label: 'English', flag: '🇬🇧' }, hi: { label: 'हिंदी', flag: '🇮🇳' }, ta: { label: 'தமிழ்', flag: '🇮🇳' }, 
  te: { label: 'తెలుగు', flag: '🇮🇳' }, bn: { label: 'বাংলা', flag: '🇮🇳' }, kn: { label: 'ಕನ್ನಡ', flag: '🇮🇳' }, 
  ml: { label: 'മലയാളം', flag: '🇮🇳' }, mr: { label: 'मराठी', flag: '🇮🇳' }, gu: { label: 'ગુજરાતી', flag: '🇮🇳' },
};

/* ─── Mock Localized Responses ─────────────────────────────────── */
const LOCALIZED_FALLBACKS: Record<LangCode, string> = {
  en: "I've processed your request. How else can I assist you?",
  hi: "मैंने आपके अनुरोध पर कार्रवाई की है। मैं आपकी और किस प्रकार सहायता कर सकता हूँ?",
  ta: "உங்கள் கோரிக்கையை நான் பரிசீலித்தேன். நான் உங்களுக்கு வேறு எப்படி உதவ முடியும்?",
  te: "నేను మీ అభ్యర్థనను ప్రాసెస్ చేసాను. నేను మీకు ఇంకా ఎలా సహాయపడగలను?",
  bn: "আমি আপনার অনুরোধ প্রক্রিয়া করেছি। আমি আপনাকে আর কিভাবে সাহায্য করতে পারি?",
  kn: "ನಾನು ನಿಮ್ಮ ವಿನಂತಿಯನ್ನು ಪ್ರಕ್ರಿಯೆಗೊಳಿಸಿದ್ದೇನೆ. ನಾನು ನಿಮಗೆ ಇನ್ಯಾವ ರೀತಿ ಸಹಾಯ ಮಾಡಬಹುದು?",
  ml: "ഞാൻ നിങ്ങളുടെ അഭ്യർത്ഥന പരിശോധിച്ചു. എനിക്ക് വേറെ എങ്ങനെയൊക്കെ സഹായിക്കാനാകും?",
  mr: "मी तुमच्या विनंतीवर प्रक्रिया केली आहे. मी तुम्हाला अजून कशी मदत करू शकतो?",
  gu: "મેં તમારી વિનંતી પર પ્રક્રિયા કરી છે. હું તમને બીજી કઈ રીતે મદદ કરી શકું?"
};

const THINKING_TEXT: Record<LangCode, string> = {
  en: "Cognivox is thinking...",
  hi: "कॉग्निवॉक्स सोच रहा है...",
  ta: "காக்னிவோக்ஸ் யோசிக்கிறது...",
  te: "కాగ్నివోక్స్ ఆలోచిస్తోంది...",
  bn: "কগনিভক্স ভাবছে...",
  kn: "ಕಾಗ್ನಿವೋಕ್ಸ್ ಯೋಚಿಸುತ್ತಿದೆ...",
  ml: "കോഗ്നിവോക്സ് ചിന്തിക്കുന്നു...",
  mr: "कॉग्निव्हॉक्स विचार करत आहे...",
  gu: "કોગ્નિવોક્સ વિચારી રહ્યું છે..."
};

/* ─── Gemini API call ────────────────────────────────────────────── */
async function askGemini(question: string, apiKey: string, langLabel: string, history: Message[], domain: DomainId): Promise<string> {
  const domainPrompt = DOMAINS[domain].prompt;
  const systemPrompt = `You are Cognivox, a fast, friendly AI chatbot for a contact center. 
${domainPrompt}
Reply in ${langLabel} language only. Keep answers concise and helpful. 
Always reply in the native script of the language. Be warm and professional.`;

  const historyText = history.slice(-6).map(h => `${h.role === 'user' ? 'Customer' : 'Cognivox'}: ${h.content}`).join('\n');
  const prompt = `${systemPrompt}\n\nConversation so far:\n${historyText}\n\nCustomer: ${question}\nCognivox:`;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 250, topP: 0.9 },
      }),
    }
  );
  if (!res.ok) throw new Error(`Gemini error: ${res.status}`);
  const data = await res.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || LOCALIZED_FALLBACKS['en'];
}

/* ─── Main Component ─────────────────────────────────────────────── */
export function ConversationalAgent() {
  const [langCode, setLangCode] = useState<LangCode>('en');
  const [domainId, setDomainId] = useState<DomainId>('shopping');
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [domainMenuOpen, setDomainMenuOpen] = useState(false);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('cognivox_gemini_key') || '');
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [showApiPanel, setShowApiPanel] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const domain = DOMAINS[domainId];
  const lang = LANGUAGES[langCode];
  const data = DOMAIN_DATA[domainId][langCode] || DOMAIN_DATA[domainId]['en'];

  useEffect(() => {
    setMessages([{ id: Date.now(), role: 'ai', content: data.greeting, options: data.options }]);
    setQuery('');
  }, [domainId, langCode]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isTyping]);

  const handleSend = async (e?: React.FormEvent, textOverride?: string) => {
    e?.preventDefault(); const text = textOverride || query; if (!text.trim()) return;
    
    const userMessage: Message = { id: Date.now(), role: 'user', content: text };
    setMessages(prev => [...prev, userMessage]); 
    setQuery('');
    setIsTyping(true);

    try {
      let reply: string;
      if (apiKey) {
        try {
          reply = await askGemini(text, apiKey, lang.label, messages, domainId);
        } catch {
          reply = LOCALIZED_FALLBACKS[langCode] || LOCALIZED_FALLBACKS['en'];
        }
      } else {
        await new Promise(r => setTimeout(r, 1000));
        reply = LOCALIZED_FALLBACKS[langCode] || LOCALIZED_FALLBACKS['en'];
      }
      
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'ai', content: reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'ai', content: "I'm sorry, I encountered an error. Please try again." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const saveKey = () => { localStorage.setItem('cognivox_gemini_key', apiKeyInput); setApiKey(apiKeyInput); setShowApiPanel(false); setApiKeyInput(''); };

  return (
    <div className="h-full flex flex-col xl:flex-row gap-8 animate-in fade-in duration-700">
      {/* Main Console: Neural Chat */}
      <div className="flex-1 flex flex-col gap-6">
        <div className="flex items-center justify-between bg-card/30 backdrop-blur-3xl border border-white/5 p-6 rounded-[32px] shadow-2xl">
            <div className="flex items-center gap-4">
                <div className={cn("p-3.5 rounded-2xl border transition-all shadow-inner", domain.theme)}>
                    {domain.icon && <domain.icon className={cn("w-6 h-6", domain.color)} />}
                </div>
                <div>
                    <h2 className="text-2xl font-black uppercase tracking-tighter italic">
                       Cognivox <span className="text-primary">{domain.label}</span> Agent
                    </h2>
                    <div className="flex items-center gap-2 mt-1">
                       <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                       <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] opacity-60">Session Fully Optimized • {lang.label}</p>
                    </div>
                </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <button onClick={() => setDomainMenuOpen(o => !o)} className={cn("h-11 px-6 bg-secondary/50 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all hover:bg-secondary flex items-center gap-3", domain.color)}>
                   <span>{domain.label.toUpperCase()}</span>
                   <ChevronDown className={cn("w-3 h-3 transition-transform", domainMenuOpen && "rotate-180")} />
                </button>
                {domainMenuOpen && (
                  <div className="absolute right-0 top-full mt-3 w-56 bg-card/95 backdrop-blur-2xl border border-white/10 rounded-[28px] shadow-2xl z-[100] p-2 animate-in zoom-in-95">
                    {(Object.keys(DOMAINS) as DomainId[]).map(id => {
                      const Icon = DOMAINS[id].icon;
                      return (
                        <button key={id} onClick={() => { setDomainId(id); setDomainMenuOpen(false); }} className={cn("w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all", domainId === id ? "bg-primary text-white" : "hover:bg-primary/10 text-muted-foreground hover:text-foreground")}>
                          {Icon && <Icon className={cn("w-4 h-4", DOMAINS[id].color)} />} {DOMAINS[id].label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
              
              <div className="relative">
                <button onClick={() => setLangMenuOpen(o => !o)} className="h-11 px-6 bg-secondary/50 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all hover:bg-secondary flex items-center gap-3">
                   <span>{lang.flag} {lang.label.toUpperCase()}</span>
                   <ChevronDown className={cn("w-3 h-3 transition-transform", langMenuOpen && "rotate-180")} />
                </button>
                {langMenuOpen && (
                  <div className="absolute right-0 top-full mt-3 w-56 bg-card/95 backdrop-blur-2xl border border-white/10 rounded-[28px] shadow-2xl z-[100] p-2 animate-in zoom-in-95 max-h-[60vh] overflow-y-auto">
                    {(Object.keys(LANGUAGES) as LangCode[]).map(code => (
                      <button key={code} onClick={() => { setLangCode(code); setLangMenuOpen(false); }} className={cn("w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all", langCode === code ? "bg-primary text-white" : "hover:bg-primary/10 text-muted-foreground hover:text-foreground")}>
                        <span>{LANGUAGES[code].flag}</span> {LANGUAGES[code].label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
        </div>

        <div className="flex-1 bg-card/10 backdrop-blur-md border border-white/5 rounded-[48px] flex flex-col overflow-hidden shadow-2xl relative">
            <div className={cn("absolute inset-x-0 top-0 h-1 z-20 transition-all duration-1000", domainId === 'shopping' ? 'bg-rose-500' : domainId === 'banking' ? 'bg-blue-500' : domainId === 'railway' ? 'bg-orange-500' : domainId === 'broadband' ? 'bg-purple-500' : domainId === 'healthcare' ? 'bg-emerald-500' : 'bg-yellow-500')} />
            
            <div className="flex-1 overflow-y-auto p-10 flex flex-col gap-8 scrollbar-none relative z-10">
              <div className="flex flex-col items-center justify-center py-12 text-center space-y-4 opacity-40">
                  <div className="p-4 bg-primary/10 rounded-3xl border border-primary/20">
                      <BrainCircuit className="w-8 h-8 text-primary animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-[0.4em]">Neural Handshake Established</h4>
                    <p className="text-[10px] font-bold uppercase tracking-widest mt-1">Ready for communication protocols</p>
                  </div>
              </div>

              {messages.map(msg => (
                <div key={msg.id} className={cn("flex flex-col gap-3 animate-in slide-in-from-bottom-6 duration-500", msg.role === 'user' ? "items-end" : "items-start")}>
                  <div className="flex items-center gap-3 px-1 mb-1">
                      {msg.role === 'ai' && <LayoutGrid className={cn("w-3 h-3 opacity-40", domain.color)} />}
                      <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-40">{msg.role === 'user' ? 'Local Identity' : 'Neural Hub'}</span>
                      {msg.role === 'user' && <User className="w-3 h-3 text-primary opacity-40" />}
                  </div>

                  <div className={cn(
                    "px-7 py-4.5 rounded-[32px] text-[15px] leading-relaxed shadow-lg transition-all hover:scale-[1.01] border",
                    msg.role === 'user' 
                      ? "bg-primary text-white border-primary/20 rounded-tr-none shadow-primary/20" 
                      : "bg-card/40 backdrop-blur-2xl border-white/5 text-foreground rounded-tl-none"
                  )}>
                    {msg.content}
                  </div>
                  
                  {msg.options && (
                    <div className="flex flex-wrap gap-2.5 mt-2 ml-4">
                      {msg.options.map((opt, i) => (
                        <button key={i} onClick={() => handleSend(undefined, opt)} className="px-5 py-2.5 bg-background/40 hover:bg-primary text-muted-foreground hover:text-white border border-white/5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 hover:shadow-lg hover:shadow-primary/20">
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-4 p-5 bg-white/5 rounded-[28px] border border-white/5 animate-pulse ml-2 w-fit">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
                    <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
                    <div className="w-2 h-2 rounded-full bg-primary animate-bounce" />
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-widest text-primary italic">{THINKING_TEXT[langCode].toUpperCase()}</span>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            <div className="p-8 bg-black/40 backdrop-blur-3xl border-t border-white/5">
               <form onSubmit={handleSend} className="relative flex items-center gap-4">
                  <div className="flex-1 relative group">
                    <input 
                       type="text" 
                       value={query} 
                       onChange={e => setQuery(e.target.value)} 
                       className="w-full bg-secondary/30 rounded-[28px] pl-10 pr-20 py-6 outline-none border border-white/5 focus:border-primary/50 focus:bg-secondary/50 transition-all font-bold text-xs tracking-widest placeholder:text-muted-foreground/30 uppercase" 
                       placeholder={data.placeholder.toUpperCase()} 
                    />
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 flex gap-3">
                        <button type="submit" className="p-4 bg-primary text-white rounded-2xl shadow-[0_10px_30px_rgba(139,92,246,0.3)] hover:scale-110 transition-all active:scale-95 group"> 
                           <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /> 
                        </button>
                    </div>
                  </div>
               </form>
            </div>
        </div>
      </div>

      {/* Intelligence Sidebar */}
      <div className="w-full xl:w-96 flex flex-col gap-6 py-2">
        <div className="bg-card/30 backdrop-blur-3xl border border-white/5 rounded-[40px] p-8 shadow-2xl relative overflow-hidden group">
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all" />
          
          <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8"> 
                <div className="p-3 bg-primary/20 rounded-2xl border border-primary/30 shadow-inner"> 
                    <BrainCircuit className="w-6 h-6 text-primary" /> 
                </div> 
                <div>
                   <h3 className="text-sm font-black uppercase tracking-widest italic">Core Intelligence</h3>
                   <p className="text-[10px] font-bold text-muted-foreground opacity-60">Status: Fully Operational</p>
                </div>
              </div>

              <div className="space-y-8">
                <div className="space-y-4"> 
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 block px-2">Neural Engine</label> 
                  <div className="bg-background/40 p-5 rounded-[24px] border border-white/5 shadow-inner"> 
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-black italic tracking-tight">{apiKey ? 'Gemini 1.5 Pro' : 'Smart Core Fallback'}</span> 
                        <div className={cn("w-2.5 h-2.5 rounded-full", apiKey ? "bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]" : "bg-amber-500")} /> 
                    </div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-relaxed">
                        {apiKey ? 'Real-time multi-modal processing enabled for enhanced domain reasoning.' : 'Running on localized interaction protocols with specialized classification.'}
                    </p>
                  </div> 
                </div>

                <div className="space-y-4"> 
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 block px-2">Domain Assets</label> 
                  <div className="grid grid-cols-2 gap-3">
                    {['Neural Handoff', 'Smart Triage', 'Context Memory', 'Protocol Sync'].map((cap, i) => (
                      <div key={i} className="flex items-center gap-3 bg-background/20 p-3.5 rounded-2xl border border-white/5 group/cap">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary group-hover/cap:scale-150 transition-all shadow-[0_0_8px_rgba(139,92,246,0.5)]" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/80">{cap}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <button onClick={() => setShowApiPanel(p => !p)} className="w-full mt-10 py-5 bg-secondary/50 hover:bg-secondary border border-white/10 rounded-[24px] text-[10px] font-black uppercase tracking-[0.4em] transition-all text-muted-foreground hover:text-white shadow-xl"> 
                {apiKey ? 'REMAP INTELLIGENCE' : 'ACTIVATE ENGINE'} 
              </button>
          </div>
        </div>
        
        {showApiPanel && (
          <div className="p-8 bg-card/60 backdrop-blur-3xl border border-primary/30 rounded-[32px] shadow-2xl animate-in slide-in-from-right-8 fade-in duration-500">
            <h4 className="text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-3 italic"><Key className="w-4 h-4 text-primary" /> Key Injection</h4>
            <div className="space-y-4">
              <input 
                type="password" 
                value={apiKeyInput} 
                onChange={e => setApiKeyInput(e.target.value)} 
                placeholder="ENTER NEURAL KEY..." 
                className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-xs font-mono outline-none focus:border-primary/50 transition-all text-primary" 
              />
              <button onClick={saveKey} className="w-full py-4 bg-primary text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl shadow-xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all">Enable Neural Core</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
