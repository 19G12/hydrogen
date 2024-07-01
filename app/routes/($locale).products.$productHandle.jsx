/* eslint-disable array-callback-return */
/** @jest-environment jsdom */

import React, {
  useRef,
  Suspense,
  useMemo,
  useState,
  createRef,
  useEffect,
} from 'react';
import {Disclosure, Listbox} from '@headlessui/react';
import {defer} from '@shopify/remix-oxygen';
import {
  useLoaderData,
  Await,
  useSearchParams,
  useLocation,
  useNavigation,
} from '@remix-run/react';
import {AnalyticsPageType, Money, ShopPayButton} from '@shopify/hydrogen';
import invariant from 'tiny-invariant';
import clsx from 'clsx';
import {disableBodyScroll, enableBodyScroll} from 'body-scroll-lock';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCartShopping} from '@fortawesome/free-solid-svg-icons';
import {motion, useScroll} from 'framer-motion';

import {
  Heading,
  IconCaret,
  IconCheck,
  IconClose,
  ProductGallery,
  ProductSwimlane,
  Section,
  Skeleton,
  Text,
  Link,
  AddToCartButton,
  Button,
  DesktopBanner,
  BenifitsOfProducts,
  StepsToUse,
  RecommendedValues,
  WhoShouldConsume,
  EachServing,
  SeeResults,
  NutritionTable,
  ProductsOptions,
  InProductsGallery,
} from '~/components';
import {getExcerpt} from '~/lib/utils';
import {seoPayload} from '~/lib/seo.server';
import {MEDIA_FRAGMENT, PRODUCT_CARD_FRAGMENT} from '~/data/fragments';
import {routeHeaders} from '~/data/cache';

export const headers = routeHeaders;

export async function loader({params, request, context}) {
  const {productHandle} = params;
  console.log(params, '_params_');
  invariant(productHandle, 'Missing productHandle param, check route filename');

  const searchParams = new URL(request.url).searchParams;
  const selectedOptions = [];
  searchParams.forEach((value, name) => {
    selectedOptions.push({name, value});
  });

  const {shop, product} = await context.storefront.query(PRODUCT_QUERY, {
    variables: {
      handle: productHandle,
      selectedOptions,
      country: context.storefront.i18n.country,
      language: context.storefront.i18n.language,
    },
  });
  if (!product?.id) {
    throw new Response('product', {status: 404});
  }
  const recommended = getRecommendedProducts(context.storefront, product.id);
  const firstVariant = product.variants.nodes[0];
  const selectedVariant = product.selectedVariant ?? firstVariant;
  const productAnalytics = {
    productGid: product.id,
    variantGid: selectedVariant.id,
    name: product.title,
    variantName: selectedVariant.title,
    brand: product.vendor,
    price: selectedVariant.price.amount,
  };

  const seo = seoPayload.product({
    product,
    selectedVariant,
    url: request.url,
  });

  return defer({
    product,
    shop,
    storeDomain: shop.primaryDomain.url,
    recommended,
    analytics: {
      pageType: AnalyticsPageType.product,
      resourceId: product.id,
      products: [productAnalytics],
      totalValue: parseFloat(selectedVariant.price.amount),
    },
    seo,
  });
}

