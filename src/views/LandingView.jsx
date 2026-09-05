import React, { useState } from 'react';
import {
  Sparkles,
  Flame,
  Heart,
  ArrowRight,
  Leaf,
  Gift,
  Award,
  Smile,
  ShieldCheck,
  Lock
} from 'lucide-react';
import { Modal } from '../components/Modal';

const InstagramIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

export const LandingView = ({ onOpenLogin }) => {
  const [selectedCandleModal, setSelectedCandleModal] = useState(null);

  const collections = [
    {
      id: 'frutadas',
      title: 'Frutadas',
      subtitle: 'Explorar →',
      image: '/strawberry-candle-mockup.jpg',
      name: 'Vela Milkshake de Morango com Chantilly',
      description: 'Vela artesanal em copo alto milkshake com fragrância natural de morangos silvestres e natas doces.',
      notes: 'Morango Silvestre, Baunilha Bourbon & Natas Doces',
      price: '22.50 €'
    },
    {
      id: 'citricas',
      title: 'Cítricas',
      subtitle: 'Explorar →',
      image: '/blueberry-candle-mockup.jpg',
      name: 'Vela Torta Mousse de Mirtilo & Limão',
      description: 'Vela na latinha pastel rosa com aroma fresco de mirtilos silvestres e zeste de limão.',
      notes: 'Mirtilo Silvestre, Zeste de Limão & Baunilha',
      price: '16.50 €'
    },
    {
      id: 'gourmet',
      title: 'Gourmet',
      subtitle: 'Explorar →',
      image: '/cappuccino-candle-mockup.jpg',
      name: 'Vela Cappuccino com Caramelo Salgado',
      description: 'Vela em taça vintage de vidro com aroma encorpado de café arabica e calda de caramelo.',
      notes: 'Café Torrado, Caramelo Salgado & Grãos de Cacau',
      price: '19.90 €'
    },
    {
      id: 'indulgentes',
      title: 'Indulgentes',
      subtitle: 'Explorar →',
      image: '/chocolate-candle-mockup.jpg',
      name: 'Vela Taça Brownie & Cookies de Chocolate',
      description: 'Vela estilo brownie de chocolate com calda realista de cacau, chantilly de cera e mini cookies.',
      notes: 'Chocolate Amargo, Avelã Torrada & Baunilha',
      price: '21.00 €'
    }
  ];

  return (
    <div className="bg-[#f8ebe0] dark:bg-[#001229] min-h-screen text-[#3a1f18] dark:text-[#fadbc7] transition-colors overflow-x-hidden font-sans">
      
      {/* 1. HERO SECTION */}
      <section id="hero" className="relative pt-8 pb-16 px-4 sm:px-8 max-w-[1500px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Hero Text Content */}
          <div className="lg:col-span-6 space-y-6">
            
            <span className="text-[11px] font-bold tracking-[0.25em] text-[#8c6858] dark:text-[#fadbc7]/80 uppercase block">
              Velas Artesanais
            </span>

            <h1 className="font-serif-luxury text-4xl sm:text-6xl md:text-7xl font-bold leading-[1.08] text-[#3a1f18] dark:text-[#fadbc7]">
              A doçura <br />
              <span className="italic font-normal">que ilumina</span> <br />
              o teu dia <span className="font-sans font-light text-rose-400">♡</span>
            </h1>

            <p className="text-sm sm:text-base text-[#6b473b] dark:text-[#fadbc7]/90 max-w-lg leading-relaxed font-normal">
              Velas artesanais com o irresistível aspeto de sobremesas. Aromas únicos, detalhes reais e momentos mais doces em tua casa.
            </p>

            {/* Primary Action Button */}
            <div className="pt-2">
              <a
                href="#colecoes"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#3a1f18] text-[#f8ebe0] dark:bg-[#fadbc7] dark:text-[#001f42] font-semibold text-sm hover:bg-[#2b150f] dark:hover:bg-white transition-all shadow-md group"
              >
                <span>Explora a coleção</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>

            {/* Badges Row */}
            <div className="pt-8 grid grid-cols-3 gap-3 max-w-md border-t border-[#ebd3c5] dark:border-[#002a59]">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#5a3a30] dark:text-[#fadbc7]/90">
                <div className="w-7 h-7 rounded-full bg-[#f1ded2] dark:bg-[#002a59] flex items-center justify-center shrink-0">
                  <Leaf className="w-3.5 h-3.5 text-[#3a1f18] dark:text-[#fadbc7]" />
                </div>
                <span>Feitas à mão</span>
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold text-[#5a3a30] dark:text-[#fadbc7]/90">
                <div className="w-7 h-7 rounded-full bg-[#f1ded2] dark:bg-[#002a59] flex items-center justify-center shrink-0">
                  <Heart className="w-3.5 h-3.5 text-[#3a1f18] dark:text-[#fadbc7]" />
                </div>
                <span>Ingredientes premium</span>
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold text-[#5a3a30] dark:text-[#fadbc7]/90">
                <div className="w-7 h-7 rounded-full bg-[#f1ded2] dark:bg-[#002a59] flex items-center justify-center shrink-0">
                  <Gift className="w-3.5 h-3.5 text-[#3a1f18] dark:text-[#fadbc7]" />
                </div>
                <span>O presente perfeito</span>
              </div>
            </div>

          </div>

          {/* Right Hero Image Composition */}
          <div className="lg:col-span-6 flex justify-center relative">
            
            {/* Handwritten calligraphic text floating top right */}
            <div className="absolute -top-4 right-2 sm:right-8 z-20 font-handwriting text-2xl sm:text-3xl text-[#3a1f18] dark:text-[#fadbc7] rotate-[-4deg] max-w-[200px] leading-tight drop-shadow-xs pointer-events-none">
              Parece comida. <br />
              Cheira a felicidade. <span className="text-rose-400">♡</span>
            </div>

            <div className="relative w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl bg-[#f5dfd0] dark:bg-[#002a59] border border-[#ebd3c5]">
              <img
                src="/strawberry-candle-mockup.jpg"
                alt="Vela Milkshake de Morango Gourmet"
                className="w-full h-[520px] object-cover object-center"
              />

              {/* Tag hanging element simulation */}
              <div className="absolute bottom-6 right-6 bg-[#f7e8dc]/95 dark:bg-[#001f42]/95 backdrop-blur-md px-4 py-3 rounded-xl border border-[#3a1f18]/20 text-[10px] text-[#3a1f18] dark:text-[#fadbc7] shadow-lg max-w-[220px]">
                <span className="font-serif-luxury font-bold tracking-wider block text-xs uppercase">
                  Strawberry Dream Co.
                </span>
                <span className="block text-[9px] text-[#6b473b] dark:text-[#fadbc7]/80 mt-0.5">
                  ARTISANAL DESSERT CANDLE • HANDPOURED SOY WAX
                </span>
                <span className="block text-[9px] font-bold mt-1">NET WT. 12 OZ | EST. 2025</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* WAVE DIVIDER 1 */}
      <div className="w-full overflow-hidden leading-none text-[#f3e0d2] dark:text-[#001f42]">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-12">
          <path d="M0,0 C150,90 350,-40 500,45 C650,130 900,10 1200,40 L1200,120 L0,120 Z" fill="currentColor"></path>
        </svg>
      </div>

      {/* 2. SECTION: AS NOSSAS COLEÇÕES / SABORES QUE INSPIRAM */}
      <section id="colecoes" className="bg-[#f3e0d2] dark:bg-[#001f42] py-16 px-4 sm:px-8 transition-colors">
        <div className="max-w-[1500px] mx-auto space-y-10">
          
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold tracking-[0.25em] text-[#8c6858] dark:text-[#fadbc7]/80 uppercase block">
                As Nossas Coleções
              </span>
              <h2 className="font-serif-luxury text-4xl sm:text-5xl font-bold italic text-[#3a1f18] dark:text-[#fadbc7] mt-1">
                Sabores que inspiram
              </h2>
            </div>

            <a
              href="#colecoes"
              className="px-6 py-2.5 rounded-full border border-[#3a1f18] text-[#3a1f18] dark:border-[#fadbc7] dark:text-[#fadbc7] font-semibold text-xs hover:bg-[#3a1f18] hover:text-[#f8ebe0] dark:hover:bg-[#fadbc7] dark:hover:text-[#001f42] transition-all"
            >
              Ver todas →
            </a>
          </div>

          {/* 4 Arch Collection Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {collections.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedCandleModal(item)}
                className="group cursor-pointer flex flex-col items-center text-center space-y-4"
              >
                {/* Arch-shaped image container */}
                <div className="relative w-full aspect-[4/5] rounded-t-[140px] rounded-b-3xl overflow-hidden bg-[#f8ebe0] dark:bg-[#002a59] border border-[#ebd3c5]/80 shadow-md group-hover:shadow-xl transition-all duration-300">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#3a1f18]/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                <div>
                  <h3 className="font-serif-luxury text-2xl font-bold text-[#3a1f18] dark:text-[#fadbc7]">
                    {item.title}
                  </h3>
                  <span className="text-xs font-semibold text-[#8c6858] dark:text-[#fadbc7]/80 group-hover:underline block mt-0.5">
                    {item.subtitle}
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* WAVE DIVIDER 2 */}
      <div className="w-full overflow-hidden leading-none text-[#f3e0d2] dark:text-[#001f42] rotate-180">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-12">
          <path d="M0,0 C150,90 350,-40 500,45 C650,130 900,10 1200,40 L1200,120 L0,120 Z" fill="currentColor"></path>
        </svg>
      </div>

      {/* 3. SECTION: MAIS DO QUE VELAS / PEQUENOS DETALHES, GRANDES MOMENTOS */}
      <section id="sobre" className="py-16 px-4 sm:px-8 max-w-[1500px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text Content */}
          <div className="lg:col-span-5 space-y-6">
            
            <span className="text-[11px] font-bold tracking-[0.25em] text-[#8c6858] dark:text-[#fadbc7]/80 uppercase block">
              Mais do que Velas
            </span>

            <h2 className="font-serif-luxury text-4xl sm:text-5xl font-bold leading-tight text-[#3a1f18] dark:text-[#fadbc7]">
              Pequenos detalhes, <br />
              grandes momentos
            </h2>

            <p className="text-sm text-[#6b473b] dark:text-[#fadbc7]/90 leading-relaxed font-normal max-w-md">
              Cada vela é cuidadosamente feita à mão, com amor e atenção aos detalhes, para tornar os teus dias mais especiais.
            </p>

            <div className="space-y-3 pt-2">
              <a
                href="#contactos"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#3a1f18] text-[#f8ebe0] dark:bg-[#fadbc7] dark:text-[#001f42] font-semibold text-sm hover:bg-[#2b150f] dark:hover:bg-white transition-all shadow-md group"
              >
                <span>A nossa história</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>

              {/* Handwritten annotation below button */}
              <div className="font-handwriting text-3xl text-[#3a1f18] dark:text-[#fadbc7] pt-2 pl-2">
                Handmade with love <span className="text-rose-400">♡</span>
              </div>
            </div>

          </div>

          {/* Middle Product Feature Image */}
          <div className="lg:col-span-4 flex justify-center">
            <div className="relative w-full max-w-sm rounded-3xl overflow-hidden shadow-xl bg-[#f5dfd0] dark:bg-[#002a59] border border-[#ebd3c5]">
              <img
                src="/blueberry-candle-mockup.jpg"
                alt="Vela Blueberry Lemon Delight"
                className="w-full h-[420px] object-cover"
              />
            </div>
          </div>

          {/* Right Features Pills List */}
          <div className="lg:col-span-3 space-y-4">
            
            <div className="p-4 rounded-2xl bg-[#f2dfd1] dark:bg-[#002a59] border border-[#ebd3c5]/60 flex items-center gap-3 shadow-xs">
              <div className="w-10 h-10 rounded-full bg-[#f8ebe0] dark:bg-[#001f42] flex items-center justify-center shrink-0">
                <Leaf className="w-5 h-5 text-[#3a1f18] dark:text-[#fadbc7]" />
              </div>
              <span className="text-xs font-semibold text-[#3a1f18] dark:text-[#fadbc7]">
                Cera de soja natural
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-[#f2dfd1] dark:bg-[#002a59] border border-[#ebd3c5]/60 flex items-center gap-3 shadow-xs">
              <div className="w-10 h-10 rounded-full bg-[#f8ebe0] dark:bg-[#001f42] flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-[#3a1f18] dark:text-[#fadbc7]" />
              </div>
              <span className="text-xs font-semibold text-[#3a1f18] dark:text-[#fadbc7]">
                Aromas reais e envolventes
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-[#f2dfd1] dark:bg-[#002a59] border border-[#ebd3c5]/60 flex items-center gap-3 shadow-xs">
              <div className="w-10 h-10 rounded-full bg-[#f8ebe0] dark:bg-[#001f42] flex items-center justify-center shrink-0">
                <Heart className="w-5 h-5 text-[#3a1f18] dark:text-[#fadbc7]" />
              </div>
              <span className="text-xs font-semibold text-[#3a1f18] dark:text-[#fadbc7]">
                Design que conta histórias
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-[#f2dfd1] dark:bg-[#002a59] border border-[#ebd3c5]/60 flex items-center gap-3 shadow-xs">
              <div className="w-10 h-10 rounded-full bg-[#f8ebe0] dark:bg-[#001f42] flex items-center justify-center shrink-0">
                <Gift className="w-5 h-5 text-[#3a1f18] dark:text-[#fadbc7]" />
              </div>
              <span className="text-xs font-semibold text-[#3a1f18] dark:text-[#fadbc7]">
                Ideal para oferecer
              </span>
            </div>

          </div>

        </div>
      </section>

      {/* 4. FOOTER & CONTACTS */}
      <footer id="contactos" className="bg-[#f0ded0] dark:bg-[#001733] pt-12 pb-8 border-t border-[#ebd3c5]/60">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-8 space-y-8">
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <span className="font-serif-luxury text-3xl font-bold italic text-[#3a1f18] dark:text-[#fadbc7]">
                Dolce Candele
              </span>
              <p className="text-xs text-[#6b473b] dark:text-[#fadbc7]/80 font-normal">
                Velas Artesanais Gourmet & Sobremesas em Cera — Feitas à mão em Portugal.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <a
                href="https://www.instagram.com/dolcecandele.pt/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-full bg-[#3a1f18] text-[#f8ebe0] dark:bg-[#fadbc7] dark:text-[#001f42] font-semibold text-xs hover:bg-[#2b150f] dark:hover:bg-white transition-all flex items-center gap-2 shadow-sm"
              >
                <InstagramIcon className="w-4 h-4" />
                <span>@dolcecandele.pt</span>
              </a>

              <button
                onClick={onOpenLogin}
                className="px-6 py-3 rounded-full border border-[#3a1f18] text-[#3a1f18] dark:border-[#fadbc7] dark:text-[#fadbc7] font-semibold text-xs hover:bg-[#3a1f18] hover:text-[#f8ebe0] dark:hover:bg-[#fadbc7] dark:hover:text-[#001f42] transition-all flex items-center gap-2"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Gestão Admin</span>
              </button>
            </div>
          </div>

          <div className="pt-6 border-t border-[#ebd3c5]/40 text-center text-xs text-[#8c6858] dark:text-[#fadbc7]/60">
            © 2026 Dolce Candele. Todos os direitos reservados.
          </div>

        </div>
      </footer>

      {/* MODAL FOR CANDLE DETAILS */}
      {selectedCandleModal && (
        <Modal
          isOpen={!!selectedCandleModal}
          onClose={() => setSelectedCandleModal(null)}
          title={selectedCandleModal.name}
        >
          <div className="space-y-4">
            <img
              src={selectedCandleModal.image}
              alt={selectedCandleModal.name}
              className="w-full h-80 object-cover rounded-2xl border border-[#ebd3c5]"
            />

            <p className="text-xs text-[#5a3a30] dark:text-stone-300 font-medium leading-relaxed">
              {selectedCandleModal.description}
            </p>

            <div className="p-3 rounded-xl bg-[#f8ebe0] dark:bg-[#002a59] border border-[#ebd3c5] text-xs">
              <span className="text-[10px] font-bold text-[#8c6858] dark:text-[#fadbc7]/70 uppercase tracking-wider block">
                Notas Olfativas
              </span>
              <span className="font-semibold text-[#3a1f18] dark:text-[#fadbc7]">
                {selectedCandleModal.notes}
              </span>
            </div>

            <div className="pt-3 border-t border-[#ebd3c5] flex items-center justify-between">
              <span className="text-lg font-bold text-[#3a1f18] dark:text-[#fadbc7]">
                {selectedCandleModal.price}
              </span>

              <a
                href="https://www.instagram.com/dolcecandele.pt/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-full bg-[#3a1f18] text-[#f8ebe0] dark:bg-[#fadbc7] dark:text-[#001f42] font-semibold text-xs flex items-center gap-2 shadow-sm"
              >
                <InstagramIcon className="w-4 h-4" />
                <span>Encomendar via Instagram</span>
              </a>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
};
