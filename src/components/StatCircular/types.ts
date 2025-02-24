export type StatCircularSize = 'small' | 'medium' | 'big';

export type StatCircularProps = {
  label: string;
  value: number;
  size?: StatCircularSize;
  tooltipMessage?: string;
};
