import AnimatedText from "@/components/AnimatedText";
import { createClient } from "@/lib/db";
import Image from "next/image";

async function Page() {
  const db = createClient();

  const { data } = await db.from("setttings").select();
  if (!data || (data && data.length == 0)) return null;
  const settings = data[0];

  return (
    <div className="h-full flex flex-row justify-center items-center bg-background">
      <Image
        className="w-full h-full opacity-75 object-contain hidden lg:block"
        src="https://utfs.io/f/RH21XHSrigMIaTDWfRscKvOy659WtGpnAxbXDzFmdflZ7kjS"
        alt=""
        width={100}
        height={200}
      />
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
          settings={settings}
        />
        <AnimatedText title="CONTACT" variant="variant2" settings={settings} />
        <AnimatedText title="LANGUAGE" variant="variant3" />
      </div>
    </div>
  );
}

export default Page;
