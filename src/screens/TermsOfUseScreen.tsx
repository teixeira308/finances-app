import React, { useState } from 'react';
import { Card, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, FileText, Shield, BookOpen, Gavel, Lock, Globe, Mail, Info } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { acceptTerms, selectTermsAccepted } from '@/features/terms/store/termsSlice';

const sections = [
  {
    id: 'aceitacao',
    icon: <CheckCircle size={20} />,
    title: '1. Aceitação dos Termos',
    content: `Ao criar uma conta e utilizar o aplicativo Nexo ("Nexo", "nós", "nosso"), você declara ter lido, compreendido e concordado expressamente com todos os termos e condições deste documento.

Caso não concorde com qualquer disposição destes Termos de Uso, você não está autorizado a utilizar o aplicativo e deverá interromper imediatamente o uso.

O uso continuado do Nexo após a publicação de alterações nestes Termos constitui aceitação tácita das modificações. Recomendamos a revisão periódica deste documento.`,
  },
  {
    id: 'servico',
    icon: <FileText size={20} />,
    title: '2. Descrição do Serviço',
    content: `O Nexo é um aplicativo web de gestão financeira pessoal que oferece ferramentas para:

• Registro e categorização de receitas e despesas
• Controle de faturas de cartão de crédito
• Acompanhamento de parcelamentos
• Geração de relatórios e gráficos financeiros
• Definição de metas mensais de gastos
• Organização por múltiplos espaços financeiros (contas e cartões)

O serviço é prestado no modelo SaaS (Software as a Service), mediante assinatura, conforme disposto no art. 7º, II, do Marco Civil da Internet (Lei nº 12.965/2014).`,
  },
  {
    id: 'assinatura',
    icon: <BookOpen size={20} />,
    title: '3. Assinatura, Planos e Cancelamento',
    content: `3.1. O Nexo oferece planos gratuitos e pagos (assinatura). As condições específicas de cada plano — incluindo funcionalidades disponíveis, período de teste e valor — são informadas no momento da contratação.

3.2. A assinatura é renovada automaticamente ao final de cada período, salvo cancelamento realizado pelo usuário com antecedência mínima de 1 (um) dia útil.

3.3. O cancelamento pode ser solicitado a qualquer momento através das configurações da conta. Uma vez cancelado, o acesso às funcionalidades do plano pago permanece ativo até o final do período já faturado.

3.4. Em caso de cancelamento, o usuário poderá continuar utilizando o plano gratuito, se disponível, ou ter os dados mantidos em conformidade com a LGPD para futura reativação.

3.5. O Nexo poderá modificar os valores das assinaturas a qualquer momento, mediante comunicação prévia ao usuário com no mínimo 30 (trinta) dias de antecedência.`,
  },
  {
    id: 'lgpd',
    icon: <Shield size={20} />,
    title: '4. Política de Privacidade — LGPD (Lei nº 13.709/2018)',
    content: `4.1. CONTROLADOR. O Nexo é o controlador dos dados pessoais tratados no âmbito do aplicativo, responsável pelas decisões referentes ao tratamento.

4.2. DADOS COLETADOS. Coletamos os seguintes dados pessoais:

• Dados de cadastro: nome, e-mail, fotografia (opcional), telefone (opcional).
• Dados financeiros: valores, descrições de transações, categorias, metas, faturas — todos inseridos ativamente pelo usuário.
• Dados de uso: interações com o aplicativo, funcionalidades acessadas, tempo de sessão.
• Dados técnicos: endereço IP, tipo de dispositivo, sistema operacional, versão do navegador.

4.3. FINALIDADES DO TRATAMENTO. Seus dados são utilizados para:

• Prestação do serviço de gestão financeira.
• Melhoria contínua da experiência do usuário.
• Geração de relatórios e análises financeiras.
• Comunicações transacionais (e-mail de confirmação, recuperação de senha).
• Cumprimento de obrigações legais e regulatórias.

4.4. BASE LEGAL. O tratamento de dados pessoais está fundamentado nas seguintes bases legais da LGPD:

• Execução de contrato (art. 7º, V) — para a prestação do serviço contratado.
• Consentimento (art. 7º, I) — para comunicações e compartilhamentos específicos.
• Cumprimento de obrigação legal (art. 7º, II) — para retenção de registros conforme o Marco Civil da Internet.
• Legítimo interesse (art. 7º, IX) — para melhoria do serviço e prevenção a fraudes.

4.5. COMPARTILHAMENTO. Seus dados não são vendidos a terceiros. Podemos compartilhar dados com:

• Provedores de infraestrutura em nuvem (Firebase/Google Cloud Platform).
• Prestadores de serviços de pagamento, quando aplicável.
• Autoridades judiciais ou administrativas, mediante requisição legal.

4.6. ARMAZENAMENTO E SEGURANÇA. Os dados são armazenados em servidores seguros (Google Cloud Platform, região us-central1) com criptografia em trânsito (TLS 1.3) e em repouso (AES-256). Adotamos medidas técnicas e organizacionais para proteger seus dados contra acesso não autorizado, destruição, perda ou alteração.

4.7. RETENÇÃO. Mantemos seus dados enquanto sua conta estiver ativa. Após exclusão da conta, os dados são removidos em até 90 (noventa) dias, ressalvada a retenção mínima exigida pelo art. 10, §1º, do Marco Civil da Internet (registros de acesso por 6 meses).

4.8. DIREITOS DO TITULAR (LGPD). Você possui os seguintes direitos, exercíveis mediante solicitação:

• Confirmação da existência de tratamento (art. 18, I)
• Acesso aos dados (art. 18, II)
• Correção de dados incompletos, inexatos ou desatualizados (art. 18, III)
• Anonimização, bloqueio ou eliminação de dados desnecessários (art. 18, IV)
• Portabilidade dos dados (art. 18, V)
• Eliminação dos dados tratados com consentimento (art. 18, VI)
• Revogação do consentimento (art. 18, VIII)

Para exercer seus direitos, entre em contato pelo e-mail: nexofinancas@gmail.com

4.9. ENCARREGADO (DPO). O encarregado pelo tratamento de dados pode ser contatado pelo e-mail: nexofinancas@gmail.com`,
  },
  {
    id: 'mci',
    icon: <Globe size={20} />,
    title: '5. Marco Civil da Internet (Lei nº 12.965/2014)',
    content: `5.1. O Nexo mantém registros de acesso à plataforma conforme exigido pelo art. 10, §1º, do Marco Civil da Internet, incluindo endereço IP, data e hora das requisições, pelo período mínimo de 6 (seis) meses.

5.2. Os registros de acesso só serão disponibilizados a terceiros mediante ordem judicial, nos termos do art. 22 do Marco Civil da Internet, ou por requisição de autoridade administrativa competente.

5.3. O Nexo não se responsabiliza pelo conteúdo gerado por terceiros que eventualmente seja compartilhado dentro da plataforma, agindo em conformidade com o art. 18 e 19 do Marco Civil da Internet para remoção de conteúdo infringente mediante notificação judicial.

5.4. O Nexo respeita a neutralidade de rede (art. 9º do Marco Civil da Internet), tratando todos os pacotes de dados de forma isonômica, sem discriminação ou degradação do tráfego.`,
  },
  {
    id: 'cdc',
    icon: <Gavel size={20} />,
    title: '6. Código de Defesa do Consumidor (Lei nº 8.078/1990)',
    content: `6.1. O Nexo é fornecedor de serviços no mercado de consumo, submetendo-se às disposições do Código de Defesa do Consumidor (CDC).

6.2. O usuário, como consumidor final, goza de todos os direitos previstos no CDC, especialmente:

• Direito à informação clara e adequada sobre o serviço (art. 6º, III).
• Direito à proteção contra publicidade enganosa (art. 6º, IV).
• Direito à revisão de cláusulas contratuais desproporcionais (art. 6º, V).
• Direito à reparação por danos patrimoniais e morais (art. 6º, VI).
• Faculdade de desistência do contrato no prazo de 7 dias para contratações realizadas fora do estabelecimento comercial (art. 49).

6.3. Em caso de vício na prestação do serviço, o usuário poderá exigir, alternativamente: a reexecução do serviço, a restituição da quantia paga ou o abatimento proporcional do preço (art. 20, CDC).

6.4. O Nexo envidará os melhores esforços para manter a disponibilidade do serviço, porém não garante disponibilidade ininterrupta, sendo toleráveis interrupções decorrentes de manutenção programada, falhas técnicas ou casos fortuitos.

6.5. O Nexo não se responsabiliza por decisões financeiras tomadas pelo usuário com base nos dados e relatórios fornecidos pelo aplicativo, que têm finalidade meramente informativa e de organização.`,
  },
  {
    id: 'licenca',
    icon: <Lock size={20} />,
    title: '7. Licença de Uso e Propriedade Intelectual',
    content: `7.1. O Nexo concede ao usuário uma licença limitada, não exclusiva, não transferível e revogável para acessar e utilizar o aplicativo de acordo com estes Termos.

7.2. Todo o conteúdo, design, código-fonte, logotipos, marcas e elementos visuais do Nexo são de propriedade exclusiva do desenvolvedor, protegidos pela Lei de Direitos Autorais (Lei nº 9.610/1998) e pela Lei de Propriedade Industrial (Lei nº 9.279/1996).

7.3. É expressamente proibido:

• Copiar, modificar, distribuir ou criar obras derivadas do aplicativo.
• Realizar engenharia reversa, descompilar ou extrair o código-fonte.
• Utilizar o aplicativo para fins ilícitos ou não autorizados.
• Interferir na segurança ou no funcionamento da plataforma.

7.4. Os dados financeiros inseridos pelo usuário permanecem de sua propriedade. O Nexo detém apenas a licença necessária para processá-los e armazená-los para fins de prestação do serviço.`,
  },
  {
    id: 'responsabilidade',
    icon: <Info size={20} />,
    title: '8. Limitação de Responsabilidade',
    content: `8.1. O Nexo é uma ferramenta de organização e visualização financeira. NÃO fornecemos consultoria financeira, de investimentos, fiscal ou jurídica.

8.2. O usuário é o único responsável pela precisão dos dados inseridos e pelas decisões financeiras tomadas com base nas informações fornecidas pelo aplicativo.

8.3. Nos limites permitidos pela legislação brasileira, a responsabilidade do Nexo está limitada ao valor efetivamente pago pelo usuário nos 12 (doze) meses anteriores ao evento danoso.

8.4. O Nexo não será responsável por:

• Danos decorrentes de caso fortuito ou força maior.
• Danos resultantes de conduta de terceiros.
• Perda de dados decorrente de negligência do usuário.
• Danos indiretos, lucros cessantes ou oportunidades perdidas.`,
  },
  {
    id: 'disposicoes',
    icon: <Gavel size={20} />,
    title: '9. Disposições Gerais',
    content: `9.1. FORO. Estas condições são regidas pela legislação brasileira. Fica eleito o foro da comarca de São Paulo/SP para dirimir quaisquer controvérsias oriundas destes Termos, com renúncia expressa a qualquer outro, por mais privilegiado que seja.

9.2. ALTERAÇÕES. O Nexo pode alterar estes Termos a qualquer momento. Alterações substanciais serão comunicadas aos usuários com 30 (trinta) dias de antecedência por e-mail ou notificação no aplicativo.

9.3. CESSAÇÃO. O Nexo reserva-se o direito de suspender ou encerrar contas que violem estes Termos, sem prejuízo das demais medidas legais cabíveis.

9.4. NULIDADE PARCIAL. Se qualquer disposição destes Termos for considerada inválida ou inexequível, as demais disposições permanecerão em pleno vigor.

9.5. CONTATO. Para dúvidas, solicitações ou exercício de direitos, entre em contato:

• E-mail: nexofinancas@gmail.com
• Responsável: Guilherme Teixeira`,
  },
];

