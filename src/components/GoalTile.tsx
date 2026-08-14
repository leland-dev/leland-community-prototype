import { useNavigate } from "react-router-dom";
import GoalFlame from "./GoalFlame";
import { goalProgress, goalStatus, overdueCount, upNextItem, type Goal } from "../data/goals";
import addPlusIcon from "../assets/icons/add-plus.svg";

const dashedBorderStyle = {
  backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='12' ry='12' stroke='%23C5C5C5' stroke-width='2' stroke-dasharray='4%2c 4' stroke-dashoffset='0' stroke-linecap='butt'/%3e%3c/svg%3e")`,
};

// One goal tile — status, target, next action, progress. 300px fixed width in
// the dashboard's horizontally scrolling row.
export function GoalTile({ goal }: { goal: Goal }) {
  const navigate = useNavigate();
  const status = goalStatus(goal);
  const { done, total, pct } = goalProgress(goal);
  const overdue = overdueCount(goal);
  const upNext = upNextItem(goal);

  return (
    <button
      onClick={() => navigate(`/goals/${goal.id}`)}
      className="flex w-[300px] shrink-0 flex-col gap-3 rounded-xl bg-[#F5F5F5] p-4 text-left transition-colors hover:bg-[#EEEEEE]"
    >
      <div className="flex items-center gap-1.5">
        <span className={`h-1.5 w-1.5 rounded-full ${status === "needs-action" ? "bg-[#9F5B34]" : "bg-[#869AA6]"}`} />
        <span className="text-[12px] font-medium uppercase tracking-[0.1em] text-gray-extra-light">
          {status === "needs-action" ? "Needs action" : "On track"}
        </span>
      </div>

      <div className="flex flex-col gap-0.5">
        <div className="text-[16px] font-semibold leading-[1.2] text-gray-dark">{goal.name}</div>
        <div className="text-[14px] leading-[1.4] text-gray-extra-light">{goal.targetLabel}</div>
      </div>

      {upNext && (
        <div className="flex flex-col gap-[3px] rounded-lg bg-white px-3 py-2.5">
          <div className="text-[12px] font-medium uppercase tracking-[0.1em] text-[#707070]">Up next</div>
          <div className="text-[14px] font-medium leading-[1.3] text-gray-dark">{upNext.title}</div>
          <div className="flex items-center gap-1.5 text-[13px] text-gray-extra-light">
            <span>{upNext.dueLabel}</span>
            <span>·</span>
            {upNext.kind === "routine" ? (
              <span className="inline-flex items-center gap-[3px] text-gray-dark">
                <GoalFlame />
                <span className="font-medium">{upNext.streak}</span>
              </span>
            ) : (
              upNext.assignedBy && (
                <span className="inline-flex items-center gap-[5px]">
                  <img src={upNext.assignedBy.avatarUrl} alt="" className="h-4 w-4 rounded-full object-cover" />
                  via {upNext.assignedBy.name}
                </span>
              )
            )}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <div className="h-1 overflow-hidden rounded-full bg-[#222222]/10">
          <div className="h-full rounded-full bg-gray-dark" style={{ width: `${pct}%` }} />
        </div>
        <div className="text-[12px] text-gray-extra-light">
          {done} of {total} tasks
        </div>
        {overdue > 0 && <div className="text-right text-[12px] font-medium text-[#9F5B34]">{overdue} overdue</div>}
      </div>
    </button>
  );
}

// Trailing dashed tile — always present, opens the new-goal flow.
export function NewGoalTile() {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate("/goals/new")}
      style={dashedBorderStyle}
      className="flex w-[300px] shrink-0 flex-col items-start justify-center gap-1 rounded-xl bg-[#F5F5F5] p-4 text-left transition-colors hover:bg-[#EEEEEE]"
    >
      <span className="flex items-center gap-2 text-[15px] font-semibold text-gray-dark">
        <img src={addPlusIcon} alt="" className="h-5 w-5" />
        Set a new goal
      </span>
      <span className="text-[14px] text-gray-extra-light">Pick what you're working toward next.</span>
    </button>
  );
}
