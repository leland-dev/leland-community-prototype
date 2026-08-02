import { FlowStepProgress } from "../flow-kit";
import { renderItSetupStep } from "./steps";
import { useItSetupFlow } from "./useItSetupFlow";

type ItSetupFlowProps = {
  onComplete?: () => void;
};

export function ItSetupFlow({ onComplete }: ItSetupFlowProps) {
  const controller = useItSetupFlow();

  return (
    <div className="flex flex-col gap-8">
      <FlowStepProgress
        current={controller.progress.n}
        total={controller.progress.total}
      />
      {renderItSetupStep(controller, onComplete)}
    </div>
  );
}
