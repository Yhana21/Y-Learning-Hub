
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export const metadata = {
  title: "Courses | Y-Learning Hub",
};

export const dynamic = "force-dynamic";

type Course = {
  id: number;
  title: string;
  description: string;
};

const ICONS = ["💻", "🌐", "🗄️", "📘", "🚀", "🎨"];

export default async function CoursesPage() {
  const supabase = await createClient();

  // CHECK IF STUDENT IS LOGGED IN
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // REDIRECT TO LOGIN IF NOT AUTHENTICATED
  if (!user) {
    redirect("/login");
  }

  // GET COURSES FROM SUPABASE
  const { data, error } = await supabase
    .from("courses")
    .select("id, title, description")
    .order("id", { ascending: true });

  const courses = (data ?? []) as Course[];

  return (
    <main className="wrap">
      <section className="section">
        <span className="eyebrow">Our courses</span>

        <h2>Start learning today</h2>

        <p className="sub">
          Small steps today, better skills tomorrow.
        </p>

        {error && (
          <p>Could not load courses. Please try again later.</p>
        )}

        <div className="grid">
          {courses.map((course, i) => (
            <article className="card" key={course.id}>
              <div className="icon">
                {ICONS[i % ICONS.length]}
              </div>

              <h3>{course.title}</h3>

              <p>{course.description}</p>

              <div className="meta">
                <span>📚 Self-paced</span>
                <span>Beginner</span>
              </div>

              <Link
                href={`/courses/${course.id}`}
                className="link"
              >
                View Course →
              </Link>
            </article>
          ))}
        </div>

        {courses.length === 0 && !error && (
          <p>No courses available yet.</p>
        )}
      </section>
    </main>
  );
}
