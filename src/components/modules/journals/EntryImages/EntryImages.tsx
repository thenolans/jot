import { useState } from "react";
import Lightbox from "react-image-lightbox";

type Props = {
  images: string[];
};

export default function EntryImages({ images }: Props) {
  const [lighboxIndex, setLightboxIndex] = useState(0);
  const [lightboxIsOpen, setLightboxIsOpen] = useState(false);

  return (
    <div>
      <div className="space-x-2">
        {images.map((img, index) => (
          <button
            onClick={() => {
              setLightboxIndex(index);
              setLightboxIsOpen(true);
            }}
            key={img}
          >
            <img
              className="w-16 h-16 rounded-lg object-cover"
              src={img}
              alt=""
            />
          </button>
        ))}
      </div>
      {lightboxIsOpen && (
        <Lightbox
          mainSrc={images[lighboxIndex]}
          nextSrc={images[(lighboxIndex + 1) % images.length]}
          prevSrc={images[(lighboxIndex + images.length - 1) % images.length]}
          onCloseRequest={() => setLightboxIsOpen(false)}
          onMovePrevRequest={() =>
            setLightboxIndex((lighboxIndex + images.length - 1) % images.length)
          }
          onMoveNextRequest={() =>
            setLightboxIndex((lighboxIndex + 1) % images.length)
          }
          enableZoom={false}
        />
      )}
    </div>
  );
}
