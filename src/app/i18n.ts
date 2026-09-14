// English is the source language: UI strings are written in English in the components and
// looked up here for other languages. Missing entries fall back to the English text.
export type Lang = "en" | "my";

// Myanmar translations as supplied, grouped by screen.
const MY_SECTIONS: Record<string, Record<string, string>> = {
  smart_play_bundle_card: {
    "Level Up with Smart Play": "Smart Play ဖြင့် အဆင့်မြှင့်တင်ပါ",
    "Quiz practice, speaking, and games — three apps working together as your daily learning habit.": "ဉာဏ်စမ်းပဟေဠိလေ့ကျင့်ခန်း၊ စကားပြောခြင်းနှင့် ဂိမ်းများ — သင့်နေ့စဉ်သင်ယူမှုအလေ့အထအဖြစ် အတူတကွလုပ်ဆောင်သော အက်ပ်သုံးခု။",
    "SMART PLAY": "SMART PLAY",
    "Smart Play": "Smart Play",
    "For learning, speaking & play": "သင်ယူခြင်း၊ စကားပြောခြင်းနှင့် ကစားခြင်းအတွက်",
    "QuizPro": "QuizPro",
    "SpeakEasy": "SpeakEasy",
    "PlayVerse": "PlayVerse",
    "Open package details": "ပက်ကေ့ဂျ်အသေးစိတ်အချက်အလက်များကို ဖွင့်ပါ",
    "SMP+": "SMP+",
    "grow daily": "နေ့စဉ်ကြီးထွားပါ",
  },
  smart_play_bundle_detail: {
    "LINKIT360 · SMART PLAY": "LINKIT360 · SMART PLAY",
    "Smart Play": "Smart Play",
    "Smart Play brings together quiz practice, real speaking, and a colorful game into one playful daily learning habit.": "Smart Play သည် ဉာဏ်စမ်းပဟေဠိလေ့ကျင့်ခန်း၊ တကယ့်စကားပြောခြင်းနှင့် ရောင်စုံဂိမ်းတစ်ခုကို နေ့စဉ်ပျော်ရွှင်ဖွယ်သင်ယူမှုအလေ့အထတစ်ခုအဖြစ် ပေါင်းစပ်ထားသည်။",
    "BEST FOR": "အကောင်းဆုံးအတွက်",
    "Quiz practice": "ဉာဏ်စမ်းပဟေဠိလေ့ကျင့်ခန်း",
    "Speaking practice": "စကားပြောလေ့ကျင့်ခန်း",
    "Casual gaming": "ပေါ့ပေါ့ပါးပါးဂိမ်းကစားခြင်း",
    "Daily learning": "နေ့စဉ်သင်ယူမှု",
    "INCLUDED PRODUCTS": "ပါဝင်သောထုတ်ကုန်များ",
    "QuizPro": "QuizPro",
    "Gamified quiz app turning learning into play with adaptive questions.": "သင်ယူမှုကို လိုက်လျောညီထွေဖြစ်စေသောမေးခွန်းများဖြင့် ကစားနည်းအဖြစ်ပြောင်းလဲပေးသည့် ဂိမ်းပုံစံဉာဏ်စမ်းပဟေဠိအက်ပ်။",
    "mm.quizpro.mobi": "mm.quizpro.mobi",
    "SpeakEasy": "SpeakEasy",
    "AI language app focused on real speaking practice and fluency.": "တကယ့်စကားပြောလေ့ကျင့်ခန်းနှင့် ကျွမ်းကျင်မှုကို အာရုံစိုက်သည့် AI ဘာသာစကားအက်ပ်။",
    "speakeasy.mobi": "speakeasy.mobi",
    "PlayVerse": "PlayVerse",
    "The Mega Combo catalogue — 100 instant-play HTML5 games: puzzle, arcade, action, racing and more.": "Mega Combo ကတ်တလောက် — ချက်ချင်းကစားနိုင်သော HTML5 ဂိမ်း ၁၀၀- ပဟေဠိ၊ အာကိတ်၊ အက်ရှင်၊ ပြိုင်ကားနှင့် အခြားအရာများ။",
    "Browse 100 games": "ဂိမ်း ၁၀၀ ကို ကြည့်ရှုပါ",
    "WHAT YOU GET": "သင်ရရှိသောအရာများ",
    "3 apps, one subscription": "အက်ပ် ၃ ခု၊ စာရင်းသွင်းမှုတစ်ခု",
    "Learn through play": "ကစားခြင်းဖြင့် သင်ယူပါ",
    "100 PlayVerse games": "PlayVerse ဂိမ်း ၁၀၀",
    "Premium features unlocked": "ပရီမီယံအင်္ဂါရပ်များ လော့ခ်ဖွင့်ထားသည်",
  },
};

// Source strings as the components write them (section labels are title case and uppercased
// by CSS; game counts are a {n} placeholder so they follow the catalogue size).
const ALIASES: Record<string, string> = {
  "Best for": "အကောင်းဆုံးအတွက်",
  "Included products": "ပါဝင်သောထုတ်ကုန်များ",
  "What you get": "သင်ရရှိသောအရာများ",
  "The Mega Combo catalogue — {n} instant-play HTML5 games: puzzle, arcade, action, racing and more.":
    "Mega Combo ကတ်တလောက် — ချက်ချင်းကစားနိုင်သော HTML5 ဂိမ်း {n}- ပဟေဠိ၊ အာကိတ်၊ အက်ရှင်၊ ပြိုင်ကားနှင့် အခြားအရာများ။",
  "Browse {n} games": "ဂိမ်း {n} ကို ကြည့်ရှုပါ",
  "{n} PlayVerse games": "PlayVerse ဂိမ်း {n}",
};

const MY: Record<string, string> = Object.assign({}, ...Object.values(MY_SECTIONS), ALIASES);

const MYANMAR_DIGITS = "၀၁၂၃၄၅၆၇၈၉";
const toMyanmarDigits = (s: string) => s.replace(/[0-9]/g, d => MYANMAR_DIGITS[Number(d)]);

export function translate(lang: Lang, en: string, vars: Record<string, string | number> = {}) {
  let s = lang === "my" ? MY[en] ?? en : en;
  for (const [k, v] of Object.entries(vars)) {
    s = s.split(`{${k}}`).join(lang === "my" ? toMyanmarDigits(String(v)) : String(v));
  }
  return s;
}

// Default: the saved choice, otherwise Myanmar for Myanmar-language browsers, otherwise English.
export function initialLang(): Lang {
  try {
    const saved = localStorage.getItem("sp-lang");
    if (saved === "en" || saved === "my") return saved;
  } catch { /* storage unavailable */ }
  return typeof navigator !== "undefined" && navigator.language?.toLowerCase().startsWith("my") ? "my" : "en";
}

export function saveLang(lang: Lang) {
  try { localStorage.setItem("sp-lang", lang); } catch { /* storage unavailable */ }
}
