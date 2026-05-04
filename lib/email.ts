import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM_EMAIL = process.env.FROM_EMAIL || 'onboarding@resend.dev';

console.log('[EMAIL] INIT:', { hasResend: !!resend, from: FROM_EMAIL, hasKey: !!process.env.RESEND_API_KEY });

export async function sendPasswordResetEmail(email: string, resetUrl: string) {
  if (!resend) {
    console.log('[DEV] Password reset email:', { email, resetUrl });
    return { id: 'dev-mode' };
  }

  return resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: 'Réinitialiser votre mot de passe - Têtes Brûlées',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #f97316;">Mot de passe oublié ?</h1>
        <p>Bonjour,</p>
        <p>Vous avez demandé la réinitialisation de votre mot de passe.</p>
        <p>Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe :</p>
        <a href="${resetUrl}" 
           style="display: inline-block; background: #f97316; color: white; 
                  padding: 12px 24px; text-decoration: none; border-radius: 8px;
                  margin: 16px 0;">
          Réinitialiser mon mot de passe
        </a>
        <p style="color: #666; font-size: 14px;">
          Ce lien expire dans 1 heure.<br/>
          Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet email.
        </p>
      </div>
    `,
  });
}

export async function sendWelcomeEmail(email: string, name: string) {
  if (!resend) {
    console.log('[DEV] Welcome email:', { email, name });
    return { id: 'dev-mode' };
  }

  return resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: 'Bienvenue chez les Têtes Brûlées !',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #f97316;">Bienvenue ${name} !</h1>
        <p>Bonjour ${name},</p>
        <p>Tu fais maintenant partie des Têtes Brûlées !</p>
        <p>Tu peux maintenant :</p>
        <ul>
          <li>Voir le calendrier des sessions</li>
          <li>Inscrire tes présences à Valfréjus</li>
          <li>Accéder à la communauté</li>
        </ul>
        <p>Bonne session !</p>
        <p style="color: #f97316; font-weight: bold;">🔥 Les Têtes Brûlées</p>
      </div>
    `,
  });
}