import "./about.css";

function About() {
  return (
    <div className="about-page">

      <header className="about-header">
        <h1>Online Library</h1>

        <p>
          A community-focused online library designed to help people
          discover books, share ideas, and connect through knowledge.
        </p>
      </header>

      <main className="about-container">

        <section className="about-section">
          <h2>What is Online library?</h2>

          <p>
            This site is an online library and community platform
            created to make discovering and sharing knowledge easier.
          </p>

          <p>
            Users can explore different categories of books, search for
            learning resources, share posts, and interact with other
            members of the community.
          </p>
        </section>

        <section className="about-section">
          <h2>Our Mission</h2>

          <p>
            Our mission is to create a simple and accessible digital
            space where people can discover information, learn from
            others, and share useful ideas with their community.
          </p>
        </section>

        <section className="about-section">
          <h2>What You Can Do</h2>
        

          <div className="features">

            <div className="feature-card">
              <h3> Discover Books</h3>
              <p>
                Explore books across different categories and discover
                resources that match your interests.
              </p>
            </div>

            <div className="feature-card">
              <h3> Search</h3>
              <p>
                Search for books and quickly find resources that match
                your interests.
              </p>
            </div>

            <div className="feature-card">
              <h3> Share & Connect</h3>
              <p>
                Create posts, share ideas, and participate in meaningful
                conversations with other community members.
              </p>
            </div>

            <div className="feature-card">
              <h3> Learn</h3>
              <p>
                Access academic and educational resources that support
                continuous learning and personal development.
              </p>
            </div>

          </div>
        </section>

        <section className="about-section">
          <h2>Why online library</h2>

          <p>
            We believe that knowledge becomes more valuable when it is
            shared. CommunityHub brings books, learning resources, and
            community interaction together in one convenient platform.
          </p>

          <p>
            The platform was developed as a full-stack web application
            using modern web technologies and collaborative development
            practices.
          </p>
        </section>

      </main>

      <footer className="about-footer">
        <p>
          © 2026 CommunityHub. Built with passion for learning and community.
        </p>
      </footer>

    </div>
  );
}

export default About;