import { useEffect, useState } from "react";
import { GlobalStyles, OtcBg } from "./styles";
import AnimatedRouter from "./routes";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { Loading } from "./components/Icons";
import { Player } from "@lottiefiles/react-lottie-player";
import * as animationData from "./preloader.json";
import "react-loading-skeleton/dist/skeleton.css";

function App() {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 5500);
  }, []);

  return (
    <div>
      {loading ? (
        <div className="preloader">
          <Player
            autoplay
            src={"/preloader.json"}
            style={{
              overflow: " clip !important",
              height: "50%",
              width: "50%",
            }}
          />
        </div>
      ) : (
        <div>
          <OtcBg />
          <GlobalStyles />
          <AnimatedRouter />
          <ToastContainer />
        </div>
      )}
    </div>
  );
}

export default App;
