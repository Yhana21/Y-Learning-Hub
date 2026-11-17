
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import LogoutButton from "./LogoutButton";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const studentName =
    user.user_metadata?.full_name ||
    user.email?.split("@")[0] ||
    "Student";

  return (
    <main className="dashboard-page">
      <div className="dashboard-container">

        {/* HEADER */}
        <header className="dashboard-header">
          <Link href="/" className="dashboard-brand">
            Y-Learning Hub
          </Link>

          <LogoutButton />
        </header>

        {/* WELCOME SECTION */}
        <section className="dashboard-welcome">
          <div>
            <span className="dashboard-label">
              STUDENT DASHBOARD
            </span>

            <h1>Welcome, {studentName}! 👋</h1>

            <p>
              Continue learning and building your
              knowledge with Y-Learning Hub.
            </p>
          </div>

          <div className="dashboard-icon">
            🎓
          </div>
        </section>

        {/* LEARNING OVERVIEW */}
        <section className="dashboard-section">
          <h2>Your Learning Overview</h2>

          <p className="dashboard-subtitle">
            Here is your student account information.
          </p>

          <div className="dashboard-grid">

            <div className="dashboard-card">
              <span className="dashboard-card-icon">
                📚
              </span>

              <h3>Available Courses</h3>
              <p className="dashboard-number">3</p>
              <span>Courses to explore</span>
            </div>

            <div className="dashboard-card">
              <span className="dashboard-card-icon">
                📖
              </span>

              <h3>Learning Resources</h3>
              <p className="dashboard-number">15</p>
              <span>Lessons available</span>
            </div>

            <div className="dashboard-card">
              <span className="dashboard-card-icon">
                👤
              </span>

              <h3>Account Status</h3>
              <p className="dashboard-status">
                Active
              </p>
              <span>Logged-in student</span>
            </div>

          </div>
        </section>

        {/* STUDENT PROFILE */}
        <section className="dashboard-profile">
          <div>
            <span className="dashboard-label">
              STUDENT PROFILE
            </span>

            <h2>My Account</h2>

            <p>
              <strong>Name:</strong> {studentName}
            </p>

            <p>
              <strong>Email:</strong> {user.email}
            </p>
          </div>

          <Link
            href="/courses"
            className="dashboard-outline-button"
          >
            View My Courses →
          </Link>
        </section>

        {/* FOOTER */}
        <footer className="dashboard-footer">
          © 2026 Y-Learning Hub. Keep learning, keep growing!
        </footer>

      </div>
    </main>
  );
}