export default function Product() {
  const {product, shop, recommended} = useLoaderData();
  const {
    media,
    faqs,
    title,
    step1,
    step2,
    step3,
    vendor,
    step1img,
    step2img,
    step3img,
    seeResults,
    mobileBanner,
    desktopBanner,
    descriptionHtml,
    whoShouldConsume,
    benifitsOfProduct,
    nutritionBackground,
    recommendedUsageLong,
    eachServingOtherFood,
    recommendedUsageShort,
    recommendedUsageImage,
    nutritionAndIngredients1Img,
    nutritionAndIngredients2Img,
    selectedVariant,
  } = product;

  //Dynamic faq rendering
  // const faq = JSON.parse(faqs.value);

  const {shippingPolicy, refundPolicy} = shop;
  const desktopNodes = desktopBanner?.references?.nodes;
  const mobileNodes = mobileBanner?.references?.nodes;
  const recommendedValues = {
    short: recommendedUsageShort?.value,
    long: recommendedUsageLong?.value,
    image: recommendedUsageImage?.reference?.image?.url,
    alt: recommendedUsageImage?.reference?.image?.altText,
  };
  const filter = selectedVariant?.image?.altText;
  const filtered_img_array = media?.nodes?.filter((elem) => {
    if (!filter) {
      return elem.alt === media?.nodes[0]?.alt;
    } else {
      return elem.alt === filter;
    }
  });

  const nutritionImages = [
    nutritionAndIngredients1Img,
    nutritionAndIngredients2Img,
  ];

  const stepsToUse = [
    {step: step1?.value, image: step1img?.reference?.image?.url},
    {step: step2?.value, image: step2img?.reference?.image?.url},
    {step: step3?.value, image: step3img?.reference?.image?.url},
  ];

  const Use = [];

  stepsToUse.map((val, ind) => {
    let obj = {};
    Object.keys(val).map((key) => {
      if (val[key]) {
        obj[key] = val[key];
      } else {
        obj = {};
      }
    });
    if (Object.keys(obj).length) {
      Use.push(obj);
    }
  });

  const faq = [
    {
      que: ' Can I drink whey protein every day?',
      ans: ' Yes, Whey protein can be taken every day without any issues as long as it satisfies all your protein requirements for a day.Ensure to have sufficient water throughout the day.&nbsp;',
    },
    {
      que: ' Can I drink whey protein every day?',
      ans: ' Yes, Whey protein can be taken every day without any issues as long as it satisfies all your protein requirements for a day.Ensure to have sufficient water throughout the day.&nbsp;',
    },
    {
      que: ' Can I drink whey protein every day?',
      ans: ' Yes, Whey protein can be taken every day without any issues as long as it satisfies all your protein requirements for a day.Ensure to have sufficient water throughout the day.&nbsp;',
    },
  ];

  return (
    <>
      <Section className="px-0 md:px-8 lg:px-12 relative bg-white text-black">
        <div
          className={
            'relative grid items-start md:gap-4 lg:gap-10 lg:grid-cols-2'
          }
        >
          <ProductGallery
            media={
              (filtered_img_array.length && filtered_img_array) || media.nodes
            }
            className="w-full lg:col-span-2"
          />
          <div className="sticky md:-mb-nav md:top-nav md:-translate-y-nav md:h-screen md:pt-nav hiddenScroll md:overflow-y-scroll">
            <section className="flex flex-col w-full p-6">
              <div className="grid gap-1">
                <Heading as="h1" className="whitespace-normal text-xl">
                  {title}
                  {/* {selectedVariant} */}
                </Heading>
                {descriptionHtml && (
                  <>
                    <ProductDescription
                      title="Product Details"
                      content={descriptionHtml}
                    />
                  </>
                )}
                {/* {vendor && (
                  <Text className={"opacity-50 font-medium"}>
                    Seller info. {vendor}
                  </Text>
                )} */}
              </div>
              <ProductForm />
            </section>
          </div>
        </div>
        {/* <div
          className={clsx(
            !modalStyle && 'hidden',
            'sm:invisible md:visible',
            'w-full fixed h-full m-auto backdrop-opacity-5 backdrop-sepia-0 backdrop-blur-2xl z-50 top-0 left-0',
          )}
        >
          <InProductsGallery
            media={
              (filtered_img_array.length && filtered_img_array) || media.nodes
            }
            setStyleFunction={callSetStyle}
            className="w-full lg:col-span-2"
          />
        </div> */}
      </Section>

      <Section className="px-0 md:px-4 lg:px-4 w-screen relative bg-white text-black pb-0">
        {desktopNodes && mobileNodes && (
          <DesktopBanner
            desktopNodes={desktopNodes}
            mobileNodes={mobileNodes}
          ></DesktopBanner>
        )}
      </Section>

      {benifitsOfProduct && (
        <BenifitsOfProducts
          benifitsOfProduct={benifitsOfProduct}
        ></BenifitsOfProducts>
      )}

      {Use.length > 0 && <StepsToUse stepsToUse={stepsToUse}></StepsToUse>}

      {recommendedValues?.short &&
        recommendedValues?.long &&
        recommendedValues?.image && (
          <RecommendedValues
            recommendedValues={recommendedValues}
          ></RecommendedValues>
        )}

      {whoShouldConsume?.value && (
        <WhoShouldConsume
          whoShouldConsume={whoShouldConsume}
        ></WhoShouldConsume>
      )}

      {eachServingOtherFood && (
        <EachServing eachServingOtherFood={eachServingOtherFood}></EachServing>
      )}

      {seeResults && <SeeResults seeResults={seeResults}></SeeResults>}

      {nutritionImages.every((elem) => elem === null) ? (
        <></>
      ) : (
        <NutritionTable
          nutritionImages={nutritionImages}
          nutritionBackground={nutritionBackground}
        ></NutritionTable>
      )}

      <Section className="banner-wrap">
        {Array.isArray(faq) && faq?.length > 0 && (
          <div className="faq-item">
            <div className="title-of-banner p-3">
              {' '}
              Frequently asked Questions{' '}
            </div>

            {faq?.map((f, i) => {
              return <ProductDetail title={f?.que} content={f?.ans} key={i} />;
            })}
          </div>
        )}
        <div className="infoSection">
          <div className="input">
            <div className="spacing">
              <strong>* Marketed By: </strong> <br />
              BodyFirst Wellness Nutrition Private Limited <br />
              <span style={{color: 'black'}}>
                220, Udyog Bhavan, Sonawala Lane, Goregaon (East),{' '}
              </span>
              <span>Mumbai, Maharashtra - 400063</span> <br />
              FSSAI Lic. No.:{' '}
              <span style={{color: 'blueviolet'}}>10019022009712</span> <br />
            </div>

            <div className="spacing">
              <strong>* Manufactured by: </strong>
              <br />
              Gangwal Healthcare Pvt. Ltd.
              <br />
              <span style={{color: 'black'}}>
                Plot No. T1, MIDC Tarapur, Palghar Zone 1, <br />
                Maharashtra-
                <span style={{color: 'blueviolet'}}>401506</span>, India.
              </span>
              <br />
              <span>
                FSSAI Lic. no.
                <span style={{color: 'blueviolet'}}>10018022008202</span>{' '}
              </span>
            </div>
          </div>
          <div className="input">
            <div className="spacing">
              <h6 style={{margin: '0'}}>Customer care details</h6>
              Customer care contact:{' '}
              <span className="contact">+91 86579 23196</span> <br />
              <span>Email id: </span>
              <a className="anckor" href="#">
                support@bodyfirst.in
              </a>{' '}
              <br />
            </div>
            <div className="spacing">
              <h6 style={{margin: '0'}}>Country of Origin</h6>

              <span className="india">
                <strong>India</strong>
              </span>
            </div>
          </div>
        </div>
      </Section>

      <Suspense fallback={<Skeleton className="h-32" />}>
        <Await
          errorElement="There was a problem loading related products"
          resolve={recommended}
        >
          {(products) => (
            <ProductSwimlane title="Related Products" products={products} />
          )}
        </Await>
      </Suspense>
    </>
  );
}

