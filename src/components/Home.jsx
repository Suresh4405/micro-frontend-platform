import React from "react";
import CountUp from "react-countup";
import "./Home.css";

function Home() {
  return (
    <div className="home">

      <section className="hero">

        <h1>Welcome to Tech World</h1>

        <p>
          Explore technology, participate in developer events,
          listen to podcasts, watch tech videos and improve your
          programming skills with a growing developer community.
        </p>

      </section>

      <section className="platform">

        <div className="card">
          <h3>🎤 Tech Podcasts</h3>
          <p>
            Listen to discussions from experienced developers,
            startup founders and engineers about modern tech.
          </p>
        </div>

        <div className="card">
          <h3>📺 Tech Videos</h3>
          <p>
            Watch tutorials on React, Next.js, Node, Cloud,
            DevOps and full stack development.
          </p>
        </div>

        <div className="card">
          <h3>🚀 Upskill</h3>
          <p>
            Improve coding skills with guided learning
            paths and real world projects.
          </p>
        </div>

        <div className="card">
          <h3>💻 Codebase</h3>
          <p>
            Explore production-ready codebases,
            architecture examples and developer tools.
          </p>
        </div>

      </section>


      <section className="stats">

        <div className="stat">
          <h2>
            <CountUp end={10000} duration={3} separator="," />+
          </h2>
          <span>Developers</span>
        </div>

        <div className="stat">
          <h2>
            <CountUp end={120} duration={3} />+
          </h2>
          <span>Events Hosted</span>
        </div>

        <div className="stat">
          <h2>
            <CountUp end={350} duration={3} />+
          </h2>
          <span>Tech Videos</span>
        </div>

        <div className="stat">
          <h2>
            <CountUp end={80} duration={3} />+
          </h2>
          <span>Podcasts</span>
        </div>

      </section>

    </div>
  );
}

export default Home;