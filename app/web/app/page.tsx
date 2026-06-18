import { Navbar } from "@/components/layout/Navbar";
import { HeroSection } from "@/components/landingPage/HeroSection";
import { IntegrationsSection } from "@/components/landingPage/IntegrationsSection";
// import { WorkflowBuilder } from "./components/WorkflowBuilder";
// import { AIAgentSection } from "./components/AIAgentSection";
// import { ExecutionEngine } from "./components/ExecutionEngine";
// import { IntegrationsSection } from "./components/IntegrationsSection";
// import { HumanApproval } from "./components/HumanApproval";
// import { MonitoringSection } from "./components/MonitoringSection";
// import { FailureRecovery } from "./components/FailureRecovery";
// import { ScaleSection } from "./components/ScaleSection";
// import { Testimonials } from "./components/Testimonials";
// import { FinalCTA } from "./components/FinalCTA";
// import { Footer } from "./components/Footer";

export default function App() {
  return (
    <div className="page-root" style={{ background: "#060608", color: "#F0EEE9", fontFamily: "var(--font-body)" }}>
      <Navbar />
      <main>
        <HeroSection />
        <IntegrationsSection />

        {/* <WorkflowBuilder />
        <AIAgentSection />
        <ExecutionEngine />
        <IntegrationsSection />
        <HumanApproval />
        <MonitoringSection />
        <FailureRecovery />
        <ScaleSection />
        <Testimonials />
        <FinalCTA /> */}
      </main>
      {/* <Footer /> */}
    </div>
  );
}
