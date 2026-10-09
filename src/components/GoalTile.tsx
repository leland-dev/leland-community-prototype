import { useNavigate } from "react-router-dom";
import { goalProgress, overdueCount, upNextItem, type Goal } from "../data/goals";
import addPlusIcon from "../assets/icons/add-plus.svg";

const dashedBorderStyle = {
  backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='12' ry='12' stroke='%23C5C5C5' stroke-width='2' stroke-dasharray='4%2c 4' stroke-dashoffset='0' stroke-linecap='butt'/%3e%3c/svg%3e")`,
};

// "Sell on Leland"-style dashed outline: 3px dashes in gray-dark (#222222) at
// 30% opacity. border-dashed can't control dash length, so draw it as an SVG.
const promptDashedBorderStyle = {
  backgroundImage: `url("data:image/svg+xml,%3csvg%20width='100%25'%20height='100%25'%20xmlns='http://www.w3.org/2000/svg'%3e%3crect%20width='100%25'%20height='100%25'%20fill='none'%20rx='12'%20ry='12'%20stroke='%23222222'%20stroke-opacity='0.3'%20stroke-width='2'%20stroke-dasharray='3%204'/%3e%3c/svg%3e")`,
};

// One goal tile — target, next task, progress. No on-track/needs-action
// health judgment — just the facts (done/total, overdue count). 300px fixed
// width in the dashboard's horizontally scrolling row.
export function GoalTile({ goal, variant = "filled" }: { goal: Goal; variant?: "filled" | "bordered" }) {
  const navigate = useNavigate();
  const completed = !!goal.completedAt;
  const { done, total, pct } = goalProgress(goal);
  const overdue = overdueCount(goal);
  const upNext = upNextItem(goal);

  const surface =
    variant === "bordered"
      ? "border border-[#222222]/[0.12] bg-white hover:bg-gray-hover"
      : "bg-[#F5F5F5] hover:bg-[#EEEEEE]";
  // On a white card the inner box needs a tint to read as a distinct surface;
  // on the filled card white already contrasts.
  const innerSurface = variant === "bordered" ? "bg-[#F5F5F5]" : "bg-white";

  return (
    <button
      onClick={() => navigate(`/goals/${goal.id}`)}
      className={`flex w-[300px] shrink-0 flex-col gap-3 rounded-xl p-4 text-left transition-colors ${surface}`}
    >
      {completed && (
        <span className="text-[12px] font-medium uppercase tracking-[0.1em] text-gray-extra-light">Completed</span>
      )}

      <div className="flex flex-col gap-0.5">
        <div className="text-[16px] font-semibold leading-[1.2] text-gray-dark">{goal.name}</div>
        <div className="text-[14px] leading-[1.4] text-gray-extra-light">{goal.targetLabel}</div>
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="h-1 overflow-hidden rounded-full bg-[#222222]/10">
          <div className={`h-full rounded-full ${completed ? "bg-[#869AA6]" : "bg-gray-dark"}`} style={{ width: `${pct}%` }} />
        </div>
        <div className="text-[12px] text-gray-extra-light">
          {done} of {total} tasks
        </div>
        {overdue > 0 && <div className="text-right text-[12px] font-medium text-[#9F5B34]">{overdue} overdue</div>}
      </div>

      {completed ? (
        goal.outcome && (
          <div className={`flex flex-col gap-[3px] rounded-lg px-3 py-2.5 ${innerSurface}`}>
            <div className="text-[12px] font-medium uppercase tracking-[0.1em] text-[#707070]">Outcome</div>
            <div className="line-clamp-2 text-[14px] leading-[1.3] text-gray-dark">{goal.outcome}</div>
          </div>
        )
      ) : upNext ? (
        <div className={`flex flex-col gap-[3px] rounded-lg px-3 py-2.5 ${innerSurface}`}>
          <div className="text-[12px] font-medium uppercase tracking-[0.1em] text-[#707070]">Up next</div>
          <div className="text-[14px] font-medium leading-[1.3] text-gray-dark">{upNext.title}</div>
          <div className="flex items-center gap-1.5 text-[13px] text-gray-extra-light">
            <span>{upNext.dueLabel}</span>
            {upNext.assignedBy && (
              <>
                <span>·</span>
                <span className="inline-flex items-center gap-[5px]">
                  <img src={upNext.assignedBy.avatarUrl} alt="" className="h-4 w-4 rounded-full object-cover" />
                  via {upNext.assignedBy.name}
                </span>
              </>
            )}
          </div>
        </div>
      ) : null}
    </button>
  );
}

// Dashed tile — opens the new-goal flow. "prompt" matches the "Sell on Leland"
// callout (gray-dark dashed outline over a faint tint).
export function NewGoalTile({ variant = "filled" }: { variant?: "filled" | "prompt" }) {
  const navigate = useNavigate();
  const prompt = variant === "prompt";
  return (
    <button
      onClick={() => navigate("/goals/new")}
      style={prompt ? promptDashedBorderStyle : dashedBorderStyle}
      className={`flex w-[300px] shrink-0 flex-col items-start justify-center gap-1 rounded-xl p-4 text-left transition-colors ${
        prompt ? "bg-[#222222]/[0.04] hover:bg-[#222222]/[0.07]" : "bg-[#F5F5F5] hover:bg-[#EEEEEE]"
      }`}
    >
      <span className="flex items-center gap-2 text-[15px] font-semibold text-gray-dark">
        <img src={addPlusIcon} alt="" className="h-5 w-5" />
        Set a new goal
      </span>
      <span className="text-[14px] text-gray-extra-light">Pick what you're working toward next.</span>
    </button>
  );
}
