// Edge Function para enviar notificação por email quando um novo lead é cadastrado
// Configurar variáveis de ambiente no Supabase Dashboard:
// - RESEND_API_KEY: Sua chave da API do Resend
// - NOTIFICATION_EMAIL: Email da Vunik que receberá as notificações

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const NOTIFICATION_EMAIL = Deno.env.get('NOTIFICATION_EMAIL') || 'corporativo@vunik.site'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { lead } = await req.json()
    
    if (!lead) {
      throw new Error('Dados do lead não fornecidos')
    }

    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY não configurada')
      // Retornar sucesso mesmo sem enviar email para não quebrar o fluxo
      return new Response(
        JSON.stringify({ 
          success: true, 
          warning: 'Email não enviado: RESEND_API_KEY não configurada' 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Mapear valores de faturamento para texto legível
    const faturamentoMap: Record<string, string> = {
      'ate-10k': 'Até R$ 10.000',
      '10k-30k': 'R$ 10.000 a R$ 30.000',
      '30k-50k': 'R$ 30.000 a R$ 50.000',
      '50k-100k': 'R$ 50.000 a R$ 100.000',
      'acima-100k': 'Acima de R$ 100.000'
    }

    // Mapear valores de tempo de atendimento para texto legível
    const tempoMap: Record<string, string> = {
      'menos-2': 'Menos de 2 anos',
      '2-5': '2 a 5 anos',
      '5-10': '5 a 10 anos',
      'mais-10': 'Mais de 10 anos'
    }

    const faturamentoTexto = faturamentoMap[lead.faturamento] || lead.faturamento
    const tempoTexto = tempoMap[lead.tempo_atendimento] || lead.tempo_atendimento
    const dataFormatada = new Date(lead.created_at).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })

    // Extrair apenas números do WhatsApp para link
    const whatsappNumero = lead.whatsapp.replace(/\D/g, '')

    // Função para gerar o template HTML do email
    const getEmailTemplate = () => {
      return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Novo Lead - Vunik</title>
  <!--[if mso]>
  <style type="text/css">
    body, table, td {font-family: Arial, sans-serif !important;}
  </style>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f4f4f4;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <tr>
            <td style="background: linear-gradient(135deg, #0066cc 0%, #004499 100%); padding: 30px 40px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600; letter-spacing: -0.5px;">
                🎯 Novo Lead Cadastrado
              </h1>
              <p style="margin: 10px 0 0 0; color: #e6f2ff; font-size: 14px; font-weight: 400;">
                Formulário do Site Vunik
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 30px; background-color: #fff3cd; border-left: 4px solid #ffc107; border-radius: 4px;">
                <tr>
                  <td style="padding: 15px 20px;">
                    <p style="margin: 0; color: #856404; font-size: 14px; font-weight: 600;">
                      ⚠️ AÇÃO NECESSÁRIA: Entre em contato em até 1 hora
                    </p>
                  </td>
                </tr>
              </table>
              <h2 style="margin: 0 0 20px 0; color: #333333; font-size: 18px; font-weight: 600; border-bottom: 2px solid #0066cc; padding-bottom: 10px;">
                Informações do Lead
              </h2>
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e0e0e0;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td width="160" style="padding-right: 20px; vertical-align: top;">
                          <span style="color: #666666; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                            Nome Completo
                          </span>
                        </td>
                        <td style="vertical-align: top;">
                          <span style="color: #333333; font-size: 16px; font-weight: 500;">
                            {{NOME}}
                          </span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e0e0e0;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td width="160" style="padding-right: 20px; vertical-align: top;">
                          <span style="color: #666666; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                            WhatsApp
                          </span>
                        </td>
                        <td style="vertical-align: top;">
                          <a href="https://wa.me/{{WHATSAPP_NUMERO}}" style="color: #25D366; font-size: 16px; font-weight: 500; text-decoration: none;">
                            {{WHATSAPP}} 📱
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e0e0e0;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td width="160" style="padding-right: 20px; vertical-align: top;">
                          <span style="color: #666666; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                            Especialidade
                          </span>
                        </td>
                        <td style="vertical-align: top;">
                          <span style="color: #333333; font-size: 16px; font-weight: 500;">
                            {{ESPECIALIDADE}}
                          </span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e0e0e0;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td width="160" style="padding-right: 20px; vertical-align: top;">
                          <span style="color: #666666; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                            Faturamento Mensal
                          </span>
                        </td>
                        <td style="vertical-align: top;">
                          <span style="color: #333333; font-size: 16px; font-weight: 500;">
                            {{FATURAMENTO}}
                          </span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e0e0e0;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td width="160" style="padding-right: 20px; vertical-align: top;">
                          <span style="color: #666666; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                            Principal Objetivo
                          </span>
                        </td>
                        <td style="vertical-align: top;">
                          <span style="color: #333333; font-size: 16px; font-weight: 500;">
                            {{OBJETIVO}}
                          </span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e0e0e0;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td width="160" style="padding-right: 20px; vertical-align: top;">
                          <span style="color: #666666; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                            Tempo de Atendimento
                          </span>
                        </td>
                        <td style="vertical-align: top;">
                          <span style="color: #333333; font-size: 16px; font-weight: 500;">
                            {{TEMPO_ATENDIMENTO}}
                          </span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td width="160" style="padding-right: 20px; vertical-align: top;">
                          <span style="color: #666666; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                            Data e Hora
                          </span>
                        </td>
                        <td style="vertical-align: top;">
                          <span style="color: #333333; font-size: 16px; font-weight: 500;">
                            {{DATA_HORA}}
                          </span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-top: 30px; background-color: #f8f9fa; border-radius: 4px; padding: 15px;">
                <tr>
                  <td>
                    <p style="margin: 0; color: #666666; font-size: 11px; font-family: 'Courier New', monospace;">
                      <strong>ID do Lead (CRM):</strong> {{LEAD_ID}}
                    </p>
                  </td>
                </tr>
              </table>
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-top: 30px;">
                <tr>
                  <td align="center">
                    <a href="https://wa.me/{{WHATSAPP_NUMERO}}" style="display: inline-block; background-color: #25D366; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 6px; font-weight: 600; font-size: 16px;">
                      📱 Contatar no WhatsApp
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f8f9fa; padding: 20px 40px; text-align: center; border-radius: 0 0 8px 8px; border-top: 1px solid #e0e0e0;">
              <p style="margin: 0; color: #666666; font-size: 12px; line-height: 1.6;">
                Este é um email automático do sistema da <strong>Vunik Solutions</strong>.<br>
                Não responda este email. Para suporte, entre em contato através dos canais oficiais.
              </p>
              <p style="margin: 10px 0 0 0; color: #999999; font-size: 11px;">
                Lead cadastrado em {{DATA_HORA}} | ID: {{LEAD_ID}}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
    }

    // Substituir variáveis no template
    const emailHtml = getEmailTemplate()
      .replace(/\{\{NOME\}\}/g, lead.nome)
      .replace(/\{\{WHATSAPP\}\}/g, lead.whatsapp)
      .replace(/\{\{WHATSAPP_NUMERO\}\}/g, whatsappNumero)
      .replace(/\{\{ESPECIALIDADE\}\}/g, lead.especialidade)
      .replace(/\{\{FATURAMENTO\}\}/g, faturamentoTexto)
      .replace(/\{\{OBJETIVO\}\}/g, lead.objetivo)
      .replace(/\{\{TEMPO_ATENDIMENTO\}\}/g, tempoTexto)
      .replace(/\{\{DATA_HORA\}\}/g, dataFormatada)
      .replace(/\{\{LEAD_ID\}\}/g, lead.id)

    // Enviar email via Resend
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Vunik Site <noreply@vunik.site>',
        to: [NOTIFICATION_EMAIL],
        subject: `🎯 Novo Lead Cadastrado - ${lead.nome}`,
        html: emailHtml,
      }),
    })
    
    if (!emailResponse.ok) {
      const errorText = await emailResponse.text()
      console.error('Erro ao enviar email:', errorText)
      throw new Error(`Falha ao enviar email: ${emailResponse.status}`)
    }

    const emailData = await emailResponse.json()
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Notificação enviada com sucesso',
        emailId: emailData.id
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  } catch (error) {
    console.error('Erro na função:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Erro desconhecido',
        success: false 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

