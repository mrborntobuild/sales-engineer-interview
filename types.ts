export interface PermissionState {
  audio: boolean;
  video: boolean;
  screen: boolean;
}

export enum InterviewStatus {
  IDLE = 'IDLE',
  CHECKING = 'CHECKING',
  READY = 'READY',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED'
}

export interface Message {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface CheckItemProps {
  label: string;
  checked: boolean;
  loading?: boolean;
}