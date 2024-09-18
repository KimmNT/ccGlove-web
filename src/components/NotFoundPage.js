import "../assets/sass/notFoundStyle.scss";
import usePageNavigation from "../uesPageNavigation"; // Corrected import path

function NotFoundPage() {
  const { navigateToPage } = usePageNavigation(); // Custom hook to navigate

  return (
    <div className="nf__container">
      <div className="nf__content">
        <div className="nf__headline">OOPS! :(</div>
        <div className="nf__headline">Something went wrong</div>
        <div className="nf__contact">
          <div className="nf__contact_title">
            Please contact us if you encounter any issues
          </div>
          <div className="nf__contact_item">Hotline: 012 345 6789</div>
          <div className="nf__contact_break">or</div>
          <div className="nf__contact_item">
            Email: ccgloves.ccsupport@gmail.com
          </div>
        </div>
        <div className="nf__back" onClick={() => navigateToPage("/")}>
          back to home
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;
