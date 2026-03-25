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
      {/* Background Glow Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-violet-700/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-sky-700/20 rounded-full blur-3xl" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-lg w-full">
        {/* Icon Badge */}
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center shadow-2xl shadow-violet-900/50 mb-6">
          <Users size={36} />
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold mb-4 tracking-tight">
          Contact Manager
        </h1>

        {/* Subtitle */}
        <p className="text-slate-400 text-base leading-relaxed mb-10 max-w-sm">
          Welcome to your modern contact management app. Easily add, edit,
          search and manage your contacts in one place.
        </p>

        {/* CTA Button */}
        <Button
          onClick={() => setShowPage(true)}
         
        >
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
