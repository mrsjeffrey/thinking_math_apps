import React from 'react';
import { appStyles } from '../styles/appStyles';
import { cn } from '../lib/cn';

type AppHeaderProps = {
  title: string;
  subtitle?: React.ReactNode;
  titleClassName?: string;
  subtitleClassName?: string;
  titleStyle?: React.CSSProperties;
};

export function AppHeader({
  title,
  subtitle,
  titleClassName,
  subtitleClassName,
  titleStyle,
}: AppHeaderProps) {
  return (
    <header className="border-b border-black/10 pb-6 space-y-4">
     <h1 className={cn(appStyles.headerTitle, titleClassName)} style={titleStyle}>
        {title}
      </h1>
      {subtitle ? <p className={cn(appStyles.headerSubtitle, 'mt-2', subtitleClassName)}>{subtitle}</p> : null}
    </header>
  );
}
