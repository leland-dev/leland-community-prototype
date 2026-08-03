import { FlowStepProgress } from "../flow-kit";
import { renderItSetupStep } from "./steps";
import { useItSetupFlow } from "./useItSetupFlow";

type ItSetupFlowProps = {
  onComplete?: () => void;
  onContinue?: () => void;
};

export function ItSetupFlow({ onComplete, onContinue }: ItSetupFlowProps) {
  const controller = useItSetupFlow();

  return (
    <div className="flex flex-col gap-8">
      <FlowStepProgress
        current={controller.progress.n}
        total={controller.progress.total}
      />
      {renderItSetupStep(controller, onComplete, onContinue)}
    </div>
  );
}
