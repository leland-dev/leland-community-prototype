import pic6 from "../assets/profile photos/pic-6.png";
import pic9 from "../assets/profile photos/pic-9.png";
import categoryMBA from "../assets/placeholder images/category images/gmat-tutoring.png";
import categoryConsulting from "../assets/placeholder images/category images/management-consulting.png";
import categoryAI from "../assets/placeholder images/category images/AI-automation-and-agents.png";
import categoryFinance from "../assets/placeholder images/category images/investment-banking.png";
import categoryPM from "../assets/placeholder images/category images/product-management.png";

export type AgentAssets = {
  coachAvatar: string;
  categoryImage: string;
};

export const AGENT_ASSETS: Record<string, AgentAssets> = {
  "samantha-mba-admissions": { coachAvatar: pic6, categoryImage: categoryMBA },
  "samantha-gmat-prep": { coachAvatar: pic6, categoryImage: categoryMBA },
  "samantha-consulting": { coachAvatar: pic6, categoryImage: categoryConsulting },
  "john-mba-application-strategy": { coachAvatar: pic9, categoryImage: categoryMBA },
  "john-mba-essays": { coachAvatar: pic9, categoryImage: categoryMBA },
  "john-mba-interviews": { coachAvatar: pic9, categoryImage: categoryMBA },
  "john-mba-recommenders": { coachAvatar: pic9, categoryImage: categoryMBA },
  "john-deferred-mba": { coachAvatar: pic9, categoryImage: categoryMBA },
  "john-fundraising": { coachAvatar: pic9, categoryImage: categoryFinance },
  "john-pitch-decks": { coachAvatar: pic9, categoryImage: categoryFinance },
  "john-startup": { coachAvatar: pic9, categoryImage: categoryAI },
  "john-career": { coachAvatar: pic9, categoryImage: categoryPM },
};
