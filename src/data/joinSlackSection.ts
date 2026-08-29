import type { BlockSection } from "./lessonBlocks";

export const JOIN_SLACK_SECTION: BlockSection = {
  id: "join-cohort",
  kind: "blocks",
  title: "Join your Slack community",
  blocks: [
    {
      kind: "markdown",
      body: "Your cohort, TAs, and the Leland team are all in Slack. This is where announcements go out, where you can ask questions, and where other builders in your cohort are sharing what they're working on.",
    },
    {
      kind: "banner",
      text: "Join #ai-builder-jul-26",
      subtext: "Leland AI Builders",
      color: "white",
      image: "BrandSlack",
      href: "https://join.slack.com/t/lelandaibuilders/shared_invite/zt-3y9fgg4a9-qQBHHWe8ZlHYmr9oQ6mp7w",
    },
    {
      kind: "callout",
      tone: "blue",
      title: "What to expect",
      content: [
        {
          kind: "markdown",
          body: "- **#announcements** — Program updates, reminders, and links from the Leland team\n- **#ai-builder-jul-26** — Your cohort channel for questions, sharing work, and peer feedback\n- **#office-hours** — Schedule links and recordings from each session\n- **Direct messages** — TAs are available for 1:1 help throughout the program",
        },
      ],
    },
    {
      kind: "markdown",
      body: "Already in Slack? Search for **#ai-builder-jul-26** in the left sidebar.",
    },
  ],
};
