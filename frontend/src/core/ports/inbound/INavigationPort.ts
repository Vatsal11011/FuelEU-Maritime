// Core layer - NO React dependencies
import type { TabId } from '../../../shared/types';

export interface INavigationPort {
  navigateToTab(tabId: TabId): void;
  getCurrentTab(): TabId | null;
}