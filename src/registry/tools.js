import {AlignLeft, Calculator, CheckSquare, FileCode2, FileImage, FileText, Gamepad2, Image, KeyRound, Link2, ListChecks, Mic, NotebookPen, QrCode, SearchCheck, Timer, Type, Video, Volume2} from "lucide-react";

export const CATEGORIES = ["Text", "Developer", "Calculators", "Productivity", "Security", "Games"];

export const TOOLS = [
  {id:"todo",title:"To-Do List",description:"Plan and track your daily tasks.",category:"Productivity",icon:CheckSquare,route:"/todo",keywords:["tasks","planning","checklist"],requiresLogin:true,status:"live"},
  {id:"pdf-to-word",title:"PDF to Word Converter",description:"Convert PDF files to editable Word documents.",category:"PDF",icon:FileText,route:"/converter",keywords:["document","docx","convert"],requiresLogin:false,status:"live"},
  {id:"password",title:"Password Generator",description:"Create strong passwords privately.",category:"Security",icon:KeyRound,route:"/password",keywords:["secure","random","credentials"],requiresLogin:false,status:"live"},
  {id:"qr",title:"QR Code Generator",description:"Turn links and text into scannable codes.",category:"Productivity",icon:QrCode,route:"/qr",keywords:["barcode","link","scan"],requiresLogin:false,status:"live"},
  {id:"pomodoro",title:"Pomodoro Timer",description:"Focus in calm, accurate intervals.",category:"Productivity",icon:Timer,route:"/pomodoro",keywords:["focus","timer","break"],requiresLogin:false,status:"live"},
  {id:"image-compressor",title:"Image Compressor",description:"Shrink images without uploading them.",category:"Image",icon:Image,route:"/image-compressor",keywords:["jpg","png","webp","optimize"],requiresLogin:false,status:"live"},
  {id:"notes",title:"Notes",description:"Capture ideas before they disappear.",category:"Text",icon:NotebookPen,route:"/notes",keywords:["writing","memo","editor"],requiresLogin:true,status:"live"},
  {id:"word-counter",title:"Word & Character Counter",description:"Count words, characters, sentences, and reading time.",category:"Text",icon:AlignLeft,route:"/word-counter",keywords:["word count","characters","writing"],requiresLogin:false,status:"live"},
  {id:"case-converter",title:"Case Converter",description:"Convert text between common naming and writing styles.",category:"Text",icon:Type,route:"/case-converter",keywords:["uppercase","lowercase","camel case"],requiresLogin:false,status:"live"},
  {id:"text-diff",title:"Text Diff Checker",description:"Compare two versions of text line by line.",category:"Text",icon:FileCode2,route:"/text-diff",keywords:["compare","changes","difference"],requiresLogin:false,status:"live"},
  {id:"lorem-ipsum",title:"Lorem Ipsum Generator",description:"Generate placeholder paragraphs, sentences, or words.",category:"Text",icon:FileText,route:"/lorem-ipsum",keywords:["placeholder","dummy text"],requiresLogin:false,status:"live"},
  {id:"markdown-editor",title:"Markdown Editor",description:"Write Markdown with a safe live preview.",category:"Text",icon:FileCode2,route:"/markdown-editor",keywords:["markdown","preview","document"],requiresLogin:false,status:"live"},
  {id:"find-replace",title:"Find & Replace",description:"Search, highlight, and replace text with regex support.",category:"Text",icon:SearchCheck,route:"/find-replace",keywords:["regex","search","replace"],requiresLogin:false,status:"live"},
  {id:"line-tools",title:"Line Tools",description:"Sort, clean, reverse, and deduplicate lines.",category:"Text",icon:ListChecks,route:"/line-tools",keywords:["sort","lines","dedupe"],requiresLogin:false,status:"live"},
  {id:"slug-generator",title:"Slug Generator",description:"Create clean URL-friendly slugs, including bulk mode.",category:"Text",icon:Link2,route:"/slug-generator",keywords:["url","seo","permalink"],requiresLogin:false,status:"live"},
  {id:"text-to-speech",title:"Text to Speech",description:"Listen to text using your browser voice engine.",category:"Text",icon:Volume2,route:"/text-to-speech",keywords:["voice","audio","read aloud"],requiresLogin:false,status:"live"},
  {id:"speech-to-text",title:"Speech to Text",description:"Transcribe speech with your browser microphone.",category:"Text",icon:Mic,route:"/speech-to-text",keywords:["transcribe","microphone","dictation"],requiresLogin:false,status:"live"},
  {id:"json-formatter",title:"JSON Formatter & Validator",description:"Pretty-print, minify, and validate JSON locally.",category:"Developer",icon:FileCode2,route:"/json-formatter",keywords:["json","pretty print","validate","api"],requiresLogin:false,status:"live"},
  {id:"password-strength",title:"Password Strength Checker",description:"Estimate password entropy and get practical tips.",category:"Security",icon:KeyRound,route:"/password-strength",keywords:["entropy","security","password"],requiresLogin:false,status:"live"},
  {id:"emi-calculator",title:"EMI / Loan Calculator",description:"Estimate monthly payments and repayment interest.",category:"Calculators",icon:Calculator,route:"/emi-calculator",keywords:["loan","mortgage","interest","amortization"],requiresLogin:false,status:"live"},
  {id:"percentage-calculator",title:"Percentage Calculator",description:"Solve common percentage problems with explanations.",category:"Calculators",icon:Calculator,route:"/percentage-calculator",keywords:["percent","increase","change"],requiresLogin:false,status:"live"},
  {id:"velocity-rush",title:"Velocity Rush",description:"Dodge traffic and chase the highest score on an endless highway.",category:"Games",icon:Gamepad2,route:"/velocity-rush",keywords:["racing","arcade","car","game"],requiresLogin:false,status:"live"},
  {id:"youtube-downloader",title:"YouTube Downloader",description:"Save videos for offline use.",category:"Media",icon:Video,route:"/youtube-downloader",keywords:["video","media"],requiresLogin:false,status:"coming-soon"},
  {id:"merge-pdf",title:"Merge PDF",description:"Bring documents together in one file.",category:"PDF",icon:FileText,route:"/merge-pdf",keywords:["documents","combine"],requiresLogin:false,status:"coming-soon"},
  {id:"expense-tracker",title:"Expense Tracker",description:"See where your money goes.",category:"Calculators",icon:Calculator,route:"/expense-tracker",keywords:["budget","money","finance"],requiresLogin:false,status:"coming-soon"},
  {id:"image-editor",title:"Image Editor",description:"Make quick edits to images in your browser.",category:"Image",icon:FileImage,route:"/image-editor",keywords:["crop","resize","photo"],requiresLogin:false,status:"coming-soon"},
  {id:"code-playground",title:"Code Playground",description:"Experiment with snippets in a safe space.",category:"Developer",icon:FileText,route:"/code-playground",keywords:["code","developer","javascript"],requiresLogin:false,status:"coming-soon"},
  {id:"number-games",title:"Number Games",description:"Take a short break with quick puzzles.",category:"Games",icon:Gamepad2,route:"/number-games",keywords:["puzzle","fun"],requiresLogin:false,status:"coming-soon"},
];
export const toolByRoute=route=>TOOLS.find(tool=>tool.route===route);
export const toolById=id=>TOOLS.find(tool=>tool.id===id);
export function recordRecent(route){const tool=toolByRoute(route);if(!tool||tool.status!=="live")return;try{const old=JSON.parse(localStorage.getItem("toolbox_recent")||"[]");localStorage.setItem("toolbox_recent",JSON.stringify([tool.id,...old.filter(id=>id!==tool.id)].slice(0,5)))}catch{}}
export function readRecent(){try{return JSON.parse(localStorage.getItem("toolbox_recent")||"[]")}catch{return[]}}
export function favoritesKey(){const user=sessionStorage.getItem("taskora_logged_in")?"mystic":"guest";return `toolbox_favorites_${user}`}
export function readFavorites(){try{return JSON.parse(localStorage.getItem(favoritesKey())||"[]")}catch{return[]}}
export function toggleFavorite(id){const next=readFavorites();const updated=next.includes(id)?next.filter(x=>x!==id):[...next,id];localStorage.setItem(favoritesKey(),JSON.stringify(updated));return updated}
