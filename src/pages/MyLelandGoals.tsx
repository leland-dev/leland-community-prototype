import { useEffect } from "react";
import { GoalTile, NewGoalTile } from "../components/GoalTile";
import { useGoals } from "../contexts/GoalsContext";

export default function MyLelandGoals() {
  const { goals } = useGoals();

  useEffect(() => {
    document.title = "Leland Prototype | Goals";
  }, []);

  return (
    <div>
      <div className="flex flex-col gap-1">
        <h1 className="font-serif text-[30px] font-medium leading-[1.1] text-gray-dark md:text-[38px]">My goals</h1>
        <p className="mt-1 text-[16px] text-gray-light">Track your progress toward what matters most.</p>
      </div>

      <div className="mt-8 flex flex-wrap gap-4">
        <NewGoalTile variant="prompt" />
        {goals.map((goal) => (
          <GoalTile key={goal.id} goal={goal} variant="bordered" />
        ))}
      </div>
    </div>
  );
}
