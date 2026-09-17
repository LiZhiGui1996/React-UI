import React from 'react';
import { useApp } from '../context/AppContext';
import { getThemeTokens } from '../utils/themeStyles';
import { Check, ChevronRight } from 'lucide-react';

export const WorkflowStepBar: React.FC = () => {
  const {
    activeWorkflowSteps,
    workflowStepIndex,
    setWorkflowStepIndex,
    theme,
    currentMainTab,
    setCurrentMainTab,
    errorSubTab,
    setErrorSubTab
  } = useApp();

  const tokens = getThemeTokens(theme);
  const isLight = theme === 'light-metrology';

  const handleStepClick = (index: number, stepName: string) => {
    setWorkflowStepIndex(index);
    if (stepName === '校准') {
      setCurrentMainTab('calibration');
    } else if (stepName.includes('结构误差测量') || stepName.includes('动态误差测量') || stepName.includes('测量') || stepName.includes('参数')) {
      setCurrentMainTab('error-measure');
      if (stepName.includes('动态')) {
        setErrorSubTab('dynamic');
      } else {
        setErrorSubTab('structural');
      }
    } else if (stepName.includes('保存')) {
      setCurrentMainTab('history-report');
    }
  };

  return (
    <footer 
      id="workflow-step-bar"
      className="h-10 px-4 flex items-center justify-between border-t select-none shrink-0 overflow-x-auto transition-colors"
      style={{
        backgroundColor: tokens.subcardBg,
        borderColor: tokens.borderColor,
      }}
    >
      <div className="flex items-center gap-1.5 w-full justify-between max-w-full">
        <span 
          className="text-[10px] font-semibold tracking-wider uppercase shrink-0 mr-2"
          style={{ color: tokens.mutedColor }}
        >
          测量工作流程:
        </span>

        <div className="flex items-center gap-1.5 flex-1 overflow-x-auto py-0.5">
          {activeWorkflowSteps.map((step, idx) => {
            const isCompleted = idx < workflowStepIndex;
            const isCurrent = idx === workflowStepIndex;

            return (
              <React.Fragment key={step}>
                <button
                  onClick={() => handleStepClick(idx, step)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] whitespace-nowrap transition-all cursor-pointer font-medium ${
                    isCompleted
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs'
                      : isCurrent
                        ? isLight
                          ? 'bg-white text-sky-600 border-2 border-sky-500 font-bold shadow-xs'
                          : 'bg-slate-900 text-sky-400 border-2 border-sky-400 font-bold shadow-xs'
                        : `${tokens.secondaryButtonClass}`
                  }`}
                  title={`步骤 ${idx + 1}: ${step}`}
                >
                  <span className="font-mono-num">{idx + 1}</span>
                  <span>{step}</span>
                </button>

                {idx < activeWorkflowSteps.length - 1 && (
                  <ChevronRight className="w-3.5 h-3.5 shrink-0" style={{ color: tokens.mutedColor }} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </footer>
  );
};
