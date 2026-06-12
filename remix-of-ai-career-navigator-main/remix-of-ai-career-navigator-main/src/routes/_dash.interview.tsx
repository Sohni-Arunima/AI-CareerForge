import { createFileRoute } from "@tanstack/react-router";
import { MessagesSquare } from "lucide-react";
import { useWorkspace } from "../context/WorkspaceContext";
import { AnalysisShell } from "../components/AnalysisShell";
import { generateInterview } from "../services/api.js";
import { ResponsiveContainer, PieChart, Pie, Cell, RadialBarChart, RadialBar, Tooltip, Legend } from "recharts";

export const Route = createFileRoute("/_dash/interview")({
  head: () => ({ meta: [{ title: "Interview Prep · AI CareerForge" }] }),
  component: Interview,
});

function Interview() {
  const { workspace } = useWorkspace();
  return (
    <AnalysisShell
      title="Interview Prep"
      subtitle="Practice questions and model answers tailored to your target role."
      icon={MessagesSquare}
      resultKey="interview"
      buttonLabel="Generate Questions"
      run={() => generateInterview({ workspaceId: (workspace as any).id || "default" })}
      render={(data: any) => {
        const readiness = data?.interview_readiness ?? data?.readiness ?? null;
        const technical: any[] = Array.isArray(data?.technical_questions)
          ? data.technical_questions
          : Array.isArray(data?.technical)
          ? data.technical
          : [];
        const projectQ: any[] = Array.isArray(data?.project_questions)
          ? data.project_questions
          : Array.isArray(data?.project_questions_list)
          ? data.project_questions_list
          : [];
        const behavioral: any[] = Array.isArray(data?.weak_area_questions)
          ? data.weak_area_questions
          : Array.isArray(data?.behavioral_questions)
          ? data.behavioral_questions
          : [];
        const generic: any[] = Array.isArray(data?.questions) ? data.questions : [];

        const formatPct = (v: any) => (v === null || v === undefined || isNaN(Number(v)) ? "—" : `${Number(v).toFixed(1)}%`);

        const estimateDifficulty = (text: string) => {
          const t = (text || "").toLowerCase();
          if (t.includes("design") || t.includes("architecture") || t.includes("optimiz")) return "Hard";
          if (t.includes("explain") || t.includes("experience")) return "Medium";
          return "Easy";
        };

        const generateSampleAnswer = (text: string) => {
          if (!text) return "Start with a brief summary of your experience, then explain approach, outcome, and learnings.";
          const lower = text.toLowerCase();
          if (lower.includes("explain your experience with")) {
            const skill = text.split("with").pop() || "the technology";
            return `Briefly summarise your experience with ${skill.trim()}. Mention projects where you used it, key results, and one technical detail that demonstrates depth.`;
          }
          if (lower.includes("architecture") || lower.includes("project")) {
            return "Describe the system components, data flow, key trade-offs, and how you measured improvements. Use metrics where possible.";
          }
          return "Provide a concise structured answer: (1) context, (2) approach, (3) result, (4) lessons learned.";
        };

        const renderQuestion = (q: any, idx: number) => {
          const text = typeof q === "string" ? q : q.question || q.q || q.prompt || q.text;
          const answer = typeof q === "string" ? null : q.answer || q.a || q.model_answer || q.explanation;
          const difficulty = q?.difficulty || q?.level || q?.difficulty_level || estimateDifficulty(text || "");
          const tips = q?.tips || q?.hints || q?.advice || ["Start with a concise summary", "Highlight measurable impact", "Practice aloud and time your response"];
          return (
            <details
              key={idx}
              className="glass group rounded-2xl p-5 [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="flex cursor-pointer items-start gap-3">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-secondary text-xs">
                  Q{idx + 1}
                </span>
                <div className="min-w-0">
                  <div className="text-sm font-medium">{text}</div>
                  {difficulty && (
                    <div className="mt-1 flex gap-2 items-center">
                      <span className={`rounded-full px-2 py-0.5 text-xs ${difficulty === 'Hard' ? 'bg-rose-600/10 text-rose-300' : difficulty === 'Medium' ? 'bg-amber-600/10 text-amber-300' : 'bg-emerald-600/10 text-emerald-300'}`}>
                        {difficulty}
                      </span>
                      <div className="text-xs text-muted-foreground">Difficulty</div>
                    </div>
                  )}
                </div>
              </summary>
              <div className="mt-3 pl-10 text-sm text-muted-foreground">
                <div className="mb-2 font-semibold">Suggested answer</div>
                <div className="mb-2">{answer || generateSampleAnswer(text)}</div>
                {Array.isArray(tips) && tips.length > 0 && (
                  <div>
                    <div className="mb-1 text-xs font-semibold">Preparation Tips</div>
                    <ul className="list-disc pl-5 text-xs text-muted-foreground">
                      {tips.map((t: any, i: number) => <li key={i}>{typeof t === 'string' ? t : t.text || JSON.stringify(t)}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            </details>
          );
        };

        // distribution will use the enriched question sets below

        // Enrich questions client-side to provide more concrete prompts
        const skillScores = (workspace as any)?.skillResult?.skill_scores || {};
        const skillList = Array.isArray(Object.keys(skillScores)) && Object.keys(skillScores).length ? Object.keys(skillScores) : [];

        const extractSkillsFromTechnical = (arr: any[]): string[] => {
          const found: string[] = [];
          arr.forEach((q: any) => {
            const t = typeof q === 'string' ? q : q.question || q.q || q;
            const m = (t || "").match(/\b([A-Za-z+#]{2,})\b/g);
            if (m) found.push(...m.map((s: string) => s.toLowerCase()));
          });
          return Array.from(new Set(found)).slice(0, 8);
        };

        const derivedSkills = skillList.length ? skillList : extractSkillsFromTechnical(technical).slice(0, 6);

        const generatedTech: any[] = [];
        derivedSkills.forEach((sk: any) => {
          const name = typeof sk === 'string' ? sk : String(sk);
          generatedTech.push({ question: `Explain the core concepts of ${name}`, difficulty: 'Medium', answer: `Key concepts of ${name}: ...`, tips: ['Start with definitions', 'Give examples', 'Mention trade-offs'] });
          generatedTech.push({ question: `How would you use ${name} in a production system?`, difficulty: 'Hard', answer: `Productionise ${name}: ...`, tips: ['Mention deployment', 'Monitoring', 'Scaling'] });
          generatedTech.push({ question: `Design a small coding task to demonstrate ${name} skills.`, difficulty: 'Hard', answer: `Propose a coding exercise: ...`, tips: ['Focus on correctness and performance'] });
        });

        const generatedProject: any[] = [];
        generatedProject.push({ question: 'Explain your most significant project architecture and trade-offs', difficulty: 'Hard', answer: 'Describe components, data flow, and trade-offs.', tips: ['Show metrics', 'Explain choices'] });
        generatedProject.push({ question: 'How did you measure success and improve performance in your project?', difficulty: 'Medium', answer: 'Describe metrics (latency, accuracy) and improvements.', tips: ['Use concrete numbers'] });
        generatedProject.push({ question: 'How would you scale this system to handle 10x traffic?', difficulty: 'Hard', answer: 'Discuss autoscaling, caching, and partitioning.', tips: ['Mention monitoring and cost'] });

        const generatedBehavioral: any[] = [];
        generatedBehavioral.push({ question: 'Tell me about a time you overcame a major challenge at work.', difficulty: 'Medium', answer: 'Use STAR: Situation, Task, Action, Result.', tips: ['Be specific', 'Quantify impact'] });
        generatedBehavioral.push({ question: 'How do you handle disagreements on your team?', difficulty: 'Easy', answer: 'Describe communication, empathy, and compromise.', tips: ['Show collaboration examples'] });
        generatedBehavioral.push({ question: 'Describe a situation where you learned a new skill quickly.', difficulty: 'Easy', answer: 'Explain learning process and outcome.', tips: ['Highlight rapid adaptation'] });

        const allTechnical = [...technical, ...generatedTech].filter((q, i, arr) => arr.findIndex((x) => (typeof x === 'string' ? x : x.question) === (typeof q === 'string' ? q : q.question)) === i);
        const allProject = [...projectQ, ...generatedProject].filter((q, i, arr) => arr.findIndex((x) => (typeof x === 'string' ? x : x.question) === (typeof q === 'string' ? q : q.question)) === i);
        const allBehavioral = [...behavioral, ...generatedBehavioral].filter((q, i, arr) => arr.findIndex((x) => (typeof x === 'string' ? x : x.question) === (typeof q === 'string' ? q : q.question)) === i);

        const distDataCombined: { name: string; value: number; color?: string }[] = [
          { name: "Technical", value: allTechnical.length, color: "#06b6d4" },
          { name: "Project", value: allProject.length, color: "#7c3aed" },
          { name: "Behavioral", value: allBehavioral.length, color: "#fb7185" },
          { name: "Other", value: generic.length, color: "#f59e0b" },
        ];

        return (
          <div className="grid gap-5">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="glass rounded-2xl p-4 relative">
                <div className="text-xs uppercase tracking-widest text-muted-foreground">Interview Readiness</div>
                <div className="mt-3 h-36">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart innerRadius="80%" outerRadius="100%" data={[{ name: "readiness", value: Number(readiness ?? 0) }]} startAngle={180} endAngle={-180}>
                      <RadialBar dataKey="value" cornerRadius={10} fill="#06b6d4" />
                      <Tooltip formatter={(v: any) => `${Number(v).toFixed(1)}%`} />
                    </RadialBarChart>
                  </ResponsiveContainer>
                </div>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-center">
                    <div className="text-2xl font-semibold">{readiness === null ? "—" : `${Number(readiness).toFixed(1)}%`}</div>
                    <div className="text-xs text-muted-foreground">Readiness score</div>
                  </div>
                </div>
              </div>

              <div className="glass rounded-2xl p-4 sm:col-span-2">
                <div className="flex items-center justify-between">
                  <div className="text-xs uppercase tracking-widest text-muted-foreground">Question Distribution</div>
                </div>
                <div className="mt-3 h-36">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={distDataCombined} dataKey="value" nameKey="name" innerRadius={40} outerRadius={60} paddingAngle={4}>
                        {distDataCombined.map((entry: { name: string; value: number; color?: string }, idx: number) => (
                          <Cell key={`cell-${idx}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Legend verticalAlign="bottom" align="center" wrapperStyle={{ color: '#9CA3AF' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {allTechnical.length > 0 && (
              <div>
                <div className="text-sm font-semibold mb-3">Technical Questions</div>
                <div className="space-y-3">
                  {allTechnical.map((q: any, i: number) => renderQuestion(q, i))}
                </div>
              </div>
            )}

            {allProject.length > 0 && (
              <div>
                <div className="text-sm font-semibold mb-3">Project / System Design</div>
                <div className="space-y-3">{allProject.map((q: any, i: number) => renderQuestion(q, i))}</div>
              </div>
            )}

            {allBehavioral.length > 0 && (
              <div>
                <div className="text-sm font-semibold mb-3">Behavioral & HR</div>
                <div className="space-y-3">{allBehavioral.map((q: any, i: number) => renderQuestion(q, i))}</div>
              </div>
            )}

            {generic.length > 0 && (
              <div>
                <div className="text-sm font-semibold mb-3">Other Questions</div>
                <div className="space-y-3">{generic.map((q: any, i: number) => renderQuestion(q, i))}</div>
              </div>
            )}
          </div>
        );
      }}
    />
  );
}