const TermsOfUseScreen = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const accepted = useAppSelector(selectTermsAccepted);
  const [accepting, setAccepting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['aceitacao']));

  const toggleSection = (id: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleAccept = async () => {
    setAccepting(true);
    try {
      await dispatch(acceptTerms()).unwrap();
      setShowSuccess(true);
      setTimeout(() => {
        navigate(-1);
      }, 1500);
    } catch {
      alert('Erro ao salvar aceitação. Tente novamente.');
    } finally {
      setAccepting(false);
    }
  };

  return (
    <div style={{ height: '100dvh', overflowY: 'auto', backgroundColor: '#000' }}>
    <div className="mobile-container p-4" style={{ paddingBottom: '100px', minHeight: 'auto', height: 'auto' }}>
      <div className="mx-auto" style={{ maxWidth: '700px' }}>
        <div className="d-flex align-items-center gap-3 pt-4 mb-4">
          <button
            onClick={() => navigate(-1)}
            className="btn btn-link p-2 text-white border-0 bg-opacity-5 rounded-3 text-decoration-none shadow-none d-flex align-items-center justify-content-center"
            style={{ width: 40, height: 40 }}
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="h3 fw-bold m-0">Termos de Uso</h1>
        </div>

        <p className="text-ios-gray small mb-4 px-1">
          Versão {acceptTerms.toString().includes('1.0.0') ? '1.0.0' : '1.0.0'} — Última atualização: 09 de junho de 2026
        </p>

        <Card className="bg-ios-dark-gray border-0 p-4 mb-4 shadow-none">
          <p className="text-white small mb-0 lh-lg">
            Estes Termos de Uso e Política de Privacidade regulam a utilização do aplicativo Nexo
            por pessoas físicas. Ao utilizar o Nexo, você aceita expressamente estas condições.
          </p>
        </Card>

        {showSuccess && (
          <Alert variant="success" className="border-0 rounded-3 d-flex align-items-center gap-2 mb-4">
            <CheckCircle size={20} />
            Termos aceitos com sucesso!
          </Alert>
        )}

        {sections.map((section) => (
          <Card
            key={section.id}
            className="bg-ios-dark-gray border-0 mb-2 shadow-none rounded-3 overflow-hidden"
          >
            <button
              onClick={() => toggleSection(section.id)}
              className="w-100 d-flex align-items-center gap-3 p-3 text-white border-0 bg-transparent"
              style={{ cursor: 'pointer', textAlign: 'left' }}
            >
              <span className="text-ios-blue flex-shrink-0">{section.icon}</span>
              <span className="fw-semibold flex-grow-1">{section.title}</span>
              <span
                className="text-ios-gray flex-shrink-0"
                style={{
                  transform: expandedSections.has(section.id) ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s',
                }}
              >
                ▼
              </span>
            </button>
            {expandedSections.has(section.id) && (
              <div className="px-3 pb-3">
                <div className="text-ios-gray small lh-lg" style={{ whiteSpace: 'pre-line' }}>
                  {section.content}
                </div>
              </div>
            )}
          </Card>
        ))}

        {!accepted && (
          <div className="mt-4 mb-5">
            <Card className="bg-ios-dark-gray border-0 p-4 shadow-none rounded-3 mb-3">
              <p className="text-white small mb-0 text-center">
                Ao clicar em "Aceitar", você declara ter lido, compreendido e concordado
                com todos os termos e condições acima, incluindo a Política de Privacidade
                em conformidade com a LGPD (Lei nº 13.709/2018).
              </p>
            </Card>
            <Button
              variant="primary"
              className="w-100 py-3 rounded-3 fw-bold"
              onClick={handleAccept}
              disabled={accepting}
            >
              {accepting ? 'Salvando...' : 'Aceitar Termos de Uso'}
            </Button>
          </div>
        )}

        {accepted && (
          <div className="mt-4 mb-5 text-center">
            <div className="d-inline-flex align-items-center gap-2 text-ios-green fw-semibold">
              <CheckCircle size={20} />
              Termos aceitos
            </div>
          </div>
        )}
      </div>
    </div>
    </div>
  );
};

export default TermsOfUseScreen;
