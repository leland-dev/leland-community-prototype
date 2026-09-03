import type { BlockSection, RadioCardGroupBlock } from "./lessonBlocks";

// Asked at intake and again, verbatim, on the course-completion page — a 1-5
// scale (rather than qualitative buckets like "Great"/"Decent") so there's
// headroom to show improvement even for someone who already rates
// themselves reasonably confident going in.
export const AI_CONFIDENCE_QUESTION: RadioCardGroupBlock = {
  kind: "radioCardGroup",
  id: "ai-confidence",
  question: "How confident are you using AI to get real work done?",
  options: [
    { value: "1", label: "1 - Not at all confident" },
    { value: "2", label: "2" },
    { value: "3", label: "3" },
    { value: "4", label: "4" },
    { value: "5", label: "5 - Very confident" },
  ],
};

export const PERSONALIZATION_SECTION: BlockSection = {
  id: "personalize",
  kind: "blocks",
  title: "Getting to know you",
  blocks: [
    {
      kind: "markdown",
      body: "A few quick questions about your experience with AI. This takes about 2 minutes.",
    },
    { kind: "divider" },
    {
      kind: "toggleChipGroup",
      id: "motivation",
      question: "Why are you joining the AI Builder program?",
      subtext: "Select everything that applies.",
      multiple: true,
      options: [
        { value: "catch-up", label: "Catch up with peers" },
        { value: "company", label: "Manager or company asked me to" },
        { value: "career", label: "Career advancement" },
        { value: "automate", label: "Automate tedious work" },
        { value: "explore", label: "Explore AI generally" },
        { value: "other", label: "Other" },
      ],
    },
    { kind: "divider" },
    AI_CONFIDENCE_QUESTION,
    { kind: "divider" },
    {
      kind: "toggleChipGroup",
      id: "ai-use",
      question: "Which of these do you currently use AI for?",
      subtext: "Select everything that applies.",
      multiple: true,
      options: [
        { value: "drafting", label: "Drafting emails or messages" },
        { value: "summarizing", label: "Summarizing documents" },
        { value: "coding", label: "Writing code" },
        { value: "researching", label: "Researching topics" },
        { value: "images", label: "Generating images" },
        { value: "notes", label: "Taking meeting notes" },
        { value: "other", label: "Other" },
      ],
    },
  ],
};
