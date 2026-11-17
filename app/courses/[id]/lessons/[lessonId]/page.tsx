import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import type { ReactNode } from "react";

export const dynamic = "force-dynamic";

type Lesson = {
  id: number;
  title: string;
  description: string | null;
  content: string | null;
};

function renderContent(content: string): ReactNode[] {
  const lines = content.split("\n");
  const result: ReactNode[] = [];

  let paragraph: string[] = [];
  let list: string[] = [];
  let code: string[] = [];
  let inCode = false;

  const flushParagraph = () => {
    if (paragraph.length > 0) {
      result.push(
        <p key={result.length}>
          {paragraph.join(" ")}
        </p>
      );
      paragraph = [];
    }
  };

  const flushList = () => {
    if (list.length > 0) {
      result.push(
        <ul key={result.length}>
          {list.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      );
      list = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // CODE BLOCKS
    if (line.startsWith("```")) {
      flushParagraph();
      flushList();

      if (inCode) {
        result.push(
          <pre className="lesson-code" key={result.length}>
            <code>{code.join("\n")}</code>
          </pre>
        );
        code = [];
      }

      inCode = !inCode;
      continue;
    }

    if (inCode) {
      code.push(lines[i]);
      continue;
    }

    // EMPTY LINES
    if (!line) {
      flushParagraph();
      flushList();
      continue;
    }

    // MARKDOWN TABLES
    if (line.startsWith("|")) {
      flushParagraph();
      flushList();

      const tableLines: string[] = [];

      while (
        i < lines.length &&
        lines[i].trim().startsWith("|")
      ) {
        tableLines.push(lines[i].trim());
        i++;
      }

      i--;

      const rows = tableLines
        .filter(
          (row) => !/^\|[\s:|-]+\|$/.test(row)
        )
        .map((row) =>
          row
            .split("|")
            .slice(1, -1)
            .map((cell) => cell.trim())
        );

      if (rows.length > 0) {
        result.push(
          <div
            className="lesson-table-wrap"
            key={result.length}
          >
            <table className="lesson-table">
              <thead>
                <tr>
                  {rows[0].map((cell, index) => (
                    <th key={index}>{cell}</th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {rows.slice(1).map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }

      continue;
    }

    // HEADINGS
    if (line.startsWith("## ")) {
      flushParagraph();
      flushList();

      result.push(
        <h2 key={result.length}>
          {line.slice(3)}
        </h2>
      );
      continue;
    }

    if (line.startsWith("# ")) {
      flushParagraph();
      flushList();

      result.push(
        <h2 key={result.length}>
          {line.slice(2)}
        </h2>
      );
      continue;
    }

    // BULLET LISTS
    if (line.startsWith("- ")) {
      flushParagraph();
      list.push(line.substring(2));
      continue;
    }

    flushList();
    paragraph.push(line);
  }

  flushParagraph();
  flushList();

  // UNCLOSED CODE BLOCK
  if (code.length > 0) {
    result.push(
      <pre className="lesson-code" key={result.length}>
        <code>{code.join("\n")}</code>
      </pre>
    );
  }

  return result;
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{
    id: string;
    lessonId: string;
  }>;
}) {
  const { id, lessonId } = await params;

  const supabase = await createClient();

  // CHECK STUDENT LOGIN
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // GET LESSON INFORMATION
  const { data: lesson, error } = await supabase
    .from("lessons")
    .select("id, title, description, content")
    .eq("id", lessonId)
    .eq("course_id", id)
    .maybeSingle();

  if (error) {
    return (
      <main className="wrap section">
        <h2>Something went wrong</h2>

        <p className="sub">{error.message}</p>

        <Link href={`/courses/${id}`} className="back">
          ← Back to Lessons
        </Link>
      </main>
    );
  }

  if (!lesson) {
    notFound();
  }

  const currentLesson = lesson as Lesson;

  return (
    <main className="wrap section lesson-page">

      {/* BACK LINK */}
      <Link
        href={`/courses/${id}`}
        className="back"
      >
        ← Back to Course Lessons
      </Link>

      {/* LESSON HEADER */}
      <section className="course-hero">
        <span className="pill">
          YOUR LEARNING JOURNEY
        </span>

        <h1>{currentLesson.title}</h1>

        {currentLesson.description && (
          <p>{currentLesson.description}</p>
        )}
      </section>

      {/* LESSON CONTENT */}
      <section className="section">
        <article className="lesson-content">
          {currentLesson.content ? (
            renderContent(currentLesson.content)
          ) : (
            <p>
              Lesson content is not available yet.
            </p>
          )}
        </article>
      </section>

    </main>
  );
}