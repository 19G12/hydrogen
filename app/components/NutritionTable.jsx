import {motion, useAnimation} from 'framer-motion';
import {useInView} from 'react-intersection-observer';
import {useEffect} from 'react';

import {Section} from './Text';

const NutritionBox = ({source, Alt, del}) => {
  const control = useAnimation();
  const [ref, inView] = useInView();

  useEffect(() => {
    if (inView) {
      control.start('visible');
    }
  }, [control, inView]);

  return (
    <motion.div
      className="nutrition-table-class"
      ref={ref}
      animate={control}
      variants={{
        visible: {
          opacity: 1,
          scale: 1,
          transition: {duration: 1, delay: del},
        },
        hidden: {opacity: 0, scale: 0},
      }}
      initial="hidden"
    >
      <img src={source} alt={Alt} />
    </motion.div>
  );
};

export function NutritionTable({nutritionImages, nutritionBackground}) {
  return (
    <Section className="bg-white banner-wrap">
      <div className="title-of-banner">Nutrition Table and Ingredients</div>
      <div className="nutrition-main-image">
        <div
          className="nutrition-items"
          style={{
            backgroundImage: `url(${nutritionBackground?.reference?.image?.url})`,
          }}
        >
          {nutritionImages?.map((val, index) => {
            return (
              val && (
                <NutritionBox
                  del={index}
                  key={val?.reference?.image?.id}
                  source={val?.reference?.image?.url}
                  Alt={val?.reference?.image?.altText}
                />
              )
            );
          })}
        </div>
      </div>
    </Section>
  );
}
