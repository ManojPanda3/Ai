import { strings } from "./types";

export function cn(classNames: strings) {
  return classNames.map((className: string) => className.trim()).join(" ")
}