//-working area
export function ProductForm() {
  const {product, analytics, storeDomain} = useLoaderData();
  const [currentSearchParams] = useSearchParams();
  const {location} = useNavigation();
  const [cart, setCart] = useState(1);

  /**
   * We update `searchParams` with in-flight request data from `location` (if available)
   * to create an optimistic UI, e.g. check the product option before the
   * request has completed.
   */
  const searchParams = useMemo(() => {
    return location
      ? new URLSearchParams(location.search)
      : currentSearchParams;
  }, [currentSearchParams, location]);

  const firstVariant = product.variants.nodes[0];

  /**
   * We're making an explicit choice here to display the product options
   * UI with a default variant, rather than wait for the user to select
   * options first. Developers are welcome to opt-out of this behavior.
   * By default, the first variant's options are used.
   */
  const searchParamsWithDefaults = useMemo(() => {
    const clonedParams = new URLSearchParams(searchParams);
    for (const {name, value} of firstVariant.selectedOptions) {
      if (!searchParams.has(name)) {
        clonedParams.set(name, value);
      }
    }
    return clonedParams;
  }, [searchParams, firstVariant.selectedOptions]);

  /**
   * Likewise, we're defaulting to the first variant for purposes
   * of add to cart if there is none returned from the loader.
   * A developer can opt out of this, too.
   */
  const selectedVariant = product.selectedVariant ?? firstVariant;

  const isOutOfStock = !selectedVariant?.availableForSale;

  const isOnSale =
    selectedVariant?.price?.amount &&
    selectedVariant?.compareAtPrice?.amount &&
    Number(selectedVariant?.price?.amount) <
      Number(selectedVariant?.compareAtPrice?.amount);

  const productAnalytics = {
    ...analytics.products[0],
    quantity: 1,
  };

  const selectedOptions = product?.selectedVariant?.selectedOptions;

  return (
    <div className="grid gap-10 pt-6">
      <div className="grid gap-4 ">
        <ProductOptions
          options={product.options}
          searchParamsWithDefaults={searchParamsWithDefaults}
          selected={selectedOptions}
        />
        {/* useState() for selected Options 
        <ProductsOptions
          options={product.options}
          searchParamsWithDefaults={searchParamsWithDefaults}
        /> */}
        {selectedVariant && (
          <div className="grid items-stretch gap-4">
            {/* {isOutOfStock ? (
              <Button variant="secondary" disabled>
                <Text>Notify Me</Text>
              </Button>
            ) :  */}

            <Heading>
              <div className="prices-div">
                <div className="prices-space">
                  <span className="prices-span">MRP: </span>
                  <Money
                    withoutTrailingZeros
                    data={selectedVariant?.price}
                    as="span"
                    className="prices-span"
                  />
                </div>
                {isOnSale && (
                  <div className="prices-space">
                    <span className="prices-span compare-at">Price: </span>
                    <Money
                      withoutTrailingZeros
                      data={selectedVariant?.compareAtPrice}
                      as="span"
                      className="opacity-50 strike mx-1 prices-span"
                    />
                  </div>
                )}
              </div>
            </Heading>

            {isOutOfStock && (
              <Button variant="secondary" disabled>
                <Text>Notify Me</Text>
              </Button>
            )}

            {!isOutOfStock && (
              <div className="flex flex-row justify-evenly w-full items-center">
                <div className="inline-flex w-1/3">
                  <button
                    onClick={() => {
                      if (cart > 1) {
                        setCart(cart - 1);
                      }
                    }}
                    className="w-2/12 font-bold px-5 text-indigo-100 transition-colors duration-150 bg-indigo-700 rounded-l-full focus:shadow-outline hover:bg-indigo-800"
                  >
                    -
                  </button>
                  <div className="h-10 px-1 text-indigo-100 transition-colors duration-150 bg-indigo-700 focus:shadow-outline hover:bg-indigo-800 w-2/3">
                    <div className="flex flex-row justify-evenly items-center flex-wrap w-full h-full">
                      <div className="w-1/3">
                        <FontAwesomeIcon
                          icon={faCartShopping}
                          style={{color: '#f2f2f3'}}
                        />
                      </div>
                      <div className="w-2/12 text-center relative">{cart}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setCart(cart + 1);
                    }}
                    className="w-2/12 font-bold px-5 text-indigo-100 transition-colors duration-150 bg-indigo-700 rounded-r-full focus:shadow-outline hover:bg-indigo-800"
                  >
                    +
                  </button>
                </div>

                <AddToCartButton
                  lines={[
                    {
                      merchandiseId: selectedVariant.id,
                      quantity: cart,
                    },
                  ]}
                  variant="secondary"
                  data-test="add-to-cart"
                  analytics={{
                    products: [productAnalytics],
                    totalValue: parseFloat(productAnalytics.price),
                  }}
                  className="rounded-full"
                >
                  <Text
                    as="span"
                    className="flex items-center justify-center gap-2"
                  >
                    <span>Add to Cart</span>
                  </Text>
                </AddToCartButton>
              </div>
            )}

            {!isOutOfStock && (
              <ShopPayButton
                width="100%"
                variantIds={[selectedVariant?.id]}
                storeDomain={storeDomain}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function ProductOptions({options, searchParamsWithDefaults, selected}) {
  const closeRef = useRef(null);
  return (
    <>
      {options
        .filter((option) => option.values.length > 1)
        .map((option, ind) => (
          <div
            key={option.name}
            className="flex flex-col flex-wrap last:mb-0 group "
          >
            <Heading
              as="legend"
              size="lead"
              className="min-w-[4rem] p-2 w-full
              cursor-pointer"
            >
              {option.name} : {selected?.length && selected[ind]?.value}
            </Heading>
            <div className="flex flex-wrap items-baseline gap-4 mt-1.5">
              {/**
               * First, we render a bunch of <Link> elements for each option value.
               * When the user clicks one of these buttons, it will hit the loader
               * to get the new data.
               *
               * If there are more than 7 values, we render a dropdown.
               * Otherwise, we just render plain links.
               */}
              {option.values.length > 7 ? (
                <div className="relative w-full">
                  <Listbox>
                    {({open}) => (
                      <>
                        <Listbox.Button
                          ref={closeRef}
                          className={clsx(
                            'flex items-center justify-between w-full py-3 px-4 border border-primary',
                            open
                              ? 'rounded-b md:rounded-t md:rounded-b-none'
                              : 'rounded',
                          )}
                        >
                          <span>
                            {searchParamsWithDefaults.get(option.name)}
                          </span>
                          <IconCaret direction={open ? 'up' : 'down'} />
                        </Listbox.Button>
                        <Listbox.Options
                          className={clsx(
                            ' border-primary bg-contrast absolute bottom-12 z-30 grid h-48 w-full overflow-y-scroll rounded-t border px-2 py-2 transition-[max-height] duration-150 sm:bottom-auto md:rounded-b md:rounded-t-none md:border-t-0 md:border-b',
                            open ? 'max-h-48' : 'max-h-0',
                          )}
                        >
                          {option.values.map((value) => (
                            <Listbox.Option
                              key={`option-${option.name}-${value}`}
                              value={value}
                            >
                              {({active}) => (
                                <ProductOptionLink
                                  optionName={option.name}
                                  optionValue={value}
                                  className={clsx(
                                    'text-primary w-full p-2 transition rounded flex justify-start items-center text-left cursor-pointer',
                                    active && 'bg-primary/10',
                                  )}
                                  searchParams={searchParamsWithDefaults}
                                  onClick={() => {
                                    if (!closeRef?.current) return;
                                    closeRef.current.click();
                                  }}
                                >
                                  {value}
                                  {searchParamsWithDefaults.get(option.name) ===
                                    value && (
                                    <span className="ml-2">
                                      <IconCheck />
                                    </span>
                                  )}
                                </ProductOptionLink>
                              )}
                            </Listbox.Option>
                          ))}
                        </Listbox.Options>
                      </>
                    )}
                  </Listbox>
                </div>
              ) : (
                <>
                  {option.values.map((value, ind) => {
                    const checked =
                      searchParamsWithDefaults.get(option.name) === value;
                    const id = `option-${option.name}-${value}`;
                    return (
                      <Text key={id} className="mt-2.5">
                        <ProductOptionLink
                          optionName={option.name}
                          optionValue={value}
                          searchParams={searchParamsWithDefaults}
                          className="p-3 border-solid rounded-2xl border-green-700 border-2 cursor-pointer transition-all duration-200"
                        />
                      </Text>
                    );
                  })}
                </>
              )}
            </div>
          </div>
        ))}
    </>
  );
}

function ProductOptionLink({
  optionName,
  optionValue,
  searchParams,
  children,
  indexOf,
  ...props
}) {
  const {pathname} = useLocation();
  const isLocalePathname = /\/[a-zA-Z]{2}-[a-zA-Z]{2}\//g.test(pathname);
  // fixes internalized pathname
  const path = isLocalePathname
    ? `/${pathname.split('/').slice(2).join('/')}`
    : pathname;

  const clonedSearchParams = new URLSearchParams(searchParams);
  clonedSearchParams.set(optionName, optionValue);
  return (
    <Link
      {...props}
      preventScrollReset
      prefetch="intent"
      replace
      to={`${path}?${clonedSearchParams.toString()}`}
    >
      {children ?? optionValue}
    </Link>
  );
}

function ProductDescription({title, content, learnMore}) {
  const usps_prduct = [
    {
      title: 'Improves Bone health',
      icon: 'https://cdn.shopify.com/s/files/1/0700/5339/6764/files/Bone_health.png?v=1676718813',
    },
    {
      title: 'Cardiovascular Health',
      icon: 'https://cdn.shopify.com/s/files/1/0700/5339/6764/files/HEART_HEALTH.png?v=1676718816',
    },
    {
      title: 'Joint health',
      icon: 'https://cdn.shopify.com/s/files/1/0700/5339/6764/files/Joint_Health.png?v=1676718818',
    },
  ];
  
  console.log(content, "_html_");

  return (
    <div className="flex flex-row flex-wrap xl:justify-start justify-center gap-1 items-center">
      {/* <div
        className="product-desc"
        dangerouslySetInnerHTML={{__html: content}}
        style={{
          display: 'flex',
          flexWrap: 'wrap',
        }}
      /> */}
      {content &&
        usps_prduct.map((val, ind) => {
          return (
            <div
              key={ind + '#'}
              className="w-full sm:w-8/12 md:9/12 lg:w-5/12 mr-3 relative h-16 flex flex-row items-center justify-center mt-4"
            >
              <motion.div
                className="flex flex-row flex-wrap justify-end items-center rounded-full pr-4 w-full bg-[#6DA536] top-0 left-0 h-full origin-left"
                animate={{
                  scaleX: [0, 0.8, 1, 1],
                  opacity: [0, 0.5, 1, 1],
                }}
                transition={{
                  delay: ind * 0.8,
                  duration: 1,
                  ease: 'easeInOut',
                  repeat: 0,
                  times: [0, 0.3, 0.6, 1],
                }}
              >
                <div className="w-7/12 break-normal font-semibold text-white">
                  {val.title}
                </div>
              </motion.div>
              <motion.div
                className="w-16 h-full overflow-hidden rounded-full absolute bg-[#fff] top-0 left-0 text-center flex flex-col items-center justify-center"
                animate={{
                  scale: [1, 1.3, 1],
                  rotate: [0, 180, 0],
                }}
                transition={{
                  delay: ind * 0.8,
                  duration: 1,
                  ease: 'easeInOut',
                  repeat: 0,
                  times: [0, 0.5, 1],
                }}
              >
                <img src={val.icon} alt="BH" className="w-full" />
              </motion.div>
            </div>
          );
        })}
    </div>
  );
}

function ProductDetail({title, content, learnMore}) {
  return (
    <Disclosure key={title} as="div" className="grid w-full gap-2 p-2">
      {({open}) => (
        <>
          <Disclosure.Button className="text-left">
            <div className="flex justify-between">
              <Text size="lead" as="h4">
                {title}
              </Text>
              <IconClose
                className={clsx(
                  'transition-transform transform-gpu duration-200',
                  !open && 'rotate-[45deg]',
                )}
              />
            </div>
          </Disclosure.Button>

          <Disclosure.Panel className={'pb-4 pt-2 grid gap-2'}>
            <div
              className="prose dark:prose-invert"
              dangerouslySetInnerHTML={{__html: content}}
            />
            {learnMore && (
              <div className="">
                <Link
                  className="pb-px border-b border-primary/30 text-primary/50"
                  to={learnMore}
                >
                  Learn more
                </Link>
              </div>
            )}
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}

const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariantFragment on ProductVariant {
    id
    availableForSale
    selectedOptions {
      name
      value
    }
    image {
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    compareAtPrice {
      amount
      currencyCode
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
    metafield(namespace: "custom", key: "faq") {
      value
    }
    product {
      title
      handle
    }
  }
`;

const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $language: LanguageCode
    $handle: String!
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      id
      title
      vendor
      handle
      descriptionHtml
      description
      options {
        name
        values
      }
      selectedVariant: variantBySelectedOptions(selectedOptions: $selectedOptions) {
        ...ProductVariantFragment
      }
      media(first: 30) {
        nodes {
          ...Media
        }
      }
      variants(first: 10) {
        nodes {
          ...ProductVariantFragment
        }
      }
      faqs:metafield(namespace:"custom", key: "faq") {
        value
      }

      faqschema:metafield(namespace:"custom", key: "faqschemas") {
        value
      }

      whoShouldConsume:metafield(namespace:"custom", key: "who_should_consume") {
        value
      } 
      seeResults:metafield(namespace:"custom", key: "see_results") {
        value
      }
     
      step2:metafield(namespace:"custom", key: "step_02") {
        value
      }
      step1: metafield(namespace:"custom", key: "step_01") {
        value
      } 
      step3: metafield(namespace:"custom", key: "step_03") {
        value
      }
      step1img: metafield(namespace:"custom", key: "step_01_image_") {
        
      	reference{
          ... on MediaImage{
            image{
              id
              url
              altText
              height
              width
            }
          }
        }
      }
      step2img:metafield(namespace:"custom", key: "step_02_image_") {
        
      	reference{
          ... on MediaImage{
            image{
              id
              url
              altText
              height
              width
            }
          }
        }
      }
      step3img:metafield(namespace:"custom", key: "step_03_image_") {
        
      	reference{
          ... on MediaImage{
            image{
              id
              url
              altText
              height
              width
            }
          }
        }
      }
      desktopBanner:metafield(namespace:"custom", key: "desktop_banner_product_") { 
          references(first:100) {
          nodes {
            ... on MediaImage {
              id
              image {
                url
              }
            }
            ... on GenericFile {
              id
              url
            }
          }
        }
      }
      mobileBanner:metafield(namespace:"custom", key: "mobile_banner_product_") { 
        references(first:100) {
        nodes {
          ... on MediaImage {
            id
            image {
              url
            }
          }
          ... on GenericFile {
            id
            url
          }
        }
      }
    }
    benifitsOfProduct: metafield(namespace:"custom", key: "usps_of_the_product"){
      value
    }
    recommendedUsageShort: metafield(namespace:"custom", key: "recommended_usage_text_"){
      value
    }
    recommendedUsageLong: metafield(namespace:"custom", key: "recommended_usage_long_text_"){
      value
    }
    nutritionBackground: metafield(namespace:"custom", key: "nutrition_background") {
        
      	reference{
          ... on MediaImage{
            image{
              id
              url
              altText
              height
              width
            }
          }
        }
      }
    recommendedUsageImage: metafield(namespace:"custom", key: "recommended_usage_image_") {
      	reference{
          ... on MediaImage{
            image{
              id
              url
              altText
              height
              width
            }
          }
        }
      }
      eachServingOtherFood: metafield(namespace:"custom", key: "each_serving_v_s_other_food_") {
      	reference{
          ... on MediaImage{
            image{
              id
              url
              altText
              height
              width
            }
          }
        }
      }
      nutritionAndIngredients1Img: metafield(namespace:"custom", key: "nutrition_tabel_and_ingredients_01_image_") {
      	reference{
          ... on MediaImage{
            image{
              id
              url
              altText
              height
              width
            }
          }
        }
      }
      nutritionAndIngredients2Img: metafield(namespace:"custom", key: "nutrition_tabel_and_ingredients_02") {
      	reference{
          ... on MediaImage{
            image{
              id
              url
              altText
              height
              width
            }
          }
        }
      }
      seo {
        description
        title
      }
    }
    shop {
      name
      primaryDomain {
        url
      }
      shippingPolicy {
        body
        handle
      }
      refundPolicy {
        body
        handle
      }
    }
  }
  ${MEDIA_FRAGMENT}
  ${PRODUCT_VARIANT_FRAGMENT}
`;

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  query productRecommendations(
    $productId: ID!
    $count: Int
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    recommended: productRecommendations(productId: $productId) {
      ...ProductCard
    }
    additional: products(first: $count, sortKey: BEST_SELLING) {
      nodes {
        ...ProductCard
      }
    }
  }
  ${PRODUCT_CARD_FRAGMENT}
`;

async function getRecommendedProducts(storefront, productId) {
  const products = await storefront.query(RECOMMENDED_PRODUCTS_QUERY, {
    variables: {productId, count: 12},
  });

  invariant(products, 'No data returned from Shopify API');

  const mergedProducts = (products.recommended ?? [])
    .concat(products.additional.nodes)
    .filter(
      (value, index, array) =>
        array.findIndex((value2) => value2.id === value.id) === index,
    );

  const originalProduct = mergedProducts.findIndex(
    (item) => item.id === productId,
  );

  mergedProducts.splice(originalProduct, 1);

  return {nodes: mergedProducts};
}
