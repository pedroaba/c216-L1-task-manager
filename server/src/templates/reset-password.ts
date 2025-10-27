export function resetPasswordTemplate(url: string) {
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Recuperação de Senha - Taskerra</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #1a1a1a;
      background-color: #f8f9fa;
    }
    
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }
    
    .header {
      background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
      padding: 40px 30px;
      text-align: center;
    }
    
    .logo {
      font-size: 28px;
      font-weight: 700;
      color: #ffffff;
      margin-bottom: 8px;
    }
    
    .tagline {
      color: #a0a0a0;
      font-size: 14px;
      font-weight: 400;
    }
    
    .content {
      padding: 40px 30px;
    }
    
    .title {
      font-size: 24px;
      font-weight: 600;
      color: #1a1a1a;
      margin-bottom: 16px;
      text-align: center;
    }
    
    .message {
      font-size: 16px;
      color: #4a4a4a;
      margin-bottom: 32px;
      text-align: center;
      line-height: 1.6;
    }
    
    .button-container {
      text-align: center;
      margin-bottom: 32px;
    }
    
    .reset-button {
      display: inline-block;
      background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
      color: #ffffff !important;
      text-decoration: none;
      padding: 16px 32px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 16px;
      transition: all 0.2s ease;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      border: none;
    }
    
    .reset-button:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
      color: #ffffff !important;
    }
    
    /* Força o texto branco em todos os clientes de email */
    .reset-button,
    .reset-button:link,
    .reset-button:visited,
    .reset-button:hover,
    .reset-button:active {
      color: #ffffff !important;
      text-decoration: none !important;
    }
    
    .security-notice {
      background-color: #f8f9fa;
      border-left: 4px solid #e5e7eb;
      padding: 20px;
      border-radius: 0 8px 8px 0;
      margin-bottom: 24px;
    }
    
    .security-title {
      font-size: 14px;
      font-weight: 600;
      color: #374151;
      margin-bottom: 8px;
    }
    
    .security-text {
      font-size: 14px;
      color: #6b7280;
      line-height: 1.5;
    }
    
    .link-fallback {
      background-color: #f3f4f6;
      padding: 16px;
      border-radius: 8px;
      margin-top: 24px;
    }
    
    .link-fallback-title {
      font-size: 14px;
      font-weight: 600;
      color: #374151;
      margin-bottom: 8px;
    }
    
    .link-fallback-url {
      font-size: 14px;
      color: #6b7280;
      word-break: break-all;
      font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    }
    
    .footer {
      background-color: #f8f9fa;
      padding: 30px;
      text-align: center;
      border-top: 1px solid #e5e7eb;
    }
    
    .footer-text {
      font-size: 14px;
      color: #6b7280;
      margin-bottom: 16px;
    }
    
    .footer-links {
      margin-bottom: 16px;
    }
    
    .footer-link {
      color: #6b7280;
      text-decoration: none;
      font-size: 14px;
      margin: 0 12px;
    }
    
    .footer-link:hover {
      color: #1a1a1a;
    }
    
    .unsubscribe {
      font-size: 12px;
      color: #9ca3af;
    }
    
    @media (max-width: 600px) {
      .email-container {
        margin: 0;
        border-radius: 0;
      }
      
      .header, .content, .footer {
        padding: 30px 20px;
      }
      
      .title {
        font-size: 20px;
      }
      
      .reset-button {
        padding: 14px 28px;
        font-size: 15px;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <div class="logo">Taskerra</div>
      <div class="tagline">Organize suas tarefas com eficiência</div>
    </div>
    
    <div class="content">
      <h1 class="title">Recuperação de Senha</h1>
      
      <p class="message">
        Olá! Recebemos uma solicitação para redefinir a senha da sua conta Taskerra. 
        Clique no botão abaixo para criar uma nova senha segura.
      </p>
      
      <div class="button-container">
        <a href="${url}" class="reset-button" style="color: #ffffff !important; text-decoration: none !important;">Redefinir Minha Senha</a>
      </div>
      
      <div class="security-notice">
        <div class="security-title">🔒 Informações de Segurança</div>
        <div class="security-text">
          Este link é válido por 24 horas e pode ser usado apenas uma vez. 
          Se você não solicitou esta redefinição, ignore este email - sua conta permanecerá segura.
        </div>
      </div>
      
      <div class="link-fallback">
        <div class="link-fallback-title">Link não funciona?</div>
        <div class="link-fallback-url">${url}</div>
      </div>
    </div>
  </div>
</body>
</html>
      `
}

export function resetPasswordTextTemplate(url: string): string {
  return `
Recuperação de Senha - Taskerra

Olá!

Recebemos uma solicitação para redefinir a senha da sua conta Taskerra.

Para criar uma nova senha segura, clique no link abaixo:
${url}

IMPORTANTE:
- Este link é válido por 24 horas
- Pode ser usado apenas uma vez
- Se você não solicitou esta redefinição, ignore este email - sua conta permanecerá segura

Se o link não funcionar, copie e cole o endereço acima no seu navegador.

---
Este email foi enviado automaticamente pelo sistema Taskerra.
Para suporte, entre em contato conosco.

Taskerra - Organize suas tarefas com eficiência
  `.trim()
}
