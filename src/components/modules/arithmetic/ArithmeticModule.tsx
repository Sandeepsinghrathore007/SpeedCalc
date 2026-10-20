import React, { useEffect } from 'react';
import { OperationType } from '../../../types';
import { useGridStore } from '../../../store/useGridStore';
import { SpeedGrid } from '../tables/SpeedGrid';
import { GridFloatingControls } from '../tables/GridFloatingControls';
import { ArithmeticFlashcard } from './ArithmeticFlashcard';

interface ArithmeticModuleProps {
  operation: OperationType;
}

export const ArithmeticModule: React.FC<ArithmeticModuleProps> = ({ operation }) => {
  const {
    operation: currentOp,
    setOperation,
    arithmeticMode,
  } = useGridStore();

  // Sync operation if changed from sidebar
  useEffect(() => {
    if (currentOp !== operation) {
      setOperation(operation);
    }
  }, [operation, currentOp, setOperation]);

  return (
    <div className="w-full h-full flex flex-col justify-center items-center relative">
      {arithmeticMode === 'grid' ? (
        <div className="w-full h-full flex flex-col justify-center items-center">
          {/* Full Maximum Proportions 10x10 Matrix Grid (includes Guided HUD directly above the grid) */}
          <SpeedGrid />

          {/* Floating Controls for Range, Shuffle, and Clear */}
          <GridFloatingControls />
        </div>
      ) : (
        <ArithmeticFlashcard operation={operation} />
      )}
    </div>
  );
};
