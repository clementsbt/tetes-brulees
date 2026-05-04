import { randomBytes } from 'crypto';
import { prisma } from './prisma';
import { sendPasswordResetEmail } from './email';
import { hashPassword } from './auth';

const RESET_TOKEN_EXPIRY = 60 * 60 * 1000; // 1 hour

export async function requestPasswordReset(email: string, baseUrl: string) {
  const db = await prisma();
  
  const user = await db.user.findUnique({ where: { email } });
  
  // Always return success (security - don't reveal if email exists)
  if (!user) {
    return { success: true, message: 'Si un compte existe, un email sera envoyé' };
  }

  // Generate reset token
  const token = randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + RESET_TOKEN_EXPIRY);

  // Save to DB
  await db.passwordResetToken.create({
    data: {
      userId: user.id,
      token,
      expires,
    },
  });

  // Send email
  const resetUrl = `${baseUrl}/password-reset?token=${token}`;
  await sendPasswordResetEmail(email, resetUrl);

  return { success: true, message: 'Si un compte existe, un email sera envoyé' };
}

export async function resetPassword(token: string, newPassword: string) {
  const db = await prisma();
  
  const resetToken = await db.passwordResetToken.findUnique({
    where: { token },
  });

  if (!resetToken) {
    throw new Error('Token invalide');
  }

  if (resetToken.used) {
    throw new Error('Token déjà utilisé');
  }

  if (new Date() > resetToken.expires) {
    throw new Error('Token expiré');
  }

  // Hash new password
  const hashedPassword = await hashPassword(newPassword);

  // Update user password and mark token as used
  await db.$transaction([
    db.user.update({
      where: { id: resetToken.userId },
      data: { password: hashedPassword },
    }),
    db.passwordResetToken.update({
      where: { id: resetToken.id },
      data: { used: true },
    }),
  ]);

  return { success: true };
}