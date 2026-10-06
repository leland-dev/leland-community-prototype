import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "./Button";
import settingsIcon from "../assets/icons/settings.svg";
import giftIcon from "../assets/icons/gift.svg";
import orderHistoryIcon from "../assets/icons/order-history.svg";
import paymentDetailsIcon from "../assets/icons/payment-details.svg";
import notificationsInactive from "../assets/icons/nav-icons/notifications-inactive.svg";
import likesIcon from "../assets/icons/likes.svg";
import commentsIcon from "../assets/icons/comments.svg";
import repostsIcon from "../assets/icons/reposts.svg";
import chevronDown from "../assets/icons/chevron-down.svg";
import followersIcon from "../assets/icons/followers.svg";
import calendarUpcomingIcon from "../assets/icons/calendar-upcoming.svg";
import browserIcon from "../assets/icons/browser.svg";
import mailIcon from "../assets/icons/mail.svg";
import mobilePhoneIcon from "../assets/icons/mobile-phone.svg";
import lockIcon from "../assets/icons/lock.svg";
import addPlusIcon from "../assets/icons/add-plus.svg";
import aiIcon from "../assets/icons/ai.svg";

// The account/settings surface is shown in two places: the standalone /settings
// page (sidebar layout) and the v3 "My Leland → Account" tab (horizontal nav).
// The tab metadata and each tab's content live here so both stay in sync.
export type SettingsTab = {
  key: string;
  label: string;
  icon: string;
  title?: string;
  subtitle?: string;
};

export const settingsTabs: SettingsTab[] = [
  { key: "account", label: "Account", icon: settingsIcon },
  {
    key: "notifications",
    label: "Notification settings",
    title: "Notification Settings",
    subtitle:
      "Leland may still send you important notifications about your account and content outside of your preferred notification settings.",
    icon: notificationsInactive,
  },
  { key: "payment", label: "Payment details", icon: paymentDetailsIcon },
  { key: "orders", label: "Order history", icon: orderHistoryIcon },
  { key: "refer", label: "Refer a friend", icon: giftIcon },
];

const notificationTypes = [
  {
    key: "likes",
    label: "Likes",
    icon: likesIcon,
    description: "Get notified when someone likes your posts and comments.",
    channels: ["In product", "Email"],
  },
  {
    key: "comments",
    label: "Comments",
    icon: commentsIcon,
    description: "Get notified when someone comments on your posts or replies to your comments.",
    channels: ["In product", "Email"],
  },
  {
    key: "reposts",
    label: "Reposts",
    icon: repostsIcon,
    description: "Get notified when someone reposts your content.",
    channels: ["In product", "Email"],
  },
  {
    key: "followers",
    label: "New followers",
    icon: followersIcon,
    description: "Get notified when someone starts following you.",
    channels: ["In product", "Email"],
  },
];

const coachingNotificationTypes = [
  {
    key: "sessions",
    label: "Upcoming sessions",
    icon: calendarUpcomingIcon,
    description: "Get reminders about your upcoming coaching sessions.",
    channels: ["SMS"],
  },
  {
    key: "offers",
    label: "Relevant events and special offers",
    icon: giftIcon,
    description: "Get notified about events and special offers relevant to your coaching goals.",
    channels: ["SMS"],
  },
];

const channelIcons: Record<string, string> = {
  "In product": browserIcon,
  "Email": mailIcon,
  "SMS": mobilePhoneIcon,
};

function ToggleRow({ label, enabled, onToggle }: { label: string; enabled: boolean; onToggle: () => void }) {
  const icon = channelIcons[label];
  return (
    <label className="flex cursor-pointer items-center justify-between py-2">
      <span className="flex items-center gap-2.5 text-[14px] font-medium text-gray-dark">
        {icon && <img src={icon} alt="" className="h-5 w-5 shrink-0" />}
        {label}
      </span>
      <div className="relative">
        <input type="checkbox" checked={enabled} onChange={onToggle} className="peer sr-only" />
        <div className="h-5 w-9 rounded-full bg-[#d4d4d4] transition-colors peer-checked:bg-gray-dark" />
        <div className="absolute left-[2px] top-[2px] h-4 w-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-4" />
      </div>
    </label>
  );
}

