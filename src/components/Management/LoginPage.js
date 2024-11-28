import { useEffect, useState } from "react";
import usePageNavigation from "../../uesPageNavigation"; // Corrected import path
import "../../assets/sass/management/loginStyle.scss";
import Cookies from "js-cookie";

import { collection, getDocs, query, where } from "firebase/firestore";
import { dbTimeSheet } from "../../firebase";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function LoginPage() {
  const { navigateToPage } = usePageNavigation(); // Custom hook to navigate
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isShowPW, setIsShowPW] = useState(false);
  const [err, setErr] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [isAlreadySaved, setIsAlreadySaved] = useState(false);
  const [errCount, setErrCount] = useState(0);
  const [loginLock, setLoginLock] = useState(4);

  useEffect(() => {
    const now = new Date();
    const currentTime = now.getTime(); // Get time in milliseconds since epoch
    const loadLoginLock = JSON.parse(localStorage.getItem("gr6q94t2v3"));
    if (loadLoginLock) {
      const lockedDuration = currentTime - loadLoginLock.time; // Time difference in milliseconds
      if (lockedDuration > 1 * 60 * 1000) {
        // If more than 5 minutes
        localStorage.removeItem("gr6q94t2v3");
        const loadSavedInfo = JSON.parse(localStorage.getItem("cfxo6u7xp5"));
        if (loadSavedInfo !== null) {
          setIsAlreadySaved(true);
          setEmail(loadSavedInfo.userName);
          setPassword(loadSavedInfo.password);
        }
      } else {
        setErrCount(loadLoginLock.state);
      }
    }
  }, []);

  useEffect(() => {
    if (errCount === 5) {
      const now = new Date();
      const lockedTime = now.getTime(); // Time in milliseconds since epoch
      setErr("Too many attempts. Please try again in 5 minutes.");

      const loginLocked = {
        state: errCount,
        time: lockedTime, // Save exact time of lock
      };

      localStorage.setItem("gr6q94t2v3", JSON.stringify(loginLocked));
    }
  }, [errCount]);

  const generateRandomToken = (length) => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let token = "";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      token += characters[randomIndex];
    }

    return token;
  };

  const loginUserWithCookies = () => {
    // For example purposes, assume token is '12345abcde'
    Cookies.set("urs_login_token_key", generateRandomToken(32), {
      expires: 1,
      path: "/",
    });
  };

  const handleLogin = async (userEmail, userPassword) => {
    try {
      const userRef = collection(dbTimeSheet, "users");
      const roleQuery = query(
        userRef,
        where("userEmail", "==", userEmail),
        where("userPassword", "==", userPassword)
      );
      const querySnapshot = await getDocs(roleQuery);

      if (querySnapshot.empty) {
        setLoginLock(loginLock - 1);
        // If no user is found, handle the case where login credentials are incorrect
        setErr(`Incorrect email or password. ${loginLock} times left.`);
        setEmail("");
        setPassword("");
        setErrCount(errCount + 1);
        return;
      }

      if (isSaved) {
        const saveInfo = {
          userName: email,
          password: password,
        };
        localStorage.setItem("cfxo6u7xp5", JSON.stringify(saveInfo));
      }

      // Handle querySnapshot data here
      querySnapshot.forEach((doc) => {
        if (doc.data().role === "admin") {
          loginUserWithCookies();
          navigateToPage("/adminPage", {
            userId: doc.data().id,
            userName: doc.data().userName,
          });
        } else {
          loginUserWithCookies();
          navigateToPage("/staffPage", {
            userId: doc.data().id,
            userName: doc.data().userName,
          });
        }
      });
    } catch (error) {
      // Handle any errors that occur during the login process
      console.error("Error during login: ", error);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleLogin(email, password);
    }
  };

  return (
    <div className="login__container">
      <div className="login__headline">ccgloves</div>
      <div className="login__content">
        <div className="login__input">
          <div className="input__title">Username/Email</div>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="login__input">
          <div className="input__title">Password</div>
          <div className="input__group">
            <input
              type={isShowPW ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            {isShowPW ? (
              <div
                className="input__pw_controler"
                onClick={() => setIsShowPW(false)}
              >
                <FaEye />
              </div>
            ) : (
              <div
                className="input__pw_controler"
                onClick={() => setIsShowPW(true)}
              >
                <FaEyeSlash />
              </div>
            )}
          </div>
        </div>
        {err !== "" && <div className="login__error">{err}</div>}
        <div className="login__save" onClick={() => setIsSaved(!isSaved)}>
          <div
            className={`login__save_container ${
              isSaved ? "active" : "inactive"
            }`}
          ></div>
          <div className="login__save_value">Save your login</div>
        </div>
        <div className="login__btn_container">
          <div className="btn cancel" onClick={() => navigateToPage("/")}>
            back to home
          </div>
          {errCount === 5 ? (
            <></>
          ) : (
            <div
              className="btn login"
              onClick={() => handleLogin(email, password)}
            >
              login now
            </div>
          )}
        </div>
      </div>
      {isAlreadySaved && (
        <div className="manage__logout_alert">
          <div className="logout__alert">
            <div className="logout__alert_title">Do you want to login as</div>
            <div className="logout__alert_title">{email} ?</div>
            <div className="logout__alert_btn break">
              <div
                className="btn logout_cancel"
                onClick={() => {
                  setIsAlreadySaved(false);
                  setEmail("");
                  setPassword("");
                }}
              >
                Log in with other account
              </div>
              <div
                className="btn login"
                onClick={() => handleLogin(email, password)}
              >
                ok
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
