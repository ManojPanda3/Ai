type Owner = "assistant" | "user"
export interface Chat {
  role: Owner;
  content: string;
}
export type strings = string[]
