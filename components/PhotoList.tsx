import { createClient } from "@/lib/db";
import Item from "./Item";
import ItemBig from "./ItemBig";

async function PhotoList() {
  const db = createClient();

  const { data } = await db.from("nodes").select().eq("type", "photo");
  if (!data || (data && data.length == 0)) return null;
  const photos = data;

  return (
    <>
      {photos.map((photo, index) => (
        <div className="group flex h-fit w-fit transition-all" key={index}>
          <Item className="block group-hover:hidden" key={index} src={photo.image_url || ""} title={photo.name || ""} description={photo.description || ""} />
          <ItemBig
            className="hidden group-hover:block"
            key={index}
            src={photo.image_url || ""}
            title={photo.name || ""}
            description={photo.description || ""}
          />
        </div>
      ))}
    </>
  );
}

export default PhotoList;
