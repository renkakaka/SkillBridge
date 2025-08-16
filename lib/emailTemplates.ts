// Email HTML Templates на армянском языке
// Красивые и современные шаблоны для быстрой доставки

export const emailTemplates = {
  // Общий стиль для всех email
  commonStyles: `
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        line-height: 1.6;
        color: #333;
        background-color: #f8fafc;
      }
      
      .email-container {
        max-width: 600px;
        margin: 0 auto;
        background-color: #ffffff;
        border-radius: 16px;
        overflow: hidden;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
      }
      
      .header {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 40px 30px;
        text-align: center;
        color: white;
      }
      
      .logo {
        font-size: 32px;
        font-weight: bold;
        margin-bottom: 10px;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
      }
      
      .subtitle {
        font-size: 18px;
        opacity: 0.9;
        font-weight: 300;
      }
      
      .content {
        padding: 40px 30px;
      }
      
      .greeting {
        font-size: 24px;
        color: #2d3748;
        margin-bottom: 20px;
        font-weight: 600;
      }
      
      .message {
        font-size: 16px;
        color: #4a5568;
        margin-bottom: 30px;
        line-height: 1.7;
      }
      
      .button-container {
        text-align: center;
        margin: 40px 0;
      }
      
      .primary-button {
        display: inline-block;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 16px 32px;
        text-decoration: none;
        border-radius: 50px;
        font-weight: 600;
        font-size: 16px;
        box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
        transition: all 0.3s ease;
      }
      
      .primary-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 15px 30px rgba(102, 126, 234, 0.4);
      }
      
      .secondary-button {
        display: inline-block;
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        color: white;
        padding: 16px 32px;
        text-decoration: none;
        border-radius: 50px;
        font-weight: 600;
        font-size: 16px;
        box-shadow: 0 10px 20px rgba(240, 147, 251, 0.3);
        transition: all 0.3s ease;
      }
      
      .secondary-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 15px 30px rgba(240, 147, 251, 0.4);
      }
      
      .link-text {
        word-break: break-all;
        color: #667eea;
        font-family: 'Courier New', monospace;
        background-color: #f7fafc;
        padding: 15px;
        border-radius: 8px;
        border: 1px solid #e2e8f0;
        margin: 20px 0;
        font-size: 14px;
      }
      
      .info-box {
        background: linear-gradient(135deg, #e6fffa 0%, #b2f5ea 100%);
        border: 1px solid #81e6d9;
        border-radius: 12px;
        padding: 20px;
        margin: 20px 0;
      }
      
      .warning-box {
        background: linear-gradient(135deg, #fffaf0 0%, #feebc8 100%);
        border: 1px solid #f6ad55;
        border-radius: 12px;
        padding: 20px;
        margin: 20px 0;
      }
      
      .footer {
        background-color: #2d3748;
        color: white;
        text-align: center;
        padding: 30px;
        font-size: 14px;
      }
      
      .social-links {
        margin: 20px 0;
      }
      
      .social-links a {
        display: inline-block;
        margin: 0 10px;
        color: #667eea;
        text-decoration: none;
        font-weight: 500;
      }
      
      .divider {
        height: 1px;
        background: linear-gradient(90deg, transparent, #e2e8f0, transparent);
        margin: 30px 0;
      }
      
      @media only screen and (max-width: 600px) {
        .email-container {
          margin: 10px;
          border-radius: 12px;
        }
        
        .header, .content, .footer {
          padding: 20px 15px;
        }
        
        .greeting {
          font-size: 20px;
        }
        
        .primary-button, .secondary-button {
          padding: 14px 28px;
          font-size: 14px;
        }
      }
    </style>
  `,

  // Шаблон для верификации email
  verificationEmail: (name: string, verificationUrl: string, appName: string) => `
    <!DOCTYPE html>
    <html lang="hy">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Հաստատեք ձեր ${appName} հաշիվը</title>
      ${emailTemplates.commonStyles}
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <div class="logo">ՍկիլԲրիջ</div>
          <div class="subtitle">Զարգացրեք հմտությունները փորձագետների հետ</div>
        </div>
        
        <div class="content">
          <div class="greeting">Բարև ${name}! 👋</div>
          
          <div class="message">
            Շնորհակալություն, որ գրանցվեցիք <strong>${appName}</strong>-ում! 
            Ձեր հաշիվը գրեթե պատրաստ է, մնաց միայն հաստատել email հասցեն:
          </div>
          
          <div class="info-box">
            <strong>💡 Ինչու է պետք հաստատել email-ը?</strong><br>
            Email հաստատումը օգնում է մեզ ապահովել, որ դուք իսկապես դուք եք, 
            և թույլ է տալիս ստանալ կարևոր ծանուցումներ:
          </div>
          
          <div class="button-container">
            <a href="${verificationUrl}" class="primary-button">
              ✨ Հաստատել Email Հասցեն
            </a>
          </div>
          
          <div class="warning-box">
            <strong>⚠️ Կարևոր:</strong> Եթե կոճակը չի աշխատում, պատճենեք և տեղադրեք այս հղումը ձեր բրաուզերում:
          </div>
          
          <div class="link-text">${verificationUrl}</div>
          
          <div class="divider"></div>
          
          <div class="message">
            <strong>⏰ Հղումը վավեր է 24 ժամ:</strong><br>
            Այս ժամանակահատվածից հետո ձեզ պետք կլինի նոր հաստատման հղում:
          </div>
          
          <div class="message">
            Եթե դուք չեք ստեղծել հաշիվ <strong>${appName}</strong>-ում, 
            կարող եք անտեսել այս նամակը:
          </div>
        </div>
        
        <div class="footer">
          <div>Հարգանքներով,</div>
          <div style="margin-top: 10px; font-weight: 600; color: #667eea;">ՍկիլԲրիջ թիմը</div>
          
          <div class="social-links">
            <a href="#">🌐 Կայք</a> |
            <a href="#">📧 Աջակցություն</a> |
            <a href="#">📱 Հավելված</a>
          </div>
          
          <div style="margin-top: 20px; opacity: 0.7;">
            © 2025 ՍկիլԲրիջ. Բոլոր իրավունքները պաշտպանված են:
          </div>
        </div>
      </div>
    </body>
    </html>
  `,

  // Шаблон для сброса пароля
  passwordResetEmail: (name: string, resetUrl: string, appName: string) => `
    <!DOCTYPE html>
    <html lang="hy">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Վերակայեք ձեր ${appName} գաղտնաբառը</title>
      ${emailTemplates.commonStyles}
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <div class="logo">ՍկիլԲրիջ</div>
          <div class="subtitle">Զարգացրեք հմտությունները փորձագետների հետ</div>
        </div>
        
        <div class="content">
          <div class="greeting">Բարև ${name}! 🔐</div>
          
          <div class="message">
            Մենք ստացանք խնդրանք ձեր <strong>${appName}</strong> հաշվի գաղտնաբառը վերակայելու համար:
            Եթե դուք չեք կատարել այս խնդրանքը, կարող եք անտեսել այս նամակը:
          </div>
          
          <div class="warning-box">
            <strong>🔒 Անվտանգության խորհուրդ:</strong><br>
            Երբեք չտրամադրեք ձեր գաղտնաբառը այլ անձանց և միշտ օգտագործեք ուժեղ գաղտնաբառեր:
          </div>
          
          <div class="button-container">
            <a href="${resetUrl}" class="secondary-button">
              🔑 Վերակայել Գաղտնաբառը
            </a>
          </div>
          
          <div class="info-box">
            <strong>📝 Ինչպես վերակայել գաղտնաբառը:</strong><br>
            1. Սեղմեք վերևի կոճակը<br>
            2. Մուտքագրեք նոր գաղտնաբառ<br>
            3. Հաստատեք նոր գաղտնաբառը
          </div>
          
          <div class="warning-box">
            <strong>⚠️ Կարևոր:</strong> Եթե կոճակը չի աշխատում, պատճենեք և տեղադրեք այս հղումը ձեր բրաուզերում:
          </div>
          
          <div class="link-text">${resetUrl}</div>
          
          <div class="divider"></div>
          
          <div class="message">
            <strong>⏰ Հղումը վավեր է 1 ժամ:</strong><br>
            Այս ժամանակահատվածից հետո ձեզ պետք կլինի նոր հղում գաղտնաբառ վերակայելու համար:
          </div>
          
          <div class="message">
            Եթե դուք չեք կատարել գաղտնաբառ վերակայելու խնդրանք, 
            անմիջապես փոխեք ձեր գաղտնաբառը և կապվեք մեր աջակցության թիմի հետ:
          </div>
        </div>
        
        <div class="footer">
          <div>Հարգանքներով,</div>
          <div style="margin-top: 10px; font-weight: 600; color: #667eea;">ՍկիլԲրիջ թիմը</div>
          
          <div class="social-links">
            <a href="#">🌐 Կայք</a> |
            <a href="#">📧 Աջակցություն</a> |
            <a href="#">📱 Հավելված</a>
          </div>
          
          <div style="margin-top: 20px; opacity: 0.7;">
            © 2025 ՍկիլԲրիջ. Բոլոր իրավունքները պաշտպանված են:
          </div>
        </div>
      </div>
    </body>
    </html>
  `,

  // Шаблон для приветствия нового пользователя
  welcomeEmail: (name: string, appName: string) => `
    <!DOCTYPE html>
    <html lang="hy">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Բարի գալուստ ${appName}! 🎉</title>
      ${emailTemplates.commonStyles}
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <div class="logo">ՍկիլԲրիջ</div>
          <div class="subtitle">Զարգացրեք հմտությունները փորձագետների հետ</div>
        </div>
        
        <div class="content">
          <div class="greeting">Բարի գալուստ ${name}! 🎉</div>
          
          <div class="message">
            Շնորհավորում ենք! Դուք հաջողությամբ գրանցվեցիք <strong>${appName}</strong>-ում 
            և այժմ պատկանում եք մեր աճող համայնքին:
          </div>
          
          <div class="info-box">
            <strong>🚀 Ինչ կարող եք անել հիմա:</strong><br>
            • Ստեղծել ձեր պրոֆիլը<br>
            • Միանալ նախագծերին<br>
            • Կապ հաստատել մենթորների հետ<br>
            • Զարգացնել ձեր հմտությունները
          </div>
          
          <div class="button-container">
            <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/dashboard" class="primary-button">
              🎯 Գնալ Դաշնագիր
            </a>
          </div>
          
          <div class="divider"></div>
          
          <div class="message">
            <strong>💡 Հուշումներ հաջողության համար:</strong><br>
            • Լրացրեք ձեր պրոֆիլը<br>
            • Ավելացրեք ձեր հմտությունները<br>
            • Միանալ համայնքին<br>
            • Մասնակցել նախագծերին
          </div>
        </div>
        
        <div class="footer">
          <div>Հարգանքներով,</div>
          <div style="margin-top: 10px; font-weight: 600; color: #667eea;">ՍկիլԲրիջ թիմը</div>
          
          <div class="social-links">
            <a href="#">🌐 Կայք</a> |
            <a href="#">📧 Աջակցություն</a> |
            <a href="#">📱 Հավելված</a>
          </div>
          
          <div style="margin-top: 20px; opacity: 0.7;">
            © 2025 ՍկիլԲրիջ. Բոլոր իրավունքները պաշտպանված են:
          </div>
        </div>
      </div>
    </body>
    </html>
  `
}