const emailFrequencyOptions = ["Individual", "Weekly", "Recommended"];

const dashedBorderStyle = {
  backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='12' ry='12' stroke='%23C5C5C5' stroke-width='2' stroke-dasharray='4%2c 4' stroke-dashoffset='0' stroke-linecap='butt'/%3e%3c/svg%3e")`,
};

// ── Account tab — profile visibility, auto-respond, email, pronouns, phone +
// SMS toggles, LinkedIn, session summaries. ──
export function AccountProfileSection({ hidePhoneToggles = false }: { hidePhoneToggles?: boolean }) {
  const [smsReminders, setSmsReminders] = useState(true);
  const [smsOffers, setSmsOffers] = useState(false);
  const [sessionSummaries, setSessionSummaries] = useState(true);

  return (
    <div className="mt-8">
      {/* Profile visibility */}
      <ProfileVisibilityField />

      {/* Auto-respond to new clients */}
      <div className="mt-6 border-t border-gray-stroke pt-6">
        <AutoRespondField />
      </div>

      {/* Email */}
      <div className="mt-6 border-t border-gray-stroke pt-6">
        <h3 className="text-[16px] font-semibold text-gray-dark">Email</h3>
        <p className="mt-1 text-[14px] text-gray-light">The ability to update your email is coming soon.</p>
        <div className="mt-3 flex items-center gap-2.5 rounded-lg border border-[#E5E5E5] bg-white px-4 py-3">
          <img src={lockIcon} alt="" className="h-[16px] w-[16px] shrink-0 opacity-40" />
          <span className="text-[14px] text-gray-light">june.allen@gmail.com</span>
        </div>
      </div>

      {/* Preferred Pronouns */}
      <div className="mt-6 border-t border-gray-stroke pt-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-[16px] font-semibold text-gray-dark">Preferred Pronouns</h3>
            <p className="mt-1 text-[14px] text-gray-light">She/Her</p>
          </div>
          <button className="text-[14px] font-medium text-gray-dark underline underline-offset-2">Edit</button>
        </div>
      </div>

      {/* Phone number */}
      <div className="mt-6 border-t border-gray-stroke pt-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-[16px] font-semibold text-gray-dark">Phone number</h3>
            <p className="mt-1 text-[14px] text-gray-light">+1 (415) 555-0192</p>
          </div>
          <button className="text-[14px] font-medium text-gray-dark underline underline-offset-2">Edit</button>
        </div>
        {!hidePhoneToggles && (
          <div className="mt-4 flex flex-col gap-2">
            <div className="flex items-center justify-between rounded-lg bg-[#F5F5F5] px-4 py-3.5">
              <span className="text-[14px] text-gray-light">Send me SMS reminders for my upcoming sessions</span>
              <button onClick={() => setSmsReminders(!smsReminders)} className="relative h-[26px] w-[44px] shrink-0 cursor-pointer">
                <div className={`h-full w-full rounded-full transition-colors ${smsReminders ? "bg-gray-dark" : "bg-[#E5E5E5]"}`} />
                <div className={`absolute top-[2px] h-[22px] w-[22px] rounded-full bg-white shadow-sm transition-transform ${smsReminders ? "left-[20px]" : "left-[2px]"}`} />
              </button>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-[#F5F5F5] px-4 py-3.5">
              <span className="text-[14px] text-gray-light">Text me about relevant events and special offers</span>
              <button onClick={() => setSmsOffers(!smsOffers)} className="relative h-[26px] w-[44px] shrink-0 cursor-pointer">
                <div className={`h-full w-full rounded-full transition-colors ${smsOffers ? "bg-gray-dark" : "bg-[#E5E5E5]"}`} />
                <div className={`absolute top-[2px] h-[22px] w-[22px] rounded-full bg-white shadow-sm transition-transform ${smsOffers ? "left-[20px]" : "left-[2px]"}`} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* LinkedIn profile */}
      <div className="mt-6 border-t border-gray-stroke pt-6">
        <h3 className="text-[16px] font-semibold text-gray-dark">LinkedIn profile</h3>
        <div className="mt-3">
          <Button size="md" variant="secondary">
            <img src={addPlusIcon} alt="" className="h-[16px] w-[16px]" />
            Add your LinkedIn profile URL
          </Button>
        </div>
      </div>

      {/* Generate session summaries */}
      <div className="mt-6 border-t border-gray-stroke pt-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <img src={aiIcon} alt="" className="h-5 w-5 shrink-0" />
            <h3 className="text-[16px] font-semibold text-gray-dark">Generate session summaries</h3>
          </div>
          <button onClick={() => setSessionSummaries(!sessionSummaries)} className="relative mt-0.5 h-[26px] w-[44px] shrink-0 cursor-pointer">
            <div className={`h-full w-full rounded-full transition-colors ${sessionSummaries ? "bg-gray-dark" : "bg-[#E5E5E5]"}`} />
            <div className={`absolute top-[2px] h-[22px] w-[22px] rounded-full bg-white shadow-sm transition-transform ${sessionSummaries ? "left-[20px]" : "left-[2px]"}`} />
          </button>
        </div>
        <p className="mt-1 text-[14px] text-gray-light">Leland can generate text summaries of your sessions, making it easy to revisit important concepts and stay aligned on your action items.</p>
      </div>
    </div>
  );
}

// ── Profile visibility — a custom dropdown of three visibility modes, each with
// an icon + description; the selected mode's description shows below the field. ──
const visibilityOptions = [
  {
    key: "public",
    label: "Public profile",
    description: "Open to new clients. Your profile will appear in Leland's search results.",
    glyph: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18" />
        <path d="M12 3c2.5 2.5 3.8 5.7 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.7-3.8-9s1.3-6.5 3.8-9z" />
      </svg>
    ),
  },
  {
    key: "private",
    label: "Private profile",
    description: "Open to new clients. Your profile will not appear in Leland's search results.",
    glyph: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.9 12.5A9 9 0 1 0 12.5 20.9" />
        <path d="M3 12h9M12 3c2.2 2.2 3.5 5 3.7 7.9M12 21c-2.5-2.5-3.8-5.7-3.8-9s1.3-6.5 3.8-9" />
        <rect x="15" y="15.5" width="7" height="5.5" rx="1.2" />
        <path d="M16.6 15.5v-1.2a1.9 1.9 0 0 1 3.8 0v1.2" />
      </svg>
    ),
  },
  {
    key: "closed",
    label: "Not taking new clients",
    description: "Your profile will not appear in Leland's search results and you won't receive new coaching order requests.",
    glyph: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M8 12h8" />
      </svg>
    ),
  },
];

