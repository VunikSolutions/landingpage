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
      console.error('Erro: Dados do lead não fornecidos')
      throw new Error('Dados do lead não fornecidos')
    }

    // Validar campos obrigatórios do lead
    if (!lead.nome || !lead.email || !lead.whatsapp || !lead.especialidade) {
      console.error('Erro: Campos obrigatórios do lead não fornecidos', lead)
      throw new Error('Campos obrigatórios do lead não fornecidos')
    }

    if (!RESEND_API_KEY) {
      console.error('ERRO CRÍTICO: RESEND_API_KEY não configurada')
      console.error('Configure a variável RESEND_API_KEY no Supabase Dashboard:')
      console.error('Project Settings → Edge Functions → Environment Variables')
      // Retornar erro para que seja visível nos logs
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'RESEND_API_KEY não configurada',
          message: 'Configure RESEND_API_KEY no Supabase Dashboard → Edge Functions → Environment Variables'
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Mapear valores de faturamento para texto legível
    const faturamentoMap: Record<string, string> = {
      'ate-10k': 'Até R$ 10.000',
      '10k-20k': 'De R$ 10.000 a R$ 20.000',
      '20k-50k': 'R$ 20.000 a R$ 50.000',
      '50k-100k': 'R$ 50.000 a R$ 100.000',
      'acima-100k': 'Acima de R$ 100.000'
    }

    // Mapear valores de objetivo para texto legível
    const objetivoMap: Record<string, string> = {
      'aparecer-primeiro-google': 'Aparecer primeiro quando pacientes procuram minha especialidade',
      'aumentar-agendamentos-qualificados': 'Aumentar agendamentos com pacientes qualificados',
      'construir-autoridade-valor': 'Construir autoridade para aumentar o valor dos meus serviços',
      'outro': 'Outro'
    }

    const faturamentoTexto = faturamentoMap[lead.faturamento] || lead.faturamento
    const objetivoTexto = objetivoMap[lead.objetivo] || lead.objetivo
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
                            E-mail
                          </span>
                        </td>
                        <td style="vertical-align: top;">
                          <a href="mailto:{{EMAIL}}" style="color: #0066cc; font-size: 16px; font-weight: 500; text-decoration: none;">
                            {{EMAIL}}
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
              
              <p style="margin: 30px 0 0 0; color: #666666; font-size: 14px; line-height: 1.6;">
                Atenciosamente,
              </p>
              
              <!-- Assinatura -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 20px 0 0 0; padding-top: 20px;">
                <tr>
                  <td style="padding: 0;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td style="padding: 0 0 20px 0; vertical-align: top;">
                          <img src="https://www.vunik.com.br/vunik%20logo.png" alt="Vunik Logo" width="120" height="auto" style="display: block; max-width: 120px; height: auto;" />
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 0 0 8px 0;">
                          <p style="margin: 0; color: #333333; font-size: 16px; font-weight: 600; line-height: 1.4;">
                            Caio Deiró | CEO — Vunik
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 0 0 8px 0;">
                          <p style="margin: 0; color: #666666; font-size: 14px; line-height: 1.5; font-style: italic;">
                            Seu digital à altura da sua reputação.
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 0;">
                          <p style="margin: 0; color: #0066cc; font-size: 14px; line-height: 1.5;">
                            <a href="https://www.vunik.com" style="color: #0066cc; text-decoration: none;">www.vunik.com</a>
                          </p>
                        </td>
                      </tr>
                    </table>
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
      .replace(/\{\{EMAIL\}\}/g, lead.email || 'Não informado')
      .replace(/\{\{WHATSAPP\}\}/g, lead.whatsapp)
      .replace(/\{\{WHATSAPP_NUMERO\}\}/g, whatsappNumero)
      .replace(/\{\{ESPECIALIDADE\}\}/g, lead.especialidade)
      .replace(/\{\{FATURAMENTO\}\}/g, faturamentoTexto)
      .replace(/\{\{OBJETIVO\}\}/g, objetivoTexto)
      .replace(/\{\{DATA_HORA\}\}/g, dataFormatada)
      .replace(/\{\{LEAD_ID\}\}/g, lead.id)

    // Enviar email via Resend
    console.log('Enviando email para:', NOTIFICATION_EMAIL)
    console.log('Lead:', { nome: lead.nome, whatsapp: lead.whatsapp })
    
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
      console.error('Erro ao enviar email via Resend:')
      console.error('Status:', emailResponse.status)
      console.error('Resposta:', errorText)
      
      // Tentar parsear o erro do Resend para mensagem mais clara
      let errorMessage = `Falha ao enviar email: ${emailResponse.status}`
      try {
        const errorJson = JSON.parse(errorText)
        if (errorJson.message) {
          errorMessage = errorJson.message
        }
      } catch (e) {
        // Se não conseguir parsear, usar a mensagem padrão
      }
      
      throw new Error(errorMessage)
    }

    const emailData = await emailResponse.json()
    console.log('Email enviado com sucesso! ID:', emailData.id)
    
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
    console.error('Erro na Edge Function send-lead-notification:')
    console.error('Tipo:', error?.constructor?.name || typeof error)
    console.error('Mensagem:', error?.message || error)
    console.error('Stack:', error?.stack)
    
    return new Response(
      JSON.stringify({ 
        error: error?.message || 'Erro desconhecido',
        success: false,
        details: process.env.DENO_ENV === 'development' ? error?.stack : undefined
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

