import React, { useState } from 'react';
import { Modal } from './Modal';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, Key, ShieldCheck, Sparkles, LogIn } from 'lucide-react';

export const LoginModal = ({ isOpen, onClose }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('admin@dolcecandele.pt');
  const [password, setPassword] = useState('dolce2026');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    const result = login(email, password);
    if (!result.success) {
      setErrorMsg(result.error);
    } else {
      if (onClose) onClose();
    }
  };

  const fillDemoAdmin = () => {
    setEmail('admin@dolcecandele.pt');
    setPassword('dolce2026');
    setErrorMsg('');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Acesso Reservado à Gestão" maxWidth="max-w-md">
      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Header Logo */}
        <div className="text-center pb-3 border-b border-[#fadbc7]">
          <img
            src="/dolce-candele-text-nobg.png"
            alt="Dolce Candele"
            className="h-12 w-auto mx-auto object-contain mb-2"
          />
          <p className="text-xs font-extrabold text-[#002a59] dark:text-[#fadbc7]">
            Portal de Gestão Operacional & Financeira
          </p>
        </div>

        {/* Demo Credentials Badge */}
        <div
          onClick={fillDemoAdmin}
          className="p-3 rounded-2xl bg-[#fadbc7]/40 dark:bg-[#002a59]/60 border border-[#fadbc7] cursor-pointer hover:bg-[#fadbc7]/60 transition-colors flex items-center justify-between text-xs"
        >
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#002a59] dark:text-[#fadbc7]" />
            <div>
              <span className="font-extrabold text-[#002a59] dark:text-[#fadbc7] block">
                Conta Admin de Demonstração
              </span>
              <span className="text-[11px] text-stone-600 dark:text-stone-300">
                admin@dolcecandele.pt / dolce2026
              </span>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2 py-1 rounded-lg bg-[#002a59] text-[#fadbc7]">
            Usar
          </span>
        </div>

        {/* Form Inputs */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#002a59] dark:text-[#fadbc7] mb-1 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" /> Email de Utilizador *
            </label>
            <input
              type="email"
              required
              placeholder="admin@dolcecandele.pt"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-white dark:bg-[#001229] border border-[#fadbc7] focus:ring-2 focus:ring-[#002a59] font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#002a59] dark:text-[#fadbc7] mb-1 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5" /> Palavra-passe *
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-white dark:bg-[#001229] border border-[#fadbc7] focus:ring-2 focus:ring-[#002a59] font-medium"
            />
          </div>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 text-xs font-bold">
            {errorMsg}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-3.5 px-4 rounded-xl bg-[#002a59] text-[#fadbc7] hover:bg-[#001f42] font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 border border-[#fadbc7]/40"
        >
          <LogIn className="w-4 h-4 text-[#fadbc7]" /> Entrar no Portal de Gestão
        </button>

      </form>
    </Modal>
  );
};
