import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "../components/Button";
import PageShell from "../components/PageShell";
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
import profilePhoto from "../assets/profile photos/profile photo.png";

const tabs = [
  { key: "account", label: "Account", icon: settingsIcon },
  { key: "notifications", label: "Notifications", title: "Notification Settings", subtitle: "Leland may still send you important notifications about your account and content outside of your preferred notification settings.", icon: notificationsInactive },
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
        <input
          type="checkbox"
          checked={enabled}
          onChange={onToggle}
          className="peer sr-only"
        />
        <div className="h-5 w-9 rounded-full bg-[#d4d4d4] transition-colors peer-checked:bg-[#038561]" />
        <div className="absolute left-[2px] top-[2px] h-4 w-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-4" />
      </div>
    </label>
  );
}

const emailFrequencyOptions = ["Individual", "Weekly", "Recommended"];

export default function AccountSettings() {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") || "account";
  const [activeTab, setActiveTab] = useState(initialTab);
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

  const [smsReminders, setSmsReminders] = useState(true);
  const [smsOffers, setSmsOffers] = useState(false);
  const [sessionSummaries, setSessionSummaries] = useState(true);

  const dashedBorderStyle = {
    backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='12' ry='12' stroke='%23C5C5C5' stroke-width='2' stroke-dasharray='4%2c 4' stroke-dashoffset='0' stroke-linecap='butt'/%3e%3c/svg%3e")`,
  };

  const settingsNav = (
    <nav className="flex flex-col gap-1">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => setActiveTab(tab.key)}
          className={`flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-3 text-[16px] font-medium transition-colors ${
            activeTab === tab.key
              ? "bg-[#222222]/5 text-gray-dark"
              : "text-gray-dark hover:bg-gray-hover"
          }`}
        >
          <img src={tab.icon} alt="" className="h-6 w-6 shrink-0" />
          {tab.label}
        </button>
      ))}
    </nav>
  );

  return (
    <PageShell leftSidebar={settingsNav}>
      <div>
          <h1 className="text-[30px] font-medium text-gray-dark md:text-[38px]">
            {(() => { const t = tabs.find((t) => t.key === activeTab); return t?.title ?? t?.label; })()}
          </h1>
          {(() => { const t = tabs.find((t) => t.key === activeTab); return t?.subtitle ? <p className="mt-2 text-[16px] text-gray-light">{t.subtitle}</p> : null; })()}

          {activeTab === "notifications" ? (
            <>
            <p className="mt-8 text-[12px] font-medium uppercase tracking-[0.1em] text-[#707070]">Community</p>
            <div className="mt-3 overflow-hidden rounded-xl border border-[#E5E5E5]">
              {notificationTypes.map((nt) => {
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
                                    <label
                                      key={option}
                                      className="flex cursor-pointer items-center gap-2.5 py-2"
                                    >
                                      <div className="relative flex h-5 w-5 shrink-0 items-center justify-center">
                                        <input
                                          type="radio"
                                          name={`email-freq-${nt.key}`}
                                          checked={(emailFrequency[nt.key] || "Recommended") === option}
                                          onChange={() => setEmailFrequency((prev) => ({ ...prev, [nt.key]: option }))}
                                          className="peer sr-only"
                                        />
                                        <div className="h-5 w-5 rounded-full border border-[#CCCCCC] transition-colors peer-checked:border-[#000000]/15 peer-checked:bg-[#038561]" />
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
              })}
            </div>

            <p className="mt-8 text-[12px] font-medium uppercase tracking-[0.1em] text-[#707070]">My coaching</p>
            <div className="mt-3 overflow-hidden rounded-xl border border-[#E5E5E5]">
              {coachingNotificationTypes.map((nt) => {
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
                                    <label
                                      key={option}
                                      className="flex cursor-pointer items-center gap-2.5 py-2"
                                    >
                                      <div className="relative flex h-5 w-5 shrink-0 items-center justify-center">
                                        <input
                                          type="radio"
                                          name={`email-freq-${nt.key}`}
                                          checked={(emailFrequency[nt.key] || "Recommended") === option}
                                          onChange={() => setEmailFrequency((prev) => ({ ...prev, [nt.key]: option }))}
                                          className="peer sr-only"
                                        />
                                        <div className="h-5 w-5 rounded-full border border-[#CCCCCC] transition-colors peer-checked:border-[#000000]/15 peer-checked:bg-[#038561]" />
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
              })}
            </div>
            </>
          ) : activeTab === "account" ? (
            <div className="mt-8">
              {/* Profile photo */}
              <div className="flex items-center gap-5 rounded-xl bg-[#F5F5F5] p-5">
                <img src={profilePhoto} alt="" className="h-[72px] w-[72px] shrink-0 rounded-full object-cover" />
                <div>
                  <p className="text-[14px] text-gray-light">Drag and drop an image or select from your files (under 1MB).</p>
                  <div className="mt-3 flex items-center gap-4">
                    <Button size="sm" variant="secondary">Upload new photo</Button>
                    <button className="text-[14px] font-medium text-gray-dark">Remove photo</button>
                  </div>
                </div>
              </div>

              {/* Name */}
              <div className="mt-6 border-t border-gray-stroke pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-[16px] font-semibold text-gray-dark">Name</h3>
                    <p className="mt-1 text-[14px] text-gray-light">June Allen</p>
                  </div>
                  <button className="text-[14px] font-medium text-gray-dark underline underline-offset-2">Edit</button>
                </div>
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
                <div className="mt-4 flex flex-col gap-2">
                  <div className="flex items-center justify-between rounded-lg bg-[#F5F5F5] px-4 py-3.5">
                    <span className="text-[14px] text-gray-light">Send me SMS reminders for my upcoming sessions</span>
                    <button onClick={() => setSmsReminders(!smsReminders)} className="relative h-[26px] w-[44px] shrink-0 cursor-pointer">
                      <div className={`h-full w-full rounded-full transition-colors ${smsReminders ? "bg-[#038561]" : "bg-[#E5E5E5]"}`} />
                      <div className={`absolute top-[2px] h-[22px] w-[22px] rounded-full bg-white shadow-sm transition-transform ${smsReminders ? "left-[20px]" : "left-[2px]"}`} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-[#F5F5F5] px-4 py-3.5">
                    <span className="text-[14px] text-gray-light">Text me about relevant events and special offers</span>
                    <button onClick={() => setSmsOffers(!smsOffers)} className="relative h-[26px] w-[44px] shrink-0 cursor-pointer">
                      <div className={`h-full w-full rounded-full transition-colors ${smsOffers ? "bg-[#038561]" : "bg-[#E5E5E5]"}`} />
                      <div className={`absolute top-[2px] h-[22px] w-[22px] rounded-full bg-white shadow-sm transition-transform ${smsOffers ? "left-[20px]" : "left-[2px]"}`} />
                    </button>
                  </div>
                </div>
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

              {/* Personal bio */}
              <div className="mt-6 border-t border-gray-stroke pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-[16px] font-semibold text-gray-dark">Personal bio</h3>
                    <p className="mt-1 text-[14px] text-gray-light">Product manager at Atlassian with 6+ years of experience building enterprise SaaS tools. I'm looking for coaching in career development to grow my expertise as a product leader.</p>
                  </div>
                  <button className="ml-4 shrink-0 text-[14px] font-medium text-gray-dark underline underline-offset-2">Edit</button>
                </div>
              </div>

              {/* Generate session summaries */}
              <div className="mt-6 border-t border-gray-stroke pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="shrink-0">
                      <path d="M10 1L11.5 7L17 5.5L13 10L17 14.5L11.5 13L10 19L8.5 13L3 14.5L7 10L3 5.5L8.5 7L10 1Z" stroke="#333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <h3 className="text-[16px] font-semibold text-gray-dark">Generate session summaries</h3>
                  </div>
                  <button onClick={() => setSessionSummaries(!sessionSummaries)} className="relative mt-0.5 h-[26px] w-[44px] shrink-0 cursor-pointer">
                    <div className={`h-full w-full rounded-full transition-colors ${sessionSummaries ? "bg-[#038561]" : "bg-[#E5E5E5]"}`} />
                    <div className={`absolute top-[2px] h-[22px] w-[22px] rounded-full bg-white shadow-sm transition-transform ${sessionSummaries ? "left-[20px]" : "left-[2px]"}`} />
                  </button>
                </div>
                <p className="mt-1 text-[14px] text-gray-light">Leland can generate text summaries of your sessions, making it easy to revisit important concepts and stay aligned on your action items.</p>
              </div>
            </div>
          ) : (
            /* Placeholder boxes for other tabs */
            <div className="mt-8 flex flex-col gap-4">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="h-[160px] rounded-xl bg-[#F5F5F5]"
                  style={dashedBorderStyle}
                />
              ))}
            </div>
          )}
      </div>
    </PageShell>
  );
}
