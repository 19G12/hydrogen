import { Section } from "./Text";

export function EachServing({eachServingOtherFood}){
    return(
        <Section className="banner-wrap">
          <div className="title-of-banner"> Each Serving V/S Other food </div>
          <div>
            <img
              src={eachServingOtherFood?.reference?.image?.url}
              alt={eachServingOtherFood?.reference?.image?.altText}
            />
          </div>
        </Section>
    )
}