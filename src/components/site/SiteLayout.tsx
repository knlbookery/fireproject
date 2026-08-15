import type { ReactNode } from "react";

import { Header } from "./Header";
import { Footer } from "./Footer";
import { AssistantWidget } from "./AssistantWidget";
import { PageNarrator } from "./PageNarrator";
import { ScrollProgress } from "./motion";

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen bg-background">
      <ScrollProgress />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-primary focus:px-5 focus:py-3 focus:text-sm focus:text-primary-foreground"
      >
        Skip to main content
      </a>
      <Header />
      <main id="main-content">{children}</main>
      <Footer />
      <PageNarrator />
      <AssistantWidget />
    </div>
  );
}


