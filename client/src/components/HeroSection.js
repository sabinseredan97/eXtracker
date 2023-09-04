import video2 from "../videos/video-2.mp4";
import { Button } from "react-bootstrap";

export default function HeroSection(props) {
  return (
    <div className="heroContainer">
      <video src={video2} autoPlay loop muted />
      <h1 className="text-white mt-5">WELCOME TO eXtracker</h1>
      <p className="text-white mt-3">
        the best way to keep track of how where and when you spend your money
      </p>
      <div className="heroBtn">
        <Button variant="light" className="btn-lg" onClick={props.onClick}>
          GET STARTED
        </Button>
      </div>
    </div>
  );
}
