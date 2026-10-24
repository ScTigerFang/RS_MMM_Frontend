import { Link } from "react-router-dom";
import Icon from "./Icon";
import "../Styling/HomePage.css";

export default function HomePage() {
  return (
    <div
      className="homepage"
      style={{
        "--home-scene": "url(/image/6.jpg)",
        "--project-scene": "url(/image/4.jpg)",
      }}
    >
      <section className="home-hero" aria-labelledby="home-title">
        <div className="home-hero-art" aria-hidden="true" />
        <div className="home-hero-copy">
          <p className="eyebrow">
            <span className="small-diamond" /> Welcome to my corner of the
            internet
          </p>
          <h1 id="home-title">
            Developer by trade.
            <br />
            <span>Adventurer at heart.</span>
          </h1>
          <p className="home-intro">
            I'm Daniel Beals — a full stack developer, problem solver, and the
            player behind Tigerfang.
          </p>
          <div className="home-actions">
            <Link className="button button--gold" to="/resume">
              View my resume <Icon name="arrow" />
            </Link>
            <Link className="text-link" to="/rs_MMM">
              Explore RS MMM <Icon name="external" />
            </Link>
          </div>
        </div>
        <span className="hero-caption">
          <Icon name="rune" /> A familiar world. A new adventure.
        </span>
      </section>

      <section
        className="home-destinations"
        aria-labelledby="destinations-title"
      >
        <div className="home-section-heading">
          <div>
            <p className="eyebrow">Choose your path</p>
            <h2 id="destinations-title">A little work. A little play.</h2>
          </div>
          <p>Different quests. The same curiosity.</p>
        </div>
        <div className="home-cards">
          <Link
            to="/resume"
            className="destination-card destination-card--resume"
          >
            <div className="destination-top">
              <span className="destination-icon">
                <Icon name="document" />
              </span>
              <span className="destination-label">The professional side</span>
              <Icon name="external" />
            </div>
            <h3>Experience &amp; expertise.</h3>
            <p>
              Full stack development, cloud architecture, and the teams I've
              helped along the way.
            </p>
            <span className="destination-cta">
              Get to know my work <Icon name="arrow" />
            </span>
          </Link>
          <Link
            to="/rs_MMM"
            className="destination-card destination-card--game"
          >
            <div className="destination-top">
              <span className="destination-icon">
                <Icon name="coins" />
              </span>
              <span className="destination-label">RuneScape MMM</span>
              <Icon name="external" />
            </div>
            <h3>Make every hour count.</h3>
            <p>
              Find your next RuneScape money making method. Compare the profit,
              the skills, and the effort.
            </p>
            <span className="destination-cta">
              Open the method board <Icon name="arrow" />
            </span>
          </Link>
        </div>
      </section>
      <div className="home-toolkit">
        <span>My everyday toolkit</span>
        <ul>
          {["C#", ".NET", "React", "SQL", "Azure"].map((skill) => (
            <li key={skill}>{skill}</li>
          ))}
        </ul>
        <span className="home-toolkit-note">
          <Icon name="code" /> Building across the stack.
        </span>
      </div>
    </div>
  );
}
