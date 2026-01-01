import Hero from "@/components/Hero";
import CommentBoard from "@/components/CommentBoard";
import HomeSections from "@/components/HomeSections";

export default function Home() {
  return (
    <div className="bg-[#F9FAFB] dark:bg-[#F9FAFB] min-h-screen">
      <Hero />
      <HomeSections />
      <div className="bg-[#F9FAFB] dark:bg-[#F9FAFB]">
        <CommentBoard />
      </div>
    </div>
  );
}
