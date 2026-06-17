import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Política de Privacidade',
  description: 'Política de privacidade e proteção de dados da Franci\'s Creative Kitchen (LGPD).',
};

export default function Privacidade() {
  const updated = '15 de junho de 2026';

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-pitch mb-2">
        Política de <span className="text-brand">Privacidade</span>
      </h1>
      <p className="text-pitch/50 text-sm mb-10">Última atualização: {updated}</p>

      <div className="prose prose-sm max-w-none text-pitch/80 space-y-6">
        <section>
          <h2 className="text-lg font-bold text-pitch mb-2">1. Dados que Coletamos</h2>
          <p>
            Coletamos dados pessoais fornecidos diretamente por você: nome, e-mail, telefone e
            endereço de entrega. Também podemos coletar dados de navegação de forma anônima para
            melhorar nossa experiência.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-pitch mb-2">2. Como Usamos seus Dados</h2>
          <p>Utilizamos seus dados para:</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>Processar e entregar seus pedidos</li>
            <li>Enviar confirmações e atualizações de pedido</li>
            <li>Responder a dúvidas e solicitações de suporte</li>
            <li>Enviar comunicações de marketing (apenas com seu consentimento)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-pitch mb-2">3. Compartilhamento de Dados</h2>
          <p>
            Não vendemos seus dados. Podemos compartilhar informações necessárias com transportadoras
            (para entrega) e processadores de pagamento, todos sujeitos às suas próprias políticas
            de privacidade.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-pitch mb-2">4. Seus Direitos (LGPD)</h2>
          <p>Conforme a Lei Geral de Proteção de Dados (Lei 13.709/2018), você tem direito a:</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>Acessar seus dados pessoais</li>
            <li>Corrigir dados incorretos</li>
            <li>Solicitar a exclusão de seus dados</li>
            <li>Revogar consentimento para marketing</li>
          </ul>
          <p className="mt-2">
            Para exercer seus direitos, entre em contato:{' '}
            <a href="mailto:contato@chicomolhos.com.br" className="text-brand hover:underline">
              contato@chicomolhos.com.br
            </a>
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-pitch mb-2">5. Segurança</h2>
          <p>
            Adotamos medidas técnicas para proteger seus dados, incluindo criptografia SSL. Nenhum
            dado de cartão é armazenado em nossos servidores.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-pitch mb-2">6. Cookies</h2>
          <p>
            Utilizamos cookies funcionais necessários para o funcionamento do site. Você pode
            desativar cookies no seu navegador, mas algumas funcionalidades podem ser afetadas.
          </p>
        </section>
      </div>
    </div>
  );
}
