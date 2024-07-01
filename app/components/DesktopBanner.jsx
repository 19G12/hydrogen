import {motion, useAnimation} from 'framer-motion';
import {useInView} from 'react-intersection-observer';
import {useEffect} from 'react';

import {Section} from './Text';

const bannerVariant = {
  end: {opacity: 1, scale: 1, transition: {duration: 1.5}},
  start: {opacity: 0.3, scale: 0.2},
};

const Nodes = ({source, classes}) => {
  const control = useAnimation();
  const [ref, inView] = useInView();

  useEffect(() => {
    if (inView) {
      control.start('end');
    }
  }, [control, inView]);

  return (
    <motion.img
      src={source}
      alt="desktopImage"
      variants={bannerVariant}
      ref={ref}
      initial="start"
      animate={control}
      className={classes}
    />
  );
};

export function DesktopBanner({desktopNodes, mobileNodes}) {
  return (
    <Section style={{padding: '0'}}>
      <div>
        {desktopNodes &&
          desktopNodes?.map((val, ind) => {
            return (
              <Nodes
                key={val?.id}
                source={val?.image.url}
                classes={'hidden md:flex w-full h-full'}
              />
            );
          })}
      </div>

      <div>
        {mobileNodes &&
          mobileNodes?.map((val, ind) => {
            return (
              <Nodes
                key={val?.id}
                source={val?.image.url}
                classes={'flex md:hidden w-full h-full'}
              />
            );
          })}
      </div>
    </Section>
  );
}
