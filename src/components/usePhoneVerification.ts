// Mock stand-in for packages/shared-components/src/components/phone/usePhoneVerification.ts
// in leland-monorepo — same shape (request a code, then verify+save it
// together), but there's no real SMS provider or backend in this prototype,
// so "sending" a code just logs it to the console and "verifying" accepts
// any well-formed 6-digit code.
const MOCK_CODE = "123456";

export function requestPhoneVerificationCode(phone: string): Promise<void> {
  // eslint-disable-next-line no-console
  console.log(`[mock SMS] Sending verification code ${MOCK_CODE} to ${phone}`);
  return new Promise((resolve) => setTimeout(resolve, 400));
}

export function verifyAndSavePhoneNumber(
  phone: string,
  code: string,
): Promise<{ success: boolean }> {
  return new Promise((resolve) =>
    setTimeout(() => resolve({ success: /^\d{6}$/.test(code.trim()) }), 400),
  );
}
