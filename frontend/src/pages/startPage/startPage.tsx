import { useState, useEffect } from "react";
import { GiDeer } from "react-icons/gi";
import LogIn from "../../components/login/login";
import SignUp from "../../components/signup/signup";
import ErrorInRequest from "../error/errorInRequest";
import "./start-page.css";
import useSendRequest from "../../hook/useSendRequest";
import SplitText from "../../components/split-text";
const URL = import.meta.env.VITE_BACKEND_URL as string;

function StartPage() {
  const [error, setError] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const { fetchAPIs, loading, catchErr } = useSendRequest();

  useEffect(() => {
    fetchAPIs("GET", `${URL}/isNotAuthenticated`);
  }, []);

  if (loading)
    return (
      <div className=" minute">
        <p className="loading">Loading...</p>
        <p className="loading-message">This might take a minute</p>
      </div>
    );
  if (catchErr || error) return <ErrorInRequest />;

  return (
    <div className="startPage-container">
      <GiDeer className="deer-icon" />
      <SplitText
        text="Welcome to deer"
        className="text-2xl font-semibold text-center"
        delay={100}
        duration={0.6}
        ease="power3.out"
        splitType="chars"
        from={{ opacity: 0, y: 40 }}
        to={{ opacity: 1, y: 0 }}
        threshold={0.1}
        rootMargin="-100px"
        textAlign="center"
        tag="h1"
      />
      <LogIn
        showLogin={showLogin}
        setShowLogin={setShowLogin}
        setError={setError}
      />
      <SignUp
        showLogin={showLogin}
        setShowLogin={setShowLogin}
        setError={setError}
      />
    </div>
  );
}

export default StartPage;
