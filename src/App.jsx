import React, { useState, useMemo, useEffect } from 'react';
import { 
  LuPrinter as Printer, LuRefreshCw as RefreshCw, LuPenTool as PenTool, LuHeart as Heart, 
  LuAnchor as Anchor, LuMessageCircle as MessageCircle, LuArrowDown as ArrowDown, LuQuote as Quote, 
  LuEye as Eye, LuCircleAlert as AlertCircle, LuCircleCheck as CheckCircle2, LuLightbulb as Lightbulb, 
  LuArrowRight as ArrowRight, LuShieldAlert as ShieldAlert, LuUsers as Users, LuSparkles as Sparkles, 
  LuBrain as Brain, LuFlower2 as Flower2, LuCircleX as XCircle, LuSkull as Skull, LuSun as Sun, 
  LuFeather as Feather, LuSunrise as Sunrise, LuScale as Scale, LuEar as Ear, LuZap as Zap, 
  LuMusic as Music, LuWind as Wind, LuHourglass as Hourglass, LuRefreshCcw as RefreshCcw, 
  LuLeaf as Leaf, LuBuilding2 as Building2, LuGlobe as Globe, LuLock as Lock, LuLockOpen as Unlock, 
  LuHandshake as Handshake, LuGitCompare as GitCompare, LuFlame as Flame, LuSiren as Siren, 
  LuStickyNote as StickyNote, LuFootprints as Footprints, LuFlag as Flag, LuGhost as Ghost, 
  LuRepeat as Repeat, LuMic as Mic, LuBriefcase as Briefcase, LuLandmark as Landmark, 
  LuGavel as Gavel, LuFileSearch as FileSearch, LuUserCheck as UserCheck, LuLayers as Layers, 
  LuGift as Gift, LuMenu as Menu, LuX as X, LuHouse as Home, LuBookOpen as BookOpen, 
  LuCompass as Compass, LuInfo as Info, LuSearch as Search 
} from 'react-icons/lu';

// --- Google Fonts ---
const fontLink = document.createElement('link');
fontLink.href = 'https://fonts.googleapis.com/css2?family=Shippori+Mincho:wght@400;500;700;900&display=swap';
fontLink.rel = 'stylesheet';
document.head.appendChild(fontLink);

// --- Data Definitions ---
const needsRawData = `
つながり,受け入れられること
つながり,愛情
つながり,認めてもらうこと
つながり,所属・帰属意識
つながり,協力
つながり,コミュニケーション
つながり,信頼
つながり,共感
つながり,安心・安全
つながり,理解してもらう
つながり,誠実さ
つながり,尊重・尊敬
つながり,支え/サポート
遊び,喜び
遊び,ユーモア
遊び,楽しみ
平和,調和
平和,美
平和,秩序
平和,平穏
身体的幸福,休息
身体的幸福,安全
身体的幸福,住まい
身体的幸福,健やかさ
意味,目的
意味,貢献
意味,学び
意味,成長
意味,希望
意味,創造性
意味,効率性
意味,納得感
自主・自立,自由
自主・自立,選択
自主・自立,主体性
自主・自立,空間・余裕
`;

const parseNeeds = (csv) => {
  const lines = csv.trim().split('\n');
  const map = {};
  lines.forEach(line => {
    const [cat, item] = line.split(',');
    if (!map[cat]) map[cat] = [];
    if (item) map[cat].push(item.trim());
  });
  return map;
};
const needsData = parseNeeds(needsRawData);

const feelingsData = {
  satisfied: {
    label: "満たされている（快）",
    categories: {
      "愛情・親しみ": ["愛情に満ちた", "親しみのある", "やさしい", "あたたかさのある", "オープンな", "心を開いた"],
      "喜び・幸福": ["幸福感", "大喜びする", "喜びに満ちた", "嬉しい", "楽しい", "満足している"],
      "感謝・感動": ["感謝している", "ありがたい", "感動している", "感激の", "心に触れた"],
      "活力・熱中": ["力がみなぎる", "夢中だ", "わくわくする", "生き生きした", "情熱的な", "刺激される"],
      "平安・安心": ["安心だ", "ほっとする", "落ち着いた", "穏やかな", "リラックスした", "信頼している"],
      "休息・回復": ["すっきりした", "休息のとれた", "さわやかな", "晴れ晴れした"]
    }
  },
  unsatisfied: {
    label: "満たされていない（不快）",
    categories: {
      "恐れ・不安": ["こわい", "心配で", "不安な", "落ち着かない", "おびえた", "疑い深い"],
      "怒り・嫌悪": ["イライラ", "怒っている", "腹が立つ", "むかつく", "不機嫌", "憤慨する"],
      "混乱・困惑": ["混乱した", "困惑する", "迷っている", "途方に暮れる", "訳が分からない"],
      "悲しみ・痛み": ["悲しい", "傷ついた", "落ち込んだ", "がっかりした", "失望した", "寂しい"],
      "疲労・無力": ["疲れた", "うんざり", "無力感", "圧倒された", "やる気が出ない", "消耗した"],
      "恥・自責": ["恥ずかしい", "情けない", "申し訳ない", "気まずい", "後悔した"]
    }
  }
};

// --- Icon Mapping for Needs Categories ---
const categoryIcons = {
  "つながり": Heart,
  "遊び": Sparkles,
  "平和": Feather,
  "身体的幸福": Sun,
  "意味": Lightbulb,
  "自主・自立": Unlock
};

