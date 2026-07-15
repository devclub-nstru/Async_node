import type { Metadata } from "next";
import DocsClient from "@/components/docs/DocsClient";

export const metadata: Metadata = {
  title: "Documentation — AsyncNode",
  description: "How to build, connect, and debug workflows in AsyncNode.",
};

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0d] text-[#FAFAFA]">
      <DocsClient />
    </div>
  );
}
