import {Image} from '@shopify/hydrogen';
import {useEffect, useState} from 'react';
import clsx from 'clsx';

/**
 * A client component that defines a media gallery for hosting images, 3D models, and videos of products
 */

export function InProductsGallery({media, className, setStyleFunction}) {
  const [selectedImage, setSelectedImage] = useState(media[0]?.image);
  const [style, setStyle] = useState(null);

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

  return (
    <>
      <div className="h-screen w-screen">
        <div className="flex items-center lg:flex-col-reverse md:flex-row-reverse justify-center lg:gap-x-5 md:gap-y-5 h-full w-full">
          <div className="w-full flex flex-row items-center justify-center md:h-full">
            <div className="flex flex-row items-center justify-center bg-white pt-2 w-fit rounded lg:h-fit md:h-1/3 opacity-100 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] md:px-1.5">
              {media.map((med, i) => {
                const image =
                  med.__typename === 'MediaImage'
                    ? {...med.image, altText: med.alt || 'Product image'}
                    : null;

                return (
                  <div
                    className={
                      'border-solid border-lime-700 border-4 w-16 h-16 px-0.5 mx-2 rounded-lg'
                    }
                    style={
                      selectedImage.id === image.id ? style : {opacity: '0.3'}
                    }
                    key={image.id}
                  >
                    {image && (
                      <Image
                        data={image}
                        className={'object-cover w-100 h-100 rounded-lg'}
                        onClick={() => handleImageChange(image)}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="selected-image lg:w-1/2 col-span-3 lg:h-5/6 cursor-pointer md:w-full md:h-2/3">
            {selectedImage && (
              <>
                <Image
                  data={selectedImage || media[0].image}
                  className={'w-full h-full rounded-lg'}
                  onClick={() => setStyleFunction()}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
