import React from "react";
import { Section } from "./Text";

export function BenifitsOfProducts({benifitsOfProduct}){
    return(
        <Section className="banner-wrap">
          <div className="title-of-banner"> Benifits of product </div>
          <div
            className="benifits-of-product"
            dangerouslySetInnerHTML={{ __html: benifitsOfProduct.value }}
          />
        </Section>
    )
}