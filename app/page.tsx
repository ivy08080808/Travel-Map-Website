import Hero from "@/components/Hero";
import TravelogueList from "@/components/TravelogueList";
import CommentBoard from "@/components/CommentBoard";

export default function Home() {
  return (
    <div>
      <Hero />
      <TravelogueList limit={6} />
      <CommentBoard />
    </div>
  );
}
