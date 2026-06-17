import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Termos de Uso',
  description: 'Termos e condições de uso do site e loja da Franci\'s Creative Kitchen.',
};

export default function Termos() {
  const updated = '15 de junho de 2026';

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-pitch mb-2">
        Termos de <span className="text-brand">Uso</span>
      </h1>
      <p className="text-pitch/50 text-sm mb-10">Última atualização: {updated}</p>

      <div className="prose prose-sm max-w-none text-pitch/80 space-y-6">
        <section>
          <h2 className="text-lg font-bold text-pitch mb-2">1. Aceitação dos Termos</h2>
          <p>
            Ao acessar e utilizar o site da Franci&apos;s Creative Kitchen, você concorda com os
            presentes Termos de Uso. Caso não concorde, por favor não utilize nossos serviços.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-pitch mb-2">2. Sobre os Produtos</h2>
          <p>
            Todos os produtos são artesanais e sujeitos à disponibilidade de estoque. As imagens são
            meramente ilustrativas. Nos reservamos o direito de alterar preços sem aviso prévio.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-pitch mb-2">3. Pedidos e Pagamentos</h2>
          <p>
            Os pedidos são processados após confirmação do pagamento. Em caso de indisponibilidade
            de produto, o cliente será notificado e o valor será estornado integralmente.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-pitch mb-2">4. Entrega</h2>
          <p>
            O prazo de entrega é estimado e pode variar de acordo com a localização e os Correios.
            Não nos responsabilizamos por atrasos causados por terceiros.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-pitch mb-2">5. Trocas e Devoluções</h2>
          <p>
            De acordo com o Código de Defesa do Consumidor (Lei 8.078/90), você tem direito a
            arrependimento em até 7 dias após o recebimento para compras realizadas pela internet.
            Para defeitos ou produtos incorretos, entre em contato em até 30 dias.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-pitch mb-2">6. Propriedade Intelectual</h2>
          <p>
            Todo o conteúdo deste site (textos, imagens, logotipo, receitas) é de propriedade da
            Franci&apos;s Creative Kitchen e protegido por lei de direitos autorais.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-pitch mb-2">7. Contato</h2>
          <p>
            Dúvidas sobre estes termos podem ser enviadas para{' '}
            <a href="mailto:contato@chicomolhos.com.br" className="text-brand hover:underline">
              contato@chicomolhos.com.br
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
