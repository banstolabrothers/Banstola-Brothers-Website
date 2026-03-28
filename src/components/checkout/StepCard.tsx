import MyButton from "@/components/ui/MyButton";

interface StepCardProps {
  stepNumber: number;
  title: string;
  isActive: boolean;
  isCompleted: boolean;
  summaryText?: string | null;
  onChangeClick: () => void;
  children: React.ReactNode;
}

const StepCard = ({
  stepNumber,
  title,
  isActive,
  isCompleted,
  summaryText,
  onChangeClick,
  children,
}: StepCardProps) => (
  <div
    className={`bg-white rounded-3xl overflow-hidden w-full transition-all duration-300 ease-in-out
    ${isActive ? "shadow-md" : "border border-neutral-200"}`}
  >
    <div className="p-6 flex items-center gap-6">
      <div className="flex flex-col text-left w-full">
        <h6 className="text-gray-900">
          {stepNumber}. {title}
        </h6>
        {isCompleted && !isActive && summaryText && (
          <p className="text-gray-600 mt-2">{summaryText}</p>
        )}
      </div>
      {isCompleted && !isActive && (
        <MyButton
          type="secondarybutton"
          onClick={onChangeClick}
          text="Change"
        />
      )}
    </div>
    <div
      className={`transition-all duration-300 ease-in-out overflow-hidden
      ${isActive ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"}`}
    >
      <div className="flex flex-col p-6 gap-4">{children}</div>
    </div>
  </div>
);

export default StepCard;
