import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { SYNDICATE_LOGO } from '../data/initialData';
import {
  Building2,
  Lock,
  Mail,
  Fingerprint,
  Scan,
  Camera,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  RefreshCw,
  X,
  User,
  Shield,
  Key,
  Copy,
} from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthMethod = 'PASSWORD' | 'FINGERPRINT' | 'FACE_ID';

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { login, employees, switchUser } = useAuth();
  const [authMethod, setAuthMethod] = useState<AuthMethod>('FINGERPRINT');
  const [selectedEmpId, setSelectedEmpId] = useState<string>('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Biometric Scan state
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanSuccess, setScanSuccess] = useState(false);
  const [scanStatusMsg, setScanStatusMsg] = useState('');

  // Camera stream for Face ID
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(false);

  // Default selected employee
  useEffect(() => {
    if (employees.length > 0 && !selectedEmpId) {
      setSelectedEmpId(employees[0].id);
      setEmail(employees[0].email);
    }
  }, [employees, selectedEmpId]);

  // Clean up camera on close/unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  const startCamera = async () => {
    setCameraError(false);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          setCameraActive(true);
        }
      } else {
        setCameraError(true);
      }
    } catch (err) {
      console.warn('Camera access prevented or unavailable:', err);
      setCameraError(true);
    }
  };

  if (!isOpen) return null;

  const handleSubmitPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('يرجى إدخال البريد الإلكتروني');
      return;
    }
    const success = login(email, password);
    if (success) {
      setError('');
      stopCamera();
      onClose();
    } else {
      setError('عذراً، البريد الإلكتروني غير مسجل في النظام.');
    }
  };

  const handleQuickSelectEmp = (empId: string) => {
    setSelectedEmpId(empId);
    const emp = employees.find((e) => e.id === empId);
    if (emp) setEmail(emp.email);
  };

  // Trigger Biometric Verification (Fingerprint or Face ID)
  const startBiometricScan = (type: 'FINGERPRINT' | 'FACE_ID') => {
    setError('');
    setIsScanning(true);
    setScanProgress(0);
    setScanSuccess(false);

    if (type === 'FACE_ID') {
      setScanStatusMsg('جاري تهيئة الحساسات والتحقق من ملامح الوجه...');
      startCamera();
    } else {
      setScanStatusMsg('ضع إبهامك على حساس البصمة الإلكتروني...');
    }

    // Attempt real WebAuthn if available in browser
    if (window.PublicKeyCredential && typeof window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable === 'function') {
      window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable().then((available) => {
        if (available) {
          // Native device biometric prompt available
          console.log('Native biometric platform authenticator is available');
        }
      });
    }

    // Animated scanning progress simulation
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 12;
      setScanProgress(Math.min(currentProgress, 100));

      if (currentProgress === 36) {
        setScanStatusMsg(
          type === 'FACE_ID'
            ? 'جاري مطابقة النقاط الحيوية لمحيط الوجه...'
            : 'جاري القراءة والتحقق من التشفير الحيوي للبصمة...'
        );
      } else if (currentProgress === 72) {
        setScanStatusMsg('جاري تأكيد هوية الموظف في القواعد الأمنية...');
      } else if (currentProgress >= 100) {
        clearInterval(interval);
        setScanSuccess(true);
        setScanStatusMsg('تمت مطابقة البصمة بنجاح! جاري إدخالك للمنظومة...');

        // Perform login after short delay
        setTimeout(() => {
          stopCamera();
          switchUser(selectedEmpId);
          setIsScanning(false);
          onClose();
        }, 1200);
      }
    }, 250);
  };

  const selectedEmp = employees.find((e) => e.id === selectedEmpId) || employees[0];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/90 w-full max-w-lg p-6 sm:p-8 animate-in zoom-in-95 space-y-5 text-slate-900 relative">
        
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <img
              src={SYNDICATE_LOGO}
              alt="نقابة المحاسبين العراقيين"
              className="w-12 h-12 rounded-2xl object-cover ring-1 ring-emerald-500/30 shadow-sm bg-white p-0.5 shrink-0"
              referrerPolicy="no-referrer"
            />
            <div>
              <h2 className="text-base font-black text-slate-900">
                نقابة المحاسبين العراقيين
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                تسجيل الدخول بالبصمة (الحيوية / الوجه) أو كلمة المرور
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="text-slate-400 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-2xl text-center flex items-center justify-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Authentication Mode Tabs */}
        <div className="grid grid-cols-3 gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200/80">
          <button
            type="button"
            onClick={() => {
              stopCamera();
              setAuthMethod('FINGERPRINT');
              setIsScanning(false);
            }}
            className={`py-2 px-2 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 ${
              authMethod === 'FINGERPRINT'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Fingerprint className="w-4 h-4" />
            <span>بصمة الأصبع</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setAuthMethod('FACE_ID');
              setIsScanning(false);
            }}
            className={`py-2 px-2 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 ${
              authMethod === 'FACE_ID'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Scan className="w-4 h-4" />
            <span>بصمة الوجه</span>
          </button>

          <button
            type="button"
            onClick={() => {
              stopCamera();
              setAuthMethod('PASSWORD');
              setIsScanning(false);
            }}
            className={`py-2 px-2 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 ${
              authMethod === 'PASSWORD'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>كلمة المرور</span>
          </button>
        </div>

        {/* 1. FINGERPRINT AUTH MODE */}
        {authMethod === 'FINGERPRINT' && (
          <div className="space-y-4 text-center">
            {/* Selected Employee Picker */}
            <div className="space-y-1.5 text-right">
              <label className="text-xs font-bold text-slate-700 block">اختر حساب الموظف للبصمة:</label>
              <select
                value={selectedEmpId}
                onChange={(e) => handleQuickSelectEmp(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 text-slate-800 font-bold rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name} ({emp.jobTitle})
                  </option>
                ))}
              </select>
            </div>

            {/* Employee Preview Badge */}
            {selectedEmp && (
              <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-200 flex items-center gap-3">
                <img
                  src={selectedEmp.avatar}
                  alt={selectedEmp.name}
                  className="w-9 h-9 rounded-xl object-cover ring-1 ring-slate-200 bg-white"
                  referrerPolicy="no-referrer"
                />
                <div className="text-right flex-1">
                  <div className="text-xs font-black text-slate-900">{selectedEmp.name}</div>
                  <div className="text-[11px] text-emerald-700 font-bold">{selectedEmp.jobTitle}</div>
                </div>
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
              </div>
            )}

            {/* Fingerprint Interactive Touch Zone */}
            <div className="py-2 space-y-3">
              <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
                <div
                  className={`absolute inset-0 rounded-full border-2 transition-all duration-300 ${
                    isScanning
                      ? 'border-emerald-500 animate-ping opacity-75'
                      : 'border-slate-200'
                  }`}
                ></div>
                <button
                  type="button"
                  onClick={() => !isScanning && startBiometricScan('FINGERPRINT')}
                  className={`relative z-10 w-22 h-22 rounded-full flex flex-col items-center justify-center transition active:scale-95 ${
                    scanSuccess
                      ? 'bg-emerald-600 text-white shadow-md'
                      : isScanning
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-slate-100 text-emerald-700 hover:bg-emerald-50 border border-slate-200'
                  }`}
                >
                  {scanSuccess ? (
                    <CheckCircle2 className="w-10 h-10 animate-bounce" />
                  ) : (
                    <Fingerprint className={`w-10 h-10 ${isScanning ? 'animate-pulse' : ''}`} />
                  )}
                </button>
              </div>

              <div className="space-y-1.5">
                <p className="text-xs font-bold text-slate-700">
                  {isScanning
                    ? scanStatusMsg
                    : 'انقر على بصمة الأصبع للتحقق والدخول'}
                </p>

                {isScanning && (
                  <div className="w-full max-w-xs mx-auto bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
                    <div
                      className={`h-full transition-all duration-200 ${
                        scanSuccess ? 'bg-emerald-600' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${scanProgress}%` }}
                    ></div>
                  </div>
                )}
              </div>

              {!isScanning && (
                <button
                  type="button"
                  onClick={() => startBiometricScan('FINGERPRINT')}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-xs transition active:scale-95 flex items-center justify-center gap-2"
                >
                  <Fingerprint className="w-4 h-4" />
                  <span>بدء مسح بصمة الأصبع</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* 2. FACE ID AUTH MODE */}
        {authMethod === 'FACE_ID' && (
          <div className="space-y-4 text-center">
            {/* Selected Employee Picker */}
            <div className="space-y-1.5 text-right">
              <label className="text-xs font-bold text-slate-700 block">اختر حساب الموظف لبصمة الوجه:</label>
              <select
                value={selectedEmpId}
                onChange={(e) => handleQuickSelectEmp(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 text-slate-800 font-bold rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name} ({emp.jobTitle})
                  </option>
                ))}
              </select>
            </div>

            {/* Camera / Cybernetic Face Scanner Box */}
            <div className="relative w-full h-44 bg-slate-900 rounded-2xl border border-slate-200 overflow-hidden flex flex-col items-center justify-center shadow-inner">
              <video
                ref={videoRef}
                muted
                playsInline
                className={`absolute inset-0 w-full h-full object-cover transform -scale-x-100 ${
                  cameraActive ? 'block' : 'hidden'
                }`}
              />

              {!cameraActive && (
                <div className="flex flex-col items-center justify-center space-y-1 text-slate-400">
                  <Scan className="w-8 h-8 text-emerald-400 animate-pulse" />
                  <span className="text-[11px] font-bold">محاكي الفحص الرقمي لمحيط الوجه</span>
                </div>
              )}

              {scanSuccess && (
                <div className="absolute inset-0 bg-emerald-950/90 flex flex-col items-center justify-center space-y-1 text-white animate-in zoom-in-95">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 animate-bounce" />
                  <span className="text-xs font-bold">تم المطابقة بنجاح</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <p className="text-xs font-bold text-slate-700">
                {isScanning ? scanStatusMsg : 'وجه الكاميرا أو انقر لبدء المطابقة'}
              </p>

              {!isScanning && (
                <button
                  type="button"
                  onClick={() => startBiometricScan('FACE_ID')}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-xs transition active:scale-95 flex items-center justify-center gap-2"
                >
                  <Camera className="w-4 h-4" />
                  <span>التحقق عبر بصمة الوجه</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* 3. STANDARD PASSWORD AUTH MODE */}
        {authMethod === 'PASSWORD' && (
          <form onSubmit={handleSubmitPassword} className="space-y-3.5">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                البريد الإلكتروني الوظيفي
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                <input
                  type="email"
                  required
                  placeholder="admin@accountants.iq"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pr-9 pl-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                كلمة المرور
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pr-9 pl-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-xs transition active:scale-95"
            >
              الدخول إلى النظام
            </button>
          </form>
        )}

        {/* Quick Demo Switcher & Registered Credentials Table */}
        <div className="pt-3 border-t border-slate-100 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-slate-700 flex items-center gap-1">
              <Key className="w-3.5 h-3.5 text-emerald-600" />
              <span>الحسابات المعتمدة وكلمات المرور (5 موظفين):</span>
            </span>
          </div>

          <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
            {employees.map((emp) => (
              <div
                key={emp.id}
                className={`p-2 rounded-xl border transition flex items-center justify-between text-right ${
                  selectedEmpId === emp.id
                    ? 'border-emerald-500 bg-emerald-50/60'
                    : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/80'
                }`}
              >
                <button
                  type="button"
                  onClick={() => {
                    stopCamera();
                    switchUser(emp.id);
                    onClose();
                  }}
                  className="flex items-center gap-2 min-w-0 flex-1 text-right"
                >
                  <img
                    src={emp.avatar}
                    alt={emp.name}
                    className="w-7 h-7 rounded-lg object-cover shrink-0 border border-slate-200 bg-white"
                    referrerPolicy="no-referrer"
                  />
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-900 truncate flex items-center gap-1">
                      <span>{emp.name}</span>
                      <span
                        className={`text-[9px] font-extrabold px-1 rounded ${
                          emp.role === 'ADMIN'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {emp.role === 'ADMIN' ? 'مدير' : 'موظف'}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono dir-ltr truncate">
                      {emp.email} • رمز السر: <span className="text-emerald-700 font-bold">{emp.password || 'emp123'}</span>
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedEmpId(emp.id);
                    setEmail(emp.email);
                    setPassword(emp.password || 'emp123');
                    setAuthMethod('PASSWORD');
                  }}
                  className="mr-2 text-[10px] font-bold px-2 py-1 rounded-lg bg-slate-200 hover:bg-emerald-600 hover:text-white transition shrink-0 text-slate-700"
                >
                  تعبئة
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

