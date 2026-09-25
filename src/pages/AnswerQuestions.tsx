import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { QuestionCard, type FeaturedQuestion } from "../components/FeaturedQuestions";
import { useSetContentMaxWidth } from "../components/ContentMaxWidthContext";
import { Button } from "../components/Button";
import { ComposeModal } from "./Home";
import pic1 from "../assets/profile photos/pic-1.png";
import pic2 from "../assets/profile photos/pic-2.png";
import pic3 from "../assets/profile photos/pic-3.png";
import pic4 from "../assets/profile photos/pic-4.png";
import pic5 from "../assets/profile photos/pic-5.png";
import pic6 from "../assets/profile photos/pic-6.png";
import pic7 from "../assets/profile photos/pic-7.png";
import pic8 from "../assets/profile photos/pic-8.png";
import pic9 from "../assets/profile photos/pic-9.png";
import pic10 from "../assets/profile photos/pic-10.png";
import pic11 from "../assets/profile photos/pic-11.png";
import pic12 from "../assets/profile photos/pic-12.png";
import pic13 from "../assets/profile photos/pic-13.png";
import pic14 from "../assets/profile photos/pic-14.png";

// The full set of answerable questions shown in the "See all" grid.
const ALL_QUESTIONS: FeaturedQuestion[] = [
  { id: "aq1", asker: "Marcus W.", avatar: pic2, time: "2d", answered: 8, question: "How do I frame a career pivot from engineering to product in my MBA essays without sounding unfocused?" },
  { id: "aq2", asker: "Priya S.", avatar: pic4, time: "5h", answered: 12, question: "What's the best way to answer “why this bank” in a superday when I don't have a networking contact there?" },
  { id: "aq3", asker: "David C.", avatar: pic9, time: "1d", answered: 5, question: "For an APM interview, how much system design should I actually expect versus product sense?" },
  { id: "aq4", asker: "Nina K.", avatar: pic7, time: "3d", answered: 9, question: "How do I recover mid-case if I realize my framework is wrong halfway through the interview?" },
  { id: "aq5", asker: "James P.", avatar: pic13, time: "6h", answered: 3, question: "Is it worth keeping a 6-month contract role on my resume if it's not related to the roles I'm targeting?" },
  { id: "aq6", asker: "Sofia M.", avatar: pic11, time: "4h", answered: 6, question: "Does a strong addendum actually offset one bad semester on my transcript, or should I not draw attention to it?" },
  { id: "aq7", asker: "Ethan R.", avatar: pic1, time: "7h", answered: 4, question: "How technical should my PM portfolio be if I'm coming from a non-engineering background?" },
  { id: "aq8", asker: "Hannah W.", avatar: pic5, time: "1d", answered: 11, question: "What actually moves the needle in an MBA interview beyond just rehearsing my story?" },
  { id: "aq9", asker: "Daniel O.", avatar: pic8, time: "2d", answered: 7, question: "How do I explain a gap year in my application without it becoming the focus of the whole essay?" },
  { id: "aq10", asker: "Mia C.", avatar: pic6, time: "9h", answered: 2, question: "For consulting recruiting, is it better to master one case framework or be flexible across many?" },
  { id: "aq11", asker: "Alex T.", avatar: pic10, time: "3d", answered: 10, question: "How do I quantify impact on my resume when my work was mostly research with no clear metrics?" },
  { id: "aq12", asker: "Rachel B.", avatar: pic12, time: "5h", answered: 6, question: "Should I retake the GMAT for a 20-point bump, or is my time better spent on essays at this point?" },
  { id: "aq13", asker: "Omar F.", avatar: pic14, time: "1d", answered: 5, question: "What's a realistic way to network into tech PM roles when I don't have any warm connections?" },
  { id: "aq14", asker: "Grace L.", avatar: pic3, time: "8h", answered: 8, question: "How do I decide between a deferred MBA program now versus applying with a few years of experience?" },
  { id: "aq15", asker: "Tomás V.", avatar: pic9, time: "2d", answered: 3, question: "In a behavioral interview, how do I answer “tell me about a failure” without it hurting me?" },
];

export default function AnswerQuestions() {
  useSetContentMaxWidth(1080);
  const navigate = useNavigate();
  const [answerTarget, setAnswerTarget] = useState<FeaturedQuestion | null>(null);

  useEffect(() => {
    document.title = "Leland Prototype | Answer a question";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      {/* Header — back + title, sits above the grid like the other full views. */}
      <div className="mb-5 flex items-start gap-3 px-1">
        <Button
          size="lg"
          variant="secondary"
          iconOnly
          onClick={() => navigate(-1)}
          aria-label="Back"
          className="shrink-0"
        >
          <svg className="h-[22px] w-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5" /><path d="M12 19l-7-7 7-7" />
          </svg>
        </Button>
        <div className="min-w-0">
          <h1 className="text-[24px] font-semibold leading-tight text-gray-dark md:text-[30px]">Answer a question</h1>
          <p className="mt-1 text-[15px] text-gray-light">Questions from members you're a great fit to answer.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {ALL_QUESTIONS.map((q) => (
          <QuestionCard key={q.id} q={q} variant="grid" onAnswer={() => setAnswerTarget(q)} />
        ))}
      </div>

      {answerTarget ? (
        <ComposeModal
          answerQuestion={{ asker: answerTarget.asker, avatar: answerTarget.avatar, time: answerTarget.time, question: answerTarget.question }}
          onClose={() => setAnswerTarget(null)}
          onPost={() => {}}
        />
      ) : null}
    </div>
  );
}
