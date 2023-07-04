import React from "react";
import { Link } from "react-router-dom";

import { ReactComponent as Saly } from "assets/404.svg";

import "./PageNotFound.scss";

const PageNotFound = () => {
  return (
    <div className="page-not-found">
      <div id="wrap">
        {/* <div id="wordsearch">
          <ul>
            {["k", "v", "n", "z", "i", "x", "m", "e", "t", "a", "x", "l"]?.map(
              (letter) => (
                <li key={letter}>{letter}</li>
              )
            )}
            <li className="selected one">4</li>
            <li className="two selected">0</li>
            <li className="three selected">4</li>

            {["Y", "Y", "W", "V", "B", "O", "Q", "D", "Y", "P", "A"]?.map(
              (letter) => (
                <li key={letter}>{letter}</li>
              )
            )}

            <li className="four selected">p</li>
            <li className="five selected">a</li>
            <li className="six selected">g</li>
            <li className="seven selected">e</li>

            {["V", "J", "A"]?.map((letter) => (
              <li key={letter}>{letter}</li>
            ))}

            <li className="eight selected">n</li>

            <li className="nine selected">o</li>

            <li className="ten selected">t</li>

            {[
              "S",
              "C",
              "E",
              "W",
              "V",
              "X",
              "E",
              "P",
              "C",
              "F",
              "H",
              "Q",
              "E",
            ]?.map((letter) => (
              <li key={letter}>{letter}</li>
            ))}

            <li className="eleven selected">f</li>
            <li className="twelve selected">o</li>
            <li className="thirteen selected">u</li>
            <li className="fourteen selected">n</li>
            <li className="fifteen selected">d</li>

            {["S", "W", "Q", "V", "O", "S", "M", "V", "F", "U"]?.map(
              (letter) => (
                <li key={letter}>{letter}</li>
              )
            )}
          </ul>
        </div> */}

        <Saly />

        <div id="main-content">
          <h1>We couldn't find what you were looking for.</h1>
          <p>
            Unfortunately the page you were looking for could not be found. It
            may be temporarily unavailable, moved or no longer exist.
          </p>
          <p>
            Check the URL you entered for any mistakes and try again.
            Alternatively, search for whatever is missing or take a look around
            the rest of our site.
          </p>

          <div id="navigation">
            {[
              {
                title: "Home",
                path: "/",
              },
              {
                title: "Login",
                path: "/login",
              },
              {
                title: "Sigup",
                path: "/register",
              },
            ]?.map((route) => (
              <Link key={route?.title} to={route?.path} className="navigation">
                {route?.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;
