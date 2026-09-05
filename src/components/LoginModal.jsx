import React, { useState } from 'react';
import { Modal } from './Modal';
import { useAuth } from '../context/AuthContext';
import { Mail, Key, LogIn, Lock } from 'lucide-react';

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

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Acesso Reservado à Gestão" maxWidth="max-w-md">
      <form onSubmit={handleSubmit} className="space-y-6 pt-1">
        
        {/* Header Logo & Subtitle */}
        <div className="text-center pb-4 border-b border-[#ebd0c0] dark:border-[#002a59]">
          <img
            src="/dolce-candele-text-nobg.png"
            alt="Dolce Candele"
            className="h-12 w-auto mx-auto object-contain mb-2"
          />
          <p className="text-xs font-semibold text-[#002658] dark:text-[#fadbc7]">
            Portal de Gestão Operacional & Financeira
          </p>
        </div>

        {/* Form Inputs */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#002658] dark:text-[#fadbc7] mb-1.5 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#002658] dark:text-[#fadbc7]" /> Email de Utilizador *
            </label>
            <input
              type="email"
              required
              placeholder="admin@dolcecandele.pt"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 text-xs rounded-2xl bg-[#f8ece1]/50 dark:bg-[#001229] border border-[#ebd0c0] dark:border-[#002a59] focus:outline-none focus:ring-2 focus:ring-[#002658] text-[#002658] dark:text-[#fadbc7] font-medium transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#002658] dark:text-[#fadbc7] mb-1.5 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-[#002658] dark:text-[#fadbc7]" /> Palavra-passe *
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 text-xs rounded-2xl bg-[#f8ece1]/50 dark:bg-[#001229] border border-[#ebd0c0] dark:border-[#002a59] focus:outline-none focus:ring-2 focus:ring-[#002658] text-[#002658] dark:text-[#fadbc7] font-medium transition-all"
            />
          </div>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 text-xs font-semibold">
            {errorMsg}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-4 px-6 rounded-full bg-[#002658] text-[#f8ece1] dark:bg-[#fadbc7] dark:text-[#001f42] hover:bg-[#001a3d] dark:hover:bg-white font-semibold text-xs shadow-md transition-all flex items-center justify-center gap-2"
        >
          <LogIn className="w-4 h-4 text-[#f8ece1] dark:text-[#001f42]" /> Entrar no Portal de Gestão
        </button>

      </form>
    </Modal>
  );
};
