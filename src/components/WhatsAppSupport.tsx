import { MessageCircle } from "lucide-react";

const WhatsAppSupport = () => {
  const handleWhatsAppClick = () => {
    window.open("https://wa.me/1234567890", "_blank");
  };

  return (
    <button
      onClick={handleWhatsAppClick}
      className="fixed bottom-6 left-6 z-50 flex items-center gap-3 bg-[#25D366] hover:bg-[#128C7E] text-white px-4 py-3 rounded-full shadow-lg transition-all duration-300 hover:scale-105"
    >
      <MessageCircle className="h-6 w-6" />
      <span className="font-medium">How can we help?</span>
    </button>
  );
};

export default WhatsAppSupport;
