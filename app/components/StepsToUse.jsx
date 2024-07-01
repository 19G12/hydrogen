import React from "react";
import { Section } from "./Text";

export function StepsToUse({stepsToUse}){
    return(
        <Section className="banner-wrap">
          <div className="title-of-banner"> Steps to use </div>
          <div className="row-wise">
            {stepsToUse.map((vals, index) => {
              return (
                <>
                  {vals.image && vals.step ? (
                    <div className="steps" key={index}>
                      <img
                        className="step-img"
                        src={vals?.image}
                        alt={vals?.image?.reference?.image?.altText}
                      ></img>
                      <div
                        className="step-text"
                        dangerouslySetInnerHTML={{ __html: vals?.step }}
                      />
                    </div>
                  ) : (
                    <></>
                  )}
                </>
              );
            })}
          </div>
        </Section>
    )
}