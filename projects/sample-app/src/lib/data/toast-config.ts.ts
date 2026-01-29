import { ToastPosition } from './toast-position.enum';
import { ToastType } from './toast-type.enum';

export interface ToastConfig {
  position: ToastPosition;
  duration: number;
  maxToasts: number;
  animationDuration: number;
  showProgressBar: boolean;
  pauseOnHover: boolean;
  enableSound: boolean;
  defaultType: ToastType;
  allowedOrigins: string[];
}