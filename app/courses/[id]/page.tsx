import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export const dynamic = "force-dynamic";

type Lesson = {
  id: number;
  title: string;
  description: string | null;
};

export default async function CoursePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  // CHECK STUDENT LOGIN
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Redirect to Login if not authenticated
  if (!user) {
    redirect("/login");
  }

  // GET COURSE INFORMATION
  const { data: course, error } = await supabase
    .from("courses")
    .select("id, title, description")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    return (
      <main className="wrap section">
        <h2>Something went wrong</h2>
        <p className="sub">Supabase error: {error.message}</p>
        <Link href="/courses" className="btn btn-navy">
          ← Back to Courses
        </Link>
      </main>
    );
  }

  if (!course) {
    notFound();
  }

  // GET COURSE LESSONS
  const { data: lessonData, error: lessonError } = await supabase
    .from("lessons")
    .select("id, title, description")
    .eq("course_id", id)
    .order("id", { ascending: true });

  const lessons = (lessonData ?? []) as Lesson[];

  // TEMPORARY PROGRESS
  const completed = 0;

  const pct = lessons.length
    ? Math.round((completed / lessons.length) * 100)
    : 0;

  return (
    <main className="wrap">
      <Link href="/courses" className="back">
    
      </Link>

      <section className="course-hero">
        <span className="pill">YOUR LEARNING JOURNEY</span>

        <h1>{course.title}</h1>

        <p>{course.description}</p>

        <div className="chips">
          <span>📚 {lessons.length} Lessons</span>
          <span>⏱ Beginner Level</span>
          <span>🎓 Self-Paced</span>
        </div>
      </section>

      <section className="section">
        <span className="eyebrow">Your next step</span>

        <h2>Course Lessons</h2>

        <p className="sub">
          Small steps today, better skills tomorrow.
        </p>

        {lessonError && (
          <p className="sub">
            Could not load lessons: {lessonError.message}
          </p>
        )}

        <div className="detail-grid">
          <div>
            {lessons.map((lesson, i) => (
              <div className="lesson" key={lesson.id}>
                <div className="lesson-num">
                  {String(i + 1).padStart(2, "0")}
                </div>

                <div className="lesson-body">
                  <small>
                    LESSON {String(i + 1).padStart(2, "0")}
                  </small>

                  <h3>{lesson.title}</h3>

                  <p>{lesson.description}</p>
                </div>

                <Link
                  href={`/courses/${id}/lessons/${lesson.id}`}
                  className="btn btn-gold btn-sm"
                >
                  Start →
                </Link>
              </div>
            ))}

            {lessons.length === 0 && !lessonError && (
              <p>No lessons yet. Check back soon!</p>
            )}
          </div>

          <aside className="side">
            <h3>🎯 Your Progress</h3>

            <div
              className="ring"
              style={{ ["--pct" as string]: pct }}
            >
              <span>{pct}%</span>
            </div>

            <div className="row">
              <span>Completed</span>
              <b>
                {completed} of {lessons.length}
              </b>
            </div>

            <div className="row">
              <span>Remaining</span>
              <b>{lessons.length - completed} lessons</b>
            </div>

            <div className="tip">
              💡 Keep going! Start with your first lesson and learn at your own pace.
            </div>

            <Link
              href="/courses"
              className="btn btn-gold"
              style={{
                width: "100%",
                justifyContent: "center",
              }}
            >
              Explore More Courses →
            </Link>
          </aside>
        </div>
      </section>
    </main>
  );
}