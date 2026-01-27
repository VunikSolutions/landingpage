// Edge Function para enviar email de confirmação ao lead quando se cadastra
// Configurar variáveis de ambiente no Supabase Dashboard:
// - RESEND_API_KEY: Sua chave da API do Resend

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const FROM_EMAIL = 'corporativo@vunik.site'

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
    if (!lead.nome || !lead.email) {
      console.error('Erro: Campos obrigatórios do lead não fornecidos', lead)
      throw new Error('Campos obrigatórios do lead não fornecidos')
    }

    if (!RESEND_API_KEY) {
      console.error('ERRO CRÍTICO: RESEND_API_KEY não configurada')
      console.error('Configure a variável RESEND_API_KEY no Supabase Dashboard:')
      console.error('Project Settings → Edge Functions → Environment Variables')
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

    // Função para gerar o template HTML do email de confirmação
    const getEmailTemplate = () => {
      return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Confirmação de Cadastro - Vunik</title>
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
            <td style="padding: 40px;">
              <p style="margin: 0 0 20px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                Olá, <strong>{{NOME}}</strong>,
              </p>
              
              <p style="margin: 0 0 20px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                Recebemos seu formulário. Obrigado por entrar em contato com a Vunik.
              </p>
              
              <p style="margin: 0 0 20px 0; color: #333333; font-size: 16px; line-height: 1.6; font-weight: 600;">
                <strong>Nossa equipe vai falar com você em breve pelo WhatsApp</strong> (no número informado).
              </p>
              
              <p style="margin: 0 0 20px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                Para deixar o processo mais claro, nosso fluxo funciona assim:
              </p>
              
              <ol style="margin: 0 0 20px 0; padding-left: 20px; color: #333333; font-size: 16px; line-height: 1.8;">
                <li style="margin-bottom: 12px;">
                  <strong>WhatsApp:</strong> entender seu cenário atual e <strong>encaminhar o agendamento</strong> da Reunião de Diagnóstico
                </li>
                <li style="margin-bottom: 12px;">
                  <strong>Reunião de Diagnóstico (Google Meet):</strong> aprofundar prioridades e contexto
                </li>
                <li style="margin-bottom: 12px;">
                  <strong>Planejamento interno + Apresentação:</strong> apresentar seu <strong>plano sob medida</strong> e próximos passos
                </li>
              </ol>
              
              <p style="margin: 0 0 20px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                Se preferir, responda este e-mail com o <strong>melhor horário</strong> para te chamarmos no WhatsApp.
              </p>
              
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
                          <img src="https://www.vunik.com.br/vunik%20logo.png" alt="Vunik Logo" width="60" height="auto" style="display: block; max-width: 60px; height: auto;" />
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 0 0 8px 0;">
                          <p style="margin: 0; color: #333333; font-size: 16px; font-weight: 600; line-height: 1.4;">
                            Equipe Vunik
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
                            <a href="https://www.vunik.com.br" style="color: #0066cc; text-decoration: none;">www.vunik.com.br</a>
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
                Este é um email automático da <strong>Vunik Solutions</strong>.<br>
                Para dúvidas, entre em contato através dos canais oficiais.
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

    // Enviar email via Resend
    console.log('Enviando email de confirmação para:', lead.email)
    console.log('Lead:', { nome: lead.nome, email: lead.email })
    
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: `Vunik <${FROM_EMAIL}>`,
        to: [lead.email],
        subject: 'Recebemos seu formulário - Vunik',
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
    console.log('Email de confirmação enviado com sucesso! ID:', emailData.id)
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Email de confirmação enviado com sucesso',
        emailId: emailData.id
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  } catch (error) {
    console.error('Erro na Edge Function send-lead-confirmation:')
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

