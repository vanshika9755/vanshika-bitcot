import { useState } from "react";
import { ArrowRight, Users } from "lucide-react";
import ContactScreen from "./ContactScreen";
import { Button } from "./ui/button";

const Welcome = () => {
  const [showPage, setShowPage] = useState(false);

  if (showPage) {
    return <ContactScreen />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4 relative overflow-hidden">
      <div className="relative z-10 flex flex-col items-center text-center max-w-lg w-full">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center shadow-2xl shadow-violet-900/50 mb-6">
          <Users size={36} />
        </div>
        <h1 className="text-4xl font-bold mb-4 tracking-tight">
          Welocme to Contact Application
        </h1>

        <Button onClick={() => setShowPage(true)}>
          <span className="font-medium">Get Started</span>
          <ArrowRight
            size={18}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </Button>
      </div>
    </div>
  );
};

export default Welcome;
