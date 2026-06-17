import Image from 'next/image';
import { Flame, Heart, Award } from "lucide-react";

export default function Sobre() {
  return (
    <>
      {/* Header branco */}
      <div className="bg-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative h-32 w-48 mx-auto mb-6">
            <Image
              src="/logo_contato.png"
              alt="Franci's Creative Kitchen"
              fill
              className="object-contain"
            />
          </div>
          <h1 className="text-4xl font-bold text-pitch mb-3">
            Sobre a <span className="text-brand">Franci's Creative Kitchen</span>
          </h1>
          <p className="text-pitch/80 text-lg max-w-xl mx-auto">
            Uma paixão que virou negócio. Uma história feita de ardência, cuidado e muito sabor.
          </p>
        </div>
      </div>

      {/* Conteúdo laranja */}
      <div className="bg-brand min-h-screen py-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* História placeholder */}
          <div className="bg-white/10 backdrop-blur-sm p-8 mb-10 border border-white/20">
            <h2 className="text-xl font-bold text-white mb-4">Nossa História</h2>
            <p className="text-white/80 leading-relaxed mb-4">
              [Texto sobre a história do negócio — a ser fornecido pelo cliente]
            </p>
            <p className="text-white/80 leading-relaxed">
              [Como surgiu a ideia, a paixão por pimentas, o processo artesanal...]
            </p>
          </div>

        {/* Valores */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { icon: <Flame className="w-8 h-8 text-pitch" />, title: "Paixão", desc: "Cada produto é feito com dedicação e amor pelo que fazemos." },
            { icon: <Heart className="w-8 h-8 text-pitch" />, title: "Cuidado", desc: "Ingredientes selecionados, processos artesanais, qualidade real." },
            { icon: <Award className="w-8 h-8 text-pitch" />, title: "Qualidade", desc: "Garantimos sabor e segurança alimentar em cada lote produzido." },
          ].map((v) => (
            <div key={v.title} className="text-center p-6 bg-white/10 backdrop-blur-sm shadow-sm border border-white/20">
              <div className="flex justify-center mb-3">{v.icon}</div>
              <h3 className="font-bold text-white mb-2">{v.title}</h3>
              <p className="text-sm text-white/70">{v.desc}</p>
            </div>
          ))}
        </div>

        {/* Foto placeholder */}
        <div className="bg-white/10 backdrop-blur-sm h-64 flex items-center justify-center text-white/30 text-sm border-2 border-dashed border-white/20">
          [ Foto da Franci / da produção — a ser inserida ]
        </div>
      </div>
    </div>
    </>
  );
}
