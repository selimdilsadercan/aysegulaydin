import AnimatedText from "@/components/AnimatedText";
import settings from "@/data/settings";
import Image from "next/image";

function Page() {
  return (
    <div className="h-full flex flex-row justify-center items-center bg-background">
      <Image className="w-full h-full opacity-75 object-contain hidden lg:block" src={settings.main_page_image} alt="" width={100} height={200} />
      <div className="w-full h-fit flex flex-col justify-center items-start gap-0 p-12">
        <AnimatedText
          image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTsA0St40MR0eS9rDW10jLcuqgGB_KbAPuUQ&s"
          title="RECENT WORKS"
          href="/"
          variant="variant1"
        />
        <AnimatedText
          image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTsA0St40MR0eS9rDW10jLcuqgGB_KbAPuUQ&s"
          title="PHOTO"
          href="/photos"
          variant="variant1"
        />
        <AnimatedText
          image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTsA0St40MR0eS9rDW10jLcuqgGB_KbAPuUQ&s"
          title="VIDEO/AUDIO"
          href="/videos"
          variant="variant1"
        />
        <AnimatedText
          image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTsA0St40MR0eS9rDW10jLcuqgGB_KbAPuUQ&s"
          title="PERFORMANCE INSTALLATIONS"
          href="/"
          variant="variant1"
        />
        <AnimatedText
          image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTsA0St40MR0eS9rDW10jLcuqgGB_KbAPuUQ&s"
          title="PAINTING/SCULPTURE"
          href="/"
          variant="variant1"
        />
        <AnimatedText
          image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTsA0St40MR0eS9rDW10jLcuqgGB_KbAPuUQ&s"
          title="STATEMENT"
          href="/statement"
          variant="variant1"
        />
        <AnimatedText title="CONTACT" variant="variant2" />
        <AnimatedText title="LANGUAGE" variant="variant3" />
      </div>
    </div>
  );
}

export default Page;
