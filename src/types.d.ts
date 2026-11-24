export {};
declare global {
  interface Window {
    satellite: {
      saveStl(bytes: number[]): Promise<{ canceled: boolean; filePath?: string }>;
    };
  }
}