import { useState } from "react";
import Timer from '../Timer';

export default function TimerExample() {
  const [isActive, setIsActive] = useState(false);
  const [practiceActive, setPracticeActive] = useState(false);

  return (
    <div className="space-y-8 p-6">
      <div>
        <h3 className="mb-4 text-lg font-medium">Default Timer (90 minutes) - Mock Exam</h3>
        <Timer
          duration={5400} // 90 minutes
          isActive={isActive}
          onTimeUp={() => console.log("Time's up!")}
          onPause={() => {
            setIsActive(false);
            console.log("Timer paused");
          }}
          onResume={() => {
            setIsActive(true);
            console.log("Timer resumed");
          }}
          onStop={() => {
            setIsActive(false);
            console.log("Timer stopped");
          }}
          onReset={() => {
            setIsActive(false);
            console.log("Timer reset");
          }}
        />
        <div className="mt-4 text-center">
          <button
            onClick={() => setIsActive(!isActive)}
            className="text-sm text-blue-600 hover:underline"
          >
            {isActive ? "Deactivate" : "Activate"} Timer
          </button>
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-medium">Practice Mode Timer - Non-Interfering</h3>
        <p className="text-sm text-muted-foreground mb-4">
          This timer appears in top-right corner, counts up from zero, is minimizable, pausable, hideable, and doesn't interfere with practice flow
        </p>
        <Timer
          duration={0} // Not used in count-up mode
          isActive={practiceActive}
          variant="practice"
          allowMinimize={true}
          nonInterfering={true}
          countUp={true}
          onPause={() => {
            setPracticeActive(false);
            console.log("Practice timer paused");
          }}
          onResume={() => {
            setPracticeActive(true);
            console.log("Practice timer resumed");
          }}
          onReset={() => {
            setPracticeActive(false);
            console.log("Practice timer reset");
          }}
        />
        <div className="mt-4 text-center">
          <button
            onClick={() => setPracticeActive(!practiceActive)}
            className="text-sm text-blue-600 hover:underline"
          >
            {practiceActive ? "Deactivate" : "Activate"} Practice Timer
          </button>
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-medium">Compact Timer (5 minutes)</h3>
        <Timer
          duration={300}
          isActive={true}
          variant="compact"
          showControls={false}
          onTimeUp={() => console.log("Compact timer finished")}
        />
      </div>

      <div>
        <h3 className="mb-4 text-lg font-medium">Low Time Warning (1 minute)</h3>
        <Timer
          duration={60}
          isActive={true}
          onTimeUp={() => console.log("Low time timer finished")}
        />
      </div>
    </div>
  );
}