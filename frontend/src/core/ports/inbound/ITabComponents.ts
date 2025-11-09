// Core layer - NO React dependencies
// This interface defines the contract for tab components
// The actual implementation will be in the UI adapter layer
export interface ITabComponent {
  // Return type is intentionally generic - implementation in UI layer
  render(): unknown;
}