import TestEngineFooter from "./footer";
import QuestionFormRenderer from "./question-form-renderer";

export default function TestEngineBody() {
  return (
    <div className="w-3/4 h-full flex flex-col justify-between gap-10 shrink-0">
      <QuestionFormRenderer />
      <TestEngineFooter />
    </div>
  );
}
