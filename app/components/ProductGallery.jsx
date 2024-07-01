import {Image} from '@shopify/hydrogen';
import {useEffect, useState} from 'react';

/**
 * A client component that defines a media gallery for hosting images, 3D models, and videos of products
 */
export function ProductGallery({media, className}) {
  const [selectedImage, setSelectedImage] = useState(media[0]?.image);
  const [style, setStyle] = useState(null);
  const [translateStyle, setTranslateStyle] = useState({});

  useEffect(() => {
    if (media.length) {
      return setSelectedImage(media[0].image);
    }
  }, [media]);

  if (!media.length) {
    return null;
  }

  const handleImageChange = (image) => {
    setSelectedImage(image);
    setStyle({transform: 'scale(1.2)'});
  };

  function setOffsets(event) {
    const {left, top, width, height} = event.target.getBoundingClientRect();
    const x = ((event.pageX - left) / width) * 100;
    const y = ((event.pageY - top) / height) * 100;
    setTranslateStyle({transformOrigin: `${x + '% ' + y + '%'}`, scale: '1.6'});
  }
  return (
    <>
      <div className={`lg:w-full md:w-3/4 mx-auto`}>
        <div className="media-carousal grid grid-cols-4 gap-2 sm:mx-auto">
          <div className="image-list-scroll swimlane pt-2 sm:w-3/4 md:w-full">
            <div className="image-list">
              {media.map((med, i) => {
                const image =
                  med.__typename === 'MediaImage'
                    ? {...med.image, altText: med.alt || 'Product image'}
                    : null;

                return (
                  <div
                    className="image-listed m-2"
                    style={
                      selectedImage.id === image.id ? style : {opacity: '0.3'}
                    }
                    key={image.id}
                  >
                    {image && (
                      <Image
                        data={image}
                        className={'object-cover w-100 h-100 rounded-xl'}
                        onClick={() => handleImageChange(image)}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          <div
            onMouseMove={setOffsets}
            onMouseLeave={() => {
              setTranslateStyle({});
            }}
            className={`sm:w-3/4 sm:h-3/4 md:w-full px-0 col-span-3 md:h-full cursor-pointer overflow-hidden`}
          >
            {selectedImage && (
              <>
                <Image
                  id="zoom"
                  data={selectedImage || media[0].image}
                  className={`w-full h-full aspect-square fadeIn`}
                  style={translateStyle}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