function ProfileVisibilityField() {
  const [value, setValue] = useState("public");
  const [open, setOpen] = useState(false);
  const selected = visibilityOptions.find((o) => o.key === value) ?? null;

  return (
    <div>
      <h3 className="text-[16px] font-semibold text-gray-dark">Profile Visibility</h3>
      <div className="relative mt-3">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex w-full items-center justify-between gap-3 rounded-lg border border-gray-stroke bg-white px-4 py-3 text-left transition-colors hover:border-gray-light"
        >
          <span className="flex items-center gap-3">
            {selected ? (
              <>
                <span className="text-gray-dark">{selected.glyph}</span>
                <span className="text-[15px] text-gray-dark">{selected.label}</span>
              </>
            ) : (
              <span className="text-[15px] text-gray-xlight">Select an option…</span>
            )}
          </span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={`shrink-0 text-gray-light transition-transform ${open ? "rotate-180" : ""}`}>
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>

        {open && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
            <div className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-lg border border-gray-stroke bg-white py-1 shadow-lg">
              {visibilityOptions.map((o) => (
                <button
                  key={o.key}
                  type="button"
                  onClick={() => { setValue(o.key); setOpen(false); }}
                  className="flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-hover"
                >
                  <span className="mt-0.5 shrink-0 text-gray-dark">{o.glyph}</span>
                  <span>
                    <span className="block text-[15px] font-medium text-gray-dark">{o.label}</span>
                    <span className="mt-0.5 block text-[13px] text-gray-light">{o.description}</span>
                  </span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
      {selected && <p className="mt-2 text-[14px] text-gray-light">{selected.description}</p>}
    </div>
  );
}

// ── Auto-respond to new clients — a toggle that reveals an editable template
// message with a {{clientFirstName}} token and a Save action. ──
const defaultAutoRespond =
  "Hi {{clientFirstName}}! Thanks for reaching out. Will you send your most recent resume to help me get a better understanding of your background? If you don't have one, a brief background summary works too.";

function AutoRespondField() {
  const [enabled, setEnabled] = useState(false);
  const [message, setMessage] = useState(defaultAutoRespond);

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-[16px] font-semibold text-gray-dark">Auto-respond to new clients</h3>
          <p className="mt-1 text-[14px] text-gray-light">Send an automated message to new clients after their first outreach.</p>
        </div>
        <button onClick={() => setEnabled(!enabled)} className="relative mt-0.5 h-[26px] w-[44px] shrink-0 cursor-pointer">
          <div className={`h-full w-full rounded-full transition-colors ${enabled ? "bg-gray-dark" : "bg-[#E5E5E5]"}`} />
          <div className={`absolute top-[2px] h-[22px] w-[22px] rounded-full bg-white shadow-sm transition-transform ${enabled ? "left-[20px]" : "left-[2px]"}`} />
        </button>
      </div>

      {enabled && (
        <>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
            className="mt-4 w-full resize-y rounded-lg border border-gray-stroke bg-white px-4 py-3 text-[15px] leading-relaxed text-gray-dark outline-none focus:border-gray-dark"
          />
          <div className="mt-3 flex justify-end">
            <Button size="sm" variant="primary">Save</Button>
          </div>
          <p className="mt-2 flex items-center gap-1.5 text-[13px] text-gray-light">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
              <path d="M9 18h6M10 22h4" />
              <path d="M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.1V17h6v-.2c0-.8.4-1.6 1-2.1A7 7 0 0 0 12 2z" />
            </svg>
            You can use the token {"{{clientFirstName}}"} to insert your client's name. Include the brackets!
          </p>
        </>
      )}
    </div>
  );
}

// ── Notifications tab — Community + My coaching accordions. ──
export function NotificationsSection() {
  const [expandedNotif, setExpandedNotif] = useState<string | null>(null);
  const [emailFrequency, setEmailFrequency] = useState<Record<string, string>>({});
  const [toggles, setToggles] = useState<Record<string, Record<string, boolean>>>(() => {
    const initial: Record<string, Record<string, boolean>> = {};
    [...notificationTypes, ...coachingNotificationTypes].forEach((nt) => {
      initial[nt.key] = {};
      nt.channels.forEach((ch) => {
        initial[nt.key][ch] = true;
      });
    });
    return initial;
  });

  const handleToggle = (notifKey: string, channel: string) => {
    setToggles((prev) => ({
      ...prev,
      [notifKey]: { ...prev[notifKey], [channel]: !prev[notifKey][channel] },
    }));
  };

  const getActiveChannels = (notifKey: string) => {
    const channels = toggles[notifKey];
    const active = Object.entries(channels).filter(([, v]) => v).map(([k]) => k);
    return active.length > 0 ? active.join(", ") : "Off";
  };

  const renderGroup = (types: typeof notificationTypes) =>
    types.map((nt) => {
      const isOpen = expandedNotif === nt.key;
      return (
        <div key={nt.key}>
          <button
            onClick={() => setExpandedNotif(isOpen ? null : nt.key)}
            className="flex w-full cursor-pointer items-start gap-4 px-5 py-4 transition-colors hover:bg-[#F5F5F5]"
          >
            <img src={nt.icon} alt="" className="mt-0.5 h-6 w-6 shrink-0" />
            <div className="flex-1 text-left">
              <div className="text-[14px] font-medium text-gray-dark">{nt.label}</div>
              <div className="mt-[2px] text-[14px] font-normal text-gray-light">{getActiveChannels(nt.key)}</div>
            </div>
            <motion.img
              src={chevronDown}
              alt=""
              className="h-6 w-6 shrink-0 self-center"
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            />
          </button>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden px-5"
              >
                <div className="pb-4 pl-10">
                  <p className="text-[14px] text-[#707070]">
                    {nt.description} Choose where you receive these notifications:
                  </p>

                  <div className="mt-2">
                    {nt.channels.map((channel) => (
                      <ToggleRow
                        key={channel}
                        label={channel}
                        enabled={toggles[nt.key][channel]}
                        onToggle={() => handleToggle(nt.key, channel)}
                      />
                    ))}
                  </div>

                  {nt.channels.includes("Email") && toggles[nt.key]?.["Email"] && (
                    <>
                      <p className="mt-4 text-[14px] text-[#707070]">Choose email frequency</p>
                      <div className="mt-2">
                        {emailFrequencyOptions.map((option) => (
                          <label key={option} className="flex cursor-pointer items-center gap-2.5 py-2">
                            <div className="relative flex h-5 w-5 shrink-0 items-center justify-center">
                              <input
                                type="radio"
                                name={`email-freq-${nt.key}`}
                                checked={(emailFrequency[nt.key] || "Recommended") === option}
                                onChange={() => setEmailFrequency((prev) => ({ ...prev, [nt.key]: option }))}
                                className="peer sr-only"
                              />
                              <div className="h-5 w-5 rounded-full border border-[#CCCCCC] transition-colors peer-checked:border-[#000000]/15 peer-checked:bg-gray-dark" />
                              <div className="absolute h-[7px] w-[7px] rounded-full bg-transparent transition-colors peer-checked:bg-white" />
                            </div>
                            <span className="text-[14px] font-medium text-gray-dark">{option}</span>
                          </label>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      );
    });

  return (
    <>
      <p className="mt-8 text-[12px] font-medium uppercase tracking-[0.1em] text-[#707070]">Community</p>
      <div className="mt-3 overflow-hidden rounded-xl border border-[#E5E5E5]">{renderGroup(notificationTypes)}</div>

      <p className="mt-8 text-[12px] font-medium uppercase tracking-[0.1em] text-[#707070]">My coaching</p>
      <div className="mt-3 overflow-hidden rounded-xl border border-[#E5E5E5]">{renderGroup(coachingNotificationTypes)}</div>
    </>
  );
}

// ── Placeholder tab — the dashed boxes used by Payment details / Order history
// / Refer a friend until real content exists. ──
export function PlaceholderSection() {
  return (
    <div className="mt-8 flex flex-col gap-4">
      {[0, 1, 2].map((i) => (
        <div key={i} className="h-[160px] rounded-xl bg-[#F5F5F5]" style={dashedBorderStyle} />
      ))}
    </div>
  );
}

// Render the body for a given settings tab key. Both surfaces call this so the
// content stays identical between /settings and the My Leland Account tabs.
export function SettingsSectionContent({
  tabKey,
  hidePhoneToggles = false,
}: {
  tabKey: string;
  hidePhoneToggles?: boolean;
}) {
  if (tabKey === "account") return <AccountProfileSection hidePhoneToggles={hidePhoneToggles} />;
  if (tabKey === "notifications") return <NotificationsSection />;
  return <PlaceholderSection />;
}
