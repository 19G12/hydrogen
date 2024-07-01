import { Section } from "./Text";

export function RecommendedValues({recommendedValues}){
    return(
        <Section className="banner-wrap">
            <div className="row-wise">
              <div className="recommended-usage-img">
                <img
                  src={recommendedValues?.image}
                  alt={recommendedValues?.alt}
                  className="image-in"
                ></img>
              </div>
              <div className="wrap-div">
                <h2 className="font-semibold text-2xl	p-20 text-center	">
                  {recommendedValues?.short}
                </h2>
                <div
                  className="inside-wrap-div"
                  dangerouslySetInnerHTML={{ __html: recommendedValues?.long }}
                />
              </div>
            </div>
          </Section>
    )
}