// --- ReferencePanel Component ---
const ReferencePanel = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('feelings');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">語彙リファレンス</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded">
            <X size={20} />
          </button>
        </div>
        
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('feelings')}
            className={`flex-1 py-3 px-4 font-medium transition-colors ${
              activeTab === 'feelings'
                ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-700'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            感情
          </button>
          <button
            onClick={() => setActiveTab('needs')}
            className={`flex-1 py-3 px-4 font-medium transition-colors ${
              activeTab === 'needs'
                ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-700'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            ニーズ
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'feelings' && (
            <div className="space-y-6">
              {Object.entries(feelingsData).map(([key, section]) => (
                <div key={key}>
                  <h3 className="text-lg font-bold mb-4 text-gray-800">{section.label}</h3>
                  <div className="space-y-4">
                    {Object.entries(section.categories).map(([category, words]) => (
                      <div key={category}>
                        <h4 className="font-semibold text-gray-700 mb-2">{category}</h4>
                        <div className="flex flex-wrap gap-2">
                          {words.map((word, idx) => (
                            <span
                              key={idx}
                              className={`px-3 py-1 rounded-full text-sm ${
                                key === 'satisfied'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {word}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'needs' && (
            <div className="space-y-4">
              {Object.entries(needsData).map(([category, items]) => {
                const Icon = categoryIcons[category] || Heart;
                return (
                  <div key={category}>
                    <h3 className="text-lg font-bold mb-3 text-gray-800 flex items-center gap-2">
                      <Icon size={20} />
                      {category}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {items.map((item, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


// --- Helper Components ---
const SectionTitle = ({ icon: Icon, children, className = "" }) => (
  <h3 className={`text-lg font-bold mb-3 flex items-center gap-2 ${className}`}>
    {Icon && <Icon size={20} />}
    {children}
  </h3>
);

const PauseButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="w-full py-3 px-4 bg-yellow-50 hover:bg-yellow-100 border-2 border-yellow-400 rounded-lg text-yellow-800 font-medium transition-colors flex items-center justify-center gap-2 print:hidden"
  >
    <Hourglass size={18} />
    一時停止して内省する
  </button>
);

const ObservationGuide = () => (
  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 print:border-gray-300">
    <SectionTitle icon={Eye} className="text-blue-900">観察のガイド</SectionTitle>
    <div className="space-y-2 text-sm text-blue-900">
      <p><strong>含める:</strong> 具体的な行動、言葉、できごと</p>
      <p><strong>避ける:</strong> 評価、判断、解釈、一般化</p>
      <div className="mt-3 p-3 bg-white rounded border border-blue-200">
        <p className="font-medium mb-1">例:</p>
        <p className="text-green-700">✓ 「会議で3回発言を遮られました」</p>
        <p className="text-red-700">✗ 「あなたは私を尊重していない」</p>
      </div>
    </div>
  </div>
);

const NeedsGuide = () => (
  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 print:border-gray-300">
    <SectionTitle icon={Heart} className="text-purple-900">ニーズの特定</SectionTitle>
    <div className="space-y-2 text-sm text-purple-900">
      <p>ニーズは普遍的で、特定の人や戦略に依存しません</p>
      <div className="mt-3 p-3 bg-white rounded border border-purple-200">
        <p className="font-medium mb-1">主なカテゴリー:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>つながり（愛情、信頼、理解）</li>
          <li>自主性（自由、選択、主体性）</li>
          <li>意味（目的、成長、貢献）</li>
          <li>身体的幸福（休息、安全、健康）</li>
          <li>平和（調和、美、秩序）</li>
          <li>遊び（楽しみ、喜び、ユーモア）</li>
        </ul>
      </div>
    </div>
  </div>
);


// --- Mode Components ---

// IntroductionMode
const IntroductionMode = () => (
  <div className="space-y-6">
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-300 rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center gap-3">
        <BookOpen size={28} />
        NVCへようこそ
      </h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        NVC（非暴力コミュニケーション）は、マーシャル・ローゼンバーグ博士により開発された、
        思いやりに基づくコミュニケーションと紛争解決の方法です。
      </p>
    </div>

    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <SectionTitle icon={Compass}>4つの要素</SectionTitle>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="p-4 bg-blue-50 rounded-lg">
          <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
            <Eye size={18} />
            1. 観察 (Observation)
          </h4>
          <p className="text-sm text-blue-800">
            評価や判断を交えず、具体的に何が起きたかを述べる
          </p>
        </div>
        <div className="p-4 bg-green-50 rounded-lg">
          <h4 className="font-bold text-green-900 mb-2 flex items-center gap-2">
            <Heart size={18} />
            2. 感情 (Feelings)
          </h4>
          <p className="text-sm text-green-800">
            その観察に対して、自分がどう感じているかを表現する
          </p>
        </div>
        <div className="p-4 bg-purple-50 rounded-lg">
          <h4 className="font-bold text-purple-900 mb-2 flex items-center gap-2">
            <Lightbulb size={18} />
            3. ニーズ (Needs)
          </h4>
          <p className="text-sm text-purple-800">
            その感情の背後にある、満たされている/いないニーズを特定する
          </p>
        </div>
        <div className="p-4 bg-orange-50 rounded-lg">
          <h4 className="font-bold text-orange-900 mb-2 flex items-center gap-2">
            <ArrowRight size={18} />
            4. リクエスト (Request)
          </h4>
          <p className="text-sm text-orange-800">
            ニーズを満たすための、具体的で実行可能なお願いをする
          </p>
        </div>
      </div>
    </div>

    <div className="bg-amber-50 border border-amber-300 rounded-lg p-6">
      <SectionTitle icon={Sparkles}>NVCの目的</SectionTitle>
      <ul className="space-y-2 text-gray-700">
        <li className="flex items-start gap-2">
          <CheckCircle2 size={18} className="mt-1 text-green-600 flex-shrink-0" />
          <span>相互理解と共感に基づく関係性を築く</span>
        </li>
        <li className="flex items-start gap-2">
          <CheckCircle2 size={18} className="mt-1 text-green-600 flex-shrink-0" />
          <span>すべての人のニーズが尊重される解決策を見つける</span>
        </li>
        <li className="flex items-start gap-2">
          <CheckCircle2 size={18} className="mt-1 text-green-600 flex-shrink-0" />
          <span>自分自身と他者への思いやりを深める</span>
        </li>
        <li className="flex items-start gap-2">
          <CheckCircle2 size={18} className="mt-1 text-green-600 flex-shrink-0" />
          <span>非難や批判ではなく、誠実な表現と共感的な聴き方を実践する</span>
        </li>
      </ul>
    </div>

    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
      <SectionTitle icon={Info}>このナビゲーターの使い方</SectionTitle>
      <p className="text-gray-700 mb-4">
        左側のメニューから、目的に応じたモードを選択してください。
        各モードは、特定の状況でNVCを実践するためのガイドを提供します。
      </p>
      <div className="grid md:grid-cols-2 gap-3 text-sm">
        <div className="flex items-start gap-2">
          <MessageCircle size={16} className="mt-1 text-blue-600" />
          <span><strong>対話モード:</strong> 他者との会話</span>
        </div>
        <div className="flex items-start gap-2">
          <Heart size={16} className="mt-1 text-red-600" />
          <span><strong>自己共感:</strong> 自分の内面を探る</span>
        </div>
        <div className="flex items-start gap-2">
          <Sunrise size={16} className="mt-1 text-yellow-600" />
          <span><strong>日常の実践:</strong> 毎日の振り返り</span>
        </div>
        <div className="flex items-start gap-2">
          <Gift size={16} className="mt-1 text-purple-600" />
          <span><strong>感謝:</strong> ポジティブな表現</span>
        </div>
      </div>
    </div>
  </div>
);

// ObservationMode
const ObservationMode = () => {
  const [userInput, setUserInput] = useState('');
  const [analysis, setAnalysis] = useState(null);

  const analyzeObservation = () => {
    const evaluationWords = ['いつも', '決して', 'すべて', 'ひどい', 'ダメ', '悪い', '良い', '怠惰', '無責任', '自分勝手'];
    const foundEvaluations = evaluationWords.filter(word => userInput.includes(word));
    
    setAnalysis({
      hasEvaluations: foundEvaluations.length > 0,
      foundWords: foundEvaluations,
      isSpecific: userInput.length > 10 && /[0-9]|時|分|回/.test(userInput)
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center gap-3">
          <Eye size={28} />
          観察の練習
        </h2>
        <p className="text-gray-700">
          観察と評価を区別することは、NVCの基礎です。
          判断を交えずに、カメラが捉えるように事実を述べる練習をしましょう。
        </p>
      </div>

      <ObservationGuide />

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <SectionTitle icon={PenTool}>あなたの観察を書いてみましょう</SectionTitle>
        <textarea
          className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows="4"
          placeholder="例: 昨日の会議で、田中さんは私の提案について3分間話し続けました..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
        />
        <button
          onClick={analyzeObservation}
          className="mt-3 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          分析する
        </button>

        {analysis && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-bold mb-2">分析結果:</h4>
            {analysis.hasEvaluations ? (
              <div className="text-amber-700">
                <p className="flex items-center gap-2 mb-2">
                  <AlertCircle size={18} />
                  評価的な言葉が含まれている可能性があります:
                </p>
                <ul className="list-disc list-inside ml-6">
                  {analysis.foundWords.map((word, idx) => (
                    <li key={idx}>「{word}」</li>
                  ))}
                </ul>
                <p className="mt-2 text-sm">
                  これらの言葉を、より具体的な観察に置き換えてみましょう。
                </p>
              </div>
            ) : (
              <p className="text-green-700 flex items-center gap-2">
                <CheckCircle2 size={18} />
                良いですね！評価的な言葉は見つかりませんでした。
              </p>
            )}
            {analysis.isSpecific ? (
              <p className="text-green-700 flex items-center gap-2 mt-2">
                <CheckCircle2 size={18} />
                具体的な詳細が含まれています。
              </p>
            ) : (
              <p className="text-amber-700 flex items-center gap-2 mt-2">
                <AlertCircle size={18} />
                より具体的に（時間、回数、具体的な行動など）書いてみましょう。
              </p>
            )}
          </div>
        )}
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <SectionTitle icon={Lightbulb}>練習問題</SectionTitle>
        <div className="space-y-4">
          <div className="p-4 bg-white rounded-lg">
            <p className="font-medium mb-2">❌ 評価: 「あなたは無責任だ」</p>
            <p className="text-green-700">✓ 観察: 「約束の期限を3回過ぎています」</p>
          </div>
          <div className="p-4 bg-white rounded-lg">
            <p className="font-medium mb-2">❌ 評価: 「彼女はいつも遅刻する」</p>
            <p className="text-green-700">✓ 観察: 「今週の会議で、彼女は4回中3回、開始時刻の10分後に到着しました」</p>
          </div>
          <div className="p-4 bg-white rounded-lg">
            <p className="font-medium mb-2">❌ 評価: 「あなたは自分勝手だ」</p>
            <p className="text-green-700">✓ 観察: 「昨日、私が話している間に2回電話に出ました」</p>
          </div>
        </div>
      </div>
    </div>
  );
};


// DialogueMode
const DialogueMode = () => {
  const [formData, setFormData] = useState({
    observation: '',
    myFeelings: '',
    myNeeds: '',
    theirPossibleFeelings: '',
    theirPossibleNeeds: '',
    request: ''
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-300 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center gap-3">
          <MessageCircle size={28} />
          対話モード
        </h2>
        <p className="text-gray-700">
          相手とのコミュニケーションを準備し、互いのニーズを理解し合いましょう。
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 print-section">
        <SectionTitle icon={Eye}>1. 観察</SectionTitle>
        <ObservationGuide />
        <textarea
          className="mt-4 w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          rows="3"
          placeholder="何が起きましたか？評価や判断を交えず、具体的な事実を書いてください..."
          value={formData.observation}
          onChange={(e) => handleInputChange('observation', e.target.value)}
        />
      </div>

      <PauseButton onClick={() => alert('深呼吸をして、自分の内側に注意を向けてみましょう...')} />

      <div className="bg-white border border-gray-200 rounded-lg p-6 print-section">
        <SectionTitle icon={Heart}>2. 私の感情</SectionTitle>
        <p className="text-sm text-gray-600 mb-3">この観察について、私はどう感じていますか？</p>
        <textarea
          className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          rows="3"
          placeholder="例: 悲しい、不安、イライラする、がっかりした..."
          value={formData.myFeelings}
          onChange={(e) => handleInputChange('myFeelings', e.target.value)}
        />
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 print-section">
        <SectionTitle icon={Lightbulb}>3. 私のニーズ</SectionTitle>
        <NeedsGuide />
        <textarea
          className="mt-4 w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          rows="3"
          placeholder="この感情は、どのニーズが満たされていない/いることを示していますか？"
          value={formData.myNeeds}
          onChange={(e) => handleInputChange('myNeeds', e.target.value)}
        />
      </div>

      <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-6 print-section">
        <SectionTitle icon={Ear}>4. 相手の感情・ニーズを想像する（共感の準備）</SectionTitle>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              相手はどう感じているかもしれませんか？
            </label>
            <textarea
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
              rows="2"
              placeholder="相手の立場に立って想像してみましょう..."
              value={formData.theirPossibleFeelings}
              onChange={(e) => handleInputChange('theirPossibleFeelings', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              相手のどのニーズが関係しているかもしれませんか？
            </label>
            <textarea
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
              rows="2"
              placeholder="相手のニーズを推測してみましょう（後で確認します）..."
              value={formData.theirPossibleNeeds}
              onChange={(e) => handleInputChange('theirPossibleNeeds', e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 print-section">
        <SectionTitle icon={ArrowRight}>5. リクエスト</SectionTitle>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
          <p className="text-sm text-orange-900 mb-2"><strong>効果的なリクエストの条件:</strong></p>
          <ul className="text-sm text-orange-800 space-y-1 list-disc list-inside">
            <li>具体的で実行可能（いつ、何を、どのように）</li>
            <li>肯定的な言葉で（「〜しないで」ではなく「〜してほしい」）</li>
            <li>命令ではなく、お願い（相手が断ることもできる）</li>
            <li>今この瞬間にできること</li>
          </ul>
        </div>
        <textarea
          className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
          rows="3"
          placeholder="相手に具体的に何をお願いしたいですか？"
          value={formData.request}
          onChange={(e) => handleInputChange('request', e.target.value)}
        />
      </div>

      <div className="bg-green-50 border-2 border-green-400 rounded-lg p-6">
        <SectionTitle icon={Handshake}>対話の準備ができました</SectionTitle>
        <div className="space-y-3 text-sm text-green-900">
          <p><strong>会話を始める前に:</strong></p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>相手が話を聞ける状態か確認しましょう</li>
            <li>共感を持って相手の話も聴く準備をしましょう</li>
            <li>解決策を急がず、まずはお互いのニーズを理解することを目指しましょう</li>
            <li>柔軟に対応し、予想と違う展開も受け入れましょう</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

// SelfEmpathyMode  
const SelfEmpathyMode = () => {
  const [formData, setFormData] = useState({
    situation: '',
    feelings: '',
    needs: '',
    selfCompassion: ''
  });

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-300 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center gap-3">
          <Heart size={28} />
          自己共感モード
        </h2>
        <p className="text-gray-700">
          まず自分自身に共感することで、他者への共感の土台を作ります。
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <SectionTitle icon={Quote}>1. 状況</SectionTitle>
        <p className="text-sm text-gray-600 mb-3">何が起きましたか？または今、何を感じていますか？</p>
        <textarea
          className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          rows="3"
          placeholder="自分の体験を、評価せずに書いてみましょう..."
          value={formData.situation}
          onChange={(e) => setFormData({ ...formData, situation: e.target.value })}
        />
      </div>

      <PauseButton onClick={() => alert('深く呼吸をして、自分の体の感覚に注意を向けてみましょう...')} />

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <SectionTitle icon={Heart}>2. 感情を認識する</SectionTitle>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
          <p className="text-sm text-green-900 mb-2">
            <strong>ヒント:</strong> 体のどこに感覚がありますか？（胸、喉、お腹など）
          </p>
          <p className="text-sm text-green-800">
            その感覚を、感情の言葉で表現してみましょう。
          </p>
        </div>
        <textarea
          className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          rows="3"
          placeholder="例: 悲しい、怒っている、不安、疲れた、孤独..."
          value={formData.feelings}
          onChange={(e) => setFormData({ ...formData, feelings: e.target.value })}
        />
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <SectionTitle icon={Lightbulb}>3. ニーズを探る</SectionTitle>
        <NeedsGuide />
        <p className="text-sm text-gray-600 mt-4 mb-3">
          この感情は、私のどのニーズが満たされていない/いることを教えてくれていますか？
        </p>
        <textarea
          className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          rows="3"
          placeholder="例: つながり、理解、自由、休息、貢献..."
          value={formData.needs}
          onChange={(e) => setFormData({ ...formData, needs: e.target.value })}
        />
      </div>

      <div className="bg-pink-50 border-2 border-pink-300 rounded-lg p-6">
        <SectionTitle icon={Feather}>4. 自分への思いやり</SectionTitle>
        <p className="text-sm text-gray-700 mb-4">
          あなた自身に、優しい友人が話しかけるように、思いやりの言葉をかけてみましょう。
        </p>
        <textarea
          className="w-full p-4 border border-pink-300 rounded-lg focus:ring-2 focus:ring-pink-500"
          rows="4"
          placeholder="例: 「つながりを求めていたんだね。それはとても自然なことだよ...」"
          value={formData.selfCompassion}
          onChange={(e) => setFormData({ ...formData, selfCompassion: e.target.value })}
        />
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <SectionTitle icon={Sunrise}>次のステップ</SectionTitle>
        <div className="space-y-2 text-sm text-gray-700">
          <p>自己共感ができたら:</p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>必要に応じて、他者との対話モードに進む</li>
            <li>自分のニーズを満たすための具体的な行動を考える</li>
            <li>もう少し自己共感が必要なら、このプロセスを繰り返す</li>
          </ul>
        </div>
      </div>
    </div>
  );
};


// DailyPracticeMode
const DailyPracticeMode = () => {
  const [entries, setEntries] = useState([
    { time: '朝', reflection: '' },
    { time: '昼', reflection: '' },
    { time: '夕', reflection: '' }
  ]);

  const updateEntry = (index, value) => {
    const newEntries = [...entries];
    newEntries[index].reflection = value;
    setEntries(newEntries);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-300 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center gap-3">
          <Sunrise size={28} />
          日常の実践
        </h2>
        <p className="text-gray-700">
          日々の出来事を振り返り、NVCの視点で自分の体験を整理しましょう。
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <SectionTitle icon={Compass}>今日のテーマ</SectionTitle>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg text-center">
            <h4 className="font-bold text-blue-900 mb-2">観察の練習</h4>
            <p className="text-sm text-blue-800">評価と観察を区別する</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg text-center">
            <h4 className="font-bold text-green-900 mb-2">感情の認識</h4>
            <p className="text-sm text-green-800">自分の感情に気づく</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg text-center">
            <h4 className="font-bold text-purple-900 mb-2">ニーズの発見</h4>
            <p className="text-sm text-purple-800">ニーズとつながる</p>
          </div>
        </div>
      </div>

      {entries.map((entry, idx) => (
        <div key={idx} className="bg-white border border-gray-200 rounded-lg p-6">
          <SectionTitle icon={Sun}>{entry.time}の振り返り</SectionTitle>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                何が起きましたか？（観察）
              </label>
              <textarea
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows="2"
                placeholder="具体的な出来事や行動を書いてください..."
                value={entry.reflection}
                onChange={(e) => updateEntry(idx, e.target.value)}
              />
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  どう感じましたか？
                </label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="感情の言葉..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  どのニーズに関連していますか？
                </label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="ニーズ..."
                />
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <SectionTitle icon={Sparkles}>今日の学び</SectionTitle>
        <textarea
          className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          rows="3"
          placeholder="今日のNVCの実践から、何を学びましたか？明日に活かせることは？"
        />
      </div>
    </div>
  );
};

// GratitudeMode
const GratitudeMode = () => {
  const [formData, setFormData] = useState({
    person: '',
    action: '',
    feelings: '',
    needs: '',
    expression: ''
  });

  const generateExpression = () => {
    if (formData.person && formData.action && formData.feelings && formData.needs) {
      const expression = `${formData.person}さん、${formData.action}してくれて、ありがとう。
      
それで私は${formData.feelings}と感じています。

なぜなら、それは私の${formData.needs}というニーズを満たしてくれるからです。`;
      
      setFormData({ ...formData, expression });
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-pink-50 to-rose-50 border-2 border-pink-300 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center gap-3">
          <Gift size={28} />
          感謝の表現
        </h2>
        <p className="text-gray-700">
          NVCの4つの要素を使って、心からの感謝を伝えましょう。
        </p>
      </div>

      <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4">
        <h3 className="font-bold text-yellow-900 mb-2 flex items-center gap-2">
          <Lightbulb size={18} />
          NVCの感謝の表現
        </h3>
        <p className="text-sm text-yellow-900 mb-2">
          感謝を伝えるときも、4つの要素を使います:
        </p>
        <ol className="text-sm text-yellow-800 space-y-1 list-decimal list-inside">
          <li><strong>観察:</strong> 相手が具体的に何をしてくれたか</li>
          <li><strong>感情:</strong> それによって自分がどう感じたか</li>
          <li><strong>ニーズ:</strong> どのニーズが満たされたか</li>
          <li><strong>お礼:</strong> 心からの感謝を表現</li>
        </ol>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <SectionTitle icon={Eye}>1. 観察</SectionTitle>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              誰に感謝したいですか？
            </label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="名前を入力..."
              value={formData.person}
              onChange={(e) => setFormData({ ...formData, person: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              その人は具体的に何をしてくれましたか？
            </label>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              rows="2"
              placeholder="具体的な行動や言葉を書いてください..."
              value={formData.action}
              onChange={(e) => setFormData({ ...formData, action: e.target.value })}
            />
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <SectionTitle icon={Heart}>2. 感情</SectionTitle>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          それによって、あなたはどう感じましたか？
        </label>
        <input
          type="text"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          placeholder="例: 嬉しい、ありがたい、安心、幸せ..."
          value={formData.feelings}
          onChange={(e) => setFormData({ ...formData, feelings: e.target.value })}
        />
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <SectionTitle icon={Lightbulb}>3. ニーズ</SectionTitle>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          どのニーズが満たされましたか？
        </label>
        <input
          type="text"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          placeholder="例: つながり、サポート、理解、自由..."
          value={formData.needs}
          onChange={(e) => setFormData({ ...formData, needs: e.target.value })}
        />
      </div>

      <button
        onClick={generateExpression}
        className="w-full py-3 px-4 bg-pink-600 hover:bg-pink-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
      >
        <Sparkles size={18} />
        感謝の表現を生成
      </button>

      {formData.expression && (
        <div className="bg-gradient-to-r from-pink-50 to-rose-50 border-2 border-pink-300 rounded-lg p-6">
          <SectionTitle icon={Gift}>あなたの感謝の表現</SectionTitle>
          <div className="bg-white rounded-lg p-4 whitespace-pre-wrap text-gray-800 leading-relaxed">
            {formData.expression}
          </div>
          <p className="text-sm text-gray-600 mt-4">
            💡 この表現を相手に直接伝えるか、メッセージとして送りましょう。
          </p>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <SectionTitle icon={Info}>なぜ感謝を伝えることが大切か</SectionTitle>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <CheckCircle2 size={16} className="mt-1 text-green-600 flex-shrink-0" />
            <span>相手の貢献を認識し、つながりを深める</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 size={16} className="mt-1 text-green-600 flex-shrink-0" />
            <span>お互いのニーズが満たされる喜びを分かち合う</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 size={16} className="mt-1 text-green-600 flex-shrink-0" />
            <span>ポジティブな行動を強化し、関係性を育む</span>
          </li>
        </ul>
      </div>
    </div>
  );
};


// HealingMode
const HealingMode = () => {
  const [formData, setFormData] = useState({
    wound: '',
    judgments: '',
    feelings: '',
    needs: '',
    mourning: '',
    selfForgiveness: ''
  });

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-300 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center gap-3">
          <Feather size={28} />
          癒しと和解
        </h2>
        <p className="text-gray-700">
          過去の痛みや後悔に対して、自分自身への共感と許しのプロセスを歩みましょう。
        </p>
      </div>

      <div className="bg-amber-50 border border-amber-300 rounded-lg p-4">
        <p className="text-sm text-amber-900">
          <strong>注意:</strong> 深い感情的な痛みに取り組む場合は、
          カウンセラーやセラピストのサポートを受けることも検討してください。
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <SectionTitle icon={Quote}>1. 痛みの源</SectionTitle>
        <p className="text-sm text-gray-600 mb-3">
          何があなたを傷つけましたか？（自分の行動、または他者の行動）
        </p>
        <textarea
          className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          rows="3"
          placeholder="具体的な出来事を書いてください..."
          value={formData.wound}
          onChange={(e) => setFormData({ ...formData, wound: e.target.value })}
        />
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <SectionTitle icon={AlertCircle}>2. 自己批判や他者への非難</SectionTitle>
        <p className="text-sm text-gray-600 mb-3">
          この出来事について、どんな判断や批判を持っていますか？
        </p>
        <textarea
          className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
          rows="3"
          placeholder="例: 私はダメだ、あの人は自分勝手だ、など..."
          value={formData.judgments}
          onChange={(e) => setFormData({ ...formData, judgments: e.target.value })}
        />
      </div>

      <PauseButton onClick={() => alert('深呼吸をして、判断ではなく自分の内側の感情に注意を向けてみましょう...')} />

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <SectionTitle icon={Heart}>3. 感情</SectionTitle>
        <p className="text-sm text-gray-600 mb-3">
          判断の下にある、本当の感情は何ですか？
        </p>
        <textarea
          className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          rows="3"
          placeholder="例: 悲しい、傷ついた、怒り、失望、恥ずかしい..."
          value={formData.feelings}
          onChange={(e) => setFormData({ ...formData, feelings: e.target.value })}
        />
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <SectionTitle icon={Lightbulb}>4. ニーズ</SectionTitle>
        <p className="text-sm text-gray-600 mb-3">
          この感情は、どのニーズが満たされなかったことを示していますか？
        </p>
        <textarea
          className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          rows="3"
          placeholder="例: 尊重、理解、つながり、誠実さ..."
          value={formData.needs}
          onChange={(e) => setFormData({ ...formData, needs: e.target.value })}
        />
      </div>

      <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-6">
        <SectionTitle icon={Wind}>5. 喪の作業（Mourning）</SectionTitle>
        <p className="text-sm text-gray-700 mb-3">
          満たされなかったニーズに対して、悲しみを感じることを自分に許しましょう。
        </p>
        <textarea
          className="w-full p-4 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          rows="3"
          placeholder="例: 「理解されたかったんだね。それはとても大切なニーズだよ...」"
          value={formData.mourning}
          onChange={(e) => setFormData({ ...formData, mourning: e.target.value })}
        />
      </div>

      <div className="bg-pink-50 border-2 border-pink-300 rounded-lg p-6">
        <SectionTitle icon={Sunrise}>6. 自己への許しと思いやり</SectionTitle>
        <p className="text-sm text-gray-700 mb-3">
          過去の自分（または相手）が、どのニーズを満たそうとしていたか理解してみましょう。
        </p>
        <textarea
          className="w-full p-4 border border-pink-300 rounded-lg focus:ring-2 focus:ring-pink-500"
          rows="4"
          placeholder="例: 「あの時、私は自分を守ろうとしていたんだね...」"
          value={formData.selfForgiveness}
          onChange={(e) => setFormData({ ...formData, selfForgiveness: e.target.value })}
        />
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <SectionTitle icon={Sparkles}>癒しのプロセス</SectionTitle>
        <p className="text-sm text-gray-700 mb-3">
          癒しは一度きりのプロセスではありません。必要なだけ、何度でもこのプロセスに戻ってきてください。
        </p>
        <ul className="text-sm text-gray-700 space-y-2">
          <li className="flex items-start gap-2">
            <CheckCircle2 size={16} className="mt-1 text-green-600 flex-shrink-0" />
            <span>判断から感情とニーズへシフトすることで、自己への思いやりが生まれます</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 size={16} className="mt-1 text-green-600 flex-shrink-0" />
            <span>許しとは、相手の行動を正当化することではなく、自分を苦しみから解放することです</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

// EnemyImageMode
const EnemyImageMode = () => {
  const [formData, setFormData] = useState({
    person: '',
    judgment: '',
    behavior: '',
    myFeelings: '',
    myNeeds: '',
    theirNeeds: '',
    reframe: ''
  });

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-300 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center gap-3">
          <ShieldAlert size={28} />
          敵イメージの解消
        </h2>
        <p className="text-gray-700">
          相手を「敵」として見ることから、お互いのニーズを持つ人間として見ることへ。
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <SectionTitle icon={AlertCircle}>1. 敵イメージの認識</SectionTitle>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              誰に対して怒りや憤りを感じていますか？
            </label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="名前または関係性..."
              value={formData.person}
              onChange={(e) => setFormData({ ...formData, person: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              その人について、どんな判断や批判をしていますか？
            </label>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              rows="2"
              placeholder="例: 自分勝手だ、無責任だ、信用できない..."
              value={formData.judgment}
              onChange={(e) => setFormData({ ...formData, judgment: e.target.value })}
            />
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <SectionTitle icon={Eye}>2. 観察へ翻訳</SectionTitle>
        <p className="text-sm text-gray-600 mb-3">
          判断の代わりに、その人が具体的に何をした/しなかったかを書いてください。
        </p>
        <textarea
          className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          rows="3"
          placeholder="評価を除いた、具体的な行動や言葉..."
          value={formData.behavior}
          onChange={(e) => setFormData({ ...formData, behavior: e.target.value })}
        />
      </div>

      <PauseButton onClick={() => alert('深呼吸をして、自分の内側に注意を向けましょう...')} />

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <SectionTitle icon={Heart}>3. 私の感情とニーズ</SectionTitle>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              この行動に対して、私はどう感じていますか？
            </label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="感情..."
              value={formData.myFeelings}
              onChange={(e) => setFormData({ ...formData, myFeelings: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              私のどのニーズが満たされていませんか？
            </label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              placeholder="ニーズ..."
              value={formData.myNeeds}
              onChange={(e) => setFormData({ ...formData, myNeeds: e.target.value })}
            />
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-6">
        <SectionTitle icon={Ear}>4. 相手のニーズを想像する</SectionTitle>
        <p className="text-sm text-gray-700 mb-3">
          その人がその行動を取ったとき、どのニーズを満たそうとしていたのでしょうか？
        </p>
        <textarea
          className="w-full p-4 border border-yellow-400 rounded-lg focus:ring-2 focus:ring-yellow-500"
          rows="3"
          placeholder="例: 安全、自主性、承認、効率性..."
          value={formData.theirNeeds}
          onChange={(e) => setFormData({ ...formData, theirNeeds: e.target.value })}
        />
        <p className="text-xs text-gray-600 mt-2">
          💡 相手のニーズを理解することは、相手の行動を正当化することではありません。
          双方のニーズが存在することを認識するプロセスです。
        </p>
      </div>

      <div className="bg-green-50 border-2 border-green-400 rounded-lg p-6">
        <SectionTitle icon={RefreshCcw}>5. リフレーミング</SectionTitle>
        <p className="text-sm text-gray-700 mb-3">
          判断ではなく、お互いのニーズの観点から状況を言い換えてみましょう。
        </p>
        <textarea
          className="w-full p-4 border border-green-400 rounded-lg focus:ring-2 focus:ring-green-500"
          rows="4"
          placeholder="例: 「私は理解されたかった。相手は自主性を守ろうとしていた。両方のニーズが大切だ。」"
          value={formData.reframe}
          onChange={(e) => setFormData({ ...formData, reframe: e.target.value })}
        />
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <SectionTitle icon={Handshake}>次のステップ</SectionTitle>
        <p className="text-sm text-gray-700 mb-3">
          敵イメージが解消され始めたら:
        </p>
        <ul className="text-sm text-gray-700 space-y-2">
          <li className="flex items-start gap-2">
            <ArrowRight size={16} className="mt-1 text-blue-600 flex-shrink-0" />
            <span>対話モードで、双方のニーズを満たす対話を準備する</span>
          </li>
          <li className="flex items-start gap-2">
            <ArrowRight size={16} className="mt-1 text-blue-600 flex-shrink-0" />
            <span>もしまだ怒りが強い場合は、自己共感モードで自分のニーズにもっとつながる</span>
          </li>
        </ul>
      </div>
    </div>
  );
};


// TeamMeetingMode
const TeamMeetingMode = () => {
  const [formData, setFormData] = useState({
    topic: '',
    concerns: '',
    needs: '',
    proposals: ''
  });

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-cyan-50 to-blue-50 border-2 border-cyan-300 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center gap-3">
          <Users size={28} />
          チーム会議ガイド
        </h2>
        <p className="text-gray-700">
          チーム全員のニーズを考慮した、建設的な会議を進めましょう。
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <SectionTitle icon={Compass}>1. 議題の設定</SectionTitle>
        <p className="text-sm text-gray-600 mb-3">
          何について話し合いますか？
        </p>
        <textarea
          className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          rows="2"
          placeholder="会議のテーマや議題..."
          value={formData.topic}
          onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
        />
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <SectionTitle icon={AlertCircle}>2. 懸念事項の収集</SectionTitle>
        <p className="text-sm text-gray-600 mb-3">
          チームメンバーの懸念や不安は何ですか？（観察として）
        </p>
        <textarea
          className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
          rows="4"
          placeholder="・メンバーAは...と言っている&#10;・最近のデータでは...&#10;・前回のプロジェクトで..."
          value={formData.concerns}
          onChange={(e) => setFormData({ ...formData, concerns: e.target.value })}
        />
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <SectionTitle icon={Heart}>3. 関連するニーズの特定</SectionTitle>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
          <p className="text-sm text-purple-900 mb-2">
            <strong>チームの共通ニーズ例:</strong>
          </p>
          <div className="grid md:grid-cols-2 gap-2 text-sm text-purple-800">
            <div>• 効率性・生産性</div>
            <div>• つながり・協力</div>
            <div>• 明確性・理解</div>
            <div>• 自主性・選択</div>
            <div>• 成長・学び</div>
            <div>• 安心・安全</div>
          </div>
        </div>
        <textarea
          className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          rows="4"
          placeholder="この議題に関連する、チームメンバーのニーズをリストアップ..."
          value={formData.needs}
          onChange={(e) => setFormData({ ...formData, needs: e.target.value })}
        />
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <SectionTitle icon={Lightbulb}>4. 戦略とソリューション</SectionTitle>
        <p className="text-sm text-gray-600 mb-3">
          特定されたニーズを満たすために、どんな戦略が考えられますか？
        </p>
        <textarea
          className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          rows="4"
          placeholder="複数のニーズを満たす可能性のあるアイデアを書き出す..."
          value={formData.proposals}
          onChange={(e) => setFormData({ ...formData, proposals: e.target.value })}
        />
      </div>

      <div className="bg-green-50 border-2 border-green-400 rounded-lg p-6">
        <SectionTitle icon={CheckCircle2}>5. 合意形成</SectionTitle>
        <p className="text-sm text-gray-700 mb-3">
          各提案について、以下を確認します:
        </p>
        <ul className="text-sm text-gray-700 space-y-2">
          <li className="flex items-start gap-2">
            <CheckCircle2 size={16} className="mt-1 text-green-600 flex-shrink-0" />
            <span>誰のどのニーズが満たされるか？</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 size={16} className="mt-1 text-green-600 flex-shrink-0" />
            <span>誰かのニーズが犠牲になっていないか？</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 size={16} className="mt-1 text-green-600 flex-shrink-0" />
            <span>全員が心から同意できるか？（消極的な同意ではなく）</span>
          </li>
        </ul>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <SectionTitle icon={Repeat}>会議のプロセス</SectionTitle>
        <ol className="text-sm text-gray-700 space-y-2 list-decimal list-inside">
          <li>各自が自分のニーズを明確に表現する機会を持つ</li>
          <li>他のメンバーのニーズを共感的に聴く</li>
          <li>すべてのニーズが可視化されるまで、戦略の提案は待つ</li>
          <li>全員のニーズを考慮した戦略をブレインストーミング</li>
          <li>最もみんなのニーズを満たす戦略を選択</li>
        </ol>
      </div>
    </div>
  );
};

// StructuralCooperationMode
const StructuralCooperationMode = () => {
  const [formData, setFormData] = useState({
    systemIssue: '',
    affectedNeeds: '',
    structuralChanges: '',
    implementation: ''
  });

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-teal-50 to-emerald-50 border-2 border-teal-300 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center gap-3">
          <Building2 size={28} />
          構造的協力
        </h2>
        <p className="text-gray-700">
          組織やコミュニティのシステムレベルでの変化を設計しましょう。
        </p>
      </div>

      <div className="bg-amber-50 border border-amber-300 rounded-lg p-4">
        <h3 className="font-bold text-amber-900 mb-2 flex items-center gap-2">
          <Info size={18} />
          構造的協力とは
        </h3>
        <p className="text-sm text-amber-900">
          個人間の対話だけでなく、組織の構造やシステム自体がNVCの原則に基づいて設計されることを目指します。
          これにより、すべてのメンバーのニーズが継続的に考慮される文化が生まれます。
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <SectionTitle icon={AlertCircle}>1. システム的な問題の特定</SectionTitle>
        <p className="text-sm text-gray-600 mb-3">
          組織やコミュニティで、繰り返し起こる問題やパターンは何ですか？
        </p>
        <textarea
          className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          rows="4"
          placeholder="例: 意思決定が一部の人だけで行われる、情報共有が不透明、ワークライフバランスが取れない..."
          value={formData.systemIssue}
          onChange={(e) => setFormData({ ...formData, systemIssue: e.target.value })}
        />
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <SectionTitle icon={Users}>2. 影響を受けるニーズ</SectionTitle>
        <p className="text-sm text-gray-600 mb-3">
          この構造的な問題により、誰のどのニーズが満たされていませんか？
        </p>
        <textarea
          className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          rows="4"
          placeholder="異なる立場の人々のニーズを考慮してください..."
          value={formData.affectedNeeds}
          onChange={(e) => setFormData({ ...formData, affectedNeeds: e.target.value })}
        />
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <SectionTitle icon={Lightbulb}>3. 構造的な変更案</SectionTitle>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
          <p className="text-sm text-green-900 mb-2">
            <strong>考慮すべき領域:</strong>
          </p>
          <ul className="text-sm text-green-800 space-y-1 list-disc list-inside">
            <li>意思決定プロセス（誰がどう参加するか）</li>
            <li>コミュニケーションの流れ（情報共有の方法）</li>
            <li>リソースの配分（時間、予算、人材）</li>
            <li>評価とフィードバックのシステム</li>
            <li>紛争解決のメカニズム</li>
          </ul>
        </div>
        <textarea
          className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          rows="5"
          placeholder="特定されたニーズを満たすための、システムやプロセスの変更案..."
          value={formData.structuralChanges}
          onChange={(e) => setFormData({ ...formData, structuralChanges: e.target.value })}
        />
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <SectionTitle icon={GitCompare}>4. 実装計画</SectionTitle>
        <p className="text-sm text-gray-600 mb-3">
          これらの変更をどのように実装しますか？
        </p>
        <textarea
          className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          rows="4"
          placeholder="・パイロットプロジェクト&#10;・段階的な導入&#10;・関係者の巻き込み方&#10;・評価と調整のプロセス"
          value={formData.implementation}
          onChange={(e) => setFormData({ ...formData, implementation: e.target.value })}
        />
      </div>

      <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-6">
        <SectionTitle icon={Layers}>重要な原則</SectionTitle>
        <ul className="space-y-3 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <CheckCircle2 size={16} className="mt-1 text-green-600 flex-shrink-0" />
            <div>
              <strong>包括性:</strong> 変更の影響を受けるすべての人が、設計プロセスに参加する機会を持つ
            </div>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 size={16} className="mt-1 text-green-600 flex-shrink-0" />
            <div>
              <strong>透明性:</strong> 意思決定のプロセスと理由が明確に共有される
            </div>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 size={16} className="mt-1 text-green-600 flex-shrink-0" />
            <div>
              <strong>柔軟性:</strong> システムは学びと調整を可能にする
            </div>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 size={16} className="mt-1 text-green-600 flex-shrink-0" />
            <div>
              <strong>ニーズ中心:</strong> ルールや手続きより、ニーズの充足を優先する
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};


// MediationMode
const MediationMode = () => {
  const [formData, setFormData] = useState({
    parties: '',
    conflict: '',
    partyANeeds: '',
    partyBNeeds: '',
    commonGround: '',
    solutions: ''
  });

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-violet-50 to-purple-50 border-2 border-violet-300 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center gap-3">
          <Scale size={28} />
          仲介・調停モード
        </h2>
        <p className="text-gray-700">
          対立する当事者間の橋渡しをし、お互いのニーズを理解し合う場を作りましょう。
        </p>
      </div>

      <div className="bg-amber-50 border border-amber-300 rounded-lg p-4">
        <h3 className="font-bold text-amber-900 mb-2 flex items-center gap-2">
          <AlertCircle size={18} />
          仲介者の役割
        </h3>
        <ul className="text-sm text-amber-900 space-y-1">
          <li>• 中立を保ち、どちらの側にも立たない</li>
          <li>• 双方の感情とニーズを共感的に聴く</li>
          <li>• 判断や解決策を押し付けない</li>
          <li>• 双方が自ら解決策を見つけるのをサポート</li>
        </ul>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <SectionTitle icon={Users}>1. 当事者の確認</SectionTitle>
        <input
          type="text"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="関係者A と 関係者B"
          value={formData.parties}
          onChange={(e) => setFormData({ ...formData, parties: e.target.value })}
        />
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <SectionTitle icon={Eye}>2. 対立の観察</SectionTitle>
        <p className="text-sm text-gray-600 mb-3">
          何が起きましたか？双方の視点を、評価なしに記録します。
        </p>
        <textarea
          className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          rows="4"
          placeholder="具体的な出来事、行動、言葉..."
          value={formData.conflict}
          onChange={(e) => setFormData({ ...formData, conflict: e.target.value })}
        />
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <SectionTitle icon={Heart}>3. 関係者Aの感情とニーズ</SectionTitle>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              関係者Aはどう感じているか？
            </label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="感情..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              関係者Aのニーズは？
            </label>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              rows="2"
              placeholder="どのニーズが関係していますか？"
              value={formData.partyANeeds}
              onChange={(e) => setFormData({ ...formData, partyANeeds: e.target.value })}
            />
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <SectionTitle icon={Heart}>4. 関係者Bの感情とニーズ</SectionTitle>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              関係者Bはどう感じているか？
            </label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="感情..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              関係者Bのニーズは？
            </label>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              rows="2"
              placeholder="どのニーズが関係していますか？"
              value={formData.partyBNeeds}
              onChange={(e) => setFormData({ ...formData, partyBNeeds: e.target.value })}
            />
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-6">
        <SectionTitle icon={Handshake}>5. 共通点の発見</SectionTitle>
        <p className="text-sm text-gray-700 mb-3">
          双方に共通するニーズや価値観はありますか？
        </p>
        <textarea
          className="w-full p-4 border border-yellow-400 rounded-lg focus:ring-2 focus:ring-yellow-500"
          rows="3"
          placeholder="例: 双方とも尊重、理解、効率性を求めている..."
          value={formData.commonGround}
          onChange={(e) => setFormData({ ...formData, commonGround: e.target.value })}
        />
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <SectionTitle icon={Lightbulb}>6. 解決策の探索</SectionTitle>
        <p className="text-sm text-gray-600 mb-3">
          双方のニーズを満たす可能性のある戦略は？
        </p>
        <textarea
          className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          rows="4"
          placeholder="複数のオプションをブレインストーミング..."
          value={formData.solutions}
          onChange={(e) => setFormData({ ...formData, solutions: e.target.value })}
        />
      </div>

      <div className="bg-green-50 border-2 border-green-400 rounded-lg p-6">
        <SectionTitle icon={CheckCircle2}>仲介のプロセス</SectionTitle>
        <ol className="text-sm text-gray-700 space-y-2 list-decimal list-inside">
          <li>安全な場を作る（守秘義務、非暴力的な言葉の使用）</li>
          <li>各自が中断されずに話す機会を持つ</li>
          <li>仲介者が各自の言葉をニーズの言葉に翻訳する</li>
          <li>相手のニーズを理解したことを確認する</li>
          <li>共通のニーズを特定する</li>
          <li>双方が満足できる解決策を共創する</li>
          <li>具体的な次のステップに合意する</li>
        </ol>
      </div>
    </div>
  );
};

// PerformanceReviewMode
const PerformanceReviewMode = () => {
  const [formData, setFormData] = useState({
    reviewee: '',
    observations: '',
    strengths: '',
    needsForGrowth: '',
    support: '',
    gratitude: ''
  });

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-300 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center gap-3">
          <FileSearch size={28} />
          パフォーマンスレビュー
        </h2>
        <p className="text-gray-700">
          ニーズベースのフィードバックで、成長と貢献をサポートしましょう。
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
          <Info size={18} />
          NVC的なフィードバックの原則
        </h3>
        <ul className="text-sm text-blue-900 space-y-1">
          <li>• 評価ではなく、観察と影響を伝える</li>
          <li>• 欠点ではなく、ニーズの観点から話す</li>
          <li>• 批判ではなく、具体的なリクエストをする</li>
          <li>• 一方的な評価ではなく、対話を重視する</li>
        </ul>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <SectionTitle icon={UserCheck}>対象者</SectionTitle>
        <input
          type="text"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="名前..."
          value={formData.reviewee}
          onChange={(e) => setFormData({ ...formData, reviewee: e.target.value })}
        />
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <SectionTitle icon={Eye}>1. 観察</SectionTitle>
        <p className="text-sm text-gray-600 mb-3">
          レビュー期間中、具体的に何を観察しましたか？
        </p>
        <textarea
          className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          rows="4"
          placeholder="評価を交えず、具体的な行動、成果、貢献を記録..."
          value={formData.observations}
          onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
        />
      </div>

      <div className="bg-green-50 border-2 border-green-400 rounded-lg p-6">
        <SectionTitle icon={Sparkles}>2. 強みと貢献</SectionTitle>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-green-900 mb-2">
              この人の行動は、どのニーズを満たしましたか？
            </label>
            <textarea
              className="w-full p-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500"
              rows="3"
              placeholder="例: チームのつながり、プロジェクトの効率性、クライアントの安心感..."
              value={formData.strengths}
              onChange={(e) => setFormData({ ...formData, strengths: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-green-900 mb-2">
              具体的に感謝したいことは？
            </label>
            <textarea
              className="w-full p-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500"
              rows="2"
              placeholder="感謝の表現..."
              value={formData.gratitude}
              onChange={(e) => setFormData({ ...formData, gratitude: e.target.value })}
            />
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <SectionTitle icon={Lightbulb}>3. 成長の機会</SectionTitle>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
          <p className="text-sm text-purple-900">
            <strong>「改善すべき点」ではなく「成長のニーズ」として:</strong><br/>
            批判的な言葉ではなく、どのニーズがより満たされることで、
            さらに貢献できるかを考えます。
          </p>
        </div>
        <textarea
          className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          rows="4"
          placeholder="例: コミュニケーションのニーズ（チーム内でより頻繁に進捗を共有する）、学びのニーズ（新しいツールのスキルアップ）..."
          value={formData.needsForGrowth}
          onChange={(e) => setFormData({ ...formData, needsForGrowth: e.target.value })}
        />
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <SectionTitle icon={Handshake}>4. サポートとリソース</SectionTitle>
        <p className="text-sm text-gray-600 mb-3">
          成長をサポートするために、どんなリソースやサポートを提供できますか？
        </p>
        <textarea
          className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          rows="3"
          placeholder="例: トレーニング、メンタリング、ツール、時間の配分..."
          value={formData.support}
          onChange={(e) => setFormData({ ...formData, support: e.target.value })}
        />
      </div>

      <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-6">
        <SectionTitle icon={MessageCircle}>対話のヒント</SectionTitle>
        <ul className="text-sm text-gray-700 space-y-2">
          <li className="flex items-start gap-2">
            <ArrowRight size={16} className="mt-1 text-yellow-600 flex-shrink-0" />
            <span>まず相手の自己評価を聴く</span>
          </li>
          <li className="flex items-start gap-2">
            <ArrowRight size={16} className="mt-1 text-yellow-600 flex-shrink-0" />
            <span>感謝と強みの認識から始める</span>
          </li>
          <li className="flex items-start gap-2">
            <ArrowRight size={16} className="mt-1 text-yellow-600 flex-shrink-0" />
            <span>成長の機会について、相手の意見も聞く</span>
          </li>
          <li className="flex items-start gap-2">
            <ArrowRight size={16} className="mt-1 text-yellow-600 flex-shrink-0" />
            <span>一緒に次のステップを決める（押し付けない）</span>
          </li>
        </ul>
      </div>
    </div>
  );
};


// RestorativeMode
const RestorativeMode = () => {
  const [formData, setFormData] = useState({
    incident: '',
    harm: '',
    affectedNeeds: '',
    accountability: '',
    repair: '',
    agreement: ''
  });

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-rose-50 to-pink-50 border-2 border-rose-300 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center gap-3">
          <Landmark size={28} />
          修復的正義
        </h2>
        <p className="text-gray-700">
          害を与えた行動に対して、罰ではなく修復と学びを通じて対応しましょう。
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
          <Info size={18} />
          修復的正義の原則
        </h3>
        <ul className="text-sm text-blue-900 space-y-1">
          <li>• 罰ではなく、関係性と信頼の修復を目指す</li>
          <li>• 被害者のニーズを中心に置く</li>
          <li>• 加害者の人間性を否定せず、行動の責任を問う</li>
          <li>• コミュニティ全体の癒しと学びを促進する</li>
        </ul>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <SectionTitle icon={Eye}>1. 何が起きたか</SectionTitle>
        <p className="text-sm text-gray-600 mb-3">
          具体的に何が起きましたか？（観察）
        </p>
        <textarea
          className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          rows="3"
          placeholder="評価を交えず、事実を記録..."
          value={formData.incident}
          onChange={(e) => setFormData({ ...formData, incident: e.target.value })}
        />
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <SectionTitle icon={AlertCircle}>2. 影響と害</SectionTitle>
        <p className="text-sm text-gray-600 mb-3">
          誰がどのように影響を受けましたか？
        </p>
        <textarea
          className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
          rows="4"
          placeholder="被害を受けた人々とその影響..."
          value={formData.harm}
          onChange={(e) => setFormData({ ...formData, harm: e.target.value })}
        />
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <SectionTitle icon={Heart}>3. 満たされなかったニーズ</SectionTitle>
        <p className="text-sm text-gray-600 mb-3">
          被害を受けた人々の、どのニーズが満たされませんでしたか？
        </p>
        <textarea
          className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          rows="3"
          placeholder="例: 安全、尊重、信頼、財産の保護..."
          value={formData.affectedNeeds}
          onChange={(e) => setFormData({ ...formData, affectedNeeds: e.target.value })}
        />
      </div>

      <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-6">
        <SectionTitle icon={Gavel}>4. 責任の認識</SectionTitle>
        <div className="space-y-3">
          <p className="text-sm text-gray-700">
            行動を起こした人は、自分の行動の影響を理解していますか？
          </p>
          <div className="bg-white rounded-lg p-4">
            <p className="text-sm font-medium text-gray-700 mb-2">
              行動を起こした人への質問:
            </p>
            <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
              <li>何が起きたと理解していますか？</li>
              <li>あなたの行動がどう影響したと思いますか？</li>
              <li>そのとき、あなた自身はどのニーズを満たそうとしていましたか？</li>
            </ul>
          </div>
          <textarea
            className="w-full p-4 border border-yellow-400 rounded-lg focus:ring-2 focus:ring-yellow-500"
            rows="3"
            placeholder="責任の認識と理解..."
            value={formData.accountability}
            onChange={(e) => setFormData({ ...formData, accountability: e.target.value })}
          />
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <SectionTitle icon={Handshake}>5. 修復の方法</SectionTitle>
        <p className="text-sm text-gray-600 mb-3">
          どのような行動が、害を修復し、ニーズを満たすことができますか？
        </p>
        <textarea
          className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          rows="4"
          placeholder="具体的な修復の行動、学びの機会、サポートの提供..."
          value={formData.repair}
          onChange={(e) => setFormData({ ...formData, repair: e.target.value })}
        />
      </div>

      <div className="bg-green-50 border-2 border-green-400 rounded-lg p-6">
        <SectionTitle icon={CheckCircle2}>6. 合意と次のステップ</SectionTitle>
        <p className="text-sm text-gray-700 mb-3">
          すべての関係者が合意できる、前進のための計画は？
        </p>
        <textarea
          className="w-full p-4 border border-green-400 rounded-lg focus:ring-2 focus:ring-green-500"
          rows="4"
          placeholder="具体的な行動、期限、フォローアップのプロセス..."
          value={formData.agreement}
          onChange={(e) => setFormData({ ...formData, agreement: e.target.value })}
        />
      </div>
    </div>
  );
};

// BreakthroughMode
const BreakthroughMode = () => {
  const [formData, setFormData] = useState({
    stuckPoint: '',
    attempts: '',
    deeperNeeds: '',
    newPerspective: '',
    experiment: ''
  });

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-300 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center gap-3">
          <Zap size={28} />
          ブレイクスルー
        </h2>
        <p className="text-gray-700">
          行き詰まりを突破し、新しい可能性を見出しましょう。
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <SectionTitle icon={Anchor}>1. 行き詰まりの特定</SectionTitle>
        <p className="text-sm text-gray-600 mb-3">
          どこで行き詰まっていると感じますか？
        </p>
        <textarea
          className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          rows="4"
          placeholder="状況、関係性、自分自身の内面で繰り返しているパターン..."
          value={formData.stuckPoint}
          onChange={(e) => setFormData({ ...formData, stuckPoint: e.target.value })}
        />
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <SectionTitle icon={Repeat}>2. これまでの試み</SectionTitle>
        <p className="text-sm text-gray-600 mb-3">
          これまで、どんな戦略を試してきましたか？
        </p>
        <textarea
          className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500"
          rows="3"
          placeholder="試したこと、その結果..."
          value={formData.attempts}
          onChange={(e) => setFormData({ ...formData, attempts: e.target.value })}
        />
      </div>

      <PauseButton onClick={() => alert('深呼吸をして、表面的な目標の下にある、より深いニーズに注意を向けてみましょう...')} />

      <div className="bg-purple-50 border-2 border-purple-300 rounded-lg p-6">
        <SectionTitle icon={Lightbulb}>3. より深いニーズの探求</SectionTitle>
        <div className="bg-white rounded-lg p-4 mb-4">
          <p className="text-sm text-gray-700 mb-2">
            <strong>問いかけ:</strong>
          </p>
          <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
            <li>この状況が解決したら、本当に手に入れたいものは何ですか？</li>
            <li>その奥にある、さらに深いニーズは？</li>
            <li>このニーズを満たす、他の方法はないでしょうか？</li>
          </ul>
        </div>
        <textarea
          className="w-full p-4 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          rows="4"
          placeholder="表面的な戦略の下にある、本当のニーズ..."
          value={formData.deeperNeeds}
          onChange={(e) => setFormData({ ...formData, deeperNeeds: e.target.value })}
        />
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <SectionTitle icon={Eye}>4. 新しい視点</SectionTitle>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <p className="text-sm text-blue-900 mb-2">
            <strong>視点を変える質問:</strong>
          </p>
          <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li>もし制約がなかったら、何が可能でしょうか？</li>
            <li>尊敬する誰かなら、どうアプローチするでしょうか？</li>
            <li>この状況から、何を学べるでしょうか？</li>
            <li>「問題」ではなく「未満たされたニーズ」と見たら、どう変わりますか？</li>
          </ul>
        </div>
        <textarea
          className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          rows="4"
          placeholder="新しい角度から見た気づき..."
          value={formData.newPerspective}
          onChange={(e) => setFormData({ ...formData, newPerspective: e.target.value })}
        />
      </div>

      <div className="bg-green-50 border-2 border-green-400 rounded-lg p-6">
        <SectionTitle icon={Sparkles}>5. 小さな実験</SectionTitle>
        <p className="text-sm text-gray-700 mb-3">
          新しい視点から、試してみたい小さなステップは？
        </p>
        <textarea
          className="w-full p-4 border border-green-400 rounded-lg focus:ring-2 focus:ring-green-500"
          rows="4"
          placeholder="リスクが低く、学びが得られる実験..."
          value={formData.experiment}
          onChange={(e) => setFormData({ ...formData, experiment: e.target.value })}
        />
        <p className="text-xs text-gray-600 mt-3">
          💡 完璧な解決策を求めず、好奇心を持って実験してみましょう。
        </p>
      </div>
    </div>
  );
};

// SocialVisionMode
const SocialVisionMode = () => {
  const [formData, setFormData] = useState({
    vision: '',
    values: '',
    systemicIssues: '',
    strategies: '',
    contribution: ''
  });

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-sky-50 to-indigo-50 border-2 border-sky-300 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center gap-3">
          <Globe size={28} />
          社会変革のビジョン
        </h2>
        <p className="text-gray-700">
          NVCの原則を社会に広げ、より思いやりのある世界を創造しましょう。
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <SectionTitle icon={Eye}>1. ビジョン</SectionTitle>
        <p className="text-sm text-gray-600 mb-3">
          あなたが実現したい、より良い社会の姿は？
        </p>
        <textarea
          className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          rows="4"
          placeholder="すべての人のニーズが尊重される社会とは、どんな姿でしょうか？"
          value={formData.vision}
          onChange={(e) => setFormData({ ...formData, vision: e.target.value })}
        />
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <SectionTitle icon={Heart}>2. 根底にある価値観とニーズ</SectionTitle>
        <p className="text-sm text-gray-600 mb-3">
          このビジョンは、どのニーズや価値観に基づいていますか？
        </p>
        <textarea
          className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          rows="3"
          placeholder="例: 平等、自由、つながり、美、平和、正義..."
          value={formData.values}
          onChange={(e) => setFormData({ ...formData, values: e.target.value })}
        />
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <SectionTitle icon={AlertCircle}>3. システム的な課題</SectionTitle>
        <p className="text-sm text-gray-600 mb-3">
          現在の社会システムで、人々のニーズを満たすことを妨げているものは？
        </p>
        <textarea
          className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
          rows="4"
          placeholder="構造的な不平等、システムの欠陥、文化的な障壁..."
          value={formData.systemicIssues}
          onChange={(e) => setFormData({ ...formData, systemicIssues: e.target.value })}
        />
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <SectionTitle icon={Lightbulb}>4. 変革の戦略</SectionTitle>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
          <p className="text-sm text-green-900 mb-2">
            <strong>変革のレベル:</strong>
          </p>
          <ul className="text-sm text-green-800 space-y-1 list-disc list-inside">
            <li>個人レベル: 意識と実践の変容</li>
            <li>関係性レベル: コミュニケーションと対話</li>
            <li>組織レベル: 構造とシステムの設計</li>
            <li>社会レベル: 政策、文化、制度</li>
          </ul>
        </div>
        <textarea
          className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          rows="5"
          placeholder="どのレベルで、どんなアクションが可能でしょうか？"
          value={formData.strategies}
          onChange={(e) => setFormData({ ...formData, strategies: e.target.value })}
        />
      </div>

      <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-6">
        <SectionTitle icon={Sparkles}>5. あなたの貢献</SectionTitle>
        <p className="text-sm text-gray-700 mb-3">
          このビジョンの実現に向けて、あなたができることは？
        </p>
        <textarea
          className="w-full p-4 border border-yellow-400 rounded-lg focus:ring-2 focus:ring-yellow-500"
          rows="4"
          placeholder="あなたのスキル、リソース、情熱を活かした貢献..."
          value={formData.contribution}
          onChange={(e) => setFormData({ ...formData, contribution: e.target.value })}
        />
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <SectionTitle icon={Handshake}>NVCベースの社会変革の原則</SectionTitle>
        <ul className="space-y-3 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <CheckCircle2 size={16} className="mt-1 text-green-600 flex-shrink-0" />
            <div>
              <strong>敵イメージを越えて:</strong> 「悪者」を作らず、すべての人の人間性を見る
            </div>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 size={16} className="mt-1 text-green-600 flex-shrink-0" />
            <div>
              <strong>パワー・ウィズ:</strong> 支配や強制ではなく、協力とパートナーシップ
            </div>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 size={16} className="mt-1 text-green-600 flex-shrink-0" />
            <div>
              <strong>プロセスを大切に:</strong> 目的が手段を正当化しない。変革のプロセス自体が、目指す価値を体現する
            </div>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 size={16} className="mt-1 text-green-600 flex-shrink-0" />
            <div>
              <strong>自己ケア:</strong> 燃え尽きないよう、自分のニーズも満たす
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};


// --- Main App Component ---
const NvcMasterApp = () => {
  const [mode, setMode] = useState('introduction');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isRefPanelOpen, setIsRefPanelOpen] = useState(false);

  const modes = [
    { id: 'introduction', label: 'はじめに', icon: BookOpen, component: IntroductionMode },
    { id: 'observation', label: '観察の練習', icon: Eye, component: ObservationMode },
    { id: 'dialogue', label: '対話モード', icon: MessageCircle, component: DialogueMode },
    { id: 'self-empathy', label: '自己共感', icon: Heart, component: SelfEmpathyMode },
    { id: 'daily', label: '日常の実践', icon: Sunrise, component: DailyPracticeMode },
    { id: 'gratitude', label: '感謝', icon: Gift, component: GratitudeMode },
    { id: 'healing', label: '癒しと和解', icon: Feather, component: HealingMode },
    { id: 'enemy', label: '敵イメージの解消', icon: ShieldAlert, component: EnemyImageMode },
    { id: 'team', label: 'チーム会議', icon: Users, component: TeamMeetingMode },
    { id: 'structural', label: '構造的協力', icon: Building2, component: StructuralCooperationMode },
    { id: 'mediation', label: '仲介・調停', icon: Scale, component: MediationMode },
    { id: 'performance', label: 'パフォーマンスレビュー', icon: FileSearch, component: PerformanceReviewMode },
    { id: 'restorative', label: '修復的正義', icon: Landmark, component: RestorativeMode },
    { id: 'breakthrough', label: 'ブレイクスルー', icon: Zap, component: BreakthroughMode },
    { id: 'social', label: '社会変革', icon: Globe, component: SocialVisionMode }
  ];

  const currentMode = modes.find(m => m.id === mode);
  const ModeComponent = currentMode?.component || IntroductionMode;

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: "'Shippori Mincho', serif" }}>
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg print:hidden">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 hover:bg-white/20 rounded transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2">
              <Compass size={28} />
              NVC プロセス・ナビゲーター
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsRefPanelOpen(true)}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors flex items-center gap-2 text-sm md:text-base"
            >
              <BookOpen size={18} />
              <span className="hidden sm:inline">語彙リファレンス</span>
              <span className="sm:hidden">語彙</span>
            </button>
            <button
              onClick={() => window.print()}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
              title="印刷"
            >
              <Printer size={20} />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto flex">
        {/* Sidebar Navigation - Desktop */}
        <nav className="hidden lg:block w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-72px)] print:hidden sticky top-0">
          <div className="p-4">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">
              モードを選択
            </h2>
            <div className="space-y-1">
              {modes.map(m => {
                const Icon = m.icon;
                return (
                  <button
                    key={m.id}
                    onClick={() => setMode(m.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center gap-2 text-sm ${
                      mode === m.id
                        ? 'bg-blue-100 text-blue-900 font-medium'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon size={18} />
                    {m.label}
                  </button>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40 print:hidden" onClick={() => setIsMenuOpen(false)}>
            <nav className="bg-white w-64 h-full shadow-xl overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                    モードを選択
                  </h2>
                  <button onClick={() => setIsMenuOpen(false)} className="p-1 hover:bg-gray-100 rounded">
                    <X size={20} />
                  </button>
                </div>
                <div className="space-y-1">
                  {modes.map(m => {
                    const Icon = m.icon;
                    return (
                      <button
                        key={m.id}
                        onClick={() => {
                          setMode(m.id);
                          setIsMenuOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center gap-2 text-sm ${
                          mode === m.id
                            ? 'bg-blue-100 text-blue-900 font-medium'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <Icon size={18} />
                        {m.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </nav>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8 print:p-0">
          <div className="max-w-4xl mx-auto print:max-w-full">
            {/* Print Header */}
            <div className="hidden print:block mb-6">
              <h1 className="text-2xl font-bold mb-2">NVC プロセス・ナビゲーター</h1>
              <h2 className="text-xl text-gray-700">{currentMode?.label}</h2>
              <p className="text-sm text-gray-500 mt-2">印刷日: {new Date().toLocaleDateString('ja-JP')}</p>
            </div>

            <ModeComponent />
          </div>
        </main>
      </div>

      {/* Reference Panel */}
      <ReferencePanel isOpen={isRefPanelOpen} onClose={() => setIsRefPanelOpen(false)} />

      {/* Print Styles */}
      <style>{`
        @media print {
          body { 
            background: white; 
            font-size: 12pt;
          }
          .print\:hidden { 
            display: none !important; 
          }
          .print-section {
            page-break-inside: avoid;
            margin-bottom: 1rem;
          }
          h1, h2, h3 {
            page-break-after: avoid;
          }
        }
      `}</style>
    </div>
  );
};

export default NvcMasterApp;

