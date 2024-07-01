import {Heading, ProductCard, Section} from '~/components';

const mockProducts = {
  nodes: new Array(12).fill(''),
};

export function ProductSwimlane({
  title = 'Featured Products',
  products = mockProducts,
  count = 12,
  ...props
}) {
  // Give a heading
  return (
    <div className="flex flex-col items-center justify-center ">
      <div className="title-of-banner p-3 w-screen bg-white">
        You might also like
      </div>
      <Section padding="y" {...props} className="banner-wrap">
        <div className="swimlane hiddenScroll md:pb-8 md:scroll-px-8 lg:scroll-px-12 md:px-8 lg:px-12">
          {products.nodes.map((product) => (
            <ProductCard
              product={product}
              key={product.id}
              className="snap-start w-80"
            />
          ))}
        </div>
      </Section>
    </div>
  );
}
