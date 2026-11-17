
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export const dynamic = "force-dynamic";

export default async function Home() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Automatically redirect visitors who are not logged in
  if (!user) {
    redirect("/login");
  }

  return (
    <main className="wrap">
      <section className="hero">
        <div>
          <span className="pill">
            WELCOME TO Y-LEARNING HUB
          </span>

          <h1>Learn. Grow. Succeed.</h1>

          <p>
            Explore our courses and discover new opportunities
            to improve your knowledge and skills.
          </p>

          <Link href="/dashboard" className="btn btn-navy">
            Go to Dashboard →
          </Link>
        </div>

        <div className="mock" aria-hidden="true">
          <i></i>
          <i></i>
          <i></i>
          <i></i>
        </div>
      </section>

      <div className="stats">
        <div className="stat">
          <b>3</b>
          <small>Courses available</small>
        </div>

        <div className="stat">
          <b>15+</b>
          <small>Self-paced lessons</small>
        </div>

        <div className="stat">
          <b>100%</b>
          <small>Beginner friendly</small>
        </div>
      </div>

      <section className="section" id="about">
        <div className="about">
          <div>
            <span className="eyebrow">About us</span>
            <h2>About Y-Learning Hub</h2>
          </div>

          <div>
            <p>
              Y-Learning Hub is a simple learning platform
              designed to help students explore different
              courses and learning opportunities.
            </p>

            <p style={{ marginTop: 12 }}>
              Our goal is to provide students with an easy
              and accessible way to discover educational
              resources and improve their knowledge
              and skills.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
