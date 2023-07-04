import React from "react";
import { useNavigate } from "react-router-dom";

import saly from "assets/Saly-10.png";
import doodle1 from "assets/doodle-7.png";
import doodle2 from "assets/doodle-5.png";
import dog from "assets/Saly-18.png";
import personReadingBook from "assets/Saly-16.png";
import { ReactComponent as Logo } from "assets/full-logo-main.svg";

import "./Home.scss";

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="home-container-wrap">
      <header>
        <Logo className="logo" />
      </header>
      <section>
        <div className="backdrop" />
        <div className="left">
          <img className="doodle1" src={doodle1} alt="" />
          <img className="doodle2" src={doodle2} alt="" />
          <div className="headline-content">
            <h1>Start your journey with us.</h1>
            <p>
              Discover the world’s best platform for students and teachers to
              review and submit assignments.
            </p>
          </div>

          <button onClick={() => navigate("/login")}>Get Started</button>
        </div>
        <div className="right">
          <img src={saly} className="saly" alt="" />
          <img src={dog} className="dog" alt="" />
          <img src={personReadingBook} className="saly-16" alt="" />
        </div>
      </section>
    </div>
  );
};

export default Home;
