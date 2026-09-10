import { useEffect, useState } from "react";

import {
  Button,
  ButtonColor,
  ButtonSize,
  ButtonWidth,
  Modal,
  ModalContent,
  ModalSize,
  withModal,
  type ModalProps,
} from "./leland";
import { requestPhoneVerificationCode, verifyAndSavePhoneNumber } from "./usePhoneVerification";

// Prototype-only persistence, mirroring the pattern used for track/role/etc.
// selections elsewhere in the onboarding sequence — no real backend or SMS
// provider here (see usePhoneVerification.ts for the mocked send/verify).
export const TEXT_REMINDERS_KEY = "content-viewer-text-reminders-phone";

type SavedPhone = { phone: string; verifiedAt: number };

function loadSavedPhone(): SavedPhone | null {
  try {
    const raw = localStorage.getItem(TEXT_REMINDERS_KEY);
    return raw ? (JSON.parse(raw) as SavedPhone) : null;
  } catch {
    return null;
  }
}

// Mirrors `openModalIfNecessary` from usePhoneNumberModal in leland-monorepo
// — callers should skip opening this modal at all once a number is already
// verified, rather than making someone re-verify a number they already
// confirmed.
export function hasVerifiedPhone(): boolean {
  return loadSavedPhone() !== null;
}

const RESEND_COOLDOWN_SECONDS = 60;

// Two-step phone verification flow — modeled on the production
// PhoneNumberModal/PhoneNumberForm/ConfirmPhoneNumberForm pattern in
// leland-monorepo (phone entry, then a real send/re-enter SMS code, not a
// stored-last-4 shortcut) — opt-in, so (unlike the required track/status/
// role screens earlier in onboarding) both steps have a real "Skip for now"
// out.
const TextRemindersModalImpl = ({ open, onOpenChange }: ModalProps) => {
  const [step, setStep] = useState<"phone" | "confirm">("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState(false);
  const [sending, setSending] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const reset = () => {
    setStep("phone");
    setPhone("");
    setCode("");
    setCodeError(false);
    setSending(false);
    setCooldown(0);
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) reset();
    onOpenChange?.(next);
  };

  const sendCode = async () => {
    setSending(true);
    await requestPhoneVerificationCode(phone.trim());
    setSending(false);
    setCooldown(RESEND_COOLDOWN_SECONDS);
    setStep("confirm");
  };

  const handleVerify = async () => {
    const result = await verifyAndSavePhoneNumber(phone.trim(), code);
    if (!result.success) {
      setCodeError(true);
      return;
    }
    localStorage.setItem(
      TEXT_REMINDERS_KEY,
      JSON.stringify({ phone: phone.trim(), verifiedAt: Date.now() } satisfies SavedPhone),
    );
    handleOpenChange(false);
  };

  return (
    <Modal open={open} onOpenChange={handleOpenChange}>
      <ModalContent size={ModalSize.SMALL} hideCloseButton className="md:h-[600px]">
        <div className="flex h-full flex-col p-6 md:p-8">
          {step === "phone" ? (
            <>
              <div className="flex min-h-0 flex-1 flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <h2 className="text-heading-3xl font-season font-normal text-leland-gray-dark">
                    Get text reminders for your sessions
                  </h2>
                  <p className="leland-paragraph-lg text-leland-gray-light">
                    We'll text you before each live session so you never miss one.
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="text-reminders-phone" className="leland-paragraph-base text-leland-gray-dark">
                    Phone number
                  </label>
                  <input
                    id="text-reminders-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(555) 123-4567"
                    className="w-full rounded-xl border border-leland-gray-stroke bg-white px-3 py-3 leland-paragraph-base text-leland-gray-dark placeholder:text-leland-gray-extra-light focus:outline-none focus-visible:ring-2 focus-visible:ring-leland-primary"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <Button
                  label={sending ? "Sending code…" : "Send verification code"}
                  buttonColor={ButtonColor.PRIMARY}
                  size={ButtonSize.LARGE}
                  rounded
                  width={ButtonWidth.FULL}
                  disabled={phone.trim() === "" || sending}
                  onClick={sendCode}
                />
                <Button
                  label="Skip for now"
                  buttonColor={ButtonColor.WHITE}
                  size={ButtonSize.LARGE}
                  rounded
                  width={ButtonWidth.FULL}
                  onClick={() => handleOpenChange(false)}
                />
              </div>
            </>
          ) : (
            <>
              <div className="flex min-h-0 flex-1 flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <h2 className="text-heading-3xl font-season font-normal text-leland-gray-dark">
                    Enter your code
                  </h2>
                  <p className="leland-paragraph-lg text-leland-gray-light">
                    We sent a 6-digit code to {phone.trim()}.
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="text-reminders-code" className="leland-paragraph-base text-leland-gray-dark">
                    Verification code
                  </label>
                  <input
                    id="text-reminders-code"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={code}
                    onChange={(e) => {
                      setCode(e.target.value);
                      setCodeError(false);
                    }}
                    placeholder="123456"
                    className={`w-full rounded-xl border bg-white px-3 py-3 leland-paragraph-base text-leland-gray-dark tracking-[0.3em] placeholder:tracking-normal placeholder:text-leland-gray-extra-light focus:outline-none focus-visible:ring-2 focus-visible:ring-leland-primary ${
                      codeError ? "border-leland-red" : "border-leland-gray-stroke"
                    }`}
                  />
                  {codeError ? (
                    <p className="leland-paragraph-base text-leland-red">
                      That code doesn't look right. Enter the 6 digits we texted you.
                    </p>
                  ) : null}
                  <button
                    type="button"
                    disabled={cooldown > 0}
                    onClick={sendCode}
                    className="self-start leland-paragraph-base font-semibold text-leland-gray-dark underline decoration-dotted underline-offset-4 hover:text-leland-gray-light focus:outline-none focus-visible:ring-2 focus-visible:ring-leland-primary disabled:text-leland-gray-extra-light disabled:no-underline"
                  >
                    {cooldown > 0 ? `Send again in ${cooldown}s` : "Send again"}
                  </button>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <Button
                  label="Verify"
                  buttonColor={ButtonColor.PRIMARY}
                  size={ButtonSize.LARGE}
                  rounded
                  width={ButtonWidth.FULL}
                  disabled={code.trim() === ""}
                  onClick={handleVerify}
                />
                <Button
                  label="Skip for now"
                  buttonColor={ButtonColor.WHITE}
                  size={ButtonSize.LARGE}
                  rounded
                  width={ButtonWidth.FULL}
                  onClick={() => handleOpenChange(false)}
                />
              </div>
            </>
          )}
        </div>
      </ModalContent>
    </Modal>
  );
};

export const TextRemindersModal = withModal(TextRemindersModalImpl);
