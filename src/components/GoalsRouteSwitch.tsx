import { useGoalsVersion } from "../contexts/GoalsVersionContext";
import GoalsIndex from "../pages/GoalsIndex";
import GoalDetail from "../pages/GoalDetail";
import GoalNew from "../pages/GoalNew";
import FullGoalsIndex from "../full/pages/GoalsIndex";
import FullGoalDetail from "../full/pages/GoalDetail";
import FullGoalNew from "../full/pages/GoalNew";

// Which goals experience renders at each route — see GoalsVersionContext.
export function GoalsIndexSwitch() {
  const { version } = useGoalsVersion();
  return version === "full" ? <FullGoalsIndex /> : <GoalsIndex />;
}

export function GoalDetailSwitch() {
  const { version } = useGoalsVersion();
  return version === "full" ? <FullGoalDetail /> : <GoalDetail />;
}

export function GoalNewSwitch() {
  const { version } = useGoalsVersion();
  return version === "full" ? <FullGoalNew /> : <GoalNew />;
}
