import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Phone,
  PhoneCall,
  PhoneOff,
  Signal,
  BatteryMedium,
  Wifi,
  Sparkles,
  RefreshCw,
  Send,
  Languages,
  CheckCircle2,
  HelpCircle,
  Copy,
  Check,
} from 'lucide-react';

interface USSDModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPhoneNumber?: string;
  onListingCreated?: () => void;
}

export const USSDModal: React.FC<USSDModalProps> = ({
  isOpen,
  onClose,
  defaultPhoneNumber = '0961123330',
  onListingCreated,
}) => {
  const [phoneNumber, setPhoneNumber] = useState(defaultPhoneNumber);
  const [dialedCode, setDialedCode] = useState('*6112#');
  const [inSession, setInSession] = useState(false);
  const [loading, setLoading] = useState(false);
  const [screenText, setScreenText] = useState('');
  const [inputVal, setInputVal] = useState('');
  const [sessionHistory, setSessionHistory] = useState<string[]>([]);
  const [isCon, setIsCon] = useState(true); // CON vs END
  const [language, setLanguage] = useState<'en' | 'am' | 'om'>('en');
  const [copiedCode, setCopiedCode] = useState(false);

  const sessionIdRef = useRef<string>(`ussd-sess-${Date.now()}`);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sound generator for retro USSD keypad touch tone
  const playTone = (freq = 440) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch {
      // Audio not supported or blocked
    }
  };

  useEffect(() => {
    if (isOpen) {
      if (inputRef.current) inputRef.current.focus();
    } else {
      endCall();
    }
  }, [isOpen]);

  const startUSSDCall = async (overrideCode?: string) => {
    playTone(600);
    const code = overrideCode || dialedCode;
    if (!code.trim()) return;

    setLoading(true);
    setInSession(true);
    sessionIdRef.current = `ussd-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    setSessionHistory([]);
    setInputVal('');

    try {
      const res = await fetch('/api/ussd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: sessionIdRef.current,
          serviceCode: code.trim(),
          phoneNumber: phoneNumber || '0961123330',
          text: '',
          lang: language,
        }),
      });

      const data = await res.json();
      handleUSSDResponse(data.message || data.response || 'CON AgriLink Service');
    } catch (err) {
      console.error('USSD dial error:', err);
      setScreenText('END Connection error. Please check Ethio Telecom network or try *6112# again.');
      setIsCon(false);
    } finally {
      setLoading(false);
    }
  };

  const handleUSSDResponse = (rawResp: string) => {
    if (rawResp.startsWith('CON ')) {
      setIsCon(true);
      setScreenText(rawResp.replace(/^CON\s+/, ''));
    } else if (rawResp.startsWith('END ')) {
      setIsCon(false);
      setScreenText(rawResp.replace(/^END\s+/, ''));
      if (onListingCreated) {
        onListingCreated();
      }
    } else {
      setIsCon(false);
      setScreenText(rawResp);
    }
  };

  const sendUSSDInput = async () => {
    if (!inputVal.trim() && isCon) return;
    playTone(520);
    setLoading(true);

    const newHistory = [...sessionHistory, inputVal.trim()];
    setSessionHistory(newHistory);
    const cumulativeText = newHistory.join('*');

    try {
      const res = await fetch('/api/ussd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: sessionIdRef.current,
          serviceCode: dialedCode,
          phoneNumber: phoneNumber || '0961123330',
          text: cumulativeText,
          lang: language,
        }),
      });

      const data = await res.json();
      setInputVal('');
      handleUSSDResponse(data.message || data.response || 'END Session Finished');
    } catch (err) {
      console.error('USSD input error:', err);
      setScreenText('END Service temporarily unavailable. Please retry.');
      setIsCon(false);
    } finally {
      setLoading(false);
    }
  };

  const handleKeypadPress = (val: string) => {
    playTone(350 + val.charCodeAt(0) * 8);
    if (!inSession) {
      setDialedCode((prev) => prev + val);
    } else if (isCon) {
      setInputVal((prev) => prev + val);
    }
  };

  const handleBackspace = () => {
    playTone(280);
    if (!inSession) {
      setDialedCode((prev) => prev.slice(0, -1));
    } else if (isCon) {
      setInputVal((prev) => prev.slice(0, -1));
    }
  };

  const endCall = () => {
    playTone(220);
    setInSession(false);
    setScreenText('');
    setInputVal('');
    setSessionHistory([]);
    setIsCon(true);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText('*6112#');
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-zinc-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-zinc-900 rounded-3xl max-w-md w-full border border-zinc-700/80 shadow-2xl overflow-hidden text-white animate-in fade-in zoom-in-95 duration-150">
        {/* Top Header */}
        <div className="px-5 py-3.5 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-black text-xs shadow-md">
              6112
            </div>
            <div>
              <h3 className="text-xs font-black tracking-wide text-zinc-100 flex items-center gap-1.5">
                Ethio Telecom USSD <span className="text-emerald-400 font-mono">*6112#</span>
              </h3>
              <p className="text-[10px] text-zinc-400">Offline 2G / Feature Phone Gateway</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Language toggle */}
            <button
              onClick={() => {
                const nextLang = language === 'en' ? 'am' : language === 'am' ? 'om' : 'en';
                setLanguage(nextLang);
                if (inSession) {
                  endCall();
                }
              }}
              className="px-2 py-1 rounded-md bg-zinc-800 hover:bg-zinc-700 text-[10px] font-bold text-emerald-400 border border-zinc-700 flex items-center gap-1 cursor-pointer"
              title="Switch Language"
            >
              <Languages className="h-3 w-3" />
              <span>{language === 'en' ? 'English' : language === 'am' ? 'አማርኛ' : 'Oromoo'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Mobile Device Body Frame */}
        <div className="p-5 space-y-4">
          {/* Feature Phone LCD Screen Container */}
          <div className="rounded-2xl bg-gradient-to-b from-[#183324] to-[#0d2217] border-2 border-emerald-800/80 p-4 shadow-inner relative min-h-[220px] flex flex-col justify-between">
            {/* Status Bar */}
            <div className="flex items-center justify-between text-[10px] text-emerald-400 font-mono pb-2 border-b border-emerald-800/40">
              <div className="flex items-center gap-1.5 font-bold">
                <Signal className="h-3 w-3 text-emerald-300" />
                <span>Ethio Telecom 4G/2G</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] bg-emerald-950/90 text-emerald-300 px-1.5 py-0.2 rounded border border-emerald-700/50">
                  {phoneNumber}
                </span>
                <BatteryMedium className="h-3.5 w-3.5 text-emerald-400" />
              </div>
            </div>

            {/* LCD Screen Content Area */}
            <div className="py-3 flex-1 flex flex-col justify-center">
              {!inSession ? (
                /* Ready State / Idle Screen */
                <div className="text-center space-y-3 py-2">
                  <div className="inline-block px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 text-[11px] font-bold font-mono tracking-wider">
                    {dialedCode || 'ENTER CODE (e.g. *6112#)'}
                  </div>
                  <p className="text-[11px] text-emerald-200/80 font-sans max-w-xs mx-auto leading-relaxed">
                    Dial <strong className="text-emerald-300 font-mono">*6112#</strong> to trade, check spot harvest prices, classify target buyers (Processors/Investors/Buyers), and get Telebirr loans.
                  </p>

                  <div className="flex justify-center gap-2 pt-1">
                    <button
                      onClick={() => {
                        setDialedCode('*6112#');
                        startUSSDCall('*6112#');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-black shadow-md flex items-center gap-1 cursor-pointer transition-all hover:scale-105"
                    >
                      <PhoneCall className="h-3 w-3" /> Quick Dial *6112#
                    </button>
                    <button
                      onClick={handleCopyCode}
                      className="px-2.5 py-1.5 rounded-lg bg-zinc-800/90 hover:bg-zinc-700 text-emerald-300 text-[10px] font-bold border border-emerald-800/40 flex items-center gap-1 cursor-pointer"
                    >
                      {copiedCode ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                      <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>
              ) : loading ? (
                /* Loading / USSD Requesting State */
                <div className="text-center py-6 space-y-2">
                  <RefreshCw className="h-6 w-6 text-emerald-400 animate-spin mx-auto" />
                  <p className="text-xs font-mono text-emerald-300 font-bold">
                    USSD Running...
                  </p>
                  <p className="text-[10px] text-emerald-500">Communicating with AgriLink Ethio Gateway</p>
                </div>
              ) : (
                /* Active USSD Dialog Modal on Feature Screen */
                <div className="bg-[#0f2a1c] border border-emerald-600/70 rounded-xl p-3.5 shadow-lg space-y-2.5">
                  <div className="text-xs font-mono text-emerald-100 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
                    {screenText}
                  </div>

                  {isCon && (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        sendUSSDInput();
                      }}
                      className="flex gap-2 pt-1 border-t border-emerald-800/50"
                    >
                      <input
                        ref={inputRef}
                        type="text"
                        value={inputVal}
                        onChange={(e) => setInputVal(e.target.value)}
                        placeholder="Enter option number..."
                        className="flex-1 px-2.5 py-1.5 bg-[#081810] border border-emerald-600 rounded-lg text-xs font-mono text-emerald-200 placeholder:text-emerald-700 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                        autoFocus
                      />
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer shadow-xs disabled:opacity-50"
                      >
                        <Send className="h-3 w-3" /> Send
                      </button>
                    </form>
                  )}
                </div>
              )}
            </div>

            {/* In-Session Footer Action Bar */}
            {inSession && (
              <div className="flex items-center justify-between pt-2 border-t border-emerald-800/40 text-[10px]">
                <span className="text-emerald-400/80 font-mono">
                  {isCon ? 'Active USSD Session' : 'Session Finished'}
                </span>
                <button
                  onClick={endCall}
                  className="px-2.5 py-1 rounded-md bg-rose-900/80 hover:bg-rose-800 text-rose-200 font-bold flex items-center gap-1 cursor-pointer border border-rose-700/50"
                >
                  <PhoneOff className="h-3 w-3" /> End Session
                </button>
              </div>
            )}
          </div>

          {/* Quick Phone Number Bar */}
          <div className="bg-zinc-950 p-2.5 rounded-xl border border-zinc-800 flex items-center justify-between text-xs">
            <span className="text-[11px] text-zinc-400 font-medium">Farmer Phone SIM:</span>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="e.g. 0961123330"
              className="bg-zinc-900 border border-zinc-700 rounded-md px-2.5 py-1 text-xs font-mono text-emerald-400 font-bold focus:outline-none focus:ring-1 focus:ring-emerald-500 w-36 text-right"
            />
          </div>

          {/* Realistic Mobile Keypad */}
          <div className="bg-zinc-950 rounded-2xl p-3 border border-zinc-800 space-y-2">
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: '1', sub: '.,' },
                { label: '2', sub: 'ABC' },
                { label: '3', sub: 'DEF' },
                { label: '4', sub: 'GHI' },
                { label: '5', sub: 'JKL' },
                { label: '6', sub: 'MNO' },
                { label: '7', sub: 'PQRS' },
                { label: '8', sub: 'TUV' },
                { label: '9', sub: 'WXYZ' },
                { label: '*', sub: 'CODE' },
                { label: '0', sub: '+' },
                { label: '#', sub: 'SEND' },
              ].map((key) => (
                <button
                  key={key.label}
                  onClick={() => handleKeypadPress(key.label)}
                  className="py-2 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 active:bg-emerald-900/60 border border-zinc-800 hover:border-emerald-700/60 transition-all flex flex-col items-center justify-center cursor-pointer group shadow-2xs"
                >
                  <span className="text-base font-bold text-zinc-100 group-hover:text-emerald-400 leading-tight">
                    {key.label}
                  </span>
                  <span className="text-[9px] text-zinc-500 group-hover:text-zinc-300 font-mono">
                    {key.sub}
                  </span>
                </button>
              ))}
            </div>

            {/* Action Buttons Row */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              <button
                onClick={() => startUSSDCall()}
                disabled={inSession && isCon}
                className="py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-950 cursor-pointer disabled:opacity-50"
              >
                <Phone className="h-3.5 w-3.5" /> Call
              </button>

              <button
                onClick={handleBackspace}
                className="py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs flex items-center justify-center cursor-pointer"
              >
                Clear
              </button>

              <button
                onClick={endCall}
                className="py-2.5 rounded-xl bg-rose-800 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
              >
                <PhoneOff className="h-3.5 w-3.5" /> End
              </button>
            </div>
          </div>

          {/* Quick Explanatory Footer */}
          <div className="text-[11px] text-zinc-400 bg-zinc-950/80 p-3 rounded-xl border border-zinc-800/80 space-y-1">
            <span className="font-bold text-zinc-300 block flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-emerald-400" /> Real-Time Offline Synchronization
            </span>
            <p className="text-[10px] text-zinc-400 leading-relaxed">
              Listings and loan requests submitted via shortcode <strong className="text-emerald-400">*6112#</strong> instantly persist into the PostgreSQL database and produce marketplace.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
