import EggContainer from "./components/EggContainer/page";
import Chatbot from "./components/Chatbot/page";
export default function EggTimer() {
  return (
    <div className="flex  flex-col justify-evenly items-center lg:flex-row lg:h-screen lg:items-center lg:justify-evenly bg-amber-100">
      <Chatbot />
      <EggContainer />
      <EggContainer />
    </div>
  );
}
/* Going off for a month*/
