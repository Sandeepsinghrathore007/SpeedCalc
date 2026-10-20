import React from 'react';
import { TableControls } from './TableControls';
import { GuidedBanner } from './GuidedBanner';
import { SpeedGrid } from './SpeedGrid';

export const TablesModule: React.FC = () => {
  return (
    <div className="w-full flex flex-col items-center">
      <TableControls />
      <GuidedBanner />
      <SpeedGrid />
    </div>
  );
};
