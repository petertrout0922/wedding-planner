import React from 'react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { HelpCircle } from 'lucide-react';

interface HelpTooltipProps {
  content: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  maxWidth?: number;
}

export const HelpTooltip: React.FC<HelpTooltipProps> = ({
  content,
  placement = 'top',
  maxWidth = 300
}) => {
  return (
    <Tippy
      content={content}
      placement={placement}
      maxWidth={maxWidth}
      interactive={true}
      trigger="click"
      touch={['hold', 500]}
    >
      <button
        type="button"
        className="inline-flex items-center justify-center w-5 h-5 text-gray-400 hover:text-primary-500 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-full"
        aria-label="Help"
      >
        <HelpCircle className="w-4 h-4" />
      </button>
    </Tippy>
  );
};
