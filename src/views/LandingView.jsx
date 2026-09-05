import React, { useState } from 'react';
import {
  Sparkles,
  Flame,
  Heart,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ShoppingBag,
  Info,
  Clock
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

  const candleCollection = [
    {
      id: 'strawberry-shake',
      name: 'Vela Milkshake de Morango com Chantilly',
      category: 'Vela em Copo Milkshake',
      image: '/strawberry-candle-mockup.jpg',
      description: 'Vela artesanal em copo alto milkshake, base rosa morango, topo em chantilly de cera de coco, pavio de madeira e mini-morangos de cera decorativos.',
      notes: 'Morango Silvestre, Baunilha Bourbon & Natas Doces',
      burnTime: '45 a 50 Horas',
      waxType: '100% Cera de Soja & Coco',
      wickType: 'Pavio Duplo de Madeira de Cedro',
      suggestedPrice: '22.50 €'
    },
    {
      id: 'cappuccino-caramel',
      name: 'Vela Cappuccino com Caramelo Salgado',
      category: 'Vela em Taça Vintage',
      image: '/cappuccino-candle-mockup.jpg',
      description: 'Vela em taça vintage de vidro grosso, aroma encorpado de café torrado arabica, espuma de cera e calda realista de caramelo salgado.',
      notes: 'Café Torrado, Caramelo Salgado & Grãos de Cacau',
      burnTime: '40 a 45 Horas',
      waxType: '100% Cera de Soja C-3',
      wickType: 'Pavio Duplo de Madeira',
      suggestedPrice: '19.90 €'
    },
    {
      id: 'blueberry-lemon',
      name: 'Vela Torta Mousse de Mirtilo & Limão',
      category: 'Vela em Latinha Pastel',
      image: '/blueberry-candle-mockup.jpg',
      description: 'Vela na latinha pastel rosa com aroma fresco de mirtilos silvestres e zeste de limão, topping cremoso de mousse de soja e mini mirtilos de cera.',
      notes: 'Mirtilo Silvestre, Zeste de Limão & Baunilha',
      burnTime: '35 a 40 Horas',
      waxType: '100% Cera de Soja Vegetal',
      wickType: 'Pavio de Madeira',
      suggestedPrice: '16.50 €'
    }
  ];

  return (
    <div className="space-y-16 pb-20">
      
      {/* 1. HERO SECTION */}
      <section id="hero" className="relative pt-6 pb-10">
        <div className="p-8 sm:p-12 md:p-16 rounded-3xl bg-[#002a59] text-[#fadbc7] relative overflow-hidden shadow-2xl border border-[#fadbc7]/40">
          
          {/* Subtle Glow background */}
          <div className="absolute top-0 right-0 -mt-16 -mr-16 w-96 h-96 rounded-full bg-[#fadbc7]/15 blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#fadbc7]/20 backdrop-blur-md text-[#fadbc7] text-xs font-extrabold border border-[#fadbc7]/30">
                <Sparkles className="w-4 h-4 text-[#fadbc7]" />
                Atelier de Velas Artesanais Gourmet
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                Velas de Sobremesa <br className="hidden sm:block" />
                <span className="text-[#fadbc7]">Esculpidas em Cera.</span>
              </h1>

              <p className="text-sm sm:text-base text-[#fadbc7]/90 font-medium leading-relaxed max-w-xl">
                Descubra a arte das velas artesanais com design de alta confeitaria. Feitas à mão em Portugal com cera 100% soja vegetal, pavios de madeira de cedro e aromas aconchegantes de sobremesa.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href="#colecao-3d"
                  className="px-6 py-3.5 rounded-xl bg-[#fadbc7] text-[#002a59] font-black text-xs shadow-lg hover:bg-[#f7caac] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
                >
                  <Flame className="w-4 h-4 text-[#002a59]" />
                  Ver Coleção 3D
                </a>

                <button
                  onClick={onOpenLogin}
                  className="px-6 py-3.5 rounded-xl bg-white/10 text-white hover:bg-white/20 font-bold text-xs border border-[#fadbc7]/40 backdrop-blur-md transition-all flex items-center gap-2"
                >
                  <Lock className="w-4 h-4 text-[#fadbc7]" />
                  Acesso Reservado / Gestão
                </button>
              </div>

              {/* Stats badges */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#fadbc7]/30 text-xs">
                <div>
                  <span className="text-xl font-black text-white block">100%</span>
                  <span className="text-[#fadbc7]/80 text-[11px] font-medium">Soja & Coco Vegetal</span>
                </div>
                <div>
                  <span className="text-xl font-black text-white block">🌱 Eco</span>
                  <span className="text-[#fadbc7]/80 text-[11px] font-medium">Pavios de Madeira</span>
                </div>
                <div>
                  <span className="text-xl font-black text-white block">🇵🇹 Pura</span>
                  <span className="text-[#fadbc7]/80 text-[11px] font-medium">Artesanalidade</span>
                </div>
              </div>

            </div>

            {/* Right Hero Image Card */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative group w-full max-w-md">
                <div className="absolute -inset-1.5 rounded-3xl bg-gradient-to-tr from-[#fadbc7] to-white opacity-40 blur-xl group-hover:opacity-75 transition-opacity" />
                <div className="relative rounded-3xl overflow-hidden border-2 border-[#fadbc7] shadow-2xl bg-white">
                  <img
                    src="/strawberry-candle-mockup.jpg"
                    alt="Vela Milkshake Morango 3D Render"
                    className="w-full h-96 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-[#002a59] via-[#002a59]/80 to-transparent text-[#fadbc7]">
                    <span className="text-[10px] uppercase font-bold text-[#fadbc7]/80 tracking-widest">
                      Destaque da Coleção
                    </span>
                    <h3 className="font-extrabold text-sm text-white">
                      Vela Milkshake de Morango com Chantilly
                    </h3>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 2. 3D CANDLE COLLECTION SHOWCASE */}
      <section id="colecao-3d" className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fadbc7] text-[#002a59] text-xs font-extrabold">
            <Sparkles className="w-3.5 h-3.5 text-[#002a59]" /> Catálogo de Sobremesas em Cera
          </div>
          <h2 className="text-3xl font-black text-[#002a59] dark:text-[#fadbc7] tracking-tight">
            Coleção Principal de Velas Artesanais
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400 font-medium">
            Cada vela é moldada à mão com fragrâncias lipossolúveis de alta retenção térmica e design inspirado na confeitaria internacional.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {candleCollection.map((candle) => (
            <div
              key={candle.id}
              className="p-5 rounded-3xl glass-card space-y-4 flex flex-col justify-between group hover:border-[#002a59] transition-all shadow-lg"
            >
              <div className="space-y-3">
                {/* Image */}
                <div className="relative rounded-2xl overflow-hidden h-64 border border-[#fadbc7] bg-white">
                  <img
                    src={candle.image}
                    alt={candle.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#002a59] text-[#fadbc7] text-[10px] font-bold shadow-md">
                    {candle.category}
                  </span>
                </div>

                {/* Info */}
                <div>
                  <h3 className="font-extrabold text-base text-[#002a59] dark:text-[#fadbc7] group-hover:text-[#003b7a] transition-colors">
                    {candle.name}
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 line-clamp-2 leading-relaxed">
                    {candle.description}
                  </p>
                </div>

                {/* Scent notes badge */}
                <div className="p-3 rounded-2xl bg-[#fadbc7]/30 dark:bg-[#002a59]/40 border border-[#fadbc7] text-xs">
                  <span className="text-[10px] font-extrabold text-[#002a59]/60 dark:text-[#fadbc7]/70 uppercase tracking-widest block">
                    Notas Olfativas
                  </span>
                  <span className="font-bold text-[#002a59] dark:text-[#fadbc7]">
                    {candle.notes}
                  </span>
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-3 border-t border-[#fadbc7] flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-stone-400 block">Preço de Referência</span>
                  <span className="text-lg font-black text-[#002a59] dark:text-[#fadbc7]">
                    {candle.suggestedPrice}
                  </span>
                </div>

                <button
                  onClick={() => setSelectedCandleModal(candle)}
                  className="px-4 py-2 text-xs font-extrabold rounded-xl bg-[#002a59] text-[#fadbc7] hover:bg-[#001f42] transition-colors shadow-xs"
                >
                  Ver Detalhes
                </button>
              </div>

            </div>
          ))}
        </div>
      </section>

      {/* 3. ABOUT BRAND SECTION */}
      <section id="sobre" className="p-8 sm:p-12 rounded-3xl glass-card bg-gradient-to-r from-[#fadbc7]/30 via-white to-[#fadbc7]/10 dark:from-[#002a59] dark:to-[#001f42] space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-6 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#002a59] text-[#fadbc7] text-xs font-extrabold">
              <Heart className="w-3.5 h-3.5 text-[#fadbc7]" /> Sobre a Marca Dolce Candele
            </div>

            <h2 className="text-3xl font-black text-[#002a59] dark:text-[#fadbc7] tracking-tight">
              Artesanalidade, Aromas Marcantes & Design Gourmet
            </h2>

            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed font-medium">
              A **Dolce Candele** nasce da paixão por criar velas artesanais que combinam a estética irresistível de sobremesas clássicas com ingredientes de origem 100% sustentável.
            </p>

            <div className="space-y-3 text-xs font-semibold text-[#002a59] dark:text-[#fadbc7] pt-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>100% Cera de Soja e Coco de origem vegetal livre de parafina nociva</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Pavios duplos de madeira de cedro que crepitam como uma lareira aconchegante</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Essências lipossolúveis premium produzidas com alta fixação de aroma</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 flex justify-center">
            <div className="relative rounded-3xl overflow-hidden border-2 border-[#fadbc7] shadow-xl max-w-md">
              <img
                src="/cappuccino-candle-mockup.jpg"
                alt="Detalhe de produção artesanal"
                className="w-full h-80 object-cover"
              />
            </div>
          </div>

        </div>
      </section>

      {/* 4. CUSTOM ORDERS / EVENTS SECTION */}
      <section id="encomendas" className="p-8 rounded-3xl bg-[#002a59] text-[#fadbc7] text-center space-y-4 border border-[#fadbc7]/40 shadow-xl">
        <h2 className="text-2xl font-black text-white">
          Encomendas Personalizadas para Eventos & Lembranças 🎁
        </h2>
        <p className="text-xs text-[#fadbc7]/90 max-w-xl mx-auto font-medium">
          Criamos edições especiais de mini-velas de sobremesa para casamentos, batizados, aniversários e presentes empresariais.
        </p>

        <div className="pt-2 flex justify-center gap-4">
          <a
            href="https://www.instagram.com/dolcecandele.pt/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-xl bg-[#fadbc7] text-[#002a59] font-extrabold text-xs hover:bg-[#f7caac] transition-all flex items-center gap-2 shadow-md"
          >
            <InstagramIcon className="w-4 h-4 text-[#002a59]" />
            Pedir Orçamento via Instagram DM
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="pt-8 border-t border-[#fadbc7] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-stone-500 dark:text-stone-400">
        <div className="flex items-center gap-2">
          <img src="/dolce-candele-text-nobg.png" alt="Logo" className="h-6 w-auto object-contain" />
          <span>© 2026 Dolce Candele. Todos os direitos reservados.</span>
        </div>

        <button
          onClick={onOpenLogin}
          className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#002a59] dark:text-[#fadbc7] hover:underline"
        >
          <Lock className="w-3.5 h-3.5" /> Acesso Reservado à Gestão Operacional
        </button>
      </footer>

      {/* MODAL: CANDLE DETAILS */}
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
              className="w-full h-72 object-cover rounded-2xl border border-[#fadbc7]"
            />

            <p className="text-xs text-stone-600 dark:text-stone-300 font-medium leading-relaxed">
              {selectedCandleModal.description}
            </p>

            <div className="grid grid-cols-2 gap-3 text-xs pt-2">
              <div className="p-3 rounded-xl bg-[#fadbc7]/30 dark:bg-[#002a59]/40 border border-[#fadbc7]">
                <span className="text-[10px] text-stone-400 font-bold block">Duração de Queima</span>
                <span className="font-extrabold text-[#002a59] dark:text-[#fadbc7]">
                  {selectedCandleModal.burnTime}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#fadbc7]/30 dark:bg-[#002a59]/40 border border-[#fadbc7]">
                <span className="text-[10px] text-stone-400 font-bold block">Composição</span>
                <span className="font-extrabold text-[#002a59] dark:text-[#fadbc7]">
                  {selectedCandleModal.waxType}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-[#fadbc7] flex justify-end">
              <a
                href="https://www.instagram.com/dolcecandele.pt/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-[#002a59] text-[#fadbc7] font-extrabold text-xs flex items-center gap-2 shadow-md"
              >
                <InstagramIcon className="w-4 h-4 text-[#fadbc7]" /> encomendar via Instagram DM
              </a>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
};
