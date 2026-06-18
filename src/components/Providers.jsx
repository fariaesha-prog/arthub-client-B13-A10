"use client";
import { HeroUIProvider } from "@heroui/system";
import { heroui } from "@heroui/theme";

export default function Providers({ children }) {
  return <HeroUIProvider theme={heroui()}>{children}</HeroUIProvider>;
}